import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const VALID_STATUSES = ["ORDER_PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];

export async function PATCH(req, { params }) {
    const session = await auth();
    if (!session?.user?.isAdmin) {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { orderId } = await params;
    const { status } = await req.json();

    if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const order = await prisma.order.update({
        where: { id: orderId },
        data: { status },
    });

    return NextResponse.json({ order });
}
