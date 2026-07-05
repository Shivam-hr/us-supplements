'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

const ADMIN_EMAIL = 'shivamhrsalwan@gmail.com' 

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.email !== ADMIN_EMAIL) {
        router.push('/')
        return
      }
      setAuthorized(true)
      fetchOrders()
      fetchProducts()
    }
    init()
  }, [])

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('id')
    setProducts(data || [])
  }

  const updateOrderStatus = async (orderId, status) => {
    await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
    fetchOrders()
  }

  const toggleStock = async (productId, currentStock) => {
    await supabase
      .from('products')
      .update({ in_stock: !currentStock })
      .eq('id', productId)
    fetchProducts()
  }

  if (!authorized) return null

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#C6FF1E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-[#1A1A1A] px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-[#C6FF1E] text-[#1A1A1A] font-bold px-2 py-1 rounded text-sm">US</div>
          <span className="text-white font-bold">Admin Panel</span>
        </div>
        <div className="flex gap-3">
          {[
            { id: 'orders', label: `Orders (${orders.length})` },
            { id: 'products', label: `Products (${products.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#C6FF1E] text-[#1A1A1A]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-8 py-6">

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-[#1A1A1A]">All Orders</h2>
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <p className="text-gray-400">No orders yet</p>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl p-5 border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex flex-col gap-1">
                      <p className="font-bold text-[#1A1A1A]">
                        USS-{order.id.substring(0, 8).toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-400">{order.full_name} • {order.phone}</p>
                      <p className="text-sm text-gray-400">{order.email}</p>
                      <p className="text-xs text-gray-400">
                        {order.address}, {order.city}, {order.state} - {order.pincode}
                      </p>
                    </div>
                    <div className="text-right flex flex-col gap-2">
                      <p className="font-bold text-lg text-[#1A1A1A]">₹{order.total?.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleString('en-IN')
                          : 'Recent'}
                      </p>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${statusColors[order.status] || statusColors.pending}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="border-t border-gray-50 pt-3 mb-4">
                    {(order.items || []).map((item, i) => (
                      <div key={i} className="flex items-center gap-3 py-1.5">
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-contain rounded-lg bg-gray-50" />
                        <p className="text-sm text-[#1A1A1A] flex-1 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-400">×{item.quantity}</p>
                        <p className="text-sm font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  {/* Update status */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-400 mr-1">Update status:</span>
                    {['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                      <button
                        key={s}
                        onClick={() => updateOrderStatus(order.id, s)}
                        className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all capitalize ${
                          order.status === s
                            ? 'bg-[#1A1A1A] text-[#C6FF1E]'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div>
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">All Products</h2>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Product</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Brand</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Category</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Price</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="w-10 h-10 object-contain rounded-lg bg-gray-50" />
                          <p className="font-medium text-[#1A1A1A] line-clamp-1 max-w-xs">{product.name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{product.brand}</td>
                      <td className="px-4 py-3 text-gray-500">{product.category}</td>
                      <td className="px-4 py-3 font-semibold">₹{product.price.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleStock(product.id, product.in_stock)}
                          className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
                            product.in_stock
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-600 hover:bg-red-200'
                          }`}
                        >
                          {product.in_stock ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}