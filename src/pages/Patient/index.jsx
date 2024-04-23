import customAxios from "../../components/customAxios/customAxios.jsx";
import React, { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router";
import {
  Col,
  ConfigProvider,
  Row,
  Select,
  Typography,
  Spin,
  notification,
} from "antd";

import Input from "antd/es/input";
import Form from "antd/es/form";
import { Modal, Table, Layout, Tag, Avatar } from "antd";
import Button from "antd/es/button";
import {
  urlGetAllPatients,
  urlGetPatientDetail,
  urlEditOrDeletePatientVisit,
  urlAddNewVisit,
  urlCancelVisit,
} from "../../../endpoints.js";
import { CalendarFilled, UserAddOutlined } from "@ant-design/icons";
import { EnvironmentOutlined } from "@ant-design/icons";

import "../Patient/style.css";
import male from "../../assets/m.png";
import female from "../../assets/f.png";
import defaultPic from "../../assets/defaultPic.png";

const Patient = () => {
  const [patientDetails, setPatientDetails] = useState([]);
  const { Title } = Typography;
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  // const [form1] = Form.useForm();
  const [form] = Form.useForm();
  const [selectedRecord, setSelectedRecord] = useState([]); // New state variable to store selected record

  const [isEditOrDeleteVisitModalVisible, setIsEditOrDeleteVisitModalVisible] =
    useState(false);
  const [isMoreModalVisible, setIsMoreModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isCancelEncounter, setIsCancelEncounter] = useState(false);

  const [patientDropdown, setPatientDropdown] = useState({
    Title: [],
    Gender: [],
    BloodGroup: [],
    MaritalStatus: [],
    Countries: [],
    Statesnew: [],
    PatientType: [],
    KinTitle: [],
    VisitType: [],
    EncounterType: [],
    EncounterReason: [],
    ReferredBy: [],
    EncounterEditReason: [],
    EncounterCancelReason: [],
  });

  useEffect(() => {
    // debugger;
    setIsLoading(true);
    customAxios.get(urlGetAllPatients).then((response) => {
      setPatientDetails(response.data.data.Patients);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    customAxios.get(urlGetPatientDetail).then((response) => {
      const apiData = response.data.data;
      setPatientDropdown(apiData);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      PatientType: selectedRecord.PatientTypeName,
      Provider: selectedRecord.ProviderName,
      Department: selectedRecord.DepartmentName,
      ServiceLocation: selectedRecord.ServiceLocationName,
      EncounterType: selectedRecord.EncounterTypeId,
      KinTitle: selectedRecord.KinTitle,
      KinName: selectedRecord.KinName,
      EncounterReason: selectedRecord.EncounterReasonId,
      KinAddress: selectedRecord.KinAddress,
      KinContactNo: selectedRecord.KinContactNo,
      referredBy: selectedRecord.ReferredBy,
    });
  }, [selectedRecord]);

  const formatDatefortable = (dateString) => {
    if (!dateString) return '""';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  };

  function showGenderPic(Gender) {
    if (Gender === 7) {
      return male;
    }
    if (Gender === 8) {
      return female;
    } else {
      return defaultPic;
    }
  }

  const navigateToNewPatient = () => {
    const url = `NewPatient`;
    // Navigate to the new URL
    navigate(url);
  };

  const navigateToNewVisit = () => {
    const url = `NewVisit`;
    // Navigate to the new URL
    navigate(url);
  };

  const handleEditVisitModal = (record) => {
    // debugger;
    setSelectedRecord(record);
    setIsCancelEncounter(false);
    console.log("see the values of reocrd", record);

    setIsEditOrDeleteVisitModalVisible(true);
  };

  const handleEditOrDeleteVisitModalCancel = () => {
    // debugger;
    setIsCancelEncounter(false);
    setIsEditOrDeleteVisitModalVisible(false);
  };

  const handleCancelVisitModal = (record) => {
    // debugger;
    setSelectedRecord(record);
    console.log("see the values of reocrd", record);
    setIsCancelEncounter(true);

    setIsEditOrDeleteVisitModalVisible(true);
  };

  const handleMoreDetailsModal = (record) => {
    debugger;
    setSelectedRecord(record);
    setIsMoreModalVisible(true);
  };

  const handleMoreModalCancel = () => {
    setIsMoreModalVisible(false);
  };

  const handleOk = async () => {
    // debugger;
    try {
      await form.validateFields(); // Trigger form validation
      const values = form.getFieldsValue();
      console.log("Selected submitting values", values);

      const Encounter = {
        PatientId: selectedRecord.PatientId,
        PatientType: selectedRecord.PatientType,
        FacilityDepartmentId: selectedRecord.FacilityDepartmentId,
        FacilityDepartmentServiceLocationId:
          selectedRecord.FacilityDepartmentServiceLocationId,
        ProviderId: selectedRecord.ProviderId,
        EncounterId: selectedRecord.EncounterId,
        Encounter: selectedRecord.GeneratedEncounterId
          ? selectedRecord.GeneratedEncounterId
          : null,
        EncounterTypeId:
          values.EncounterType === undefined ? null : values.EncounterType,
        EncounterReasonId:
          values.EncounterReason === undefined ? null : values.EncounterReason,
        KinTitle: values.KinTitle === undefined ? null : values.KinTitle,
        KinName: values.KinName === undefined ? null : values.KinName,
        KinAddress: values.KinAddress === undefined ? null : values.KinAddress,
        KinContactNo:
          values.KinContactNo === undefined ? null : values.KinContactNo,
        ReferredBy: values.referredBy === undefined ? null : values.referredBy,
        AttendingProviderId:
          values.admittedUnder === undefined ? null : selectedRecord.ProviderId,
        EncounterEditReason:
          values.EditReason === undefined ? 0 : values.EditReason,
        EncounterCancelReason:
          values.CancelEdit === undefined ? 0 : values.CancelEdit,
      };

      try {
        // Send a POST request to the server
        const response = await customAxios.post(
          urlEditOrDeletePatientVisit,
          Encounter,
          {
            headers: {
              "Content-Type": "application/json", // Replace with the appropriate content type if needed
              // Add any other required headers here
            },
          }
        );

        if (response.data.data !== null) {
          const encounterDetails = response.data.data.Patients;
          setPatientDetails(encounterDetails);
          notification.success({
            message: "Visit details updated Successfully",
          });
        }

        // Check if the request was successful
        if (response.status !== 200) {
          throw new Error(
            `Server responded with status code ${response.status}`
          );
        }
      } catch (error) {
        console.error("Failed to send data to server: ", error);
        notification.error({
          message: "Visit edit details UnSuccessful",
          description: "Failed to cancel visit. Please try again later.",
        });
      }

      form.resetFields();
      setIsEditOrDeleteVisitModalVisible(false);
    } catch (error) {
      // Handle errors if needed
    }
  };

  //   // debugger;
  //   try {
  //     await form1.validateFields(); // Trigger form validation
  //     const values = form1.getFieldsValue();
  //     console.log("Selected submitting values", values);

  //     const Encounter = {
  //       PatientId: selectedRecord.PatientId,
  //       PatientType: selectedRecord.PatientType,
  //       FacilityDepartmentId: selectedRecord.FacilityDepartmentId,
  //       FacilityDepartmentServiceLocationId:
  //         selectedRecord.FacilityDepartmentServiceLocationId,
  //       ProviderId: selectedRecord.ProviderId,
  //       EncounterId: selectedRecord.EncounterId,
  //       Encounter: selectedRecord.GeneratedEncounterId
  //         ? selectedRecord.GeneratedEncounterId
  //         : 0,
  //       EncounterTypeId: values.EncounterType,
  //       EncounterReasonId: values.EncounterReason,
  //       KinTitle: values.KinTitle,
  //       KinName: values.KinName,
  //       KinAddress: values.KinAddress,
  //       KinContactNo: values.KinContactNo,
  //       ReferredBy: values.referredBy,
  //       AttendingProviderId: values.admittedUnder,
  //       EncounterCancelReason: values.CancelEdit,
  //       EncounterDate: selectedRecord.CreatedDateTime,
  //     };

  //     try {
  //       // Send a POST request to the server
  //       const response = await customAxios.post(urlCancelVisit, Encounter);

  //       notification.success({
  //         message: "Visit cancellation Successful",
  //       });
  //       // Check if the request was successful
  //       if (response.status !== 200) {
  //         throw new Error(
  //           `Server responded with status code ${response.status}`
  //         );
  //       }

  //       setPatientDetails((prevPatients) =>
  //         prevPatients.filter(
  //           (patient) =>
  //             patient.GeneratedEncounterId !==
  //             selectedRecord.GeneratedEncounterId
  //         )
  //       );
  //     } catch (error) {
  //       console.error("Failed to send data to server: ", error);
  //       notification.error({
  //         message: "Visit cancellation UnSuccessful",
  //         description: "Failed to cancel visit. Please try again later.",
  //       });
  //     }

  //     form1.resetFields();
  //     setIsCancelVisitModalVisible(false);
  //   } catch (error) {
  //     // Handle errors if needed
  //   }
  // };

  const columns = [
    {
      title: "Sl No",
      key: "index",

      render: (text, record, index) => {
        const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
        return serialNumber;
      },
    },
    {
      title: "UH ID",
      dataIndex: "UhId",
      key: "UhId",
      // sorter: (a, b) => a.UhId - b.UhId,
      // sortDirections: ['descend', 'ascend'],
      render: (text, record) => (
        <Tag
          color="blue"
          style={{ fontWeight: "bold", borderWidth: "5px", fontSize: "15px" }}
        >
          {record.UhId}
        </Tag>
      ),
    },
    {
      title: "Encounter ID",
      dataIndex: "VisitId",
      key: "VisitId",

      // sortDirections: ['descend', 'ascend'],
      render: (text, record) => {
        const tag = record.PatientTypeName;
        let color = "";
        if (tag === "Emergency") {
          color = "red";
        } else if (tag === "Day Care") {
          color = "magenta";
        } else if (tag === "Ambulatory Patient") {
          color = "orange";
        } else {
          color = "lime";
        }
        return (
          <Tag color={color} style={{ fontWeight: "bold", fontSize: "15px" }}>
            {record.GeneratedEncounterId}
          </Tag>
        );
      },
    },
    {
      title: "Image",
      dataIndex: "Gender",
      key: "Gender",
      render: (text, record) => (
        <Avatar src={showGenderPic(record.Gender)} size="large" />
      ),
    },
    {
      title: "Patient Details",
      dataIndex: "PatientName",
      key: "PatientName",

      render: (text, record) => (
        <div>
          <p>
            <strong>Name:</strong> {record.PatientFirstName}
            <br />
            <strong>Mob No:</strong> {record.MobileNumber}
            <br />
            <strong>Dob:</strong> {formatDatefortable(record.DateOfBirth)}
            <br />
            <strong>Gender:</strong> {record.Gender == 7 ? "Male" : "Female"}
          </p>
        </div>
      ),
    },
    {
      title: "Visit Details",
      dataIndex: "PatientName",
      key: "PatientName",
      // sorter: (a, b) => a.PatientName.localeCompare(b.PatientName),
      // sortDirections: ['descend', 'ascend'],
      render: (text, record) => (
        <div>
          <p>
            <strong>Patient Type:</strong> {record.PatientTypeName}
            <br />
            <strong>Department:</strong> {record.DepartmentName}
            <br />
            <strong>Provider Name:</strong> {record.ProviderName}
            <br />
            <strong>Service Location:</strong> {record.ServiceLocationName}
          </p>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (text, record) => (
        <>
          <div>
            <p>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleCancelVisitModal(record);
                }}
              >
                Cancel Visit
              </a>
            </p>
          </div>
          <div>
            <p>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleEditVisitModal(record);
                }}
              >
                Edit Visit Details
              </a>
            </p>
          </div>
          <div>
            <p>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleMoreDetailsModal(record);
                }}
              >
                More Details
              </a>
            </p>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <Layout style={{ zIndex: "1" }}>
        <div
          style={{
            backgroundColor: "white",
            minHeight: "100vh",
            borderRadius: "10px",
            overflow: "hidden",
            padding: "1rem",
          }}
        >
          <Row
            style={{
              // padding: '0rem 0rem 0rem 0rem',
              backgroundColor: "#1a9bf0",
              borderRadius: "10px 10px 10px 10px",
              height: "70px",
              marginLeft: "5px",
              marginRight: " 5px",
              alignItems: "center",
            }}
            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          >
            <Col span={1}>
              <Button
                type="default"
                size="large"
                onClick={navigateToNewPatient}
              >
                <UserAddOutlined
                  style={{ fontWeight: "bold", fontSize: "18px" }}
                />
                <strong> Add New Patient </strong>
              </Button>
            </Col>
            <Col span={3} offset={10}>
              <div
                style={{
                  padding: "5px",
                  borderRadius: "1em",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                  backgroundColor: "white",
                }}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  <FaUsers style={{ fontSize: "30px", color: "#1a9bf0" }} />
                  <div
                    style={{
                      height: "30px",
                      width: "30px",
                      color: "black",
                      backgroundColor: "#fff",
                      padding: "5px",
                      fontSize: "23px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "10px",
                      fontWeight: "bolder",
                      marginLeft: "5px", // Added margin to create space between icon and text
                    }}
                  >
                    {patientDetails.length}
                  </div>
                </span>
                <span style={{ fontWeight: 500, fontSize: "12px" }}>
                  Visits for Today
                </span>
              </div>
            </Col>
            <Col span={1} offset={7}>
              <Button type="default" size="large" onClick={navigateToNewVisit}>
                <strong>Create Visit</strong>
              </Button>
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={24}>
              <Title level={4}> List of Patients in Visits</Title>
              <Title level={5}>showing 1 of 1 Patients</Title>
            </Col>
          </Row>
          <Spin spinning={isLoading}>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={24}>
                <Table
                  dataSource={patientDetails}
                  columns={columns}
                  rowKey={(row) => row.EncounterId}
                  size="small"
                  className="custom-table"
                  scroll={{ x: 1000 }}
                  onChange={(pagination) => {
                    setCurrentPage(pagination.current);
                    setItemsPerPage(pagination.pageSize);
                  }}
                  bordered
                />
              </Col>
            </Row>
          </Spin>
        </div>
      </Layout>
      <ConfigProvider
        theme={{
          token: {
            zIndexPopupBase: 3000,
          },
        }}
      >
        {/* {contextHolder} */}
        <Modal
          width={1000}
          title={isCancelEncounter ? "CANCEL VISIT" : "EDIT VISIT DETAILS"}
          open={isEditOrDeleteVisitModalVisible}
          onOk={handleOk}
          onCancel={handleEditOrDeleteVisitModalCancel}
          okText="Update"
          maskClosable={false}
        >
          <div
            style={{
              border: "1px solid #d9d9d9",
              padding: "16px",
              borderRadius: "4px",
              margin: "4px",
            }}
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                  UHID:
                </span>
                <span>{selectedRecord && selectedRecord.UhId}</span>
              </Col>
              <Col span={8}>
                <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                  Name:
                </span>
                <span>{selectedRecord && selectedRecord.PatientFirstName}</span>
              </Col>
              <Col span={8}>
                <span style={{ fontWeight: "bold" }}>PatientGender:</span>
                <span>{selectedRecord && selectedRecord.PatientGender}</span>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                  VisitId:
                </span>
                <span>
                  {selectedRecord && selectedRecord.GeneratedEncounterId}
                </span>
              </Col>
              <Col span={8}>
                <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                  Age:
                </span>
                <span>{selectedRecord && selectedRecord.Age}</span>
              </Col>
              <Col span={8}>
                <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                  Dob:
                </span>
                <span>
                  {selectedRecord &&
                    formatDatefortable(selectedRecord.DateOfBirth)}
                </span>
              </Col>
            </Row>
          </div>
          <div>
            <Form form={form} layout="vertical">
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={6}>
                  <Form.Item
                    name="PatientType"
                    label="Patient Type"
                    rules={[
                      {
                        required: true,
                        message: "Please select PatientType",
                      },
                    ]}
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="EncounterType" label="Encounter Type">
                    <Select allowClear>
                      {patientDropdown.EncounterType.map((option) => (
                        <Select.Option
                          key={option.LookupID}
                          value={option.LookupID}
                        >
                          {option.LookupDescription}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="KinTitle" label="Title">
                    <Select allowClear>
                      {patientDropdown.Title.map((option) => (
                        <Select.Option
                          key={option.LookupID}
                          value={option.LookupID}
                        >
                          {option.LookupDescription}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="KinName" label="Next of Kin. Name">
                    <Input allowClear />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={6}>
                  <Form.Item
                    name="Department"
                    label="Department"
                    rules={[
                      {
                        required: true,
                        message: "Please select Department",
                      },
                    ]}
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="EncounterReason" label="Encounter Reason">
                    <Select allowClear>
                      {patientDropdown.EncounterReason.map((option) => (
                        <Select.Option
                          key={option.LookupID}
                          value={option.LookupID}
                        >
                          {option.LookupDescription}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="KinAddress" label="Next of Kin. Address">
                    <Input allowClear />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={6}>
                  <Form.Item
                    name="Provider"
                    label="Provider"
                    rules={[
                      {
                        required: true,
                        message: "Please select Provider",
                      },
                    ]}
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="admittedUnder" label="Admitted Under">
                    <Input allowClear />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="KinContactNo"
                    label="Next of Kin. Contact No"
                  >
                    <Input allowClear />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={6}>
                  <Form.Item
                    name="ServiceLocation"
                    label="Service Location"
                    rules={[
                      {
                        required: true,
                        message: "Please select Service Location",
                      },
                    ]}
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="referredBy" label="Referred By">
                    <Select allowClear>
                      {patientDropdown.ReferredBy.map((option) => (
                        <Select.Option
                          key={option.ReferrerId}
                          value={option.ReferrerId}
                        >
                          {option.ReferrerType}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  {isCancelEncounter ? (
                    <Form.Item
                      name="CancelEdit"
                      label="CancelEdit"
                      rules={[
                        {
                          required: true,
                          message: "Please select Service Location",
                        },
                      ]}
                    >
                      <Select allowClear>
                        {patientDropdown.EncounterCancelReason.map((option) => (
                          <Select.Option
                            key={option.LookupID}
                            value={option.LookupID}
                          >
                            {option.LookupDescription}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  ) : (
                    <Form.Item
                      name="EditReason"
                      label="Edit Reason"
                      rules={[
                        {
                          required: true,
                          message: "Please select Service Location",
                        },
                      ]}
                    >
                      <Select allowClear>
                        {patientDropdown.EncounterEditReason.map((option) => (
                          <Select.Option
                            key={option.LookupID}
                            value={option.LookupID}
                          >
                            {option.LookupDescription}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}
                </Col>
              </Row>
            </Form>
          </div>
        </Modal>
      </ConfigProvider>

      <ConfigProvider
        theme={{
          token: {
            zIndexPopupBase: 3000,
          },
        }}
      >
        {/* {contextHolder} */}
        <Modal
          width={700}
          title="More Details"
          open={isMoreModalVisible}
          // onOk={handleOk}
          // okButtonProps={{ disabled: IsVisitCreated }}
          onCancel={handleMoreModalCancel}
          maskClosable={false}
          footer={null}
        >
          <div
            style={{
              padding: "16px",
              borderRadius: "4px",
              margin: "10px",
              backgroundColor: "#f9f0ff",
              // display: "flex",
              // border: "1px solid #d9d9d9",
              // justifyContent: "space-between",
              boxShadow: "0px 0px 2px 2px rgba(86,144,199,1)",
            }}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={8}>
                <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                  UHID :
                </span>
                <span>{selectedRecord && selectedRecord.UhId}</span>
              </Col>
              <Col span={8}>
                <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                  Name :
                </span>
                <span>{selectedRecord && selectedRecord.PatientFirstName}</span>
              </Col>
              <Col span={8}>
                <span style={{ fontWeight: "bold" }}>Patient Gender : </span>
                <span>
                  {selectedRecord && selectedRecord.PatientGender == 7
                    ? "Male"
                    : "Female"}
                </span>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={8}>
                <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                  Age :
                </span>
                <span>{selectedRecord && selectedRecord.Age}</span>
              </Col>
              <Col span={8}>
                <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                  Dob :
                </span>
                <span>
                  {selectedRecord &&
                    formatDatefortable(selectedRecord.DateOfBirth)}
                </span>
              </Col>
            </Row>
          </div>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={12}>
              <div
                style={{
                  padding: "5px 5px",
                  margin: "10px 10px",
                }}
              >
                <strong style={{ fontSize: "15px" }}>
                  <EnvironmentOutlined /> Present address
                </strong>
                <br></br>
                <span>
                  {selectedRecord && selectedRecord.PermanentAddress1
                    ? selectedRecord.PermanentAddress1
                    : "N/A"}
                </span>
                <br></br>
                <span>{selectedRecord && selectedRecord.AreaName}</span>
                <br></br>
                <span>{selectedRecord && selectedRecord.PlaceName}</span>
                <br></br>
                <span>{selectedRecord && selectedRecord.StateName}</span>
                <br></br>
                <span>{selectedRecord && selectedRecord.CountryName}</span>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ padding: "5px 5px", margin: "10px 10px" }}>
                <strong>Marital Status : </strong>
                <span>
                  {selectedRecord && selectedRecord.MaritalStatusString
                    ? selectedRecord.MaritalStatusString
                    : "N/A"}
                </span>
                <br></br>
                <strong>Father / Spouse name : </strong>
                <span>
                  {selectedRecord && selectedRecord.FatherHusbandName
                    ? selectedRecord.FatherHusbandName
                    : "N/A"}
                </span>
                <br></br>
              </div>
            </Col>
          </Row>
        </Modal>
      </ConfigProvider>
    </>
  );
};

export default Patient;
