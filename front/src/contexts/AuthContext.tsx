import React, { createContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login(email: string, password: string): Promise<boolean>;
  logout(): Promise<void>;
  register(
    firstname: string,
    lastname: string,
    shop: string,
    city: string,
    email: string,
    password: string
  ): Promise<boolean>;
}

interface User {
  id: number;
  firstname: string;
  lastname: string;
  shop: string;
  city: string;
  email: string;
  role: string;
  authenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
        shop: data.user.shop,
        city: data.user.city,
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

  async function getCurrentUser(): Promise<void> {
    setLoading(true);
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
          shop: data.user.shop,
          city: data.user.city,
          email: data.user.email,
          role: data.user.role,
          authenticated: data.authenticated,
        });
      }
    } else {
      setUser(null);
    }
    setLoading(false);
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

  async function register(
    firstname: string,
    lastname: string,
    shop: string,
    city: string,
    email: string,
    password: string
  ): Promise<boolean> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname,
          lastname,
          shop,
          city,
          email,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser({
          id: data.user.id,
          firstname: data.user.firstname,
          lastname: data.user.lastname,
          shop: data.user.shop,
          city: data.user.city,
          email: data.user.email,
          role: data.user.role,
          authenticated: data.authenticated,
        });
        return true;
      } else {
        setUser(null);
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
