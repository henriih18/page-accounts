import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const cart = await db.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            streamingAccount: true
          }
        }
      }
    });

    if (!cart) {
      return NextResponse.json({ items: [], totalAmount: 0 });
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Error al obtener el carrito' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { streamingAccountId, quantity, saleType } = await request.json();

    if (!streamingAccountId || !quantity || quantity < 1) {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      );
    }

    // Get streaming account details
    const streamingAccount = await db.streamingAccount.findUnique({
      where: { id: streamingAccountId }
    });

    if (!streamingAccount) {
      return NextResponse.json(
        { error: 'Cuenta no encontrada' },
        { status: 404 }
      );
    }

    // Calculate price
    let priceAtTime = streamingAccount.price;
    if (saleType === 'PROFILES' && streamingAccount.pricePerProfile) {
      priceAtTime = streamingAccount.pricePerProfile;
    }

    // Get or create user cart
    let cart = await db.cart.findUnique({
      where: { userId: session.user.id }
    });

    if (!cart) {
      cart = await db.cart.create({
        data: {
          userId: session.user.id,
          totalAmount: 0
        }
      });
    }

    // Check if item already exists in cart
    const existingItem = await db.cartItem.findFirst({
      where: {
        cartId: cart.id,
        streamingAccountId,
        saleType
      }
    });

    if (existingItem) {
      // Update quantity
      const updatedItem = await db.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity
        }
      });
    } else {
      // Add new item
      await db.cartItem.create({
        data: {
          cartId: cart.id,
          streamingAccountId,
          quantity,
          saleType,
          priceAtTime
        }
      });
    }

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

    return NextResponse.json({ message: 'Producto agregado al carrito' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Error al agregar al carrito' },
      { status: 500 }
    );
  }
}