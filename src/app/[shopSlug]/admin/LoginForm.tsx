'use client'

import { useState } from 'react'
import { loginAction } from './actions'
import { useRouter } from 'next/navigation'

export function LoginForm({ shopSlug, shopName }: { shopSlug: string, shopName: string }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await loginAction(shopSlug, password)
    if (res.error) {
      setError(res.error)
      setLoading(false)
    } else {
      router.refresh()
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 font-sans">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-sm border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Willkommen</h2>
          <p className="text-gray-500 font-medium">{shopName} Editor</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm font-semibold border border-red-100">{error}</div>}
        
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Passwort</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
              required
            />
          </div>
        </div>
        
        <button 
          disabled={loading}
          type="submit" 
          className="w-full bg-red-600 text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-red-700 transition hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {loading ? 'Laden...' : 'Anmelden'}
        </button>
      </form>
    </div>
  )
}
