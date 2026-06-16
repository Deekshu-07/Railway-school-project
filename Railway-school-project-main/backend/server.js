const path = require('path');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

// Load Environment Variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

console.log("--- STARTING SERVER ---");
console.log("DB_HOST =", process.env.DB_HOST);
console.log("DB_USER =", process.env.DB_USER);
console.log("DB_NAME =", process.env.DB_NAME);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', 
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global variables for models and routes
let db;

async function seedDefaultUsers() {
  const users = [
    { email: 'president@school.com', password: 'president123', role: 'President', name: 'School President' },
    { email: 'principal@school.com', password: 'principal123', role: 'Principal', name: 'School Principal' },
    { email: 'teacher@school.com', password: 'teacher123', role: 'Teacher', name: 'Class Teacher' },
    { email: 'accountant@school.com', password: 'accountant123', role: 'Accountant', name: 'School Accountant' }
  ];
  for (const user of users) {
    try {
      const existing = await db.User.findOne({ where: { email: user.email } });
      if (!existing) {
        await db.User.create({
          email: user.email,
          passwordHash: bcrypt.hashSync(user.password, 10),
          role: user.role,
          name: user.name,
          status: 'approved'
        });
      } else if (!existing.status || existing.status === 'pending') {
        await existing.update({ status: 'approved' });
      }
    } catch (e) { 
        console.log(`User ${user.email} verified/existing.`); 
    }
  }
}

async function startServer() {
  try {
    // 1. Load Models (The most common crash point on Render/Linux)
    console.log("Step 1: Loading Database Models...");
    db = require('./models');
    
    // 2. Load Routes
    console.log("Step 2: Loading API Routes...");
    const remarkRoutes = require('./routes/remarks');
    const authRoutes = require('./routes/auth');
    const studentRoutes = require('./routes/students');
    const markRoutes = require('./routes/marks');
    const feeRoutes = require('./routes/fees');
    const attendanceRoutes = require('./routes/attendance');
    const studentPortalRoutes = require('./routes/studentportal');
    const principalRoutes = require('./routes/principal');

    // 3. Apply Routes
    app.use('/api/remarks', remarkRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/students', studentRoutes);
    app.use('/api/marks', markRoutes);
    app.use('/api/fees', feeRoutes);
    app.use('/api/attendance', attendanceRoutes);
    app.use('/api/student-portal', studentPortalRoutes);
    app.use('/api/principal', principalRoutes);

    // 4. Frontend Integration
    app.use(express.static(path.join(__dirname, '..', 'frontend')));

    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
    });

    // 5. Database Connection
    console.log("Step 3: Authenticating Database Connection...");
    await db.sequelize.authenticate();
    console.log('Database connection established.');
    
    console.log("Step 4: Synchronizing Database Tables...");
    await db.sequelize.sync({ alter: true });
    console.log('Database synchronized.');

    console.log("Step 5: Seeding Default Users...");
    await seedDefaultUsers();
    console.log('Default users verified.');

    // 6. Start Listening
    app.listen(PORT, () => {
      console.log(`--- SERVER LIVE ON PORT ${PORT} ---`);
    });

  } catch (error) {
    console.error('--- CRITICAL ERROR DURING STARTUP ---');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    if (error.code === 'MODULE_NOT_FOUND') {
        console.error('A file is missing or has a naming/capitalization error!');
    }
    console.error('Full Stack Trace:', error);
    process.exit(1);
  }
}

// Fallback for SPA (Single Page Application)
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
    }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err);
    res.status(500).json({ message: err.message || 'Internal server error' });
});

startServer();