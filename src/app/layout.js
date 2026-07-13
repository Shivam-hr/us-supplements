import { Geist } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import Navbar from '../Components/Navbar'
import { CartProvider } from '../context/CartContext'
import { WishlistProvider } from '../context/WishlistContext'
import { ToastProvider } from '../context/ToastContext'

const geist = Geist({ subsets: ['latin'] })

export const metadata = {
  title: 'US Supplements',
  description: 'Premium supplements at best prices',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" style={{ fontSize: '16px' }}>
      <body className={`${geist.className} bg-white text-[#1A1A1A]`}>
        <CartProvider>
        <WishlistProvider>
        <ToastProvider>
          <Navbar />
          {children}
          <footer className="bg-[#1A1A1A] text-gray-400 mt-16 px-6 py-10 md:px-10 md:py-12">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-[#C6FF1E] text-[#1A1A1A] font-bold px-2.5 py-1 rounded text-sm">US</div>
              <span className="text-white font-bold text-lg">Supplements</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 md:gap-10 text-sm">
              <div>
                <p className="text-white font-semibold mb-4">Company</p>
                <div className="flex flex-col gap-3">
                  <span className="hover:text-white cursor-pointer transition-colors">About us</span>
                  <span className="hover:text-white cursor-pointer transition-colors">Contact</span>
                  <span className="hover:text-white cursor-pointer transition-colors">Careers</span>
                </div>
              </div>
              <div>
                <p className="text-white font-semibold mb-4">Support</p>
                <div className="flex flex-col gap-3">
                  <Link href="/track-order" className="hover:text-white transition-colors">Track order</Link>
                  <Link href="/refund-policy" className="hover:text-white transition-colors">Returns</Link>
                  <Link href="/support" className="hover:text-white transition-colors">FAQ</Link>
                </div>
              </div>
              <div>
                <p className="text-white font-semibold mb-4">Categories</p>
                <div className="flex flex-col gap-3">
                  <span className="hover:text-white cursor-pointer transition-colors">Protein</span>
                  <span className="hover:text-white cursor-pointer transition-colors">Creatine</span>
                  <span className="hover:text-white cursor-pointer transition-colors">Mass gainers</span>
                </div>
              </div>
              <div>
                <p className="text-white font-semibold mb-4">Connect</p>
                <div className="flex flex-col gap-3">
                  <span className="hover:text-white cursor-pointer transition-colors">Instagram</span>
                  <span className="hover:text-white cursor-pointer transition-colors">WhatsApp</span>
                  <span className="hover:text-white cursor-pointer transition-colors">YouTube</span>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-center">
              <span>© 2026 US Supplements. All rights reserved.</span>
              <span className="hidden sm:inline text-gray-700">•</span>
              <div className="flex items-center gap-3 flex-wrap justify-center">
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                <span className="text-gray-700">•</span>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <span className="text-gray-700">•</span>
                <Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
              </div>
            </div>
          </footer>
        </ToastProvider>
        </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  )
}