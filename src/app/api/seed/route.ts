import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed';

export async function POST() {
  try {
    await seedDatabase();
    
    return NextResponse.json({ 
      message: 'Base de datos inicializada exitosamente' 
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ 
      error: 'Error al inicializar la base de datos' 
    }, { status: 500 });
  }
}