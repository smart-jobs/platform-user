'use strict';

const BaseService = require('./base.js');

class EnrollmentService extends BaseService {
  constructor(ctx) {
    super(ctx, 'plat_user_entrollment');
    this.model = this.ctx.model.Enrollment;
    this.mMember = this.ctx.model.Member;
  }

  // async create() {

  // }

  // async query({ skip, limit, order } = {}, data = {}) {
  //   // const rs = await this._find(trimData(data), null, trimData({ skip, limit, sort: order && { [order]: 1 } }));
  //   const rs = await this.model.find({}, null, {}).exec();
  //   return rs;
  // }

}

module.exports = EnrollmentService;
