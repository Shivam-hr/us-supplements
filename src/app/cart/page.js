'use client'
import { useCart } from '../../context/CartContext'
import Link from 'next/link'

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-8">
        <span className="text-7xl">🛒</span>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Your cart is empty</h1>
        <p className="text-gray-400 text-sm text-center">
          Looks like you haven't added anything yet.
        </p>
        <Link href="/products">
          <button className="bg-[#C6FF1E] text-[#1A1A1A] font-bold px-8 py-3 rounded-xl text-sm hover:brightness-110 transition-all">
            Browse products
          </button>
        </Link>
      </div>
    )
  }

  const deliveryCharge = totalPrice >= 499 ? 0 : 60
  const finalTotal = totalPrice + deliveryCharge

  return (
    <div className="min-h-screen bg-white pb-16">

      {/* Header */}
      <div className="border-b border-gray-100 px-16 py-5 flex items-center justify-between">
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

      <div className="px-16 py-8 grid grid-cols-3 gap-10">

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
    </div>
  )
}