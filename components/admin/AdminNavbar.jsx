'use client'
import Link from "next/link"
import { useSession } from "next-auth/react"
import UserMenu from "@/components/UserMenu"

const AdminNavbar = () => {

    const { data: session } = useSession();

    return (
        <div className="flex items-center justify-between px-12 py-3 border-b border-slate-200 transition-all">
            <Link href="/" className="relative text-4xl font-semibold text-slate-700">
                <span className="text-green-600">Cart</span>ify<span className="text-green-600 text-5xl leading-0">.</span>
                <p className="absolute text-xs font-semibold -top-1 -right-13 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
                    Admin
                </p>
            </Link>
            <div className="flex items-center gap-3">
                <p>Hi, {session?.user?.name?.split(" ")[0] || "Admin"}</p>
                {session?.user && <UserMenu user={session.user} />}
            </div>
        </div>
    )
}

export default AdminNavbar
