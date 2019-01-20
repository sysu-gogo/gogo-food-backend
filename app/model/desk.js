'use strict';

module.exports = app => {
  const { STRING } = app.Sequelize;

  const model = app.model.define('desk', {
    name: {
      type: STRING(20),
      allowNull: false,
    },
  });

  model.associate = function() {
    model.belongsTo(app.model.DeskType);
  };

  return model;
};
