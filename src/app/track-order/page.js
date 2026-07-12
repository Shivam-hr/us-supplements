'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

const ACCENT = '#B7FF1E'
const DARK = '#101214'

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: '📦' },
  { key: 'paid', label: 'Order Confirmed', icon: '✅' },
  { key: 'processing', label: 'Processing', icon: '⚙️' },
  { key: 'shipped', label: 'Shipped', icon: '🚚' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🛵' },
  { key: 'delivered', label: 'Delivered', icon: '🏠' },
]

const statusIndex = {
  pending: 0, paid: 1, processing: 2, shipped: 3, out_for_delivery: 4, delivered: 5, cancelled: -1,
}

const statusColor = {
  pending: { bg: '#FEF9C3', text: '#854D0E' },
  paid: { bg: '#DBEAFE', text: '#1E40AF' },
  processing: { bg: '#EDE9FE', text: '#5B21B6' },
  shipped: { bg: '#CFFAFE', text: '#155E75' },
  out_for_delivery: { bg: '#FEF3C7', text: '#92400E' },
  delivered: { bg: '#DCFCE7', text: '#166534' },
  cancelled: { bg: '#FEE2E2', text: '#991B1B' },
}

function Timeline({ status, placedAt }) {
  const current = statusIndex[status] ?? 0
  if (status === 'cancelled') {
    return (
      <div className="text-center py-6">
        <span className="text-4xl">❌</span>
        <p className="text-sm font-bold text-red-500 mt-2">This order was cancelled</p>
      </div>
    )
  }

  const placedTime = placedAt
    ? new Date(placedAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
    : null

  return (
    <>
      {/* Mobile — vertical timeline, easier to read than a cramped horizontal one on a narrow screen */}
      <div className="md:hidden flex flex-col">
        {statusSteps.map((step, i) => {
          const done = i < current
          const active = i === current
          const isLast = i === statusSteps.length - 1
          const tag = done ? 'Completed' : active ? 'In Progress' : 'Pending'
          const tagStyle = done
            ? { bg: '#DCFCE7', text: '#166534' }
            : active
            ? { bg: '#FEF3C7', text: '#92400E' }
            : { bg: '#F3F4F6', text: '#9CA3AF' }
          return (
            <div key={step.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0 transition-all"
                  style={{
                    background: done || active ? ACCENT : '#F3F4F6',
                    boxShadow: active ? `0 0 0 4px rgba(183,255,30,0.25)` : 'none',
                  }}
                >
                  {step.icon}
                </div>
                {!isLast && (
                  <div className="w-0.5 flex-1 my-1" style={{ background: done ? ACCENT : '#E5E7EB', minHeight: '28px' }} />
                )}
              </div>
              <div className="flex-1 min-w-0 pb-5 flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold" style={{ color: done || active ? '#161616' : '#9CA3AF' }}>
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {i === 0 && placedTime ? placedTime : done || active ? '' : '—'}
                  </p>
                </div>
                <span
                  className="text-[10px] font-black px-2.5 py-1 rounded-full shrink-0"
                  style={{ background: tagStyle.bg, color: tagStyle.text }}
                >
                  {tag}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop — horizontal timeline */}
      <div className="hidden md:block relative py-2">
        <div className="absolute top-5 left-5 right-5 h-0.5" style={{ background: '#E5E7EB' }} />
        <div
          className="absolute top-5 left-5 h-0.5 transition-all duration-700"
          style={{
            background: ACCENT,
            width: current > 0 ? `${(current / (statusSteps.length - 1)) * 100}%` : '0%',
          }}
        />
        <div className="relative flex justify-between">
          {statusSteps.map((step, i) => {
            const done = i <= current
            const active = i === current
            return (
              <div key={step.key} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black z-10 transition-all"
                  style={{
                    background: done ? ACCENT : '#E5E7EB',
                    color: done ? DARK : '#9CA3AF',
                    boxShadow: active ? `0 0 0 4px rgba(183,255,30,0.25)` : 'none',
                  }}
                >
                  {done ? '✓' : i + 1}
                </div>
                <p className="text-[10px] font-bold text-center leading-tight"
                  style={{ color: done ? '#161616' : '#9CA3AF' }}
                >
                  {step.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

function OrderCard({ order, onClick }) {
  const sc = statusColor[order.status] || statusColor.pending
  const firstItem = order.items?.[0]
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 cursor-pointer hover:border-[#B7FF1E] hover:shadow-md transition-all flex items-center gap-3 md:gap-4"
    >
      {firstItem?.image && (
        <img
          src={firstItem.image}
          alt={firstItem.name}
          className="w-16 h-16 object-contain rounded-xl shrink-0"
          style={{ background: '#F7F8FA' }}
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-black text-[#161616]">
            Order #USS-{order.id.substring(0, 8).toUpperCase()}
          </p>
          <span
            className="text-[10px] font-black px-2.5 py-1 rounded-full capitalize"
            style={{ background: sc.bg, color: sc.text }}
          >
            {order.status}
          </span>
        </div>
        <p className="text-xs text-gray-500 truncate mb-1">
          {firstItem?.name}
          {order.items?.length > 1 ? ` +${order.items.length - 1} more` : ''}
        </p>
        <div className="flex items-center gap-3 text-[10px] text-gray-400">
          <span>{order.items?.length} {order.items?.length === 1 ? 'item' : 'items'}</span>
          <span>•</span>
          <span>
            {order.created_at
              ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
              : 'Recent'}
          </span>
          <span>•</span>
          <span className="font-black text-[#161616]">₹{order.total?.toLocaleString()}</span>
        </div>
      </div>
      <span className="text-gray-300 text-lg shrink-0">›</span>
    </div>
  )
}

function OrderDetail({ order, onBack }) {
  const sc = statusColor[order.status] || statusColor.pending
  const [summaryOpen, setSummaryOpen] = useState(true)
  const itemCount = (order.items || []).reduce((sum, item) => sum + (item.quantity || 1), 0)

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <button
        onClick={onBack}
        className="hidden md:flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#161616] transition-colors w-fit"
      >
        ← Back to Orders
      </button>

      <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 border border-gray-100">
        <div className="flex items-start justify-between mb-1 gap-2">
          <h2 className="text-lg md:text-xl font-black text-[#161616] break-all">
            Order #USS-{order.id.substring(0, 8).toUpperCase()}
          </h2>
          <span
            className="text-xs font-black px-3 py-1.5 rounded-full capitalize shrink-0"
            style={{ background: sc.bg, color: sc.text }}
          >
            {order.status}
          </span>
        </div>
        <p className="text-sm text-gray-400">
          Placed on {order.created_at
            ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
            : 'Recent'}
          {' • '}₹{order.total?.toLocaleString()}
        </p>
      </div>

      <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 border border-gray-100">
        <h3 className="font-black text-[#161616] mb-4 md:mb-5">Delivery Progress</h3>
        <Timeline status={order.status} placedAt={order.created_at} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
        <div className="bg-white rounded-2xl md:rounded-3xl p-5 border border-gray-100">
          <h3 className="font-black text-[#161616] mb-4">Shipment Details</h3>
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Delivery Address</p>
              <p className="text-sm font-semibold text-[#161616] leading-relaxed">
                {order.full_name}<br />
                {order.address},<br />
                {order.city}, {order.state} - {order.pincode}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Phone</p>
              <p className="text-sm font-semibold text-[#161616]">{order.phone}</p>
            </div>
            {order.razorpay_payment_id && (
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Payment ID</p>
                <p className="text-xs font-mono text-[#161616] break-all">{order.razorpay_payment_id}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl md:rounded-3xl p-5 border border-gray-100">
          <button
            onClick={() => setSummaryOpen(o => !o)}
            className="w-full flex items-center justify-between gap-3"
          >
            <h3 className="font-black text-[#161616]">Order Summary</h3>
            <span className="flex items-center gap-2 text-xs font-bold text-gray-400 shrink-0">
              {itemCount} {itemCount === 1 ? 'Item' : 'Items'} • ₹{order.total?.toLocaleString()}
              <span className="text-[#161616] transition-transform" style={{ transform: summaryOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
            </span>
          </button>

          {summaryOpen && (
            <div className="flex flex-col gap-3 mt-4">
              {(order.items || []).map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-contain rounded-xl shrink-0"
                    style={{ background: '#F7F8FA' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#161616] line-clamp-2 leading-snug">{item.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Qty: {item.quantity} • ₹{item.price?.toLocaleString()}</p>
                  </div>
                  <p className="text-xs font-black text-[#161616] shrink-0">
                    ₹{(item.price * item.quantity)?.toLocaleString()}
                  </p>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <p className="text-xs font-bold text-gray-500">Delivery</p>
                <p className="text-xs font-bold text-green-600">
                  {order.delivery_charge === 0 ? 'FREE' : `₹${order.delivery_charge}`}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm font-black text-[#161616]">Total</p>
                <p className="text-sm font-black text-[#161616]">₹{order.total?.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl md:rounded-3xl p-5 md:p-6" style={{ background: '#F8F6F1' }}>
        <p className="font-black text-[#161616] mb-1">Need help with your order?</p>
        <p className="text-sm text-gray-500 mb-4">Our support team is here to assist you.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:brightness-110"
            style={{ background: ACCENT, color: DARK }}
          >
            💬 WhatsApp Us
          </a>
          <a
            href="mailto:support@ussupplements.in"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border border-gray-200 hover:border-gray-400 transition-all text-[#161616]"
          >
            📧 Email Us
          </a>
        </div>
      </div>
    </div>
  )
}

function NotLoggedIn() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2" style={{ background: DARK }}>
      <div className="order-2 lg:order-1 flex flex-col justify-center px-6 py-10 md:px-16 md:py-16">
        <div className="hidden lg:flex items-center gap-2 mb-12">
          <div className="font-black text-sm px-2.5 py-1 rounded" style={{ background: ACCENT, color: DARK }}>US</div>
          <span className="text-white font-black text-lg">SUPPLEMENTS</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3">
          Track Your Orders.<br />
          <span style={{ color: ACCENT }}>Manage Your<br />Supplements.</span>
        </h1>
        <p className="text-zinc-400 text-sm mb-6 md:mb-8">
          Login to view your orders, delivery updates, and purchase history.
        </p>
        <div className="flex flex-col gap-4 mb-8 md:mb-10">
          {[
            { icon: '📍', title: 'Track orders in real time', desc: 'Get live updates on your delivery status' },
            { icon: '📋', title: 'View purchase history', desc: 'Access all your past orders in one place' },
            { icon: '⚡', title: 'Faster checkout', desc: 'Save your details for quick future purchases' },
            { icon: '❤️', title: 'Save your favourite products', desc: 'Create your own wishlist' },
          ].map(item => (
            <div key={item.title} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm"
                style={{ background: 'rgba(183,255,30,0.1)', border: '1px solid rgba(183,255,30,0.2)' }}
              >
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{item.title}</p>
                <p className="text-xs text-zinc-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-6 flex-wrap">
          {[
            { number: '10K+', label: 'Orders Delivered' },
            { number: '5K+', label: 'Happy Customers' },
            { number: '4.8', label: 'Customer Rating' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-xl font-black" style={{ color: ACCENT }}>{stat.number}</p>
              <p className="text-xs text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="order-1 lg:order-2 flex items-center justify-center px-5 py-8 md:px-12 md:py-16">
        <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl">
          <h2 className="text-xl md:text-2xl font-black text-[#161616] mb-1">
            Welcome <span style={{ color: ACCENT }}>Back!</span>
          </h2>
          <p className="text-sm text-gray-400 mb-6">Login to your account</p>
          <div className="flex flex-col gap-4">
            <Link href="/login">
              <button className="w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all hover:brightness-110"
                style={{ background: ACCENT, color: DARK }}
              >
                Login to Account →
              </button>
            </Link>
            <p className="text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <Link href="/login" className="font-black" style={{ color: ACCENT }}>Create Account</Link>
            </p>
          </div>
          <div className="border-t border-gray-100 mt-6 pt-5 grid grid-cols-3 gap-2 md:gap-3">
            {[
              { icon: '✅', title: '100% Authentic', desc: 'Genuine Products' },
              { icon: '🔒', title: 'Secure Payments', desc: 'Safe & Trusted' },
              { icon: '↩️', title: 'Easy Returns', desc: 'Hassle Free' },
            ].map(item => (
              <div key={item.title} className="text-center">
                <span className="text-lg">{item.icon}</span>
                <p className="text-[10px] font-bold text-[#161616] mt-1">{item.title}</p>
                <p className="text-[10px] text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TrackOrderPage() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filter, setFilter] = useState('All Orders')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setAuthLoading(false)
      if (data.user) fetchOrders(data.user.id)
    })
  }, [])

  const fetchOrders = async (userId) => {
    setOrdersLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setOrdersLoading(false)
  }

  const filters = ['All Orders', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
  const filteredOrders = filter === 'All Orders'
    ? orders
    : orders.filter(o => o.status?.toLowerCase() === filter.toLowerCase())

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F7F8FA' }}>
        <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: ACCENT, borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  if (!user) return <NotLoggedIn />

  return (
    <div className="min-h-screen pb-16" style={{ background: '#F7F8FA' }}>

      {/* Mobile — compact app bar */}
      <div style={{ background: DARK }} className="md:hidden px-4 py-4 flex items-center justify-between">
        {selectedOrder ? (
          <button onClick={() => setSelectedOrder(null)} className="text-white flex items-center gap-3 min-w-0">
            <span className="text-xl shrink-0">←</span>
            <span className="text-base font-black truncate">Order #USS-{selectedOrder.id.substring(0, 8).toUpperCase()}</span>
          </button>
        ) : (
          <Link href="/" className="text-white flex items-center gap-3">
            <span className="text-xl">←</span>
            <span className="text-base font-black">My Orders</span>
          </Link>
        )}
        <Link href="/support" className="text-xl shrink-0" aria-label="Support">🎧</Link>
      </div>

      {/* Desktop — hero header */}
      <div style={{ background: DARK }} className="hidden md:block px-16 py-10">
        <h1 className="text-3xl font-black text-white mb-1">
          Track <span style={{ color: ACCENT }}>Your Orders</span>
        </h1>
        <p className="text-zinc-400 text-sm">View and track all your orders in one place.</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 md:px-6 md:py-8">
        {selectedOrder ? (
          <OrderDetail order={selectedOrder} onBack={() => setSelectedOrder(null)} />
        ) : (
          <>
            <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0"
                  style={{
                    background: filter === f ? DARK : 'white',
                    color: filter === f ? ACCENT : '#6B7280',
                    border: filter === f ? `2px solid ${DARK}` : '2px solid #E5E7EB',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: ACCENT, borderTopColor: 'transparent' }}
                />
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl md:rounded-3xl p-8 md:p-12 text-center border border-gray-100">
                <span className="text-5xl mb-4 block">📦</span>
                <p className="font-black text-[#161616] mb-2">No orders found</p>
                <p className="text-sm text-gray-400 mb-5">
                  {filter === 'All Orders' ? "You haven't placed any orders yet." : `No ${filter.toLowerCase()} orders found.`}
                </p>
                <Link href="/products">
                  <button className="px-6 py-3 rounded-xl text-sm font-black transition-all hover:brightness-110"
                    style={{ background: ACCENT, color: DARK }}
                  >
                    Start Shopping
                  </button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onClick={() => setSelectedOrder(order)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}