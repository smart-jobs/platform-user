'use strict';

// const ObjectId = require('mongoose').Types;
// const assert = require('assert');
// const { BusinessError, ErrorCode } = require('naf-core').Error;
// const { isNullOrUndefined } = require('naf-core').Util;
const { CrudService } = require('naf-framework-mongoose/lib/service');
// const { MembershipStatus, RegisterStatus } = require('../util/constants');

class AdminService extends CrudService {
  constructor(ctx) {
    super(ctx, 'plat_user_register');
    this.mMem = this.ctx.model.Member;
    this.mEnroll = this.ctx.model.Enrollment;
    this.model = this.mMem;
  }

}

module.exports = AdminService;
