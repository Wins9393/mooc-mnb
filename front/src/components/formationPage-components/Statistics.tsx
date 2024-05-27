import { useContext, useEffect, useState } from "react";
import { MainContext } from "../../contexts/MainContext";
import { FullAnswerOption, QuestionFromDB, UserAnswer, UserProgression } from "../../types/types";

interface StatisticsInterface {
  idFormation: number | null;
}

export function Statistics({ idFormation }: StatisticsInterface) {
  const [scorePercentage, setScorePercentage] = useState<number>(0);
  const [progressionPercentage, setProgressionPercentage] = useState<number>(0);

  const mainContext = useContext(MainContext);
  if (!mainContext) return;
  const {
    getCorrectAnswer,
    userProgression,
    contentsByFormation,
    totalUserAnswersByFormation,
    totalQuestionsByFormation,
  } = mainContext ?? {};

  useEffect(() => {
    if (userProgression) {
      getProgressionPercentageByFormation(userProgression);
    }
  }, [userProgression, contentsByFormation]);

  useEffect(() => {
    if (totalUserAnswersByFormation && totalQuestionsByFormation) {
      getScorePercentageByFormation(totalUserAnswersByFormation, totalQuestionsByFormation);
    }
  }, [totalQuestionsByFormation, totalUserAnswersByFormation]);

  async function getProgressionPercentageByFormation(
    userProgression: UserProgression[]
  ): Promise<void> {
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
    }
  }

  async function getScorePercentageByFormation(
    userAnswers: UserAnswer[],
    questions: QuestionFromDB[]
  ): Promise<void> {
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
      }
    }
  }

  return (
    <>
      <div className="formationPage__title">
        <h2 className="title-h2">Statistiques</h2>
      </div>
      <div className="formationPage__score-wrapper">
        <div className="score-wrapper__progression-container">
          <p>Progression:</p>
          <div className="score-wrapper__progress-bar-progression">
            <p style={{ width: `${progressionPercentage}%` }}>{progressionPercentage}%</p>
          </div>
        </div>
        <div className="score-wrapper__score-container">
          <p>Score:</p>
          <div className="score-wrapper__progress-bar-score">
            <p style={{ width: `${scorePercentage}%` }}>{scorePercentage}%</p>
          </div>
        </div>
      </div>
    </>
  );
}
