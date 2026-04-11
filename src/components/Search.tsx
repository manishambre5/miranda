import Fuse, { type FuseResult } from "fuse.js";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { useLocalStorage } from "../useLocalStorage";
import { useSearch } from "../SearchModalContext";
import type { Notebook } from "../App";
import { Link, useNavigate } from "react-router-dom";
import { SearchX } from "lucide-react";

//to highlight search matches in search results
const highlightMatch = (text: string, indices: readonly [number, number][] = []): React.ReactNode => {
    if (!indices.length) return text;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    indices.forEach(([start, end], i) => {
        // Append the non-matching text before this match
        parts.push(text.substring(lastIndex, start));
        
        // Append the matching text wrapped in a highlight tag
        parts.push(
            <mark key={i} className="bg-transparent underline font-bold">
                {text.substring(start, end + 1)}
            </mark>
        );
        
        lastIndex = end + 1;
    });

    // Append any remaining text after the last match
    parts.push(text.substring(lastIndex));

    return parts;
};

const Search = () => {
    const { storedNotebooks } = useLocalStorage();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [searchResults, setSearchResults] = useState<FuseResult<Notebook>[]>([]);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const navigate = useNavigate();
    const [ selectedIndex, setSelectedIndex ] = useState(0);
    const [query, setQuery] = useState("");
    
    //using search input context
    const { isSearchOpen, openSearch, closeSearch } = useSearch();

    //keyboard shortcut to open search modal
    useEffect(() => {
        const handleKeyboardInput = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.code === "KeyK") {
                e.preventDefault();
                openSearch();
            }
            if (e.code === "Escape") {
                e.preventDefault();
                closeSearch();
            }
        };
        window.addEventListener("keydown", handleKeyboardInput);

        //cleanup the event listener when the component is unmounted
        return () => window.removeEventListener("keydown", handleKeyboardInput);

    }, [openSearch, closeSearch]);

    //search with fuse.js
    const fuse = useMemo(() => {
        return new Fuse(storedNotebooks, {
            keys: ['title', 'markdown'],
            threshold: 0.2,
            ignoreLocation: true,
            useExtendedSearch: true,
            includeMatches: true,
        });
    }, [storedNotebooks]);
    

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setQuery(e.target.value); //for visual cue
        // Clear the previous timer if user types again before 300ms
        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        // Set a new timer
        debounceTimer.current = setTimeout(() => {
            if (!query.trim()) {
                setSearchResults([]);//clear results if input is empty
                return;
            }
            if (fuse) {
                const results = fuse.search(query);
                setSearchResults(results);//store the WHOLE result object
            }
        }, 300);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === "Enter" && searchResults[selectedIndex]) {
            const targetNote = searchResults[selectedIndex].item;
            closeSearch();
            navigate(`/${targetNote.id}`); 
        }
    };

    useEffect(()=> {
        //reset search results state and debounce timer
        if (!isSearchOpen) {
            setSearchResults([]);
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
            if (searchInputRef.current) (searchInputRef.current as HTMLInputElement).value = "";
        }
        //reset search result selection index
        setSelectedIndex(0);
    }, [isSearchOpen])

  return (
    <div>
        {isSearchOpen && (
            <section>
                {/* backdrop */}
                <div className="fixed inset-0 bg-slate-400/40 backdrop-blur-sm z-40" onClick={closeSearch} />

                {/* modal */}
                <div className="fixed top-4 md:top-1/4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl">
                    <div className="bg-slate-50 border-b-2 border-slate-600 rounded-t-sm px-2 pt-1 shadow-2xl flex flex-nowrap gap-2 items-center">
                        <input className="mt-1/3 text-slate-900 text-xl outline-0 p-2 w-full" name="search" type="search" placeholder="Search" ref={searchInputRef} onChange={(e) => handleSearch(e)} onKeyDown={handleKeyDown} autoFocus />
                        <div className="border-2 rounded-sm px-1 border-slate-400 text-slate-400 cursor-default">esc</div>
                    </div>

                    {/* Search results */}
                    <div className="bg-slate-50 p-1 rounded-b-sm flex flex-col gap-1" role="listbox">
                        {!query ? (
                            <div className="p-10 text-center text-slate-400">
                                <p className="">Type something to search :)</p>
                            </div>
                        ) : searchResults.length > 0 ? (
                            searchResults.map((result, index) => {
                                // Find the match object for 'markdown'
                                const markdownMatches = result.matches?.find(m => m.key === 'markdown');

                                //to show the line that contains the match or show the first line as a preview
                                const lineIndex = markdownMatches?.refIndex;
                                const textToDisplay = lineIndex !== undefined
                                    ? result.item.markdown[lineIndex]
                                    : (result.item.markdown[0] || "Empty notebook");

                                return (
                                    <Link role="option" aria-selected={selectedIndex === index} key={result.refIndex} className={`p-2 rounded-sm ${
                                        selectedIndex === index ? "bg-slate-200" : "hover:bg-slate-200"
                                    }`} to={`/${result.item.id}`} onClick={closeSearch}>
                                        <h3 className="font-bold">
                                            {highlightMatch(
                                                result.item.title, 
                                                result.matches?.find(m => m.key === 'title')?.indices
                                            )}
                                        </h3>
                                        
                                        <p className="text-sm text-slate-600 truncate mt-1">
                                            {highlightMatch(textToDisplay, markdownMatches?.indices)}
                                        </p>
                                    </Link>
                                );
                            })
                        ) : (
                            <div className="p-10 text-center text-slate-400">
                                <SearchX className="self-center w-full h-12" />
                                <p className="">No matches found :/</p>
                            </div>
                        )}
                        <p className="text-right text-xs text-slate-400">Powered by fuse.js</p>
                    </div>
                </div>
            </section>)
        }
    </div>
  )
}

export default Search