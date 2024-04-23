import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import { Header } from "./components/header/Header";
import { MainContent } from "./containers/main-content/MainContent";
import { useEffect, useState } from "react";

function App() {
  const location = useLocation();
  const [currentLocation, setCurrentLocation] = useState<string>(location.pathname);

  useEffect(() => {
    setCurrentLocation(location.pathname);
  }, [location]);
  return (
    <div className="App">
      <Header currentLocation={currentLocation} />
      <MainContent>
        <Outlet />
      </MainContent>
    </div>
  );
}

export default App;
