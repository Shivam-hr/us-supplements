'use client'
import Link from 'next/link'
import { useCart } from '../context/CartContext'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import { categories } from '../data/products'

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
  
  const searchRef = useRef(null)
  const [isFocused, setIsFocused] = useState(false)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [liveResults, setLiveResults] = useState([])
  const [defaultProducts, setDefaultProducts] = useState([])
  const [categoriesOpen, setCategoriesOpen] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % searchPlaceholders.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchSearch = async () => {
      if (!searchQuery.trim()) {
        if (defaultProducts.length === 0) {
          const { data } = await supabase.from('products').select('*').limit(6)
          setDefaultProducts(data || [])
          setLiveResults(data || [])
        } else {
          setLiveResults(defaultProducts)
        }
        return
      }

      const { data } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${searchQuery}%`)
        .limit(6)
        
      setLiveResults(data || [])
    }

    const timeoutId = setTimeout(fetchSearch, 200)
    return () => clearTimeout(timeoutId)
  }, [searchQuery, defaultProducts])

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsFocused(false)
    }
  }

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
    <div className="sticky top-0 z-50 bg-[#000000]">
      {/* Top Banner Accent strip */}
      <div className="bg-[#0A0A0A] text-[#E8E8E8] text-xs text-center py-2 tracking-wide border-b border-zinc-900">
        Free shipping on prepaid orders above ₹499 <span className="text-[#C6FF1E]">•</span> 100% authentic, sourced directly from brands
      </div>

      {/* Main Bar */}
      <div className="flex items-center justify-between px-8 py-4 bg-[#000000]">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="bg-[#C6FF1E] text-black font-extrabold px-3 py-1 rounded text-sm tracking-tighter">US</div>
          <span className="font-black text-white text-xl tracking-tight uppercase">Supplements</span>
        </Link>

        {/* MAXIMUM EXPANDED SEARCH CONTAINER */}
        <div className="flex-1 max-w-2xl mx-12 relative" ref={searchRef}>
          <div className="flex items-center gap-3 bg-[#111111] rounded-lg px-4 py-3 border border-zinc-800 focus-within:border-zinc-700 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              onFocus={() => setIsFocused(true)}
              placeholder={searchPlaceholders[placeholderIndex]}
              className="bg-transparent w-full text-sm text-white placeholder-zinc-500 font-medium outline-none"
            />
          </div>

          {/* SIGNIFICANTLY WIDER DROPDOWN CONTAINER */}
          {isFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-200 overflow-hidden z-50">
              
              {/* Popular Choices Strip */}
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Popular Choices</p>
                <div className="flex flex-wrap gap-2">
                  {['Creatine', 'Mass Gainer', 'Whey Protein'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSearchQuery(tag)
                        router.push(`/products?search=${encodeURIComponent(tag)}`)
                        setIsFocused(false)
                      }}
                      className="text-xs font-bold px-4 py-2 bg-white border border-gray-200 hover:border-black text-gray-700 hover:text-black rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid Area */}
              <div className="p-5 max-h-[480px] overflow-y-auto">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  {searchQuery.trim() ? 'Search Results' : 'Recommended For You'}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {liveResults.length > 0 ? liveResults.map(p => (
                    <Link
                      key={p.id}
                      href={`/products/${p.id}`}
                      onClick={() => {
                        setIsFocused(false)
                        setSearchQuery('')
                      }}
                      className="flex items-center gap-4 p-2.5 hover:bg-gray-50 rounded-xl transition-all group border border-transparent"
                    >
                      <img src={p.image} className="w-16 h-14 object-contain bg-white rounded-lg border border-gray-100 shrink-0 p-1" />
                      <div className="flex flex-col justify-center min-w-0">
                        <p className="text-xs font-bold text-zinc-900 truncate leading-snug group-hover:text-zinc-600 transition-colors">{p.name}</p>
                        <p className="text-xs font-extrabold text-zinc-900 mt-1">₹{p.price.toLocaleString()}</p>
                      </div>
                    </Link>
                  )) : (
                    <p className="text-sm text-gray-400 col-span-2 py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      No results found for "{searchQuery}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile/Cart Actions Panel */}
        <div className="flex items-center gap-6 text-white shrink-0">
          {user ? (
            <Link href="/account" className="flex flex-col items-center gap-1 hover:text-[#C6FF1E] transition-colors group">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 group-hover:text-[#C6FF1E]">Account</span>
            </Link>
          ) : (
            <Link href="/login" className="flex flex-col items-center gap-1 hover:text-[#C6FF1E] transition-colors group">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 group-hover:text-[#C6FF1E]">Login</span>
            </Link>
          )}

          <Link href="/wishlist" className="flex flex-col items-center gap-1 hover:text-[#C6FF1E] transition-colors group">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 group-hover:text-[#C6FF1E]">Wishlist</span>
          </Link>

          <Link href="/cart" className="flex flex-col items-center gap-1 relative hover:text-[#C6FF1E] transition-colors group">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 group-hover:text-[#C6FF1E]">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#C6FF1E] text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* FIXED VISIBILITY LINKS AREA */}
      <div className="flex items-center justify-center gap-8 px-8 py-3.5 bg-[#080B0D] border-b border-zinc-900 text-xs font-bold uppercase tracking-wider text-zinc-300">

        {/* ALL CATEGORIES — hover dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setCategoriesOpen(true)}
          onMouseLeave={() => setCategoriesOpen(false)}
        >
          <span className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors text-xs">
            All categories
            <svg xmlns="http://www.w3.org/2000/svg" className={`w-3 h-3 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </span>

          {categoriesOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-56 z-50">
              <div className="bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-gray-200 overflow-hidden py-2">
                {categories.map(cat => (
                  <Link
                    key={cat}
                    href={`/products?category=${encodeURIComponent(cat)}`}
                    onClick={() => setCategoriesOpen(false)}
                    className="block px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-700 hover:bg-gray-50 hover:text-[#1A1A1A] transition-colors normal-case"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* BRANDS — scrolls to Shop by brand section */}
        <Link href="/#shop-by-brand" className="cursor-pointer hover:text-white transition-colors">
          Brands
        </Link>

        <span className="bg-[#C6FF1E] text-black font-black px-3 py-0.5 rounded-full text-[10px]">Offers</span>
        <span className="cursor-pointer hover:text-white transition-colors">Best sellers</span>
        <span className="cursor-pointer hover:text-white transition-colors">Authenticity</span>
        <Link href="/track-order" className="cursor-pointer hover:text-white transition-colors">Track order</Link>
        <span className="cursor-pointer hover:text-white transition-colors">Support</span>
      </div>

     
      
    </div>
  )
}