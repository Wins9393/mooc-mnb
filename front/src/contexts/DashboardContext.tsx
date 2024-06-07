import { createContext, useState } from "react";
import { User } from "../types/types";

interface DashboardContextType {
  users: User[] | null;
  getUsers(): Promise<void>;
  oneUser: User | null;
  getOneUser(id: number): Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [oneUser, setOneUser] = useState<User | null>(null);

  async function getUsers(): Promise<void> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getOneUser(id: number): Promise<void> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setOneUser(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <DashboardContext.Provider value={{ users, getUsers, oneUser, getOneUser }}>
      {children}
    </DashboardContext.Provider>
  );
};

export { DashboardProvider, DashboardContext };
