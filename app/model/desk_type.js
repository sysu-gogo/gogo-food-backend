'use strict';

module.exports = app => {
  const { STRING, BOOLEAN } = app.Sequelize;

  const model = app.model.define('desk_type', {
    name: {
      type: STRING(20),
      allowNull: false,
    },
    description: {
      type: STRING,
    },
    need_queue: {
      type: BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  });

  return model;
};
