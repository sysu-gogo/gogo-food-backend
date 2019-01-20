'use strict';

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const model = app.model.define('category', {
    name: {
      type: STRING(45),
      allowNull: false,
    },
    order: {
      type: INTEGER,
      defaultValue: 99,
      validate: { min: 0, max: 999 },
    },
    icon: STRING(20),
    color: STRING(10),
  });

  return model;
};
