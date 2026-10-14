const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = "admin@hackeval.com";
    
    // Delete existing admin to re-seed correctly
    await User.deleteOne({ email: adminEmail });
    console.log('Clearing existing admin record...');

    const admin = new User({
      name: "System Administrator",
      email: adminEmail,
      password: 'admin123', // Model's pre-save hook will hash this
      role: "admin",
      isActive: true
    });

    await admin.save();
    console.log('Admin user re-seeded successfully!');
    console.log('Email: admin@hackeval.com');
    console.log('Password: admin123');
    
    process.exit();
  } catch (err) {
    console.error('Error seeding admin:', err.message);
    process.exit(1);
  }
};

seedAdmin();
