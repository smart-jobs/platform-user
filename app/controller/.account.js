module.exports = {
  // 微信用户登录【全站】
  "login": {
    "parameters": {
      "query": ["!openid"],
    },
  },
  // 创建微信用户【全站】
  "create": {
    "parameters": {
      "query": ["!openid"],
    },
    "requestBody": ["!name", "!mobile", "!email"]
  },
  // 修改用户信息【全站】
  "update": {
    "parameters": {
      "query": ["!openid"],
    },
    "requestBody": [ "name", "mobile", "email", "userid", "baseid", "remark", "status"]
  },
  // 获取用户信息【全站】
  "fetch": {
    "parameters": {
      "query": ["!openid"],
    },
  },
  // 微信用户绑定分站注册信息【分站】
  "bind": {
    "parameters": {
      "query": ["!openid"],
    },
    "requestBody": ["year", "sfzh"]
  },
  // 微信用户解除绑定分站注册信息【分站】
  "unbind": {
    "parameters": {
      "query": ["!openid"],
    },
  },
};
