'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // 用户注册
  router.post('/member/create', controller.member.create);
  router.post('/member/update', controller.member.update);
  router.post('/member/passwd', controller.member.passwd);
  router.post('/member/rebind', controller.member.rebind);
  router.get('/member/fetch', controller.member.fetch);
};
