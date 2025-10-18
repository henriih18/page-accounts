import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');

    const profiles = await db.accountProfile.findMany({
      where: accountId ? { streamingAccountId: accountId } : {},
      include: {
        streamingAccount: {
          select: {
            name: true,
            type: true
          }
        },
        soldToUser: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { error: 'Error al obtener perfiles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { streamingAccountId, profileName, profilePin } = await request.json();

    if (!streamingAccountId || !profileName) {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      );
    }

    // Check if profile already exists for this account
    const existingProfile = await db.accountProfile.findFirst({
      where: {
        streamingAccountId,
        profileName
      }
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Este perfil ya existe para esta cuenta' },
        { status: 400 }
      );
    }

    // Create profile
    const profile = await db.accountProfile.create({
      data: {
        streamingAccountId,
        profileName,
        profilePin
      }
    });

    return NextResponse.json({
      message: 'Perfil creado exitosamente',
      profile
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { error: 'Error al crear perfil' },
      { status: 500 }
    );
  }
}