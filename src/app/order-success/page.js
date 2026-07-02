'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function OrderSuccess() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('id')
  const shortId = orderId ? orderId.substring(0, 8).toUpperCase() : 'USS00000'

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-8">
      <div className="max-w-lg w-full text-center flex flex-col items-center gap-6">

        <div className="w-24 h-24 bg-[#C6FF1E] rounded-full flex items-center justify-center text-4xl font-bold text-[#1A1A1A]">
          ✓
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-[#1A1A1A]">Order placed!</h1>
          <p className="text-gray-500 text-base">
            Thank you for your order. We'll send you a confirmation shortly.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-2xl px-8 py-5 w-full">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Order ID</p>
          <p className="text-xl font-bold text-[#1A1A1A]">USS-{shortId}</p>
          <p className="text-xs text-gray-400 mt-2">Save this for tracking your order</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 w-full text-left flex flex-col gap-4">
          <p className="text-sm font-bold text-[#1A1A1A]">What happens next?</p>
          {[
            { icon: '📱', title: 'Confirmation SMS', desc: 'You\'ll receive an SMS with your order details' },
            { icon: '📦', title: 'Order processing', desc: 'We\'ll pack your order within 24 hours' },
            { icon: '🚚', title: 'Out for delivery', desc: 'Delivered within 3-5 business days' },
          ].map(step => (
            <div key={step.title} className="flex items-start gap-3">
              <span className="text-xl mt-0.5">{step.icon}</span>
              <div>
                <p className="text-sm font-semibold text-[#1A1A1A]">{step.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 w-full">
          <Link href="/products" className="flex-1">
            <button className="w-full border border-gray-200 text-[#1A1A1A] font-semibold py-3 rounded-xl text-sm hover:border-[#C6FF1E] transition-all">
              Continue shopping
            </button>
          </Link>
          <Link href="/account" className="flex-1">
            <button className="w-full bg-[#C6FF1E] text-[#1A1A1A] font-bold py-3 rounded-xl text-sm hover:brightness-110 transition-all">
              View my orders
            </button>
          </Link>
        </div>

      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <OrderSuccess />
    </Suspense>
  )
}