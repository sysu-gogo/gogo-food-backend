'use strict';

module.exports = app => {
  const { INTEGER } = app.Sequelize;

  const model = app.model.define('order_item', {
    specification_id: INTEGER,
    price: INTEGER, // 购买当下的价格
    count: INTEGER,
  });

  model.associate = function() {
    model.belongsTo(app.model.Order);
    model.belongsTo(app.model.Specification);
  };

  return model;
};
