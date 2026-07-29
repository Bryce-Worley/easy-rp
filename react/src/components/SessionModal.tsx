import { Menu, Search, XCircle, Plus, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export interface SessionData {
    id?: string;
    exercise_name: string;
    weight: string;
    sets: string;
    reps: string;
    rpe: string;
    journal: string;
}

interface ExerciseLibraryItem {
    id: string;
    name: string;
    category?: string;
}

interface SessionModalProps {
    date: Date;
    sessionData: SessionData | null; // If null, it's an "Add" modal; if not null, it's an "Edit" modal
    onClose: () => void;
    onSave: (data: Omit<SessionData, 'id'>) => void; // Callback for saving session data
    onUpdate: (id: string, data: Omit<SessionData, 'id'>) => void; // Callback for updating session data
    onDelete: (id: string) => void; // Callback for deleting session data
}

export default function SessionModal({ 
    date, 
    sessionData, 
    onClose, 
    onSave,
    onUpdate,
    onDelete 
}: SessionModalProps) {

    const isEditMode = !!sessionData; // Determine if it's edit mode based on sessionData

    // State for exercise library
    const [library, setLibrary] = useState<ExerciseLibraryItem[]>([]);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [newExerciseInput, setNewExerciseInput] = useState('');

    //React state for form fields
    const [exerciseName, setExerciseName] = useState(sessionData?.exercise_name || '');
    const [weight, setWeight] = useState(sessionData?.weight || '');
    const [sets, setSets] = useState(sessionData?.sets || '');
    const [reps, setReps] = useState(sessionData?.reps || '');
    const [rpe, setRpe] = useState(sessionData?.rpe || '');
    const [journal, setJournal] = useState(sessionData?.journal || '');

    // Fetch exercise library from Supabase
    useEffect(() => {
        const fetchLibrary = async () => {
            const { data, error } = await supabase
                .from('exercise_library')
                .select('*')
                .order('name', { ascending: true });
                
            if (!error && data) {
                setLibrary(data);
                // If not editing and library exists, pre-fill the exercise name with the first item
                if (!sessionData && data.length > 0 && !exerciseName) {
                    setExerciseName(data[0].name);
                }
            }
        };

        fetchLibrary();
    }, []);

    // Save the new exercise to the library if it doesn't exist
    const handleAddNewExercise = async () => {
        if (!newExerciseInput.trim()) return;

        const trimmedName = newExerciseInput.trim();

        const {data: { session }} = await supabase.auth.getSession();
        if (!session?.user) {
            alert("User not authenticated");
            return;
        }
        
        const { data, error } = await supabase
            .from ('exercise_library')
            .insert([{ user_id: session.user.id, name: trimmedName }])
            .select()

        if (error) {
            console.error("Error adding new exercise:", error);
            alert("Failed to add new exercise. Please try again.");
        } else if (data && data.length > 0) {
            setLibrary((prev) => [...prev, data[0]].sort((a, b) => a.name.localeCompare(b.name)));
            setExerciseName(trimmedName);
            setNewExerciseInput('');
            setIsCreatingNew(false);
        }
    };

    // Format date for display
    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    // Handle save action
    const handleSaveClick = () => {
        if(!exerciseName) {
            alert("Please select or add an exercise.")
            return;
        }

        const payload = {
            exercise_name: exerciseName,
            weight,
            sets,
            reps,
            rpe,
            journal
        };

        // If in edit mode, call onUpdate; otherwise, call onSave
        if (isEditMode && sessionData?.id) {
            onUpdate(sessionData.id, payload);
        } else {
            onSave(payload);
        }
        onClose(); // Close the modal after saving
    };

    // Handle delete action
    const handleDeleteClick = () => {
        if (isEditMode && sessionData?.id) {
            // Confirmation before deletion
            if (window.confirm("Are you sure you want to delete this exercise? This action cannot be undone.")) {
                onDelete(sessionData.id);
                onClose(); // Close the modal after deletion
            }
        }
    };

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
                <div className="mb-6">
                    {!isCreatingNew ? (
                        <div className="flex items-center gap-2">
                            {/* Dropdown Container */}
                            <div className="flex-1 flex items-center bg-[#4A4A4C] border border-zinc-500 rounded-lg px-4 py-3">
                                <Menu size={20} className="text-zinc-300 mr-3" />
                                <select
                                    value={exerciseName}
                                    onChange={(e) => setExerciseName(e.target.value)}
                                    className="flex-1 bg-transparent text-white focus:outline-none"
                                >
                                    {library.length === 0 ? (
                                        <option value="" className="bg-[#333333]">No exercises in library...</option>
                                    ) : (
                                        library.map((item) => (
                                            <option key={item.id} value={item.name} className="bg-[#333333]">
                                                {item.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>

                            {/* Add New Trigger */}
                            <button
                                type="button"
                                onClick={() => setIsCreatingNew(true)}
                                className="flex items-center justify-center gap-1.5 bg-[#4A4A4C] border border-zinc-500 text-white px-4 py-3 rounded-lg hover:bg-[#333333] transition-colors"
                            >
                                <Plus size={18} className="text-[#ff5722]" />
                                <span className="text-sm font-medium">New</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            {/* New Exercise Input */}
                            <div className="flex-1 flex items-center bg-[#4A4A4C] border border-[#ff5722] rounded-lg px-4 py-3">
                                <Plus size={20} className="text-[#ff5722] mr-3" />
                                <input
                                    type="text"
                                    placeholder="Type new exercise name..."
                                    value={newExerciseInput}
                                    onChange={(e) => setNewExerciseInput(e.target.value)}
                                    autoFocus
                                    className="flex-1 bg-transparent text-white placeholder-zinc-400 focus:outline-none"
                                />
                            </div>
                            
                            {/* Save/Cancel New Exercise */}
                            <button
                                type="button"
                                onClick={handleAddNewExercise}
                                className="bg-[#ff5722] hover:bg-[#e64a19] text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                            >
                                <Check size={16} />
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsCreatingNew(false)}
                                className="bg-[#4A4A4C] border border-zinc-500 text-white px-4 py-3 rounded-lg text-sm hover:bg-[#333333] transition-colors flex items-center gap-1"
                            >
                                <X size={16} />
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                {/* Exercise Details Section */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <MetricInput label="Weight" value={weight} onChange={setWeight} />
                    <MetricInput label="Sets" value={sets} onChange={setSets} />
                    <MetricInput label="Reps" value={reps} onChange={setReps} />
                    <MetricInput label="RPE" value={rpe} onChange={setRpe} />
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
                        value={journal}
                        onChange={(e) => setJournal(e.target.value)}
                        className="w-full h-32 bg-transparent border border-zinc-500 rounded-lg p-4 pt-5 text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-300 resize-none"
                        placeholder="Write your training notes here..."
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
                    <button 
                        onClick={handleSaveClick}
                        className="text-[#ff5722] hover:text-[#e64a19] text-sm font-medium transition-colors"
                    >
                        Save
                    </button>
                    {isEditMode && (
                        <button 
                            onClick={handleDeleteClick} 
                            className="text-[#ff5722] hover:text-red-500 text-sm font-medium transition-colors uppercase"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

// Helper component for metric inputs (Weight, Sets, Reps, RPE)
function MetricInput({ label, value, onChange }: { label: string; value: string, onChange: (val:string) => void }) {
    return (
        <div className="relative pt-2 flex-1 min-w-[80px]">
            <div className="absolute top-0 left-4 bg-[#333333] px-1.5 py-0.5 rounded text-[10px] text-zinc-300 font-medium z-10">
                {label}
            </div>
            <div className="flex items-center border border-zinc-500 rounded-lg px-3 py-2 bg-transparent">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-transparent text-white placeholder-zinc-400 focus:outline-none text-sm"
                />
                <button onClick={() => onChange('')} className="text-zinc-300 hover:text-white transition-colors ml-1">
                    <XCircle size={16} />
                </button>
            </div>
        </div>
    )
}
