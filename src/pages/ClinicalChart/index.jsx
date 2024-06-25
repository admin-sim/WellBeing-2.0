import { Avatar, Button, Col, Row, Tabs } from "antd";
import React from "react";
import male from "../../assets/m.png";
import { RxExit } from "react-icons/rx";

import ChiefComplaint from "./Components/ChiefComplaint.jsx";
import MedicalHistory from "./Components/MedicalHistory.jsx";
import SurgicalHistory from "./Components/SurgicalHistory.jsx";
import FamilyHistory from "./Components/FamilyHistory.jsx";
import SocialHistory from "./Components/SocialHistory.jsx";
import Allergy from "./Components/Allergy.jsx";
import PatientHeader from "../../components/PatientHeader/index.jsx";
// import VitalSigns from "./Components/VitalSigns.jsx";

function ClinicalChart() {
  const clinicalHeaders = [
    {
      label: `Patient Complaint`,
      key: 1,
      children: (
        <Tabs
          tabPosition="left"
          items={[
            {
              label: `Chief Complaint`,
              key: 1,
              children: <ChiefComplaint />,
            },
            {
              label: `Medical History`,
              key: 2,
              children: <MedicalHistory />,
            },
            {
              label: `Surgical History`,
              key: 3,
              children: <SurgicalHistory />,
            },
            {
              label: `Family History`,
              key: 4,
              children: <FamilyHistory />,
            },
            {
              label: `Social History`,
              key: 5,
              children: <SocialHistory />,
            },

            {
              label: `Allergy`,
              key: 6,
              children: <Allergy />,
            },
          ]}
        />
      ),
    },
    {
      label: `Vitals & Physical Examination`,
      key: 2,
      children: (
        <Tabs
          tabPosition="left"
          items={[
            {
              label: `Vital Signs`,
              key: 11,
              children: <Allergy />,
            },
            {
              label: `Physical Examination`,
              key: 12,
              children: <MedicalHistory />,
            },
          ]}
        />
      ),
    },
    {
      label: `Provisional Diagnosis`,
      key: 3,
      children: `Content 3`,
    },
    {
      label: `Outreach Data`,
      key: 4,
      children: `Content 4`,
    },
    {
      label: `Prescription & Investigation`,
      key: 5,
      children: `Content 5`,
    },
    {
      label: `Diagnosis & Discharge`,
      key: 6,
      children: `Content 6`,
    },
  ];
  return (
    <div
      style={{
        backgroundColor: "white",
        minHeight: "87vh",
        borderRadius: "10px",
        overflow: "hidden",
        padding: "1rem",
      }}
    >
      <Row
        gutter={32}
        style={{
          display: "flex",
          alignItems: "end",
        }}
      >
        <Col span={20}>
          <PatientHeader />
        </Col>
        <Col
          span={4}
          style={{
            display: "flex",
            alignItems: "end",
            justifyContent: "center",
          }}
        >
          <Button
            type="default"
            style={{ display: "flex", alignItems: "center" }}
            danger
            size="large"
          >
            End Consultation
            <RxExit style={{ marginLeft: "5px", fontSize: "1.3rem" }} />
          </Button>
        </Col>
      </Row>
      <div style={{ display: "flex", marginTop: "1.5rem" }}>
        <Tabs
          defaultActiveKey="1"
          type="card"
          size="small"
          items={clinicalHeaders}
        />
      </div>
    </div>
  );
}

export default ClinicalChart;
