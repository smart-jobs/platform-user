'use strict';
const Schema = require('mongoose').Schema;
const { ObjectId } = Schema.Types;

// 代码
const _codeSchema = new Schema({
  code: { type: String, required: true, maxLength: 64 },
  name: String,
}, { _id: false });

// 绑定账号
const accountSchema = new Schema({
  // 帐号类型：qq、weixin、email、mobile、weibo等
  type: { type: String, required: true, maxLength: 64 },
  // 账号绑定ID
  account: { type: String, required: true, maxLength: 128 },
  // 绑定状态: 0-未验证、1-已绑定、2-解除绑定
  bind: { type: String, required: true, maxLength: 64, default: '0' },
}, { timestamps: true });
accountSchema.index({ type: 1, account: 1 });

// 注册用户信息
const SchemaDefine = {
  xm: { type: String, required: true, maxLength: 64 }, // 姓名
  xb: { type: String, required: true, maxLength: 64 }, // 性别
  status: { type: String, default: '0', maxLength: 64 }, // 用户状态: 0-正常；1-挂起；2-注销
  password: { type: String, require: true, maxLength: 128 },
  // 联系信息
  contact: {
    phone: { type: String, maxLength: 64 },
    email: { type: String, maxLength: 128 },
    qq: { type: String, maxLength: 128 },
    weixin: { type: String, maxLength: 128 },
    postcode: { type: String, maxLength: 128 },
    address: { type: String, maxLength: 128 },
  },
  // 绑定账号信息
  accounts: {
    type: [ accountSchema ],
    default: [],
  },
  // 当前学籍
  enrollment: {
    id: ObjectId,
    year: String, // 毕业年份
    type: String, // 学历类型：0-本专科；1-研究生；2-中专
    xm: String, // 姓名
    sfzh: String, // 身份证号
    yxdm: String,
    zydm: String,
  },
  // 所有学籍
  enrollments: [{
    id: ObjectId,
    year: String,
    type: String,
    xm: String, // 姓名
    sfzh: String, // 身份证号
    yxdm: String,
    zydm: String,
    stauts: String,
  }],
  meta: {
    state: {// 数据删除状态
      type: Number,
      default: 0, // 0-正常数据；1-标记删除
    },
    comment: String,
  }
};
const schema = new Schema(SchemaDefine, { timestamps: { createdAt: 'meta.createdAt', updatedAt: 'meta.updatedAt' } });
schema.index({ 'enrollment.sfzh': 1 });
schema.index({ 'accounts.account': 1 });
schema.index({ 'accounts.type': 1, 'accounts.account': 1 });

module.exports = app => {
  const { mongoose } = app;
  return mongoose.model('Member', schema, 'plat_user_member');
};
