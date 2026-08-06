import { useState } from "react";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { InstantSearch, SearchBox, Hits, Highlight } from "react-instantsearch";
import { Search, X } from "lucide-react"

// Initialize the Algolia client
const searchClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_SEARCH_KEY
);

export default function JournalSearchModal({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm p-4 pt-20">
            <div className="w-full max-w-2xl bg-[#242424] border border-zinc-700 rounded-2xl overflow-hidden shadow-2xl">
                
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700 bg-[#1a1a1a]">
                    <div className="flex items-center gap-2 text-white font-semibold">
                        <Search size={18} className="text-[#ff5722]" />
                        <span>Search Training Journal</span>
                    </div>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white p-1">
                        <X size={20} />
                    </button>
                </div>

                {/* Algolia InstantSearch Context */}
                <InstantSearch searchClient={searchClient} indexName={import.meta.env.VITE_ALGOLIA_INDEX_NAME}>
                    <div className="p-4">
                        {/* The Search Input */}
                        <SearchBox 
                            classNames={{
                                root: 'mb-6',
                                input: 'w-full bg-[#1a1a1a] border border-zinc-600 rounded-lg px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:border-[#ff5722]',
                                submitIcon: 'hidden',
                                resetIcon: 'hidden'
                            }}
                            placeholder="Search Journal (E.g.,'tweaked pulley' or 'felt strong'...)" 
                        />

                        {/* The Results List */}
                        <div className="max-h-[60vh] overflow-y-auto pr-2">
                            <Hits hitComponent={Hit} />
                        </div>
                    </div>
                </InstantSearch>
            </div>
        </div>
    );
}

// How an individual search result looks
function Hit({ hit }: any) {
    return (
        <div className="border-b border-zinc-700/50 py-3 last:border-0">
            <div className="flex justify-between items-center mb-1">
                <span className="text-[#ff5722] font-bold text-sm">{hit.exercise_name}</span>
                <span className="text-zinc-500 text-xs">{hit.date}</span>
            </div>
            <p className="text-zinc-300 text-sm">
                {/* Highlight matches the search query text with a yellow background by default */}
                <Highlight attribute="journal" hit={hit} />
            </p>
        </div>
    );
}