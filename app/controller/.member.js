module.exports = {
  "create": {
    "requestBody": ["xm", "xb", "sfzh", "password", "contact", "account"]
  },
  "update": {
    "query": ["_id"],
    "requestBody": ["contact.phone", "contact.email", "contact.qq", "contact.weixin", "contact.postcode", "contact.address"]
  },
  "bind": {
    "query": ["_id"],
    "requestBody": [
      "type", "account"
    ],
    "options": {
      "operation": 1
    },
    "service": "bind"
  },
  "unbind": {
    "query": ["_id"],
    "requestBody": [
      "type", "account"
    ],
    "options": {
      "operation": 0
    },
    "service": "bind"
  },
  "login": {
    "requestBody": ["username", "password"]
  },
  "passwd": {
    "query": ["_id"],
    "requestBody": ["oldpass", "newpass"]
  },
  "info": {
    "params": ["_id"]
  },
  "simple": {
    "params": ["_id"],
    "options": {
      "simple": true
    },
    "service": "info"
  },
}
