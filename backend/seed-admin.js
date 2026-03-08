import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const mongoUri = 'mongodb://localhost:27017/moksh-foundation';

async function seedAdmin() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');

    const db = mongoose.connection.db;
    const users = db.collection('users');

    // Check if admin already exists
    const existingAdmin = await users.findOne({ email: 'admin@moksh.org' });
    if (existingAdmin) {
      console.log('✓ Admin user already exists');
      await mongoose.disconnect();
      return;
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash('admin123', salt);

    // Create admin user
    const result = await users.insertOne({
      name: 'Admin',
      email: 'admin@moksh.org',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('✓ Admin user created successfully');
    console.log('Email: admin@moksh.org');
    console.log('Password: admin123');
    console.log('ID:', result.insertedId);

    await mongoose.disconnect();
  } catch (error) {
    console.error('✗ Error creating admin user:', error);
    process.exit(1);
  }
}

seedAdmin();
