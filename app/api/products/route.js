import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            where: { inStock: true },
            include: {
                store: true,
                rating: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ products });
    } catch (error) {
        console.error("GET /api/products failed:", error);
        return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
    }
}
