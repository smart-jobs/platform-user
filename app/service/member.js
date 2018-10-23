'use strict';

const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
const _ = require('lodash');
const { trimData, isNullOrUndefined } = require('naf-core').Util;
const { BusinessError, ErrorCode } = require('naf-core').Error;
const { isObject } = require('lodash');
const BaseService = require('./base.js');
const { UserError, ErrorMessage, AccountError } = require('../util/error-code');
const { OperationType, BindStatus, MembershipStatus } = require('../util/constants');


class MembershipService extends BaseService {
  constructor(ctx) {
    super(ctx, 'plat_user_member');
    this.model = this.ctx.model.Member;
    this.mMem = this.model;
  }

  async create({ xm, xb, sfzh, password, contact, account }) {
    assert(xm, 'xm不能为空');
    assert(xb, 'xb性别不能为空');
    // assert(sfzh, 'sfzh不能为空');
    assert(password, 'password不能为空');
    assert(isObject(contact), 'contact必须为对象');
    assert(_.isObject(account) || _.isString(account), 'account必须为对象或字符串');

    let type = 'weixin';
    if (_.isObject(account)) {
      ({ type = 'weixin', account } = account);
      assert(isObject(account), 'account参数必须包含account属性');
    } else if (_.isString(account)) {
      assert(account, 'account不能为空');
    }

    // // TODO:检查数据是否存在
    // const entity = await this.model.findOne({ sfzh }).exec();
    const entity = await this.fetchByAccount({ type, account });
    if (!isNullOrUndefined(entity)) throw new BusinessError(UserError.USER_EXISTED, ErrorMessage.USER_EXISTED);

    // TODO:保存数据，初始记录不包含微信绑定信息
    const res = await this.mMem.create({ xm, xb, sfzh, password, contact, status: MembershipStatus.NORMAL,
      accounts: [{ type, account, bind: BindStatus.BIND }] });
    return res;
  }

  async update({ _id }, data) {
    assert(_id, '_id不能为空');

    // TODO:检查数据是否存在
    const entity = await this.mMem.findOne({ _id: ObjectID(_id) }).exec();
    if (isNullOrUndefined(entity)) throw new BusinessError(ErrorCode.DATA_NOT_EXIST);

    // TODO: 修改数据
    entity.set(trimData(data));
    await entity.save();
    return await this.model.findOne({ _id: ObjectID(_id) }, { password: 0 }).exec();
  }

  // 帐号绑定
  async bind(params) {
    // console.log(params);
    let { _id, type, account, operation } = params;
    assert(_id, '_id不能为空');
    assert(type, 'type不能为空');
    assert(!isNullOrUndefined(operation), 'operation不能为空');
    assert(operation === OperationType.UNBIND || account, 'account不能为空');

    _id = ObjectID(_id);
    // TODO:检查数据是否存在
    const entity = await this.mMem.findById(_id).exec();
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
  async login({ username, password }) {
    assert(username, 'username不能为空');
    assert(password, 'password不能为空');

    // TODO:检查数据是否存在
    // 查询已注册用户
    // const entity = await this.mMem.findOne({ sfzh: username }).exec();
    const entity = await this.fetchByAccount({ type: 'weixin', account: username });
    if (isNullOrUndefined(entity)) {
      throw new BusinessError(ErrorCode.USER_NOT_EXIST);
    }

    // 校验口令信息
    if (password !== entity.password) throw new BusinessError(ErrorCode.BAD_PASSWORD);
    return trimData(entity.toObject(), [ 'password', 'accounts', 'meta' ]);
  }

  // 修改账户密码
  async passwd({ _id, oldpass, newpass }) {
    assert(_id, '_id不能为空');
    assert(oldpass, 'oldpass不能为空');
    assert(newpass, 'newpass不能为空');

    _id = ObjectID(_id);
    // TODO:检查数据是否存在
    const entity = await this.mMem.findById(_id).exec();
    if (isNullOrUndefined(entity)) throw new BusinessError(UserError.USER_NOT_EXIST, ErrorMessage.USER_NOT_EXIST);

    // 校验口令信息
    if (oldpass !== entity.password) {
      throw new BusinessError(AccountError.oldpass.errcode, AccountError.oldpass.errmsg);
    }

    // 保存修改
    await this.mMem.findOneAndUpdate({ _id }, { password: newpass }).exec();

    return 'updated';
  }

  // 检查绑定帐号是否存在
  async fetchByAccount({ type, account }) {
    assert(account, 'account不能为空');

    const entity = this.mMem.findOne({ accounts: { $elemMatch: trimData({ type, account, bind: BindStatus.BIND }) } }, { password: 0 }).exec();
    return entity;
  }
}

module.exports = MembershipService;
