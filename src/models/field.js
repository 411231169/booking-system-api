module.exports = (sequelize, DataTypes) => {
  const Field = sequelize.define('Field', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    price_per_hour: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    tableName: 'fields',
    underscored: true,
    timestamps: true,
  });

  Field.associate = (models) => {
    Field.hasMany(models.Booking, {
      foreignKey: 'field_id',
      as: 'bookings',
    });
  };

  return Field;
};
