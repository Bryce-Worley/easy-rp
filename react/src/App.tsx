import { useState, useEffect, useCallback } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'
import { Auth } from './components/Auth'
import DashboardLayout from './components/DashboardLayout'
import WeeklyGrid from './components/WeeklyGrid'
import SessionModal from './components/SessionModal'
import type { SessionData } from './components/SessionModal'

type ViewType = 'WEEK' | 'MONTH' | 'YEAR'

// Helper to format date for database insertion (YYYY-MM-DD)
const formatDatetoYYYYMMDD = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())

  // Track the current view type (WEEK, MONTH, YEAR)
  const [currentView, setCurrentView] = useState<ViewType>('WEEK')

  // Modal state for adding/editing sessions
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [editingSession, setEditingSession] = useState<SessionData | null>(null)

  // State for fetched exercises
  const [exercises, setExercises] = useState<SessionData[]>([])

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

  // Fetch exercises for the active week from SupaBase
  const fetchExercsises = useCallback(async () => {
    if (!session?.user) return;

    // Calculate Sun and Sat for currently displayed week
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)

    const startDateStr = formatDatetoYYYYMMDD(startOfWeek)
    const endDateStr = formatDatetoYYYYMMDD(endOfWeek)

    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .gte('date', startDateStr)
      .lte('date', endDateStr)

    if (error) {
      console.error('Error fetching exercises:', error)
    } else {
      setExercises(data || [])
    }
  }, [currentDate, session])

  // Refetch when currentDate or session changes
  useEffect(() => {
    fetchExercsises()
  }, [fetchExercsises])
  
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

  const handleCloseModal = () => {
    setIsModalOpen(false) 
  }

  // Function to save to supabase
  const handleSaveSession = async (formData: Omit<SessionData, 'id'>) => {
    if (!session?.user) return;

    const formattedDbDate = formatDatetoYYYYMMDD(selectedDate)

    // Send the data to the exercises table in Supabase
    const { error } = await supabase
      .from('exercises')
      .insert([
        {
          user_id: session.user.id,
          date: formattedDbDate,
          exercise_name: formData.exercise_name,
          weight: formData.weight,
          sets: formData.sets,
          reps: formData.reps,
          rpe: formData.rpe,
          journal: formData.journal,
        } 
      ]);

    if (error) {
      console.error('Error saving session:', error);
      alert('Error saving session: ' + error.message);
    } else {
      console.log('Session saved successfully!');
      setIsModalOpen(false); // Close the modal after saving
      fetchExercsises(); // Refresh the exercises list to reflect the new session

    }
  };
    

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
            exercises={exercises}
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
          onSave={handleSaveSession}
        />
      )}
    </>
  )
}
