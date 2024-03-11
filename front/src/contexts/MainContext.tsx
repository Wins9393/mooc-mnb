import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { Formation, VideoWithCompleteQuiz } from "../types/types";

interface MainContextType {
  formations: Formation[];
  getVideosWithCompleteQuizByFormation(id_formation: string): Promise<void>;
  videosWithCompleteQuiz: VideoWithCompleteQuiz[];
}

const MainContext = createContext<MainContextType | null>(null);

const MainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [videosWithCompleteQuiz, setVideosWithCompleteQuiz] = useState<VideoWithCompleteQuiz[]>([]);
  const authContext = useContext(AuthContext);

  if (!authContext) return;

  const { user } = authContext;

  useEffect(() => {
    getFormationsWithVideos();
  }, [user]);

  async function getFormationsWithVideos() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/formations`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setFormations(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getVideosWithCompleteQuizByFormation(id_formation: string | null): Promise<void> {
    try {
      const id_formation_number = Number(id_formation);

      if (!isNaN(id_formation_number)) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/formation/${id_formation_number}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        setVideosWithCompleteQuiz(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <MainContext.Provider
      value={{ formations, getVideosWithCompleteQuizByFormation, videosWithCompleteQuiz }}>
      {children}
    </MainContext.Provider>
  );
};

export { MainProvider };
export { MainContext };
