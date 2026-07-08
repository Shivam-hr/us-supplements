'use client'
import Link from 'next/link'
import { useState, useRef } from 'react'
import {
  ShieldCheck, PackageCheck, Truck, ArrowRight, Headphones, ChevronRight,
  ChevronLeft, UserCheck, Link2, CheckCircle2, Plus, Minus, MessageCircle,
  Mail, HelpCircle,
} from 'lucide-react'

const brands = [
  {
    name: 'MuscleBlaze',
    logo: '/images/logo/mb.png',
    url: 'https://www.muscleblaze.com/authenticity-guaranteed',
  },
  {
    name: 'Avvatar',
    logo: '/images/logo/avvatar.png',
    url: 'https://www.avvatarindia.com/authenticate',
  },
  {
    name: 'AS-IT-IS',
    logo: '/images/logo/asitis.png',
    url: 'https://asitisnutrition.com/pages/authenticity',
  },
  {
    name: 'GNC',
    logo: '/images/logo/gnc.png',
    url: 'https://www.guardian.in/pages/authenticity',
  },
  {
    name: 'Optimum Nutrition',
    logo: '/images/logo/on.png',
    url: 'https://www.optimumnutrition.com/en-us/authenticity',
  },
  {
    name: 'Dymatize',
    logo: '/images/logo/dymatize.jpeg',
    url: 'https://www.dymatize.com/pages/authenticity',
  },
  {
    name: 'Applied Nutrition',
    logo: '/images/logo/appliednutrition.png',
    url: 'https://applied-nutrition.com/pages/authenticity',
  },
  {
    name: 'Elev',
    logo: '/images/logo/elev.png',
    url: 'https://elevnutrition.in/pages/authenticity',
  },
  {
    name: 'Kevin Levrone',
    logo: '/images/logo/kevin.jpg',
    url: 'https://kevinlevrone.com/pages/authenticity',
  },
  {
    name: 'GAT',
    logo: '/images/logo/gat.png',
    url: 'https://gat.gpasservices.com',
  },
]

const faqs = [
  {
    q: 'How do I verify my supplement?',
    a: 'Simply find your brand from the list above and click "Verify Now". You\'ll be redirected to the official brand verification page where you can enter your batch number or scan the QR code on your product.'
  },
  {
    q: 'Where can I find the batch number?',
    a: 'The batch number is usually printed on the bottom or back of the packaging, near the manufacturing and expiry date. Some brands also place it inside the lid or on a scratch panel.'
  },
  {
    q: 'Why does verification redirect to another website?',
    a: 'Each brand runs its own authentication system, so we redirect you to their official page or tool. This ensures the check is coming directly from the brand, not a third party.'
  },
  {
    q: 'What if my product doesn\'t verify?',
    a: 'Stop using the product and contact our support team immediately with photos of the packaging and batch code. We will investigate, and arrange a replacement or refund if needed.'
  },
  {
    q: 'Can I contact support for help?',
    a: 'Yes — reach out anytime via WhatsApp or email using the buttons below. Our team can help you locate a batch number, complete verification, or resolve any issue with your order.'
  },
]

function BrandCarousel() {
  const scrollerRef = useRef(null)

  const scroll = (direction) => {
    if (!scrollerRef.current) return
    const amount = 300
    scrollerRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <button
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-zinc-700 bg-[#0A0B0D] items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" strokeWidth={2} />
      </button>

      <div
        ref={scrollerRef}
        className="flex gap-5 overflow-x-auto scroll-smooth no-scrollbar px-1 py-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {brands.map(brand => (
          <div
            key={brand.name}
            className="shrink-0 w-64 bg-[#111214] border border-zinc-800 rounded-2xl p-5 flex flex-col hover:border-[#C6FF1E]/40 transition-colors"
          >
            <span className="inline-flex items-center gap-1 w-fit text-[10px] font-bold uppercase text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-1 mb-5">
              <ShieldCheck className="w-3 h-3" strokeWidth={2.5} />
              Verified
            </span>

            <div className="w-full h-16 bg-white rounded-xl flex items-center justify-center p-3 mb-5">
              <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain" />
            </div>

            <div className="flex flex-col gap-2 mb-5">
              {['Official Distributors', 'Factory Sealed', 'Brand Verification Links'].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C6FF1E] shrink-0" strokeWidth={2} />
                  <span className="text-xs text-zinc-300">{item}</span>
                </div>
              ))}
            </div>

            <a
              href={brand.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto flex items-center justify-between border border-zinc-700 hover:border-[#C6FF1E] rounded-xl px-4 py-2.5 text-sm font-bold text-[#C6FF1E] transition-colors"
            >
              Verify Now
              <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </a>
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-zinc-700 bg-[#0A0B0D] items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
      >
        <ChevronRight className="w-5 h-5" strokeWidth={2} />
      </button>
    </div>
  )
}

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="flex flex-col gap-3">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i
        return (
          <div
            key={i}
            className={`bg-white rounded-xl border transition-colors ${isOpen ? 'border-[#C6FF1E]' : 'border-gray-200'}`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-bold text-[#1A1A1A] text-sm">{faq.q}</span>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isOpen ? 'bg-[#C6FF1E] text-[#1A1A1A]' : 'bg-gray-100 text-gray-500'}`}>
                {isOpen ? <Minus className="w-3.5 h-3.5" strokeWidth={3} /> : <Plus className="w-3.5 h-3.5" strokeWidth={3} />}
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-4 pl-5 border-l-2 border-[#C6FF1E] ml-5 mb-4 -mt-1">
                <p className="text-sm text-gray-500 leading-relaxed pl-3">{faq.a}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function AuthenticityPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-16">

      {/* HERO */}
      <div className="relative overflow-hidden bg-[#0A0B0D]">

        {/* Full-bleed photo — fills entire hero height, right edge to edge, no letterboxing */}
        <div className="absolute inset-y-0 right-[10px] w-[48%] hidden md:block">
          <img
            src="/images/authenticity/hero-model.jpg"
            alt="US Supplements"
            className="w-full h-full object-cover object-right"
          />
          {/* Gradient so the photo blends into the dark bg on its left edge instead of a hard cut */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0B0D] via-[#0A0B0D]/40 to-transparent w-1/2" />

          {/* Floating 100% Authentic shield badge */}
          <div className="absolute top-10 right-16 flex flex-col items-center justify-center w-32 h-36 drop-shadow-[0_0_18px_rgba(198,255,30,0.35)]">
            <svg viewBox="0 0 100 116" className="absolute inset-0 w-full h-full">
              <path
                d="M50 2 L94 18 V56 C94 84 74 102 50 114 C26 102 6 84 6 56 V18 Z"
                fill="rgba(10,11,13,0.55)"
                stroke="#C6FF1E"
                strokeWidth="1.5"
              />
            </svg>
            <div className="relative flex flex-col items-center justify-center gap-1 pt-2">
              <span className="text-white font-black text-xl">100%</span>
              <span className="text-white text-[10px] font-bold tracking-wider uppercase -mt-1">Authentic</span>
              <ShieldCheck className="w-4 h-4 text-[#C6FF1E] mt-1" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-16 pt-10 pb-16">
          <div className="max-w-xl">
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-[#C6FF1E] border border-[#C6FF1E]/40 rounded-full px-4 py-1.5 mb-6">
              Trusted. Tested. Authentic.
            </span>

            <h1 className="text-5xl font-black leading-[1.1] mb-6">
              <span className="text-white">Verified </span>
              <span className="text-[#C6FF1E]">Authentic</span>
              <br />
              <span className="text-white">Products</span>
            </h1>

            <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-md">
              Every supplement sold by US Supplements comes directly from
              authorized distributors.
            </p>

            <div className="flex items-center gap-2 mb-10">
              <span className="w-5 h-5 rounded-full bg-[#C6FF1E] flex items-center justify-center text-[#1A1A1A] text-xs font-black shrink-0">
                ✓
              </span>
              <span className="text-white font-semibold text-sm">Verified by Official Brands</span>
            </div>

            {/* Icon badges row */}
            <div className="flex items-start gap-6 mb-10">
              <div className="flex flex-col items-center text-center gap-2 w-24">
                <div className="w-14 h-14 rounded-full border border-zinc-700 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-[#C6FF1E]" strokeWidth={1.75} />
                </div>
                <p className="text-white text-sm font-bold leading-snug">Official Distributors</p>
                <p className="text-gray-500 text-xs">Sourced directly</p>
              </div>

              <div className="w-px h-16 bg-zinc-800 mt-7" />

              <div className="flex flex-col items-center text-center gap-2 w-24">
                <div className="w-14 h-14 rounded-full border border-zinc-700 flex items-center justify-center">
                  <PackageCheck className="w-5 h-5 text-[#C6FF1E]" strokeWidth={1.75} />
                </div>
                <p className="text-white text-sm font-bold leading-snug">Factory Sealed</p>
                <p className="text-gray-500 text-xs">100% original packaging</p>
              </div>

              <div className="w-px h-16 bg-zinc-800 mt-7" />

              <div className="flex flex-col items-center text-center gap-2 w-24">
                <div className="w-14 h-14 rounded-full border border-zinc-700 flex items-center justify-center">
                  <Link2 className="w-5 h-5 text-[#C6FF1E]" strokeWidth={1.75} />
                </div>
                <p className="text-white text-sm font-bold leading-snug">Brand Verification Links</p>
                <p className="text-gray-500 text-xs">Direct to official sites</p>
              </div>

              <div className="w-px h-16 bg-zinc-800 mt-7" />

              <div className="flex flex-col items-center text-center gap-2 w-24">
                <div className="w-14 h-14 rounded-full border border-zinc-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[#C6FF1E]" strokeWidth={1.75} />
                </div>
                <p className="text-white text-sm font-bold leading-snug">100% Authentic</p>
                <p className="text-gray-500 text-xs">No compromises</p>
              </div>
            </div>

            <a
              href="#verify-brands"
              className="inline-block bg-[#C6FF1E] text-[#1A1A1A] font-bold px-7 py-3.5 rounded-xl text-sm hover:brightness-110 transition-all"
            >
              Browse Brands ↓
            </a>
          </div>
        </div>
      </div>

      {/* Brand carousel — dark section, flows directly from hero, no gradient/seam */}
      <div id="verify-brands" className="bg-[#0A0B0D] px-16 pt-16 pb-20 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="block text-xs font-bold tracking-[0.2em] uppercase text-[#C6FF1E] mb-3">
            Trusted by official brands
          </span>
          <h2 className="text-4xl font-black mb-3">
            <span className="text-white">Shop </span>
            <span className="text-[#C6FF1E]">100% Authentic</span>
            <span className="text-white"> Brands</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            We partner with official brands and authorized distributors
            so you get only genuine supplements.
          </p>
        </div>

        <BrandCarousel />

        <div className="flex justify-center mt-10">
          <Link
            href="/#shop-by-brand"
            className="inline-flex items-center gap-1.5 border border-[#C6FF1E]/40 text-[#C6FF1E] font-bold text-sm rounded-full px-6 py-2.5 hover:bg-[#C6FF1E]/10 transition-colors"
          >
            Browse All Brands
            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>
      </div>

      {/* FAQ + Need Help — light section, rounded top overlaps the dark section slightly */}
      <div className="bg-[#F7F8FA] rounded-t-[2rem] -mt-6 relative z-10 px-16 py-16">
        <div className="grid grid-cols-[320px_1fr] gap-12">

          {/* Left: illustration + still have questions */}
          <div>
            <div className="relative w-full h-40 flex items-center justify-center mb-8">
              <div className="absolute w-44 h-44 rounded-full border border-dashed border-[#C6FF1E]/40" />
              <div className="relative w-20 h-20 bg-[#1A1A1A] rounded-2xl flex items-center justify-center">
                <HelpCircle className="w-9 h-9 text-[#C6FF1E]" strokeWidth={1.75} />
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <p className="font-bold text-[#1A1A1A] mb-1">Still have questions?</p>
              <p className="text-sm text-gray-400 mb-5 leading-relaxed">
                Our support team is here to help you with any verification issues.
              </p>
              <div className="flex flex-col gap-2.5">
                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#1A1A1A] text-white font-bold text-sm rounded-xl py-3 hover:bg-[#000] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#C6FF1E]" strokeWidth={2} />
                  Chat on WhatsApp
                </a>
                <a
                  href="mailto:support@ussupplements.in"
                  className="flex items-center justify-center gap-2 border border-gray-200 text-[#1A1A1A] font-bold text-sm rounded-xl py-3 hover:border-[#C6FF1E] transition-colors"
                >
                  <Mail className="w-4 h-4" strokeWidth={2} />
                  Email Support
                </a>
              </div>
            </div>
          </div>

          {/* Right: FAQ accordion */}
          <div>
            <span className="block text-xs font-bold tracking-[0.15em] uppercase text-green-600 mb-2">
              FAQ
            </span>
            <h2 className="text-3xl font-black text-[#1A1A1A] mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Find answers to common questions about product authentication and verification.
            </p>

            <FaqAccordion />
          </div>
        </div>
      </div>

    </div>
  )
}