const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      }
    }
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Pass both sequelize and Sequelize.DataTypes to avoid crashes
db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.Student = require('./student')(sequelize, Sequelize.DataTypes);
db.Mark = require('./mark')(sequelize, Sequelize.DataTypes);
db.Fee = require('./fee')(sequelize, Sequelize.DataTypes);
db.Attendance = require('./Attendance')(sequelize, Sequelize.DataTypes);
db.Remark = require('./Remark')(sequelize, Sequelize.DataTypes);

// Associations
db.Student.hasMany(db.Mark, { foreignKey: 'studentReg', sourceKey: 'admissionNo' });
db.Mark.belongsTo(db.Student, { foreignKey: 'studentReg', targetKey: 'admissionNo' });
db.Student.hasMany(db.Fee, { foreignKey: 'studentReg', sourceKey: 'admissionNo' });
db.Fee.belongsTo(db.Student, { foreignKey: 'studentReg', targetKey: 'admissionNo' });

module.exports = db;