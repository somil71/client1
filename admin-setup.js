db.users.deleteOne({email: 'admin@moksh.org'});

db.users.insertOne({
  name: 'Admin',
  email: 'admin@moksh.org',
  password: '$2a$10$pC6yipxhe7yCntWf5XkBCeOmhNJHH4tZvXKbRPNwxn6l16MtGXeEO',
  role: 'admin',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

print('✅ Admin user created successfully');
db.users.findOne({email: 'admin@moksh.org'});
