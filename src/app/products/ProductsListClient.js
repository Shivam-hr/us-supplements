'use client'
import { useState, useEffect, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import { useCart } from '../../context/CartContext'
import { SlidersHorizontal, ArrowUpDown, X, ChevronDown, ChevronUp } from 'lucide-react'

import { useSearchParams } from 'next/navigation'


const categories = [
  'Whey Protein', 'Mass Gainer', 'Pre-Workout', 'Creatine',
  'BCAA', 'Vitamins', 'Weight Management', 'Accessories', 'Others']

  const searchSynonyms = {
  'mb': 'muscleblaze',
  'avtar': 'avvatar',
  'on': 'optimum nutrition',
  'iso': 'isolate',
  'bca': 'bcaa',
  'mas gainer': 'mass gainer'
}



function ProductCard({ product }) {
  const discount = product.mrp > product.price
    ? Math.round((product.mrp - product.price) / product.mrp * 100)
    : 0
    const { addToCart } = useCart()

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
          onClick={e => {
            e.preventDefault()
            addToCart(product, 1)
          }}
          className="w-full bg-[#1A1A1A] text-[#C6FF1E] text-sm font-semibold py-3 rounded-xl hover:bg-[#333] transition-all cursor-pointer"
        >
          Add to cart
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

// Shared bottom-sheet shell used by both Filter and Sort on mobile —
// slides up from the bottom with a backdrop, matches native app patterns.
function BottomSheet({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="
      absolute bottom-0 left-0 right-0
      bg-gradient-to-b from-[#111111] to-[#000000]
      rounded-t-3xl max-h-[85vh]
      flex flex-col
      border border-[#2A2A2A]
      ">
        <div className="flex justify-center pt-3">
          <div className="w-10 h-1.5 bg-[#5A5A5A] rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 pt-3 pb-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white hover:text-[#1A1A1A] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {children}
        </div>
        {footer && (
          <div className="px-5 py-4 border-t border-[#2A2A2A]">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

function ProductsPageContent() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedBrands, setSelectedBrands] = useState([])
  const [sort, setSort] = useState('relevance')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [search, setSearch] = useState('')
  const [priceMax, setPriceMax] = useState(20000)

  // Mobile-only UI state — which bottom sheet is open, and whether the
  // brand list inside the filter sheet is expanded (it's long, so it starts collapsed)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [mobileSortOpen, setMobileSortOpen] = useState(false)
  const [brandsExpanded, setBrandsExpanded] = useState(false)

  const searchParams = useSearchParams()

  useEffect(() => {
    const urlSearch = searchParams.get('search')
    if (urlSearch) {
      setSearch(urlSearch)
    }
  }, [searchParams])

  useEffect(() => {
    const urlCategory = searchParams.get('category')
    if (urlCategory) {
      setSelectedCategory(urlCategory)
    }
  }, [searchParams])

  useEffect(() => {
    const urlBrand = searchParams.get('brand')
    if (urlBrand) {
      setSelectedBrands([urlBrand])
    }
  }, [searchParams])

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
      let q = search.toLowerCase().trim()

      // 1. Swap out synonyms
      Object.keys(searchSynonyms).forEach(key => {
        const regex = new RegExp(`\\b${key}\\b`, 'gi')
        q = q.replace(regex, searchSynonyms[key])
      })

      // 2. Split the search query into individual words (e.g., ["muscleblaze", "shaker"])
      const searchWords = q.split(/\s+/)

      // 3. Make sure EVERY word exists somewhere in the product name, brand, or category
      result = result.filter(p => {
        const searchableText = `${p.name} ${p.brand} ${p.category}`.toLowerCase()
        return searchWords.every(word => searchableText.includes(word))
      })
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

  // Reusable category list — used inside the mobile filter sheet.
  // Kept as single-select to match the existing desktop sidebar behavior
  // (and every ?category= link pointing at this page) — just styled as a
  // checkbox-like row per the mobile design, not turned into true multi-select.
  const CategoryList = () => (
    <div className="flex flex-col gap-1">
      {['All', ...categories].map(cat => (
        <button
          key={cat}
          onClick={() => setSelectedCategory(cat)}
          className="flex items-center gap-3 py-2.5 text-left cursor-pointer"
        >
          <span className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
            selectedCategory === cat ? 'bg-[#C6FF1E] border-[#C6FF1E]' : 'border-gray-300'
          }`}>
            {selectedCategory === cat && <span className="text-[#1A1A1A] text-xs font-bold">✓</span>}
          </span>
          <span className={`text-sm ${selectedCategory === cat ? 'font-semibold text-white' : 'text-gray-300'}`}>
            {cat}
          </span>
        </button>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-white">

      {/* ============ DESKTOP LAYOUT (lg and up) — unchanged from before ============ */}
      <div className="hidden lg:block">
        <div className="border-b border-gray-100 px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#1A1A1A]">All Products</h1>
            <p className="text-sm text-gray-400 mt-0.5">{filtered.length} products found</p>
          </div>
          <div className="flex items-center gap-3">
            {hasFilters && (
              <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-[#1A1A1A] underline cursor-pointer">
                Clear all filters
              </button>
            )}
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-[#1A1A1A] outline-none focus:border-[#C6FF1E] cursor-pointer"
            >
              {sortOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex">
          <aside className="w-60 shrink-0 border-r border-gray-100 px-5 py-6 sticky top-45 h-[calc(100vh-9rem-2rem)] overflow-y-auto">
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
                    className={`text-left text-sm px-3 py-1.5 rounded-xl transition-all cursor-pointer ${selectedCategory === cat ? 'bg-[#C6FF1E] text-[#1A1A1A] font-semibold' : 'text-gray-500 hover:bg-gray-100'}`}
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
                <button onClick={clearFilters} className="mt-4 bg-[#C6FF1E] text-[#1A1A1A] font-bold px-6 py-2.5 rounded-xl text-sm cursor-pointer">
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

      {/* ============ MOBILE LAYOUT (below lg) ============ */}
      <div className="lg:hidden px-4 py-4">

        {/* Search bar */}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search for 'Whey Protein'..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C6FF1E] mb-3"
        />

        {/* Filter / Sort buttons */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold cursor-pointer transition-all
            ${
              mobileFilterOpen
                ? 'bg-[#C6FF1E] text-black border border-[#C6FF1E]'
                : 'bg-white text-[#1A1A1A] border border-gray-200'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>
          <button
            onClick={() => setMobileSortOpen(true)}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold cursor-pointer transition-all
            ${
              mobileSortOpen
                ? 'bg-[#C6FF1E] text-black border border-[#C6FF1E]'
                : 'bg-white text-[#1A1A1A] border border-gray-200'
            }`}
          >
            <ArrowUpDown className="w-4 h-4" />
            Sort
          </button>
        </div>

        {/* Product count + clear filters */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-bold text-[#1A1A1A]">All Products</p>
            <p className="text-xs text-gray-400">{filtered.length} products found</p>
          </div>
          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-gray-500 underline cursor-pointer">
              Clear all
            </button>
          )}
        </div>

        {/* 2-column product grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4">🔍</span>
            <p className="text-base font-semibold text-[#1A1A1A]">No products found</p>
            <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or search term</p>
            <button onClick={clearFilters} className="mt-4 bg-[#C6FF1E] text-[#1A1A1A] font-bold px-6 py-2.5 rounded-xl text-sm cursor-pointer">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* ============ MOBILE FILTER BOTTOM SHEET ============ */}
      <BottomSheet
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title="Filters"
        footer={
          <button
            onClick={() => setMobileFilterOpen(false)}
            className="w-full bg-[#C6FF1E] text-[#1A1A1A] font-bold py-3.5 rounded-xl text-sm cursor-pointer"
          >
            Apply Filters ({filtered.length})
          </button>
        }
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold text-white">Category</p>
        </div>
        <CategoryList />

        <div className="border-t border-gray-100 my-5" />

        <p className="text-sm font-bold text-[#1A1A1A] mb-3">Price Range</p>
        <p className="text-xs text-gray-400 mb-2">Up to ₹{priceMax.toLocaleString()}</p>
        <input
          type="range" min={100} max={20000} step={100}
          value={priceMax}
          onChange={e => setPriceMax(Number(e.target.value))}
          className="w-full accent-[#C6FF1E]"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1 mb-5">
          <span>₹100</span><span>₹20,000</span>
        </div>

        <label className="flex items-center gap-2 cursor-pointer mb-5">
          <input type="checkbox" checked={inStockOnly}
            onChange={e => setInStockOnly(e.target.checked)}
            className="accent-[#C6FF1E] w-4 h-4"
          />
          <span className="text-sm text-[#1A1A1A] font-medium">In stock only</span>
        </label>

        <div className="border-t border-gray-100 my-5" />

        <button
          onClick={() => setBrandsExpanded(!brandsExpanded)}
          className="w-full flex items-center justify-between mb-3 cursor-pointer"
        >
          <p className="text-sm font-bold text-[#1A1A1A]">Brands</p>
          {brandsExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {brandsExpanded && (
          <div className="flex flex-col gap-1 max-h-56 overflow-y-auto">
            {allBrands.map(brand => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer py-1.5">
                <input type="checkbox" checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="accent-[#C6FF1E] w-4 h-4 shrink-0"
                />
                <span className="text-sm text-gray-300">{brand}</span>
              </label>
            ))}
          </div>
        )}
      </BottomSheet>

      {/* ============ MOBILE SORT BOTTOM SHEET ============ */}
      <BottomSheet
        open={mobileSortOpen}
        onClose={() => setMobileSortOpen(false)}
        title="Sort by"
        footer={
          <button
            onClick={() => setMobileSortOpen(false)}
            className="w-full bg-[#C6FF1E] text-[#1A1A1A] font-bold py-3.5 rounded-xl text-sm cursor-pointer"
          >
            Apply
          </button>
        }
      >
        <div className="flex flex-col">
          {sortOptions.map(o => (
            <button
              key={o.value}
              onClick={() => setSort(o.value)}
              className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0 cursor-pointer"
            >
              <span className={`text-sm ${sort === o.value ? 'font-semibold text-white' : 'text-gray-300'}`}>
                {o.label}
              </span>
              <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                sort === o.value ? 'border-[#C6FF1E]' : 'border-gray-300'
              }`}>
                {sort === o.value && <span className="w-2.5 h-2.5 rounded-full bg-[#C6FF1E]" />}
              </span>
            </button>
          ))}
        </div>
      </BottomSheet>

    </div>
  )
}
export default function ProductsListClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#C6FF1E] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  )
}