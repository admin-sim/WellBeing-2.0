import customAxios from "../../../components/customAxios/customAxios.jsx";
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
  Switch,
  Divider,
} from "antd";
import { TimePicker } from "antd";
import Input from "antd/es/input";
import Form from "antd/es/form";
import { Modal, Table, Layout, Tag, Avatar } from "antd";
import Button from "antd/es/button";
import {
  urlAddNewPatientVital,
  urlGetCapturedVitalsDetails,
  urlGetPatientVitalSigns,
} from "../../../../endpoints";
import { EditOutlined } from "@ant-design/icons";
import { BiBody } from "react-icons/bi";
import { FaEdit, FaBed } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa6";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { BsPersonStanding } from "react-icons/bs";
import "../../Patient/style.css";
import male from "../../../assets/m.png";
import female from "../../../assets/f.png";
import defaultPic from "../../../assets/defaultPic.png";
import dayjs from "dayjs";
import { MdManageSearch } from "react-icons/md";
import { Radio, message } from "antd";
import "../style.css";
import { useLocation } from "react-router-dom";
import { Content } from "antd/es/layout/layout.js";

const PatientVitalSigns = () => {
  const location = useLocation();

  const PatientData = location.state.PatientRecord;

  // console.log(PatientData);
  const { Title } = Typography;
  const { TextArea } = Input;
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { Option } = Select;

  const [form2] = Form.useForm();

  const [form3] = Form.useForm();
  const [selectedPatientRecord, setSelectedPatientRecord] =
    useState(PatientData); // New state variable to store selected record
  const [selectedVitals, setSelectedVitals] = useState([]);

  const [isCaptureVitalsModalVisible, setIsCaptureVitalsModalVisible] =
    useState(false);
  const [isEditCaptureVitals, setIsEditCaptureVitals] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [messageApi] = message.useMessage();

  const [Flag] = useState("ALL");
  const [Providers, setProviders] = useState([]);
  let [selectedProvider, setSelectedProvider] = useState(0);
  const [vitalsDetails, setVitalsDetails] = useState([]);
  const [selectedTime, setSelectedTime] = useState(dayjs());

  const currentDate = new Date();
  const currentTimeString = currentDate.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });

  const [MAPValues, setMAPValues] = useState({
    SystolicBP: "",
    DiastolicBP: "",
    MeanAtrialPressure: "",
  });

  const [heightWeightValues, setHeightWeightValues] = useState({
    Height: "",
    Feet: "",
    Inch: "",
    Weight: "",
    BMI: "",
  });

  const tempOptions = (
    <Select defaultValue="celsius">
      <Select.Option key="celsius">C</Select.Option>
      <Select.Option key="fahrenheit">F</Select.Option>
    </Select>
  );

  useEffect(() => {
    debugger;
    setLoading(true);
    customAxios
      .get(
        `${urlGetPatientVitalSigns}?PatientID=${PatientData.PatientId}&ProviderId=${PatientData.ProviderId}&Encounter=${PatientData.Encounterstr}`
      )
      .then((response) => {
        const vitalsData = response.data.data.QueueModel;
        setVitalsDetails(vitalsData);
        setLoading(false);
      });
  }, [PatientData.PatientId]);

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  const formatDatefortable = (dateString) => {
    if (!dateString) return '""';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  };

  function formatCaptureVitalsTime(date) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }

  const onHeightChange = (e) => {
    debugger;
    const height = e.target.value;
    const feet = Math.floor(height / 30.48); // 1 foot = 30.48 cm
    const inch = Math.floor((height / 30.48 - feet) * 12); // 1 inch = 2.54 cm

    setHeightWeightValues((prevState) => ({
      ...prevState,
      Height: height,
      Feet: feet,
      Inch: inch,
    }));
    form2.setFieldsValue({
      Feet: feet,
      Inch: inch,
    });
    calculateBMI(height, heightWeightValues.Weight);
  };

  const onWeightChange = (e) => {
    debugger;
    const weight = e.target.value;
    setHeightWeightValues((prevState) => ({
      ...prevState,
      Weight: weight,
    }));
    calculateBMI(heightWeightValues.Height, weight);
  };

  const calculateBMI = (height, weight) => {
    debugger;
    if (!height || !weight) {
      // If either height or weight is not provided, set BMI to 0
      setHeightWeightValues((prevState) => ({
        ...prevState,
        BMI: 0,
      }));
      form2.setFieldsValue({
        BodyMassIndex: 0,
      });
      return; // Exit the function early if either height or weight is missing
    }

    // Calculate BMI only if both height and weight are provided
    const bmi = (weight / ((height / 100) * (height / 100))).toFixed(2);
    setHeightWeightValues((prevState) => ({
      ...prevState,
      BMI: bmi,
    }));
    form2.setFieldsValue({
      BodyMassIndex: bmi,
    });
  };

  const onSystolicBPChange = (e) => {
    debugger;
    const systolicBP = e.target.value;
    setMAPValues((prevState) => ({
      ...prevState,
      SystolicBP: systolicBP,
    }));

    calculateMAP(systolicBP, MAPValues.DiastolicBP);
  };

  const onDiastolicBPChange = (e) => {
    debugger;
    const diastolicBP = e.target.value;
    setMAPValues((prevState) => ({
      ...prevState,
      DiastolicBP: diastolicBP,
    }));

    calculateMAP(MAPValues.SystolicBP, diastolicBP);
  };

  const calculateMAP = (systolicBP, diastolicBP) => {
    debugger;
    if (!systolicBP || !diastolicBP) {
      //if either systolicBP or diastolicBP are not provided then set MeanAtrialPressure to 0

      setMAPValues((prevState) => ({
        ...prevState,
        MeanAtrialPressure: 0,
      }));
      form2.setFieldsValue({ MeanAtrialPressure: 0 });
    }

    if (systolicBP && diastolicBP) {
      const MAP = (
        parseInt(systolicBP) / 3 +
        (2 * parseInt(diastolicBP)) / 3
      ).toFixed(2);

      setMAPValues((prevState) => ({
        ...prevState,
        MeanAtrialPressure: MAP,
      }));
      // setMAPValues({ ...MAPValues, MeanAtrialPressure: MAP });
      form2.setFieldsValue({ MeanAtrialPressure: MAP });
    }
  };

  const handleCaptureVitals = () => {
    setIsEditCaptureVitals(false);
    setSelectedVitals(null);
    form2.resetFields();
    setIsCaptureVitalsModalVisible(true);
  };

  const handleNavigateToQueue = () => {
    const url = `/Queue`;
    navigate(url);
  };

  const handleCaptureVitalsModalCancel = () => {
    setIsEditCaptureVitals(false);
    setIsCaptureVitalsModalVisible(false);
    form3.resetFields();
    form2.resetFields();
    setHeightWeightValues({
      Height: "",
      Feet: "",
      Inch: "",
      Weight: "",
      BMI: "",
    });
    setMAPValues({
      SystolicBP: "",
      DiastolicBP: "",
      MeanAtrialPressure: "",
    });

    // setProviders([]);
  };
  const handleSaveCaptureDetails = async () => {
    debugger;
    const values = form2.getFieldsValue();
    // console.log("error raised here", values);
    form2
      .validateFields()
      .then(async () => {
        const PatientVital = isEditCaptureVitals
          ? {
              QueueId: selectedPatientRecord.QId,
              PatientId: selectedPatientRecord.PatientId,
              EncounterId: selectedPatientRecord.EncounterId,
              Encounterstr: selectedPatientRecord.Encounterstr,
              PatientVitalId: selectedVitals.PatientVitalId,
              Height: values.Height,
              Weight: values.Weight,
              BodyMassIndex: values.BodyMassIndex=== 0 ? "0":null,
              MeanAtrialPressure: values.MeanAtrialPressure === 0 ? "0":null,
              Temperature: values.Temperature,
              HeartRate: values.HeartRate,
              SystolicBP: values.SystolicBP,
              DiastolicBP: values.DiastolicBP,
              Position: values.position,
              RespiratoryRate: values.RespiratoryRate,
              Oxygensaturation: values.OxygenSaturation,
              PvDate1: formatDate(currentDate),
              Time: formatCaptureVitalsTime(currentDate),
              Q_Status: selectedPatientRecord.Q_Status,
              Oedema: values.oedema,
              pallor: values.pallor,
              HeadCircumference: values.HeadCircumference,
              OtherComments: values.otherComments,
            }
          : {
              QueueId: selectedPatientRecord.QId,
              PatientId: selectedPatientRecord.PatientId,
              EncounterId: selectedPatientRecord.EncounterId,
              Encounterstr: selectedPatientRecord.Encounterstr,
              Height: values.Height,
              Weight: values.Weight,
              BodyMassIndex: values.BodyMassIndex=== 0 ? "0":null,
              MeanAtrialPressure: values.MeanAtrialPressure === 0 ? "0":null,
              Temperature: values.Temperature,
              HeartRate: values.HeartRate,
              SystolicBP: values.SystolicBP,
              DiastolicBP: values.DiastolicBP,
              Position: values.position,
              RespiratoryRate: values.RespiratoryRate,
              Oxygensaturation: values.OxygenSaturation,
              PvDate1: formatDate(currentDate),
              Time: formatCaptureVitalsTime(currentDate),
              Q_Status: selectedPatientRecord.Q_Status,
              Oedema: values.oedema,
              pallor: values.pallor,
              HeadCircumference: values.HeadCircumference,
              OtherComments: values.otherComments,
            };

        try {
          const response = await customAxios.post(
            urlAddNewPatientVital,
            PatientVital,
            {
              headers: {
                "Content-Type": "application/json", // Replace with the appropriate content type if needed
                // Add any other required headers here
              },
            }
          );

          if (response.status == 200) {
            console.log(response.statusText);
            const vitalsData = response.data.data.QueueModel;
            setVitalsDetails(vitalsData);
            form2.resetFields();
            setIsCaptureVitalsModalVisible(false);
            setSelectedVitals(null);
            setHeightWeightValues({
              Height: "",
              Feet: "",
              Inch: "",
              Weight: "",
              BMI: "",
            });
            setMAPValues({
              SystolicBP: "",
              DiastolicBP: "",
              MeanAtrialPressure: "",
            });
            isEditCaptureVitals
              ? notification.success({
                  message: "Patient Vitals Updated Successfully!",
                })
              : notification.success({
                  message: "Patient Vitals Captured Successfully!",
                });
          } else {
            console.error("there raised an error while getting message");
            notification.error({
              message: "Patient Vitals are not  Captured!",
            });
          }
        } catch (err) {
          console.error(err);
        }
      })
      .catch((err) => {
        console.error(err);
        // If validation fails, do nothing or handle the error as desired
      });
  };

  const handleEditCaptureVitals = async (record) => {
    debugger;
    setSelectedVitals(record);
    setIsEditCaptureVitals(true);
    console.log("vitals value", record);

    try {
      const response = await customAxios.get(
        `${urlGetCapturedVitalsDetails}?PatientVitalId=${record.PatientVitalId}`,
        {
          headers: {
            "Content-Type": "application/json", // Replace with the appropriate content type if needed
            // Add any other required headers here
          },
        }
      );

      if (response.status === 200) {
        const newCapturedDetails = response.data.data.NewQueueModel;
        setSelectedVitals(newCapturedDetails);
        setIsCaptureVitalsModalVisible(true);

        form2.setFieldsValue({
          Height: newCapturedDetails.height,
          Feet: 0,
          Inch: 0,
          Weight: newCapturedDetails.Weight,
          BodyMassIndex: newCapturedDetails.BodyMassIndex,
          HeadCircumference: newCapturedDetails.HeadCircumference,
          Temperature: newCapturedDetails.Temperature,
          HeartRate: newCapturedDetails.HeartRate,
          SystolicBP: newCapturedDetails.SystolicBP,
          DiastolicBP: newCapturedDetails.DiastolicBP,
          MeanAtrialPressure: newCapturedDetails.MeanAtrialPressure,
          position: newCapturedDetails.Position,
          RespiratoryRate: newCapturedDetails.RespiratoryRate,
          OxygenSaturation: newCapturedDetails.Oxygensaturation,
          oedema: newCapturedDetails.Oedema,
          pallor: newCapturedDetails.Pallor,
          otherComments: newCapturedDetails.OtherComments,
        });

        console.log(newCapturedDetails);
      } else {
        console.error("Failed to fetch providers");
      }
    } catch (error) {
      console.log("error raised here", error);
    }
  };

  const encounterColumns = [
    {
      title: <span>Sl&nbsp;No</span>,
      key: "index",
      width: 60,

      render: (text, record, index) => {
        const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
        return serialNumber;
      },
    },

    {
      title: <span>Date&nbsp;&&nbsp;Time&nbsp;of&nbsp;Visit</span>,
      dataIndex: "vitalsCapturedDateTime",
      key: "vitalsCapturedDateTime",
    },
    {
      title: <span>Heart&nbsp;Rate&nbsp;(bpm)&nbsp;&nbsp;</span>,
      dataIndex: "HeartRate",
      key: "HeartRate",
    },
    {
      title: <span>Systolic&nbsp;BP</span>,
      dataIndex: "SystolicBP",
      key: "SystolicBP",
    },
    {
      title: <span>Diastolic&nbsp;BP</span>,
      dataIndex: "DiastolicBP",
      key: "DiastolicBP",
    },
    {
      title: <span>Body&nbsp;Temperature&nbsp;(°C)</span>,
      dataIndex: "Temperature",
      key: "Temperature",
    },

    {
      title: <span>Respiratory&nbsp;Rate</span>,
      dataIndex: "RespiratoryRate",
      key: "RespiratoryRate",
    },
    {
      title: <span>Oxygen&nbsp;Saturation&nbsp;(%)</span>,
      dataIndex: "Oxygensaturation",
      key: "Oxygensaturation",
    },

    {
      title: <span>Action</span>,
      key: "actions",
      fixed: "right",
      width: 100,

      render: (text, record, index) => (
        <Row gutter={40}>
          <Col offset={3} span={4}>
            <Button
              size="small"
              icon={
                <EditOutlined
                  style={{ fontSize: "0.9rem" }}
                  onClick={() => handleEditCaptureVitals(record)}
                />
              }
            ></Button>
          </Col>
        </Row>
      ),
    },
  ];

  return (
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
        <div
          style={{
            padding: "16px",
            borderRadius: "4px",
            margin: "10px",
            backgroundColor: "#d9f7be",
            // display: "flex",
            // flexDirection: "row",
            // justifyContent: "space-between",
            boxShadow: "0px 0px 2px 2px rgba(86,144,199,1)",
          }}
        >
          <Row
            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            style={{ margin: "10px 0px" }}
          >
            <Col span={8}>
              <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                UHID:
              </span>
              <span>{selectedPatientRecord && selectedPatientRecord.UhId}</span>
            </Col>
            <Col span={8}>
              <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                Name:
              </span>
              <span>
                {selectedPatientRecord && selectedPatientRecord.PatientName}
              </span>
            </Col>
            <Col span={8}>
              <span style={{ fontWeight: "bold" }}>Gender : </span>
              <span>
                {selectedPatientRecord &&
                selectedPatientRecord.PatientGender === 7
                  ? " Male "
                  : " Female "}
              </span>
            </Col>
          </Row>

          <Row
            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            style={{ margin: "0px 0px" }}
          >
            <Col span={8}>
              <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                Encounter:
              </span>
              <span>
                {selectedPatientRecord && selectedPatientRecord.Encounterstr}
              </span>
            </Col>
            <Col span={8}>
              <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                Age:
              </span>
              <span>{selectedPatientRecord && selectedPatientRecord.Age}</span>
            </Col>
            <Col span={8}>
              <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                Dob:
              </span>
              <span>
                {selectedPatientRecord &&
                  formatDatefortable(selectedPatientRecord.DateOfBirth)}
              </span>
            </Col>
          </Row>
        </div>
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          style={{ margin: "15px 0px" }}
        >
          <Col span={2}>
            <Button
              type="primary"
              size="middle"
              style={{
                margin: "2px 0px",
                padding: "0px 5px",
                fontSize: "15px",
                display: "flex",
                alignItems: "center",
              }}
              onClick={handleNavigateToQueue}
            >
              <BiBody style={{ fontWeight: "bold", fontSize: "20px" }} />
              Queue List
            </Button>
          </Col>
          <Col span={1} offset={18}>
            <Button
              type="primary"
              size="middle"
              style={{
                margin: "0px 45px",
                padding: "0px 5px",
                fontSize: "15px",
                display: "flex",
                alignItems: "center",
              }}
              onClick={handleCaptureVitals}
            >
              <BiBody style={{ fontWeight: "bold", fontSize: "20px" }} />
              Capture vitals
            </Button>
          </Col>
        </Row>
        <Spin spinning={isLoading}>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={24}>
              <Table
                dataSource={vitalsDetails}
                columns={encounterColumns}
                rowKey={(row) => row.PatientVitalId}
                size="small"
                className="vitals-table"
                // scroll={{ x: 1700 }}
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
          title="CAPTURE VITALS"
          open={isCaptureVitalsModalVisible}
          onOk={handleSaveCaptureDetails}
          onCancel={handleCaptureVitalsModalCancel}
          okText="Save"
          cancelText="Cancel"
          maskClosable={false}
        >
          <div>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={24}>
                <div
                  style={{
                    backgroundColor: "#d6e4ff",
                    padding: "10px",
                    borderRadius: "5px",
                    marginBottom: "10px",
                  }}
                >
                  You are capturing vitals for the above patient on
                  <span
                    style={{
                      marginLeft: "auto",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {currentTimeString}
                    <FaRegClock style={{ marginLeft: "5px" }} />
                  </span>
                </div>
              </Col>
            </Row>
            <Form
              // key={selectedPatientRecord.PatientId}
              form={form2}
              layout="vertical"
            >
              <Row
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                style={{ margin: "0px 10px" }}
              >
                <Col span={5}>
                  <Form.Item
                    name="Height"
                    label="Height"
                    rules={[
                      {
                        pattern: /^\d{2,3}$/,
                        message: "Please enter valid input for height",
                      },
                    ]}
                  >
                    <Input addonAfter="Cm" onChange={onHeightChange} />
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item name="Feet" label="Feet">
                    <Input disabled value={heightWeightValues.Feet} />
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item name="Inch" label="Inch">
                    <Input disabled value={heightWeightValues.Inch} />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item
                    name="Weight"
                    label="Weight"
                    rules={[
                      {
                        pattern: /^\d{1,3}$/,
                        message: "Please enter valid input for weight",
                      },
                    ]}
                  >
                    <Input addonAfter="Kg" onChange={onWeightChange} />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item name="BodyMassIndex" label="Body Mass Index">
                    <Input disabled value={heightWeightValues.BMI} />
                  </Form.Item>
                </Col>
              </Row>
              <Row
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                style={{ margin: "0px 10px" }}
              >
                <Col span={8}>
                  <Form.Item
                    name="HeadCircumference"
                    label="Head Circumference"
                    rules={[
                      {
                        pattern: /^\d{2,3}$/,
                        message:
                          "Please enter valid input for head circumference",
                      },
                    ]}
                  >
                    <Input addonAfter="cm" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="Temperature"
                    label="Temperature"
                    rules={[
                      {
                        pattern: /^\d{2,3}$/,
                        message: "Please enter valid input for Temperature",
                      },
                    ]}
                  >
                    <Input addonAfter={tempOptions} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="HeartRate"
                    label="Heart Rate"
                    rules={[
                      {
                        pattern: /^\d{2,3}$/,
                        message: "Please enter valid input for Heart Rate",
                      },
                    ]}
                  >
                    <Input addonAfter="bpm" />
                  </Form.Item>
                </Col>
              </Row>
              <Row
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                style={{ margin: "0px 10px" }}
              >
                <Col span={6}>
                  <Form.Item
                    name="SystolicBP"
                    label="Systolic BP "
                    rules={[
                      {
                        pattern: /^\d{2,3}$/,
                        message: "Please enter valid input for Systolic BP",
                      },
                    ]}
                  >
                    <Input addonAfter="mmHg" onChange={onSystolicBPChange} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="DiastolicBP"
                    label="Diastolic BP "
                    rules={[
                      {
                        pattern: /^\d{2,3}$/,
                        message: "Please enter valid input for Diastolic BP",
                      },
                    ]}
                  >
                    <Input addonAfter="mmHg" onChange={onDiastolicBPChange} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="MeanAtrialPressure"
                    label="Mean Atrial Pressure"
                  >
                    <Input
                      disabled
                      addonAfter="mmHg"
                      value={MAPValues.MeanAtrialPressure}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <p style={{ margin: "2px" }}>Position</p>
                  <div
                    style={{
                      // border: "1px solid #d6e4ff",
                      padding: "10px 10px",
                    }}
                  >
                    <Form.Item name="position">
                      <Radio.Group>
                        <Radio value="sitting">
                          <MdAirlineSeatReclineNormal
                            style={{ fontSize: 18 }}
                          />
                        </Radio>
                        <Radio value="supine">
                          <FaBed style={{ fontSize: 18 }} />
                        </Radio>
                        <Radio value="standing">
                          <BsPersonStanding style={{ fontSize: 18 }} />
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                style={{ margin: "0px 10px" }}
              >
                <Col span={6}>
                  <Form.Item
                    name="RespiratoryRate"
                    label="Respiratory Rate "
                    rules={[
                      {
                        pattern: /^\d{2,3}$/,
                        message:
                          "Please enter valid input for Respiratory Rate",
                      },
                    ]}
                  >
                    <Input addonAfter="(C/M)" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="OxygenSaturation"
                    label="SPO2 %"
                    rules={[
                      {
                        pattern: /^\d{2,3}$/,
                        message: "Please enter valid input for SPO2",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <div style={{ marginLeft: "10px" }}>
                    <p>Oedema</p>
                    <Form.Item name="oedema">
                      <Switch
                        size="large"
                        style={{ margin: "0px 5px" }}
                      ></Switch>
                    </Form.Item>
                  </div>
                </Col>
                <Col span={3}>
                  <div>
                    <p>Pallor</p>
                    <Form.Item name="pallor" style={{ margin: "0px 0px" }}>
                      <Switch size="large"></Switch>
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                // style={{ margin: "0px 10px" }}
              >
                <Col span={12} style={{ marginLeft: "25px" }}>
                  <Form.Item
                    name="otherComments"
                    label="Other Comments (if any)"
                  >
                    <TextArea
                      placeholder="Add your thoughts on capturing vitals"
                      autoSize={{
                        minRows: 2,
                        maxRows: 6,
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </Modal>
      </ConfigProvider>
    </Layout>
  );
};

export default PatientVitalSigns;
