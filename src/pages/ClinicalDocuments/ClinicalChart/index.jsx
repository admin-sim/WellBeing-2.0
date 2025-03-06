import { Avatar, Badge, Button, Col, Row, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import male from "../../../assets/m.png";
import { RxExit } from "react-icons/rx";
import { useLocation } from "react-router-dom";
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
import {
  urlGetPatientHeaderDetails,
  urlGetAllPatientComplaints,
} from "../../../../endpoints";
import customAxios from "../../../components/customAxios/customAxios";
import dayjs from "dayjs";
import { useNavigate } from "react-router";
import { asyncThunkCreator } from "@reduxjs/toolkit";

function ClinicalChart() {
  const location = useLocation();
  const Patient = location?.state?.record;
  const [patientData, setPatientData] = useState()
  const [initialData, setInitialData] = useState({
    ChiefList: [],
    MedicalHistoryList: [],
    SurgicalHistoryList: [],
    FamilyHistoryList: [],
    SocialHistoryList: [],
    NewAllergyList: [],
    PatientVital: [],
    ClinicalAdvices: []
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await customAxios.get(
          `${urlGetAllPatientComplaints}?PatientId=${Patient.PatientId}&EncounterId=${Patient.Encounter}`
        );
        if (response.status === 200 && response.data.data != null) {
          const detailsheader = response.data.data;
          setInitialData(detailsheader);
        }
      } catch (error) { }
    };
    fetch();
  }, []);

  useEffect(() => {
    const fetchDataHeader = async () => {
      try {
        const response = await customAxios.get(
          `${urlGetPatientHeaderDetails}?PatientId=${Patient.PatientId}&EncounterId=${Patient.Encounter}`
        );
        if (response.status === 200 && response.data.data != null) {
          const detailsheader = response.data.data.EncounterModel;
          setPatientData(detailsheader);
        }
      } catch (error) { }
    };
    fetchDataHeader();
  }, []);

  const handleUpdate = (value) => {
    setInitialData(value);
  };

  function handleAllery(params) {
    setInitialData(params)
  }

  function handleClinicalAdvices(params) {
    setInitialData(prevState => ({
      ...prevState,
      ClinicalAdvices: params
    }));
  }

  function handleVitals(params) {
    debugger
    setInitialData(prevState => ({
      ...prevState,
      PatientVital: params
    }));
  }

  const clinicalHeaders = [
    {
      label: `Patient Complaint`,
      key: 1,
      children: (
        <Tabs
          tabPosition="left"
          items={[
            {
              label: (
                <Badge dot={initialData.ChiefList.length > 0}>
                  Chief Complaint&nbsp;&nbsp;
                </Badge>
              ),
              key: 1,
              children: (
                <ChiefComplaint
                  Patient={Patient}
                  initialData={initialData}
                  handleUpdate={handleUpdate}
                />
              ),
            },
            {
              label: (
                <Badge dot={initialData.MedicalHistoryList.length > 0}>
                  Medical History&nbsp;&nbsp;
                </Badge>
              ),
              key: 2,
              children: (
                <MedicalHistory
                  Patient={Patient}
                  initialData={initialData}
                  handleUpdate={handleUpdate}
                />
              ),
            },
            {
              label: (
                <Badge dot={initialData.SurgicalHistoryList.length > 0}>
                  Surgical History&nbsp;&nbsp;
                </Badge>
              ),
              key: 3,
              children: (
                <SurgicalHistory
                  Patient={Patient}
                  initialData={initialData}
                  handleUpdate={handleUpdate}
                />
              ),
            },
            {
              label: (
                <Badge dot={initialData.FamilyHistoryList.length > 0}>
                  Family History&nbsp;&nbsp;
                </Badge>
              ),
              key: 4,
              children: (
                <FamilyHistory
                  Patient={Patient}
                  initialData={initialData}
                  handleUpdate={handleUpdate}
                />
              ),
            },
            {
              label: (
                <Badge dot={initialData.SocialHistoryList.length > 0}>
                  Social History&nbsp;&nbsp;
                </Badge>
              ),
              key: 5,
              children: (
                <SocialHistory
                  Patient={Patient}
                  initialData={initialData}
                  handleUpdate={handleUpdate}
                />
              ),
            },

            {
              label: (
                <Badge dot={initialData.NewAllergyList.length > 0}>
                  Allergy&nbsp;&nbsp;
                </Badge>
              ),
              key: 6,
              children: <Allergy Patient={Patient}
                initialData={initialData}
                handleAllery={handleAllery}
                handleUpdate={handleUpdate} />,
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
              label: <Badge dot={initialData.PatientVital.length > 0}>Vital Signs&nbsp;&nbsp;</Badge>,
              key: 11,
              children: <VitalSigns Patient={Patient} initialData={initialData} handleVitals={handleVitals} />,
            },
            {
              label: `Physical Examination`,
              key: 12,
              children: <PhysicalExamination Patient={Patient} />,
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
              label: <Badge dot={initialData.ClinicalAdvices.length > 0}>Provisional Diagnosis&nbsp;&nbsp;</Badge>,
              key: 11,
              children: <ProvisionalDiagnosis Patient={Patient} initialData={initialData} handleClinicalAdvices={handleClinicalAdvices} />,
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
              children: <Investigation Patient={Patient} patientData={patientData} />,
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
              children: <Prescription Patient={Patient} />,
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

  const navigate = useNavigate();

  function EndConsultation() {
    navigate("/ClinicalChartFlow");
  }

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
          <PatientHeader patient={patientData} />
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
            onClick={EndConsultation}
          >
            Back
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
