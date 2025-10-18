import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const userCredits = [
  { email: 'user@streamhub.com', credits: 100 },
  { email: 'demo@streamhub.com', credits: 50 },
  { email: 'admin@streamhub.com', credits: 1000 }
];

export async function POST() {
  try {
    console.log('Agregando créditos a usuarios...');

    for (const userCredit of userCredits) {
      await db.user.update({
        where: { email: userCredit.email },
        data: { credits: userCredit.credits }
      });
    }

    console.log('Créditos agregados correctamente');

    return NextResponse.json({ 
      message: 'Créditos agregados exitosamente' 
    });
  } catch (error) {
    console.error('Error adding credits:', error);
    return NextResponse.json({ 
      error: 'Error al agregar créditos' 
    }, { status: 500 });
  }
}