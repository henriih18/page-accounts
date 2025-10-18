import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed';
import { db } from '@/lib/db';

const sampleProfiles = [
  // Netflix Premium Profiles
  {
    streamingAccountId: 'netflix-premium',
    profileName: 'Usuario 1',
    profilePin: '1234',
    isAvailable: true
  },
  {
    streamingAccountId: 'netflix-premium',
    profileName: 'Usuario 2',
    profilePin: '5678',
    isAvailable: true
  },
  {
    streamingAccountId: 'netflix-premium',
    profileName: 'Usuario 3',
    profilePin: '9012',
    isAvailable: true
  },
  {
    streamingAccountId: 'netflix-premium',
    profileName: 'Niños',
    profilePin: '3456',
    isAvailable: true
  },
  // Disney+ Premium Profiles
  {
    streamingAccountId: 'disney-plus-premium',
    profileName: 'Adulto 1',
    profilePin: '1111',
    isAvailable: true
  },
  {
    streamingAccountId: 'disney-plus-premium',
    profileName: 'Adulto 2',
    profilePin: '2222',
    isAvailable: true
  },
  {
    streamingAccountId: 'disney-plus-premium',
    profileName: 'Niños',
    profilePin: '3333',
    isAvailable: true
  },
  // HBO Max Profiles
  {
    streamingAccountId: 'hbo-max',
    profileName: 'Principal',
    profilePin: '4444',
    isAvailable: true
  },
  {
    streamingAccountId: 'hbo-max',
    profileName: 'Secundario',
    profilePin: '5555',
    isAvailable: true
  },
  {
    streamingAccountId: 'hbo-max',
    profileName: 'Invitado',
    profilePin: null,
    isAvailable: true
  },
  // Amazon Prime Profiles
  {
    streamingAccountId: 'amazon-prime-video',
    profileName: 'Usuario Principal',
    profilePin: '6666',
    isAvailable: true
  },
  {
    streamingAccountId: 'amazon-prime-video',
    profileName: 'Usuario Secundario',
    profilePin: '7777',
    isAvailable: true
  },
  // Paramount+ Profiles
  {
    streamingAccountId: 'paramount-plus',
    profileName: 'Adulto',
    profilePin: '8888',
    isAvailable: true
  },
  {
    streamingAccountId: 'paramount-plus',
    profileName: 'Niño',
    profilePin: '9999',
    isAvailable: true
  },
  // Apple TV+ Profiles
  {
    streamingAccountId: 'apple-tv-plus',
    profileName: 'Usuario 1',
    profilePin: null,
    isAvailable: true
  },
  {
    streamingAccountId: 'apple-tv-plus',
    profileName: 'Usuario 2',
    profilePin: null,
    isAvailable: true
  }
];

const userCredits = [
  { email: 'user@streamhub.com', credits: 100 },
  { email: 'demo@streamhub.com', credits: 50 },
  { email: 'admin@streamhub.com', credits: 1000 }
];

export async function POST() {
  try {
    console.log('🚀 Inicializando sistema completo...');

    // 1. Seed database with users, types, and accounts
    console.log('📊 Creando usuarios y cuentas base...');
    await seedDatabase();

    // 2. Create sample profiles
    console.log('👥 Creando perfiles de ejemplo...');
    for (const profile of sampleProfiles) {
      try {
        await db.accountProfile.create({
          data: profile
        });
      } catch (error) {
        // Profile might already exist, continue
        console.log(`Perfil ${profile.profileName} ya existe o hubo un error`);
      }
    }

    // 3. Add credits to users
    console.log('💰 Agregando créditos a usuarios...');
    for (const userCredit of userCredits) {
      await db.user.update({
        where: { email: userCredit.email },
        data: { credits: userCredit.credits }
      });
    }

    console.log('✅ Sistema inicializado correctamente');

    return NextResponse.json({ 
      message: 'Sistema inicializado exitosamente',
      details: {
        users: 3,
        accounts: 6,
        profiles: sampleProfiles.length,
        credits: 'Agregados'
      }
    });
  } catch (error) {
    console.error('❌ Error al inicializar el sistema:', error);
    return NextResponse.json({ 
      error: 'Error al inicializar el sistema',
      details: error.message 
    }, { status: 500 });
  }
}