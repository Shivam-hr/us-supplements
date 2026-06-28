'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState('login') // 'login' or 'signup'
  const [form, setForm] = useState({ email: '', password: '', fullName: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.fullName }
        }
      })
      if (error) {
        setError(error.message)
      } else {
        router.push('/')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })
      if (error) {
        setError('Invalid email or password')
      } else {
        router.push('/')
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md border border-gray-100 shadow-sm">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="bg-[#1A1A1A] text-[#C6FF1E] font-bold px-2.5 py-1 rounded text-sm">US</div>
          <span className="font-bold text-[#1A1A1A] text-lg">Supplements</span>
        </Link>

        {/* Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'login' ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-gray-500'}`}
          >
            Login
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'signup' ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-gray-500'}`}
          >
            Sign up
          </button>
        </div>

        <div className="flex flex-col gap-4">

          {mode === 'signup' && (
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                Full name
              </label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C6FF1E] transition-all"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
              Email address
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C6FF1E] transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C6FF1E] transition-all"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all mt-2 ${
              loading
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#C6FF1E] text-[#1A1A1A] hover:brightness-110'
            }`}
          >
            {loading
              ? 'Please wait...'
              : mode === 'login' ? 'Login' : 'Create account'
            }
          </button>

          {mode === 'login' && (
            <button className="text-sm text-gray-400 hover:text-[#1A1A1A] transition-colors text-center">
              Forgot password?
            </button>
          )}

        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          By continuing you agree to our{' '}
          <span className="underline cursor-pointer">Terms of Service</span>
          {' '}and{' '}
          <span className="underline cursor-pointer">Privacy Policy</span>
        </p>

      </div>
    </div>
  )
}