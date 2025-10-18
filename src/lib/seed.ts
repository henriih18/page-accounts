import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { seedStreamingTypes } from './seed-types';

const defaultUsers = [
  {
    email: 'admin@streamhub.com',
    name: 'Administrador',
    role: 'ADMIN',
    password: 'admin123'
  },
  {
    email: 'user@streamhub.com',
    name: 'Usuario',
    role: 'USER',
    password: 'user123'
  },
  {
    email: 'demo@streamhub.com',
    name: 'Demo User',
    role: 'USER',
    password: null
  }
];

const defaultAccounts = [
  {
    id: 'netflix-premium',
    name: 'Netflix Premium',
    description: 'Cuenta premium de Netflix con acceso a todo el catálogo',
    price: 5.99,
    type: 'Netflix',
    duration: 'mes',
    quality: '4K',
    screens: 4,
    active: true
  },
  {
    id: 'disney-plus-premium',
    name: 'Disney+ Premium',
    description: 'Cuenta premium de Disney+ con todo el contenido',
    price: 4.99,
    type: 'Disney+',
    duration: 'mes',
    quality: '4K',
    screens: 4,
    active: true
  },
  {
    id: 'hbo-max',
    name: 'HBO Max',
    description: 'Cuenta de HBO Max con series y películas exclusivas',
    price: 6.99,
    type: 'HBO Max',
    duration: 'mes',
    quality: '4K',
    screens: 3,
    active: true
  },
  {
    id: 'amazon-prime-video',
    name: 'Amazon Prime Video',
    description: 'Cuenta de Amazon Prime con beneficios adicionales',
    price: 3.99,
    type: 'Amazon Prime',
    duration: 'mes',
    quality: '4K',
    screens: 3,
    active: true
  },
  {
    id: 'paramount-plus',
    name: 'Paramount+',
    description: 'Cuenta de Paramount+ con contenido exclusivo',
    price: 4.49,
    type: 'Paramount+',
    duration: 'mes',
    quality: 'HD',
    screens: 3,
    active: true
  },
  {
    id: 'apple-tv-plus',
    name: 'Apple TV+',
    description: 'Cuenta de Apple TV+ con contenido original',
    price: 5.49,
    type: 'Apple TV+',
    duration: 'mes',
    quality: '4K',
    screens: 6,
    active: true
  }
];

export async function seedDatabase() {
  try {
    console.log('Iniciando seed de la base de datos...');

    // First, seed streaming types
    await seedStreamingTypes();
    console.log('Tipos de streaming creados correctamente');

    // Create users
    for (const user of defaultUsers) {
      const hashedPassword = user.password ? await bcrypt.hash(user.password, 10) : null;
      
      await db.user.upsert({
        where: { email: user.email },
        update: {
          name: user.name,
          role: user.role,
          ...(user.password && { password: hashedPassword })
        },
        create: {
          email: user.email,
          name: user.name,
          role: user.role,
          password: hashedPassword
        }
      });
    }
    console.log('Usuarios creados correctamente');

    // Create streaming accounts
    for (const account of defaultAccounts) {
      await db.streamingAccount.upsert({
        where: { id: account.id },
        update: account,
        create: account
      });
    }
    console.log('Cuentas de streaming creadas correctamente');

    console.log('Base de datos inicializada con éxito');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  }
}