'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  Package, Pill, ShieldCheck, RotateCcw,
  MessageCircle, Mail, Phone, Plus, Minus, ArrowRight, Headphones,
} from 'lucide-react'

const quickHelp = [
  {
    icon: Package,
    title: 'Order Issues',
    desc: 'Track your order, delivery problems or order modifications.',
  },
  {
    icon: Pill,
    title: 'Product Questions',
    desc: 'Know more about our products, ingredients and usage.',
  },
  {
    icon: ShieldCheck,
    title: 'Authenticity',
    desc: 'Verify product authenticity or report any issues.',
  },
  {
    icon: RotateCcw,
    title: 'Returns & Refunds',
    desc: 'Learn about our return policy and refund process.',
  },
]

const faqs = [
  {
    q: 'How can I track my order?',
    a: 'Head to Track Order from the navbar and enter your order ID. You\'ll also get updates via email and SMS at every stage of delivery.',
  },
  {
    q: 'What is your return policy?',
    a: 'We offer a 7-day hassle-free return policy on unopened and unused products. Reach out to support with your order ID to start a return.',
  },
  {
    q: 'How do I verify product authenticity?',
    a: 'Visit our Authenticity page and select your brand to verify directly through the brand\'s official verification portal using your batch number.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Most orders are delivered within 3-5 business days. Metro cities usually see faster delivery, within 2-3 business days.',
  },
  {
    q: 'Do you offer cash on delivery?',
    a: 'Yes, cash on delivery is available on select pin codes. You can check availability at checkout before placing your order.',
  },
  {
    q: 'Can I change or cancel my order?',
    a: 'Orders can be changed or cancelled within 2 hours of placing them. Contact our support team as soon as possible to make changes.',
  },
]

function QuickHelpCard({ icon: Icon, title, desc }) {
  return (
    <div
      className="bg-white rounded-[24px] p-7 flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-2 cursor-pointer"
      style={{ boxShadow: '0 10px 30px rgba(0,0,0,.05)' }}
    >
      <div className="w-12 h-12 rounded-2xl bg-[#F0FFC4] flex items-center justify-center">
        <Icon className="w-6 h-6 text-[#1A1A1A]" strokeWidth={2} />
      </div>
      <div>
        <h3 className="font-bold text-[#1A1A1A] text-base mb-1">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
      </div>
      <span className="text-sm font-semibold text-[#1A1A1A] flex items-center gap-1 mt-auto">
        Get Help
        <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
      </span>
    </div>
  )
}

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(-1)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i
        return (
          <div
            key={i}
            className="bg-white rounded-2xl transition-shadow"
            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
            >
              <span className="font-semibold text-[#1A1A1A] text-sm">{faq.q}</span>
              {isOpen ? (
                <Minus className="w-4 h-4 text-[#1A1A1A] shrink-0" strokeWidth={2.5} />
              ) : (
                <Plus className="w-4 h-4 text-[#1A1A1A] shrink-0" strokeWidth={2.5} />
              )}
            </button>
            {isOpen && (
              <div className="px-6 pb-5 -mt-1">
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-20">

      {/* HERO — reserved banner space, drop the real asset in at 1424.67x480 */}
      <div className="w-full mx-auto" style={{ maxWidth: '1424.67px', aspectRatio: '1424.67 / 480' }}>
        <img
          src="/images/banners/support.png"
          alt="How can we help you today?"
          width="1424.67"
          height="480"
          className="w-full h-full object-cover"
        />
      </div>

      {/* QUICK HELP CARDS */}
      
      <div className="px-16 mt-14">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-xl font-black text-[#1A1A1A] mb-1">Quick Help</h2>
          <p className="text-center text-sm text-gray-500 mb-8">
            Find answers to common questions or get support.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {quickHelp.map(item => (
              <QuickHelpCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </div>

      {/* CONTACT OPTIONS */}
      <div className="px-16 mt-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-xl font-black text-[#1A1A1A] mb-1">Contact Our Support Team</h2>
          <p className="text-center text-sm text-gray-500 mb-8">
            Choose the best way to reach us.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* WhatsApp */}
            <div className="bg-[#B7FF1E] rounded-[24px] p-7 flex flex-col gap-3">
              <div className="w-11 h-11 rounded-full bg-white/40 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-[#1A1A1A]" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-[#1A1A1A] text-base">WhatsApp Support</h3>
              <p className="text-sm text-[#1A1A1A]/70 leading-relaxed">
                Chat with us instantly on WhatsApp for quick assistance.
              </p>
              <a
                href="https://wa.me/911234567880"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto bg-[#1A1A1A] text-[#B7FF1E] text-sm font-bold text-center py-3 rounded-xl hover:bg-[#2A2A2A] transition-colors flex items-center justify-center gap-2"
              >
                Chat on WhatsApp
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </a>
            </div>

            {/* Email */}
            <div
              className="bg-white rounded-[24px] p-7 flex flex-col gap-3"
              style={{ boxShadow: '0 10px 30px rgba(0,0,0,.05)' }}
            >
              <div className="w-11 h-11 rounded-full bg-[#F0FFC4] flex items-center justify-center">
                <Mail className="w-6 h-6 text-[#1A1A1A]" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-[#1A1A1A] text-base">Email Support</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Drop us an email and we&apos;ll get back to you within 24 hours.
              </p>
              <a
                href="mailto:support@ussupplements.in"
                className="mt-auto border border-gray-200 text-[#1A1A1A] text-sm font-semibold text-center py-3 rounded-xl hover:border-[#1A1A1A] transition-colors flex items-center justify-center gap-2"
              >
                Send an Email
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </a>
            </div>

            {/* Call */}
            <div
              className="bg-white rounded-[24px] p-7 flex flex-col gap-3"
              style={{ boxShadow: '0 10px 30px rgba(0,0,0,.05)' }}
            >
              <div className="w-11 h-11 rounded-full bg-[#F0FFC4] flex items-center justify-center">
                <Phone className="w-6 h-6 text-[#1A1A1A]" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-[#1A1A1A] text-base">Call Us</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Speak directly with our support team.
              </p>
              <a
                href="tel:+911234567880"
                className="mt-auto border border-gray-200 text-[#1A1A1A] text-sm font-semibold text-center py-3 rounded-xl hover:border-[#1A1A1A] transition-colors flex items-center justify-center gap-2"
              >
                Call +91 12345 67880
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16 py-16" style={{ backgroundColor: '#F8F6F1' }}>
        <div className="px-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-center text-xl font-black text-[#1A1A1A] mb-1">Frequently Asked Questions</h2>
            <p className="text-center text-sm text-gray-500 mb-10">
              Quick answers to the questions we hear most.
            </p>
            <FaqAccordion />
          </div>
        </div>
      </div>

      {/* STILL NEED HELP CTA */}
      <div className="px-16 mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-[24px] bg-[#101214] px-10 py-10 flex items-center justify-between gap-6">
            <div className="relative z-10">
              <h3 className="text-white text-xl font-black mb-2">Still need help?</h3>
              <p className="text-gray-400 text-sm">
                Our support team typically replies within 24 hours.
              </p>
            </div>
            <a
              href="mailto:support@ussupplements.in"
              className="relative z-10 shrink-0 bg-[#B7FF1E] text-[#1A1A1A] font-bold text-sm px-6 py-3.5 rounded-xl hover:brightness-110 transition-all flex items-center gap-2"
            >
              Contact Support
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </a>
            <Headphones className="absolute right-24 top-1/2 -translate-y-1/2 w-28 h-28 text-white/5 hidden md:block" strokeWidth={1} />
          </div>
        </div>
      </div>

    </div>
  )
}