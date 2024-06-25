import { useContext, useEffect } from "react";
import { DashboardContext } from "../../contexts/DashboardContext";
import { useParams } from "react-router-dom";
import { MainContext } from "../../contexts/MainContext";
import { Card, Col, Row } from "antd";
import { StatsByFormationByUser } from "../../components/dashboard-components/StatsByFormationByUser";

export function OneUserStats() {
  const dashboardContext = useContext(DashboardContext);
  if (!dashboardContext) return;
  const { oneUser, getOneUser } = dashboardContext;

  const mainContext = useContext(MainContext);
  if (!mainContext) return;
  const { formations } = mainContext;

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getOneUser(parseInt(id));
      console.log("ONE USER: ", oneUser);
    }
  }, [id]);

  return (
    <Row gutter={[32, 32]}>
      {formations.map((formation) => {
        return (
          <Col key={formation.id} xs={24} sm={12}>
            <StatsByFormationByUser formation={formation} idUser={id ? parseInt(id) : undefined} />
          </Col>
        );
      })}
      <Col xs={24}>
        <Card title={"Statistiques globales"} styles={{ body: { height: 256, padding: 0 } }}>
          {" "}
          {/* <img
              src={`${import.meta.env.VITE_API_URL}/public/${formation.cover_path}`}
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.2 }}
            /> */}
        </Card>
      </Col>
    </Row>
  );
}
