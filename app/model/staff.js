'use strict';

module.exports = app => {
  const { STRING, DATE } = app.Sequelize;

  const model = app.model.define('staff', {
    username: {
      type: STRING(20),
      unique: true,
    },
    password: STRING(40),
    salt: STRING(40),
    created_at: DATE,
    updated_at: DATE,
  });

  // TODO: roles

  return model;
};
