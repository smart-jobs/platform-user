'use strict';

const assert = require('assert');
const _ = require('lodash');
const { BusinessError } = require('naf-core').Error;
const { isNullOrUndefined } = require('naf-core').Util;
const { CrudService } = require('naf-framework-mongoose/lib/service');
const { UserError, ErrorMessage } = require('../util/error-code');

class RegisterService extends CrudService {
  constructor(ctx) {
    super(ctx, 'plat_user_register');
    this.model = this.ctx.model.Register;
    this.mReg = this.ctx.model.Register;
    this.mBind = this.ctx.model.Account;
    this.mInfo = this.ctx.model.Infobase;
  }

  async register({ openid }, data) {
    // 【用户】省外学生登记学籍
    if (this.tenant === 'master') {
      return await this.registerOther({ openid }, data);
    }

    // 【用户】省内学生登记学籍
    const { year, sfzh } = data;
    assert(openid, 'openid不能为空');
    assert(year, 'year不能为空');
    assert(sfzh, 'sfzh不能为空');

    // TODO: 检查用户是否存在
    const bind = await this.mBind.findOne({ openid }).exec();
    if (!bind) {
      throw new BusinessError(UserError.USER_NOT_EXIST, ErrorMessage.USER_NOT_EXIST);
    }

    // TODO: 检查是否已注册
    let reg = await this.model.findOne({ year, sfzh }).exec();
    if (reg) {
      throw new BusinessError(UserError.REG_EXISTED, ErrorMessage.REG_EXISTED);
    }

    // TODO: 检查学籍信息
    const info = await this.mInfo.findOne({ year, sfzh });
    if (isNullOrUndefined(info)) {
      throw new BusinessError(UserError.INFO_NOT_EXIST, ErrorMessage.INFO_NOT_EXIST);
    }
    if (bind.name !== info.xm) {
      throw new BusinessError(UserError.INFO_NOT_MATCH, ErrorMessage.INFO_NOT_MATCH);
    }

    // TODO: 创建数据
    const { xm, xb, yxmc, zymc, xl } = info;
    reg = await this.model.create({
      year, type: info.type, baseid: info.id,
      info: { xm, xb, sfzh, yxmc, zymc, xl }
    });

    // TODO: 保存绑定关系
    bind.userid = reg.id;
    bind.baseid = info.id;
    await bind.save();

    return reg;
  }

  // 【用户】省外学生创建注册信息
  async registerOther({ openid }, { year, sfzh, xm, xb, yxmc, zymc, xl }) {
    assert(openid, 'openid不能为空');
    assert(year, 'year不能为空');
    assert(sfzh, 'sfzh不能为空');
    assert(yxmc, 'yxmc不能为空');
    assert(zymc, 'zymc不能为空');
    assert(xl, 'xl不能为空');
    assert(xm, 'xm不能为空');
    assert(xb, 'xb不能为空');

    // TODO: 检查用户是否存在
    const bind = await this.mBind.findOne({ openid }).exec();
    if (!bind) {
      throw new BusinessError(UserError.USER_NOT_EXIST, ErrorMessage.USER_NOT_EXIST);
    }

    // TODO: 省外学生信息注册到主站
    const model = this.app.tenantModel('master').Register;
    // TODO: 检查是否已注册
    let reg = await model.findOne({ year, sfzh }).exec();
    if (reg) {
      throw new BusinessError(UserError.REG_EXISTED, '身份证号已被注册');
    }

    // TODO: 创建数据
    reg = await model.create({
      year, type: '3',
      info: { xm, xb, sfzh, yxmc, zymc, xl }
    });

    // TODO: 保存绑定关系
    bind.userid = reg.id;
    bind.baseid = null;
    await bind.save();

    return reg;
  }

  // 获取用户信息
  async info({ id, simple }) {
    assert(id, 'id不能为空');

    // 全站查询
    this.tenant = 'global';
    const model = this.ctx.model.Register; // global 模式下必须用这种方式使用model
    const entity = await model.findById(id).exec();
    if (entity) {
      let res = entity.toObject();
      res = { id: res.id || res._id, year: res.year, type: res.type, ...res.info };
      if (!simple) {
        const enrollment = await this.mInfo.findById(entity.baseid);
        res = { ...res, enrollment };
      }
      return res;
    }
    return null;
  }
}

module.exports = RegisterService;
