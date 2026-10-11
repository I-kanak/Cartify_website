'use client'
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useSession } from "next-auth/react"
import { setProduct } from "@/lib/features/product/productSlice"
import { setAddressList } from "@/lib/features/address/addressSlice"

// Mounted once near the root of the app. Keeps the Redux store (which the
// existing UI already reads from) filled with real data from the database.
export default function AppDataLoader() {
    const dispatch = useDispatch()
    const { status } = useSession()

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const res = await fetch("/api/products")
                const data = await res.json()
                if (res.ok) dispatch(setProduct(data.products))
            } catch (err) {
                console.error("Failed to load products:", err)
            }
        }
        loadProducts()
    }, [dispatch])

    useEffect(() => {
        const loadAddresses = async () => {
            if (status !== "authenticated") return
            try {
                const res = await fetch("/api/address")
                const data = await res.json()
                if (res.ok) dispatch(setAddressList(data.addresses))
            } catch (err) {
                console.error("Failed to load addresses:", err)
            }
        }
        loadAddresses()
    }, [status, dispatch])

    return null
}
