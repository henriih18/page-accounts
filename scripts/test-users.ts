import { db } from '@/lib/db';

async function testUsers() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
        credits: true,
        createdAt: true
      }
    });
    
    console.log('Users in database:');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.role}) - Password: ${user.password ? 'YES' : 'NO'} - Credits: ${user.credits}`);
    });
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    await db.$disconnect();
  }
}

testUsers();