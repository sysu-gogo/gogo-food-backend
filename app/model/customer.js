'use strict';

module.exports = app => {
  const { STRING, DATE } = app.Sequelize;

  const model = app.model.define('customer', {
    phone_number: {
      type: STRING(20),
      unique: true,
    },
    wx_open_id: {
      type: STRING(30),
      unique: true,
    },
  });

  return model;
};
