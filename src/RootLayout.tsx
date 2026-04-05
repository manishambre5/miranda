import { Outlet } from "react-router-dom";
import Header from "./components/Header";

const RootLayout = () => {
  return (
    <div className="xl:mx-64 font-primary">
      {/* The Header stays mounted globally. 
          It won't re-render when you switch pages! 
      */}
      <Header />

      <main className="mt-8">
        {/* The Outlet is a placeholder. 
            React Router will swap this out for 
            whatever child route is currently active.
        */}
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;