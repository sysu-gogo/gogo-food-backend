'use strict';

module.exports = app => {
  const { STRING } = app.Sequelize;

  const File = app.model.define('file', {
    name: {
      type: STRING,
      allowNull: false,
    },
    url: {
      type: STRING,
      allowNull: false,
    },
  });

  return File;
};
