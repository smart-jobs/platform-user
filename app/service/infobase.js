'use strict';

const assert = require('assert');
const _ = require('lodash');
const { CrudService } = require('naf-framework-mongoose/lib/service');
const { BusinessError, ErrorCode } = require('naf-core').Error;
const { trimData } = require('naf-core').Util;

class InfobaseService extends CrudService {
  constructor(ctx) {
    super(ctx, 'plat_user_infobase');
    this.model = this.ctx.model.Infobase;
  }

  // 导入学籍数据
  async import({ year, type }, data) {
    assert(year, 'year不能为空');
    assert(type, 'type不能为空');
    assert(/^[0-2]$/.test(type), 'type值无效');

    const { sfzh, xm, yxdm } = data;
    assert(sfzh, 'sfzh不能为空');
    assert(yxdm, 'yxdm不能为空');
    assert(xm, 'xm不能为空');

    if (this.tenant !== 'master' && this.tenant !== 'yxdm') {
      throw new BusinessError(ErrorCode.SERVICE_FAULT, '导入数据的与所在院校信息不匹配');
    }

    data = _.omit(data, [ 'year', 'type', 'sfzh', 'yxdm' ]);
    // TODO: 更新或插入
    const doc = await this.model.findOneAndUpdate({ year, type, sfzh, yxdm }, trimData({ ...data, $setOnInsert: { year, type, sfzh, yxdm } }), { new: true, upsert: true }).exec();
    return doc;
  }
}

module.exports = InfobaseService;
