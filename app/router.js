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
  router.post('/api/acct/bind', controller.account.bind); // 【分站】微信用户绑定学籍
  router.post('/api/acct/unbind', controller.account.unbind); // 【分站】微信用户解绑学籍
  router.get('/api/acct/fetch', controller.account.fetch); // 【分站】获得账号信息
  router.get('/api/acct/info', controller.account.fetch); // 【分站】获得用户信息
  router.post('/api/register', controller.register.register); // 【分站】省内学生注册学籍
  router.post('/api/:id/update', controller.register.update); // 【分站】修改信息
  router.get('/api/:id/fetch', controller.register.fetch); // 【分站】获得注册信息
  router.get('/api/info', controller.register.info); // 【全站】获得用户信息详情
  router.get('/api/simple', controller.register.simple); // 【全站】获得用户信息
  router.all('/api/login', controller.account.login); // 【全站】用户微信登录
  router.get('/api/base/find', controller.infobase.findBySfzh); // 【全站】通过身份证号查询学籍信息

  // 管理接口
  router.post('/admin/base/import', controller.infobase.import); // 【分站】导入学籍数据
};
