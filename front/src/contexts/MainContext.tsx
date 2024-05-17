import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  ContentByModule,
  ContentsByFormation,
  Formation,
  IsCorrectAnswer,
  QuestionFromDB,
  QuizByModule,
  UserAnswer,
  UserProgression,
} from "../types/types";

interface MainContextType {
  formations: Formation[];
  isLoadingFormations: boolean;
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
  resetQuizById(id_user: number, id_quiz: number): Promise<void>;
  saveUserProgression(userProgression: UserProgression): Promise<void>;
  getUserProgressionByUser(id_user: number): Promise<void>;
  userProgression: UserProgression[] | null;
  getContentsByFormationId(id: number): Promise<void>;
  contentsByFormation: ContentsByFormation | null;
  getUserAnswersByFormationByUserId(id_user: number, id_formation: number): Promise<void>;
  totalUserAnswersByFormation: UserAnswer[] | null;
  getQuestionsByFormation(id_formation: number): Promise<void>;
  totalQuestionsByFormation: QuestionFromDB[] | null;
}

const MainContext = createContext<MainContextType | null>(null);

const MainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [isLoadingFormations, setIsLoadingFormations] = useState<boolean>(true);
  const [contentsByFormation, setContentsByFormation] = useState<ContentsByFormation | null>(null);
  const [moduleContent, setModuleContent] = useState<ContentByModule | null>(null);
  const [moduleQuiz, setModuleQuiz] = useState<QuizByModule | null>(null);
  const [userProgression, setUserProgression] = useState<UserProgression[] | null>(null);
  const [totalUserAnswersByFormation, setTotalUserAnswersByFormation] = useState<
    UserAnswer[] | null
  >(null);
  const [totalQuestionsByFormation, setTotalQuestionsByFormation] = useState<
    QuestionFromDB[] | null
  >(null);
  const authContext = useContext(AuthContext);

  if (!authContext) return;

  const { user } = authContext;

  useEffect(() => {
    getFormationsWithModules();
    if (user) {
      getUserProgressionByUser(user.id);
    }
  }, [user]);

  async function getFormationsWithModules() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/formations`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setFormations(data);
      setIsLoadingFormations(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function getContentsByFormationId(id: number): Promise<void> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/formations/${id}/contents`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      setContentsByFormation(data);
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
          correct: userAnswer?.correct,
        }),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function getUserAnswersByFormationByUserId(
    id_user: number,
    id_formation: number
  ): Promise<void> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/stats/useranswers/user/formation`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id_user, id_formation }),
        }
      );
      const data = await response.json();
      // console.log("data UA MAIN: ", data);
      setTotalUserAnswersByFormation(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getQuestionsByFormation(id_formation: number): Promise<void> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/questions/formation`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_formation }),
      });
      const data = await response.json();
      // console.log("data question main: ", data);
      setTotalQuestionsByFormation(data);
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

  async function resetQuizById(id_user: number, id_quiz: number): Promise<void> {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/stats/useranswers/delete`, {
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
    } catch (error) {
      console.log(error);
    }
  }

  async function getUserProgressionByUser(id: number): Promise<void> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/progression/user`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const userProgressionResult = await response.json();
      setUserProgression(userProgressionResult);
    } catch (error) {
      console.log(error);
    }
  }

  async function saveUserProgression(userProgression: UserProgression): Promise<void> {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/progression/save`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userProgression),
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <MainContext.Provider
      value={{
        formations,
        isLoadingFormations,
        getContentByModule,
        moduleContent,
        getQuizByModule,
        moduleQuiz,
        getCorrectAnswer,
        saveUserStats,
        getUserAnswerByQuizId,
        resetQuizById,
        saveUserProgression,
        getUserProgressionByUser,
        userProgression,
        getContentsByFormationId,
        contentsByFormation,
        getUserAnswersByFormationByUserId,
        totalUserAnswersByFormation,
        getQuestionsByFormation,
        totalQuestionsByFormation,
      }}>
      {children}
    </MainContext.Provider>
  );
};

export { MainProvider, MainContext };
