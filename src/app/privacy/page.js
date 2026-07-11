/*
  DRAFT LEGAL CONTENT — written as a reasonable starting template, not
  reviewed by a lawyer. Replace with counsel-reviewed content before
  handling real customer orders/payments at scale.
*/
import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | US Supplements',
  description: 'How US Supplements collects, uses, and protects your personal information.',
}

const sections = [
  {
    title: '1. Information We Collect',
    body: `When you create an account, place an order, or contact support, we may collect: your name, email address, phone number, delivery address, and order history. We do not collect or store your card, UPI, or net-banking details directly — these are handled entirely by our payment partner, Razorpay.`
  },
  {
    title: '2. How We Use Your Information',
    body: `We use your information to: process and deliver your orders, send order confirmations and delivery updates (via email and WhatsApp), respond to support requests, and improve our website and product offerings. We do not sell your personal information to third parties.`
  },
  {
    title: '3. Third-Party Services We Use',
    body: `To operate this website, we share limited data with trusted service providers: Razorpay (payment processing), Supabase (secure database hosting), Twilio (order notifications via WhatsApp), and Resend (order confirmation emails). Each of these providers has its own privacy practices governing the data they process on our behalf.`
  },
  {
    title: '4. Cookies',
    body: `We use essential cookies/local storage to keep items in your cart and to keep you logged in between visits. We do not use third-party advertising trackers at this time.`
  },
  {
    title: '5. Data Security',
    body: `We use industry-standard security practices, including encrypted connections (SSL/HTTPS) and database-level access controls, to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`
  },
  {
    title: '6. Your Rights',
    body: `You may request access to, correction of, or deletion of your personal data by contacting us at support@ussupplements.in. We will respond to verified requests within a reasonable timeframe.`
  },
  {
    title: '7. Data Retention',
    body: `We retain order and account information for as long as necessary to fulfill orders, comply with legal/tax obligations, and resolve disputes.`
  },
  {
    title: '8. Children\'s Privacy',
    body: `This website is not intended for individuals under 18 years of age. We do not knowingly collect personal information from minors.`
  },
  {
    title: '9. Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. Material changes will be reflected by an updated "Last updated" date on this page.`
  },
  {
    title: '10. Contact Us',
    body: `For any privacy-related questions or requests, contact us at support@ussupplements.in.`
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-sm text-[#6B7280] hover:text-[#161616] transition-colors mb-6 inline-block">
          ← Back to home
        </Link>

        <h1 className="text-3xl font-black text-[#161616] mb-2">Privacy Policy</h1>
        <p className="text-sm text-[#9CA3AF] mb-10">Last updated: July 2026</p>

        <div className="flex flex-col gap-8">
          {sections.map(section => (
            <div key={section.title}>
              <h2 className="text-base font-bold text-[#161616] mb-2">{section.title}</h2>
              <p className="text-sm text-[#374151] leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}