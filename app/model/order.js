'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM } = app.Sequelize;

  const model = app.model.define('order', {
    status: ENUM('not_paid', 'auditing', 'finish', 'canceled'),
    order_no: {
      type: STRING(32),
    },
    remark: {
      type: STRING(50),
      allowNull: false,
    },
    total_price: INTEGER,
    paid_price: INTEGER,
    created_at: DATE,
    finish_at: DATE,
  });

  model.associate = function() {
    model.hasMany(app.model.OrderItem, { as: 'items' });
    model.belongsTo(app.model.Customer);
    model.belongsTo(app.model.Desk);
  };

  return model;
};
