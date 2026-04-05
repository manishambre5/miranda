import { Navigate, Route, Routes } from "react-router-dom"
import NewNotebook from "./components/NewNotebook"
import ViewNotebook from "./components/ViewNotebook"
import EditNotebook from "./components/EditNotebook"
import { useLocalStorage } from "./useLocalStorage"

export type Notebook = {
  id: string
} & NotebookData

export type NotebookData = {
  title: string
  markdown: string[]
}

const App = () => {

  return (
    <div className="m-4 lg:mx-64 font-primary">
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/new" element={<NewNotebook />} />
        <Route path="/:id">
          <Route index element={<ViewNotebook />} />
          <Route path="edit" index element={<EditNotebook />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App