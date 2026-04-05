import NotebookForm from "./components/NotebookForm"

const NewNotebook = () => {
  return (
    <div className="flex flex-col py-4 px-2">
        <h2 className="text-xl">New Notebook</h2>
        <NotebookForm />
    </div>
  )
}

export default NewNotebook