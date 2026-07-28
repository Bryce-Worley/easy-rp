import DayColumn from "./DayColumn"
import type { SessionData } from "./SessionModal"

interface WeeklyGridProps {
    currentDate: Date;
    exercises: SessionData[]; 
    onAddSession: (date: Date) => void; 
    onEditSession?: (date: Date, sessionData: SessionData) => void;
}

export default function WeeklyGrid({ currentDate, exercises, onAddSession, onEditSession }: WeeklyGridProps) {
    // Calculate the start of the week (Sunday)
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

    // Generate an array of dates for the week
    const weekDates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return date;
    })

    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    return (
        // Render the weekly grid
        <div className="grid grid-cols-7 h-full w-full bg-{#1a1a1a] border border-zinc-800 rounded-sm">

            {weekDates.map((date, index) => (
                <DayColumn
                    key={date.toISOString()}
                    date={date}
                    dayName={dayNames[index]}
                    exercises={exercises}
                    onAddSession={onAddSession} 
                    onEditSession={onEditSession}
                />
            ))}
        </div>
    )
}