import type { ReactNode } from 'react'
import { useState } from 'react'
import {
    Calendar,
    LineChart,
    Target,
    Activity,
    ListChecks,
    User,
    HelpCircle,
    ChevronRight,
    ChevronLeft,
    ChevronDown
} from 'lucide-react'

// View types for calendar
type ViewType = 'WEEK' | 'MONTH' | 'YEAR'

interface DashboardLayoutProps {
    children: ReactNode;
    currentDate: Date;
    currentView: ViewType;
    onPrevWeek: () => void;
    onNextWeek: () => void;
    onGoToToday: () => void;
    onViewChange: (view: ViewType) => void;
    onLogSession: () => void;
}

// Helper function to format the date range for the current week
function formatWeekRange(date: Date) {
    const current = new Date(date);
    const dayOfWeek = current.getDay();

    // Calculate the start of the week (Sunday)
    const start = new Date(current);
    start.setDate(current.getDate() - dayOfWeek);

    // Calculate the end of the week (Saturday)
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const startMonth = start.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
    const endMonth = end.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
    const startDay = start.getDate();
    const endDay = end.getDate();
    const year = end.getFullYear();

    // If the week spans two different months, show both months; otherwise, show just one month
    if (startMonth === endMonth) {
        return `${startMonth} ${startDay} - ${endDay}, ${year}`;
    } else {
        return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
    }
}

export default function DashboardLayout({ 
    children,
    currentDate,
    currentView,
    onPrevWeek,
    onNextWeek,
    onGoToToday,
    onViewChange,
    onLogSession
}: DashboardLayoutProps) {

    const [isViewMenuopen, setIsViewMenuOpen] = useState(false);
    
    return (
        // Main layout container
        <div className="flex h-screen bg-[#1a1a1a] text-zinc-300 font-sans overflow-hidden">
            {/* 1. LEFT SIDERBAR */}
            <aside className="w-20 bg-[#141414] border-r border-zinc-800 flex flex-col items-center py-6 flex-shrink-0">
                {/* Logo Placeholder */}
                <div className="mb-8 text-[#ff5722]">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>
                    </svg>
                </div>

                {/* Navigation Icons */}
                <nav className="flex flex-col gap-2 w-full">
                    <NavItem icon={<Calendar size={24} />} label="Planner" active />
                    <NavItem icon={<LineChart size={24} />} label="Metrics" />
                    <NavItem icon={<Target size={24} />} label="Goals" />
                    <NavItem icon={<Activity size={24} />} label="Tests" />
                    <NavItem icon={<ListChecks size={24} />} label="Tick List" />
                    <NavItem icon={<User size={24} />} label="Profile" />
                </nav>

                {/* Help Icon at the bottom */}
                <div className="mt-auto w-full">
                    <NavItem icon={<HelpCircle size={24} />} label="Help" />
                </div>
            </aside>

            {/* 2. MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Top Header */}
                <header className="flex items-center justify-between px-8 py-6 border-b border-zinc-800 bg-[#1a1a1a]">

                    {/* Left Side: Date Controls */}
                    <div className="flex items-center gap-4">
                        <button 
                        onClick={onGoToToday}
                        className="px-4 py-1.5 border border-zinc-700 rounded text-sm hover:bg-zinc-800 transition-colors">
                            TODAY
                        </button>
                        <div className="flex items-center gap-2 text-zinc-400">
                            <button onClick={onPrevWeek} className="p-1 hover:text-white transition-colors"><ChevronLeft size={20} /></button>
                            <button onClick={onNextWeek} className="p-1 hover:text-white transition-colors"><ChevronRight size={20} /></button>
                        </div>
                        <div className="flex flex-col ml-4">
                            <span className="text-xs text-zinc-500 font-semibold tracking-wider uppercase">Training Log</span>

                            {/* Display the formatted week range */}
                            <h2 className="text-xl font-bold text-white tracking-wide">
                                {formatWeekRange(currentDate)}
                            </h2>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        
                        {/* Right Side: View Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setIsViewMenuOpen(!isViewMenuopen)}
                                className="flex items-center gap-2 px-3 py-1.5 border border-zinc-700 rounded text-sm hover:bg-zinc-800 transition-colors uppercase w-24 justify-between" 
                            >
                                {currentView}
                                <ChevronDown size={16} />
                            </button>

                            {isViewMenuopen && (
                                <div className="absolut right-0 mt-2 w-32 bg-[#141414] border border-zinc-800 rounded-md shadow-xl z50 overflow-hidden">
                                    {(['WEEK', 'MONTH', 'YEAR'] as ViewType[]).map((view) => (
                                        <button
                                            key={view}
                                            onClick={() => {
                                                onViewChange(view)
                                                setIsViewMenuOpen(false)
                                            }}
                                            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                                                currentView === view
                                                ? 'bg-[#ff5722] text-white font-medium'
                                                : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                                            }`}
                                        >
                                            {view}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Log Session Button */}
                        <button 
                            onClick={onLogSession}
                            className="Flex items-center gap-2 bg-[#ff5722] hover:bg-[#e64a19] text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
                        >
                            <span className="text-lg leading-none">+</span> LOG SESSION
                        </button>
                    </div>       
                </header>

                {/* 3. DYNAMIC CONTENT AREA */}
                <div className="flex-1 overflow-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}

// Helper function for navigation items
function NavItem({ icon, label, active = false }: { icon: ReactNode; label: string; active?: boolean }) {
    return (
        <button className={`flex flex-col items-center gap-1 py3 w-full transition-colors ${active ? 'bg-[#ff5722] text-white' : 'text-zinc-500 hover:text-zinc300 hover:bg-zinc-800/50'}`}>
            {icon}
            <span className="text-[10px] uppercase tracking-wider font-medium">{label}</span>
        </button>
    )
}