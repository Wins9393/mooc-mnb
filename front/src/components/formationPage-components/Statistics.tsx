import { useContext, useEffect, useState } from "react";
import { MainContext } from "../../contexts/MainContext";
import { StatisticsContext } from "../../contexts/StatisticsContext";

interface StatisticsInterface {
  idFormation: number | null;
}

export function Statistics({ idFormation }: StatisticsInterface) {
  const mainContext = useContext(MainContext);
  if (!mainContext) return;
  const {
    userProgression,
    contentsByFormation,
    totalUserAnswersByFormation,
    totalQuestionsByFormation,
  } = mainContext ?? {};

  const statiscticsContext = useContext(StatisticsContext);
  if (!statiscticsContext) return;
  const {
    getProgressionPercentageByFormation,
    getScorePercentageByFormation,
    // progressionPercentage,
    // scorePercentage,
  } = statiscticsContext;

  const [progressionPercentage, setProgressionPercentage] = useState<number>(0);
  const [scorePercentage, setScorePercentage] = useState<number>(0);

  useEffect(() => {
    if (userProgression && contentsByFormation && idFormation) {
      getProgressionPercentageByFormation(userProgression, contentsByFormation, idFormation).then(
        (progressPercentageTmp) => {
          setProgressionPercentage(progressPercentageTmp);
        }
      );
    }
  }, [userProgression, contentsByFormation, idFormation]);

  useEffect(() => {
    if (totalUserAnswersByFormation && totalQuestionsByFormation) {
      getScorePercentageByFormation(totalUserAnswersByFormation, totalQuestionsByFormation).then(
        (scorePercentageTmp) => {
          setScorePercentage(scorePercentageTmp);
        }
      );
    }
  }, [totalQuestionsByFormation, totalUserAnswersByFormation, idFormation]);

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
