'use client'
import Link from 'next/link'
import { X, LogIn } from 'lucide-react'

export default function LoginRequiredModal({ open, onClose }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[24px] w-full max-w-sm p-7 relative"
        onClick={e => e.stopPropagation()}
        style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.25)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#161616] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-[#F7F8FA] flex items-center justify-center mb-5">
          <LogIn className="w-6 h-6 text-[#101214]" strokeWidth={2} />
        </div>

        <h2 className="text-xl font-black text-[#161616] mb-2">
          Please log in to continue
        </h2>
        <p className="text-sm text-[#6B7280] mb-6 leading-relaxed">
          You need to be logged in to add items to your cart and place an order.
          It only takes a few seconds.
        </p>

        <div className="flex flex-col gap-2.5">
          <Link
            href="/login"
            className="w-full bg-[#B7FF1E] hover:bg-[#C8FF4A] text-[#101214] font-bold text-sm rounded-xl flex items-center justify-center transition-colors cursor-pointer"
            style={{ height: '50px' }}
          >
            Log In / Sign Up
          </Link>
          <button
            onClick={onClose}
            className="w-full text-[#6B7280] font-medium text-sm hover:text-[#161616] transition-colors cursor-pointer"
            style={{ height: '40px' }}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}