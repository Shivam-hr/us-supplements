'use client'
import { useState, use, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import Link from 'next/link'
import { useCart } from '../../../context/CartContext'

export default function ProductDetailPage({ params }) {
  const { addToCart } = useCart()

  const { id } = use(params)
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

useEffect(() => {
  const fetchProduct = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('id', parseInt(id))
      .single()

    setProduct(data)

    if (data) {
      const { data: related } = await supabase
        .from('products')
        .select('*')
        .eq('category', data.category)
        .eq('in_stock', true)
        .neq('id', data.id)
        .limit(4)
      setRelatedProducts(related || [])
    }
    setLoading(false)
  }
  fetchProduct()
}, [id])

  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#C6FF1E] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <span className="text-5xl">😕</span>
        <p className="text-xl font-bold text-[#1A1A1A]">Product not found</p>
        <Link href="/products" className="bg-[#C6FF1E] text-[#1A1A1A] font-bold px-6 py-3 rounded-xl text-sm">
          Back to products
        </Link>
      </div>
    )
  }

  const discount = product.mrp > product.price
    ? Math.round((product.mrp - product.price) / product.mrp * 100)
    : 0


  return (
    <div className="min-h-screen bg-white pb-16">

      <div className="px-16 py-4 flex items-center gap-2 text-sm text-gray-400">
        <Link href="/" className="hover:text-[#1A1A1A] transition-colors">Home</Link>
        <span>›</span>
        <Link href="/products" className="hover:text-[#1A1A1A] transition-colors">Products</Link>
        <span>›</span>
        <span className="text-[#1A1A1A] font-medium">{product.brand}</span>
        <span>›</span>
        <span className="text-gray-400 truncate max-w-xs">{product.name}</span>
      </div>

      <div className="px-16 py-6 grid grid-cols-2 gap-16">

        <div className="flex flex-col gap-4">
          <div className="bg-gray-50 rounded-3xl p-8 flex items-center justify-center" style={{ minHeight: '420px' }}>
            <img
              src={product.image}
              alt={product.name}
              className="max-h-96 w-full object-contain"
            />
          </div>
          {!product.in_stock && (
            <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-center">
              <p className="text-red-500 font-semibold text-sm">Currently out of stock</p>
              <p className="text-red-400 text-xs mt-0.5">Check back soon or browse similar products below</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5 py-2">

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{product.brand}</span>
            {product.badge && (
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${product.badge === 'New' ? 'bg-[#1A1A1A] text-[#C6FF1E]' : 'bg-[#C6FF1E] text-[#1A1A1A]'}`}>
                {product.badge}
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-[#1A1A1A] leading-snug">{product.name}</h1>

          <span className="inline-block bg-gray-100 text-gray-500 text-xs font-medium px-3 py-1 rounded-full w-fit">
            {product.category}
          </span>

          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-bold text-[#1A1A1A]">₹{product.price.toLocaleString()}</span>
            {discount > 0 && (
              <>
                <span className="text-xl text-gray-400 line-through">₹{product.mrp.toLocaleString()}</span>
                <span className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          {discount > 0 && (
            <p className="text-green-600 text-sm font-medium">
              You save ₹{(product.mrp - product.price).toLocaleString()} on this order
            </p>
          )}

          <div className="border-t border-gray-100 pt-5 flex flex-col gap-4">

            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-[#1A1A1A]">Quantity</span>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-2 text-lg font-bold hover:bg-gray-100 transition-colors"
                >
                  −
                </button>
                <span className="px-5 py-2 text-sm font-bold border-x border-gray-200">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-4 py-2 text-lg font-bold hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
  onClick={() => addToCart(product, quantity)}
  disabled={!product.in_stock}
  className={`flex-1 py-4 rounded-2xl font-bold text-base transition-all ${
    product.in_stock
      ? 'bg-[#1A1A1A] text-[#C6FF1E] hover:bg-[#333]'
      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
  }`}
>
  {product.in_stock ? 'Add to cart' : 'Out of stock'}
</button>
              <button
                disabled={!product.in_stock}
                className={`flex-1 py-4 rounded-2xl font-bold text-base transition-all ${product.in_stock ? 'bg-[#C6FF1E] text-[#1A1A1A] hover:brightness-110' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              >
                Buy now
              </button>
            </div>

          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: '✅', text: '100% Authentic' },
              { icon: '🚚', text: 'Free Delivery' },
              { icon: '↩️', text: 'Easy Returns' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
                <span className="text-base">{item.icon}</span>
                <span className="text-xs font-medium text-gray-600">{item.text}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="px-16 mt-10">
          <p className="text-xs font-bold text-[#1A1A1A] tracking-[0.15em] uppercase mb-6">
            More in {product.category}
          </p>
          <div className="grid grid-cols-4 gap-5">
            {relatedProducts.map(p => {
              const disc = p.mrp > p.price ? Math.round((p.mrp - p.price) / p.mrp * 100) : 0
              return (
                <Link key={p.id} href={`/products/${p.id}`}>
                  <div className="border border-gray-100 rounded-2xl p-4 hover:border-[#C6FF1E] transition-all cursor-pointer group">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-40 w-full object-contain rounded-xl mb-3 group-hover:scale-105 transition-transform"
                    />
                    <p className="text-xs text-gray-400 mb-1">{p.brand}</p>
                    <p className="text-sm font-semibold text-[#1A1A1A] mb-2 leading-snug line-clamp-2">{p.name}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-bold">₹{p.price.toLocaleString()}</span>
                      {disc > 0 && <span className="text-xs text-green-600 font-semibold">{disc}% off</span>}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}