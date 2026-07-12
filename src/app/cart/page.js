'use client'
import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import Link from 'next/link'
import {
  ShoppingBag, Minus, Plus, Trash2, ShieldCheck, Lock, RotateCcw,
  ChevronDown, Tag, ArrowRight, PartyPopper,
} from 'lucide-react'

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart()
  const [priceOpen, setPriceOpen] = useState(true)

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-8">
        <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ background: '#F0FFC4' }}>
          <ShoppingBag className="w-10 h-10 text-[#1A1A1A]" strokeWidth={1.75} />
        </div>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Your cart is empty</h1>
        <p className="text-gray-400 text-sm text-center -mt-3">
          Looks like you haven't added anything yet.
        </p>
        <Link href="/products">
          <button className="bg-[#C6FF1E] text-[#1A1A1A] font-bold px-8 py-3 rounded-xl text-sm hover:brightness-110 transition-all">
            Start Shopping
          </button>
        </Link>
      </div>
    )
  }

  const deliveryCharge = totalPrice >= 499 ? 0 : 60
  const finalTotal = totalPrice + deliveryCharge
  const totalSavings = cartItems.reduce(
    (sum, item) => sum + (item.mrp > item.price ? (item.mrp - item.price) * item.quantity : 0),
    0
  )

  return (
    <div className="min-h-screen bg-[#F7F8FA] lg:bg-white pb-6 lg:pb-16">

      {/* Mobile — compact header */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
        <Link href="/products" className="flex items-center gap-3 min-w-0">
          <span className="text-xl shrink-0">←</span>
          <span className="text-base font-black text-[#161616] truncate">My Cart ({totalItems})</span>
        </Link>
        <button onClick={clearCart} className="text-xs text-red-400 font-semibold shrink-0">
          Clear
        </button>
      </div>

      {/* Desktop — header (unchanged) */}
      <div className="hidden lg:flex border-b border-gray-100 px-16 py-5 items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A1A]">Your Cart</h1>
          <p className="text-sm text-gray-400 mt-0.5">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
        </div>
        <button
          onClick={clearCart}
          className="text-sm text-red-400 hover:text-red-600 transition-colors"
        >
          Clear cart
        </button>
      </div>

      {/* ============ MOBILE LAYOUT ============ */}
      <div className="lg:hidden px-4 py-4 flex flex-col gap-4">

        {totalSavings > 0 && (
          <div className="rounded-2xl px-4 py-3 flex items-center gap-2.5" style={{ background: '#EFFFBE' }}>
            <PartyPopper className="w-4 h-4 shrink-0" style={{ color: '#1B5E20' }} strokeWidth={2} />
            <p className="text-sm font-bold" style={{ color: '#1B5E20' }}>
              You're saving ₹{totalSavings.toLocaleString()} on this order
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {cartItems.map(item => {
            const discount = item.mrp > item.price
              ? Math.round((item.mrp - item.price) / item.mrp * 100)
              : 0
            return (
              <div key={item.id} className="bg-white rounded-[24px] p-4 shadow-sm flex flex-col gap-3">
                <div className="flex gap-3">
                  <Link href={`/products/${item.id}`} className="shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-contain rounded-2xl bg-gray-50"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400">{item.brand}</p>
                    <Link href={`/products/${item.id}`}>
                      <p className="text-sm font-bold text-[#1A1A1A] leading-snug line-clamp-2">{item.name}</p>
                    </Link>
                    {(item.weight || item.variant_label) && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.weight}{item.weight && item.variant_label ? ' • ' : ''}{item.variant_label}
                      </p>
                    )}
                    <div className="flex items-baseline gap-2 mt-1.5">
                      <span className="text-base font-bold text-[#1A1A1A]">₹{item.price.toLocaleString()}</span>
                      {discount > 0 && (
                        <>
                          <span className="text-xs text-gray-400 line-through">₹{item.mrp.toLocaleString()}</span>
                          <span className="text-xs text-green-600 font-semibold">{discount}% OFF</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </button>
                    <span className="px-4 text-sm font-bold border-x border-gray-200">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                    Remove
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Coupon — visual only, no coupon backend exists yet */}
        <div
          className="rounded-2xl p-4 flex items-center justify-between gap-3"
          style={{ background: '#F8F6F1', border: '1.5px dashed #D9D5CC' }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Tag className="w-4 h-4 shrink-0 text-[#1A1A1A]" strokeWidth={2} />
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#161616]">Apply Coupon</p>
              <p className="text-xs text-gray-500">Unlock amazing offers</p>
            </div>
          </div>
          <button className="bg-[#161616] text-white text-xs font-bold px-4 py-2.5 rounded-xl shrink-0">
            Apply
          </button>
        </div>

        {/* Price details — collapsible */}
        <div className="bg-white rounded-[24px] p-4 border border-gray-100">
          <button onClick={() => setPriceOpen(o => !o)} className="w-full flex items-center justify-between">
            <span className="text-sm font-black text-[#161616]">Price Details</span>
            <ChevronDown
              className="w-4 h-4 text-gray-400 transition-transform"
              style={{ transform: priceOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>
          {priceOpen && (
            <div className="mt-4 flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                <span className="font-semibold text-[#161616]">
                  ₹{cartItems.reduce((sum, item) => sum + item.mrp * item.quantity, 0).toLocaleString()}
                </span>
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Discount on MRP</span>
                  <span className="font-semibold text-green-600">-₹{totalSavings.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className={`font-semibold ${deliveryCharge === 0 ? 'text-green-600' : 'text-[#161616]'}`}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                </span>
              </div>
              {deliveryCharge > 0 && (
                <p className="text-xs text-gray-400">
                  Add ₹{(499 - totalPrice).toLocaleString()} more for free delivery
                </p>
              )}
              <div className="border-t border-gray-100 pt-2.5 flex justify-between">
                <span className="font-black text-[#161616]">Total Amount</span>
                <span className="font-black text-[#161616]">₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: ShieldCheck, label: '100% Authentic' },
            { icon: Lock, label: 'Secure Payment' },
            { icon: RotateCcw, label: 'Easy Returns' },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-2xl p-3 flex flex-col items-center gap-1.5 text-center border border-gray-100">
              <item.icon className="w-5 h-5 text-[#1A1A1A]" strokeWidth={1.75} />
              <p className="text-[10px] font-bold text-gray-500 leading-tight">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ============ DESKTOP LAYOUT (unchanged) ============ */}
      <div className="hidden lg:grid px-16 py-8 grid-cols-3 gap-10">

        {/* LEFT — Cart items */}
        <div className="col-span-2 flex flex-col gap-4">
          {cartItems.map(item => {
            const discount = item.mrp > item.price
              ? Math.round((item.mrp - item.price) / item.mrp * 100)
              : 0

            return (
              <div key={item.id} className="border border-gray-100 rounded-2xl p-5 flex gap-5 hover:border-gray-200 transition-all">

                {/* Product image */}
                <Link href={`/products/${item.id}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-contain rounded-xl bg-gray-50 shrink-0"
                  />
                </Link>

                {/* Product info */}
                <div className="flex-1 flex flex-col gap-2">
                  <p className="text-xs text-gray-400">{item.brand}</p>
                  <Link href={`/products/${item.id}`}>
                    <p className="text-sm font-semibold text-[#1A1A1A] leading-snug hover:text-gray-600 transition-colors">
                      {item.name}
                    </p>
                  </Link>

                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold text-[#1A1A1A]">
                      ₹{item.price.toLocaleString()}
                    </span>
                    {discount > 0 && (
                      <>
                        <span className="text-xs text-gray-400 line-through">
                          ₹{item.mrp.toLocaleString()}
                        </span>
                        <span className="text-xs text-green-600 font-semibold">
                          {discount}% off
                        </span>
                      </>
                    )}
                  </div>

                  {/* Quantity + Remove */}
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1.5 text-base font-bold hover:bg-gray-100 transition-colors"
                      >
                        −
                      </button>
                      <span className="px-4 py-1.5 text-sm font-bold border-x border-gray-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1.5 text-base font-bold hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Item total */}
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-[#1A1A1A]">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      ₹{item.price.toLocaleString()} × {item.quantity}
                    </p>
                  )}
                </div>

              </div>
            )
          })}
        </div>

        {/* RIGHT — Order summary */}
        <div className="col-span-1">
          <div className="border border-gray-100 rounded-2xl p-6 sticky top-24 flex flex-col gap-4">
            <h2 className="text-base font-bold text-[#1A1A1A]">Order summary</h2>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal ({totalItems} items)</span>
                <span className="font-semibold">₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery</span>
                <span className={`font-semibold ${deliveryCharge === 0 ? 'text-green-600' : ''}`}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                </span>
              </div>
              {deliveryCharge > 0 && (
                <p className="text-xs text-gray-400">
                  Add ₹{(499 - totalPrice).toLocaleString()} more for free delivery
                </p>
              )}
            </div>

            <div className="border-t border-gray-100 pt-4 flex justify-between">
              <span className="font-bold text-[#1A1A1A]">Total</span>
              <span className="font-bold text-xl text-[#1A1A1A]">₹{finalTotal.toLocaleString()}</span>
            </div>

            {/* Coupon */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Coupon code"
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#C6FF1E]"
              />
              <button className="bg-gray-100 text-[#1A1A1A] font-semibold px-4 py-2 rounded-xl text-sm hover:bg-gray-200 transition-all">
                Apply
              </button>
            </div>

            <Link href="/checkout">
              <button className="w-full bg-[#C6FF1E] text-[#1A1A1A] font-bold py-4 rounded-2xl text-sm hover:brightness-110 transition-all">
                Proceed to checkout →
              </button>
            </Link>

            <Link href="/products">
              <button className="w-full border border-gray-200 text-[#1A1A1A] font-semibold py-3 rounded-2xl text-sm hover:border-[#C6FF1E] transition-all">
                Continue shopping
              </button>
            </Link>

            {/* Trust */}
            <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
              {['✅ 100% Authentic products', '🔒 Secure checkout', '🚚 Free delivery above ₹499'].map(item => (
                <p key={item} className="text-xs text-gray-400">{item}</p>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* Mobile — sticky checkout bar (sticky within this page's own container, so it scrolls away
          once you reach the site footer instead of floating over it) */}
      <div className="lg:hidden sticky bottom-0 z-30 mt-2 px-4 pb-4">
        <div className="rounded-2xl px-5 py-3.5 flex items-center justify-between" style={{ background: '#101214' }}>
          <div>
            <p className="text-white font-black text-lg leading-tight">₹{finalTotal.toLocaleString()}</p>
            {totalSavings > 0 && (
              <p className="text-xs font-bold" style={{ color: '#C6FF1E' }}>Saved ₹{totalSavings.toLocaleString()}</p>
            )}
          </div>
          <Link href="/checkout">
            <button
              className="flex items-center gap-1.5 font-black text-sm px-5 py-3 rounded-xl hover:brightness-110 transition-all"
              style={{ background: '#C6FF1E', color: '#101214' }}
            >
              Checkout
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}