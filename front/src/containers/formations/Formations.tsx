import { useContext } from "react";
import { MainContext } from "../../contexts/MainContext";
import { FormationItem } from "../../components/formation-item/FormationItem";
import { Formation } from "../../types/types";
import "./formations.css";

export function Formations() {
  const mainContext = useContext(MainContext);
  if (!mainContext) return;
  const { formations } = mainContext;

  return (
    <div className="formations__container">
      {formations
        ? formations.map((formation: Formation) => {
            if (formation.published) {
              return <FormationItem key={formation.id} formation={formation} />;
            }
          })
        : "Pas de formations"}
    </div>
  );
}
