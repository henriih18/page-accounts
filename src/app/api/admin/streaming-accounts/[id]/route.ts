import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = params;
    const data = await request.json();

    const updatedAccount = await db.streamingAccount.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        type: data.type,
        duration: data.duration,
        quality: data.quality,
        screens: parseInt(data.screens),
        active: data.active,
        image: data.image
      }
    });

    return NextResponse.json(updatedAccount);
  } catch (error) {
    console.error('Error updating streaming account:', error);
    return NextResponse.json({ error: 'Error al actualizar cuenta' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = params;

    await db.streamingAccount.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Cuenta eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting streaming account:', error);
    return NextResponse.json({ error: 'Error al eliminar cuenta' }, { status: 500 });
  }
}