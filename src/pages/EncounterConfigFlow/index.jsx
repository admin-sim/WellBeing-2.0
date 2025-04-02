import React, { useState, useEffect } from "react";
import { Tabs, Card, Spin } from "antd";
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
import { urlGetWorkFlow, urlWorkFlow } from "../../../endpoints";
import customAxios from "../../components/customAxios/customAxios";

const { TabPane } = Tabs;

const EncounterConfigFlow = () => {
  const location = useLocation();
  const [activeVerticalKey, setActiveVerticalKey] = useState("1");
  const [activeHorizontalKey, setActiveHorizontalKey] = useState("1-1");
  const [visitModalData, setVisitModalData] = useState(null);
  const [tabsData1, setTabsData1] = useState([])
  const [tabsData2, setTabsData2] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (location.state) {
      setActiveVerticalKey(location.state.activeVerticalKey);
      setActiveHorizontalKey(location.state.activeHorizontalKey);
      setVisitModalData(location.state);
    }
  }, [location.state]);

  useEffect(() => {
    setLoading(true)
    fetch()
  }, [])

  async function fetch() {
    try {
      const response = await customAxios.get(urlWorkFlow)
      if (response.status === 200) {
        setTabsData1(response.data.data.WorkFlowModel)
        setTabsData2(response.data.data.WorkFlowScreens)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.error("Failed to fetch:", error);
    }
  }

  function GetView(value) {
    if (value.ScreenId === 2) {
      return <AppointmentSearch />
    } else if (value.ScreenId === 3) {
      return <Encounter />
    } else if (value.ScreenId === 1) {
      return <PatientRegistration />
    } else if (value.ScreenId === 4) {
      return <PatientSearch />
    } else {
      return null
    }
  }

  async function GetWorkFlow(params) {
    try {
      const response = await customAxios.get(`${urlGetWorkFlow}?WorkFlowId=${parseInt(params)}`)
      if (response.status === 200) {
        setTabsData2(response.data.data.WorkFlowScreens)
      }
    } catch (error) {
      setLoading(false)
      console.error("Failed to fetch:", error);
    }
  }

  return (
    <Spin spinning={loading} size="large" tip="Loading...">
      <div className="encounter-container">
        {/* Vertical Tabs (All are enabled) */}
        <div className="vertical-tabs">
          <Tabs tabPosition="left" onChange={GetWorkFlow}>
            {tabsData1?.map((tab) => (
              <Tabs.TabPane
                tab={
                  <span>
                    <HomeOutlined /> {tab.WorkFlowName}
                  </span>
                }
                key={tab.WorkFlowId}
              />
            ))}
          </Tabs>
        </div>

        <div className="horizontal-tabs">
          <Tabs type="card">
            {tabsData2?.map((tab) => (
              <Tabs.TabPane
                tab={tab.ScreenName}
                key={tab.ScreenId}
                disabled={
                  tab.ScreenName === "Encounter" || tab.ScreenName === "Billing"
                } // Disable only these tabs
              >
                <Card className="tab-content">{GetView(tab)}</Card>
              </Tabs.TabPane>
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
            width: auto;
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
    </Spin>
  );
};

export default EncounterConfigFlow;
