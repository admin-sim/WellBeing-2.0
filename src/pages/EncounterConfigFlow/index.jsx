import React, { useState } from "react";
import { Tabs } from "antd";
import PatientSearch from "./PatientSearch";
import Encounter from "./Encounter";

const { TabPane } = Tabs;

const EncounterConfigFlow = () => {
  // State to manage the active vertical tab
  const [activeVerticalKey, setActiveVerticalKey] = useState("1");

  // Data for vertical tabs and corresponding horizontal tabs
  const tabsData = {
    1: [
        {
          key: "1-1",
          title: "Patient Search",
          content: <PatientSearch />,
        },
        {
          key: "1-2",
          title: "Encounter",
          content: <Encounter />,
        },
      ],
    2: [
      {
        key: "2-1",
        title: "Horizontal Tab 2-1",
        content: "Content of Horizontal Tab 2-1",
      },
      {
        key: "2-2",
        title: "Horizontal Tab 2-2",
        content: "Content of Horizontal Tab 2-2",
      },
    ],
    3: [
      {
        key: "3-1",
        title: "Horizontal Tab 3-1",
        content: "Content of Horizontal Tab 3-1",
      },
      {
        key: "3-2",
        title: "Horizontal Tab 3-2",
        content: "Content of Horizontal Tab 3-2",
      },
    ],
  };

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
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      {/* Vertical Tabs */}
      <Tabs
        tabPosition="left"
        onChange={(key) => setActiveVerticalKey(key)}
        style={{ width: 200 }}
      >
        <TabPane tab="Revisit" key="1" />
        <TabPane tab="WalkIn Tab " key="2" />
        <TabPane tab="OP" key="3" />
      </Tabs>

      {/* Horizontal Tabs */}
      <div style={{ flex: 1, padding: "0 0px" }}>
        {" "}
        {/* Further reduced padding */}
        <Tabs type="card">
          {tabsData[activeVerticalKey]?.map((tab) => (
            <TabPane tab={tab.title} key={tab.key}>
              {tab.content}
            </TabPane>
          ))}
        </Tabs>
      </div>
    </div>
    </div>
  );
};

export default EncounterConfigFlow;
