import { useParams } from "react-router-dom"
import NotebookForm from "./components/NotebookForm"

const EditNotebook = () => {
  const { id, fav } = useParams<{ id: string, fav:string }>();
  const isFav = fav === 'true';
  return (
    <div className="flex flex-col py-4 px-2">
        <h2 className="text-xl">Edit Notebook</h2>
        <NotebookForm existingNotebookId={id} isFav={isFav} />
    </div>
  )
}

export default EditNotebook