import React from "react";
import "./main-content.css";

export function MainContent(props: React.PropsWithChildren) {
  return <div className="main-content">{props.children}</div>;
}
