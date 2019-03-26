'use strict';
const Schema = require('mongoose').Schema;
const { Secret } = require('naf-framework-mongoose/lib/model/schema');
const metaPlugin = require('naf-framework-mongoose/lib/model/meta-plugin');

// 学籍信息
const InfoSchema = new Schema({
  xm: { type: String, required: true, maxLength: 64 }, // 姓名
  xb: { type: String, required: true, maxLength: 64 }, // 性别
  sfzh: { type: String, required: true, maxLength: 64 }, // 身份证号
  yxmc: { type: String, required: true, maxLength: 64 }, // 院校名称
  zymc: { type: String, required: false, maxLength: 64 }, // 专业名称
  xl: { type: String, required: false, maxLength: 64 }, // 学历
  yxdm: { type: String, required: false, maxLength: 64 }, // 院校代码
  zydm: { type: String, required: false, maxLength: 64 }, // 专业代码
  xldm: { type: String, required: false, maxLength: 64 }, // 学历代码
}, { _id: false, timestamps: true });
InfoSchema.index({ sfzh: 1 });

// 注册用户信息，多租户
const SchemaDefine = {
  year: { type: String, required: true, maxLength: 64 }, // 毕业年份
  type: { type: String, required: true, maxLength: 64 }, // 学籍类型：0-本专科；1-研究生；2-中专；3-省外
  status: { type: String, default: '0', maxLength: 64 }, // 用户状态: 0-正常；1-挂起；2-注销
  passwd: { type: Secret, select: false }, // 注册密码，保留字段
  baseid: { type: String, required: false, maxLength: 64 }, // 学籍数据ID
  info: InfoSchema,
  remark: { type: String, maxLength: 256 }, // 备注
};
const schema = new Schema(SchemaDefine, { 'multi-tenancy': true, toJSON: { virtuals: true } });
schema.index({ year: 1 });
schema.index({ baseid: 1 });
schema.index({ sfzh: 1 });
schema.index({ year: 1, 'info.sfzh': 1 });
schema.plugin(metaPlugin);

module.exports = app => {
  const { mongoose } = app;
  return mongoose.model('Register', schema, 'plat_user_register');
};
