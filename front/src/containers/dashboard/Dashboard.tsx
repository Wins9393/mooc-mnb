import { Card, Col, Row } from "antd";
import { Link } from "react-router-dom";

export function Dashboard() {
  return (
    <>
      <Row gutter={[32, 32]}>
        <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8}>
          <Link to="/dashboard/users">
            <Card
              hoverable
              styles={{
                body: {
                  maxHeight: "148px",
                  height: "148px",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                },
              }}>
              <h2>Tous les utilisateurs</h2>
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8}>
          <Card
            hoverable
            styles={{
              body: {
                maxHeight: "148px",
                height: "148px",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
              },
            }}>
            <h2>Toutes les formations</h2>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8}>
          <Link to="/dashboard/create-formation">
            <Card
              hoverable
              styles={{
                body: {
                  maxHeight: "148px",
                  height: "148px",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                },
              }}>
              <h2>Créer une formation</h2>
            </Card>
          </Link>
        </Col>
      </Row>
    </>
  );
}
