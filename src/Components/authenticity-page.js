import Link from 'next/link'
import { ShieldCheck, PackageCheck, BadgeCheck, Truck, ArrowRight, Headphones, ChevronRight } from 'lucide-react'

const brands = [
  {
    name: 'MuscleBlaze',
    logo: '/images/logo/mb.png',
    url: 'https://www.muscleblaze.com/authenticity-guaranteed',
    description: 'Scan QR code on packaging or enter batch number'
  },
  {
    name: 'Avvatar',
    logo: '/images/logo/avvatar.png',
    url: 'https://www.avvatarindia.com/authenticate',
    description: 'Enter unique code printed inside the lid'
  },
  {
    name: 'AS-IT-IS',
    logo: '/images/logo/asitis.png',
    url: 'https://asitisnutrition.com/pages/authenticity',
    description: 'Verify via QR code or batch number on packaging'
  },
  {
    name: 'GNC',
    logo: '/images/logo/gnc.png',
    url: 'https://www.guardian.in/pages/authenticity',
    description: 'Check authenticity via hologram sticker'
  },
  {
    name: 'Optimum Nutrition',
    logo: '/images/logo/on.png',
    url: 'https://www.optimumnutrition.com/en-us/authenticity',
    description: 'Verify via scratch code on the label'
  },
  {
    name: 'Dymatize',
    logo: '/images/logo/dymatize.jpeg',
    url: 'https://www.dymatize.com/pages/authenticity',
    description: 'Scan QR code or check hologram sticker'
  },
  {
    name: 'Applied Nutrition',
    logo: '/images/logo/appliednutrition.png',
    url: 'https://applied-nutrition.com/pages/authenticity',
    description: 'Enter batch code on their official portal'
  },
  {
    name: 'Elev',
    logo: '/images/logo/elev.png',
    url: 'https://elevnutrition.in/pages/authenticity',
    description: 'Verify product via unique code on packaging'
  },
  {
    name: 'Kevin Levrone',
    logo: '/images/logo/kevin.jpg',
    url: 'https://kevinlevrone.com/pages/authenticity',
    description: 'Check via QR code on product packaging'
  },
  {
    name: 'GAT',
    logo: '/images/logo/gat.png',
    url: 'https://gat.gpasservices.com',
    description: 'Enter the unique authenticator code from your product'
  },
]

const faqs = [
  {
    q: 'How do I know my supplement is authentic?',
    a: 'Every authentic product has a unique QR code, hologram sticker, or batch number on the packaging. You can verify this on the official brand website using the links above. If any of these are missing or damaged, do not consume the product.'
  },
  {
    q: 'Where does US Supplements source its products from?',
    a: 'We source all our products directly from authorized Indian distributors and importers of each brand. We never purchase from third-party resellers or grey market sources. Every product comes with original manufacturer packaging and valid expiry dates.'
  },
  {
    q: 'What should I do if my product fails authentication?',
    a: 'Contact us immediately at our WhatsApp support number. We will investigate the issue, arrange a replacement or full refund, and report it to the brand. Your safety is our priority.'
  },
  {
    q: 'Are imported products authentic?',
    a: 'Yes. Imported products like Dymatize ISO 100, ON Gold Standard, and others are sourced through official importers registered with the brands. You will find the importer name and contact on the packaging as required by Indian law.'
  },
  {
    q: 'What is a hologram sticker and why does it matter?',
    a: 'A hologram sticker is a security feature brands add to packaging. It changes appearance when tilted and cannot be replicated easily. If your product has a damaged, missing, or flat-looking hologram, it may be counterfeit.'
  },
]

export default function AuthenticityPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-16">

      {/* HERO */}
      <div
        className="px-16 py-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #101214 0%, #16181B 55%, #F7F8FA 100%)' }}
      >
        <div className="grid grid-cols-2 gap-12 items-center max-w-6xl mx-auto">

          {/* Left: copy */}
          <div>
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-[#C6FF1E] mb-6">
              Trusted. Tested. Authentic.
            </span>

            <h1 className="text-5xl font-black leading-[1.1] mb-6">
              <span className="text-white">Verified </span>
              <span className="text-[#C6FF1E]">Authentic</span>
              <span className="text-white"> Products</span>
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
            <div className="flex items-center gap-8 mb-10">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-14 h-14 rounded-full border border-zinc-700 flex items-center justify-center text-2xl">
                  🏷️
                </div>
                <p className="text-white text-sm font-bold">Official<br />Distributors</p>
                <p className="text-gray-500 text-xs">Sourced directly</p>
              </div>

              <div className="w-px h-16 bg-zinc-800" />

              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-14 h-14 rounded-full border border-zinc-700 flex items-center justify-center text-2xl">
                  📦
                </div>
                <p className="text-white text-sm font-bold">Factory<br />Sealed</p>
                <p className="text-gray-500 text-xs">100% original<br />packaging</p>
              </div>

              <div className="w-px h-16 bg-zinc-800" />

              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-14 h-14 rounded-full border border-zinc-700 flex items-center justify-center text-2xl">
                  🔗
                </div>
                <p className="text-white text-sm font-bold">Brand<br />Verification Links</p>
                <p className="text-gray-500 text-xs">Direct to<br />official sites</p>
              </div>
            </div>

            <a
              href="#verify-brands"
              className="inline-block bg-[#C6FF1E] text-[#1A1A1A] font-bold px-7 py-3.5 rounded-xl text-sm hover:brightness-110 transition-all"
            >
              Browse Brands ↓
            </a>
          </div>

          {/* Right: photo */}
          <div className="relative h-[420px] rounded-2xl overflow-hidden">
            <img
              src="/images/authenticity/hero-model.jpg"
              alt="US Supplements"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </div>

      {/* Brand verification links */}
      <div id="verify-brands" className="px-16 py-12 bg-[#F7F8FA] scroll-mt-24">

        {/* Section header + top feature badges */}
        <div className="flex items-start justify-between gap-8 mb-10 flex-wrap">
          <div>
            <span className="block text-xs font-bold tracking-[0.15em] uppercase text-green-600 mb-2">
              Verify by brand
            </span>
            <h2 className="text-4xl font-black text-[#1A1A1A] mb-3">
              Verify Your Supplement
            </h2>
            <p className="text-gray-500 text-sm max-w-md leading-relaxed">
              Choose your brand below to verify the authenticity of your product
              on the official brand website.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {[
              { icon: ShieldCheck, title: '100% Original', sub: 'Genuine Products' },
              { icon: PackageCheck, title: 'Factory Sealed', sub: 'Untampered Packaging' },
              { icon: BadgeCheck, title: 'Official Warranty', sub: 'Brand Warranty' },
              { icon: Truck, title: 'Direct Source', sub: 'From Authorized Distributors' },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3">
                <Icon className="w-5 h-5 text-green-600 shrink-0" strokeWidth={2} />
                <div>
                  <p className="text-xs font-bold text-[#1A1A1A] whitespace-nowrap">{title}</p>
                  <p className="text-xs text-gray-400 whitespace-nowrap">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brand cards grid */}
        <div className="grid grid-cols-3 gap-5">
          {brands.map(brand => (
            <div
              key={brand.name}
              className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all flex flex-col"
            >
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-14 h-14 object-contain rounded-xl bg-gray-50 p-2 shrink-0 border border-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <p className="font-bold text-[#1A1A1A]">{brand.name}</p>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full shrink-0">
                      <ShieldCheck className="w-3 h-3" strokeWidth={2.5} />
                      VERIFIED
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{brand.description}</p>
                </div>
              </div>

              <a
                href={brand.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto flex items-center justify-between bg-green-50 hover:bg-green-100 text-green-700 font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
              >
                Verify on official site
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </a>
            </div>
          ))}
        </div>

        {/* Bottom: can't find your brand */}
        <div className="mt-6 bg-white rounded-2xl p-5 border border-gray-100 flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-green-600" strokeWidth={2} />
            </div>
            <div>
              <p className="font-bold text-[#1A1A1A]">Can't find your brand?</p>
              <p className="text-sm text-gray-400">We're adding more brands every week.</p>
            </div>
          </div>
          <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-gray-200 rounded-xl px-5 py-2.5 text-sm font-bold text-[#1A1A1A] hover:border-[#C6FF1E] transition-colors shrink-0"
          >
            <Headphones className="w-4 h-4" strokeWidth={2} />
            Contact Support
            <ChevronRight className="w-4 h-4" strokeWidth={2} />
          </a>
        </div>
      </div>

      {/* FAQ */}
      <div className="px-16 py-6">
        <p className="text-xs font-bold text-[#1A1A1A] tracking-[0.15em] uppercase mb-6">
          Frequently asked questions
        </p>
        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6">
              <p className="font-bold text-[#1A1A1A] mb-2 flex items-start gap-2">
                <span className="text-[#C6FF1E] font-black shrink-0">Q.</span>
                {faq.q}
              </p>
              <p className="text-sm text-gray-500 leading-relaxed pl-5">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mx-16 mt-8 bg-[#1A1A1A] rounded-2xl p-8 flex items-center justify-between">
        <div>
          <p className="text-white font-bold text-lg mb-1">Still have doubts?</p>
          <p className="text-gray-400 text-sm">Our team verifies every batch before shipping. Contact us anytime.</p>
        </div>
        <a
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#C6FF1E] text-[#1A1A1A] font-bold px-6 py-3 rounded-xl text-sm hover:brightness-110 transition-all shrink-0"
        >
          WhatsApp us →
        </a>
      </div>

    </div>
  )
}
