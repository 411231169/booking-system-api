module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    booking_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    proof_url: {
      type: DataTypes.STRING(255),
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'VERIFIED', 'REJECTED'),
      defaultValue: 'PENDING',
    },
    verified_by: {
      type: DataTypes.BIGINT,
    },
    verified_at: {
      type: DataTypes.DATE,
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
    tableName: 'payments',
    underscored: true,
    timestamps: true,
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.Booking, {
      foreignKey: 'booking_id',
      as: 'booking',
    });
    Payment.belongsTo(models.User, {
      foreignKey: 'verified_by',
      as: 'verifier',
    });
  };

  return Payment;
};
