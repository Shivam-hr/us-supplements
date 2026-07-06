'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const banners = [
  { id: 1, image: '/images/banners/avvatar-whey.jpg', alt: 'Avvatar Whey Protein' },
  { id: 2, image: '/images/banners/avvatar-wafer.jpg', alt: 'Avvatar Protein Wafer Bar' },
  { id: 3, image: '/images/banners/avvatar-matcha.jpg', alt: 'Avvatar Matcha Wafer' },
  { id: 4, image: '/images/banners/beastlife-creatine.webp', alt: 'BeastLife Creatine Nano' },
  { id: 5, image: '/images/banners/beastlife-protein.webp', alt: 'BeastLife Performance Protein' },
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
  { name: 'Kevin Levrone', image: '/images/logo/kevin.jpg' },
  { name: 'Labrada', image: '/images/logo/labrada.png' },
  { name: 'Wellcore', image: '/images/logo/wellcore.png' },
  { name: 'AS-IT-IS', image: '/images/logo/asitis.png' },
  { name: 'Big Muscle', image: '/images/logo/Bigmes.webp' },
  { name: 'Dymatize', image: '/images/logo/dymatize.jpeg' },
  { name: 'OSN', image: '/images/logo/onescience.jpeg' }, 
]

const whyUs = [
  { icon: '✅', title: '100% Authentic', desc: 'Directly from brands. Every product verified.', pill: '✓ Verified Quality' },
  { icon: '🚚', title: 'Free Delivery', desc: 'Free shipping on prepaid orders above ₹499.', pill: '🚚 No Extra Charges' },
  { icon: '↩️', title: 'Easy Returns', desc: '7-day hassle-free return policy.', pill: '↩ Quick & Easy' },
  { icon: '🔒', title: 'Secure Payments', desc: 'Razorpay secured. UPI, Cards, Net banking & more.', pill: '🔒 100% Safe' },
]

const trustHighlights = [
  { icon: '🏷️', title: 'Best Prices', desc: 'Unbeatable offers on top brands' },
  { icon: '⭐', title: '4.8/5 Customer Rating', desc: 'Trusted by 50,000+ happy customers' },
  { icon: '🛡️', title: 'Brand Promise', desc: 'Genuine products. Always.' },
]

function ShopByCategory() {
  const categories = [
    { name: "Protein", img: "/images/Category/protein-powder.jpg" },
    { name: "Mass Gainer", img: "/images/Category/Mass-Gainer.jpg" },
    { name: "Creatine", img: "/images/Category/creatine.jpg" },
    { name: "Pre-workout", img: "/images/Category/pre-workout.avif" },
    { name: "Bcaa", img: "/images/Category/Bcaa.webp" },
    { name: "Vitamins", img: "/images/Category/Multivitamin.jpg" },
    { name: "Accessories", img: "/images/Category/accessories.jpeg" },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-sm font-black tracking-[0.2em] text-zinc-900 uppercase mb-10 text-center">
          Shop By Category
        </h2>

        <Swiper
          className="category-swiper px-10 py-2"
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={false}
          rewind={true}
          spaceBetween={30}
          breakpoints={{
            320: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          }}
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat.name}>
              <Link
                href={`/products?search=${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center gap-4 group"
              >
                <div className="w-28 h-28 sm:w-32 sm:h-32 bg-[#F4F4F5] rounded-3xl flex items-center justify-center p-3 transition-all duration-300 group-hover:b-[#C6FF1E] group-hover:scale-105 group-hover:shadow-xl">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <span className="text-base font-bold text-zinc-800 text-center">
                  {cat.name}
                </span>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

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

// 2. THIS IS THE ONLY DEFAULT EXPORT
export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .eq('in_stock', true)
        .limit(8)
      setFeaturedProducts(data || [])
    }
    fetch()
  }, [])

  return (
    <main className="pb-16 text-base">

      <HeroBanner />

      {/* TRUST STRIP */}
      <div className="mx-16 mt-8 border border-gray-100 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-4 divide-x divide-gray-100">
          {whyUs.map(item => (
            <div key={item.title} className="p-6 flex flex-col gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#C6FF1E]/25 flex items-center justify-center text-xl shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="font-bold text-[#1A1A1A]">{item.title}</p>
                <p className="text-sm text-gray-400 leading-relaxed mt-1">{item.desc}</p>
              </div>
              <span className="w-fit text-xs font-semibold bg-[#EFFFD1] text-[#4d7a00] px-3 py-1.5 rounded-full mt-1">
                {item.pill}
              </span>
            </div>
          ))}
        </div>
        <div className="bg-[#F7FFEA] px-6 py-5 grid grid-cols-3 divide-x divide-[#E3F5B4]">
          {trustHighlights.map(item => (
            <div key={item.title} className="flex items-center gap-3 px-4 first:pl-0">
              <span className="text-2xl shrink-0">{item.icon}</span>
              <div>
                <p className="font-bold text-[#1A1A1A] text-sm">{item.title}</p>
                <p className="text-sm text-gray-500 leading-snug">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. INJECTED THE NEW COMPONENT HERE */}
      <ShopByCategory />

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