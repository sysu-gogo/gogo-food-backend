'use strict';

module.exports = app => {
  const model = app.model.define('food_image', {});

  model.associate = function() {
    app.model.File.belongsToMany(app.model.Food, { through: model });
    app.model.Food.belongsToMany(app.model.File, { through: model, as: 'images' });
  };

  return model;
};
