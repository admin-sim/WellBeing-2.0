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
      children: `Content 2`,
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
        minHeight: "85vh",
        borderRadius: "10px",
        overflow: "hidden",
        padding: "1rem",
      }}
    >
      <Row gutter={32}>
        <Col span={18}>
          <div
            style={{
              padding: "5px 30px",
              borderRadius: "4px",
              margin: "4px 30px",
              display: "flex",
              justifyContent: "space-between",
              boxShadow: "0px 0px 2px 2px rgba(86,144,199,1)",
            }}
          >
            <Row gutter={[16, 16]}>
              <Col span={3}>
                <Avatar
                  shape="square"
                  size={64}
                  src={<img src={male} alt="avatar" />}
                />
              </Col>
            </Row>
            <Row
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
              }}
            >
              <Col span={12}>
                <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                  UHID&nbsp;:
                </span>
                <span>273</span>
              </Col>

              <Col span={12}>
                <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                  Name&nbsp;:
                </span>
                <span>Nitish</span>
              </Col>
            </Row>
            <Row
              style={{
                display: "flex",
                flexDirection: "column",
                // justifyContent: "space-evenly",
              }}
            >
              <Col span={12}>
                <span style={{ fontWeight: "bold" }}>Gender&nbsp;:&nbsp;</span>
                <span>Male</span>
              </Col>

              <Col span={12}>
                <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                  VisitId&nbsp;:
                </span>
                <span>15</span>
              </Col>
            </Row>
            <Row
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
              }}
            >
              <Col span={12}>
                <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                  Age&nbsp;:
                </span>
                <span>28</span>
              </Col>
              <Col span={12}>
                <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                  Dob&nbsp;:
                </span>
                <span>27/09/1995</span>
              </Col>
            </Row>
          </div>
        </Col>
        <Col
          span={6}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            type="default"
            style={{ display: "flex", alignItems: "center" }}
            danger
            size="large"
          >
            End Consultation{" "}
            <RxExit style={{ marginLeft: "5px", fontSize: "1.3rem" }} />
          </Button>
        </Col>
      </Row>
      <div style={{ display: "flex", marginTop: "2rem" }}>
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
