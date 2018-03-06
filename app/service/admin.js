'use strict';

// const ObjectID = require('mongodb').ObjectID;
// const assert = require('assert');
// const { BusinessError, ErrorCode } = require('naf-core').Error;
// const { isNullOrUndefined } = require('naf-core').Util;
const { CrudService } = require('naf-framework-mongoose').Services;
// const { MembershipStatus, RegisterStatus } = require('../util/constants');

class AdminService extends CrudService {
  constructor(ctx) {
    super(ctx, 'plat_corp_register');
    this.mMem = this._model(ctx.model.Member);
    this.mEnroll = this._model(ctx.model.Enrollment);
    this.model = this.mMem.model;
  }

}

module.exports = AdminService;
