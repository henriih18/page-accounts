import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

export async function GET() {
  try {
    const accounts = await db.streamingAccount.findMany({
      where: {
        active: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(accounts);
  } catch (error) {
    console.error("Error fetching streaming accounts:", error);
    return NextResponse.json(
      { error: "Error fetching streaming accounts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, price, type, duration, quality, screens, image } = body;

    if (!name || !description || !price || !type || !duration || !quality || !screens) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const account = await db.streamingAccount.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        type,
        duration,
        quality,
        screens: parseInt(screens),
        image: image || null,
      },
    });

    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    console.error("Error creating streaming account:", error);
    return NextResponse.json(
      { error: "Error creating streaming account" },
      { status: 500 }
    );
  }
}