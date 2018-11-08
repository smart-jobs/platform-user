'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  // 前端接口
  router.post('/api/acct/create', controller.account.create); // 【全站】创建微信用户
  router.post('/api/acct/update', controller.account.update); // 【全站】修改用户信息
  router.post('/api/acct/bind', controller.account.bind); // 【分站】微信用户绑定企业
  router.post('/api/acct/unbind', controller.account.unbind); // 【分站】微信用户解绑企业
  router.get('/api/acct/fetch', controller.account.fetch); // 【分站】获得账号信息
  router.get('/api/acct/info', controller.account.fetch); // 【分站】获得用户信息
  router.post('/api/register', controller.register.register); // 【分站】省内学生注册学籍
  router.post('/api/create', controller.register.create); // 【主站】省外学生创建注册信息
  router.post('/api/:id/update', controller.register.update); // 【分站】修改信息
  router.get('/api/:id/fetch', controller.register.fetch); // 【分站】获得注册信息
  router.get('/api/info', controller.register.info); // 【全站】获得用户信息详情
  router.get('/api/simple', controller.register.simple); // 【全站】获得用户信息
};
