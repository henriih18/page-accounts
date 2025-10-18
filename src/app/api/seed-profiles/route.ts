import { NextResponse } from 'next/server';
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

export async function POST() {
  try {
    console.log('Creando perfiles de ejemplo...');

    for (const profile of sampleProfiles) {
      await db.accountProfile.create({
        data: profile
      });
    }

    console.log('Perfiles creados correctamente');

    return NextResponse.json({ 
      message: 'Perfiles de ejemplo creados exitosamente' 
    });
  } catch (error) {
    console.error('Error creating profiles:', error);
    return NextResponse.json({ 
      error: 'Error al crear perfiles de ejemplo' 
    }, { status: 500 });
  }
}