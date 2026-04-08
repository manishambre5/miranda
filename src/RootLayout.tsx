import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Search from "./components/Search";
import { SearchProvider } from "./SearchModalContext";

const RootLayout = () => {
  return (
    <SearchProvider>
      <div className="md:px-24 lg:px-40 xl:px-64 font-primary">
        <Header />
        <Search />

        <main className="mt-8">
          <Outlet />
        </main>
      </div>
    </SearchProvider>
  );
};

export default RootLayout;