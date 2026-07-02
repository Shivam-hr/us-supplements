'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)

      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setOrders(orders || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#C6FF1E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-16 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#1A1A1A]">My Account</h1>
            <p className="text-sm text-gray-400 mt-0.5">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="border border-gray-200 text-sm font-semibold px-5 py-2.5 rounded-xl hover:border-red-300 hover:text-red-500 transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="px-16 py-8 grid grid-cols-4 gap-8">

        {/* LEFT — Profile sidebar */}
        <div className="col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-2">
            <div className="w-16 h-16 bg-[#C6FF1E] rounded-full flex items-center justify-center text-2xl font-bold text-[#1A1A1A] mb-3">
              {user?.email?.[0].toUpperCase()}
            </div>
            <p className="font-bold text-[#1A1A1A]">
              {user?.user_metadata?.full_name || 'User'}
            </p>
            <p className="text-sm text-gray-400">{user?.email}</p>

            <div className="border-t border-gray-100 mt-4 pt-4 flex flex-col gap-1">
              {[
                { label: 'My orders', active: true },
                { label: 'Saved addresses', active: false },
                { label: 'Account settings', active: false },
              ].map(item => (
                <button
                  key={item.label}
                  className={`text-left text-sm px-3 py-2 rounded-xl transition-all ${
                    item.active
                      ? 'bg-[#C6FF1E] text-[#1A1A1A] font-semibold'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Orders */}
        <div className="col-span-3 flex flex-col gap-4">
          <h2 className="text-base font-bold text-[#1A1A1A]">
            My Orders ({orders.length})
          </h2>

          {orders.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center flex flex-col items-center gap-4">
              <span className="text-5xl">📦</span>
              <p className="font-semibold text-[#1A1A1A]">No orders yet</p>
              <p className="text-sm text-gray-400">Your orders will appear here after you place them</p>
              <Link href="/products">
                <button className="bg-[#C6FF1E] text-[#1A1A1A] font-bold px-6 py-2.5 rounded-xl text-sm">
                  Start shopping
                </button>
              </Link>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4">

                {/* Order header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Order ID</p>
                    <p className="text-sm font-bold text-[#1A1A1A]">
                      USS-{order.id.substring(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-0.5">Date</p>
                    <p className="text-sm font-medium text-[#1A1A1A]">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })
                        : 'Recent'
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-0.5">Total</p>
                    <p className="text-sm font-bold text-[#1A1A1A]">₹{order.total?.toLocaleString()}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize ${statusColors[order.status] || statusColors.pending}`}>
                    {order.status}
                  </span>
                </div>

                {/* Order items */}
                <div className="border-t border-gray-50 pt-4 flex flex-col gap-3">
                  {(order.items || []).map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-contain rounded-lg bg-gray-50 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1A1A1A] leading-snug line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Qty: {item.quantity} × ₹{item.price?.toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-[#1A1A1A] shrink-0">
                        ₹{(item.price * item.quantity)?.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Delivery address */}
                <div className="border-t border-gray-50 pt-3">
                  <p className="text-xs text-gray-400">
                    Delivering to: {order.address}, {order.city}, {order.state} - {order.pincode}
                  </p>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}