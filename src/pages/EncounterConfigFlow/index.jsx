import React, { useState, useEffect } from "react";
import { Tabs, Card } from "antd";
import {
  UserOutlined,
  ScheduleOutlined,
  MedicineBoxOutlined,
  HomeOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import PatientSearch from "./PatientSearch";
import Encounter from "./Encounter";
import AppointmentSearch from "./Appointment";
import PatientRegistration from "./PatientRegistration";
import { useLocation } from "react-router";
import VisitModal from "../Patient/NewVisit/visitModal";

const { TabPane } = Tabs;

const EncounterConfigFlow = () => {
  const location = useLocation();
  const [activeVerticalKey, setActiveVerticalKey] = useState("1");
  const [activeHorizontalKey, setActiveHorizontalKey] = useState("1-1");
  const [visitModalData, setVisitModalData] = useState(null);

  useEffect(() => {
    if (location.state) {
      setActiveVerticalKey(location.state.activeVerticalKey);
      setActiveHorizontalKey(location.state.activeHorizontalKey);
      setVisitModalData(location.state);
    }
  }, [location.state]);

  const tabsData = {
    1: [
      { key: "1-1", title: "Appointment Search", content: <AppointmentSearch /> },
      { key: "1-2", title: "Encounter", content: <Encounter />, disabled: true },
    ],
    2: [
      { key: "2-1", title: "Patient Search", content: <PatientSearch /> },
      { key: "2-2", title: "Encounter", content: <Encounter details={visitModalData} />, disabled: true },
    ],
    3: [
      { key: "3-1", title: "Patient Registration", content: <PatientRegistration /> },
      { key: "3-2", title: "Encounter", content: <Encounter />, disabled: true },
    ],
    4: [
      { key: "4-1", title: "Patient Search", content: <PatientSearch /> },
      { key: "4-2", title: "Encounter", content: <Encounter />, disabled: true },
    ],
    5: [
      { key: "5-1", title: "Patient Registration", content: <PatientRegistration /> },
      { key: "5-2", title: "Encounter", content: <Encounter />, disabled: true },
      { key: "5-3", title: "Billing", content: "Billing", disabled: true },
    ],
    6: [
      { key: "6-1", title: "Patient Registration", content: <PatientRegistration /> },
      { key: "6-2", title: "Encounter", content: <Encounter />, disabled: true },
      { key: "6-3", title: "Billing", content: "Billing", disabled: true },
    ],
  };

  return (
    <div className="encounter-container">
      {/* Vertical Tabs */}
      <div className="vertical-tabs">
        <Tabs
          tabPosition="left"
          activeKey={activeVerticalKey}
          onChange={(key) => {
            setActiveVerticalKey(key);
            setActiveHorizontalKey(`${key}-1`);
          }}
        >
          <TabPane
            tab={
              <span>
                <ScheduleOutlined /> Appointment Patients
              </span>
            }
            key="1"
          />
          <TabPane
            tab={
              <span>
                <MedicineBoxOutlined /> Ambulatory Revisit
              </span>
            }
            key="2"
          />
          <TabPane
            tab={
              <span>
                <UserOutlined /> Walk-In Patient
              </span>
            }
            key="3"
          />
          <TabPane
            tab={
              <span>
                <HomeOutlined /> InPatient Revisit
              </span>
            }
            key="4"
          />
          <TabPane
            tab={
              <span style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <span>
                  <FileTextOutlined /> General Out Patient
                </span>
                <span>Department</span>
              </span>
            }
            key="5"
          />
          <TabPane
            tab={
              <span>
                <UserOutlined /> WalkInCLient
              </span>
            }
            key="6"
          />
        </Tabs>
      </div>

      {/* Horizontal Tabs */}
      <div className="horizontal-tabs">
        <Tabs
          type="card"
          activeKey={activeHorizontalKey}
          onChange={(key) => setActiveHorizontalKey(key)}
        >
          {tabsData[activeVerticalKey]?.map((tab) => (
            <TabPane tab={tab.title} key={tab.key} disabled={tab.disabled}>
              <Card className="tab-content">{tab.content}</Card>
            </TabPane>
          ))}
        </Tabs>
      </div>

      {/* CSS */}
      <style jsx>{`
        .encounter-container {
          display: flex;
          gap: 16px;
          min-height: 100vh;
          background-color: #f0f2f5;
          padding: 24px;
        }

        .vertical-tabs {
          width: 250px;
          background-color: #fff;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .horizontal-tabs {
          flex-grow: 1;
          background-color: #fff;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          min-width: 300px;
        }

        .tab-content {
          padding: 16px;
        }

        @media (max-width: 768px) {
          .encounter-container {
            flex-direction: column;
            padding: 16px;
          }

          .vertical-tabs {
            width: 100%;
            padding: 8px;
            margin-bottom: 16px;
          }

          .horizontal-tabs {
            width: 100%;
            padding: 16px;
          }
        }

        @media (max-width: 480px) {
          .encounter-container {
            padding: 8px;
          }

          .vertical-tabs {
            padding: 4px;
          }

          .horizontal-tabs {
            padding: 8px;
          }

          .tab-content {
            padding: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default EncounterConfigFlow;
