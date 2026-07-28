import { Plus } from 'lucide-react'
import type { SessionData } from './SessionModal'

interface DayColumnProps {
    date: Date;
    dayName: string;
    exercises: SessionData[];
    onAddSession?: (date: Date) => void;
    onEditSession?: (date: Date, sessionData: SessionData) => void;
}

// Helperto format the date to YYYY-MM-DD for database storage
const formatDateToYYYYMMDD = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function DayColumn({ date, dayName, exercises, onAddSession, onEditSession }: DayColumnProps) {
    const formattedDate = formatDateToYYYYMMDD(date);

    // Filter exercises for the current date
    const dayExercises = exercises.filter(
        (ex) => (ex as unknown as { date: string }).date === formattedDate
    )
    
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
                {dayExercises.map((exercise) => (
                    <div
                        key={exercise.id || Math.random().toString()} // Fallback key if id is missing
                        className="border border-zinc-700 rounded-sm p-3 bg-[#1e1e1e] group relative shadow-md"
                    >
                        { /* Category Tag */ }
                        <div className="flex items-center gap-1.5 mb-2">
                            <span className="text-[10px] font-bold text-red-500 tracking wider uppercase">Strength</span>
                        </div>

                        {/* Dynamic Exercise Details */}
                        <div className="text-xs text-zinc-300 flex flex-col gap-0.5">
                            <span className="font-bold text-white mb-0.5">
                                {exercise.exercise_name || 'Exercise'}
                            </span>
                            {exercise.weight && <span>{exercise.weight} lbs</span>}
                            {exercise.sets && <span>{exercise.sets} sets</span>}
                            {exercise.reps && <span>{exercise.reps} reps</span>}
                            {exercise.rpe && <span>RPE: {exercise.rpe}</span>}
                        </div>

                        <button 
                            onClick={() => onEditSession?.(date, exercise)}
                            className="absolute bottom-2 right-2 text-[10px] tracking-wider text-zinc-500 hover:text-white transition-colors uppercase"
                        >
                            EDIT
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}