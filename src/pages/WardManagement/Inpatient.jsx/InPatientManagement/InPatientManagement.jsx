import {
  AppstoreOutlined,
  BarsOutlined,
  TabletOutlined,
  PieChartOutlined,
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
  Select,
  Spin,
} from "antd";
import Search from "antd/es/input/Search";
import Title from "antd/es/typography/Title";
import {
  urlGetWardAndBannerData,
  urlGetWardInpatientsDetails,
} from "../../../../../endpoints";
import React, { useEffect, useState } from "react";
import CustomTable from "../../../../components/customTable";
import customAxios from "../../../../components/customAxios/customAxios";
import WardBed from "./WardBed";
import { CgMoreO } from "react-icons/cg";
import { TfiMoreAlt } from "react-icons/tfi";
import Item from "antd/es/list/Item";
import dayjs from "dayjs";

function InPatientManagement() {
  const [view, setView] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [wardDetails, setWardDetails] = useState([]);
  const [locationDropDown, setLocationDropDown] = useState([]);
  const [inPatientDetails, setInPatientDetails] = useState([]);
  const [beds, setBeds] = useState([]);
  const [banner, setBanner] = useState({})

  useEffect(() => {
    setIsLoading(true);
    customAxios.get(urlGetWardInpatientsDetails).then((response) => {
      setLocationDropDown(response.data.data.FacilityDeptServiceLocation);
      setIsLoading(false);
    });
  }, []);

  const handleMenuClick = async (e) => {
    debugger
    setTableLoading(true);
    if (e !== undefined) {
      const response = await customAxios.get(
        `${urlGetWardAndBannerData}?LocationId=${e}&Flag=${1}`
      );
      if (response.data !== null) {
        setTableLoading(false);
        const inPatient = response.data.data.PatientsInBed.map((obj, index) => {
          return { ...obj, key: index + 1 };
        });
        setInPatientDetails(inPatient);
        setBeds(response.data.data.Beds);
        setBanner(response.data.data)
      } else {
        console.log("data is not clear ");
      }
    } else {
      setTableLoading(false);
      console.log("click", e);
    }
  };

  const groupBedsByWard = () => {
    return beds.reduce((groups, bed) => {
      const wardName = bed.WardName || "Unknown Ward";
      if (!groups[wardName]) {
        groups[wardName] = [];
      }
      groups[wardName].push(bed);
      return groups;
    }, {});
  };

  const renderBedCards = () => (
    <Row justify="center">
      <Col xs={24}>
        <Row gutter={[32, 32]} justify="start">
          {beds.map((bed) => (
            <WardBed key={bed.BedID} bed={bed} />
          ))}
        </Row>
      </Col>
    </Row>
  );

  const renderAwaitingPatients = () => (
    <div>
      {beds.map((bed) => (
        <Button
          key={bed.BedID}
          type="dashed"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "0.5rem 0",
            width: "100%",
          }}
        >
          <span>{bed.PatientName}</span>
          <Dropdown
            arrow
            menu={
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

  const groupedBeds = groupBedsByWard();
  const firstWardKey = Object.keys(groupedBeds)[0];

  const IncomingTransfer = () => {
    debugger
  }

  const OutgoingTransfer = () => {
    debugger
  }

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
          <Col span={10}>
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
              onChange={(value) => {
                setView(value);
              }}
            />
          </Col>
          <Col span={8}>
            <Search
              placeholder="Search Patients"
              style={{
                width: "100%",
                marginRight: "2rem",
              }}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Select Floor"
              loading={isLoading}
              onChange={handleMenuClick}
              style={{ width: "100%" }}
              allowClear
            >
              {locationDropDown.map((option) => (
                <Select.Option
                  key={option.FacilityDepartmentServiceLocationId}
                  value={option.FacilityDepartmentServiceLocationId}
                >
                  {option.ServiceLocationName}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row>
          <div
            style={{
              border: "2px solid lavender",
              margin: "0 1rem",
              borderRadius: "0.5rem",
              // height: "5rem",
              width: "100%",
              textAlign: "center",
            }}
          >
            <Row>
              <Col span={12} >
                Total Beds:{banner.TotalBeds}
              </Col>
              <Col span={12}>
                Todays:
              </Col>
            </Row>
            <Row>
              <Col span={3}>
                As on:{dayjs().format('DD-MM-YYYY')}
              </Col>
              <Col span={3} >
                Occupied:{banner.Occupied}
              </Col>
              <Col span={3} >
                Available:{banner.Available}
              </Col>
              <Col span={3}>
                Blocked:{banner.Blocked}
              </Col>
              <Col span={3}>
                New Admission:{banner.NewAdmissionsCount}
              </Col>
              <Col span={3} >
                Discharges:{banner.DischargedPatientsCount}
              </Col>
              <Col span={3} >
                Transfer In:{banner.TransferInCount}
              </Col>
              <Col span={3}>
                Transfer Out:{banner.TransferOutCount}
              </Col>
            </Row>
          </div>
        </Row>
        <br />
        <Row>
          <div
            style={{
              border: "2px solid lavender",
              margin: "0 1rem",
              borderRadius: "0.5rem",
              // height: "5rem",
              width: "100%",
              textAlign: "center",
            }}
          >
            <Row>
              <Col span={3} style={{ backgroundColor: '#C5EBAA' }}>
                Available
              </Col>
              <Col span={3} style={{ backgroundColor: '#FFBABA' }}>
                Occupied
              </Col>
              <Col span={3} style={{ backgroundColor: '#FF8356' }}>
                Blocked
              </Col>
              <Col span={3} style={{ backgroundColor: '#F0A8D0' }}>
                Transfer Requested
              </Col>
              <Col span={3} style={{ backgroundColor: '#D1E9F6' }}>
                Request Confirmed
              </Col>
              <Col span={3} style={{ backgroundColor: '#CADABF' }}>
                Discharge Initiated
              </Col>
              <Col span={3} style={{ backgroundColor: '#C8A1E0' }}>
                Movement
              </Col>
            </Row>
          </div>
        </Row>
        {view === "" || view === "Tabular" ? (
          <Spin spinning={tableLoading}>
            <CustomTable
              // rowKey={inPatientDetails.BedID}
              columns={columns}
              dataSource={inPatientDetails}
              actionColumn={false}
            />
          </Spin>
        ) : (
          <Spin spinning={tableLoading}>
            <Row style={{ padding: "0 1rem" }}>
              <Col span={17}>
                <Collapse
                  defaultActiveKey={[firstWardKey]}
                  ghost
                  className="InpatientManagement"
                >
                  {Object.keys(groupedBeds).map((wardName, index) => (
                    <Collapse.Panel header={wardName} key={wardName}>
                      <Row justify="center">
                        <Col xs={24}>
                          <Row gutter={[32, 32]} justify="start">
                            {groupedBeds[wardName].map((bed) => (
                              <WardBed key={bed.BedID} bed={bed} />
                            ))}
                          </Row>
                        </Col>
                      </Row>
                    </Collapse.Panel>
                  ))}
                </Collapse>
              </Col>
              <Col span={7}>
                <div style={{ width: "100%", marginTop: "1rem" }}>
                  <Divider orientation="left">Tasks</Divider>
                  <Collapse>
                    <Collapse.Panel onClick={IncomingTransfer}
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
                    <Collapse.Panel onClick={OutgoingTransfer}
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
                <div style={{ marginTop: "1rem", paddingBottom: "1.5rem" }}>
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
                          <span>Awaiting For Discharge</span>
                          <Tag color="#2db7f5">{0}</Tag>
                        </div>
                      }
                      key="1"
                    >
                      {renderAwaitingPatients()}
                    </Collapse.Panel>
                    <Collapse.Panel
                      header={
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span>Another Panel</span>
                          <Tag color="#2db7f5">{0}</Tag>
                        </div>
                      }
                      key="2"
                    >
                      {renderAwaitingPatients()}
                    </Collapse.Panel>
                  </Collapse>
                </div>
              </Col>
            </Row>
          </Spin>
        )}
      </Layout>
    </>
  );
}

const columns = [
  {
    title: "Sl.No",
    dataIndex: "key",
    key: "key",
  },
  {
    title: "UHID",
    dataIndex: "UhId",
    key: "UhId",
  },
  {
    title: "Patient Name",
    dataIndex: "PatientName",
    key: "PatientName",
  },
  {
    title: "Consultant",
    dataIndex: "ProviderName",
    key: "ProviderName",
  },
  {
    title: "Ward Category",
    dataIndex: "wardCategory",
    key: "wardCategory",
  },
  {
    title: "Floor",
    dataIndex: "ServiceLocation",
    key: "ServiceLocation",
  },
  {
    title: "Room Number",
    dataIndex: "RoomNo",
    key: "RoomNo",
  },
  {
    title: "Bed Number",
    dataIndex: "BedNo",
    key: "BedNo",
  },
  {
    title: "Occupied From",
    dataIndex: "occupiedFrom",
    key: "occupiedFrom",
  },
  {
    title: "Bed Status",
    dataIndex: "PatientStatus",
    key: "PatientStatus",
  },
];

export default InPatientManagement;
