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
  const [typedText, setTypedText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [liveResults, setLiveResults] = useState([])
  const [defaultProducts, setDefaultProducts] = useState([])
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  useEffect(() => {
    const currentPhrase = searchPlaceholders[placeholderIndex]
    let timeout
    if (!isDeleting && typedText.length < currentPhrase.length) {
      timeout = setTimeout(() => setTypedText(currentPhrase.slice(0, typedText.length + 1)), 60)
    } else if (!isDeleting && typedText.length === currentPhrase.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000)
    } else if (isDeleting && typedText.length > 0) {
      timeout = setTimeout(() => setTypedText(currentPhrase.slice(0, typedText.length - 1)), 30)
    } else if (isDeleting && typedText.length === 0) {
      setIsDeleting(false)
      setPlaceholderIndex(prev => (prev + 1) % searchPlaceholders.length)
    }
    return () => clearTimeout(timeout)
  }, [typedText, isDeleting, placeholderIndex])

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
      setMobileSearchOpen(false)
      setMobileMenuOpen(false)
    }
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setMobileSearchOpen(false)
  }, [router])

  return (
    <div className="sticky top-0 z-50 bg-[#000000]">

      {/* Announcement bar */}
      <div className="bg-[#0A0A0A] text-[#E8E8E8] text-[10px] md:text-xs text-center py-1.5 tracking-wide border-b border-zinc-900 px-4">
        Free shipping on prepaid orders above ₹499 <span className="text-[#C6FF1E]">•</span> 100% authentic
      </div>

      {/* Main Bar */}
      <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 bg-[#000000]">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="bg-[#C6FF1E] text-black font-extrabold px-2.5 py-1 rounded text-sm tracking-tighter">US</div>
          <span className="font-black text-white text-base md:text-xl tracking-tight uppercase">Supplements</span>
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-12 relative" ref={searchRef}>
          <div className="flex items-center gap-3 bg-[#111111] rounded-lg px-4 py-3 border border-zinc-800 focus-within:border-zinc-700 transition-all w-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              onFocus={() => setIsFocused(true)}
              placeholder={typedText}
              className="bg-transparent w-full text-sm text-white placeholder-zinc-500 font-medium outline-none"
            />
          </div>

          {isFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-200 overflow-hidden z-50">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
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
                      className="text-xs font-bold px-3 py-1.5 bg-white border border-gray-200 hover:border-black text-gray-700 hover:text-black rounded-lg transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 max-h-[400px] overflow-y-auto">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  {searchQuery.trim() ? 'Search Results' : 'Recommended For You'}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {liveResults.length > 0 ? liveResults.map(p => (
                    <Link
                      key={p.id}
                      href={`/products/${p.id}`}
                      onClick={() => { setIsFocused(false); setSearchQuery('') }}
                      className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-xl transition-all group"
                    >
                      <img src={p.image} className="w-14 h-12 object-contain bg-white rounded-lg border border-gray-100 shrink-0 p-1" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-zinc-900 truncate leading-snug">{p.name}</p>
                        <p className="text-xs font-extrabold text-zinc-900 mt-1">₹{p.price?.toLocaleString()}</p>
                      </div>
                    </Link>
                  )) : (
                    <p className="text-sm text-gray-400 col-span-2 py-6 text-center">No results found</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-6 text-white shrink-0">
          {user ? (
            <div
              className="relative"
              onMouseEnter={() => setAccountOpen(true)}
              onMouseLeave={() => setAccountOpen(false)}
            >
              <div className="flex flex-col items-center gap-1 hover:text-[#C6FF1E] transition-colors cursor-pointer group">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 group-hover:text-[#C6FF1E]">
                  {user.user_metadata?.full_name?.split(' ')[0] || 'Account'}
                </span>
              </div>
              {accountOpen && (
                <div className="absolute top-full right-0 pt-3 w-56 z-50">
                  <div className="bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <p className="text-xs font-bold text-[#1A1A1A]">{user.user_metadata?.full_name || 'Your Account'}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 truncate">{user.email}</p>
                    </div>
                    {[
                      { icon: '👤', label: 'My Profile', href: '/account' },
                      { icon: '📦', label: 'My Orders', href: '/account' },
                      { icon: '❤️', label: 'Wishlist', href: '/wishlist' },
                      { icon: '📍', label: 'Saved Addresses', href: '/account' },
                    ].map(item => (
                      <Link key={item.label} href={item.href} onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-[#C6FF1E] hover:text-[#1A1A1A] transition-colors font-medium">
                        <span className="text-base">{item.icon}</span>{item.label}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100" />
                    <button
                      onClick={async () => { await supabase.auth.signOut(); setUser(null); setAccountOpen(false); router.push('/') }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
                    >
                      <span className="text-base">↪️</span>Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
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

        {/* Mobile right icons */}
        <div className="flex md:hidden items-center gap-4 text-white">
          {/* Search icon */}
          <button onClick={() => setMobileSearchOpen(prev => !prev)} className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Cart */}
          <Link href="/cart" className="relative text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#C6FF1E] text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Hamburger */}
          <button onClick={() => setMobileMenuOpen(prev => !prev)} className="text-white">
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 bg-[#000000]">
          <div className="flex items-center gap-3 bg-[#111111] rounded-lg px-4 py-3 border border-zinc-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search products..."
              autoFocus
              className="bg-transparent w-full text-sm text-white placeholder-zinc-500 outline-none"
            />
          </div>
          {searchQuery && liveResults.length > 0 && (
            <div className="mt-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
              {liveResults.map(p => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  onClick={() => { setMobileSearchOpen(false); setSearchQuery('') }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                >
                  <img src={p.image} className="w-10 h-10 object-contain rounded-lg bg-gray-50 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-zinc-900 truncate">{p.name}</p>
                    <p className="text-xs text-zinc-500">₹{p.price?.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0A] border-t border-zinc-900">
          {/* User section */}
          {user ? (
            <div className="px-4 py-4 border-b border-zinc-900">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#C6FF1E] rounded-full flex items-center justify-center font-black text-black text-sm">
                  {user.email?.[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{user.user_metadata?.full_name || 'User'}</p>
                  <p className="text-xs text-zinc-400">{user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: '📦', label: 'My Orders', href: '/account' },
                  { icon: '❤️', label: 'Wishlist', href: '/wishlist' },
                  { icon: '🚚', label: 'Track Order', href: '/track-order' },
                  { icon: '👤', label: 'Profile', href: '/account' },
                ].map(item => (
                  <Link key={item.label} href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 bg-zinc-900 rounded-xl text-sm text-zinc-300 font-medium"
                  >
                    <span>{item.icon}</span>{item.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="px-4 py-4 border-b border-zinc-900 flex gap-3">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}
                className="flex-1 bg-[#C6FF1E] text-black font-black text-sm py-3 rounded-xl text-center"
              >
                Login
              </Link>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}
                className="flex-1 border border-zinc-700 text-white font-bold text-sm py-3 rounded-xl text-center"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Nav links */}
          <div className="px-4 py-3 flex flex-col gap-1">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider mb-2">Categories</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {categories.map(cat => (
                <Link
                  key={cat}
                  href={`/products?category=${encodeURIComponent(cat)}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-bold text-zinc-300 px-3 py-2.5 bg-zinc-900 rounded-xl"
                >
                  {cat}
                </Link>
              ))}
            </div>

            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider mb-2">Quick Links</p>
            {[
              { label: 'All Products', href: '/products' },
              { label: 'Authenticity', href: '/authenticity' },
              { label: 'Track Order', href: '/track-order' },
              { label: 'Support', href: '/support' },
            ].map(item => (
              <Link key={item.label} href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold text-zinc-300 py-3 border-b border-zinc-900 last:border-0"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {user && (
            <div className="px-4 py-4 border-t border-zinc-900">
              <button
                onClick={async () => { await supabase.auth.signOut(); setUser(null); setMobileMenuOpen(false); router.push('/') }}
                className="w-full text-sm font-bold text-red-400 py-3 border border-red-900 rounded-xl"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center justify-center gap-8 px-8 py-3.5 bg-[#080B0D] border-b border-zinc-900 text-xs font-bold uppercase tracking-wider text-zinc-300">
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
                    className="block px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-700 hover:bg-[#C6FF1E] hover:text-[#1A1A1A] transition-colors normal-case"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <Link href="/#shop-by-brand" className="cursor-pointer hover:text-white transition-colors">Brands</Link>
        <span className="bg-[#C6FF1E] text-black font-black px-3 py-0.5 rounded-full text-[10px]">Offers</span>
        <span className="cursor-pointer hover:text-white transition-colors">Best sellers</span>
        <Link href="/authenticity" className="cursor-pointer hover:text-white transition-colors">Authenticity</Link>
        <Link href="/track-order" className="cursor-pointer hover:text-white transition-colors">Track order</Link>
        <Link href="/support" className="cursor-pointer hover:text-white transition-colors">Support</Link>
      </div>
    </div>
  )
}