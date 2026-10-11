import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
        where: { userId: session.user.id },
        include: {
            address: true,
            orderItems: { include: { product: true } },
            store: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
}

export async function POST(req) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const body = await req.json();
    const { addressId, paymentMethod, items } = body;
    // items: [{ productId, quantity }]

    if (!addressId || !Array.isArray(items) || items.length === 0) {
        return NextResponse.json({ error: "Address and at least one item are required" }, { status: 400 });
    }

    const address = await prisma.address.findFirst({
        where: { id: addressId, userId: session.user.id },
    });
    if (!address) {
        return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

    if (products.length !== productIds.length) {
        return NextResponse.json({ error: "One or more products could not be found" }, { status: 400 });
    }

    // This starter catalog is a single store, so every order belongs to one store.
    // If a multi-vendor cart is introduced later, split into one order per store here.
    const storeId = products[0].storeId;

    let total = 0;
    const orderItemsData = items.map(({ productId, quantity }) => {
        const product = products.find((p) => p.id === productId);
        const qty = Math.max(1, Number(quantity) || 1);
        total += product.price * qty;
        return { productId, quantity: qty, price: product.price };
    });

    const order = await prisma.order.create({
        data: {
            total,
            userId: session.user.id,
            storeId,
            addressId,
            paymentMethod: paymentMethod === "STRIPE" ? "STRIPE" : "COD",
            isPaid: false,
            orderItems: { create: orderItemsData },
        },
        include: {
            address: true,
            orderItems: { include: { product: true } },
        },
    });

    return NextResponse.json({ order });
}
