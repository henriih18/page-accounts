import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        credits: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            creditRecharges: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { userId, amount, method, reference } = await request.json();

    if (!userId || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    // Create credit recharge record
    const recharge = await db.creditRecharge.create({
      data: {
        userId,
        amount,
        method: method || 'Administración',
        reference,
        status: 'COMPLETED'
      }
    });

    // Update user credits
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        credits: {
          increment: amount
        }
      }
    });

    return NextResponse.json({
      message: 'Créditos recargados exitosamente',
      recharge,
      updatedUser
    });
  } catch (error) {
    console.error('Error recharging credits:', error);
    return NextResponse.json({ error: 'Error al recargar créditos' }, { status: 500 });
  }
}