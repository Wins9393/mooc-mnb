import { Card, Progress } from "antd";
import {
  ContentsByFormation,
  Formation,
  QuestionFromDB,
  UserAnswer,
  UserProgression,
} from "../../types/types";
import { useContext, useEffect, useState } from "react";
import { StatisticsContext } from "../../contexts/StatisticsContext";
import { MainContext } from "../../contexts/MainContext";

interface StatsByFormationByUserInterface {
  formation: Formation;
  idUser: number | undefined;
}

export const StatsByFormationByUser = ({ formation, idUser }: StatsByFormationByUserInterface) => {
  const mainContext = useContext(MainContext);
  const statiscticsContext = useContext(StatisticsContext);

  if (!mainContext || !statiscticsContext) return;

  const {
    getContentsByFormationId,
    getUserProgressionByUser,
    getUserAnswersByFormationByUserId,
    getQuestionsByFormation,
  } = mainContext;

  const { getProgressionPercentageByFormation, getScorePercentageByFormation } = statiscticsContext;

  const [progressionPercentage, setProgressionPercentage] = useState<number>(0);
  const [scorePercentage, setScorePercentage] = useState<number>(0);
  const [totalUserAnswersByFormation, setTotalUserAnswersByFormation] = useState<
    UserAnswer[] | undefined
  >(undefined);
  const [totalQuestionsByFormation, setTotalQuestionsByFormation] = useState<
    QuestionFromDB[] | undefined
  >(undefined);
  const [userProgression, setUserProgression] = useState<UserProgression[] | undefined>(undefined);
  const [contentsByFormation, setContentsByFormation] = useState<ContentsByFormation | undefined>(
    undefined
  );
  // const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (idUser && formation.id) {
      // setLoading(true);
      Promise.all([
        getUserProgressionByUser(idUser),
        getContentsByFormationId(formation.id),
        getUserAnswersByFormationByUserId(idUser, formation.id),
        getQuestionsByFormation(formation.id),
      ])
        .then(
          ([
            userProgressionResult,
            contentsByFormationResult,
            userAnswersResult,
            questionsResult,
          ]) => {
            setUserProgression(userProgressionResult);
            setContentsByFormation(contentsByFormationResult);
            setTotalUserAnswersByFormation(userAnswersResult);
            setTotalQuestionsByFormation(questionsResult);
            // setLoading(false);
          }
        )
        .catch((error) => {
          // setLoading(false);
          console.log(error);
        });
    }
  }, [formation, idUser]);

  useEffect(() => {
    if (userProgression && contentsByFormation && formation.id) {
      getProgressionPercentageByFormation(userProgression, contentsByFormation, formation.id).then(
        (progressPercentageTmp) => {
          setProgressionPercentage(progressPercentageTmp);
        }
      );
    }
  }, [userProgression, contentsByFormation, formation]);

  useEffect(() => {
    if (totalUserAnswersByFormation && totalQuestionsByFormation) {
      getScorePercentageByFormation(totalUserAnswersByFormation, totalQuestionsByFormation).then(
        (scorePercentageTmp) => {
          setScorePercentage(scorePercentageTmp);
        }
      );
    }
  }, [totalQuestionsByFormation, totalUserAnswersByFormation]);

  return (
    <Card
      title={formation.title}
      styles={{ body: { height: 256, padding: 0, position: "relative" } }}>
      {" "}
      <img
        src={`${import.meta.env.VITE_API_URL}/public/${formation.cover_path}`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.2,
          position: "absolute",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}>
          <h3>Progression</h3>
          <Progress type="circle" percent={progressionPercentage} />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}>
          <h3>Score</h3>
          <Progress type="circle" percent={scorePercentage} />
        </div>
      </div>
    </Card>
  );
};
