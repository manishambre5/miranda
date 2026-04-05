import { Plus } from "lucide-react"
import { Link } from "react-router-dom"
import type { Notebook } from "../App";
import { useEffect, useState } from "react";

const Notebooks = () => {
    const [storedNotebooks, setStoredNotebooks] = useState<Notebook[]>([]);
    const filteredNotebooks = storedNotebooks;

    useEffect(() => {
        const keys = Object.keys(localStorage).filter(k => k.startsWith("miranda"));
        const notebooks = keys.map(k => JSON.parse(localStorage.getItem(k) || "{}") as Notebook);
        setStoredNotebooks(notebooks);
    }, []);

  return (
    <div className="flex flex-col gap-4">
        <div className="py-4 flex items-center justify-center gap-4 flex-wrap">
            <h1 className="text-nowrap">My Notebooks</h1>
            <Link to={"/new"} className="border-2 border-slate-400 py-1 px-2 bg-slate-50 text-slate-600 hover:border-slate-600 hover:text-slate-900 transition-colors rounded-sm flex justify-between items-center">
                <Plus className="w-6 h-6" />
                <p className="text-lg p-1">New</p>
            </Link>
            <form className="sm:ml-auto">
                <input className="border-2 border-slate-400 text-slate-900 text-xl outline-0 p-2 focus:border-slate-600 rounded-sm w-auto" name="title" type="search" placeholder="Search" />
            </form>
        </div>

        {/* Exisitng Notebooks */}
        <section className="py-4">
            <div className="grid grid-cols-1 gap-4">
                {filteredNotebooks.map(notebook => (
                    <div key={notebook.id}>
                        <div className="p-2 border-2 border-slate-400 bg-slate-50 rounded-sm text-lg text-slate-600 hover:text-slate-900 hover:border-slate-900 transition-colors cursor-pointer">{notebook.title}</div>
                    </div>
                ))}
            </div>
        </section>
    </div>
    
  )
}

export default Notebooks