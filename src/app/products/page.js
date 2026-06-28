'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

const categories = [
  'Whey Protein', 'Mass Gainer', 'Pre-Workout', 'Creatine',
  'BCAA', 'Vitamins', 'Weight Management', 'Accessories', 'Others'
]

function ProductCard({ product }) {
  const discount = product.mrp > product.price
    ? Math.round((product.mrp - product.price) / product.mrp * 100)
    : 0

  return (
    <Link href={`/products/${product.id}`}>
      <div className="border border-gray-100 rounded-2xl p-3 hover:border-[#C6FF1E] hover:shadow-sm transition-all cursor-pointer group bg-white h-full flex flex-col">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="h-44 w-full object-contain rounded-xl mb-3 group-hover:scale-105 transition-transform"
          />
          {!product.in_stock && (
            <div className="absolute inset-0 bg-white/70 rounded-xl flex items-center justify-center">
              <span className="text-xs font-bold text-gray-500 border border-gray-300 px-2 py-1 rounded-full">Out of stock</span>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 mb-1">{product.brand}</p>
        {product.badge && (
          <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-semibold mb-1 w-fit ${product.badge === 'New' ? 'bg-[#1A1A1A] text-[#C6FF1E]' : 'bg-[#C6FF1E] text-[#1A1A1A]'}`}>
            {product.badge}
          </span>
        )}
        <p className="text-sm font-semibold text-[#1A1A1A] mb-2 leading-snug flex-1">{product.name}</p>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base font-bold text-[#1A1A1A]">₹{product.price.toLocaleString()}</span>
          {discount > 0 && (
            <>
              <span className="text-xs text-gray-400 line-through">₹{product.mrp.toLocaleString()}</span>
              <span className="text-xs text-green-600 font-semibold">{discount}% off</span>
            </>
          )}
        </div>
        <button
          onClick={e => e.preventDefault()}
          disabled={!product.in_stock}
          className={`w-full text-sm font-semibold py-2.5 rounded-xl transition-all ${product.in_stock ? 'bg-[#1A1A1A] text-[#C6FF1E] hover:bg-[#333]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
        >
          {product.in_stock ? 'Add to cart' : 'Out of stock'}
        </button>
      </div>
    </Link>
  )
}

const sortOptions = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Discount', value: 'discount' },
  { label: 'Name A-Z', value: 'name' },
]

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedBrands, setSelectedBrands] = useState([])
  const [sort, setSort] = useState('relevance')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [search, setSearch] = useState('')
  const [priceMax, setPriceMax] = useState(20000)

  // THIS is where await goes — inside useEffect, inside an async function
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')

      if (error) {
        console.error('Error fetching products:', error.message)
      } else {
        setProducts(data)
      }
      setLoading(false)
    }

    fetchProducts()
  }, []) // empty array = run once when page loads

  const allBrands = useMemo(() => [...new Set(products.map(p => p.brand))].sort(), [products])

  const filtered = useMemo(() => {
    let result = [...products]
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    }
    if (selectedCategory !== 'All') result = result.filter(p => p.category === selectedCategory)
    if (selectedBrands.length > 0) result = result.filter(p => selectedBrands.includes(p.brand))
    if (inStockOnly) result = result.filter(p => p.in_stock)
    result = result.filter(p => p.price <= priceMax)
    switch (sort) {
      case 'price_asc': result.sort((a, b) => a.price - b.price); break
      case 'price_desc': result.sort((a, b) => b.price - a.price); break
      case 'discount': result.sort((a, b) => {
        const da = a.mrp > a.price ? (a.mrp - a.price) / a.mrp : 0
        const db = b.mrp > b.price ? (b.mrp - b.price) / b.mrp : 0
        return db - da
      }); break
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break
    }
    return result
  }, [search, selectedCategory, selectedBrands, inStockOnly, sort, priceMax, products])

  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
  }

  const clearFilters = () => {
    setSelectedCategory('All')
    setSelectedBrands([])
    setInStockOnly(false)
    setPriceMax(20000)
    setSearch('')
  }

  const hasFilters = selectedCategory !== 'All' || selectedBrands.length > 0 || inStockOnly || priceMax < 20000 || search

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#C6FF1E] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A1A]">All Products</h1>
          <p className="text-sm text-gray-400 mt-0.5">{filtered.length} products found</p>
        </div>
        <div className="flex items-center gap-3">
          {hasFilters && (
            <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-[#1A1A1A] underline">
              Clear all filters
            </button>
          )}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-[#1A1A1A] outline-none focus:border-[#C6FF1E]"
          >
            {sortOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex">
        <aside className="w-60 shrink-0 border-r border-gray-100 px-5 py-6 sticky top-0 h-screen overflow-y-auto">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] mb-3">Search</p>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#C6FF1E]"
            />
          </div>
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] mb-3">Category</p>
            <div className="flex flex-col gap-1.5">
              {['All', ...categories].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left text-sm px-3 py-1.5 rounded-xl transition-all ${selectedCategory === cat ? 'bg-[#C6FF1E] text-[#1A1A1A] font-semibold' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] mb-3">
              Max price: ₹{priceMax.toLocaleString()}
            </p>
            <input
              type="range" min={100} max={20000} step={100}
              value={priceMax}
              onChange={e => setPriceMax(Number(e.target.value))}
              className="w-full accent-[#C6FF1E]"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>₹100</span><span>₹20,000</span>
            </div>
          </div>
          <div className="mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={inStockOnly}
                onChange={e => setInStockOnly(e.target.checked)}
                className="accent-[#C6FF1E] w-4 h-4"
              />
              <span className="text-sm text-[#1A1A1A] font-medium">In stock only</span>
            </label>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] mb-3">Brand</p>
            <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto">
              {allBrands.map(brand => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="accent-[#C6FF1E] w-3.5 h-3.5 shrink-0"
                  />
                  <span className="text-sm text-gray-500 group-hover:text-[#1A1A1A] transition-colors leading-snug">
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 px-6 py-6">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="text-5xl mb-4">🔍</span>
              <p className="text-lg font-semibold text-[#1A1A1A]">No products found</p>
              <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or search term</p>
              <button onClick={clearFilters} className="mt-4 bg-[#C6FF1E] text-[#1A1A1A] font-bold px-6 py-2.5 rounded-xl text-sm">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}