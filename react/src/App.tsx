import { useState, useEffect } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'
import { Auth } from './components/Auth'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    // Get the current session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Listen for login/logout events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // If no one is logged in, show the Auth screen
  if (!session) {
    return <Auth />
  }

  // If they are logged in, show the dashboard
  return (
    <div>
      <h1>Training Dashboard</h1>
      <p>Logged in as: {session.user.email}</p>
      <button onClick={() => supabase.auth.signOut()}>Log Out</button>
    </div>
  )
}