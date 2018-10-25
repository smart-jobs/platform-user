module.exports = {
  "delete": {
    "query": ["_id"]
  },
  "update": {
    "query": ["_id"],
    "requestBody": ["contact.phone", "contact.email", "contact.qq", "contact.weixin", "contact.postcode", "contact.address"]
  },
  "fetch": {
    "query": ["_id", "sfzh", "email", "mobile"]
  },
  "reset": {
    "query": ["_id"],
    "requestBody": ["mobile", "email", "openid"]
  },
  "unbind": {
    "query": ["_id"],
    "requestBody": ["mobile", "email", "openid"]
  }
}
