import React, { createContext, useEffect, useState } from "react";

interface AuthContextType {
  user: user | null;
  login(email: string, password: string): Promise<boolean>;
  logout(): Promise<void>;
}

interface user {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  authenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<user | null>(null);

  useEffect(() => {
    getCurrentUser();
  }, []);

  async function login(email: string, password: string): Promise<boolean> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setUser({
        id: data.user.id,
        firstname: data.user.firstname,
        lastname: data.user.lastname,
        email: data.user.email,
        role: data.user.role,
        authenticated: data.authenticated,
      });
      return true;
    } else {
      setUser(null);
      return false;
    }
  }

  async function getCurrentUser() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      if (data.authenticated && data.user) {
        setUser({
          id: data.user.id,
          firstname: data.user.firstname,
          lastname: data.user.lastname,
          email: data.user.email,
          role: data.user.role,
          authenticated: data.authenticated,
        });
      }
    } else {
      setUser(null);
    }
  }

  async function logout(): Promise<void> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      setUser(null);
    }
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };
