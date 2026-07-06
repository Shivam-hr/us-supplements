'use client'
import Link from 'next/link'
import { useCart } from '../context/CartContext'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

const searchPlaceholders = [
  "Search for 'Whey Protein'...",
  "Search for 'Creatine'...",
  "Search 'Mass Gainer'...",
  "Search 'MuscleBlaze'..."
]

export default function Navbar() {
  const { totalItems } = useCart()
  const [user, setUser] = useState(null)
  
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  
  // NEW STATES FOR LIVE SEARCH
  const searchRef = useRef(null)
  const [isFocused, setIsFocused] = useState(false)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [liveResults, setLiveResults] = useState([])
  const [defaultProducts, setDefaultProducts] = useState([])

  // 1. Placeholder Animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % searchPlaceholders.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  // 2. Click Outside to Close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 3. Fetch Default & Live Products
  useEffect(() => {
    const fetchSearch = async () => {
      // If empty, show defaults. Fetch defaults if we haven't yet.
      if (!searchQuery.trim()) {
        if (defaultProducts.length === 0) {
          const { data } = await supabase.from('products').select('*').limit(4)
          setDefaultProducts(data || [])
          setLiveResults(data || [])
        } else {
          setLiveResults(defaultProducts)
        }
        return
      }

      // If typing, search live
      const { data } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${searchQuery}%`)
        .limit(4)
        
      setLiveResults(data || [])
    }

    const timeoutId = setTimeout(fetchSearch, 200) // Small delay so it doesn't lag while typing
    return () => clearTimeout(timeoutId)
  }, [searchQuery, defaultProducts])

  // Handle Search Submission
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsFocused(false)
    }
  }

  // Auth Status
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="bg-[#1A1A1A] text-[#E8E8E8] text-xs text-center py-1.5 tracking-wide">
        Free shipping on prepaid orders above ₹499 <span className="text-[#C6FF1E]">•</span> 100% authentic, sourced directly from brands
      </div>

      <div className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="bg-[#1A1A1A] text-[#C6FF1E] font-bold px-2.5 py-1 rounded text-sm">US</div>
          <span className="font-bold text-[#1A1A1A] text-lg tracking-tight">Supplements</span>
        </Link>

        {/* SEARCH BAR CONTAINER */}
        <div className="flex-1 max-w-xl mx-10 relative" ref={searchRef}>
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3 border border-transparent focus-within:border-[#C6FF1E] focus-within:bg-white transition-all shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
           <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            onFocus={() => setIsFocused(true)}
            placeholder={searchPlaceholders[placeholderIndex]}
            className="bg-transparent w-full text-sm text-[#1A1A1A] placeholder-gray-400 outline-none transition-all duration-300"
          />
          </div>

          {/* DROPDOWN MENU */}
          {isFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 overflow-hidden z-50">
              
              {/* Popular Choices */}
              <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">🔥 Popular Choices</p>
                <div className="flex flex-wrap gap-2">
                  {['Creatine', 'Mass Gainer', 'Whey Protein'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSearchQuery(tag)
                        router.push(`/products?search=${encodeURIComponent(tag)}`)
                        setIsFocused(false)
                      }}
                      className="text-xs font-semibold px-3 py-1.5 bg-white border border-gray-200 hover:border-[#C6FF1E] hover:text-[#1A1A1A] rounded-full transition-all shadow-sm flex items-center gap-1"
                    >
                      {tag} <span className="text-gray-400 text-[10px]">↗</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommended / Search Results */}
              <div className="p-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  {searchQuery.trim() ? '🔍 Search Results' : '⭐ Recommended For You'}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {liveResults.length > 0 ? liveResults.map(p => (
                    <Link
                      key={p.id}
                      href={`/products/${p.id}`}
                      onClick={() => {
                        setIsFocused(false)
                        setSearchQuery('')
                      }}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-all group border border-transparent hover:border-gray-100"
                    >
                      <img src={p.image} className="w-14 h-14 object-contain bg-white rounded-lg border border-gray-100 shrink-0 p-1" />
                      <div className="flex flex-col justify-center">
                        <p className="text-[11px] font-semibold text-[#1A1A1A] line-clamp-2 leading-snug group-hover:text-gray-600 transition-colors">{p.name}</p>
                        <p className="text-xs font-bold text-[#1A1A1A] mt-1">₹{p.price.toLocaleString()}</p>
                      </div>
                    </Link>
                  )) : (
                    <p className="text-sm text-gray-400 col-span-2 py-6 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      No products found for "{searchQuery}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 text-[#1A1A1A] shrink-0">
          {user ? (
            <Link href="/account" className="flex flex-col items-center gap-0.5 hover:text-[#C6FF1E] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-[10px]">Account</span>
            </Link>
          ) : (
            <Link href="/login" className="flex flex-col items-center gap-0.5 hover:text-[#C6FF1E] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-[10px]">Login</span>
            </Link>
          )}

          <Link href="/wishlist" className="flex flex-col items-center gap-0.5 hover:text-[#C6FF1E] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-[10px]">Wishlist</span>
          </Link>

          <Link href="/cart" className="flex flex-col items-center gap-0.5 relative hover:text-[#C6FF1E] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-[10px]">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#C6FF1E] text-[#1A1A1A] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>

        </div>
      </div>

      <div className="flex items-center justify-center gap-8 px-8 py-3 border-b border-gray-100 text-sm text-[#1A1A1A]">
        <span className="flex items-center gap-1 cursor-pointer font-medium">All categories <span className="text-xs">▾</span></span>
        <span className="cursor-pointer hover:text-[#C6FF1E] transition-colors">Brands</span>
        <span className="bg-[#C6FF1E] text-[#1A1A1A] font-semibold px-3 py-0.5 rounded-full text-xs cursor-pointer">Offers</span>
        <span className="cursor-pointer hover:text-[#C6FF1E] transition-colors">Best sellers</span>
        <span className="cursor-pointer hover:text-[#C6FF1E] transition-colors">Authenticity</span>
        <Link href="/track-order" className="cursor-pointer hover:text-[#C6FF1E] transition-colors">Track order</Link>
        <span className="cursor-pointer hover:text-[#C6FF1E] transition-colors">Support</span>
      </div>

      <div className="flex items-center gap-8 px-8 py-2.5 bg-gray-50 text-sm text-gray-500 overflow-x-auto whitespace-nowrap border-b border-gray-100">
        {['Protein', 'Mass gainers', 'Pre-workout', 'Creatine', 'BCAA & aminos', 'Vitamins', 'Weight management', 'Accessories'].map((cat, i) => (
          <span key={cat} className={`cursor-pointer pb-0.5 transition-colors hover:text-[#1A1A1A] ${i === 0 ? 'text-[#1A1A1A] font-semibold border-b-2 border-[#C6FF1E]' : ''}`}>
            {cat}
          </span>
        ))}
      </div>
    </div>
  )
}