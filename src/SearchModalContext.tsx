import React, { createContext, useCallback, useContext, useState } from 'react';

const SearchContext = createContext({
  isSearchOpen: false,
  openSearch: () => {},
  closeSearch: () => {},
});

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSearchOpen, setIsOpen] = useState(false);

  const openSearch = useCallback(() => setIsOpen(true), []);
  const closeSearch = useCallback(() => setIsOpen(false), []);

  return (
    <SearchContext.Provider value={{ isSearchOpen, openSearch, closeSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);