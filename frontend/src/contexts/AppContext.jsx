import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const updateCartCount = (newCount) => setCartCount(newCount);
  const updateWishlistCount = (newCount) => setWishlistCount(newCount);

  return (
    <AppContext.Provider
      value={{
        cartCount,
        wishlistCount,
        updateCartCount,
        updateWishlistCount
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}