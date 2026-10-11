import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { productId } = await params;
        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: { store: true, rating: true },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ product });
    } catch (error) {
        console.error("GET /api/products/[productId] failed:", error);
        return NextResponse.json({ error: "Failed to load product" }, { status: 500 });
    }
}
