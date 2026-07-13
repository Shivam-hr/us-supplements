'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User, Package, MapPin, Settings, LogOut, Edit2, Plus, Trash2,
  Lock, ShieldOff, Mail, MessageSquare, ChevronRight, Home, CheckCircle2,
} from 'lucide-react'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  pending_cod: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  paid: 'bg-green-100 text-green-700',
}

const navItems = [
  { key: 'overview', label: 'Overview', icon: User },
  { key: 'orders', label: 'My Orders', icon: Package },
  { key: 'addresses', label: 'Saved Addresses', icon: MapPin },
  { key: 'settings', label: 'Account Settings', icon: Settings },
]

function StatusBadge({ status }) {
  return (
    <span className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize ${statusColors[status] || statusColors.pending}`}>
      {status?.replace('_', ' ')}
    </span>
  )
}

function OrderCard({ order }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Order ID</p>
          <p className="text-sm font-bold text-[#1A1A1A]">USS-{order.id.substring(0, 8).toUpperCase()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Date</p>
          <p className="text-sm font-medium text-[#1A1A1A]">
            {order.created_at
              ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
              : 'Recent'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Total</p>
          <p className="text-sm font-bold text-[#1A1A1A]">₹{order.total?.toLocaleString()}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="border-t border-gray-50 pt-4 flex flex-col gap-3">
        {(order.items || []).map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded-lg bg-gray-50 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1A1A1A] leading-snug line-clamp-1">{item.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
            </div>
            <p className="text-sm font-bold text-[#1A1A1A] shrink-0">₹{(item.price * item.quantity)?.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-50 pt-3">
        <p className="text-xs text-gray-400">
          Delivering to: {order.address}, {order.city}, {order.state} - {order.pincode}
        </p>
      </div>
    </div>
  )
}

function AddressForm({ initial, onCancel, onSave }) {
  const [form, setForm] = useState(initial || {
    label: 'Home', full_name: '', phone: '', address_line: '', city: '', state: '', pincode: '', is_default: false,
  })
  const [saving, setSaving] = useState(false)

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.full_name.trim() || !form.address_line.trim() || !form.city.trim() || !form.state.trim() || !form.pincode.trim()) {
      alert('Please fill in all required fields.')
      return
    }
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <input name="label" value={form.label} onChange={handleChange} placeholder="Label (e.g. Home, Work)"
          className="col-span-2 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#C6FF1E]" />
        <input name="full_name" value={form.full_name} onChange={handleChange} placeholder="Full name"
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#C6FF1E]" />
        <input name="phone" value={form.phone || ''} onChange={handleChange} placeholder="Phone"
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#C6FF1E]" />
        <textarea name="address_line" value={form.address_line} onChange={handleChange} placeholder="Address (House no, street, area)"
          rows={2} className="col-span-2 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#C6FF1E] resize-none" />
        <input name="city" value={form.city} onChange={handleChange} placeholder="City"
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#C6FF1E]" />
        <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="Pincode"
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#C6FF1E]" />
        <input name="state" value={form.state} onChange={handleChange} placeholder="State"
          className="col-span-2 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#C6FF1E]" />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.is_default} onChange={e => setForm(prev => ({ ...prev, is_default: e.target.checked }))}
          className="accent-[#C6FF1E] w-4 h-4" />
        <span className="text-sm text-[#1A1A1A]">Set as default address</span>
      </label>
      <div className="flex gap-2 mt-1">
        <button onClick={handleSubmit} disabled={saving}
          className="flex-1 bg-[#C6FF1E] text-[#1A1A1A] font-bold py-2.5 rounded-xl text-sm cursor-pointer disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Address'}
        </button>
        <button onClick={onCancel} className="px-5 border border-gray-200 rounded-xl text-sm font-semibold cursor-pointer">
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const [editingProfile, setEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({ full_name: '', phone: '' })

  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)

  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState('')

  const fetchAddresses = async (userId) => {
    const { data } = await supabase.from('addresses').select('*').eq('user_id', userId).order('is_default', { ascending: false })
    setAddresses(data || [])
  }

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      setProfileForm({
        full_name: user.user_metadata?.full_name || '',
        phone: user.user_metadata?.phone || '',
      })

      const { data: orders } = await supabase
        .from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      setOrders(orders || [])

      await fetchAddresses(user.id)
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const saveProfile = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { full_name: profileForm.full_name, phone: profileForm.phone }
    })
    if (!error) {
      const { data: { user: updated } } = await supabase.auth.getUser()
      setUser(updated)
      setEditingProfile(false)
    } else {
      alert('Could not update profile: ' + error.message)
    }
  }

  const saveAddress = async (form) => {
    if (form.is_default) {
      await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id)
    }
    if (form.id) {
      await supabase.from('addresses').update({ ...form }).eq('id', form.id)
    } else {
      await supabase.from('addresses').insert({ ...form, user_id: user.id })
    }
    await fetchAddresses(user.id)
    setShowAddressForm(false)
    setEditingAddress(null)
  }

  const deleteAddress = async (id) => {
    if (!confirm('Delete this address?')) return
    await supabase.from('addresses').delete().eq('id', id)
    await fetchAddresses(user.id)
  }

  const setDefaultAddress = async (id) => {
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id)
    await supabase.from('addresses').update({ is_default: true }).eq('id', id)
    await fetchAddresses(user.id)
  }

  const changePassword = async () => {
    setPasswordMsg('')
    if (newPassword.length < 6) {
      setPasswordMsg('Password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg('Passwords do not match.')
      return
    }
    setPasswordSaving(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setPasswordSaving(false)
    if (error) {
      setPasswordMsg(error.message)
    } else {
      setPasswordMsg('Password updated successfully.')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setShowPasswordForm(false), 1500)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#C6FF1E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const defaultAddress = addresses.find(a => a.is_default) || addresses[0]

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-16">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 md:px-16 py-5 md:py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-[#1A1A1A]">My Account</h1>
            <p className="text-xs md:text-sm text-gray-400 mt-0.5">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border border-gray-200 text-sm font-semibold px-4 md:px-5 py-2.5 rounded-xl hover:border-red-300 hover:text-red-500 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <div className="px-5 md:px-16 py-6 md:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8">

        {/* Sidebar — desktop card, mobile horizontal tab strip */}
        <div className="lg:w-[280px] shrink-0">
          <div className="hidden lg:flex bg-white rounded-[32px] p-8 flex-col gap-2" style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
            <div className="w-16 h-16 bg-[#C6FF1E] rounded-full flex items-center justify-center text-2xl font-bold text-[#1A1A1A] mb-3">
              {user?.email?.[0].toUpperCase()}
            </div>
            <p className="font-bold text-[#1A1A1A]">{user?.user_metadata?.full_name || 'User'}</p>
            <p className="text-sm text-gray-400">{user?.email}</p>

            <div className="border-t border-gray-100 mt-4 pt-4 flex flex-col gap-1">
              {navItems.map(item => {
                const Icon = item.icon
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`flex items-center gap-3 text-left text-sm px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                      activeTab === item.key ? 'bg-[#C6FF1E] text-[#1A1A1A] font-semibold' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Mobile tab strip */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-1 -mx-5 px-5">
            {navItems.map(item => {
              const Icon = item.icon
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`flex items-center gap-1.5 shrink-0 text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === item.key ? 'bg-[#1A1A1A] text-[#C6FF1E] font-semibold' : 'bg-white text-gray-500 border border-gray-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col gap-5 md:gap-6">

          {activeTab === 'overview' && (
            <>
              {/* Welcome card */}
              <div className="bg-gradient-to-r from-[#F7FFEA] to-[#EFFFD1] rounded-2xl p-6 md:p-8">
                <p className="text-lg md:text-xl font-bold text-[#1A1A1A]">
                  Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'there'}! 👋
                </p>
                <p className="text-sm text-gray-500 mt-1">Manage your account, track orders and view everything in one place.</p>
              </div>

              {/* Stats — only real, countable data. No fake points/wishlist numbers. */}
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setActiveTab('orders')} className="bg-white border border-gray-100 rounded-2xl p-5 text-left cursor-pointer hover:border-[#C6FF1E] transition-colors">
                  <Package className="w-6 h-6 text-[#1A1A1A] mb-2" />
                  <p className="text-2xl font-black text-[#1A1A1A]">{orders.length}</p>
                  <p className="text-xs text-gray-400">Total Orders</p>
                </button>
                <button onClick={() => setActiveTab('addresses')} className="bg-white border border-gray-100 rounded-2xl p-5 text-left cursor-pointer hover:border-[#C6FF1E] transition-colors">
                  <MapPin className="w-6 h-6 text-[#1A1A1A] mb-2" />
                  <p className="text-2xl font-black text-[#1A1A1A]">{addresses.length}</p>
                  <p className="text-xs text-gray-400">Saved Addresses</p>
                </button>
              </div>

              {/* Personal Information */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-bold text-[#1A1A1A]">Personal Information</p>
                  {!editingProfile && (
                    <button onClick={() => setEditingProfile(true)} className="text-sm text-[#1A1A1A] font-semibold flex items-center gap-1 cursor-pointer">
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                  )}
                </div>

                {editingProfile ? (
                  <div className="flex flex-col gap-3">
                    <input value={profileForm.full_name} onChange={e => setProfileForm(p => ({ ...p, full_name: e.target.value }))}
                      placeholder="Full name" className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#C6FF1E]" />
                    <input value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                      placeholder="Phone number" className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#C6FF1E]" />
                    <div className="flex gap-2">
                      <button onClick={saveProfile} className="flex-1 bg-[#C6FF1E] text-[#1A1A1A] font-bold py-2.5 rounded-xl text-sm cursor-pointer">Save</button>
                      <button onClick={() => setEditingProfile(false)} className="px-5 border border-gray-200 rounded-xl text-sm font-semibold cursor-pointer">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 text-sm">
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-400">Full Name</span>
                      <span className="text-[#1A1A1A] font-medium">{user?.user_metadata?.full_name || '—'}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-400">Email</span>
                      <span className="text-[#1A1A1A] font-medium">{user?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Phone</span>
                      <span className="text-[#1A1A1A] font-medium">{user?.user_metadata?.phone || '—'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Saved Addresses preview */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-bold text-[#1A1A1A]">Saved Addresses</p>
                  <button onClick={() => setActiveTab('addresses')} className="text-sm text-[#1A1A1A] font-semibold flex items-center gap-1 cursor-pointer">
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {defaultAddress ? (
                  <div className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Home className="w-4 h-4 text-[#1A1A1A]" />
                      <p className="font-semibold text-[#1A1A1A] text-sm">{defaultAddress.label}</p>
                      {defaultAddress.is_default && <span className="text-[10px] bg-[#C6FF1E] text-[#1A1A1A] font-bold px-2 py-0.5 rounded-full">Default</span>}
                    </div>
                    <p className="text-xs text-gray-500">{defaultAddress.full_name}</p>
                    <p className="text-xs text-gray-500">{defaultAddress.address_line}, {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.pincode}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No saved addresses yet. Add one from the Saved Addresses tab.</p>
                )}
              </div>

              {/* Recent Orders preview — real data, not a fabricated activity log */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-bold text-[#1A1A1A]">Recent Orders</p>
                  <button onClick={() => setActiveTab('orders')} className="text-sm text-[#1A1A1A] font-semibold flex items-center gap-1 cursor-pointer">
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {orders.length === 0 ? (
                  <p className="text-sm text-gray-400">No orders yet.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {orders.slice(0, 3).map(order => (
                      <div key={order.id} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-medium text-[#1A1A1A]">USS-{order.id.substring(0, 8).toUpperCase()}</p>
                          <p className="text-xs text-gray-400">
                            {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}
                          </p>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Trust badges footer */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-wrap items-center gap-4 md:gap-8">
                <div className="w-10 h-10 rounded-full bg-[#F7FFEA] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-600" strokeWidth={2} />
                </div>
                <p className="text-sm font-semibold text-[#1A1A1A]">100% Authentic. Always.</p>
                <p className="text-xs text-gray-400 hidden md:block">We ensure every product you receive is 100% genuine and quality assured.</p>
              </div>
            </>
          )}

          {activeTab === 'orders' && (
            <>
              <h2 className="text-base font-bold text-[#1A1A1A]">My Orders ({orders.length})</h2>
              {orders.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center flex flex-col items-center gap-4">
                  <span className="text-5xl">📦</span>
                  <p className="font-semibold text-[#1A1A1A]">No orders yet</p>
                  <p className="text-sm text-gray-400">Your orders will appear here after you place them</p>
                  <Link href="/products">
                    <button className="bg-[#C6FF1E] text-[#1A1A1A] font-bold px-6 py-2.5 rounded-xl text-sm cursor-pointer">Start shopping</button>
                  </Link>
                </div>
              ) : (
                orders.map(order => <OrderCard key={order.id} order={order} />)
              )}
            </>
          )}

          {activeTab === 'addresses' && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#1A1A1A]">Saved Addresses ({addresses.length})</h2>
                {!showAddressForm && (
                  <button onClick={() => { setEditingAddress(null); setShowAddressForm(true) }}
                    className="flex items-center gap-1.5 bg-[#C6FF1E] text-[#1A1A1A] font-bold px-4 py-2.5 rounded-xl text-sm cursor-pointer">
                    <Plus className="w-4 h-4" /> Add New Address
                  </button>
                )}
              </div>

              {showAddressForm && (
                <AddressForm
                  initial={editingAddress}
                  onCancel={() => { setShowAddressForm(false); setEditingAddress(null) }}
                  onSave={saveAddress}
                />
              )}

              {addresses.length === 0 && !showAddressForm ? (
                <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center flex flex-col items-center gap-4">
                  <MapPin className="w-10 h-10 text-gray-300" />
                  <p className="font-semibold text-[#1A1A1A]">No saved addresses</p>
                  <p className="text-sm text-gray-400">Add an address to make checkout faster next time</p>
                </div>
              ) : (
                addresses.map(addr => (
                  <div key={addr.id} className="bg-white border border-gray-100 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <Home className="w-4 h-4 text-[#1A1A1A]" />
                      <p className="font-semibold text-[#1A1A1A] text-sm">{addr.label}</p>
                      {addr.is_default && <span className="text-[10px] bg-[#C6FF1E] text-[#1A1A1A] font-bold px-2 py-0.5 rounded-full">Default</span>}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{addr.full_name}</p>
                    <p className="text-sm text-gray-500">{addr.address_line}, {addr.city}, {addr.state} - {addr.pincode}</p>
                    {addr.phone && <p className="text-sm text-gray-500">Phone: {addr.phone}</p>}
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => { setEditingAddress(addr); setShowAddressForm(true) }}
                        className="text-sm font-semibold text-[#1A1A1A] border border-gray-200 px-4 py-2 rounded-xl cursor-pointer">Edit</button>
                      <button onClick={() => deleteAddress(addr.id)}
                        className="text-sm font-semibold text-red-500 border border-red-100 px-4 py-2 rounded-xl cursor-pointer flex items-center gap-1.5">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                      {!addr.is_default && (
                        <button onClick={() => setDefaultAddress(addr.id)}
                          className="text-sm font-semibold text-gray-500 px-4 py-2 rounded-xl cursor-pointer ml-auto">Set as default</button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'settings' && (
            <>
              <h2 className="text-base font-bold text-[#1A1A1A]">Account Settings</h2>

              <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-1">
                <div className="flex items-center justify-between py-3 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-[#1A1A1A]">Password</span>
                  </div>
                  <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="text-sm font-semibold text-[#1A1A1A] cursor-pointer">
                    Change
                  </button>
                </div>

                {showPasswordForm && (
                  <div className="py-3 border-b border-gray-50 flex flex-col gap-2.5">
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password"
                      className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#C6FF1E]" />
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password"
                      className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#C6FF1E]" />
                    {passwordMsg && <p className={`text-xs ${passwordMsg.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{passwordMsg}</p>}
                    <button onClick={changePassword} disabled={passwordSaving}
                      className="bg-[#1A1A1A] text-white font-bold py-2.5 rounded-xl text-sm cursor-pointer disabled:opacity-50">
                      {passwordSaving ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                )}

                {/* Honest "coming soon" stubs — not wired to any real backend yet */}
                <div className="flex items-center justify-between py-3 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <ShieldOff className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-[#1A1A1A]">Two-Factor Authentication</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Coming soon</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-[#1A1A1A]">Email Notifications</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Coming soon</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-[#1A1A1A]">SMS Notifications</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Coming soon</span>
                </div>
              </div>

              <button onClick={handleLogout}
                className="flex items-center justify-center gap-2 bg-white border border-gray-100 rounded-2xl p-4 text-red-500 font-semibold text-sm cursor-pointer">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  )
}