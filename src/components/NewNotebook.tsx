import { Sprout } from "lucide-react"
import NotebookForm from "./NotebookForm"

const NewNotebook = () => {
  return (
    <div>
        <div className="flex gap-4 items-center">
            <Sprout />
            <h1>New Notebook</h1>
        </div>
        <NotebookForm />
    </div>
  )
}

export default NewNotebook