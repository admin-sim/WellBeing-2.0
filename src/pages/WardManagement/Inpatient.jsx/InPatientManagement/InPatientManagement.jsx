import {
  AppstoreOutlined,
  BarsOutlined,
  DownOutlined,
  StopOutlined,
} from "@ant-design/icons";
import "./style.css";

import {
  Button,
  Carousel,
  Col,
  Collapse,
  ConfigProvider,
  Divider,
  Dropdown,
  Layout,
  Menu,
  Row,
  Segmented,
  Space,
  Tag,
  message,
} from "antd";
import Search from "antd/es/input/Search";
import Title from "antd/es/typography/Title";

import React, { useEffect, useState } from "react";
import CustomTable from "../../../../components/customTable";

import WardBed from "./WardBed";
import { CgMoreO } from "react-icons/cg";
import { TfiMoreAlt } from "react-icons/tfi";

function InPatientManagement() {
  const [view, setView] = useState("");

  const handleMenuClick = (e) => {
    console.log("click", e);
  };
  const items = [
    {
      label: "First Floor",
      key: "1",
    },
    {
      label: "Second Floor",
      key: "2",
    },
    {
      label: "Third Floor",
      key: "3",
      icon: <StopOutlined />,
      disabled: true,
    },
  ];

  const femaleBeds = [
    {
      id: 1,
      name: "FWFF1",
      status: "available",
      patientName: "",
      uhId: "",
      age: "",
      ward: "Female Ward First Floor",
      gender: "",
    },
    {
      id: 2,
      name: "FWFF2",
      status: "occupied",
      patientName: "Radha",
      uhId: "COH/001",
      age: "31Y 4M 14D",
      ward: "Female Ward First Floor",
      gender: "Female",
    },

    {
      id: 3,
      name: "FWFF3",
      status: "available",
      patientName: "",
      uhId: "",
      age: "",
      ward: "Female Ward First Floor",
      gender: "",
    },
    {
      id: 4,
      ward: "Female Ward First Floor",
      name: "FWFF4",
      status: "occupied",
      patientName: "Pooja",
      uhId: "COH/002",
      age: "31Y 4M 14D",
      gender: "Female",
    },
    {
      ward: "Female Ward First Floor",
      id: 5,
      name: "FWFF5",
      status: "occupied",
      patientName: "Shruthi",
      uhId: "COH/003",
      age: "31Y 4M 14D",
      gender: "Female",
    },
    {
      id: 6,
      name: "FWFF6",
      status: "available",
      patientName: "",
      uhId: "",
      ward: "Female Ward First Floor",
      age: "",
      gender: "",
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const renderBedCards = () => (
    <Row justify="center">
      <Col xs={24}>
        <Row gutter={[32, 32]} justify="start">
          {femaleBeds.map((bed) => (
            <WardBed key={bed.id} bed={bed} /> // Pass the bed as a prop
          ))}
        </Row>
      </Col>
    </Row>
  );

  const renderAwaitingPatients = () => (
    <div>
      {femaleBeds.map((bed) => (
        <Button
          key={bed.id}
          type="dashed"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "0.5rem 0",
            width: "100%",
          }}
        >
          <span>{bed.patientName}</span>
          <Dropdown
            arrow
            overlay={
              <Menu>
                <Menu.Item key="1" onClick={() => alert("clicked 1st option")}>
                  Option 1
                </Menu.Item>
                <Menu.Item key="2">Option 2</Menu.Item>
                <Menu.Item key="3" onClick={() => alert("clicked 3rd option")}>
                  Option 3
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <TfiMoreAlt style={{ cursor: "pointer" }} />
          </Dropdown>
        </Button>
      ))}
    </div>
  );

  return (
    <>
      <Layout
        style={{
          backgroundColor: "white",
          height: "auto",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            width: "100%",
            minHeight: "max-content",
            borderRadius: "10px",
          }}
        >
          <Row
            style={{
              padding: "0.5rem 2rem 0.5rem 2rem",
              backgroundColor: "#40A2E3",
              borderRadius: "10px 10px 0px 0px ",
            }}
          >
            <Col span={16}>
              <Title
                level={4}
                style={{
                  color: "white",
                  fontWeight: 500,
                  margin: 0,
                  paddingTop: 0,
                }}
              >
                In-Patient Management
              </Title>
            </Col>
          </Row>
        </div>
        <Row
          style={{
            padding: "1rem 2rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Col span={6}>
            <Segmented
              defaultValue="Tabular"
              options={[
                {
                  label: "Tabular",
                  value: "Tabular",
                  icon: <BarsOutlined />,
                },
                {
                  label: "Pictorial",
                  value: "Pictorial",
                  icon: <AppstoreOutlined />,
                },
              ]}
              // value={view}
              onChange={(value) => {
                setView(value);
              }}
            />
          </Col>
          <Col span={12}>
            <Search
              placeholder="Search Patients"
              // onSearch={onSearch}
              style={{
                width: "70%",
                marginRight: "2rem",
              }}
            />
            <Dropdown menu={menuProps}>
              <Button>
                <Space>
                  Select Floor
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </Col>
        </Row>
        <Row>
          <div
            style={{
              border: "2px solid lavender",
              margin: "0 1rem",
              borderRadius: "0.5rem",
              height: "5rem",
              width: "100%",
              textAlign: "center",
            }}
          >
            Summary Section
          </div>
        </Row>
        {view === "" || view === "Tabular" ? (
          <CustomTable
            columns={columns}
            dataSource={dataSource}
            actionColumn={false}
          />
        ) : (
          <Row style={{ padding: "0 1rem" }}>
            <Col span={17}>
              <div style={{ overflow: "auto" }}>
                <Collapse defaultActiveKey={["1"]} ghost>
                  <Collapse.Panel header="Female Ward First Floor" key="1">
                    {renderBedCards()}
                  </Collapse.Panel>
                  <Collapse.Panel header="Male Ward First Floor" key="2">
                    {/* Other panels content */}
                  </Collapse.Panel>
                </Collapse>
              </div>
            </Col>
            <Col span={7}>
              <div style={{ width: "100%", marginTop: "2rem" }}>
                <Divider orientation="left">Tasks</Divider>
                <Collapse>
                  <Collapse.Panel
                    header={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>Incoming Transfer Request</span>
                        <Tag color="#2db7f5">{0}</Tag>
                      </div>
                    }
                    key="3"
                  ></Collapse.Panel>
                  <Collapse.Panel
                    header={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>Outgoing Transfer Request</span>
                        <Tag color="#2db7f5">{0}</Tag>
                      </div>
                    }
                    key="4"
                  ></Collapse.Panel>
                </Collapse>
              </div>
              <div style={{ marginTop: "3rem" }}>
                <Divider orientation="left"></Divider>
                <Collapse>
                  <Collapse.Panel
                    header={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>Awaiting Patients</span>
                        <Tag color="#2db7f5">{femaleBeds?.length}</Tag>
                      </div>
                    }
                    key="5"
                  >
                    {renderAwaitingPatients()}
                  </Collapse.Panel>
                </Collapse>
              </div>
            </Col>
          </Row>
        )}
      </Layout>
    </>
  );
}

const columns = [
  {
    title: "Sl No",
    dataIndex: "slno",
    key: "slno",
  },
  {
    title: "UhId",
    dataIndex: "uhid",
    key: "uhid",
  },
  {
    title: "Patient Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Consultant",
    dataIndex: "consultant",
    key: "consultant",
  },
  {
    title: "Ward Category",
    dataIndex: "wardCategory",
    key: "wardCategory",
  },
  {
    title: "Floor",
    dataIndex: "floor",
    key: "floor",
  },
  {
    title: "Room Number",
    dataIndex: "roomNo",
    key: "roomNo",
  },
  {
    title: "Bed Number",
    dataIndex: "bedNo",
    key: "bedNo",
  },
  {
    title: "Occupied From",
    dataIndex: "occupiedFrom",
    key: "occupiedFrom",
  },
  {
    title: "Bed Status",
    dataIndex: "bedStatus",
    key: "bedStatus",
  },
];

const dataSource = [
  {
    key: "1",
    slno: "1",
    uhid: "COH/001",
    name: "Nagaraj",
    consultant: "Dr. Prabhu",
    wardCategory: "General",
    floor: "1",
    roomNo: "5",
    bedNo: "120",
    occupiedFrom: "20/05/2023",
    bedStatus: "vacant",
  },
  {
    key: "2",
    slno: "2",
    uhid: "COH/002",
    name: "Samantha",
    consultant: "Dr. Smith",
    wardCategory: "Pediatric",
    floor: "1",
    roomNo: "8",
    bedNo: "122",
    occupiedFrom: "18/06/2023",
    bedStatus: "occupied",
  },
  {
    key: "3",
    slno: "3",
    uhid: "COH/003",
    name: "John",
    consultant: "Dr. Johnson",
    wardCategory: "Surgical",
    floor: "2",
    roomNo: "12",
    bedNo: "210",
    occupiedFrom: "25/07/2023",
    bedStatus: "vacant",
  },
  {
    key: "4",
    slno: "4",
    uhid: "COH/004",
    name: "Emily",
    consultant: "Dr. Miller",
    wardCategory: "General",
    floor: "2",
    roomNo: "15",
    bedNo: "215",
    occupiedFrom: "30/07/2023",
    bedStatus: "occupied",
  },
  {
    key: "5",
    slno: "5",
    uhid: "COH/005",
    name: "Michael",
    consultant: "Dr. Wilson",
    wardCategory: "Cardiology",
    floor: "3",
    roomNo: "20",
    bedNo: "310",
    occupiedFrom: "10/08/2023",
    bedStatus: "vacant",
  },
  {
    key: "6",
    slno: "6",
    uhid: "COH/006",
    name: "Sophia",
    consultant: "Dr. Brown",
    wardCategory: "Obstetrics",
    floor: "3",
    roomNo: "25",
    bedNo: "315",
    occupiedFrom: "15/08/2023",
    bedStatus: "vacant",
  },
  {
    key: "7",
    slno: "7",
    uhid: "COH/007",
    name: "Matthew",
    consultant: "Dr. Taylor",
    wardCategory: "Pediatric",
    floor: "4",
    roomNo: "30",
    bedNo: "410",
    occupiedFrom: "20/08/2023",
    bedStatus: "occupied",
  },
  {
    key: "8",
    slno: "8",
    uhid: "COH/008",
    name: "Emma",
    consultant: "Dr. Martinez",
    wardCategory: "Surgical",
    floor: "4",
    roomNo: "35",
    bedNo: "415",
    occupiedFrom: "25/08/2023",
    bedStatus: "vacant",
  },
  {
    key: "9",
    slno: "9",
    uhid: "COH/009",
    name: "Alexander",
    consultant: "Dr. Anderson",
    wardCategory: "Orthopedic",
    floor: "5",
    roomNo: "40",
    bedNo: "510",
    occupiedFrom: "01/09/2023",
    bedStatus: "occupied",
  },
  {
    key: "10",
    slno: "10",
    uhid: "COH/010",
    name: "Olivia",
    consultant: "Dr. Garcia",
    wardCategory: "General",
    floor: "5",
    roomNo: "45",
    bedNo: "515",
    occupiedFrom: "05/09/2023",
    bedStatus: "occupied",
  },
  {
    key: "11",
    slno: "11",
    uhid: "COH/011",
    name: "William",
    consultant: "Dr. Lopez",
    wardCategory: "Cardiology",
    floor: "6",
    roomNo: "50",
    bedNo: "610",
    occupiedFrom: "10/09/2023",
    bedStatus: "occupied",
  },
];

export default InPatientManagement;
