'use strict';

module.exports = app => {
  const { STRING } = app.Sequelize;

  const model = app.model.define('desk_type', {
    name: {
      type: STRING(20),
      allowNull: false,
    },
    description: {
      type: STRING,
    },
  });

  return model;
};
