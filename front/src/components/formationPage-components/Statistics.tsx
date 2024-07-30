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
  const { getProgressionPercentageByFormation, getScorePercentageByFormation } = statiscticsContext;

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
      <div className="formationPage__stats-wrapper">
        <div className="progressBar-wrapper progression-container">
          <p>Progression:</p>
          <div className="progressBar progressBar__progression">
            <span style={{ width: `${progressionPercentage}%` }}></span>
            <p>{progressionPercentage}%</p>
          </div>
        </div>
        <div className="progressBar-wrapper score-container">
          <p>Score:</p>
          <div className="progressBar progressBar__score">
            <span style={{ width: `${scorePercentage}%` }}></span>
            <p>{scorePercentage}%</p>
          </div>
        </div>
      </div>
    </>
  );
}
