module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    field_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    booking_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED'),
      defaultValue: 'PENDING',
    },
    notes: {
      type: DataTypes.TEXT,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    }
  }, {
    tableName: 'bookings',
    underscored: true,
    timestamps: true,
  });

  Booking.associate = (models) => {
    Booking.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
    Booking.belongsTo(models.Field, {
      foreignKey: 'field_id',
      as: 'field',
    });
    Booking.hasOne(models.Payment, {
      foreignKey: 'booking_id',
      as: 'payment',
    });
  };

  return Booking;
};
