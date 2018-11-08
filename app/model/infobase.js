'use strict';

const Schema = require('mongoose').Schema;
const metaPlugin = require('naf-framework-mongoose/lib/model/meta-plugin');

// 学籍信息信息库
const SchemaDefine = {
  year: { type: String, required: true, maxLength: 64 }, // 毕业年份
  type: { type: String, required: true, maxLength: 64 }, // 学籍类型
  ksh: String, // 考生号
  sfzh: String, // 身份证号
  xm: String, // 姓名
  xb: String, // 性别
  xbdm: String, // 性别代码
  mz: String, // 民族
  mzdm: String, // 民族代码
  zzmmdm: String, // 政治面貌代码
  zzmm: String, // 政治面貌代码
  yxdm: String, // 院校代码
  yxmc: String, // 院校名称
  zydm: String, // 专业代码
  zymc: String, // 专业名称
  xldm: String, // 学历代码
  xl: String, // 学历
  syszddm: String, // 生源所在地代码
  syszd: String, // 生源所在地
  pyfsdm: String, // 培养方式代码
  pyfs: String, // 培养方式
  byrq: String, // 毕业日期
  rxsj: String, // 入学时间
  rxfsdm: String, // 入学方式代码
  rxfs: String, // 入学方式
  dxwpdw: String, // 定向委培单位
  zylb: String, // 专业类别
  sfslbdm: String, //	师范生类别代码
  sfslb: String, //	师范生类别
  knslbdm: String, //	困难生类别代码
  knslb: String, //	困难生类别
  cxsy: String, //	城乡生源
  szyx: String, // 所在院系
  szbj: String, // 所在班级
  xh: String, // 学号
  bz: String, // 备注
};
const schema = new Schema(SchemaDefine);
schema.index({ year: 1 });
schema.index({ yxdm: 1 });
schema.index({ sfzh: 1 });
schema.index({ year: 1, type: 1 });
schema.index({ year: 1, sfzh: 1 }, { unique: true });
schema.index({ year: 1, yxdm: 1 });
schema.index({ year: 1, type: 1, sfzh: 1 });
schema.index({ year: 1, type: 1, yxdm: 1 });
schema.index({ year: 1, yxdm: 1, sfzh: 1 });
schema.index({ year: 1, type: 1, yxdm: 1, sfzh: 1 });
schema.plugin(metaPlugin);

module.exports = app => {
  const { mongoose } = app;
  return mongoose.model('Enrollment', schema, 'plat_user_infobase');
};
