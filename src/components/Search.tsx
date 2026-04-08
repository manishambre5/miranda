import Fuse from "fuse.js";
import { useEffect, useMemo, useRef, type ChangeEvent } from "react";
import { useLocalStorage } from "../useLocalStorage";
import { useSearch } from "../SearchModalContext";

const Search = () => {
    const { storedNotebooks } = useLocalStorage();
    const searchInputRef = useRef(null);
    
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
            threshold: 0.3,
            includeMatches: true,
        });
    }, [storedNotebooks]);
    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const results = fuse.search(e.target.value);
        const items = results.map(result => result.item);
        console.log(items);
    }

  return (
    <div>
        {isSearchOpen && (
            <section>
                {/* backdrop */}
                <div className="fixed inset-0 bg-slate-400/40 backdrop-blur-sm z-40" onClick={closeSearch} />

                {/* modal */}
                <div className="fixed top-4 md:top-1/4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl">
                    <div className="bg-slate-50 border-b-2 border-slate-600 rounded-t-sm px-2 pt-1 shadow-2xl flex flex-nowrap gap-2 items-center">
                        <input className="mt-1/3 text-slate-900 text-xl outline-0 p-2 w-full" name="search" type="search" placeholder="Search" ref={searchInputRef} onChange={(e) => handleSearch(e)} autoFocus />
                        <div className="border-2 rounded-sm px-1 border-slate-400 text-slate-400 cursor-default">esc</div>
                    </div>
                </div>
            </section>)
        }
    </div>
  )
}

export default Search