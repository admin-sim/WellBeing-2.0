import { Avatar, Button, Col, Row, Tabs } from "antd";
import React from "react";
import male from "../../../assets/m.png";
import { RxExit } from "react-icons/rx";

import ChiefComplaint from "../Components/ChiefComplaint.jsx";
import MedicalHistory from "../Components/MedicalHistory.jsx";
import SurgicalHistory from "../Components/SurgicalHistory.jsx";
import FamilyHistory from "../Components/FamilyHistory.jsx";
import SocialHistory from "../Components/SocialHistory.jsx";
import Allergy from "../Components/Allergy.jsx";
import PatientHeader from "../../../components/PatientHeader/index.jsx";
import VitalSigns from "../Components/VitalSigns.jsx";
import PhysicalExamination from "../Components/PhysicalExamination.jsx";
import ProvisionalDiagnosis from "../Components/ProvisionalDiagnosis.jsx";
import Prescription from "../Components/Prescription.jsx";
import Investigation from "../Components/Investigation.jsx";

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
              children: <VitalSigns />,
            },
            {
              label: `Physical Examination`,
              key: 12,
              children: <PhysicalExamination />,
            },
          ]}
        />
      ),
    },
    {
      label: `Provisional Diagnosis`,
      key: 3,
      children: (
        <Tabs
          tabPosition="left"
          items={[
            {
              label: `Provisional Diagnosis`,
              key: 11,
              children: <ProvisionalDiagnosis />,
            },
          ]}
        />
      ),
    },
    {
      label: `Investigation`,
      key: 4,
      children: (
        <Tabs
          tabPosition="left"
          items={[
            {
              label: `Investigation`,
              key: 11,
              children: <Investigation />,
            },
          ]}
        />
      ),
    },
    {
      label: `Prescription`,
      key: 5,
      children: (
        <Tabs
          tabPosition="left"
          items={[
            {
              label: `Prescription`,
              key: 11,
              children: <Prescription />,
            },
          ]}
        />
      ),
    },
    {
      label: `Diagnosis & Discharge`,
      key: 6,
      children: `Content 6`,
    },
    // {
    //   label: `Diagnosis & Discharge`,
    //   key: 7,
    //   children: `Content 6`,
    // },
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
      <div style={{ marginTop: "1.5rem" }}>
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
