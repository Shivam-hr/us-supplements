'use client'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useWishlist } from '../../context/WishlistContext'
import ProductCard from '../../Components/ProductCard'

export default function WishlistPage() {
  const { wishlistItems, clearWishlist, totalWishlist } = useWishlist()

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-8">
        <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ background: '#FEE2E2' }}>
          <Heart className="w-10 h-10 text-red-400" strokeWidth={1.75} />
        </div>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Your wishlist is empty</h1>
        <p className="text-gray-400 text-sm text-center -mt-3">
          Save products you love here for later.
        </p>
        <Link href="/products">
          <button className="bg-[#C6FF1E] text-[#1A1A1A] font-bold px-8 py-3 rounded-xl text-sm hover:brightness-110 transition-all">
            Start Shopping
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] lg:bg-white pb-10">

      {/* Mobile — compact header */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
        <Link href="/account" className="flex items-center gap-3 min-w-0">
          <span className="text-xl shrink-0">←</span>
          <span className="text-base font-black text-[#161616] truncate">My Wishlist ({totalWishlist})</span>
        </Link>
        <button onClick={clearWishlist} className="text-xs text-red-400 font-semibold shrink-0">
          Clear
        </button>
      </div>

      {/* Desktop — header */}
      <div className="hidden lg:flex border-b border-gray-100 px-16 py-5 items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A1A]">Your Wishlist</h1>
          <p className="text-sm text-gray-400 mt-0.5">{totalWishlist} {totalWishlist === 1 ? 'item' : 'items'}</p>
        </div>
        <button
          onClick={clearWishlist}
          className="text-sm text-red-400 hover:text-red-600 transition-colors"
        >
          Clear wishlist
        </button>
      </div>

      <div className="px-4 py-5 lg:px-16 lg:py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlistItems.map(product => (
            <ProductCard key={product.id} product={product} showBrand />
          ))}
        </div>
      </div>
    </div>
  )
}