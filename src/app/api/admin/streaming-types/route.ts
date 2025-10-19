/* import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const types = await db.streamingType.findMany({
      include: {
        _count: {
          select: {
            accounts: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(types);
  } catch (error) {
    console.error('Error fetching streaming types:', error);
    return NextResponse.json({ error: 'Error al obtener tipos de streaming' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { name, description, icon, color } = await request.json();

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 });
    }

    const existingType = await db.streamingType.findUnique({
      where: { name: name.trim() }
    });

    if (existingType) {
      return NextResponse.json({ error: 'Este tipo de streaming ya existe' }, { status: 400 });
    }

    const newType = await db.streamingType.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        icon: icon?.trim() || null,
        color: color?.trim() || null,
        active: true
      }
    });

    return NextResponse.json({
      message: 'Tipo de streaming creado exitosamente',
      type: newType
    });
  } catch (error) {
    console.error('Error creating streaming type:', error);
    return NextResponse.json({ error: 'Error al crear tipo de streaming' }, { status: 500 });
  }
} */

  import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

// 📌 Obtener todos los tipos de streaming
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const types = await db.streamingType.findMany({
      include: {
        _count: {
          select: { accounts: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(types);
  } catch (error: unknown) {
    console.error("❌ Error al obtener tipos de streaming:", error);
    const errorMsg =
      error instanceof Error ? error.message : "Error desconocido al obtener tipos";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

// 📌 Crear un nuevo tipo de streaming
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, icon, color, active } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 });
    }

    const existingType = await db.streamingType.findUnique({
      where: { name: name.trim() },
    });

    if (existingType) {
      return NextResponse.json(
        { error: "Este tipo de streaming ya existe" },
        { status: 400 }
      );
    }

    const newType = await db.streamingType.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        icon: icon?.trim() || null,
        color: color?.trim() || null,
        active: active ?? true,
      },
    });

    return NextResponse.json({
      message: "Tipo de streaming creado exitosamente",
      type: newType,
    });
  } catch (error: unknown) {
    console.error("❌ Error al crear tipo de streaming:", error);
    const errorMsg =
      error instanceof Error ? error.message : "Error desconocido al crear tipo";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
