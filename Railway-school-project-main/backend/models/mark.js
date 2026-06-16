module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Mark', {
    id:         { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    studentReg: { type: DataTypes.INTEGER, allowNull: false },
    exam:       { type: DataTypes.STRING, allowNull: true },
    marks:      { type: DataTypes.JSON, allowNull: true },
    total:      { type: DataTypes.INTEGER, allowNull: true },
    grade:      { type: DataTypes.STRING, allowNull: true }
  }, {
    tableName: 'marks',
    underscored: false
  });
};