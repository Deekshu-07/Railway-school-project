const path = require('path');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let db;

async function seedDefaultUsers() {
  const users = [
    { email: 'principal@school.com', password: 'principal123', role: 'Principal', name: 'Principal' },
    { email: 'teacher@school.com', password: 'teacher123', role: 'Teacher', name: 'Teacher' }
  ];
  for (const u of users) {
    try {
      const exists = await db.User.findOne({ where: { email: u.email } });
      if (!exists) {
        await db.User.create({
          email: u.email,
          passwordHash: bcrypt.hashSync(u.password, 10),
          role: u.role,
          name: u.name,
          status: 'approved'
        });
      }
    } catch (e) { console.log("Seeding check done."); }
  }
}

async function startServer() {
  try {
    console.log("Step 1: Loading Models...");
    db = require('./models');
    
    console.log("Step 2: Loading Routes...");
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/students', require('./routes/students'));
    app.use('/api/marks', require('./routes/marks'));
    app.use('/api/fees', require('./routes/fees'));
    app.use('/api/attendance', require('./routes/attendance'));
    app.use('/api/student-portal', require('./routes/studentportal'));
    app.use('/api/principal', require('./routes/principal'));

    app.use(express.static(path.join(__dirname, '..', 'frontend')));

    console.log("Step 3: Connecting to TiDB...");
    await db.sequelize.authenticate();
    
    console.log("Step 4: Syncing Database...");
    // Use { alter: false } or just sync() to avoid TiDB migration errors
    await db.sequelize.sync({ alter: true });

    await seedDefaultUsers();
    
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
      }
    });

    app.listen(PORT, () => {
      console.log(`LIVE ON PORT ${PORT}`);
    });
  } catch (error) {
    console.error('CRITICAL ERROR:', error);
    process.exit(1);
  }
}

startServer();