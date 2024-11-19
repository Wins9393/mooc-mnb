import React, { useContext, useEffect, useState } from "react";
import {
  FormationItemProps,
  ProgressionByQuiz,
  ScoreAndCompletionByFormation,
} from "../../types/types";
import "./formation-item.css";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../../contexts/MainContext";
import { AuthContext } from "../../contexts/AuthContext";

export const FormationItem: React.FC<FormationItemProps> = ({ formation }) => {
  const [progress, setProgress] = useState<ScoreAndCompletionByFormation | undefined>();
  const [levelProgression, setLevelProgression] = useState<"incomplete" | "complete" | "awarded">(
    "incomplete"
  );
  const navigate = useNavigate();

  const mainContext = useContext(MainContext);
  if (!mainContext) return null;

  const authContext = useContext(AuthContext);
  if (!authContext) return null;

  const { getProgressionByFormation } = mainContext;
  const { user } = authContext;

  function setLevelFormationProgression(progress: ScoreAndCompletionByFormation) {
    const complete =
      progress.quizzes_completion.every((qc: ProgressionByQuiz) => qc.complete === true) &&
      progress.total_quizzes === progress.quizzes_completion.length;
    const awarded =
      progress.quizzes_completion.every((qc: ProgressionByQuiz) => qc.score === 100) && complete;

    awarded
      ? setLevelProgression("awarded")
      : complete
      ? setLevelProgression("complete")
      : setLevelProgression("incomplete");
  }

  useEffect(() => {
    console.log("levelProgression: ", formation.title, levelProgression);
  }, [levelProgression]);

  useEffect(() => {
    if (user && getProgressionByFormation) {
      async function getProgression(userId: number, formationId: number) {
        const progressData = await getProgressionByFormation(userId, formationId);
        setProgress(progressData);
      }

      getProgression(user.id, formation.id);
    }
  }, [user?.id, formation.id, getProgressionByFormation]);

  useEffect(() => {
    if (progress) {
      setLevelFormationProgression(progress);
    }
  }, [progress]);

  return (
    <div className="formationItem__card">
      {levelProgression === "awarded" ? (
        <img
          src="/gold.png"
          style={{
            width: "60px",
            position: "absolute",
            bottom: "-50px",
            right: "8px",
            zIndex: 2,
          }}></img>
      ) : levelProgression === "complete" ? (
        <img
          src="silver.png"
          style={{
            width: "60px",
            position: "absolute",
            bottom: "-50px",
            right: "8px",
            zIndex: 2,
          }}></img>
      ) : (
        ""
      )}
      <img
        className="formationItem__card--imageCover"
        src={`${import.meta.env.VITE_BACK_URL}/public/${formation.cover_path}`}
        alt={formation.cover_path}
      />
      <div className="formationItem__card--overlay">
        <h2 className="formationItem__card--title">{formation.title}</h2>
        <p className="formationItem__card--info">
          {formation.modules.length > 1
            ? `${formation.modules.length} modules`
            : `${formation.modules.length} module`}
        </p>
      </div>
      <Button
        type="primary"
        className="button formationItem__card--button"
        onClick={() => navigate(`/formation/${formation.id}`)}>
        Commencer
      </Button>
    </div>
  );
};
