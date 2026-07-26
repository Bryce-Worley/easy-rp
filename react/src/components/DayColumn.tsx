import { Plus } from 'lucide-react'

interface DayColumnProps {
    date: Date;
    dayName: string;

    // Placeholder for Add/Edit Modal
    onAddSession?: (date: Date) => void;
}

export default function DayColumn({ date, dayName, onAddSession }: DayColumnProps) {
    return (
        <div className="flex flex-col border-r border-zinc-800 last:border-r-0 min-h-[600px]">
            
            {/* Day Header */}
            <div className="flex flex-col items-center pt-6 pb-2">
                <span className="text-[11px] text-zinc-500 font-medium tracking-widest uppercase">
                    {dayName}
                </span>
                <span className="text-2xl text-white font-bold mt-1 tracking-tight">
                    {date.getDate()}
                </span>
            </div>

            {/* Add session trigger */}
            <div className="px-3 mt-2">
                <button
                    onClick={() => onAddSession?.(date)}
                    className="w-full flex justify-end items-center h-[26px] border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/50 transition-colors rounded-sm px-1.5 text-zinc-500 hover:text-white cursor-pointer group"
                >
                    <Plus size={14} className="group-hover:scale-110 transition-transform" />
                </button>
            </div>

            {/* Session Cards Container */}
            <div className="flex-1 p-3 flex flex-col gap-2 mt-2 overflow-y-auto">
                {/* Placeholder for session cards */}
            </div>
        </div>
    )
}