'use strict';

const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
const { isNullOrUndefined } = require('naf-core').Util;
const { BusinessError } = require('naf-core').Error;
const { CrudService } = require('naf-framework-mongoose').Services;
const { UserError, ErrorMessage } = require('../util/error-code');

class BaseService extends CrudService {

  // 删除注册信息（标记删除状态，不执行真正删除操作）
  async delete({ id }) {
    assert(id);

    // TODO:检查数据是否存在
    const entity = await this.model.findOne({ _id: ObjectID(id) }).exec();
    if (isNullOrUndefined(entity)) throw new BusinessError(UserError.USER_NOT_EXIST, ErrorMessage.USER_NOT_EXIST);

    // TODO:修改数据删除状态，不直接删除
    await this.model.fondOneAndUpdate({ _id: ObjectID(id) },
      { $set: { 'meta.state': 1, 'meta.updateTime': new Date(), 'meta.comment': '删除数据' } }).exec();

    return 'deleted';
  }

}

module.exports = BaseService;
