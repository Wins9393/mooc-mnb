import { Outlet } from "react-router-dom";
import "./App.css";
import { Header } from "./components/header/Header";
import { MainContent } from "./containers/main-content/MainContent";

function App() {
  return (
    <div className="App">
      <Header />
      <MainContent>
        <Outlet />
      </MainContent>
    </div>
  );
}

export default App;
