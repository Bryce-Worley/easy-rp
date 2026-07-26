import { useState, useEffect } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'
import { Auth } from './components/Auth'
import DashboardLayout from './components/DashboardLayout'
import WeeklyGrid from './components/WeeklyGrid'

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
      {/* Render the WeeklyGrid only when the current view is 'WEEK' */}
      <div className="h-full w-full">
        <WeeklyGrid currentDate={currentDate} />
      </div>
    </DashboardLayout>
  )
}
