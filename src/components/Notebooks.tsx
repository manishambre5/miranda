import { Plus } from "lucide-react"
import { Link } from "react-router-dom"

const Notebooks = () => {
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
            <div className="grid grid-cols-4 gap-4">
                <div className="aspect-square bg-slate-200 rounded-sm"></div>
                <div className="aspect-square bg-slate-100 rounded-sm"></div>
                <div className="aspect-square bg-slate-50 rounded-sm"></div>
                <div className="aspect-square bg-slate-100 rounded-sm"></div>
            </div>
        </section>
    </div>
    
  )
}

export default Notebooks