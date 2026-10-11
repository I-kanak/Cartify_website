'use client'
import { useState, useRef, useEffect } from "react"
import { signOut } from "next-auth/react"

// Small avatar + dropdown menu for the signed-in user (shows name, email, sign out).
const UserMenu = ({ user }) => {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setOpen((o) => !o)} className="flex items-center">
                {user?.image ? (
                    <img src={user.image} alt={user?.name || "User"} className="size-9 rounded-full object-cover border border-slate-200" />
                ) : (
                    <div className="size-9 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-medium">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                )}
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-50">
                    <p className="px-4 py-1.5 text-sm text-slate-700 truncate">{user?.name}</p>
                    <p className="px-4 pb-2 text-xs text-slate-400 truncate">{user?.email}</p>
                    <hr className="border-slate-100" />
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-slate-50"
                    >
                        Sign out
                    </button>
                </div>
            )}
        </div>
    )
}

export default UserMenu
