'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'smart jobs platform user service';
  }
}

module.exports = HomeController;
