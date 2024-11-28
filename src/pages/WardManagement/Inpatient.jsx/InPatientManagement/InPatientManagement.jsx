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
  urlGetBeds,
  urlGetPatientHeaderDetails,
  urlGetServiceLocation,
  urlGetWardAndBannerData,
  urlGetWardCategory,
  urlGetWardInpatientsDetails,
  urlGetWards,
  urlShowAwaitingPatients,
  urlShowModal
} from "../../../../../endpoints";
import React, { useEffect, useState } from "react";
import CustomTable from "../../../../components/customTable";
import customAxios from "../../../../components/customAxios/customAxios";
import WardBed from "./WardBed";
import { CgMoreO } from "react-icons/cg";
import { TfiMoreAlt } from "react-icons/tfi";
import Item from "antd/es/list/Item";
import dayjs from "dayjs";
import {
  ColWithEightSpan,
  ColWithSixSpan,
} from "../../../../components/customGridColumns";
import PageHeader from "../../../../components/PageHeader";
import DirectTransferModal from "./DirectTransferModal";

function InPatientManagement() {
  const [view, setView] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [wardDetails, setWardDetails] = useState([]);
  const [locationDropDown, setLocationDropDown] = useState([]);
  const [inPatientDetails, setInPatientDetails] = useState([]);
  const [beds, setBeds] = useState([]);
  const [bed, setBed] = useState({});
  const [banner, setBanner] = useState({});
  const [showAwaitingPatient, setShowAwaitingPatient] = useState({
    IncomingRequestForTransfer: [],
    OutgoingRequestForTransfer: [],
    AwaitingPatients: []
  });
  const [directTransferModalOpen, setDirectTransferModalOpen] = useState(false);
  const [dropDown, setDropDown] = useState({
    FacilityDepartment: [],
    FacilityDeptServiceLocation: [],
    WardCategory: [],
    Wards: [],
    Beds: [],
    ReasonForTransfer: [],
    PatientsCurrentDetails: {},
    DispositionType: [],
    FacilityDepartmentProvider: [],
    MovementDetails: {},
  });
  const [patientData, setPatientData] = useState({})

  const fetchDataHeader = async (bed) => {
    try {
      const response = await customAxios.get(
        `${urlGetPatientHeaderDetails}?PatientId=${bed.PatientID}&EncounterId=${bed.EncounterId}`
      );
      if (response.status === 200 && response.data != null) {
        const detailsheader = response.data.data.EncounterModel;
        setPatientData(detailsheader);
      } else {
      }
    } catch (error) { }
  };

  useEffect(() => {
    setIsLoading(true);
    customAxios.get(urlGetWardInpatientsDetails).then((response) => {
      setLocationDropDown(response.data.data.FacilityDeptServiceLocation);
      setIsLoading(false);
    });
  }, []);

  const handleDropdown = async (value, SLId, Id, PId) => {
    debugger;
    if (Id === 1) {
      const response = await customAxios.get(
        `${urlGetServiceLocation}?FacilityDepartmentId=${value}`
      );
      if (response.status === 200) {
        setDropDown((prevDropdown) => {
          const updatedDropdown = {
            ...prevDropdown,
            FacilityDeptServiceLocation:
              response.data.data.FacilityDeptServiceLocation,
            PatientsCurrentDetails: {
              ...prevDropdown.PatientsCurrentDetails,
              ServiceLocationId: undefined,
              WardCategoryID: "",
              WardID: "",
              BedID: "",
            },
            WardCategory: [],
            Wards: [],
            Beds: [],
          };
          return updatedDropdown;
        });
      }
    } else if (Id === 2) {
      const response = await customAxios.get(
        `${urlGetWardCategory}?ServiceLocationId=${value}&ID=${1}`
      );
      if (response.status === 200) {
        setDropDown((prevDropdown) => {
          const updatedDropdown = {
            ...prevDropdown,
            WardCategory: response.data.data.masters,
            Wards: [],
            Beds: [],
          };
          return updatedDropdown;
        });
      }
    } else if (Id === 3) {
      const response = await customAxios.get(
        `${urlGetWards}?ServiceLocationId=${SLId}&WardCategoryID=${value}&ID=${1}&PatientID=${PId}`
      );
      if (response.status === 200) {
        setDropDown((prevDropdown) => {
          const updatedDropdown = {
            ...prevDropdown,
            Wards: response.data.data.Wards,
            Beds: [],
          };
          return updatedDropdown;
        });
      }
    } else {
      const response = await customAxios.get(
        `${urlGetBeds}?WardId=${value}&ID=${1}`
      );
      if (response.status === 200) {
        setDropDown((prevDropdown) => {
          const updatedDropdown = {
            ...prevDropdown,
            Beds: response.data.data.Beds,
          };
          return updatedDropdown;
        });
      }
    }
  };

  const handleMenuClick = async (e) => {
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
        setBanner(response.data.data);
      } else {
        console.log("data is not clear ");
      }
      await customAxios.get(`${urlShowAwaitingPatients}?LocationId=${e}&Flag=${0}`).then((response) => {
        setShowAwaitingPatient(response.data.data);
        bed.ServiceLocationId = e
      });
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

  const ReLoad = (value) => {
    debugger
    if (value == 'Start') {
      setTableLoading(true)
    } else if (value == 'End') {
      setTableLoading(false)
    } else {
      handleMenuClick(value);
    }
  };

  const menuItems = [
    {
      key: "1",
      label: "Direct Transfer",
    },
    {
      key: "2",
      label: "Transfer Request",
    },
    {
      key: "3",
      label: "Discharge Initiation",
    },
  ];

  async function OpenModal(key, bed) {
    debugger
    try {
      const response = await customAxios.get(
        `${urlShowModal}?Id=${parseInt(key)}&PatientID=${bed.PatientID
        }&LocationID=${bed.ServiceLocationId}&WardCategoryId=${bed.WardCategoryID
        }&BedStatus=${null}&EncounterId=${bed.EncounterId
        }&FromDate=${null}&ToDate=${null}&flag=${1}`
      );
      if (response.status === 200 && response.data.data != null) {
        setDropDown(response.data.data);
        setDirectTransferModalOpen(true)
      } else {
        console.error("Failed to fetch patient details");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function TransferRequest() {
    debugger    
  }

  function DischargeInitiation(key, bed) {
    debugger
  }

  const handleAwaitingMenuClick = ({ key, bed }) => {
    switch (key) {
      case "1":
        setBed(bed)
        fetchDataHeader(bed);
        OpenModal(key, bed)
        break;
      case "2":
        TransferRequest(bed)
        break;
      case "3":
        DischargeInitiation(key, bed)
        break;
      default:
        message.success("Unknown option selected");
        break;
    }
  };

  const renderAwaitingPatients = () => (
    <div>
      {showAwaitingPatient.AwaitingPatients.map((bed) => (
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
            menu={{ items: menuItems, onClick: (info) => handleAwaitingMenuClick({ key: info.key, bed }) }}
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

  const IncomingTransfer = () => { };

  const OutgoingTransfer = () => { };

  return (
    <>
      <Layout
        style={{
          backgroundColor: "white",
          height: "max-content",
          borderRadius: "10px",
          width: "100%",
        }}
      >
        <PageHeader title={"In-Patient Management"} button={false} />
        <Row
          gutter={16}
          style={{
            padding: "1rem 1rem",
          }}
        >
          <Col
            xl={10}
            sm={24}
            xs={24}
            span={10}
            style={{ marginBottom: "1rem" }}
          >
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
          <ColWithEightSpan style={{ marginBottom: "1rem" }}>
            <Search
              placeholder="Search Patients"
              style={{
                width: "100%",
                marginRight: "2rem",
              }}
            />
          </ColWithEightSpan>
          <ColWithSixSpan>
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
          </ColWithSixSpan>
        </Row>
        {/* summary start*/}
        <Row
          gutter={24}
          style={{
            border: "2px solid lavender",
            margin: "0 1rem 1rem 1rem",
            padding: "0.5rem",
            borderRadius: "0.5rem",
          }}
        >
          <Col xl={3} lg={3} md={4} sm={4} xs={4} span={8}>
            As on : <strong>{dayjs().format("DD-MM-YYYY")}</strong>
          </Col>
          <Col
            xl={10}
            lg={10}
            md={10}
            sm={10}
            span={10}
            style={{
              borderLeft: "1px solid grey",
              borderRight: "1px solid grey",
            }}
          >
            <Row>
              <Col span={24} style={{ marginBottom: "0.5rem" }}>
                Total Beds : <strong>{banner.TotalBeds}</strong>
              </Col>
              <ColWithEightSpan>
                Occupied : <strong>{banner.Occupied}</strong>
              </ColWithEightSpan>
              <ColWithEightSpan>
                Available : <strong>{banner.Available}</strong>
              </ColWithEightSpan>
              <ColWithEightSpan>
                Blocked : <strong>{banner.Blocked}</strong>
              </ColWithEightSpan>
            </Row>
          </Col>
          <Col xl={11} lg={10} md={10} sm={10} span={10}>
            <Row gutter={0}>
              <Col span={24} style={{ marginBottom: "0.5rem" }}>
                Todays :
              </Col>
              <Col xl={6} lg={6} md={12} xs={24} span={24}>
                New Admission:&nbsp;
                <strong>{banner.NewAdmissionsCount}</strong>
              </Col>
              <Col xl={6} lg={6} md={12} xs={24} span={24}>
                Discharges:&nbsp;
                <strong>{banner.DischargedPatientsCount}</strong>
              </Col>
              <Col xl={6} lg={6} md={12} xs={24} span={24}>
                Transfer In:&nbsp;<strong>{banner.TransferInCount}</strong>
              </Col>
              <Col xl={6} lg={6} md={12} xs={24} span={24}>
                Transfer Out:&nbsp;
                <strong>{banner.TransferOutCount}</strong>
              </Col>
            </Row>
          </Col>
        </Row>
        {/* summary end*/}
        {/*Color Coding div start*/}
        <div>
          <Row
            style={{
              border: "2px solid lavender",
              margin: "0 1rem",
              borderRadius: "0.5rem",
              width: "inherit",
              textAlign: "center",
              display: "flex",
            }}
          >
            <Col
              style={{
                backgroundColor: "#C5EBAA",
                flexGrow: 1,
                padding: "0.2rem",
              }}
            >
              Available
            </Col>
            <Col
              style={{
                backgroundColor: "#FFBABA",
                flexGrow: 1,
                padding: "0.2rem",
              }}
            >
              Occupied
            </Col>
            <Col
              style={{
                backgroundColor: "#FF8356",
                flexGrow: 1,
                padding: "0.2rem",
              }}
            >
              Blocked
            </Col>
            <Col
              style={{
                backgroundColor: "#F0A8D0",
                flexGrow: 1,
                padding: "0.2rem",
              }}
            >
              Transfer Requested
            </Col>
            <Col
              style={{
                backgroundColor: "#D1E9F6",
                flexGrow: 1,
                padding: "0.2rem",
              }}
            >
              Request Confirmed
            </Col>
            <Col
              style={{
                backgroundColor: "#7C93C3",
                flexGrow: 1,
                padding: "0.2rem",
              }}
            >
              Discharge Initiated
            </Col>
            <Col
              style={{
                backgroundColor: "#C8A1E0",
                flexGrow: 1,
                padding: "0.2rem",
              }}
            >
              Movement
            </Col>
          </Row>
        </div>
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
                              <WardBed
                                key={bed.BedID}
                                bed={bed}
                                ReLoad={ReLoad}
                              />
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
                    <Collapse.Panel
                      onClick={IncomingTransfer}
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
                      onClick={OutgoingTransfer}
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
                          <Tag color="#2db7f5">{showAwaitingPatient.AwaitingPatients.length}</Tag>
                        </div>
                      }
                      key="1"
                    >
                      {renderAwaitingPatients()}
                    </Collapse.Panel>
                    {/* <Collapse.Panel
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
                    </Collapse.Panel> */}
                  </Collapse>
                </div>
              </Col>
            </Row>
          </Spin>
        )}
        <DirectTransferModal
          bed={bed}
          Dropdown={dropDown}
          handleDropdown={handleDropdown}
          patient={patientData}
          open={directTransferModalOpen}
          handleClose={() => { ReLoad(showAwaitingPatient.NewWardModel.ServiceLocationId), setDirectTransferModalOpen(false) }}
        // handleClose={Close}
        />
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
    render: (text, record) => {
      switch (record.PatientStatus) {
        case "Available":
          return (
            <Tag color="#C5EBAA" style={{ color: "black" }}>
              {record.PatientStatus}
            </Tag>
          );
        case "Occupied":
          return (
            <Tag color="#FFBABA" style={{ color: "black" }}>
              {record.PatientStatus}
            </Tag>
          );
        case "Blocked":
          return (
            <Tag color="#FF8356" style={{ color: "black" }}>
              {record.PatientStatus}
            </Tag>
          );
        case "Transfer Requested":
          return (
            <Tag color="#F0A8D0" style={{ color: "black" }}>
              {record.PatientStatus}
            </Tag>
          );
        case "Request Confirmed":
          return (
            <Tag color="#D1E9F6" style={{ color: "black" }}>
              {record.PatientStatus}
            </Tag>
          );
        case "Discharge Initiated":
          return (
            <Tag color="#CADABF" style={{ color: "black" }}>
              {record.PatientStatus}
            </Tag>
          );
        case "Movement":
          return (
            <Tag color="#C8A1E0" style={{ color: "black" }}>
              {record.PatientStatus}
            </Tag>
          );
        default:
          return (
            <Tag color="default" style={{ color: "black" }}>
              {record.PatientStatus}
            </Tag>
          );
      }
    },
  },
];

export default InPatientManagement;
