'use strict';

module.exports = app => {
  const model = app.model.define('food_category', {});

  model.associate = function() {
    app.model.Category.belongsToMany(app.model.Food, { through: model });
    app.model.Food.belongsToMany(app.model.Category, { through: model });
  };

  return model;
};
