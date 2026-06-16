module.exports = (sequelize, DataTypes) => {
  return sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('Teacher', 'Principal', 'President', 'Accountant', 'Secretary'),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // 🔥 Added Status field for Principal Approval
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending'
    }
  }, {
    timestamps: true
  });
};