import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { MainProvider } from "./contexts/MainContext.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthGuard from "./components/auth-guard/AuthGuard.tsx";
import { LoginForm } from "./components/login-form/LoginForm.tsx";
import { RegisterForm } from "./components/register-form/RegisterForm.tsx";
import { Home } from "./containers/home/Home.tsx";
import { Formations } from "./containers/formations/Formations.tsx";
import "./index.css";
import { FormationPage } from "./containers/formation-page/FormationPage.tsx";
import { Dashboard } from "./containers/dashboard/Dashboard.tsx";
import { CreateFormation } from "./containers/dashboard/CreateFormation.tsx";
import { AllUsers } from "./components/dashboard-components/AllUsers.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <LoginForm />,
      },
      {
        path: "/register",
        element: <RegisterForm />,
      },
      {
        path: "/formations",
        element: <AuthGuard />,
        children: [{ index: true, element: <Formations /> }],
      },
      {
        path: "/formation/:id_formation",
        element: <AuthGuard />,
        children: [{ index: true, element: <FormationPage /> }],
      },
      {
        path: "/dashboard",
        element: <AuthGuard />,
        children: [{ index: true, element: <Dashboard /> }],
      },
      {
        path: "/dashboard/create-formation",
        element: <AuthGuard />,
        children: [{ index: true, element: <CreateFormation /> }],
      },
      {
        path: "/dashboard/users",
        element: <AuthGuard />,
        children: [{ index: true, element: <AllUsers /> }],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <MainProvider>
        <RouterProvider router={router} />
      </MainProvider>
    </AuthProvider>
  </React.StrictMode>
);
