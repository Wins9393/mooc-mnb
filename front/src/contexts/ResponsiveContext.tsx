import React, { createContext, useEffect, useState } from "react";

interface ResponsiveContext {
  vpHeight: number;
  vpWidth: number;
}

const ResponsiveContext = createContext<ResponsiveContext | null>(null);

const ResponsiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vpHeight, setVPHeight] = useState<number>(0);
  const [vpWidth, setVPWidth] = useState<number>(0);

  useEffect(() => {
    console.log(vpHeight, vpWidth);
  }, [vpHeight, vpWidth]);

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
