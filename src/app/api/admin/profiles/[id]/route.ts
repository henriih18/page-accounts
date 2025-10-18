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
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const profileId = params.id;
    const { profileName, profilePin, isAvailable } = await request.json();

    // Check if profile exists
    const existingProfile = await db.accountProfile.findUnique({
      where: { id: profileId }
    });

    if (!existingProfile) {
      return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 });
    }

    // If profile is sold, cannot modify availability
    if (!existingProfile.isAvailable && isAvailable === true) {
      return NextResponse.json({ 
        error: 'No se puede marcar como disponible un perfil ya vendido' 
      }, { status: 400 });
    }

    // Update profile
    const updatedProfile = await db.accountProfile.update({
      where: { id: profileId },
      data: {
        profileName,
        profilePin,
        isAvailable
      }
    });

    return NextResponse.json({
      message: 'Perfil actualizado exitosamente',
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Error al actualizar perfil' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const profileId = params.id;

    // Check if profile exists and is not sold
    const existingProfile = await db.accountProfile.findUnique({
      where: { id: profileId }
    });

    if (!existingProfile) {
      return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 });
    }

    if (!existingProfile.isAvailable) {
      return NextResponse.json({ 
        error: 'No se puede eliminar un perfil ya vendido' 
      }, { status: 400 });
    }

    // Delete profile
    await db.accountProfile.delete({
      where: { id: profileId }
    });

    return NextResponse.json({ message: 'Perfil eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return NextResponse.json(
      { error: 'Error al eliminar perfil' },
      { status: 500 }
    );
  }
}