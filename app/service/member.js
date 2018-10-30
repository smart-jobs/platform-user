'use strict';

const assert = require('assert');
const _ = require('lodash');
const { trimData, isNullOrUndefined } = require('naf-core').Util;
const { BusinessError, ErrorCode } = require('naf-core').Error;
const BaseService = require('./base.js');
const { UserError, ErrorMessage, AccountError } = require('../util/error-code');
const { OperationType, BindStatus, MembershipStatus } = require('../util/constants');


class MembershipService extends BaseService {
  constructor(ctx) {
    super(ctx, 'plat_user_member');
    this.model = this.ctx.model.Member;
    this.mMem = this.model;
    this.mEnrl = this.ctx.model.Enrollment;
  }

  async create({ xm, xb, sfzh, password, contact, account }) {
    assert(xm, 'xm不能为空');
    assert(xb, 'xb性别不能为空');
    // assert(sfzh, 'sfzh不能为空');
    assert(password, 'password不能为空');
    assert(_.isObject(contact), 'contact必须为对象');
    assert(_.isObject(account) || _.isString(account), 'account必须为对象或字符串');

    let type = 'weixin';
    if (_.isObject(account)) {
      ({ type = 'weixin', account } = account);
      assert(account, 'account参数必须包含account属性');
    } else if (_.isString(account)) {
      assert(account, 'account不能为空');
    }

    // // TODO:检查数据是否存在
    // const entity = await this.model.findOne({ sfzh }).exec();
    const entity = await this.fetchByAccount({ type, account });
    if (!isNullOrUndefined(entity)) throw new BusinessError(UserError.USER_EXISTED, ErrorMessage.USER_EXISTED);

    // TODO:保存数据，初始记录不包含微信绑定信息
    const res = await this.mMem.create({ xm, xb, sfzh, contact, status: MembershipStatus.NORMAL,
      accounts: [{ type, account, bind: BindStatus.BIND }],
      passwd: { type: 'plain', secret: password },
    });
    return res;
  }

  async update({ id }, data) {
    assert(id, 'id不能为空');

    // TODO:检查数据是否存在
    const entity = await this.mMem.findById(id).exec();
    if (isNullOrUndefined(entity)) throw new BusinessError(ErrorCode.DATA_NOT_EXIST);

    // TODO: 修改数据
    entity.set(trimData(data));
    await entity.save();
    return entity;
  }

  // 帐号绑定
  async bind(params) {
    // console.log(params);
    const { id, type, account, operation } = params;
    assert(id, 'id不能为空');
    assert(type, 'type不能为空');
    assert(!isNullOrUndefined(operation), 'operation不能为空');
    assert(operation === OperationType.UNBIND || account, 'account不能为空');

    // TODO:检查数据是否存在
    const entity = await this.mMem.findById(id).exec();
    if (isNullOrUndefined(entity)) throw new BusinessError(UserError.USER_NOT_EXIST, ErrorMessage.USER_NOT_EXIST);

    // 保存修改
    const item = entity.accounts.find(p => p.type === type);
    if (item) {
      if (operation === OperationType.BIND) {
        entity.accounts.id(item._id).remove();
      } else if (operation === OperationType.UNBIND) {
        item.bind = BindStatus.UNBIND;
      } else if (operation === OperationType.VERIFY) {
        item.bind = BindStatus.BIND;
      }
    }
    if (operation === OperationType.BIND) {
      entity.accounts.push({ type, account, bind: BindStatus.NEW });
    }

    await entity.save();

    return 'updated';
  }

  // 登录验证，成功返回注册信息
  async login({ id, username, password }) {
    if (!id) {
      assert(username, 'username不能为空');
    }
    assert(password, 'password不能为空');

    // TODO:检查数据是否存在
    // 查询已注册用户
    // const entity = await this.mMem.findOne({ sfzh: username }).exec();
    let entity;
    if (id) {
      entity = await this.mMem.findById(id, '+passwd').exec();
    } else {
      entity = await this.fetchByAccount({ type: 'weixin', account: username });
    }
    if (isNullOrUndefined(entity)) {
      throw new BusinessError(ErrorCode.USER_NOT_EXIST);
    }

    if (!id) {
      // fetchByAccount结果不包含passwd
      entity = await this.mMem.findById(entity._id, '+passwd').exec();
    }

    // 校验口令信息
    if (entity.passwd && password !== entity.passwd.secret) throw new BusinessError(ErrorCode.BAD_PASSWORD);
    return trimData(entity.toObject(), [ 'accounts', 'meta' ]);
  }

  // 修改账户密码
  async passwd({ id, oldpass, newpass }) {
    assert(id, 'id不能为空');
    assert(oldpass, 'oldpass不能为空');
    assert(newpass, 'newpass不能为空');

    // TODO:检查数据是否存在
    const entity = await this.mMem.findById(id, '+passwd').exec();
    if (isNullOrUndefined(entity)) throw new BusinessError(UserError.USER_NOT_EXIST, ErrorMessage.USER_NOT_EXIST);

    // 校验口令信息
    if (entity.passwd && oldpass !== entity.passwd.secret) {
      throw new BusinessError(AccountError.oldpass.errcode, AccountError.oldpass.errmsg);
    }

    // 保存修改
    if (entity.passwd) {
      entity.passwd.secret = newpass;
    } else {
      entity.passwd = { type: 'plain', secret: newpass };
    }
    await entity.save();

    return 'updated';
  }

  // 检查绑定帐号是否存在
  async fetchByAccount({ type, account }) {
    assert(account, 'account不能为空');

    const entity = this.mMem.findOne({ accounts: { $elemMatch: trimData({ type, account, bind: BindStatus.BIND }) } }).exec();
    return entity;
  }

  // 获取用户信息
  async info({ id, simple }) {
    assert(id, 'id不能为空');

    const entity = await this.mMem.findById(id,
      simple ?
        { xm: 1, xb: 1, 'enrollment.year': 1, 'enrollment.yxdm': 1, 'enrollment.zydm': 1, }
        : { xm: 1, xb: 1, contact: 1, enrollment: 1 }).exec();
    if (entity) {
      const res = entity.toObject();
      return { name: res.xm, xb: res.xb, ...res.enrollment, ...res.contact };
    }
    return entity;
  }

  // 绑定学籍
  async enroll({ id }, { year, type, yxdm, sfzh }) {
    assert(id, 'id不能为空');

    // TODO:检查数据是否存在
    const entity = await this.mMem.findById(id).exec();
    if (isNullOrUndefined(entity)) throw new BusinessError(ErrorCode.DATA_NOT_EXIST);

    // TODO:检查学籍数据
    const enrollment = await this.mEnrl.findOne({ year, type, yxdm, sfzh }).exec();
    if (isNullOrUndefined(enrollment)) throw new BusinessError(ErrorCode.DATA_NOT_EXIST, '学籍信息不存在');
    if (enrollment.xm !== entity.xm) throw new BusinessError(ErrorCode.SERVICE_FAULT, '学籍信息和注册信息不匹配');

    const { id: enrl_id, xm, enrollment: { zydm } } = enrollment;
    // TODO: 修改注册数据
    entity.enrollment = { id: enrl_id, year, type, xm, sfzh, yxdm, zydm };
    await entity.save();
    // TODO: 修改学籍数据
    enrollment.mshp = { id };
    await enrollment.save();

    return entity;
  }
}

module.exports = MembershipService;
