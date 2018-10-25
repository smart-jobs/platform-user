'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // 用户注册
  router.post('/api/login', controller.member.login);
  router.post('/api/passwd', controller.member.passwd);
  router.post('/api/register/create', controller.member.create);
  router.post('/api/register/update', controller.member.update);
  router.post('/api/account/bind', controller.member.bind);
  router.post('/api/account/unbind', controller.member.unbind);
  router.post('/api/account/check', controller.member.checkAccount);
  router.get('/api/info', controller.member.info);
  router.get('/api/simple', controller.member.simple);

  // 用户管理
};
