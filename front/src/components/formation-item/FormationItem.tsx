import React from "react";
import { FormationItemProps } from "../../types/types";
import "./formation-item.css";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

export const FormationItem: React.FC<FormationItemProps> = ({ formation }) => {
  const navigate = useNavigate();
  return (
    <div className="formationItem__card">
      <img
        className="formationItem__card--imageCover"
        src={`${import.meta.env.VITE_API_URL}/public/${formation.cover_path}`}
        alt={formation.cover_path}
      />
      <div className="formationItem__card--overlay">
        <h2 className="formationItem__card--title">{formation.title}</h2>
        <p className="formationItem__card--info">
          {formation.videos.length > 1
            ? `${formation.videos.length} vidéos`
            : `${formation.videos.length} vidéo`}
        </p>
      </div>
      <Button
        className="button formationItem__card--button"
        onClick={() => navigate(`/formation/${formation.id}`)}>
        Commencer
      </Button>
    </div>
  );
};
