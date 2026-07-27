import { Menu, Search, XCircle } from "lucide-react";

export interface SessionData {
    id?: string;
    exercise: string;
    weight: string;
    sets: string;
    reps: string;
    rpe: string;
    journal: string;
}

interface SessionModalProps {
    date: Date;
    sessionData: SessionData | null; // If null, it's an "Add" modal; if not null, it's an "Edit" modal
    onClose: () => void;
}

export default function SessionModal({ date, sessionData, onClose }: SessionModalProps) {
    const isEditMode = !!sessionData; // Determine if it's edit mode based on sessionData

    // Format date for display
    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        // Overlay background
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

            {/* Modal Container */}
            <div className="w-full max-w-xl bg-[#5C5C5E] rounded-3xl p-8 shadow-2x relative">

                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-medium text-white mb-1">{formattedDate}</h2>
                        <p className="text-zinc-300 text-sm">
                            {isEditMode ? 'Edit/Delete Exercise' : 'Add Exercise'}
                        </p>
                    </div>
                    {!isEditMode && (
                        <div className="flex items-center">
                            <button className="bg-[#ff5722} text-white px-4 py-1.5 rounded-full text-sm dont-medium hover:bg-[#e64a19] transition-colors">
                                Repeat
                            </button>
                        </div>
                    )}
                </div>

                {/* Search/Exercise Input Section */}
                <div className="flex items-center bg-[#4A4A4C] border border-zinc-500 rounded-lg px-4 py-3 mb-6">
                    <Menu size={20} className="text-zinc-300 mr-3" />
                    <input
                        type="text"
                        placeholder="Search or add exercise"
                        defaultValue={sessionData?.exercise || ''}
                        className="flex-1 bg-transparent text-white placeholder-zinc-400 focus:outline-none"
                    />
                    <Search size={20} className="text-zinc-300 ml-3" />
                </div>

                {/* Exercise Details Section */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <MetricInput label="Weight" defaultValue={sessionData?.weight} />
                    <MetricInput label="Sets" defaultValue={sessionData?.sets} />
                    <MetricInput label="Reps" defaultValue={sessionData?.reps} />
                    <MetricInput label="RPE" defaultValue={sessionData?.rpe} />
                </div>

                {/* Add Row Button */}
                <div className="mb-6">
                    <button className="bg-[#ff5722] text-white px-5 py-1.5 rounded-full text-sm font-medium hover:bg-[#e64a19] transition-colors">
                        + Add Row
                    </button>
                </div>

                {/* Journal Section */}
                <div className="relative mb-8 pt-2">
                    {/* Custom floating label */}
                    <div className="absolute top-0 left-4 bg-[#333333] px-2 py-0.5 rounded text-[10px] text-zinc-300 font-medium z-10">
                        Training Journal
                    </div>
                    <textarea
                        className="w-full h-32 bg-transparent border border-zinc-500 rounded-lg p-4 pt-5 text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-300 resize-none"
                        placeholder="Write your training notes here..."
                        defaultValue={sessionData?.journal || ''}
                    ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end items-center gap-6">
                    <button
                        onClick={onClose}
                        className="text-[#ff5722] hover:text-[#e64a19] text-sm font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button className="text-[#ff5722] hover:text-[#e64a19] text-sm font-medium transition-colors">
                        Save
                    </button>
                    {isEditMode && (
                        <button className="text-[#ff5722] hover:text-red-500 text-sm font-medium transition-colors uppercase">
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

// Helper component for metric inputs (Weight, Sets, Reps, RPE)
function MetricInput({ label, defaultValue }: { label: string; defaultValue?: string }) {
    return (
        <div className="relative pt-2 flex-1 min-w-[80px]">
            <div className="absolute top-0 left-4 bg-[#333333] px-1.5 py-0.5 rounded text-[10px] text-zinc-300 font-medium z-10">
                {label}
            </div>
            <div className="flex items-center border border-zinc-500 rounded-lg px-3 py-2 bg-transparent">
                <input
                    type="text"
                    defaultValue={defaultValue || ''} 
                    className="w-full bg-transparent text-white placeholder-zinc-400 focus:outline-none text-sm"
                />
                <button className="text-zinc-300 hover:text-white transition-colors ml-1">
                    <XCircle size={16} />
                </button>
            </div>
        </div>
    )
}
