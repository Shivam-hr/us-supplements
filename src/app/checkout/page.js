'use client'
import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function CheckoutPage() {
  const { cartItems, totalPrice, totalItems, clearCart } = useCart()
  const router = useRouter()

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const deliveryCharge = totalPrice >= 499 ? 0 : 60
  const finalTotal = totalPrice + deliveryCharge

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) newErrors.phone = 'Enter a valid 10-digit phone number'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email'
    if (!form.address.trim()) newErrors.address = 'Address is required'
    if (!form.city.trim()) newErrors.city = 'City is required'
    if (!form.state.trim()) newErrors.state = 'State is required'
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode)) newErrors.pincode = 'Enter a valid 6-digit pincode'
    return newErrors
  }

 const handlePlaceOrder = async () => {
  const newErrors = validate()
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors)
    return
  }
  setLoading(true)

  // Get current logged in user
  const { data: { user } } = await supabase.auth.getUser()

  // Save order to Supabase
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      user_id: user?.id || null,
      items: cartItems,
      total: finalTotal,
      delivery_charge: deliveryCharge,
      status: 'pending',
      full_name: form.fullName,
      phone: form.phone,
      email: form.email,
      address: form.address,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
    })
    .select()
    .single()

  if (error) {
    console.error('Order error:', error.message)
    setLoading(false)
    return
  }

  clearCart()
  router.push(`/order-success?id=${order.id}`)
}

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5">
        <span className="text-6xl">🛒</span>
        <p className="text-xl font-bold text-[#1A1A1A]">Your cart is empty</p>
        <Link href="/products">
          <button className="bg-[#C6FF1E] text-[#1A1A1A] font-bold px-8 py-3 rounded-xl text-sm">
            Browse products
          </button>
        </Link>
      </div>
    )
  }

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh'
  ]

  const inputClass = (field) => `w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all ${
    errors[field]
      ? 'border-red-400 focus:border-red-500'
      : 'border-gray-200 focus:border-[#C6FF1E]'
  }`

  return (
    <div className="min-h-screen bg-gray-50 pb-16">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-16 py-5">
        <div className="flex items-center gap-3">
          <Link href="/cart" className="text-gray-400 hover:text-[#1A1A1A] transition-colors text-sm">
            ← Back to cart
          </Link>
          <span className="text-gray-200">|</span>
          <h1 className="text-xl font-bold text-[#1A1A1A]">Checkout</h1>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3 mt-4">
          {['Cart', 'Delivery', 'Payment'].map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  i <= 1 ? 'bg-[#C6FF1E] text-[#1A1A1A]' : 'bg-gray-200 text-gray-400'
                }`}>
                  {i < 1 ? '✓' : i + 1}
                </div>
                <span className={`text-sm font-medium ${i <= 1 ? 'text-[#1A1A1A]' : 'text-gray-400'}`}>
                  {step}
                </span>
              </div>
              {i < 2 && <div className={`w-16 h-0.5 ${i < 1 ? 'bg-[#C6FF1E]' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="px-16 py-8 grid grid-cols-3 gap-10">

        {/* LEFT — Delivery form */}
        <div className="col-span-2 flex flex-col gap-6">

          {/* Contact info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="text-base font-bold text-[#1A1A1A] mb-5">Contact information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Full name
                </label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={inputClass('fullName')}
                />
                {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Phone number
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className={inputClass('phone')}
                />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Email address
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={inputClass('email')}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>
          </div>

          {/* Delivery address */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="text-base font-bold text-[#1A1A1A] mb-5">Delivery address</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Full address
                </label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="House/Flat no, Street, Area, Landmark"
                  rows={3}
                  className={`${inputClass('address')} resize-none`}
                />
                {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  City
                </label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  className={inputClass('city')}
                />
                {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Pincode
                </label>
                <input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                  maxLength={6}
                  className={inputClass('pincode')}
                />
                {errors.pincode && <p className="text-red-400 text-xs mt-1">{errors.pincode}</p>}
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  State
                </label>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className={inputClass('state')}
                >
                  <option value="">Select state</option>
                  {indianStates.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
              </div>
            </div>
          </div>

          {/* Payment method — placeholder */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="text-base font-bold text-[#1A1A1A] mb-5">Payment method</h2>
            <div className="flex flex-col gap-3">
              {[
                { id: 'razorpay', label: 'Pay online', sub: 'UPI, Cards, Net Banking, Wallets via Razorpay', icon: '💳' },
                { id: 'cod', label: 'Cash on delivery', sub: 'Pay when your order arrives', icon: '💵' },
              ].map(method => (
                <label key={method.id} className="flex items-center gap-4 border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#C6FF1E] transition-all has-[:checked]:border-[#C6FF1E] has-[:checked]:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    defaultChecked={method.id === 'razorpay'}
                    className="accent-[#C6FF1E] w-4 h-4"
                  />
                  <span className="text-xl">{method.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">{method.label}</p>
                    <p className="text-xs text-gray-400">{method.sub}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT — Order summary */}
        <div className="col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-24 flex flex-col gap-4">

            <h2 className="text-base font-bold text-[#1A1A1A]">
              Order summary ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </h2>

            {/* Items list */}
            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-3 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-contain rounded-lg bg-gray-50 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#1A1A1A] leading-snug line-clamp-2">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-[#1A1A1A] shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold">₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery</span>
                <span className={`font-semibold ${deliveryCharge === 0 ? 'text-green-600' : ''}`}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 flex justify-between">
              <span className="font-bold text-[#1A1A1A]">Total</span>
              <span className="font-bold text-xl text-[#1A1A1A]">₹{finalTotal.toLocaleString()}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${
                loading
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#C6FF1E] text-[#1A1A1A] hover:brightness-110'
              }`}
            >
              {loading ? 'Placing order...' : `Place order • ₹${finalTotal.toLocaleString()}`}
            </button>

            <div className="flex flex-col gap-1.5 pt-2">
              {['🔒 Secure 256-bit SSL encryption', '✅ 100% authentic products', '↩️ 7-day return policy'].map(item => (
                <p key={item} className="text-xs text-gray-400">{item}</p>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}