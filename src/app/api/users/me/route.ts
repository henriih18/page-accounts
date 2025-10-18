import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: {
        id: session.user.id
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        credits: true,
        avatar: true,
        phone: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json(
      { error: "Error fetching user" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    try {
      const validatedData = updateProfileSchema.parse(body);
      
      const updatedUser = await db.user.update({
        where: {
          id: session.user.id
        },
        data: {
          ...(validatedData.name && { name: validatedData.name }),
          ...(validatedData.phone !== undefined && { phone: validatedData.phone }),
          ...(validatedData.avatar && { avatar: validatedData.avatar }),
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          credits: true,
          avatar: true,
          phone: true,
          createdAt: true,
          updatedAt: true
        }
      });

      return NextResponse.json(updatedUser);
    } catch (validationError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: validationError },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Error updating user" },
      { status: 500 }
    );
  }
}