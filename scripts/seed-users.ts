import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

async function seedUsers() {
  try {
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await db.user.upsert({
      where: { email: 'admin@streamhub.com' },
      update: {},
      create: {
        email: 'admin@streamhub.com',
        name: 'Administrador',
        password: adminPassword,
        role: 'ADMIN',
        credits: 1000
      }
    });

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await db.user.upsert({
      where: { email: 'user@streamhub.com' },
      update: {},
      create: {
        email: 'user@streamhub.com',
        name: 'Usuario Demo',
        password: userPassword,
        role: 'USER',
        credits: 50
      }
    });

    // Create demo user without password (for passwordless login)
    const demoUser = await db.user.upsert({
      where: { email: 'demo@streamhub.com' },
      update: {},
      create: {
        email: 'demo@streamhub.com',
        name: 'Demo Usuario',
        password: null,
        role: 'USER',
        credits: 25
      }
    });

    console.log('Users seeded successfully:', { admin, user, demoUser });
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await db.$disconnect();
  }
}

seedUsers();