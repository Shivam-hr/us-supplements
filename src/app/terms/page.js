/*
  DRAFT LEGAL CONTENT — written as a reasonable starting template, not
  reviewed by a lawyer. Replace with counsel-reviewed content before
  handling real customer orders/payments at scale.
*/
import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service | US Supplements',
  description: 'Terms and conditions for using the US Supplements website and placing orders.',
}

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: `By accessing or using the US Supplements website ("we", "us", "our"), placing an order, or creating an account, you agree to be bound by these Terms of Service. If you do not agree, please do not use this website.`
  },
  {
    title: '2. Eligibility',
    body: `You must be at least 18 years old to place an order on this website. By placing an order, you confirm that you are legally capable of entering into a binding contract.`
  },
  {
    title: '3. Product Information & Pricing',
    body: `We make every effort to display accurate product descriptions, images, and pricing. However, we do not warrant that product descriptions, pricing, or other content is entirely error-free. In the event of a pricing error, we reserve the right to cancel the affected order and issue a full refund. Supplement products are not intended to diagnose, treat, cure, or prevent any disease — consult a healthcare professional before use, especially if you have a medical condition or are pregnant/nursing.`
  },
  {
    title: '4. Orders & Acceptance',
    body: `Placing an order on this website is an offer to purchase. We reserve the right to accept or decline any order for any reason, including suspected fraud, pricing errors, or stock unavailability. Order confirmation via email/WhatsApp does not guarantee acceptance until the order is dispatched.`
  },
  {
    title: '5. Payments',
    body: `Online payments are processed securely through Razorpay. We do not store your card, UPI, or net-banking credentials on our servers. Cash on Delivery (COD) orders, where available, must be paid in full to the delivery partner at the time of delivery.`
  },
  {
    title: '6. Shipping & Delivery',
    body: `Delivery timelines shown on the website are estimates and not guaranteed. We are not liable for delays caused by courier partners, weather, regional restrictions, or events beyond our reasonable control.`
  },
  {
    title: '7. Returns, Refunds & Cancellations',
    body: `Please refer to our Refund & Return Policy for detailed terms regarding cancellations, returns, and refunds.`
  },
  {
    title: '8. Account Responsibility',
    body: `You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately of any unauthorized use.`
  },
  {
    title: '9. Intellectual Property',
    body: `All content on this website — including logos, product photography, and written content — is the property of US Supplements or its licensors and may not be reproduced without written permission.`
  },
  {
    title: '10. Limitation of Liability',
    body: `To the maximum extent permitted by law, US Supplements shall not be liable for any indirect, incidental, or consequential damages arising from the use of this website or its products.`
  },
  {
    title: '11. Governing Law',
    body: `These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of India.`
  },
  {
    title: '12. Changes to These Terms',
    body: `We may update these Terms from time to time. Continued use of the website after changes are posted constitutes acceptance of the revised Terms.`
  },
  {
    title: '13. Contact Us',
    body: `For any questions about these Terms, contact us at support@ussupplements.in.`
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-sm text-[#6B7280] hover:text-[#161616] transition-colors mb-6 inline-block">
          ← Back to home
        </Link>

        <h1 className="text-3xl font-black text-[#161616] mb-2">Terms of Service</h1>
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