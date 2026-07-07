import Link from 'next/link'

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
    <div className="min-h-screen bg-white pb-16">

      {/* Header */}
      <div className="bg-[#1A1A1A] px-16 py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-3xl">🛡️</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">
          100% Authenticity Guaranteed
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
          Every product sold on US Supplements is sourced directly from authorized distributors.
          Verify your product on the official brand website using the links below.
        </p>
        <div className="flex items-center justify-center gap-6 mt-6">
          {['Direct from brands', 'Original packaging', 'Valid expiry dates'].map(item => (
            <span key={item} className="flex items-center gap-2 text-sm text-[#C6FF1E] font-semibold">
              <span>✓</span> {item}
            </span>
          ))}
        </div>
      </div>

      {/* Brand verification links */}
      <div className="px-16 py-10">
        <p className="text-xs font-bold text-[#1A1A1A] tracking-[0.15em] uppercase mb-6">
          Verify by brand — click to go to official authentication page
        </p>
        <div className="grid grid-cols-3 gap-4">
          {brands.map(brand => (
            <a
              key={brand.name}
              href={brand.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-100 rounded-2xl p-5 flex items-center gap-4 hover:border-[#C6FF1E] hover:shadow-sm transition-all group"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="w-16 h-16 object-contain rounded-xl bg-gray-50 p-2 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#1A1A1A] mb-1">{brand.name}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{brand.description}</p>
                <span className="text-xs text-[#C6FF1E] font-semibold mt-2 inline-block group-hover:underline">
                  Verify on official site →
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Note for other brands */}
        <div className="mt-6 bg-gray-50 rounded-2xl p-5 border border-gray-100">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-[#1A1A1A]">Don't see your brand?</span>{' '}
            Search "{'{brand name}'} authenticity check" on Google or visit the brand's official website directly.
            If you need help, contact us on WhatsApp and we'll assist you.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="px-16 py-6">
        <p className="text-xs font-bold text-[#1A1A1A] tracking-[0.15em] uppercase mb-6">
          Frequently asked questions
        </p>
        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl p-6">
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