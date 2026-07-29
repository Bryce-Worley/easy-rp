import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setMessage('Check your email for the login link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      }
    } catch (error: any) {
      setMessage(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Handle password reset
  const handleResetPassword = async (e: React.MouseEvent) => {
    e.preventDefault()
    setMessage('')
    
    if (!email) {
      setMessage('Please enter your email address first.')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin, // Redirects back to your app after reset
      })
      if (error) throw error
      setMessage('Check your email for the password reset link!')
    } catch (error: any) {
      setMessage(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center p-6 font-sans">
      
      <div className="w-full max-w-[340px]">
        
        {/* Header Section */}
        <div className="flex items-end justify-between mb-6 pr-2">
          <h1 className="text-white text-[40px] font-bold leading-[1.1] tracking-tight">
            EZ RP<br />
            Climbing<br />
            Training<br />
            App
          </h1>
          
          {/* Orange Mountain Logo */}
          <div className="mb-2">
            <svg width="80" height="70" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 75 L35 25 L50 45 L75 15 L95 75 Z" stroke="#ff5722" strokeWidth="5" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-lg p-6 shadow-xl w-full">
          
          <h2 className="text-xl font-bold text-zinc-800 mb-4 text-center">
            {isSignUp ? 'Sign Up' : 'Log In'}
          </h2>

          <form onSubmit={handleAuth}>
            
            <div className="mb-4">
              <label className="block text-[13px] text-zinc-800 font-medium mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 transition-colors"
              />
            </div>

            <div className="mb-6">
              <label className="block text-[13px] text-zinc-800 font-medium mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!isSignUp} // Make it optional for password reset trickiness, but required for login/signup
                className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#333333] hover:bg-[#1a1a1a] text-white py-2.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          {/* Status Message */}
          {message && (
            <p className="mt-4 text-center text-sm font-medium text-[#ff5722]">
              {message}
            </p>
          )}

          <div className="mt-5 flex flex-col items-center gap-3 pb-2">
            {/* Forgot Password Link (Only show on Log In screen) */}
            {!isSignUp && (
              <button 
                type="button"
                onClick={handleResetPassword}
                disabled={loading}
                className="text-[13px] text-zinc-600 underline hover:text-zinc-800 transition-colors"
              >
                Forgot password?
              </button>
            )}

            {/* Toggle Sign Up / Log In */}
            <button 
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setMessage(''); // Clear any errors when switching modes
              }}
              className="text-[13px] text-zinc-800 font-medium hover:text-zinc-600 transition-colors"
            >
              {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
            {/* Footer */}
          <footer className="mt-6 text-center text-medium text-zinc-300">
            <p>Plan your training, manage your tick-list, and crush your projects!</p>
          </footer>
      </div>
    </div>
  )
}