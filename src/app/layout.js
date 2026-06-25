import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from '../Components/Navbar'
import { CartProvider } from '../context/CartContext'

const geist = Geist({ subsets: ['latin'] })

export const metadata = {
  title: 'US Supplements',
  description: 'Premium supplements at best prices',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ fontSize: '16px' }}>
      <body className={`${geist.className} bg-white text-[#1A1A1A]`}>
        <CartProvider>
          <Navbar />
          {children}
          <footer className="bg-[#1A1A1A] text-gray-400 mt-16 px-10 py-12">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-[#C6FF1E] text-[#1A1A1A] font-bold px-2.5 py-1 rounded text-sm">US</div>
              <span className="text-white font-bold text-lg">Supplements</span>
            </div>
            <div className="grid grid-cols-4 gap-10 text-sm">
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
                  <span className="hover:text-white cursor-pointer transition-colors">Track order</span>
                  <span className="hover:text-white cursor-pointer transition-colors">Returns</span>
                  <span className="hover:text-white cursor-pointer transition-colors">FAQ</span>
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
            <div className="border-t border-gray-800 mt-10 pt-6 text-xs text-center">
              © 2026 US Supplements. All rights reserved.
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  )
}