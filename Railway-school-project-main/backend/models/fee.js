module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Fee', {
    id:          { type: DataTypes.INTEGER,        primaryKey: true, autoIncrement: true },
    studentReg:  { type: DataTypes.INTEGER,        allowNull: false },
    total:       { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    paid:        { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    pending:     { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    status:      { type: DataTypes.STRING,         allowNull: false },
    mode:        { type: DataTypes.STRING,         allowNull: false },
    date:        { type: DataTypes.DATEONLY,       allowNull: false },
    paymentTerm: { type: DataTypes.STRING,         allowNull: false }
  }, {
    tableName: 'fees',
    underscored: false
  });
};