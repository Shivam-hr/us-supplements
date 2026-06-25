'use client'
import { useState, useEffect } from 'react'
import { featuredProducts } from '../data/products'
import Link from 'next/link'

const banners = [
  { id: 1, image: '/images/banners/avvatar-whey.jpg', alt: 'Avvatar Whey Protein' },
  { id: 2, image: '/images/banners/avvatar-wafer.jpg', alt: 'Avvatar Protein Wafer Bar' },
  { id: 3, image: '/images/banners/avvatar-matcha.jpg', alt: 'Avvatar Matcha Wafer' },
  { id: 4, image: '/images/banners/beastlife-creatine.webp', alt: 'BeastLife Creatine Nano' },
  { id: 5, image: '/images/banners/beastlife-protein.webp', alt: 'BeastLife Performance Protein' },
]

const categories = [
  { name: 'Protein', icon: '🧪' },
  { name: 'Mass gainer', icon: '💪' },
  { name: 'Pre-workout', icon: '⚡' },
  { name: 'Creatine', icon: '💧' },
  { name: 'BCAA', icon: '💊' },
  { name: 'Vitamins', icon: '🌿' },
  { name: 'Weight mgmt', icon: '⚖️' },
  { name: 'Accessories', icon: '🎽' },
]

const brandLogos = [
  { name: 'Optimum Nutrition', image: '/images/logo/on.png' },
  { name: 'MuscleBlaze', image: '/images/logo/mb.png' },
  { name: 'Avvatar', image: '/images/logo/avvatar.png' },
  { name: 'MuscleTech', image: '/images/logo/muscletech.png' },
  { name: 'GNC', image: '/images/logo/gnc.png' },
  { name: 'Elev', image: '/images/logo/elev.png' },
  { name: 'GXN', image: '/images/logo/gxn.png' },
  { name: 'One Science', image: '/images/logo/onescience.jpeg' },
  { name: 'Anabolic Muscle', image: '/images/logo/anabolic.webp' },
  { name: 'Applied Nutrition', image: '/images/logo/appliednutrition.png' },
  { name: 'GAT', image: '/images/logo/gat.png' },
  // { name: 'PVL', image: 'https://logo.clearbit.com/pvl.com' }, // Still using API
  // { name: 'Muscle Science', image: 'https://logo.clearbit.com/musclescience.in' }, // Still using API
  // { name: 'ProSupps', image: 'https://logo.clearbit.com/prosupps.com' }, // Still using API
  // { name: 'Gaspari', image: 'https://logo.clearbit.com/gasparinutrition.com' }, // Still using API
  { name: 'Kevin Levrone', image: '/images/logo/kevin.jpg' },
  { name: 'Labrada', image: '/images/logo/labrada.png' },
  { name: 'Wellcore', image: '/images/logo/wellcore.png' },
  { name: 'AS-IT-IS', image: '/images/logo/asitis.png' },
  { name: 'Big Muscle', image: '/images/logo/Bigmes.webp' },
  // { name: 'Daily Scoop', image: 'https://logo.clearbit.com/dailyscoop.com' }, // Still using API
  // { name: 'Ronnie Coleman', image: 'https://logo.clearbit.com/ronniecoleman.net' }, // Still using API
  { name: 'Dymatize', image: '/images/logo/dymatize.jpeg' },
  { name: 'OSN', image: '/images/logo/onescience.jpeg' }, // Reusing One Science logo for OSN
  // { name: 'BSN', image: 'https://logo.clearbit.com/gobsn.com' }, // Still using API
  // { name: 'Isopure', image: 'https://logo.clearbit.com/theisopurecompany.com' }, // Still using API
  // { name: 'Rule 1', image: 'https://logo.clearbit.com/ruleoneproteins.com' }, // Still using API
  // { name: 'Ultimate Nutrition', image: 'https://logo.clearbit.com/ultimatenutrition.com' }, // Still using API
  // { name: 'Cellucor', image: 'https://logo.clearbit.com/cellucor.com' }, // Still using API
  // { name: 'Atom', image: '/images/logo/a' }, // Still using API
]

const whyUs = [
  { icon: '✅', title: '100% Authentic', desc: 'Sourced directly from brands. Every product verified.' },
  { icon: '🚚', title: 'Free Delivery', desc: 'Free shipping on prepaid orders above ₹499.' },
  { icon: '↩️', title: 'Easy Returns', desc: '7-day hassle-free return policy.' },
  { icon: '🔒', title: 'Secure Payments', desc: 'Razorpay powered. UPI, cards, net banking accepted.' },
]

function ProductCard({ product , showBrand}) {
  const discount = Math.round((product.mrp - product.price) / product.mrp * 100)
  return (
    <Link href={`/products/${product.id}`}>
      <div className="border border-gray-100 rounded-2xl p-4 hover:border-[#C6FF1E] hover:shadow-sm transition-all cursor-pointer group bg-white">
        <img
          src={product.image}
          alt={product.name}
          className="h-52 w-full object-contain rounded-xl mb-4 group-hover:scale-105 transition-transform"
        />
        {showBrand && (
          <p className="text-xs text-gray-400 mb-1">{product.brand}</p>
        )}
        
        
        {product.badge && (
          <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full font-semibold mb-2 ${product.badge === 'New' ? 'bg-[#1A1A1A] text-[#C6FF1E]' : 'bg-[#C6FF1E] text-[#1A1A1A]'}`}>
            {product.badge}
          </span>
        )}
        <p className="text-sm font-semibold text-[#1A1A1A] mb-2 leading-snug">{product.name}</p>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-base font-bold text-[#1A1A1A]">₹{product.price.toLocaleString()}</span>
          {product.mrp > product.price && (
            <>
              <span className="text-xs text-gray-400 line-through">₹{product.mrp.toLocaleString()}</span>
              <span className="text-xs text-green-600 font-semibold">{discount}% off</span>
            </>
          )}
        </div>
        <button
          onClick={e => e.preventDefault()}
          className="w-full bg-[#1A1A1A] text-[#C6FF1E] text-sm font-semibold py-3 rounded-xl hover:bg-[#333] transition-all"
        >
          Add to cart
        </button>
      </div>
    </Link>
  )
}

function HeroBanner() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full overflow-hidden" style={{ height: '480px' }}>
      {banners.map((banner, i) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src={banner.image}
            alt={banner.alt}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${i === current ? 'w-6 bg-[#C6FF1E]' : 'w-4 bg-white/50'}`}
          />
        ))}
      </div>

      {/* Arrow buttons */}
      <button
        onClick={() => setCurrent(prev => (prev - 1 + banners.length) % banners.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all"
      >
        ‹
      </button>
      <button
        onClick={() => setCurrent(prev => (prev + 1) % banners.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all"
      >
        ›
      </button>
    </div>
  )
}

export default function Home() {
  return (
    <main className="pb-16 text-base">

      <HeroBanner />

      {/* TRUST STRIP */}
      <div className="border-b border-gray-100 px-16 py-5 grid grid-cols-4 divide-x divide-gray-100">
        {whyUs.map(item => (
          <div key={item.title} className="flex items-center gap-3 px-6 first:pl-0">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="font-semibold text-[#1A1A1A]">{item.title}</p>
              <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* SHOP BY CATEGORY */}
      <div className="px-16 py-10">
        <p className="text-xs font-bold text-[#1A1A1A] tracking-[0.15em] uppercase mb-6">Shop by category</p>
        <div className="grid grid-cols-8 gap-4 text-center">
          {categories.map((cat, i) => (
            <div key={cat.name} className="cursor-pointer group flex flex-col items-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-2 text-2xl transition-all group-hover:scale-105 ${i === 0 ? 'bg-[#C6FF1E]' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                {cat.icon}
              </div>
              <span className="text-sm font-medium text-gray-600">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TRENDING NOW */}
      <div className="px-16 py-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold text-[#1A1A1A] tracking-[0.15em] uppercase">Trending now</p>
            <p className="text-sm text-gray-400 mt-1">Most ordered this week</p>
          </div>
          <Link href="/products">
            <button className="text-sm font-semibold text-[#1A1A1A] border border-gray-200 px-5 py-2.5 rounded-xl hover:border-[#C6FF1E] transition-all">
              View all →
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-5">
          {featuredProducts.slice(0, 4).map(p => (
            <ProductCard key={p.id} product={p} showBrand={true} />
          ))}
        </div>
      </div>

      {/* SHOP BY BRAND */}
      <div className="px-16 py-10 bg-gray-50 mt-8">
    <p className="text-xs font-bold text-[#1A1A1A] tracking-[0.15em] uppercase mb-6">Shop by brand</p>
    <div className="grid grid-cols-6 gap-4">
    {brandLogos.map(brand => (
      <div key={brand.name} className="bg-white border border-gray-100 rounded-2xl h-24 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#C6FF1E] hover:shadow-sm transition-all px-3 group">
        {brand.image ? (
          <img
            src={brand.image}
            alt={brand.name}
            className="max-h-10 max-w-full object-contain"
          />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-sm text-[#1A1A1A]">
            {brand.name[0]}
          </div>
        )}
        <span className="text-xs font-medium text-gray-500 text-center leading-tight group-hover:text-[#1A1A1A] transition-colors">
          {brand.name}
        </span>
      </div>
    ))}
  </div>
  </div>

      {/* DEAL OF THE DAY */}
      <div className="mx-16 my-10 bg-[#1A1A1A] rounded-2xl p-8 flex items-center justify-between">
        <div className="flex flex-col gap-3">
          <span className="text-[#C6FF1E] text-xs font-bold tracking-[0.15em] uppercase">Deal of the day</span>
          <p className="text-white text-2xl font-bold">Avvatar Whey Protein 2kg</p>
          <div className="flex items-baseline gap-3">
            <span className="text-white text-3xl font-bold">₹6,199</span>
            <span className="text-gray-500 line-through text-lg">₹8,649</span>
            <span className="bg-[#C6FF1E] text-[#1A1A1A] text-xs font-bold px-2.5 py-1 rounded-full">28% OFF</span>
          </div>
          <div className="flex gap-3 mt-1">
            {[['06', 'Hours'], ['42', 'Minutes'], ['18', 'Seconds']].map(([val, label]) => (
              <div key={label} className="bg-white/10 rounded-xl px-4 py-2 text-center">
                <p className="text-white text-xl font-bold">{val}</p>
                <p className="text-gray-500 text-xs uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <img
            src="https://ussupplements.in/wp-content/uploads/2025/07/IMG_2951-300x300.webp"
            alt="Avvatar Whey Protein 2kg"
            className="w-40 h-40 object-contain rounded-2xl"
          />
          <button className="bg-[#C6FF1E] text-[#1A1A1A] font-bold px-8 py-3 rounded-xl text-sm hover:brightness-110 transition-all">
            Grab the deal
          </button>
        </div>
      </div>

      {/* OFFER BANNERS */}
      <div className="px-16 grid grid-cols-2 gap-5">
        <div className="bg-[#1A1A1A] rounded-2xl p-8 flex items-center justify-between">
          <div>
            <p className="text-[#C6FF1E] text-xs font-bold tracking-widest uppercase mb-2">New users</p>
            <p className="text-white text-xl font-bold leading-snug">Get ₹200 off<br/>your first order</p>
            <button className="mt-4 bg-[#C6FF1E] text-[#1A1A1A] font-bold px-5 py-2.5 rounded-xl text-sm">
              Use code: NEW200
            </button>
          </div>
          <span className="text-6xl">🎁</span>
        </div>
        <div className="bg-gray-100 rounded-2xl p-8 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-2">Limited time</p>
            <p className="text-[#1A1A1A] text-xl font-bold leading-snug">Buy 2 get 1 free<br/>on all creatine</p>
            <button className="mt-4 bg-[#1A1A1A] text-[#C6FF1E] font-bold px-5 py-2.5 rounded-xl text-sm">
              Shop creatine →
            </button>
          </div>
          <span className="text-6xl">⚡</span>
        </div>
      </div>

    </main>
  )
}