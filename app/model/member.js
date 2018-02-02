'use strict';
const Schema = require('mongoose').Schema;
const { ObjectId } = Schema.Types;

// 注册用户信息
const SchemaDefine = {
  xm: { type: String, required: true, maxLength: 64 }, // 姓名
  xb: { type: String, required: true, maxLength: 64 }, // 性别
  sfzh: { type: String, required: true, maxLength: 64 }, // 身份证号
  status: { type: String, default: '0', maxLength: 64 }, // 用户状态: 0-正常；1-挂起；2-注销
  // 当前学籍
  enrollment: {
    id: ObjectId,
    year: String,
    type: String,
    yxdm: String,
    zydm: String,
  },
  // 所有学籍
  enrollments: [{
    id: ObjectId,
    year: String,
    type: String,
    yxdm: String,
    zydm: String,
    stauts: String,
  }],
  // 联系信息
  contact: {
    phone: { type: String, maxLength: 64 },
    email: { type: String, maxLength: 128 },
    qq: { type: String, maxLength: 128 },
    weixin: { type: String, maxLength: 128 },
    postcode: { type: String, maxLength: 128 },
    address: { type: String, maxLength: 128 },
  },
  // 登录信息
  account: {
    mobile: { type: String, require: true, maxLength: 64 },
    email: { type: String, maxLength: 128 },
    openid: { type: String, maxLength: 128 },
    credential: { type: String, require: true, maxLength: 128 },
  },
  meta: {
    createTime: {
      type: Date,
      default: Date.now()
    },
    updateTime: {
      type: Date,
      default: Date.now()
    },
    state: {// 数据删除状态
      type: Number,
      default: 0, // 0-正常学籍；1-标记删除
    },
    comment: String,
  }
};
const schema = new Schema(SchemaDefine);
schema.index({ sfzh: 1 }, { unique: true });
schema.index({ 'account.mobile': 1 }, { unique: true });
schema.index({ 'account.email': 1 }, { unique: true });
schema.index({ 'account.openid': 1 }, { unique: true });

module.exports = app => {
  const { mongoose } = app;
  return mongoose.model('Member', schema, 'plat_user_member');
};
