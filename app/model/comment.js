'use strict';

module.exports = app => {
  const { INTEGER, STRING } = app.Sequelize;

  const model = app.model.define('comment', {
    star: INTEGER,
    content: STRING(500),
  });

  model.associate = function() {
    app.model.Customer.hasOne(model);
    app.model.Order.hasOne(model);
  };


  return model;
};
