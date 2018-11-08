'use strict';

const meta = require('./.infobase.js');
const { Controller } = require('egg');
const { CrudController } = require('naf-framework-mongoose/lib/controller');

class InfobaseController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.service = this.ctx.service.infobase;
  }

  async import() {
    const res = await this.service.import(this.ctx.query, this.ctx.request.body);
    this.ctx.ok({ id: res.id });
  }
}

module.exports = CrudController(InfobaseController, meta);
