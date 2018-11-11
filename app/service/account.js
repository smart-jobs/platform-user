'use strict';

const assert = require('assert');
const { CrudService } = require('naf-framework-mongoose/lib/service');
const { BusinessError } = require('naf-core').Error;
const { UserError, ErrorMessage } = require('../util/error-code');

/**
 * 企业用户微信信息
 */
class AccountService extends CrudService {
  constructor(ctx) {
    super(ctx, 'plat_user_account');
    this.model = this.ctx.model.Weixin;
    this.mReg = this.ctx.model.Register;
  }

  // 用户微信登录，返回用户信息和学籍信息
  async login({ openid }) {
    assert(openid, 'openid不能为空');

    // TODO: 【全站服务】
    this.tenant = 'global';

    // TODO: 检查用户是否存在
    const user = await this.model.findOne({ openid }).exec();
    if (!user) throw new BusinessError(UserError.USER_NOT_EXIST, '用户不存在');

    // TODO: 查询绑定关系
    const reg = await this.ctx.model.Register.findOne({ openid }).exec(); // global 模式下必须用这种方式使用model
    return { user, reg };
  }

  // 注册用户通行证
  async create({ openid }, { name, mobile, email }) {
    assert(openid, 'openid不能为空');
    assert(name, '姓名不能为空');
    assert(mobile, '手机号不能为空');

    // TODO: 检查数据是否存在
    const doc = await this.model.findOne({ openid }).exec();
    if (doc) throw new BusinessError(UserError.ACCOUNT_EXISTED_WEIXIN, ErrorMessage.ACCOUNT_EXISTED_WEIXIN);

    // TODO:保存数据，初始记录只包含企业名称、email和密码
    const res = await this.model.create({ openid, name, mobile, email });
    return res;
  }

  // 微信用户绑定分站学籍注册信息
  async bind({ openid }, { year, sfzh }) {
    assert(openid, 'openid不能为空');
    assert(year, 'year不能为空');
    assert(sfzh, 'sfzh不能为空');

    // TODO: 检查用户是否存在
    const user = await this.model.findOne({ openid }).exec();
    if (!user) throw new BusinessError(UserError.USER_NOT_EXIST, '微信帐号不存在');

    // TODO: 检查帐号是否存在
    const reg = await this.mReg.findOne({ year, sfzh }).exec();
    if (!reg) throw new BusinessError(UserError.USER_NOT_EXIST, '学籍注册信息不存在');

    // TODO: 删除已有绑定关系
    const userid = reg.id;
    await this.model.updateMany({ userid }, { userid: null, baseid: null, 'meta.comment': '注册信息绑定其他帐号' }).exec();

    // TODO: 修改用户绑定信息
    user.userid = reg.id;
    user.baseid = reg.baseid;
    await user.save();

    return user;
  }

  // 微信用户绑定分站企业
  async unbind({ openid }) {
    assert(openid, 'openid不能为空');

    // TODO: 删除已有绑定关系
    await this.model.updateMany({ openid }, { userid: null, baseid: null, 'meta.comment': '解除绑定关系' }).exec();

    return 'unbind';
  }

}

module.exports = AccountService;
