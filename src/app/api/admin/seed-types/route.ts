import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { seedStreamingTypes } from '@/lib/seed-types';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await seedStreamingTypes();

    return NextResponse.json({ 
      message: 'Tipos de streaming inicializados exitosamente' 
    });
  } catch (error) {
    console.error('Error seeding streaming types:', error);
    return NextResponse.json({ 
      error: 'Error al inicializar tipos de streaming' 
    }, { status: 500 });
  }
}