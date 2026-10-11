import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();
    if (!session?.user?.isAdmin) {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const orders = await prisma.order.findMany({
        include: {
            user: true,
            address: true,
            store: true,
            orderItems: { include: { product: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
}
