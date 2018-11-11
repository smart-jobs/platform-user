module.exports = {
  // 学生登记注册
  "register": {
    "parameters": {
      "query": ["!openid"],
    },
    "requestBody": ["!year", "!sfzh", "xm", "xb", "yxmc", "zymc", "xl"]
  },
  "query": {
    "parameters": {
      "query": ["status", "corpname"],
    },
    "options": {
      "projection": "corpname status info contact meta",
      "count": true,
    },
  },
  "fetch": {
    "parameters": {
      "params": ["!id"],
    },
  },
  "update": {
    "parameters": {
      "params": ["!id"],
    },
    "requestBody": [ "sfzh", "xm", "xb", "yxmc", "zymc", "xl", "status"]
  },
  "info": {
    "parameters": {
      "params": ["id"],
      "query": ["id"],
    },
    "service": "info",
  },
  "simple": {
    "parameters": {
      "params": ["id"],
      "query": ["id"],
      "options": {
        "simple": true
      },
    },
    "service": "info",
  },
};
