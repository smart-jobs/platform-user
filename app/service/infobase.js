'use strict';

const assert = require('assert');
const _ = require('lodash');
const { CrudService } = require('naf-framework-mongoose/lib/service');
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

    const { sfzh, ksh, xm } = data;
    assert(sfzh, 'sfzh不能为空');
    assert(ksh, 'ksh不能为空');
    assert(xm, 'xm不能为空');

    data = _.omit(data, [ 'year', 'type', 'ksh' ]);
    // TODO: 更新或插入
    const doc = await this.model.findOneAndUpdate({ year, type, ksh }, trimData({ ...data, $setOnInsert: { year, type, ksh } }), { new: true, upsert: true }).exec();
    return doc;
  }
}

module.exports = InfobaseService;
