'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import Link from 'next/link'
import { useCart } from '../../../context/CartContext'
import ProductCard from '../../../Components/ProductCard'
import LoginRequiredModal from '../../../Components/LoginRequiredModal'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import {
  ShieldCheck, Lock, RotateCcw, Headphones, Minus, Plus,
  ShoppingCart, ChevronLeft, ChevronRight, CheckCircle2, XCircle, MapPin,
} from 'lucide-react'

// Which categories tend to get bought alongside each category — used to build
// the "Frequently Bought Together" bundle. Falls back to Accessories/Vitamins
// for anything not listed, and to same-category-different-brand if a category
// has no matching complementary stock at all.
const complementMap = {
  'Whey Protein': ['Creatine', 'Accessories'],
  'Mass Gainer': ['Creatine', 'Accessories'],
  'Pre-Workout': ['BCAA', 'Accessories'],
  'Creatine': ['Whey Protein', 'Accessories'],
  'BCAA': ['Whey Protein', 'Creatine'],
  'Vitamins': ['Whey Protein', 'Accessories'],
}
const defaultComplements = ['Accessories', 'Vitamins']
const stackCategories = ['Pre-Workout', 'Creatine', 'BCAA', 'Vitamins']

export default function ProductDetailClient({ id }) {
  const { addToCart } = useCart()
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const requireLogin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setShowLoginModal(true)
      return false
    }
    return true
  }

  const handleAddToCart = async (prod, qty) => {
    if (!(await requireLogin())) return
    addToCart(prod, qty)
  }

  const handleBuyNow = async (prod, qty) => {
    if (!(await requireLogin())) return
    addToCart(prod, qty)
    router.push('/checkout')
  }

  const [product, setProduct] = useState(null)
  const [variantSiblings, setVariantSiblings] = useState([])
  const [relatedProducts, setRelatedProducts] = useState([])
  const [bundleSlots, setBundleSlots] = useState([])
  const [stackItems, setStackItems] = useState([])
  const [trendingProducts, setTrendingProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [pincode, setPincode] = useState('')
  const [pincodeStatus, setPincodeStatus] = useState(null) // null | 'ok' | 'invalid'

  useEffect(() => {
    let active = true

    const run = async () => {
      setLoading(true)
      setPincode('')
      setPincodeStatus(null)
      setQuantity(1)

      const { data: prod } = await supabase
        .from('products')
        .select('*')
        .eq('id', parseInt(id))
        .single()

      if (!active) return
      setProduct(prod)
      if (!prod) { setLoading(false); return }

      // Variant siblings (flavour/weight switcher) — only products with a
      // group_id set (currently just Avvatar) will have any siblings here.
      if (prod.group_id) {
        const { data: siblings } = await supabase
          .from('products')
          .select('id, weight, variant_label, price, in_stock')
          .eq('group_id', prod.group_id)
        setVariantSiblings(siblings || [])
      } else {
        setVariantSiblings([])
      }

      // You May Also Like — same category
      const { data: related } = await supabase
        .from('products')
        .select('*')
        .eq('category', prod.category)
        .eq('in_stock', true)
        .neq('id', prod.id)
        .limit(8)
      if (active) setRelatedProducts(related || [])

      // Frequently Bought Together — complementary categories, same brand preferred
      const categories = complementMap[prod.category] || defaultComplements
      const slots = []
      for (const cat of categories) {
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('category', cat)
          .eq('in_stock', true)
          .limit(10)
        if (data && data.length) {
          const sorted = [...data].sort(
            (a, b) => (b.brand === prod.brand ? 1 : 0) - (a.brand === prod.brand ? 1 : 0)
          )
          slots.push({ category: cat, candidates: sorted, index: 0 })
        }
      }
      if (slots.length === 0) {
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('category', prod.category)
          .eq('in_stock', true)
          .neq('brand', prod.brand)
          .neq('id', prod.id)
          .limit(10)
        if (data && data.length) {
          slots.push({ category: prod.category, candidates: data, index: 0 })
        }
      }
      if (active) setBundleSlots(slots)

      // Complete Your Stack — one representative product per category
      const stackResults = []
      for (const cat of stackCategories) {
        if (cat === prod.category) continue
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('category', cat)
          .eq('in_stock', true)
          .order('price', { ascending: true })
          .limit(1)
        if (data && data.length) stackResults.push(data[0])
      }
      if (active) setStackItems(stackResults)

      // Trending Now
      const { data: trending } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .neq('id', prod.id)
        .or('badge.eq.Trending,is_featured.eq.true')
        .limit(12)
      if (active) setTrendingProducts(trending || [])

      setLoading(false)
    }

    run()
    return () => { active = false }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
        <div className="w-10 h-10 border-4 border-[#B7FF1E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F7F8FA]">
        <span className="text-5xl">😕</span>
        <p className="text-xl font-bold text-[#161616]">Product not found</p>
        <Link href="/products" className="bg-[#B7FF1E] text-[#101214] font-bold px-6 py-3 rounded-2xl text-sm">
          Back to products
        </Link>
      </div>
    )
  }

  const discount = product.mrp > product.price
    ? Math.round((product.mrp - product.price) / product.mrp * 100)
    : 0

  // Unique weights across all siblings (including this product itself)
  const allVariants = [
    { id: product.id, weight: product.weight, variant_label: product.variant_label, price: product.price, in_stock: product.in_stock },
    ...variantSiblings.filter(s => s.id !== product.id),
  ]
  const availableWeights = [...new Set(allVariants.map(v => v.weight).filter(Boolean))]
  // Flavours available at the CURRENTLY selected weight only
  const flavoursAtCurrentWeight = allVariants.filter(v => v.weight === product.weight)

  const goToVariant = (targetId) => {
    if (targetId && targetId !== product.id) router.push(`/products/${targetId}`)
  }

  // When switching weight, jump to the sibling with the same flavour if it
  // exists at that weight, otherwise just the first one available there.
  const goToWeight = (targetWeight) => {
    const sameFlavour = allVariants.find(v => v.weight === targetWeight && v.variant_label === product.variant_label)
    const fallback = allVariants.find(v => v.weight === targetWeight)
    goToVariant((sameFlavour || fallback)?.id)
  }

  const cycleSlot = (slotIdx, direction) => {
    setBundleSlots(prev => prev.map((s, i) => {
      if (i !== slotIdx) return s
      const len = s.candidates.length
      return { ...s, index: (s.index + direction + len) % len }
    }))
  }

  const bundleItems = bundleSlots.map(s => s.candidates[s.index])
  const bundleRawTotal = product.price + bundleItems.reduce((sum, p) => sum + p.price, 0)
  const bundlePrice = Math.round(bundleRawTotal * 0.85)
  const bundleSavings = bundleRawTotal - bundlePrice

  const addBundleToCart = async () => {
    if (!(await requireLogin())) return
    addToCart(product, 1)
    bundleItems.forEach(p => addToCart(p, 1))
  }

  const checkPincode = () => {
    setPincodeStatus(/^\d{6}$/.test(pincode) ? 'ok' : 'invalid')
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-16" style={{ backgroundColor: '#F7F8FA' }}>

      {/* Breadcrumb */}
      <div className="px-6 lg:px-16 py-4 flex items-center gap-2 text-sm text-gray-400 flex-wrap">
        <Link href="/" className="hover:text-[#161616] transition-colors">Home</Link>
        <span>›</span>
        <Link href="/products" className="hover:text-[#161616] transition-colors">Products</Link>
        <span>›</span>
        <span className="text-[#161616] font-medium">{product.category}</span>
        <span>›</span>
        <span className="text-gray-400 truncate max-w-xs">{product.name}</span>
      </div>

      {/* HERO */}
      <div className="px-6 lg:px-16 py-2 grid grid-cols-1 lg:grid-cols-[45%_55%] gap-6">

        {/* Gallery card */}
        <div className="flex flex-col gap-4">
          <div
            className="bg-white flex items-center justify-center"
            style={{ borderRadius: '32px', padding: '40px', minHeight: '440px' }}
          >
            {product.images && product.images.length > 0 ? (
              <Swiper
                modules={[Navigation]}
                navigation
                spaceBetween={10}
                slidesPerView={1}
                className="w-full h-[380px] product-gallery-swiper"
              >
                {product.images.map((url, i) => (
                  <SwiperSlide key={i} className="flex items-center justify-center">
                    <img
                      src={url}
                      alt={`${product.name} - view ${i + 1}`}
                      className="max-h-[380px] w-full object-contain"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <img
                src={product.image}
                alt={product.name}
                className="max-h-[380px] w-full object-contain"
              />
            )}
          </div>

          {!product.in_stock && (
            <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-center">
              <p className="text-red-500 font-semibold text-sm">Currently out of stock</p>
              <p className="text-red-400 text-xs mt-0.5">Check back soon or browse similar products below</p>
            </div>
          )}
        </div>

        {/* Product info card */}
        <div className="bg-white flex flex-col gap-5" style={{ borderRadius: '32px', padding: '40px' }}>

          <div className="flex items-center gap-3 flex-wrap">
            <span style={{ fontSize: '18px', fontWeight: 500, color: '#6B7280' }}>{product.brand}</span>
            {product.badge && (
              <span
                className="text-xs px-2.5 py-1 rounded-full font-bold"
                style={{
                  background: product.badge === 'New' ? '#101214' : '#B7FF1E',
                  color: product.badge === 'New' ? '#B7FF1E' : '#101214',
                }}
              >
                {product.badge}
              </span>
            )}
            <span
              className="flex items-center gap-1.5 text-xs font-bold"
              style={{
                background: product.in_stock ? '#ECFDF5' : '#FEF2F2',
                color: product.in_stock ? '#22C55E' : '#EF4444',
                padding: '8px 16px',
                borderRadius: '999px',
              }}
            >
              {product.in_stock ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              {product.in_stock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <h1 style={{ fontSize: '42px', fontWeight: 700, lineHeight: 1.2, color: '#161616' }}>
            {product.name}
          </h1>

          <span className="inline-block bg-gray-100 text-gray-500 text-xs font-medium px-3 py-1 rounded-full w-fit">
            {product.category}
          </span>

          {/* Weight selector — only shows if this product has variant siblings */}
          {availableWeights.length > 1 && (
            <div>
              <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-2">
                Weight: <span className="text-[#161616]">{product.weight}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {availableWeights.map(w => (
                  <button
                    key={w}
                    onClick={() => goToWeight(w)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${
                      w === product.weight
                        ? 'bg-[#101214] text-[#B7FF1E] border-[#101214]'
                        : 'bg-white text-[#161616] border-[#E5E7EB] hover:border-[#B7FF1E]'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Flavour selector — only shows flavours available at the current weight */}
          {flavoursAtCurrentWeight.length > 1 && (
            <div>
              <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-2">
                Flavour: <span className="text-[#161616]">{product.variant_label}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {flavoursAtCurrentWeight.map(v => (
                  <button
                    key={v.id}
                    onClick={() => goToVariant(v.id)}
                    disabled={!v.in_stock}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${
                      v.id === product.id
                        ? 'bg-[#101214] text-[#B7FF1E] border-[#101214]'
                        : v.in_stock
                        ? 'bg-white text-[#161616] border-[#E5E7EB] hover:border-[#B7FF1E]'
                        : 'bg-gray-50 text-gray-300 border-[#E5E7EB] cursor-not-allowed line-through'
                    }`}
                  >
                    {v.variant_label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-baseline gap-4 flex-wrap">
            <span style={{ fontSize: '42px', fontWeight: 800, color: '#161616' }}>
              ₹{product.price.toLocaleString()}
            </span>
            {discount > 0 && (
              <>
                <span style={{ fontSize: '22px', color: '#9CA3AF', textDecoration: 'line-through' }}>
                  ₹{product.mrp.toLocaleString()}
                </span>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#22C55E' }}>
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          {discount > 0 && (
            <p className="text-sm font-medium -mt-3" style={{ color: '#22C55E' }}>
              You save ₹{(product.mrp - product.price).toLocaleString()} on this order
            </p>
          )}

          {/* Delivery checker */}
          <div
            className="flex flex-col gap-3 p-4"
            style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px' }}
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-[#161616]">
              <MapPin className="w-4 h-4" />
              Deliver to
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter pincode"
                value={pincode}
                onChange={e => { setPincode(e.target.value.replace(/\D/g, '')); setPincodeStatus(null) }}
                className="flex-1 min-w-0 px-4 text-sm border border-[#E5E7EB] rounded-2xl outline-none focus:border-[#B7FF1E]"
                style={{ height: '52px' }}
              />
              <button
                onClick={checkPincode}
                className="px-6 text-sm font-bold text-white bg-[#101214] hover:bg-[#17191C] rounded-2xl transition-colors shrink-0"
                style={{ height: '52px' }}
              >
                Check
              </button>
            </div>
            {pincodeStatus === 'ok' && (
              <div className="flex items-center gap-4 text-xs font-semibold flex-wrap">
                <span className="flex items-center gap-1" style={{ color: '#22C55E' }}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Delivery by tomorrow
                </span>
                <span className="text-[#6B7280]">Free Shipping</span>
              </div>
            )}
            {pincodeStatus === 'invalid' && (
              <p className="text-xs font-semibold" style={{ color: '#EF4444' }}>
                Please enter a valid 6-digit pincode
              </p>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-[#161616]">Quantity</span>
            <div
              className="flex items-center border border-[#E5E7EB] overflow-hidden"
              style={{ borderRadius: '16px', height: '52px' }}
            >
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-12 h-full flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-5 text-sm font-bold border-x border-[#E5E7EB] min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-12 h-full flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CTA buttons — hidden on mobile, sticky bar takes over there */}
          <div className="hidden lg:flex gap-3">
            <button
              onClick={() => handleAddToCart(product, quantity)}
              disabled={!product.in_stock}
              className={`flex-1 font-bold text-base transition-all flex items-center justify-center gap-2 ${
                product.in_stock
                  ? 'bg-[#B7FF1E] text-[#101214] hover:bg-[#C8FF4A] cursor-pointer'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              style={{ height: '58px', borderRadius: '16px' }}
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            <button
              onClick={() => handleBuyNow(product, quantity)}
              disabled={!product.in_stock}
              className={`flex-1 font-bold text-base transition-all ${
                product.in_stock
                  ? 'bg-[#101214] text-white hover:bg-[#17191C] cursor-pointer'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              style={{ height: '58px', borderRadius: '16px' }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Sticky mobile Add to Cart bar */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 flex gap-3 p-3"
        style={{ backgroundColor: '#17191C' }}
      >
        <button
          onClick={() => handleAddToCart(product, quantity)}
          disabled={!product.in_stock}
          className={`flex-1 font-bold text-sm flex items-center justify-center gap-2 ${
            product.in_stock ? 'bg-[#B7FF1E] text-[#101214] cursor-pointer' : 'bg-gray-600 text-gray-300 cursor-not-allowed'
          }`}
          style={{ height: '52px', borderRadius: '16px' }}
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
        <button
          onClick={() => handleBuyNow(product, quantity)}
          disabled={!product.in_stock}
          className={`flex-1 font-bold text-sm ${product.in_stock ? 'bg-white text-[#101214] cursor-pointer' : 'bg-gray-600 text-gray-300 cursor-not-allowed'}`}
          style={{ height: '52px', borderRadius: '16px' }}
        >
          Buy Now
        </button>
      </div>

      {/* TRUST BAR */}
      <div className="mt-10 py-8" style={{ backgroundColor: '#F8F6F1' }}>
        <div className="px-6 lg:px-16 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { icon: ShieldCheck, text: '100% Authentic' },
            { icon: Lock, text: 'Secure Payments' },
            { icon: RotateCcw, text: 'Easy Returns' },
            { icon: Headphones, text: 'Customer Support' },
          ].map(item => (
            <div key={item.text} className="flex items-center gap-2.5 justify-center lg:justify-start">
              <item.icon className="w-5 h-5 shrink-0" style={{ color: '#B7FF1E' }} strokeWidth={2} />
              <span className="text-sm font-semibold text-[#161616]">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCT DETAILS */}
      <div className="py-14 bg-white">
        <div className="px-6 lg:px-16 max-w-5xl mx-auto">
          <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#161616' }} className="mb-8">
            Product Details
          </h2>

          {product.description && (
            <div className="mb-10 flex flex-col gap-3 max-w-3xl">
              {product.description.split('\n').filter(Boolean).map((para, i) => (
                <p key={i} className="text-base leading-relaxed" style={{ color: '#374151' }}>
                  {para}
                </p>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Brand', value: product.brand },
              { label: 'Category', value: product.category },
              { label: 'Availability', value: product.in_stock ? 'In Stock' : 'Out of Stock' },
              { label: 'Product ID', value: `#${product.id}` },
            ].map(item => (
              <div key={item.label} className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-[#9CA3AF] font-semibold">{item.label}</span>
                <span className="text-base font-semibold text-[#161616]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FREQUENTLY BOUGHT TOGETHER */}
      {bundleSlots.length > 0 && (
        <div className="py-14" style={{ backgroundColor: '#F8F6F1' }}>
          <div className="px-6 lg:px-16 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-8 flex-wrap">
              <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#161616' }}>Frequently Bought Together</h2>
              <span className="bg-[#B7FF1E] text-[#101214] text-xs font-bold px-3 py-1 rounded-full">SAVE 15%</span>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-4">
              <div className="flex items-center gap-4 flex-wrap justify-center flex-1">

                <BundleItem product={product} />

                {bundleSlots.map((slot, i) => (
                  <div key={slot.category} className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-[#9CA3AF]">+</span>
                    <BundleItem
                      product={slot.candidates[slot.index]}
                      onPrev={slot.candidates.length > 1 ? () => cycleSlot(i, -1) : null}
                      onNext={slot.candidates.length > 1 ? () => cycleSlot(i, 1) : null}
                    />
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-[24px] p-6 flex flex-col gap-3 w-full lg:w-64 shrink-0" style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                <div className="flex justify-between text-sm text-[#6B7280]">
                  <span>Total Price</span>
                  <span className="line-through">₹{bundleRawTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-[#161616]">
                  <span>You Pay</span>
                  <span>₹{bundlePrice.toLocaleString()}</span>
                </div>
                <div className="text-xs font-semibold" style={{ color: '#22C55E' }}>
                  You Save ₹{bundleSavings.toLocaleString()} (15%)
                </div>
                <button
                  onClick={addBundleToCart}
                  className="mt-2 bg-[#101214] text-white font-bold text-sm py-3.5 rounded-2xl hover:bg-[#17191C] transition-colors cursor-pointer"
                >
                  Add Bundle to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* YOU MAY ALSO LIKE */}
      {relatedProducts.length > 0 && (
        <div className="py-14 bg-white">
          <div className="px-6 lg:px-16">
            <div className="flex items-center justify-between mb-8">
              <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#161616' }}>You May Also Like</h2>
              <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="text-sm font-semibold text-[#161616] hover:text-[#6B7280] transition-colors flex items-center gap-1">
                See All →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {relatedProducts.slice(0, 5).map(p => (
                <ProductCard key={p.id} product={p} showBrand />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* COMPLETE YOUR STACK */}
      {stackItems.length > 0 && (
        <div className="py-14 bg-white">
          <div className="px-6 lg:px-16">
            <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#161616' }} className="mb-8">
              Complete Your Stack
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {stackItems.map(p => (
                <Link key={p.id} href={`/products/${p.id}`} className="flex flex-col items-center text-center gap-3 group">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center p-4" style={{ backgroundColor: '#F8F6F1' }}>
                    <img src={p.image} alt={p.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#161616]">{p.category}</p>
                    <p className="text-xs text-[#6B7280]">From ₹{p.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TRENDING NOW */}
      {trendingProducts.length > 0 && (
        <div className="py-14" style={{ backgroundColor: '#F8F6F1' }}>
          <div className="px-6 lg:px-16">
            <div className="flex items-center justify-between mb-8">
              <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#161616' }}>Trending Now</h2>
              <Link href="/products" className="text-sm font-semibold text-[#161616] hover:text-[#6B7280] transition-colors">
                See All →
              </Link>
            </div>
            <Swiper
              className="trending-swiper px-1 py-2"
              modules={[Navigation]}
              navigation
              spaceBetween={20}
              slidesPerView={2}
              breakpoints={{
                640: { slidesPerView: 3 },
                1024: { slidesPerView: 5 },
              }}
            >
              {trendingProducts.map(p => (
                <SwiperSlide key={p.id}>
                  <ProductCard product={p} showBrand />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}

      <LoginRequiredModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />

    </div>
  )
}

function BundleItem({ product, onPrev, onNext }) {
  if (!product) return null
  return (
    <div className="bg-white rounded-2xl p-4 w-36 flex flex-col items-center gap-2 relative" style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
      {onPrev && (
        <button onClick={onPrev} className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-[#E5E7EB] hover:bg-[#B7FF1E] transition-colors z-10">
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      )}
      <img src={product.image} alt={product.name} className="h-20 w-full object-contain" />
      <p className="text-xs font-semibold text-[#161616] text-center leading-snug line-clamp-2">{product.name}</p>
      <p className="text-xs font-bold text-[#161616]">₹{product.price.toLocaleString()}</p>
      {onNext && (
        <button onClick={onNext} className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-[#E5E7EB] hover:bg-[#B7FF1E] transition-colors z-10">
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}