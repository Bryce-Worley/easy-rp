import DayColumn from "./DayColumn"

interface WeeklyGridProps {
    currentDate: Date;
    onAddSession: (date: Date) => void; 
}

export default function WeeklyGrid({ currentDate, onAddSession }: WeeklyGridProps) {
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
                    onAddSession={onAddSession} 
                />
            ))}
        </div>
    )
}