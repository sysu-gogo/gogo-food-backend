'use strict';

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const model = app.model.define('specification', {
    name: {
      type: STRING(45),
      allowNull: false,
    },
    description: {
      type: STRING(200),
    },
    price: INTEGER,
    count: INTEGER, // 仓库剩余
  });

  model.associate = function() {
    model.belongsTo(app.model.Food);
  };

  return model;
};
