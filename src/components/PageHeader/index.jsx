import React from "react";
import { Row, Col, Typography, Button } from "antd";

const { Title } = Typography;

const PageHeader = ({ title, buttonLabel, buttonIcon, onButtonClick }) => {
  return (
    <Row
      style={{
        padding: "0.5rem 1.5rem 0.5rem 1.5rem",
        backgroundColor: "#40A2E3",
        borderRadius: "10px 10px 0px 0px",
      }}
    >
      <Col
        span={24}
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Title
          level={4}
          style={{
            color: "white",
            fontWeight: 500,
            margin: 0,
            paddingTop: 0,
          }}
        >
          {title}
        </Title>

        <Button
          size="middle"
          className="dfja"
          icon={buttonIcon}
          onClick={onButtonClick}
        >
          {buttonLabel}
        </Button>
      </Col>
    </Row>
  );
};

export default PageHeader;
