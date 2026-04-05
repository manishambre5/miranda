import { Navigate, Route, Routes } from "react-router-dom"
import NewNotebook from "./NewNotebook"
import ViewNotebook from "./ViewNotebook"
import EditNotebook from "./components/EditNotebook"
import HomePage from "./HomePage"
import Header from "./components/Header"
import AboutPage from "./AboutPage"

export type Notebook = {
  id: string
} & NotebookData

export type NotebookData = {
  title: string
  markdown: string[]
}

const App = () => {

  return (
    <div className="xl:mx-64 font-primary">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
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