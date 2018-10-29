module.exports = {
  "create": {
    "requestBody": ["xm", "xb", "sfzh", "password", "contact", "account"]
  },
  "update": {
    "query": ["id"],
    "requestBody": ["contact.mobile", "contact.email", "contact.qq", "contact.weixin", "contact.postcode", "contact.address"]
  },
  "enroll": {
    "query": ["id"],
    "requestBody": ["year", "type", "yxdm", "sfzh"]
  },
  "bind": {
    "query": ["id"],
    "requestBody": [
      "type", "account"
    ],
    "options": {
      "operation": 1
    },
    "service": "bind"
  },
  "unbind": {
    "query": ["id"],
    "requestBody": [
      "type", "account"
    ],
    "options": {
      "operation": 0
    },
    "service": "bind"
  },
  "login": {
    "query": ["id"],
    "requestBody": ["username", "password"]
  },
  "passwd": {
    "query": ["id"],
    "requestBody": ["oldpass", "newpass"]
  },
  "info": {
    "query": ["id"]
  },
  "simple": {
    "query": ["id"],
    "options": {
      "simple": true
    },
    "service": "info"
  },
  "fetchByAccount": {
    "query": [ "type", "account" ],
  },
}
