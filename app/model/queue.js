'use strict';

module.exports = app => {
  const { INTEGER, ENUM, DATE } = app.Sequelize;

  const Queue = app.model.define('queue', {
    desk_type_id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: 'queue_number',
    },
    number: {
      type: INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: 'queue_number',
    },
    status: {
      type: ENUM('waiting', 'used', 'withdrew', 'cancelled'),
      defaultValue: 'waiting',
    },
    queue_at: {
      type: DATE,
      allowNull: false,
    },
  }, {
    engine: 'MYISAM',
  });

  Queue.associate = function() {
    Queue.belongsTo(app.model.DeskType, {
      foreignKey: 'desk_type_id',
    });

    Queue.belongsTo(app.model.Customer, {});
  };

  return Queue;
};
