import { Plus } from 'lucide-react'

interface WeeklyGridProps {
    currentDate: Date;
}

export default function WeeklyGrid({ currentDate }: WeeklyGridProps) {
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
                <div
                    key={date.toISOString()}
                    className="flex flex-col border-r border-zinc-800 last:border-r-0 min-h-[600px]"
                >
                    {/* Day Header */}
                    <div className="flex flex-col items-center pt-6 pb-2">
                        <span className="text-[11px] text-zinc-500 font-medium tracking-widest">
                            {dayNames[index]}
                        </span>
                        <span className="text-2xl text-white font-bold mt-1 tracking-tight">
                            {date.getDate()}
                        </span>
                    </div>

                    {/* Add session button */}
                    <div className="px-3 mt-2">
                        <button className="w-full flex justify-end items-center h-[26px] border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/50 transition-colors rounded-sm px-1.5 text-zinc-500 hover:text-white cursor-pointer group">
                            <Plus size={14} className="group-hover:scale-110 transition-transform" />
                        </button>
                    </div>

                    {/* Session Cards Container */}
                    <div className="flex-1 p-3 flex flex-col gap-2 mt-4 overflow-y-auto">
                        {/* Placeholder for session cards */}
                    </div>
                </div>
            ))}
        </div>
    )
}