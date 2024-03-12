import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { Formation, IsCorrectAnswer, UserAnswer, VideoWithCompleteQuiz } from "../types/types";

interface MainContextType {
  formations: Formation[];
  getVideosWithCompleteQuizByFormation(id_formation: string): Promise<void>;
  videosWithCompleteQuiz: VideoWithCompleteQuiz[];
  getCorrectAnswer(
    id_question: number,
    id_answer_option_selected: number
  ): Promise<IsCorrectAnswer>;
  saveUserStats(userAnswer: UserAnswer): Promise<void>;
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

  async function getCorrectAnswer(
    id_question: number,
    id_answer_option_selected: number
  ): Promise<IsCorrectAnswer> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/answer/question`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_question, id_answer_option_selected }),
      });

      const answer = await response.json();
      return answer;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async function saveUserStats(userAnswer: UserAnswer) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/stats/save`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_user: userAnswer?.id_user,
          id_question: userAnswer?.id_question,
          id_answer_option: userAnswer?.id_answer_option,
          date_answer: userAnswer?.date_answer,
        }),
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <MainContext.Provider
      value={{
        formations,
        getVideosWithCompleteQuizByFormation,
        videosWithCompleteQuiz,
        getCorrectAnswer,
        saveUserStats,
      }}>
      {children}
    </MainContext.Provider>
  );
};

export { MainProvider, MainContext };
