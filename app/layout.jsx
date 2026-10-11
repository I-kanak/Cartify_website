import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/app/AuthProvider";
import StoreProvider from "@/app/StoreProvider";
import AppDataLoader from "@/app/AppDataLoader";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
    title: "Cartify. - Shop smarter",
    description: "Cartify. - Shop smarter",
};

export default function RootLayout({ children }) {
    return (
        <AuthProvider>
            <html lang="en">
                <body className={`${outfit.className} antialiased`}>
                    <StoreProvider>
                        <AppDataLoader />
                        <Toaster />
                        {children}
                    </StoreProvider>
                </body>
            </html>
        </AuthProvider>
    );
}
