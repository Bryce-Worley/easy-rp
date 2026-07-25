import { useState, useEffect } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'
import { Auth } from './components/Auth'
import DashboardLayout from './components/DashboardLayout'

type ViewType = 'WEEK' | 'MONTH' | 'YEAR'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())

  // Track the current view type (WEEK, MONTH, YEAR)
  const [currentView, setCurrentView] = useState<ViewType>('WEEK')

  useEffect(() => {
    // Get the current session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  const handleNextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  const handleGoToToday = () => {
    setCurrentDate(new Date())
  }

  if (!session) {
    return <Auth />
  }
  
  return (
    <DashboardLayout
      currentDate={currentDate}
      currentView={currentView}
      onPrevWeek={handlePrevWeek}
      onNextWeek={handleNextWeek}
      onGoToToday={handleGoToToday}
      onViewChange={setCurrentView}
    >
      <div className="text-zinc-400">
        <p> Logged in as: {session.user.email}</p>
        <button
          onClick={() => supabase.auth.signOut()}
          className="mt-4 px-4 py-2 border border-zinc-700 rounded hover:bg-zinc-800"
        >
          Log Out
        </button>
      </div>
    </DashboardLayout>
  )
}
