const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// A single system seller account that owns the starter catalog.
// Real sellers can sign up later via /create-store once that flow is built.
const SYSTEM_SELLER_ID = "system-seller";
const SYSTEM_STORE_ID = "cartify-official-store";

const products = [
    { name: "Modern Table Lamp", description: "A sleek table lamp with a minimalist design, perfect for any room. Built with high-quality materials and a warm ambient glow.", mrp: 1499, price: 999, images: ["/products/product_img1.png", "/products/product_img2.png"], category: "Decoration" },
    { name: "Smart Speaker - Gray", description: "Fill your room with rich, room-shaking sound. Voice-assistant ready with a sleek, compact design.", mrp: 3499, price: 2499, images: ["/products/product_img2.png"], category: "Speakers" },
    { name: "Smart Watch - White", description: "Track your fitness, calls, and notifications with this stylish smart watch. Long battery life and a vibrant display.", mrp: 5999, price: 3999, images: ["/products/product_img3.png"], category: "Watch" },
    { name: "Wireless Headphones", description: "Immerse yourself in crystal-clear sound with active noise cancellation and 40 hours of battery life.", mrp: 4999, price: 2999, images: ["/products/product_img4.png"], category: "Headphones" },
    { name: "Smart Watch - Black", description: "A bold black smart watch with heart-rate monitoring, GPS, and a scratch-resistant display.", mrp: 5499, price: 3499, images: ["/products/product_img5.png"], category: "Watch" },
    { name: "Security Camera", description: "1080p HD security camera with night vision, motion detection, and two-way audio. Easy to set up.", mrp: 3999, price: 2199, images: ["/products/product_img6.png"], category: "Camera" },
    { name: "Smart Pen for iPad", description: "Precise, pressure-sensitive stylus for note-taking, sketching, and design work. Magnetic charging.", mrp: 8999, price: 6499, images: ["/products/product_img7.png"], category: "Accessories" },
    { name: "Home Theater System", description: "5.1 channel home theater system with deep bass and immersive surround sound for movie nights.", mrp: 29999, price: 21999, images: ["/products/product_img8.png"], category: "Audio" },
    { name: "Apple Wireless Earbuds", description: "Premium wireless earbuds with active noise cancellation and spatial audio.", mrp: 24900, price: 19900, images: ["/products/product_img9.png"], category: "Earbuds" },
    { name: "Apple Smart Watch", description: "Advanced health tracking, always-on display, and seamless integration with your devices.", mrp: 45900, price: 38900, images: ["/products/product_img10.png"], category: "Watch" },
    { name: "RGB Gaming Mouse", description: "High-precision gaming mouse with customizable RGB lighting and programmable buttons.", mrp: 2499, price: 1499, images: ["/products/product_img11.png"], category: "Accessories" },
    { name: "Smart Home Cleaner", description: "Robot vacuum with smart mapping, app control, and automatic docking for effortless cleaning.", mrp: 18999, price: 13999, images: ["/products/product_img12.png"], category: "Home" },
];

async function main() {
    // Seller account behind the starter store
    await prisma.user.upsert({
        where: { id: SYSTEM_SELLER_ID },
        update: {},
        create: {
            id: SYSTEM_SELLER_ID,
            name: "Cartify Official",
            email: "seller@cartify.local",
            image: "",
        },
    });

    // The store all starter products belong to
    await prisma.store.upsert({
        where: { id: SYSTEM_STORE_ID },
        update: { logo: "/store-logo.svg" },
        create: {
            id: SYSTEM_STORE_ID,
            userId: SYSTEM_SELLER_ID,
            name: "Cartify Official Store",
            description: "The official Cartify starter catalog.",
            username: "cartify-official",
            address: "Pune, Maharashtra, India",
            status: "approved",
            isActive: true,
            logo: "/store-logo.svg",
            email: "seller@cartify.local",
            contact: "9999999999",
        },
    });

    for (const p of products) {
        const existing = await prisma.product.findFirst({ where: { name: p.name, storeId: SYSTEM_STORE_ID } });
        if (existing) {
            await prisma.product.update({ where: { id: existing.id }, data: p });
        } else {
            await prisma.product.create({ data: { ...p, storeId: SYSTEM_STORE_ID } });
        }
    }

    console.log(`Seeded ${products.length} products under "${SYSTEM_STORE_ID}".`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
