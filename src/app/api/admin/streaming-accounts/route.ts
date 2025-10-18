import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();

    const newAccount = await db.streamingAccount.create({
      data: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        type: data.type,
        duration: data.duration,
        quality: data.quality,
        screens: parseInt(data.screens),
        active: data.active ?? true,
        image: data.image
      }
    });

    return NextResponse.json(newAccount);
  } catch (error) {
    console.error('Error creating streaming account:', error);
    return NextResponse.json({ error: 'Error al crear cuenta' }, { status: 500 });
  }
}