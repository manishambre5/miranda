import { ArrowUpRight, Sprout } from "lucide-react"
import { Link } from "react-router-dom"

const Header = () => {
  return (
    <header className="flex gap-4 items-center justify-between text-slate-600 p-2 mb-2">
        <Link to={"/"} className="flex gap-2 md:gap-4 items-center">
            <Sprout className="h-9 w-9" />
            <h1>miranda</h1>
        </Link>
        <div className="flex gap-2 md:gap-4 text-nowrap">
          <Link to="/about" className="border-b-2 border-slate-400 p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:border-slate-600 hover:text-slate-900 transition-colors">About</Link>
          <Link to="https://github.com/manishambre5/miranda" className="border-b-2 border-slate-400 p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:border-slate-600 hover:text-slate-900 transition-colors flex items-center">
            <p>Source Code</p>
            <ArrowUpRight className="h-5 w-5" />
          </Link>
        </div>
    </header>
  )
}

export default Header