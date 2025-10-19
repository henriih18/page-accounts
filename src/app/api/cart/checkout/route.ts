import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { Order } from "@prisma/client";



export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Get user's cart
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

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Carrito vacío' }, { status: 400 });
    }

    // Get user's credits
    const user = await db.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user || user.credits < cart.totalAmount) {
      return NextResponse.json({ error: 'Créditos insuficientes' }, { status: 400 });
    }

     

    // Start transaction
    const orders: Order[] = [];
    
    for (const item of cart.items) {
      const account = item.streamingAccount;
      
      if (item.saleType === 'FULL') {
        // Sell full account
        for (let i = 0; i < item.quantity; i++) {
          const order = await db.order.create({
            data: {
              userId: session.user.id,
              streamingAccountId: account.id,
              accountEmail: account.email || 'pending@admin.com',
              accountPassword: account.password || 'pending',
              saleType: 'FULL',
              quantity: 1,
              totalPrice: item.priceAtTime,
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
              status: 'PENDING'
            }
          });
          orders.push(order);
        }
      } else {
        // Sell profiles
        const availableProfiles = await db.accountProfile.findMany({
          where: {
            streamingAccountId: account.id,
            isAvailable: true
          },
          take: item.quantity
        });

        if (availableProfiles.length < item.quantity) {
          return NextResponse.json({ 
            error: `No hay suficientes perfiles disponibles. Disponibles: ${availableProfiles.length}` 
          }, { status: 400 });
        }

        for (const profile of availableProfiles) {
          const order = await db.order.create({
            data: {
              userId: session.user.id,
              streamingAccountId: account.id,
              accountEmail: account.email || 'pending@admin.com',
              accountPassword: account.password || 'pending',
              profileName: profile.profileName,
              saleType: 'PROFILES',
              quantity: 1,
              totalPrice: item.priceAtTime,
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
              status: 'PENDING'
            }
          });

          // Mark profile as sold
          await db.accountProfile.update({
            where: { id: profile.id },
            data: {
              isAvailable: false,
              soldToUserId: session.user.id,
              soldAt: new Date()
            }
          });

          orders.push(order);
        }
      }
    }

    // Deduct credits
    await db.user.update({
      where: { id: session.user.id },
      data: {
        credits: user.credits - cart.totalAmount
      }
    });

    // Clear cart
    await db.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    await db.cart.update({
      where: { id: cart.id },
      data: { totalAmount: 0 }
    });

    return NextResponse.json({
      message: 'Compra realizada exitosamente',
      orders
    });
  } catch (error) {
    console.error('Error processing purchase:', error);
    return NextResponse.json(
      { error: 'Error al procesar la compra' },
      { status: 500 }
    );
  }
}