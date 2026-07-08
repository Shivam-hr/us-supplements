'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

const ACCENT = '#B7FF1E'

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleTrack = async () => {
    if (!orderId.trim()) return
    setLoading(true)
    setNotFound(false)
    setOrder(null)
    setSearched(true)

    // Strip USS- prefix if user types it
    const cleanId = orderId.replace('USS-', '').toLowerCase()

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .ilike('id', `${cleanId}%`)
      .single()

    if (error || !data) {
      setNotFound(true)
    } else {
      setOrder(data)
    }
    setLoading(false)
  }

  const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: '🛒' },
    { key: 'paid', label: 'Order Confirmed', icon: '✅' },
    { key: 'processing', label: 'Processing', icon: '⚙️' },
    { key: 'shipped', label: 'Shipped', icon: '📦' },
    { key: 'delivered', label: 'Delivered', icon: '🏠' },
  ]

  const statusIndex = {
    pending: 0,
    paid: 1,
    processing: 2,
    shipped: 3,
    delivered: 4,
    cancelled: -1,
  }

  const currentStep = order ? (statusIndex[order.status] ?? 0) : -1

  return (
    <div className="min-h-screen" style={{ background: '#F7F8FA' }}>

      {/* HERO */}
      <div style={{ background: '#101214' }} className="px-6 pt-14 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #B7FF1E 0%, transparent 60%)' }}
        />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h1 className="text-4xl font-black text-white mb-3 leading-tight">
            Track <span style={{ color: ACCENT }}>Your Order</span>
          </h1>
          <p className="text-zinc-400 text-base mb-2">Stay updated with every step of your delivery.</p>
          <p className="text-zinc-500 text-sm mb-10">Enter your order ID to get real-time updates.</p>

          {/* Search Card */}
          <div className="rounded-3xl p-6"
            style={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div className="flex gap-3">
              <input
                type="text"
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleTrack()}
                placeholder="e.g. USS123456789"
                className="flex-1 px-5 text-sm font-medium text-white placeholder-zinc-500 outline-none rounded-2xl"
                style={{
                  height: '60px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              />
              <button
                onClick={handleTrack}
                disabled={loading}
                className="px-8 font-black text-sm rounded-2xl transition-all shrink-0"
                style={{
                  height: '60px',
                  background: loading ? '#888' : ACCENT,
                  color: '#101214',
                }}
              >
                {loading ? 'Searching...' : 'Track Order'}
              </button>
            </div>
            <p className="text-zinc-600 text-xs mt-3 text-left">
              Your order ID was sent in your confirmation email and is shown on your order success page.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 -mt-6 pb-16">

        {/* NOT FOUND */}
        {searched && notFound && (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 mb-6">
            <span className="text-6xl mb-4 block">📦</span>
            <p className="text-lg font-bold text-[#161616] mb-2">Order not found</p>
            <p className="text-sm text-gray-400 mb-6">
              We couldn't find an order with this ID. Please check and try again.
            </p>
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-bold px-6 py-3 rounded-2xl text-sm transition-all"
              style={{ background: ACCENT, color: '#101214' }}
            >
              Contact Support
            </a>
          </div>
        )}

        {/* ORDER FOUND */}
        {order && (
          <div className="flex flex-col gap-5 mt-2">

            {/* Order Summary Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
              style={{ boxShadow: '0 15px 40px rgba(0,0,0,0.06)' }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-black text-[#161616] text-base">Order Summary</h2>
                <span className="text-xs font-black px-3 py-1.5 rounded-full capitalize"
                  style={{
                    background: order.status === 'delivered' ? '#DCFCE7' : order.status === 'cancelled' ? '#FEE2E2' : '#FEF9C3',
                    color: order.status === 'delivered' ? '#166534' : order.status === 'cancelled' ? '#991B1B' : '#854D0E',
                  }}
                >
                  {order.status}
                </span>
              </div>

              {/* Items */}
              <div className="flex flex-col gap-3 mb-5">
                {(order.items || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-contain rounded-2xl shrink-0"
                      style={{ background: '#F7F8FA' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#161616] leading-snug line-clamp-2">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-black text-[#161616] shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Order ID</p>
                  <p className="text-xs font-black text-[#161616]">USS-{order.id.substring(0, 8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Order Date</p>
                  <p className="text-xs font-black text-[#161616]">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                      : 'Recent'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Total Amount</p>
                  <p className="text-xs font-black text-[#161616]">₹{order.total?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Delivery Timeline */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
              style={{ boxShadow: '0 15px 40px rgba(0,0,0,0.06)' }}
            >
              <h2 className="font-black text-[#161616] text-base mb-6">Delivery Timeline</h2>

              {order.status === 'cancelled' ? (
                <div className="text-center py-4">
                  <span className="text-3xl">❌</span>
                  <p className="text-sm font-bold text-red-500 mt-2">This order was cancelled</p>
                </div>
              ) : (
                <div className="relative">
                  {/* Progress line */}
                  <div className="absolute top-5 left-5 right-5 h-0.5" style={{ background: '#E5E7EB' }} />
                  <div
                    className="absolute top-5 left-5 h-0.5 transition-all"
                    style={{
                      background: ACCENT,
                      width: currentStep > 0 ? `${(currentStep / (statusSteps.length - 1)) * 100}%` : '0%',
                    }}
                  />

                  <div className="relative flex justify-between">
                    {statusSteps.map((step, i) => {
                      const completed = i <= currentStep
                      const active = i === currentStep
                      return (
                        <div key={step.key} className="flex flex-col items-center gap-2 flex-1">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-base z-10 transition-all"
                            style={{
                              background: completed ? ACCENT : '#E5E7EB',
                              boxShadow: active ? `0 0 0 4px rgba(183,255,30,0.2)` : 'none',
                            }}
                          >
                            {completed ? '✓' : step.icon}
                          </div>
                          <p className="text-xs font-bold text-center"
                            style={{ color: completed ? '#161616' : '#9CA3AF' }}
                          >
                            {step.label}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Shipment Details */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
              style={{ boxShadow: '0 15px 40px rgba(0,0,0,0.06)' }}
            >
              <h2 className="font-black text-[#161616] text-base mb-5">Shipment Details</h2>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Delivery Address</p>
                  <p className="text-sm font-bold text-[#161616] leading-relaxed">
                    {order.address}, {order.city},<br />
                    {order.state} - {order.pincode}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Contact</p>
                  <p className="text-sm font-bold text-[#161616]">{order.full_name}</p>
                  <p className="text-sm text-gray-500">{order.phone}</p>
                </div>
                {order.razorpay_payment_id && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400 mb-1">Payment ID</p>
                    <p className="text-sm font-bold text-[#161616] font-mono">{order.razorpay_payment_id}</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* HELP SECTION */}
        <div className="mt-6 rounded-3xl p-6" style={{ background: '#F8F6F1' }}>
          <p className="font-black text-[#161616] text-base mb-1">Need help with your order?</p>
          <p className="text-sm text-gray-500 mb-5">Our support team is here to assist you.</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: '💬', label: 'WhatsApp Support', sub: 'Quick chat with our team', href: 'https://wa.me/919999999999' },
              { icon: '📧', label: 'Email Support', sub: 'support@ussupplements.in', href: 'mailto:support@ussupplements.in' },
              { icon: '📞', label: 'Call Us', sub: '+91 12345 67890', href: 'tel:+911234567890' },
            ].map(item => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl p-4 flex flex-col gap-1 hover:shadow-sm transition-all border border-transparent hover:border-gray-200"
              >
                <span className="text-2xl">{item.icon}</span>
                <p className="text-xs font-black text-[#161616]">{item.label}</p>
                <p className="text-[10px] text-gray-400">{item.sub}</p>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}