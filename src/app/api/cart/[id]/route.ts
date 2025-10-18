import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const cartItemId = params.id;

    // Get user's cart
    const cart = await db.cart.findUnique({
      where: { userId: session.user.id }
    });

    if (!cart) {
      return NextResponse.json({ error: 'Carrito no encontrado' }, { status: 404 });
    }

    // Delete cart item
    await db.cartItem.delete({
      where: { id: cartItemId }
    });

    // Recalculate cart total
    const updatedCart = await db.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            streamingAccount: true
          }
        }
      }
    });

    const totalAmount = updatedCart?.items.reduce((total, item) => {
      return total + (item.priceAtTime * item.quantity);
    }, 0) || 0;

    await db.cart.update({
      where: { id: cart.id },
      data: { totalAmount }
    });

    return NextResponse.json({ message: 'Item eliminado del carrito' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Error al eliminar del carrito' },
      { status: 500 }
    );
  }
}