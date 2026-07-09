'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'
import { Swiper, SwiperSlide } from "swiper/react";
import { ShieldCheckIcon as ShieldSolid, TruckIcon, LockClosedIcon } from '@heroicons/react/24/solid'
import { ArrowPathIcon, TagIcon, StarIcon, ShieldCheckIcon as ShieldOutline } from '@heroicons/react/24/outline'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Autoplay } from "swiper/modules";
import ProductCard from '../Components/ProductCard'

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// NOTE: these banner images (01.png-5.png) are the ones you renamed yourself.
// They aren't rendered anywhere right now — the old rotating-banner Hero has been
// replaced by the single-photo dark Hero below, per the new design. Left here in
// case you want them used for a separate promo strip; ask me if so.
const banners = [
  { id: 1, image: '/images/banners/01.png', alt: 'Avvatar Whey Protein' },
  { id: 2, image: '/images/banners/02.png', alt: 'Avvatar Protein Wafer Bar' },
  { id: 3, image: '/images/banners/03.png', alt: 'Avvatar Matcha Wafer' },
  { id: 4, image: '/images/banners/04.png', alt: 'BeastLife Creatine Nano' },
  { id: 5, image: '/images/banners/5.png', alt: 'BeastLife Performance Protein' },
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
  { icon: ShieldSolid, title: '100% Authentic', desc: 'Directly from brands. Every product verified.', pillIcon: '✓', pill: 'Verified Quality' },
  { icon: TruckIcon, title: 'Free Delivery', desc: 'Free shipping on prepaid orders above ₹499.', pillIcon: '🚚', pill: 'No Extra Charges' },
  { icon: ArrowPathIcon, title: 'Easy Returns', desc: '7-day hassle-free return policy.', pillIcon: '↩', pill: 'Quick & Easy' },
  { icon: LockClosedIcon, title: 'Secure Payments', desc: 'Razorpay secured. UPI, Cards, Net banking & more.', pillIcon: '🔒', pill: '100% Safe' },
]

const trustHighlights = [
  { icon: TagIcon, title: 'Best Prices', desc: 'Unbeatable offers on top brands' },
  { icon: StarIcon, title: '4.8/5 Customer Rating', desc: 'Trusted by 50,000+ happy customers' },
  { icon: ShieldOutline, title: 'Brand Promise', desc: 'Genuine products. Always.' },
]

function Hero() {
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
            aria-label={`Show banner ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${i === current ? 'w-6 bg-[#B7FF1E]' : 'w-4 bg-white/50'}`}
          />
        ))}
      </div>

      {/* Arrow buttons */}
      <button
        onClick={() => setCurrent(prev => (prev - 1 + banners.length) % banners.length)}
        aria-label="Previous banner"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all"
      >
        <ChevronLeft className="w-5 h-5" strokeWidth={2} />
      </button>
      <button
        onClick={() => setCurrent(prev => (prev + 1) % banners.length)}
        aria-label="Next banner"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all"
      >
        <ChevronRight className="w-5 h-5" strokeWidth={2} />
      </button>
    </div>
  )
}

function ShopByCategory() {
  const categories = [
    { name: "Whey Protein", img: "/images/Category/protein-powder.png" },
    { name: "Mass Gainers", img: "/images/Category/Mass-Gainer.png" },
    { name: "Pre-Workout", img: "/images/Category/pre-workout.avif" },
    { name: "Creatine", img: "/images/Category/creatine.png" },
    { name: "Vitamins", img: "/images/Category/Vitamins.jpg" },
    { name: "Health & Wellness", img: "/images/Category/Health&Wellness.jpg" },
    { name: "Accessories", img: "/images/Category/accessories.jpeg" },
  ];

  return (
    <div className="py-20 bg-[#F7F8FA]">
      <div className="max-w-[1600px] mx-auto px-10 lg:px-16">
        <div className="text-center mb-14">
          <span className="block text-xs font-bold tracking-[0.2em] uppercase text-[#4d7a00] mb-3">
            Shop by category
          </span>
          <h2 className="text-3xl font-black text-[#161616] mb-2">
            Find What Powers You
          </h2>
          <p className="text-[#6B7280] text-sm">
            Explore our premium range of supplements.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-6">
          {categories.map(cat => (
            <Link
              key={cat.name}
              href={`/products?search=${encodeURIComponent(cat.name)}`}
              className="group bg-white border border-[#E5E7EB] rounded-[24px] p-5 flex flex-col items-center gap-4 transition-all duration-300 hover:-translate-y-2 hover:border-[#B7FF1E] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
            >
              <div
                className="w-full aspect-square rounded-2xl flex items-center justify-center p-2"
                style={{ background: 'linear-gradient(180deg, #FFFFFF, #F8F6F1)' }}
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <span className="text-[16px] font-semibold text-[#161616] text-center leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] text-[#161616] font-bold text-sm rounded-xl px-6 py-3 hover:border-[#B7FF1E] transition-colors"
          >
            View All Categories
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </div>
  )
}

// 2. THIS IS THE ONLY DEFAULT EXPORT
export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const trendingSwiperRef = useRef(null)

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

      <Hero />

      {/* TRUST STRIP */}
      <div className="mx-16 mt-8">
        <div className="grid grid-cols-4 gap-4">
          {whyUs.map(item => {
            const Icon = item.icon
            return (
              <div key={item.title} className="border border-gray-200 rounded-2xl p-6 flex flex-col gap-2 bg-white">
                <Icon className="w-9 h-9 text-green-600 mb-1" />
                <p className="font-bold text-[#1A1A1A] text-[15px]">{item.title}</p>
                <p className="text-sm text-gray-400 leading-snug">{item.desc}</p>
                <span className="w-fit text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-full mt-2">
                  {item.pillIcon} {item.pill}
                </span>
              </div>
            )
          })}
        </div>

        <div className="bg-[#F7FFEA] rounded-2xl px-6 py-5 grid grid-cols-3 divide-x divide-[#E3F5B4] mt-4">
          {trustHighlights.map(item => {
            const Icon = item.icon
            return (
              <div key={item.title} className="flex items-center gap-3 px-4 first:pl-0">
                <Icon className="w-6 h-6 text-green-600 shrink-0" />
                <div>
                  <p className="font-bold text-[#1A1A1A] text-sm">{item.title}</p>
                  <p className="text-sm text-gray-500 leading-snug">{item.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <ShopByCategory />

      {/* BEST SELLERS */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="block text-xs font-bold tracking-[0.2em] uppercase text-[#4d7a00] mb-3">
              Best sellers
            </span>
            <h2 className="text-3xl font-black text-[#161616] mb-2">
              Top Picks, Trusted by Thousands
            </h2>
            <p className="text-[#6B7280] text-sm">
              Our customers&apos; favorite supplements.
            </p>
          </div>

          <div className="relative">
            <button
              onClick={() => trendingSwiperRef.current?.slidePrev()}
              aria-label="Previous products"
              className="hidden md:flex absolute -left-4 top-[38%] -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-[#E5E7EB] items-center justify-center text-[#161616] shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:border-[#B7FF1E] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
            </button>

            <Swiper
              className="trending-swiper"
              modules={[Autoplay]}
              onSwiper={swiper => (trendingSwiperRef.current = swiper)}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={false}
              rewind={true}
              spaceBetween={24}
              breakpoints={{
                320: { slidesPerView: 1.3 },
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 5 },
              }}
            >
              {featuredProducts.slice(0, 8).map(p => (
                <SwiperSlide key={p.id}>
                  <ProductCard product={p} showBrand={true} />
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              onClick={() => trendingSwiperRef.current?.slideNext()}
              aria-label="Next products"
              className="hidden md:flex absolute -right-4 top-[38%] -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-[#E5E7EB] items-center justify-center text-[#161616] shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:border-[#B7FF1E] transition-colors"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex justify-center mt-10">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] text-[#161616] font-bold text-sm rounded-xl px-6 py-3 hover:border-[#B7FF1E] transition-colors"
            >
              View All Products
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>

      {/* SHOP BY BRAND */}
      <div id="shop-by-brand" className="px-16 py-10 bg-gray-50 mt-8 scroll-mt-40">
        <p className="text-xs font-bold text-[#1A1A1A] tracking-[0.15em] uppercase mb-6">Shop by brand</p>
        <div className="grid grid-cols-6 gap-4">
          {brandLogos.map(brand => {
            const brandParam = brand.name === 'OSN' ? 'One Science' : brand.name
            return (
              <Link
                key={brand.name}
                href={`/products?brand=${encodeURIComponent(brandParam)}`}
                className="bg-white border border-gray-100 rounded-2xl h-24 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#C6FF1E] hover:shadow-sm transition-all px-3 group"
              >
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
              </Link>
            )
          })}
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