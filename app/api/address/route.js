import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ addresses });
}

export async function POST(req) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, street, city, state, zip, country, phone } = body;

    if (!name || !email || !street || !city || !state || !zip || !country || !phone) {
        return NextResponse.json({ error: "All address fields are required" }, { status: 400 });
    }

    const address = await prisma.address.create({
        data: {
            userId: session.user.id,
            name,
            email,
            street,
            city,
            state,
            zip: String(zip),
            country,
            phone: String(phone),
        },
    });

    return NextResponse.json({ address });
}
