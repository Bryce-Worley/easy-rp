import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import ReactMarkdown from 'react-markdown'
import { Download, X, HelpCircle, FileText } from 'lucide-react'

import readmeContent from '../../../README.md?raw'

interface HelpModalProps {
    onClose: () => void;
}

export default function HelpModal({ onClose }: HelpModalProps) {
    const [isExporting, setIsExporting] = useState(false)

    // Fetch user data from SupaBase for browser download
    const handleExportData = async () => {
        setIsExporting(true)
        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session?.user) {
                throw new Error('User not authenticated')
            }

            const { data, error } = await supabase
                .from('exercises')
                .select('*')
                .eq('user_id', session.user.id)
                .order('date', { ascending: true })
                
            if (error) {
                throw error
            }

            if (!data || data.length === 0) {
                alert('No data available to export.')
                setIsExporting(false)
                return
            }

            // Convert JSON to Blob and create a download link
            const jsonData = JSON.stringify(data, null, 2)
            const blob = new Blob([jsonData], { type: 'application/json' })
            const url = URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.download = `climbing_data_export_${new Date().toISOString().slice(0, 10)}.json`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        } catch (error: any) {
            console.error('Error exporting data:', error)
            alert(`Error exporting data: ${error.message || 'Unknown error'}`)
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-3xl bg-[#242424] border border-zinc-700 rounded-2xl flex flex-col max-h-[85vh] overflow-hidden">

                {/* Header */}
                <div className='flex items-center justify-between px-4 py-4 border-b border-zinc-700 bg-[#1a1a1a]'>
                    <div className='flex items-center gap-2 text-white font-semibold text-lg'>
                        <HelpCircle size={22} className="text-[#ff5722]"/>
                        <span>Help & Documentation</span>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-zinc-800/50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Markdown Content Container */}
                <div className="flex-1 overflow-y-auto p-6 text-zinc-300 text-sm leading-relaxed space-y-4 font-sans prose prose-invert max-w-none">
                    <ReactMarkdown
                        components={{
                            h1: ({ children }) => <h1 className="text-2xl font-bold text-white border-b border-zinc-700 pb-2 mb-4">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-xl font-bold text-white mt-6 mb-3">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-lg font-semibold text-zinc-100 mt-4 mb-2">{children}</h3>,
                            p: ({ children }) => <p className="mb-3 text-zinc-300">{children}</p>,
                            li: ({ children }) => <li className="mb-1 text-zinc-300">{children}</li>,
                            ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1 text-zinc-300">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1 text-zinc-300">{children}</ol>,
                            code: ({ children }) => <code className="bg-[#1a1a1a] text-[#ff5722] px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>,
                            blockquote: ({ children }) => <blockquote className="border-l-4 border-[#ff5722] pl-4 italic text-zinc-400 my-4">{children}</blockquote>
                        }}
                    >
                        {readmeContent|| "# Help\n\nNo README content available."}
                    </ReactMarkdown>
                </div>

                {/* Footer with Supabase Export Button */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-700 bg-[#1a1a1a]">
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                        <FileText size={16} />
                        <span> Need your raw exercise logs?</span>
                    </div>

                    <button
                        onClick={handleExportData}
                        disabled={isExporting}
                        className='flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium border border-zinc-600 transition-colors disabled:opacity-50'
                    >
                        <Download size={16} />
                        {isExporting ? 'Exporting...' : 'Export Data'}
                    </button>
                </div>
            </div>
        </div>
    )
}   