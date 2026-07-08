'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'
import { Swiper, SwiperSlide } from "swiper/react";
import { ShieldCheckIcon as ShieldSolid, TruckIcon, LockClosedIcon } from '@heroicons/react/24/solid'
import { ArrowPathIcon, TagIcon, StarIcon, ShieldCheckIcon as ShieldOutline } from '@heroicons/react/24/outline'
import { ShieldCheck, ArrowRight, UserCheck as UserCheckIcon, PackageCheck as PackageCheckIcon, Star, ShoppingCart } from 'lucide-react'
import { Navigation, Pagination, Autoplay } from "swiper/modules";

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
  const features = [
    { icon: ShieldSolid, title: '100% Authentic', sub: 'Original Products' },
    { icon: UserCheckIcon, title: 'Authorized Brands', sub: 'Direct Distributors' },
    { icon: PackageCheckIcon, title: 'Secure Packaging', sub: 'Safe & Sealed' },
    { icon: TruckIcon, title: 'Fast Delivery', sub: 'Across India' },
  ]

  return (
    <div className="relative overflow-hidden bg-[#101214]">
      <div className="absolute inset-y-0 right-[10px] w-[46%] hidden md:block">
        <img
          src="/images/model/hero-model.png"
          alt="US Supplements"
          className="w-full h-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#101214] via-[#101214]/35 to-transparent w-1/2" />

        <div className="absolute top-10 right-10 w-32 h-32">
          <div className="absolute inset-0 rounded-full border border-dashed border-[#B7FF1E]/50 animate-[spin_18s_linear_infinite]" />
          <div className="absolute inset-3 rounded-full bg-[#101214] border border-[#B7FF1E]/60 flex flex-col items-center justify-center gap-1">
            <ShieldCheck className="w-5 h-5 text-[#B7FF1E]" strokeWidth={2} />
            <span className="text-white text-[10px] font-bold uppercase tracking-wide">Authentic</span>
            <span className="text-[#B7FF1E] text-[9px] font-bold uppercase">100% Guaranteed</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-16 py-20">
        <div className="max-w-xl">
          <span className="block text-xs font-bold tracking-[0.2em] uppercase text-[#B7FF1E] mb-5">
            Trust is our promise
          </span>

          <h1 className="text-5xl font-black leading-[1.1] mb-5">
            <span className="block text-white">Fuel Your Goals</span>
            <span className="block text-[#B7FF1E]">The Right Way.</span>
          </h1>

          <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-sm">
            100% authentic supplements from top brands. Verified. Trusted. Delivered.
          </p>

          <div className="flex items-start gap-6 mb-9">
            {features.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex flex-col items-start gap-1.5 max-w-[110px]">
                <Icon className="w-5 h-5 text-[#B7FF1E]" strokeWidth={1.75} />
                <p className="text-white text-xs font-bold leading-snug">{title}</p>
                <p className="text-gray-500 text-[11px] leading-snug">{sub}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#B7FF1E] hover:bg-[#C8FF4A] text-[#101214] font-bold px-7 py-3.5 rounded-xl text-sm transition-colors"
            >
              Shop Now
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
            <Link
              href="/authenticity"
              className="inline-flex items-center gap-2 text-white font-bold text-sm hover:text-[#B7FF1E] transition-colors px-2"
            >
              <ShieldCheck className="w-4 h-4" strokeWidth={2} />
              Verify Authenticity
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
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
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="block text-xs font-bold tracking-[0.2em] uppercase text-[#B7FF1E] mb-3">
            Shop by category
          </span>
          <h2 className="text-3xl font-black text-[#161616] mb-2">
            Find What Powers You
          </h2>
          <p className="text-[#6B7280] text-sm">
            Explore our premium range of supplements.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-5">
          {categories.map(cat => (
            <Link
              key={cat.name}
              href={`/products?search=${encodeURIComponent(cat.name)}`}
              className="group bg-white border border-[#E5E7EB] rounded-[24px] p-4 flex flex-col items-center gap-3 transition-all duration-300 hover:-translate-y-2 hover:border-[#B7FF1E] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
            >
              <div
                className="w-full aspect-square rounded-2xl flex items-center justify-center p-3"
                style={{ background: 'linear-gradient(180deg, #FFFFFF, #F8F6F1)' }}
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <span className="text-[18px] font-semibold text-[#161616] text-center leading-tight">
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

function ProductCard({ product, showBrand }) {
  const discount = Math.round((product.mrp - product.price) / product.mrp * 100)
  return (
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

        <p className="text-sm font-semibold text-[#161616] mb-2 leading-snug">{product.name}</p>

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
          onClick={e => e.preventDefault()}
          className="w-full bg-[#B7FF1E] hover:bg-[#C8FF4A] text-[#101214] text-sm font-semibold rounded-[14px] transition-colors flex items-center justify-center gap-2"
          style={{ height: '48px' }}
        >
          <ShoppingCart className="w-4 h-4" strokeWidth={2} />
          Add to Cart
        </button>
      </div>
    </Link>
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
            <span className="block text-xs font-bold tracking-[0.2em] uppercase text-[#B7FF1E] mb-3">
              Best sellers
            </span>
            <h2 className="text-3xl font-black text-[#161616] mb-2">
              Top Picks, Trusted by Thousands
            </h2>
            <p className="text-[#6B7280] text-sm">
              Our customers' favorite supplements.
            </p>
          </div>

          <Swiper
            className="trending-swiper px-10 py-2"
            modules={[Navigation, Autoplay]}
            navigation
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