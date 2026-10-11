'use client'
import { useEffect, useState } from "react"
import Loading from "@/components/Loading"
import toast from "react-hot-toast"

const STATUS_OPTIONS = ["ORDER_PLACED", "PROCESSING", "SHIPPED", "DELIVERED"]

const statusStyles = {
    ORDER_PLACED: "text-slate-500 bg-slate-100",
    PROCESSING: "text-yellow-600 bg-yellow-100",
    SHIPPED: "text-blue-600 bg-blue-100",
    DELIVERED: "text-green-600 bg-green-100",
}

export default function AdminOrders() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/admin/orders')
            const data = await res.json()
            if (res.ok) setOrders(data.orders)
            else toast.error(data.error || 'Failed to load orders')
        } catch (err) {
            toast.error('Failed to load orders')
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async (orderId, status) => {
        const prevOrders = orders
        setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o))
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            })
            if (!res.ok) throw new Error()
            toast.success('Order status updated')
        } catch (err) {
            setOrders(prevOrders)
            toast.error('Could not update order status')
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    if (loading) return <Loading />

    return (
        <div className="text-slate-500 mb-40">
            <h1 className="text-2xl">All <span className="text-slate-700 font-medium">Orders</span></h1>
            <p className="text-sm text-slate-400 mt-1 mb-6">{orders.length} orders total</p>

            {orders.length === 0 ? (
                <p className="text-slate-400 mt-10">No orders yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full max-w-6xl text-sm text-left border-collapse">
                        <thead>
                            <tr className="text-slate-600 border-b border-slate-200">
                                <th className="py-3 pr-4">Order</th>
                                <th className="py-3 pr-4">Customer</th>
                                <th className="py-3 pr-4">Items</th>
                                <th className="py-3 pr-4">Address</th>
                                <th className="py-3 pr-4">Total</th>
                                <th className="py-3 pr-4">Payment</th>
                                <th className="py-3 pr-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-b border-slate-100 align-top">
                                    <td className="py-3 pr-4 text-xs text-slate-400">
                                        {order.id.slice(0, 8)}...
                                        <p className="mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </td>
                                    <td className="py-3 pr-4">
                                        <p className="text-slate-700">{order.user?.name}</p>
                                        <p className="text-xs text-slate-400">{order.user?.email}</p>
                                    </td>
                                    <td className="py-3 pr-4">
                                        {order.orderItems.map((item, i) => (
                                            <p key={i}>{item.product?.name} × {item.quantity}</p>
                                        ))}
                                    </td>
                                    <td className="py-3 pr-4 max-w-56">
                                        <p>{order.address?.name}, {order.address?.street}</p>
                                        <p>{order.address?.city}, {order.address?.state} {order.address?.zip}</p>
                                        <p>{order.address?.phone}</p>
                                    </td>
                                    <td className="py-3 pr-4 font-medium text-slate-700">{currency}{order.total}</td>
                                    <td className="py-3 pr-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${order.isPaid ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                                            {order.paymentMethod}{order.paymentMethod === 'COD' ? '' : order.isPaid ? ' - Paid' : ' - Unpaid'}
                                        </span>
                                    </td>
                                    <td className="py-3 pr-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            className={`text-xs rounded-full px-2 py-1.5 border-none outline-none cursor-pointer ${statusStyles[order.status] || 'bg-slate-100 text-slate-500'}`}
                                        >
                                            {STATUS_OPTIONS.map((s) => (
                                                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
