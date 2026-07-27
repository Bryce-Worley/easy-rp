import { useState, useEffect } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'
import { Auth } from './components/Auth'
import DashboardLayout from './components/DashboardLayout'
import WeeklyGrid from './components/WeeklyGrid'
import SessionModal from './components/SessionModal'
import type { SessionData } from './components/SessionModal'

type ViewType = 'WEEK' | 'MONTH' | 'YEAR'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())

  // Track the current view type (WEEK, MONTH, YEAR)
  const [currentView, setCurrentView] = useState<ViewType>('WEEK')

  // Modal state for adding/editing sessions
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [editingSession, setEditingSession] = useState<SessionData | null>(null)

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

  // Handlers for navigation
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

  // Handlers for modal
  const handleOpenAddModal = (date: Date) => {
    setSelectedDate(date)
    setEditingSession(null) // Clear any editing session
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (date: Date, sessionData: SessionData) => {
    setSelectedDate(date)
    setEditingSession(sessionData)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false) 
  }

  if (!session) {
    return <Auth />
  }
  
  return (
    <>
      <DashboardLayout
        currentDate={currentDate}
        currentView={currentView}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        onGoToToday={handleGoToToday}
        onViewChange={setCurrentView}
        onLogSession={() => handleOpenAddModal(new Date())}
      >
        <div className="h-full w-full relative">
          <WeeklyGrid 
            currentDate={currentDate} 
            onAddSession={handleOpenAddModal}
          />
        </div>
      </DashboardLayout>

      {/* Render modal if state is true */}
      {isModalOpen && (
        <SessionModal
          date={selectedDate}
          sessionData={editingSession}
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}
