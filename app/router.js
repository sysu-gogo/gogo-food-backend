'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const authorize = app.middleware.auth({ type: 'authorize' });
  // const no_authorize = app.middleware.auth({ type: 'no-authorize' });
  const only_admin = app.middleware.auth({ type: 'authorize', role: [ 'Admin' ] });

  router.post('/customer/session/wechat', controller.auth.wechatLogin);

  // 分类
  router.get('/category', authorize, controller.category.list);
  router.post('/category', only_admin, controller.category.create);
  router.put('/category/:id', only_admin, controller.category.update);
  router.delete('/category/:id', only_admin, controller.category.delete);

  // 菜品
  router.get('/food', authorize, controller.food.list);
  router.get('/food/:id', authorize, controller.food.detail);
  router.post('/food', only_admin, controller.food.create);
  router.put('/food/:id', only_admin, controller.food.update);
  router.delete('/food/:id', only_admin, controller.food.delete);

  // 菜品规格
  router.get('/food/:food_id/specification', authorize, controller.specification.list);
  router.post('/food/:food_id/specification', only_admin, controller.specification.create);
  router.put('/food/:food_id/specification/:id', only_admin, controller.specification.update);
  router.delete('/food/:food_id/specification/:id', only_admin, controller.specification.delete);

  // 订单
  router.get('/order', authorize, controller.order.list);
  router.get('/order/:id', authorize, controller.order.detail);
  router.get('/order/:id/status', authorize, controller.order.getStatus);
  router.post('/order', authorize, controller.order.create);

  // 桌子类型
  router.get('/deskType', authorize, controller.deskType.list);
  router.post('/deskType', only_admin, controller.deskType.create);
  router.put('/deskType/:id', only_admin, controller.deskType.update);
  router.delete('/deskType/:id', only_admin, controller.desk.delete);

  // 桌子
  router.get('/desk', authorize, controller.desk.list);
  router.get('/desk/:id', authorize, controller.desk.detail);
  router.post('/desk', only_admin, controller.desk.create);
  router.put('/desk/:id', only_admin, controller.desk.update);
  router.delete('/desk/:id', only_admin, controller.desk.delete);

  // 文件
  router.get('/file', only_admin, controller.file.list);
  router.post('/file', only_admin, controller.file.create);
  router.put('/file/:id', only_admin, controller.file.update);
  router.delete('/file/:id', only_admin, controller.file.delete);

  // 排队
  router.get('/queue', authorize, controller.queue.detail);
  router.get('/queue/brief', only_admin, controller.queue.getBriefInfo);
  router.post('/queue', only_admin, authorize, controller.queue.create);
  router.put('/queue/use', only_admin, controller.queue.use);
  router.put('/queue/cancel', authorize, controller.queue.cancel);
  router.delete('/queue', only_admin, controller.queue.clean);

};
