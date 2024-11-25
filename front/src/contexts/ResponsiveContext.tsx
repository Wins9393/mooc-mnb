import React, { createContext, useEffect, useState } from "react";

interface ResponsiveContext {
  vpHeight: number;
  vpWidth: number;
}

const ResponsiveContext = createContext<ResponsiveContext | null>(null);

const ResponsiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vpHeight, setVPHeight] = useState<number>(window.innerHeight);
  const [vpWidth, setVPWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setVPHeight(window.innerHeight);
      setVPWidth(window.innerWidth);
    });
  }, [vpHeight, vpWidth]);

  return (
    <ResponsiveContext.Provider value={{ vpHeight, vpWidth }}>
      {children}
    </ResponsiveContext.Provider>
  );
};

export { ResponsiveContext, ResponsiveProvider };
