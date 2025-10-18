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
    const { name, description, icon, color, active } = await request.json();

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 });
    }

    // Check if name already exists for another type
    const existingType = await db.streamingType.findFirst({
      where: {
        name: name.trim(),
        id: { not: id }
      }
    });

    if (existingType) {
      return NextResponse.json({ error: 'Este tipo de streaming ya existe' }, { status: 400 });
    }

    const updatedType = await db.streamingType.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        icon: icon?.trim() || null,
        color: color?.trim() || null,
        active: active ?? true
      }
    });

    return NextResponse.json({
      message: 'Tipo de streaming actualizado exitosamente',
      type: updatedType
    });
  } catch (error) {
    console.error('Error updating streaming type:', error);
    return NextResponse.json({ error: 'Error al actualizar tipo de streaming' }, { status: 500 });
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

    // Check if there are accounts using this type
    const accountsCount = await db.streamingAccount.count({
      where: { type: id }
    });

    if (accountsCount > 0) {
      return NextResponse.json({ 
        error: `No se puede eliminar este tipo porque hay ${accountsCount} cuentas asociadas` 
      }, { status: 400 });
    }

    await db.streamingType.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Tipo de streaming eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting streaming type:', error);
    return NextResponse.json({ error: 'Error al eliminar tipo de streaming' }, { status: 500 });
  }
}