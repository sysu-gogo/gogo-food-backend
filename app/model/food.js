'use strict';

module.exports = app => {
  const { STRING } = app.Sequelize;

  const Food = app.model.define('food', {
    name: {
      type: STRING(45),
      allowNull: false,
    },
    brief: {
      type: STRING(100),
      allowNull: false,
    },
    description: {
      type: STRING(200),
      allowNull: false,
    },
  });

  Food.associate = function() {
    // food 里面有 cover(file)
    Food.belongsTo(app.model.File, {
      allowNull: false, as: 'cover',
    });
    Food.hasMany(app.model.Specification);
  };

  return Food;
};
