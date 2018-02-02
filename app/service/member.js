'use strict';

const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
const is = require('is-type-of');
const { BusinessError, ErrorCode } = require('naf-core').Error;
const { trimData } = require('naf-core').Util;
const BaseService = require('./base.js');
const { UserError, ErrorMessage, AccountError } = require('../util/error-code');


class MembershipService extends BaseService {
  constructor(ctx) {
    super(ctx, 'plat_user_member');
    this.model = ctx.model.Member;
  }

  async create({ xm, xb, sfzh, account, contact }) {
    assert(xm);
    assert(xb);
    assert(sfzh);
    assert(is.object(account));
    assert(is.object(contact));
    assert(account.mobile);
    assert(account.credential);

    const { mobile, email, credential } = account;
    if (!contact.phone) contact.phone = mobile;
    if (!contact.email) contact.email = email;

    // TODO:检查数据是否存在
    const entity = await this.model.findOne({ sfzh }).exec();
    if (!is.nullOrUndefined(entity)) throw new BusinessError(UserError.USER_EXISTED, ErrorMessage.USER_EXISTED);

    // TODO: 检查绑定账户是否存在
    const acc = [ 'openid', 'email', 'mobile' ]
      .filter(f => !is.nullOrUndefined(account[f]));
    assert(acc.length > 0, 'account字段必须包含至少一个有效信息');
    acc.forEach(async f => { await this.checkAccount(f, account[f]); });

    // TODO:保存数据，初始记录不包含微信绑定信息
    const res = await this._create({ xm, xb, sfzh, contact, account: { mobile, email, credential } });
    return res;
  }

  async checkAccount(key, val) {
    const entity = await this.model.findOne({ [key]: val }).exec();
    if (entity) throw new BusinessError(AccountError[key].errcode, AccountError[key].errmsg);
    return true;
  }

  // 修改绑定信息
  async rebind({ _id }, { mobile, email, openid }) {
    assert(_id);
    assert(mobile || email || openid);

    // TODO:检查数据是否存在
    const entity = await this.model.findById(ObjectID(_id)).exec();
    if (is.nullOrUndefined(entity)) throw new BusinessError(UserError.USER_NOT_EXIST, ErrorMessage.USER_NOT_EXIST);
    const { account } = entity;
    assert(account);

    // 修改或者删除账户绑定信息
    const data = trimData({ mobile, email, openid });
    Object.keys(data).forEach(key => {
      if (account[key] && data[key] === '@unbind') {
        delete account[key];
      } else {
        account[key] = data[key];
      }
    });
    if (is.nullOrUndefined(account.mobile) && is.nullOrUndefined(account.email)) {
      throw new BusinessError(AccountError.empty.errcode, AccountError.empty.errmsg);
    }
    return await this.model.findByIdAndUpdate(ObjectID(_id), { $set: { account } }, { new: true }).exec();
  }

  // 修改账户密码
  async passwd({ _id }, { oldpass, newpass }) {
    assert(_id);
    assert(oldpass);
    assert(newpass);

    // TODO:检查数据是否存在
    const entity = await this.model.findById(ObjectID(_id)).exec();
    if (is.nullOrUndefined(entity)) throw new BusinessError(UserError.USER_NOT_EXIST, ErrorMessage.USER_NOT_EXIST);
    const { account } = entity;
    assert(account);

    // 校验口令信息
    if (oldpass !== account.credential) {
      throw new BusinessError(AccountError.errcode, AccountError.errmsg);
    }

    // 保存修改
    await this.model.findByIdAndUpdate(ObjectID(_id), { $set: { 'account.credential': newpass } }, { new: true }).exec();

    return 'updated';
  }

  // 查询信息
  async fetch({ _id, sfzh, mobile, email, openid }) {
    console.log(_id);
    assert(_id || sfzh || mobile || email || openid);

    // TODO:检查数据是否存在
    let res;
    if (_id) {
      res = await this.model.findById(ObjectID(_id)).exec();
    } else if (sfzh) {
      res = await this.model.findOne({ sfzh }).exec();
    } else {
      const acc = { mobile, email, openid };
      const filters = Object.keys(acc).map(key => ({ [key]: acc[key] }));
      res = await this.model.findOne().or(filters).exec();
    }

    return res;
  }

}

module.exports = MembershipService;
