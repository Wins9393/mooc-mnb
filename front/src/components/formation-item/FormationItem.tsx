import React, { useContext, useEffect, useState } from "react";
import { FormationItemProps, ProgressionByQuiz, ScoreAndCompletionByFormation } from "../../types/types";
import "./formation-item.css";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../../contexts/MainContext";
import { AuthContext } from "../../contexts/AuthContext";

export const FormationItem: React.FC<FormationItemProps> = ({ formation }) => {
  const [progress, setProgress] = useState<ScoreAndCompletionByFormation | undefined>()
  const [levelProgression, setLevelProgression] = useState<"incomplete" | "complete" | "awarded">("incomplete")
  const navigate = useNavigate();

  const mainContext = useContext(MainContext)
  if(!mainContext) return null

  const authContext = useContext(AuthContext)
  if(!authContext) return null

  const {getProgressionByFormation} = mainContext
  const {user} = authContext

  function displayFormationProgression(progress: ScoreAndCompletionByFormation){
    const incomplete = progress.quizzes_completion.some((qc: ProgressionByQuiz) => qc.complete === false)
    const complete = progress.quizzes_completion.every((qc: ProgressionByQuiz) => qc.complete === true) && progress.total_quizzes === progress.quizzes_completion.length
    const awarded = progress.quizzes_completion.every((qc: ProgressionByQuiz) => qc.score === 100) && complete

    awarded ? setLevelProgression("awarded") : complete ? setLevelProgression("complete") : setLevelProgression("incomplete")
    console.log("incomplete", incomplete, "complete", complete, "awarded", awarded)
  }

  useEffect(() => {
    if(user){
      async function getProgression(userId: number, formationId: number){
        const progressData = await getProgressionByFormation(userId, formationId)
        setProgress(progressData)
      }

      getProgression(user.id, formation.id)
    }
  }, [user?.id, formation.id])

  useEffect(() => {
    console.log("progress", progress)
    if(progress){
      displayFormationProgression(progress)

    }
  }, [progress])

  return (
    <div className="formationItem__card">
      <p style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(-45deg)", fontSize: "6rem", fontWeight: "bolder", color: "#000", WebkitTextStroke: `2px ${levelProgression === "awarded" ? ("var(--validate)") : levelProgression === "complete" ? ("#fff") : ("var(--danger)")}`}}>{levelProgression}</p>
      <img
        className="formationItem__card--imageCover"
        src={`${import.meta.env.VITE_API_URL}/public/${formation.cover_path}`}
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
