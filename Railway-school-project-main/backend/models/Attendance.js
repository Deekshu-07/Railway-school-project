module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Attendance', {
    studentId:   { type: DataTypes.STRING,  allowNull: false },
    admissionNo: { type: DataTypes.INTEGER, allowNull: false },
    name:        { type: DataTypes.STRING,  allowNull: true },
    class:       { type: DataTypes.STRING,  allowNull: false },
    section:     { type: DataTypes.STRING,  allowNull: false },
    date:        { type: DataTypes.STRING,  allowNull: false },
    session:     { type: DataTypes.STRING,  allowNull: false },
    status:      { type: DataTypes.STRING,  allowNull: false, defaultValue: 'Absent' }
  }, {
    tableName: 'attendance',
    timestamps: true,
    underscored: false
  });
};