const { Sequelize, DataTypes } = require('sequelize');
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
        minVersion: 'TLSv1.2',
        rejectUnauthorized: false,
      }
    },
    logging: false // Keep logs clean
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models - Using absolute lowercase to match Linux/Render requirements
db.User = require('./user')(sequelize, DataTypes);
db.Student = require('./student')(sequelize, DataTypes);
db.Mark = require('./mark')(sequelize, DataTypes);
db.Fee = require('./fee')(sequelize, DataTypes);
db.Attendance = require('./attendance')(sequelize, DataTypes);
db.Remark = require('./remark')(sequelize, DataTypes);

// Associations
db.Student.hasMany(db.Mark, { foreignKey: 'studentReg', sourceKey: 'admissionNo' });
db.Mark.belongsTo(db.Student, { foreignKey: 'studentReg', targetKey: 'admissionNo' , as: 'student'});
db.Student.hasMany(db.Fee, { foreignKey: 'studentReg', sourceKey: 'admissionNo' });
db.Fee.belongsTo(db.Student, { foreignKey: 'studentReg', targetKey: 'admissionNo' });

module.exports = db;