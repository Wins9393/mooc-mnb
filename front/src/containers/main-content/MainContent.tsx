import React, { useContext, useEffect, useState } from "react";
import "./main-content.css";
import { useLocation } from "react-router-dom";
import { ResponsiveContext } from "../../contexts/ResponsiveContext";

export function MainContent(props: React.PropsWithChildren) {
  const [minHeight, setMinHeight] = useState(100);
  const [headerHeight, _] = useState(5);
  const [padding, setPadding] = useState(0);
  const location = useLocation();

  const responsiveContext = useContext(ResponsiveContext);

  if (!responsiveContext) return;

  const { vpWidth } = responsiveContext;

  useEffect(() => {
    console.log("location: ", location);
    if (
      location.pathname === "/" ||
      location.pathname === "/login" ||
      location.pathname === "/register"
    ) {
      setMinHeight(100);
      setPadding(0);
    } else {
      setMinHeight(100 - headerHeight);
      if (vpWidth < 480) {
        return setPadding(8);
      }
      setPadding(32);
    }
  }, [location, vpWidth]);

  useEffect(() => {
    console.log("vpWidth: ", vpWidth);
  }, [vpWidth]);

  return (
    <div
      style={{
        minHeight: `${minHeight}vh`,
        padding: padding,
      }}
      className="main-content">
      {props.children}
    </div>
  );
}
