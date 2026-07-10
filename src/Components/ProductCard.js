'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Star, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'
import LoginRequiredModal from './LoginRequiredModal'

export default function ProductCard({ product, showBrand }) {
  const discount = Math.round((product.mrp - product.price) / product.mrp * 100)
  const { addToCart } = useCart()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setShowLoginModal(true)
      return
    }

    addToCart(product, 1)
  }

  return (
    <>
      <Link href={`/products/${product.id}`}>
        <div className="bg-white rounded-[24px] p-4 cursor-pointer group transition-all duration-300 hover:-translate-y-2.5"
          style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.12)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.06)'}
        >
          <div
            className="h-52 w-full rounded-2xl mb-4 flex items-center justify-center p-3"
            style={{ background: 'linear-gradient(180deg, #FFFFFF, #F8F6F1)' }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain group-hover:scale-105 transition-transform"
            />
          </div>

          {showBrand && (
            <p className="text-xs text-[#6B7280] mb-1">{product.brand}</p>
          )}

          {product.badge && (
            <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full font-semibold mb-2 ${product.badge === 'New' ? 'bg-[#101214] text-[#B7FF1E]' : 'bg-[#B7FF1E] text-[#101214]'}`}>
              {product.badge}
            </span>
          )}

          <p className="text-sm font-semibold text-[#161616] mb-2 leading-snug line-clamp-2">{product.name}</p>

          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
              <span className="text-xs font-semibold text-[#161616]">{product.rating}</span>
              {product.reviews && (
                <span className="text-xs text-[#6B7280]">({product.reviews})</span>
              )}
            </div>
          )}

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-base font-bold text-[#161616]">₹{product.price.toLocaleString()}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-xs text-[#9CA3AF] line-through">₹{product.mrp.toLocaleString()}</span>
                <span className="text-xs text-green-600 font-semibold">{discount}% off</span>
              </>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-[#B7FF1E] hover:bg-[#C8FF4A] text-[#101214] text-sm font-semibold rounded-[14px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            style={{ height: '48px' }}
          >
            <ShoppingCart className="w-4 h-4" strokeWidth={2} />
            Add to Cart
          </button>
        </div>
      </Link>

      <LoginRequiredModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  )
}