module.exports = {
  "delete": {
    "query": ["!id"]
  },
  "update": {
    "query": ["!id"],
    "requestBody": ["contact.phone", "contact.email", "contact.qq", "contact.weixin", "contact.postcode", "contact.address"]
  },
  "fetch": {
    "query": ["!id", "sfzh", "email", "mobile"]
  },
  "reset": {
    "query": ["!id"],
    "requestBody": ["mobile", "email", "openid"]
  },
  "unbind": {
    "query": ["!id"],
    "requestBody": ["mobile", "email", "openid"]
  },
  // 导入学籍
  "import": {
    "requestBody": ["mobile", "email", "openid"]
  },
}
