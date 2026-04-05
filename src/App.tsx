import { Navigate } from "react-router-dom"
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NewNotebook from "./NewNotebook"
import ViewNotebook from "./ViewNotebook"
import EditNotebook from "./components/EditNotebook"
import HomePage from "./HomePage"
import AboutPage from "./AboutPage"
import RootLayout from "./RootLayout";

export type Notebook = {
  id: string
} & NotebookData

export type NotebookData = {
  title: string
  markdown: string[]
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // Move your Header and Div wrapper here
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "new", element: <NewNotebook /> },
      {
        path: ":id",
        children: [
          { index: true, element: <ViewNotebook /> },
          { path: "edit", element: <EditNotebook /> },
        ],
      },
      { path: "*", element: <Navigate to="/" /> },
    ],
  },
], {
  basename: import.meta.env.BASE_URL
});

const App = () => <RouterProvider router={router} />;

export default App