// usePersistedTheme.js
import { useState, useEffect } from "react";

export const usePersistedTheme = (defaultTheme = "dark") => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || defaultTheme;
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);
 
  const toggleTheme = (mode) => {
    setTheme(mode);
  };
  
  return [theme, toggleTheme];
};
