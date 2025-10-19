/* import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get total users
    const totalUsers = await db.user.count();

    // Get total orders
    const totalOrders = await db.order.count();

    // Get total revenue
    const orders = await db.order.findMany({
      select: {
        totalPrice: true
      }
    });
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    // Get active streaming accounts
    const activeAccounts = await db.streamingAccount.count({
      where: {
        active: true
      }
    });

    // Get monthly sales data for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyOrders = await db.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: sixMonthsAgo
        }
      },
      _sum: {
        totalPrice: true
      },
      _count: {
        id: true
      }
    });

    

    // Format the monthly data
    const monthlyData = [];
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthOrders = monthlyOrders.filter(order => 
        order.createdAt >= monthStart && order.createdAt <= monthEnd
      );
      
      const monthSales = monthOrders.reduce((sum, order) => sum + (order._sum.totalPrice || 0), 0);
      const monthOrderCount = monthOrders.reduce((sum, order) => sum + order._count.id, 0);
      
      monthlyData.push({
        name: monthNames[date.getMonth()],
        sales: monthSales,
        orders: monthOrderCount
      });
    }

    // Get user growth data
    const userGrowth = await db.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: sixMonthsAgo
        }
      },
      _count: {
        id: true
      }
    });

    const userGrowthData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthUsers = userGrowth.filter(user => 
        user.createdAt >= monthStart && user.createdAt <= monthEnd
      );
      
      const userCount = monthUsers.reduce((sum, user) => sum + user._count.id, 0);
      
      userGrowthData.push({
        name: monthNames[date.getMonth()],
        users: userCount
      });
    }

    const stats = {
      totalUsers,
      totalOrders,
      totalRevenue,
      activeAccounts,
      monthlyData,
      userGrowthData
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Error fetching stats" },
      { status: 500 }
    );
  }
} */

  import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🔹 Totales generales
    const totalUsers = await db.user.count();
    const totalOrders = await db.order.count();

    const orders = await db.order.findMany({
      select: { totalPrice: true },
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    const activeAccounts = await db.streamingAccount.count({
      where: { active: true },
    });

    // 🔹 Ventas de los últimos 6 meses
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyOrders = await db.order.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: { gte: sixMonthsAgo },
      },
      _sum: { totalPrice: true },
      _count: { id: true },
    });

    // 🔹 Tipos para los arreglos
    type MonthlyStat = {
      name: string;
      sales: number;
      orders: number;
    };

    type UserGrowthStat = {
      name: string;
      users: number;
    };

    const monthlyData: MonthlyStat[] = [];
    const userGrowthData: UserGrowthStat[] = [];

    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    // 🔹 Construir datos mensuales de ventas
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthOrders = monthlyOrders.filter(
        (order) => order.createdAt >= monthStart && order.createdAt <= monthEnd
      );

      const monthSales = monthOrders.reduce(
        (sum, order) => sum + (order._sum.totalPrice || 0),
        0
      );

      const monthOrderCount = monthOrders.reduce(
        (sum, order) => sum + order._count.id,
        0
      );

      monthlyData.push({
        name: monthNames[date.getMonth()],
        sales: monthSales,
        orders: monthOrderCount,
      });
    }

    // 🔹 Crecimiento de usuarios
    const userGrowth = await db.user.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: { gte: sixMonthsAgo },
      },
      _count: { id: true },
    });

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthUsers = userGrowth.filter(
        (user) => user.createdAt >= monthStart && user.createdAt <= monthEnd
      );

      const userCount = monthUsers.reduce(
        (sum, user) => sum + user._count.id,
        0
      );

      userGrowthData.push({
        name: monthNames[date.getMonth()],
        users: userCount,
      });
    }

    // 🔹 Resultado final
    const stats = {
      totalUsers,
      totalOrders,
      totalRevenue,
      activeAccounts,
      monthlyData,
      userGrowthData,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Error fetching stats" },
      { status: 500 }
    );
  }
}
