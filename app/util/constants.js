'use strict';

exports.MembershipStatus = {
  NORMAL: '0', // 正常用户状态
  SUSPEND: '1', // 挂起
  REVOKE: '2', // 用户备注销
};
exports.OperationType = {
  UNBIND: '0', // 解除绑定
  BIND: '1', // 执行绑定
  VERIFY: '2', // 验证账号
};
exports.BindStatus = {
  NEW: '0', // 新绑定请求，未验证生效
  BIND: '1', // 已生效绑定
  UNBIND: '2', // 解除绑定状态
};
