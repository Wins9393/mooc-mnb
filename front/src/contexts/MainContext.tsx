import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  ContentByModule,
  Formation,
  IsCorrectAnswer,
  QuizByModule,
  UserAnswer,
} from "../types/types";

interface MainContextType {
  formations: Formation[];
  getContentByModule(id_module: number): Promise<void>;
  moduleContent: ContentByModule | null;
  getQuizByModule(id_module: number): Promise<void>;
  moduleQuiz: QuizByModule | null;
  getCorrectAnswer(
    id_question: number,
    id_answer_option_selected: number
  ): Promise<IsCorrectAnswer>;
  saveUserStats(userAnswer: UserAnswer): Promise<void>;
  getUserAnswerByQuizId(id_user: number, id_quiz: number): Promise<UserAnswer[] | undefined>;
}

const MainContext = createContext<MainContextType | null>(null);

const MainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [moduleContent, setModuleContent] = useState<ContentByModule | null>(null);
  const [moduleQuiz, setModuleQuiz] = useState<QuizByModule | null>(null);
  const authContext = useContext(AuthContext);

  if (!authContext) return;

  const { user } = authContext;

  useEffect(() => {
    getFormationsWithModules();
  }, [user]);

  async function getFormationsWithModules() {
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

  async function getContentByModule(id_module: number): Promise<void> {
    try {
      if (!isNaN(id_module)) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/module/${id_module}/content`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        setModuleContent(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getQuizByModule(id_module: number): Promise<void> {
    try {
      if (!isNaN(id_module)) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/module/${id_module}/quiz`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setModuleQuiz(data);
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

  async function saveUserStats(userAnswer: UserAnswer): Promise<void> {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/stats/save`, {
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
          id_quiz: userAnswer?.id_quiz,
        }),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function getUserAnswerByQuizId(
    id_user: number,
    id_quiz: number
  ): Promise<UserAnswer[] | undefined> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/stats/useranswers`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_user,
          id_quiz,
        }),
      });

      const userAnswers = await response.json();
      return userAnswers;
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <MainContext.Provider
      value={{
        formations,
        getContentByModule,
        moduleContent,
        getQuizByModule,
        moduleQuiz,
        getCorrectAnswer,
        saveUserStats,
        getUserAnswerByQuizId,
      }}>
      {children}
    </MainContext.Provider>
  );
};

export { MainProvider, MainContext };
