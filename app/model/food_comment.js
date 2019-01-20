'use strict';

module.exports = app => {
  const { INTEGER, STRING } = app.Sequelize;

  const model = app.model.define('food_comment', {
    comment_food_id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    specification_id: INTEGER,
    order_item_id: INTEGER,
    star: INTEGER,
    content: STRING(500),
  });

  return model;
};
