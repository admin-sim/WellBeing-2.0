import React, { useState } from "react";
import PageHeader from "../../../components/PageHeader";
import { Button, Col, Row } from "antd";
import PatientTrackRecords from "./PatientTrackRecords";
import InPatient from "./InPatient";
import DayCare from "./DayCare";
import Emergency from "./Emergency";
import { isMobile } from "react-device-detect";

function PatientTrackingBoard() {
  const [activeButtons, setActiveButtons] = useState({
    PatientTrackRecords: false,
    InPatient: false,
    DayCare: false,
    Emergency: false,
  });

  const handleButtonClick = (buttonName) => {
    setActiveButtons((prev) => ({
      [buttonName]: !prev[buttonName],
    }));
  };

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "white",
        minHeight: "max-content",
        borderRadius: "10px",
      }}
    >
      <PageHeader title={"Information Tracking Board"} button={false} />
      <Row
        style={{
          border: "2px solid lavender",
          margin: "0.5rem 0",
          borderRadius: "0.5rem",
          height: isMobile ? "auto" : "3rem",
          width: "100%",
          textAlign: "center",
          padding: isMobile ? "0.5rem 0rem" : "0rem 3rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: isMobile ? "start" : "center",
          flexDirection: isMobile && "column",
        }}
        gutter={32}
      >
        <Col style={isMobile && { marginTop: "0rem" }}>
          <Button
            size="middle"
            type={activeButtons.PatientTrackRecords ? "primary" : "default"}
            style={{ borderRadius: "1rem" }}
            onClick={() => handleButtonClick("PatientTrackRecords")}
          >
            <strong>Patient Track Records</strong>
          </Button>
        </Col>
        <Col style={isMobile && { marginTop: "0.5rem" }}>
          <Button
            size="middle"
            type={activeButtons.InPatient ? "primary" : "default"}
            style={{ borderRadius: "1rem" }}
            onClick={() => handleButtonClick("InPatient")}
          >
            <strong> InPatient</strong>
          </Button>
        </Col>
        <Col style={isMobile && { marginTop: "0.5rem" }}>
          <Button
            size="middle"
            type={activeButtons.DayCare ? "primary" : "default"}
            style={{ borderRadius: "1rem" }}
            onClick={() => handleButtonClick("DayCare")}
          >
            <strong>Day Care</strong>
          </Button>
        </Col>
        <Col style={isMobile && { marginTop: "0.5rem" }}>
          <Button
            size="middle"
            type={activeButtons.Emergency ? "primary" : "default"}
            style={{ borderRadius: "1rem" }}
            onClick={() => handleButtonClick("Emergency")}
          >
            <strong>Emergency</strong>
          </Button>
        </Col>
      </Row>
      {activeButtons?.PatientTrackRecords && <PatientTrackRecords />}
      {activeButtons?.InPatient && <InPatient />}
      {activeButtons?.DayCare && <DayCare />}
      {activeButtons?.Emergency && <Emergency />}
    </div>
  );
}

export default PatientTrackingBoard;
