import { createContext, useContext, useState } from "react";
import { MainContext } from "./MainContext";
import {
  ContentsByFormation,
  FullAnswerOption,
  QuestionFromDB,
  UserAnswer,
  UserProgression,
} from "../types/types";

interface StatisticsContextType {
  scorePercentage: number;
  progressionPercentage: number;
  getProgressionPercentageByFormation(
    userProgression: UserProgression[],
    contentsByFormation: ContentsByFormation,
    idFormation: number
  ): Promise<number>;
  getScorePercentageByFormation(
    userAnswers: UserAnswer[],
    questions: QuestionFromDB[]
  ): Promise<number>;
}

const StatisticsContext = createContext<StatisticsContextType | null>(null);

const StatisticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scorePercentage, setScorePercentage] = useState<number>(0);
  const [progressionPercentage, setProgressionPercentage] = useState<number>(0);

  const mainContext = useContext(MainContext);
  if (!mainContext) return;
  const { getCorrectAnswer } = mainContext ?? {};

  async function getProgressionPercentageByFormation(
    userProgression: UserProgression[],
    contentsByFormation: ContentsByFormation,
    idFormation: number
  ): Promise<number> {
    const progressionByFormationTab = userProgression.filter(
      (progress) => progress.id_formation === idFormation
    );

    if (contentsByFormation) {
      const contentsCount =
        contentsByFormation.video_count +
        contentsByFormation.text_count +
        contentsByFormation.quiz_count;

      let progressPercentage = parseFloat(
        ((progressionByFormationTab.length / contentsCount) * 100).toFixed(1)
      );

      setProgressionPercentage(progressPercentage);
      return progressPercentage;
    }
    return 0;
  }

  async function getScorePercentageByFormation(
    userAnswers: UserAnswer[],
    questions: QuestionFromDB[]
  ): Promise<number> {
    setScorePercentage(0);
    let goodAnswers = 0;

    const groupTotalUserAnswersByFormation = userAnswers?.reduce(
      (acc: { [key: number]: UserAnswer[] }, answer: UserAnswer) => {
        if (!acc[answer.id_question]) {
          acc[answer.id_question] = [];
        }
        acc[answer.id_question].push(answer);
        return acc;
      },
      {}
    );

    if (groupTotalUserAnswersByFormation) {
      const questionsNumber = Object.keys(groupTotalUserAnswersByFormation).length;

      for (const [key, answers] of Object.entries(groupTotalUserAnswersByFormation)) {
        if (answers.length > 1) {
          const answersOptionsIds: number[] = answers.map((answer) => answer?.id_answer_option);
          const correctAnswers = await getCorrectAnswer(parseInt(key), answersOptionsIds);

          const multipleCorrectAnswer = correctAnswers.correctAnswer as FullAnswerOption[];
          const correctAnswersNumber = multipleCorrectAnswer.length;
          const userAnswersNumber = answers.length;
          const userCorrectAnswersNumber = answers.filter((answer) => answer.correct).length;

          if (
            correctAnswersNumber === userAnswersNumber &&
            correctAnswersNumber === userCorrectAnswersNumber
          ) {
            goodAnswers++;
          }
        } else {
          if (answers[0].correct) {
            goodAnswers++;
          }
        }
      }

      if (questionsNumber) {
        const scorePercentage = parseFloat(((goodAnswers / questions.length) * 100).toFixed(1));
        setScorePercentage(scorePercentage);
        return scorePercentage;
      }
    }
    return 0;
  }

  return (
    <StatisticsContext.Provider
      value={{
        scorePercentage,
        progressionPercentage,
        getProgressionPercentageByFormation,
        getScorePercentageByFormation,
      }}>
      {children}
    </StatisticsContext.Provider>
  );
};

export { StatisticsProvider, StatisticsContext };
