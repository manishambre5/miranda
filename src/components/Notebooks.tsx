import { BookOpenText, Plus, Star, Trash } from "lucide-react"
import { Link } from "react-router-dom"
import { useLocalStorage } from "../useLocalStorage";

const Notebooks = () => {
    const { storedNotebooks, deleteNotebook, favouriteNotebook } = useLocalStorage();

    //trigger notebook delete
    const delNotebook = (e:React.MouseEvent<HTMLButtonElement>, id:string) => {
        e.preventDefault();
        deleteNotebook(id);

        //trigger re-render
        //setStoredNotebooks(storedNotebooks);
    }

    //toggle favourite flag for a notebook
    const favNotebook = (e:React.MouseEvent<HTMLButtonElement>, id:string) => {
        e.preventDefault();
        favouriteNotebook(id);

        //trigger re-render
        //setStoredNotebooks(storedNotebooks);
    }

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
            <div className="flex flex-col w-full gap-4">
                {storedNotebooks.map(notebook => (
                    <div className={`flex items-center gap-1 border-l-4 border-slate-400 ${notebook.fav === true ? "bg-slate-100 font-semibold" : "bg-slate-50"} hover:border-slate-900 hover:bg-slate-100 transition-colors group`} key={notebook.id}>
                        <Link className="p-2 w-full text-lg text-slate-600 hover:text-slate-900 cursor-pointer" to={`/${notebook.id}`}>{notebook.title}</Link>
                        <button className="group-hover:block md:hidden ml-auto text-slate-400 hover:text-slate-600 transition-all cursor-pointer p-2"><BookOpenText /></button>
                        <button className="group-hover:block md:hidden ml-auto text-slate-400 hover:text-slate-600 transition-all cursor-pointer p-2" onClick={(e) => favNotebook(e, notebook.id)}><Star className={notebook.fav === true ? "fill-slate-400" : ""} /></button>
                        <button className="group-hover:block md:hidden ml-auto text-slate-400 hover:text-slate-600 transition-all cursor-pointer p-2" onClick={(e) => delNotebook(e, notebook.id)}><Trash /></button>
                    </div>
                ))}
            </div>
        </section>
    </div>
    
  )
}

export default Notebooks