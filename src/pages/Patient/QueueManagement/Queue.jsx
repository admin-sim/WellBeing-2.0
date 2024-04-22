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
} from "antd";
import { TimePicker } from "antd";
import Input from "antd/es/input";
import Form from "antd/es/form";
import { Modal, Table, Layout, Tag, Avatar } from "antd";
import Button from "antd/es/button";
import {
  urlGetAllPatients,
  urlGetPatientDetail,
  urlAddNewVisit,
  urlCancelVisit,
  urlGetAllQueues,
  urlGetProviderBasedOnDepartment,
  urlGetMarkArrival,
  urlAssignQueue,
  urlGetPatientVitalSigns,
  urlRevertCheckIn,
  urlPushPatientQueuePosition,
  urlAddNewPatientVital,
  urlStartConsultation,
  urlShowCloseConsultation,
  urlCloseConsultation,
  urlRevertToMarkArrival,
} from "../../../../endpoints";
import { CalendarFilled, UserAddOutlined } from "@ant-design/icons";
import { BiBody } from "react-icons/bi";
import { FaEdit, FaBed } from "react-icons/fa";
import { TbTemperatureCelsius, TbTemperatureFahrenheit } from "react-icons/tb";
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

const Queue = () => {
  const [patientDetails, setPatientDetails] = useState([]);
  const { Title } = Typography;
  const { TextArea } = Input;
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { Option } = Select;
  //   const [form1] = Form.useForm();
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [form1] = Form.useForm();
  const [form3] = Form.useForm();
  const [selectedPatientRecord, setSelectedPatientRecord] = useState([]); // New state variable to store selected record
  const [isShowSearchModalVisible, setIsShowSearchModalVisible] =
    useState(false);
  const [isMarkArrivalModalVisible, setIsMarkArrivalModalVisible] =
    useState(false);
  const [isPatientVitalSignsModalVisible, setIsPatientVitalSignsModalVisible] =
    useState(false);
  const [isCaptureVitalsModalVisible, setIsCaptureVitalsModalVisible] =
    useState(false);
  const [isRevertToCheckInModalVisible, setIsRevertToCheckInModalVisible] =
    useState(false);
  const [isPushPatientModalVisible, setIsPushPatientModalVisible] =
    useState(false);
  const [isStartConsultationModalVisible, setIsStartConsultationModalVisible] =
    useState(false);
  const [isCloseConsultationModalVisible, setIsCloseConsultationModalVisible] =
    useState(false);
  const [
    isRevertToMarkArrivalModalVisible,
    setIsRevertToMarkArrivalModalVisible,
  ] = useState(false);
  const [isAntenatalVitalsModalVisible, setIsAntenatalVitalsModalVisible] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [messageApi] = message.useMessage();

  const [Flag] = useState("ALL");
  const [Providers, setProviders] = useState([]);
  let [selectedProvider, setSelectedProvider] = useState(0);

  const [patientQueueDetails, setPatientQueueDetails] = useState([]);
  const [QueueDropDown, setQueueDropDown] = useState({
    Providers: [],
    // QueueAction: [],
    Departments: [],
    QueueStatus: [],
    DispositionType: [],
  });
  const [QueueActionDropdown, setQueueActionDropdown] = useState([]);
  const [NewQueueModel, setNewQueueModel] = useState([]);
  const [encounterDetails, setEncounterDetails] = useState([]);
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

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  function formatCaptureVitalsTime(date) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }

  useEffect(() => {
    debugger;
    const pr1 = selectedProvider || 0;
    const fl1 = Flag === "All" ? '""' : Flag;
    setLoading(true);
    customAxios
      .get(`${urlGetAllQueues}?ProviderId=${pr1}&Flag=${fl1}`)
      .then((response) => {
        const queueModel = response.data.data.QueueModel;
        const queueAction = response.data.data.QueueAction;

        const filteredQueueAction = filterQueueActions(queueModel, queueAction);
        setPatientQueueDetails(queueModel);
        setQueueDropDown(response.data.data);
        setQueueActionDropdown(filteredQueueAction);
        setLoading(false);
      });
  }, []);

  const formatDatefortable = (dateString) => {
    if (!dateString) return '""';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  };

  const formatTime = (inputTime) => {
    const formattedTime = dayjs(inputTime).format("HH:mm");
    return formattedTime;
  };

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
      const MAP = Math.floor(
        parseInt(systolicBP) / 3 + (2 * parseInt(diastolicBP)) / 3
      );
      setMAPValues((prevState) => ({
        ...prevState,
        MeanAtrialPressure: MAP,
      }));
      // setMAPValues({ ...MAPValues, MeanAtrialPressure: MAP });
      form2.setFieldsValue({ MeanAtrialPressure: MAP });
    }
  };

  const handleTimeChange = (time, timeString) => {
    debugger;
    setSelectedTime(dayjs(time));
    // form1.setFieldsValue({ConsultationTime:dayjs(time)})
  };

  const handleShowSearchModal = () => {
    debugger;
    // setSelectedRecord(record); // Set the selected record when the modal is opened

    setIsShowSearchModalVisible(true);
  };

  const handleShowSearchModalCancel = () => {
    // debugger;
    setIsShowSearchModalVisible(false);
    setProviders([]);
  };

  const handleDepartmentChange = async (value) => {
    debugger;
    try {
      // Update the options for the second select based on the value of the first select
      if (value != null) {
        const providerResponse = await customAxios.get(
          `${urlGetProviderBasedOnDepartment}?DepartmentId=${value}`
        );

        if (providerResponse.status === 200) {
          const provider = providerResponse.data.data.Provider;
          setProviders(provider);
        } else {
          console.error("Failed to fetch providers");
        }
      } else {
        // setProviders([]);
        // // form1.setFieldsValue({ ProviderId: null });
        // // form1.setFieldsValue({ ServiceLocationName: null });
        // form.resetFields(["Provider"]);
      }
    } catch (error) {
      // Handle errors (e.g., network issues)
      console.error("Error fetching data:", error);
    }
  };

  const filterQueueActions = (queueModel, queueAction) => {
    return queueModel.map((patient) => {
      let options = [...queueAction];
      if (patient.Gender !== 8) {
        options = options.filter(
          (option) => option.LookupDescription !== "Antenatal Vitals"
        );
        if (patient.Q_Status === "Awaiting Arrival") {
          options = options.filter((option) =>
            ["Mark Arrival", "Patient Vital Signs"].includes(
              option.LookupDescription
            )
          );
        } else if (patient.Q_Status === "Arrived") {
          options = options.filter((option) =>
            [
              "Patient Vital Signs",
              "Push Patient",
              "Revert To CheckIn",
              "Start Consultation",
            ].includes(option.LookupDescription)
          );
        } else if (patient.Q_Status === "Consultation In Progress") {
          options = options.filter((option) =>
            [
              "Patient Vital Signs",
              "Revert to MarkArrival",
              "Close Consultation",
            ].includes(option.LookupDescription)
          );
        } else if (patient.Q_Status === "Consulted") {
          options = options.filter((option) =>
            ["Patient Vital Signs"].includes(option.LookupDescription)
          );
        }
      } else {
        if (patient.Q_Status === "Awaiting Arrival") {
          options = options.filter((option) =>
            [
              "Mark Arrival",
              "Patient Vital Signs",
              "Antenatal Vitals",
            ].includes(option.LookupDescription)
          );
        } else if (patient.Q_Status === "Arrived") {
          options = options.filter((option) =>
            [
              "Patient Vital Signs",
              "Push Patient",
              "Revert To CheckIn",
              "Start Consultation",
              "Antenatal Vitals",
            ].includes(option.LookupDescription)
          );
        } else if (patient.Q_Status === "Consultation In Progress") {
          options = options.filter((option) =>
            [
              "Patient Vital Signs",
              "Revert to MarkArrival",
              "Close Consultation",
              "Antenatal Vitals",
            ].includes(option.LookupDescription)
          );
        } else if (patient.Q_Status === "Consulted") {
          options = options.filter((option) =>
            ["Patient Vital Signs", "Antenatal Vitals"].includes(
              option.LookupDescription
            )
          );
        }
      }

      return options;
    });
  };

  const handleSearchProvider = async () => {
    debugger;
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      selectedProvider = values.Provider || 0;
      console.log("values", values);

      try {
        // Send a POST request to the server
        const response = await customAxios.get(
          `${urlGetAllQueues}?ProviderId=${selectedProvider}&Flag=${values.QueueStatus}`,
          {
            headers: {
              "Content-Type": "application/json", // Replace with the appropriate content type if needed
              // Add any other required headers here
            },
          }
        );

        if (response.data != null) {
          setQueueDropDown(response.data.data);
          setLoading(false);
          setIsShowSearchModalVisible(false);
          form.resetFields(["Department", "Provider", "QStatus"]);
          const queueModel = response.data.data.QueueModel;
          const queueAction = response.data.data.QueueAction;
          setPatientQueueDetails(queueModel);
          const filteredQueueAction = filterQueueActions(
            queueModel,
            queueAction
          );
          setQueueActionDropdown(filteredQueueAction);
        }
        // Check if the request was successful
        if (response.status !== 200) {
          throw new Error(
            `Server responded with status code ${response.status}`
          );
        } else {
          //   messageApi.open({
          //     type: "success",
          //     content: `Successfully created visit for patient.`,
          //   });
        }
      } catch (error) {
        console.error("Failed to send data to server: ", error);
        // messageApi.open({
        //   type: "error",
        //   content: `Error creating visit for patient: ${error}.`,
        // });
      }
      setProviders([]);
      // Additional logic after the asynchronous operation
    } catch (error) {
      // Handle errors if needed
    }
  };

  const handleQueueActionSelect = async (value, option, record) => {
    debugger;
    console.log("check the selected value,option,key", value, option, record);
    setSelectedPatientRecord(record);
    setLoading(true);

    const fl1 = Flag === "All" ? '""' : Flag;
    if (option.children === "Mark Arrival") {
      try {
        const response = await customAxios.get(
          `${urlGetMarkArrival}?QId=${record.QId}&PatientID=${record.PatientId}&ProviderId=${record.ProviderId}&Flag=${fl1}&Encounter=${record.Encounterstr}`,
          {
            headers: {
              "Content-Type": "application/json", // Replace with the appropriate content type if needed
              // Add any other required headers here
            },
          }
        );

        if (response.status === 200) {
          setLoading(false);
          setIsMarkArrivalModalVisible(true);
          const queueMarkArrivalData = response.data.data.NewQueueModel;
          setNewQueueModel(queueMarkArrivalData);

          form1.setFieldsValue({
            TokenNo: queueMarkArrivalData.TokenNo,
          });

          // console.log("response data for mark arrival", queueMarkArrivalData);
        } else {
          console.error("Failed to fetch mark arrival data");
        }
      } catch (error) {
        console.log("error raised here", error);
      }
    } else if (option.children === "Patient Vital Signs") {
      try {
        const response = await customAxios.get(
          `${urlGetPatientVitalSigns}?PatientID=${record.PatientId}&ProviderId=${record.ProviderId}&Encounter=${record.Encounterstr}`,
          {
            headers: {
              "Content-Type": "application/json", // Replace with the appropriate content type if needed
              // Add any other required headers here
            },
          }
        );

        if (response.status === 200) {
          setLoading(false);
          setIsPatientVitalSignsModalVisible(true);
          const EncounterData = response.data.data.EncounterModel;
          setEncounterDetails(EncounterData);
        } else {
          console.error("Failed to fetch mark arrival data");
        }
      } catch (error) {
        console.log("error raised here", error);
      }
    } else if (option.children === "Revert To CheckIn") {
      setLoading(false);
      setIsRevertToCheckInModalVisible(true);
    } else if (option.children === "Push Patient") {
      setLoading(false);
      setIsPushPatientModalVisible(true);
    } else if (option.children === "Start Consultation") {
      setLoading(false);
      form1.setFieldsValue({ StartConsultationTime: dayjs() });
      setIsStartConsultationModalVisible(true);
    } else if (option.children === "Close Consultation") {
      setLoading(false);

      form1.setFieldsValue({ CloseConsultationTime: dayjs() });
      setIsCloseConsultationModalVisible(true);
    } else if (option.children === "Revert to MarkArrival") {
      setLoading(false);
      setIsRevertToMarkArrivalModalVisible(true);
    } else if (option.children === "Antenatal Vitals") {
      setLoading(false);
      setIsAntenatalVitalsModalVisible(true);
    }
  };

  const handleMarkArrivalModalCancel = () => {
    // debugger;
    setIsMarkArrivalModalVisible(false);
    form3.resetFields();
    setSelectedTime(null);
    // setProviders([]);
  };

  const handlePatientVitalSignsModalCancel = () => {
    // debugger;
    setIsPatientVitalSignsModalVisible(false);
    form3.resetFields();
    // setProviders([]);
  };

  const handleRevertToCheckInModalCancel = () => {
    // debugger;
    setIsRevertToCheckInModalVisible(false);
    form3.resetFields();
    // setProviders([]);
  };

  const handleCaptureVitals = () => {
    setIsPatientVitalSignsModalVisible(false);
    setIsCaptureVitalsModalVisible(true);
  };

  const handleCaptureVitalsModalCancel = () => {
    // debugger;
    setIsCaptureVitalsModalVisible(false);
    setIsPatientVitalSignsModalVisible(true);
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
  const handlePushPatientModalCancel = () => {
    // debugger;
    setIsPushPatientModalVisible(false);
    form3.resetFields();
    // setProviders([]);
  };

  const handleStartConsultationModalCancel = () => {
    // debugger;
    setIsStartConsultationModalVisible(false);
    setSelectedTime(null);
    form3.resetFields();
    // setProviders([]);
  };

  const handleCloseConsultationModalCancel = () => {
    // debugger;
    setIsCloseConsultationModalVisible(false);
    setSelectedTime(null);
    form3.resetFields();
    // setProviders([]);
  };
  const handleRevertToMarkArrivalModalCancel = () => {
    // debugger;
    setIsCloseConsultationModalVisible(false);
    form3.resetFields();
    // setProviders([]);
  };

  const openStartConsultationModal = () => {
    form1.setFieldsValue({ StartConsultationTime: dayjs() });
    setIsStartConsultationModalVisible(true);
    setIsMarkArrivalModalVisible(false);
  };

  const handleAntenatalVitalsModalCancel = () => {
    // debugger;
    setIsAntenatalVitalsModalVisible(false);
    form3.resetFields();
    // setProviders([]);
  };

  const handleAssignQueue = async () => {
    debugger;
    const inputvalues = form1.getFieldsValue();
    console.log("the assign Queue values", inputvalues);
    // const fl1 = Flag === "All" ? '"All"' : Flag;
    setIsMarkArrivalModalVisible(false);
    try {
      const response = await customAxios.post(
        `${urlAssignQueue}?QId=${selectedPatientRecord.QId}&QNo=${selectedPatientRecord.QNo}&ProviderId=${selectedPatientRecord.ProviderId}&Flag=${Flag}&TokenNo=${inputvalues.TokenNo}`,
        {
          headers: {
            "Content-Type": "application/json", // Replace with the appropriate content type if needed
            // Add any other required headers here
          },
        }
      );

      if (response.status === 200) {
        const queueModel = response.data.data.QueueModel;
        const queueAction = response.data.data.QueueAction;
        setPatientQueueDetails(response.data.data.QueueModel);
        const filteredQueueAction = filterQueueActions(queueModel, queueAction);
        setIsMarkArrivalModalVisible(false);
        setQueueActionDropdown(filteredQueueAction);
        form3.resetFields();
        notification.success({
          message: "Patient Assigned into Queue",
          // description: `The Patient with UHID ${selectedPatientRecord.UhId}  Token No is generated.`,
        });
      } else {
        console.error("Failed to fetch providers");
      }
    } catch (error) {
      console.log("error raised here", error);
    }
  };

  const handleConfirmCheckIn = async () => {
    debugger;

    const fl1 = Flag === "All" ? '""' : Flag;
    try {
      const response = await customAxios.post(
        `${urlRevertCheckIn}?QId=${selectedPatientRecord.QId}&QNo=${selectedPatientRecord.QNo}&Flag=${fl1}`,
        {
          headers: {
            "Content-Type": "application/json", // Replace with the appropriate content type if needed
            // Add any other required headers here
          },
        }
      );

      if (response.status === 200) {
        setIsRevertToCheckInModalVisible(false);
        const queueModel = response.data.data.QueueModel;
        const queueAction = response.data.data.QueueAction;
        setPatientQueueDetails(response.data.data.QueueModel);
        const filteredQueueAction = filterQueueActions(queueModel, queueAction);
        setQueueActionDropdown(filteredQueueAction);
        form3.resetFields();
        notification.success({
          message: "Patient successfully reverted to check-In",
          // description: `The Patient with UHID ${selectedPatientRecord.UhId}  reverted back to Check-In`,
        });
      } else {
        console.error("Failed to fetch providers");
        notification.error({
          message: "There persisted an error while reverted to check-In",
          // description: `The Patient with UHID ${selectedPatientRecord.UhId}  reverted back to Check-In`,
        });
      }
    } catch (error) {
      console.log("error raised here", error);
    }
  };

  const handlePushPatientPosition = async () => {
    debugger;
    const values = form1.getFieldsValue();
    //PushToQueue(long QID, int ProviderId, long PatientId, int QNo, int PushToPosition, string Flag)
    const fl1 = Flag === "All" ? '""' : Flag;
    try {
      const response = await customAxios.post(
        `${urlPushPatientQueuePosition}?QId=${selectedPatientRecord.QId}&ProviderId=${selectedPatientRecord.ProviderId}&QNo=${selectedPatientRecord.QNo}&Flag=${fl1}&PushToPosition=${values.PushToPosition}&PatientId=${selectedPatientRecord.PatientId}`,
        {
          headers: {
            "Content-Type": "application/json", // Replace with the appropriate content type if needed
            // Add any other required headers here
          },
        }
      );

      if (response.status === 200) {
        if (response.data === "Failure") {
          setIsPushPatientModalVisible(false);
          form3.resetFields();
          form1.resetFields();
          notification.error({
            // message: "There is no position exists to push.",
            description: `There is no position exists to push.`,
          });
        } else {
          setIsPushPatientModalVisible(false);
          const queueModel = response.data.data.QueueModel;
          const queueAction = response.data.data.QueueAction;
          setPatientQueueDetails(response.data.data.QueueModel);
          const filteredQueueAction = filterQueueActions(
            queueModel,
            queueAction
          );
          setQueueActionDropdown(filteredQueueAction);
          setIsPushPatientModalVisible(false);
          form3.resetFields();
          form1.resetFields();

          notification.success({
            message: "Patient Successfully Pushed To Position!",
            // description: `The Patient with UHID ${selectedPatientRecord.UhId}  reverted back to Check-In`,
          });
        }
      } else {
        console.error("Failed to  fetch patient details: ", response.status);
      }
    } catch {
      console.error("Error in pushing patient position");
    }
  };

  const handleSaveCaptureDetails = async () => {
    debugger;
    const values = form2.getFieldsValue();
    // console.log("error raised here", values);
    form2
      .validateFields()
      .then(async () => {
        const PatientVital = {
          QueueId: selectedPatientRecord.QId,
          PatientId: selectedPatientRecord.PatientId,
          EncounterId: selectedPatientRecord.EncounterId,
          Encounterstr: selectedPatientRecord.Encounterstr,
          Height: values.Height,
          Weight: values.Weight,
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
            const EncounterData = response.data.data.EncounterModel;
            setEncounterDetails(EncounterData);
            form2.resetFields();
            notification.success({
              message: "Patient Vitals Captured Successfully!",
            });
            setIsPatientVitalSignsModalVisible(true);
            setIsCaptureVitalsModalVisible(false);
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

  const handleConfirmStartConsultation = async () => {
    debugger;
    const inputvalues = form1.getFieldsValue();
    const formatedTime = inputvalues.StartConsultationTime.format("HH:mm:ss");
    const tokenNo =
      selectedPatientRecord.TokenNo === 0 ? 1 : selectedPatientRecord.TokenNo;
    console.log("start Consultations", formatedTime);

    try {
      const response = await customAxios.post(
        `${urlStartConsultation}?QId=${selectedPatientRecord.QId}&QNo=${selectedPatientRecord.QNo}&ConsultationStartTime=${formatedTime}&Flag=${Flag}&TokenNo=${tokenNo}`,
        {
          headers: {
            "Content-Type": "application/json", // Replace with the appropriate content type if needed
            // Add any other required headers here
          },
        }
      );
      if (response.status === 200) {
        if (response.data === "Failure") {
          setIsStartConsultationModalVisible(false);
          form3.resetFields();
          setSelectedTime(null);
          notification.error({
            message: "Something Went Wrong While starting consultation",
          });
        } else {
          setIsStartConsultationModalVisible(false);
          const queueModel = response.data.data.QueueModel;
          const queueAction = response.data.data.QueueAction;
          setPatientQueueDetails(response.data.data.QueueModel);
          const filteredQueueAction = filterQueueActions(
            queueModel,
            queueAction
          );
          setQueueActionDropdown(filteredQueueAction);
          setSelectedTime(null);
          form3.resetFields();
          notification.success({
            message: "Patient Consultation Started!",
          });
        }
      } else {
        notification.error({
          message: "Starting Consultation something went wrong",
        });
        console.error("Failed to fetch providers");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmCloseConsultation = async () => {
    debugger;
    const inputvalues = form1.getFieldsValue();
    const formatedTime = inputvalues.CloseConsultationTime.format("HH:mm:ss");
    console.log("start Consultations", formatedTime);
    // long QId, long PatientID, int ProviderId, int Disposition, string CloseConsultTime, string Flag

    try {
      const response = await customAxios.post(
        `${urlCloseConsultation}?QId=${selectedPatientRecord.QId}&ProviderId=${selectedPatientRecord.ProviderId}&PatientID=${selectedPatientRecord.PatientId}&Disposition=${inputvalues.DispositionType}&CloseConsultTime=${formatedTime}&Flag=${Flag}`,
        {
          headers: {
            "Content-Type": "application/json", // Replace with the appropriate content type if needed
            // Add any other required headers here
          },
        }
      );
      if (response.status === 200) {
        setIsCloseConsultationModalVisible(false);
        const queueModel = response.data.data.QueueModel;
        const queueAction = response.data.data.QueueAction;
        setPatientQueueDetails(response.data.data.QueueModel);
        const filteredQueueAction = filterQueueActions(queueModel, queueAction);
        setQueueActionDropdown(filteredQueueAction);
        setSelectedTime(null);
        form3.resetFields();
        notification.success({
          message: "Patient Consulted Successfully!",
        });
      } else {
        console.error("Failed to fetch providers");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmMarKArrival = async () => {
    debugger;

    const fl1 = Flag === "All" ? '""' : Flag;
    try {
      const response = await customAxios.post(
        `${urlRevertToMarkArrival}?QId=${selectedPatientRecord.QId}&QNo=${selectedPatientRecord.QNo}&Flag=${fl1}`,
        {
          headers: {
            "Content-Type": "application/json", // Replace with the appropriate content type if needed
            // Add any other required headers here
          },
        }
      );

      if (response.status === 200) {
        setIsRevertToMarkArrivalModalVisible(false);
        const queueModel = response.data.data.QueueModel;
        const queueAction = response.data.data.QueueAction;
        setPatientQueueDetails(response.data.data.QueueModel);
        const filteredQueueAction = filterQueueActions(queueModel, queueAction);
        setQueueActionDropdown(filteredQueueAction);
        form3.resetFields();
        notification.success({
          message: "Patient Marked Arrived!",
        });
      } else {
        console.error("Failed to fetch providers");
      }
    } catch (error) {
      console.log("error raised here", error);
    }
  };

  const columns = [
    {
      title: <span>Sl&nbsp;No</span>,
      key: "index",

      render: (text, record, index) => {
        const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
        return serialNumber;
      },
    },
    {
      title: <span>Q&nbsp;No</span>,
      dataIndex: "QNo",
      key: "QNo",
      render: (text, record) => (
        <Tag color="#f50">
          <div
            style={{
              width: 5,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <span style={{ fontWeight: "bold" }}>
              {record.QNo == -1 ? 0 : record.QNo}
            </span>
          </div>
        </Tag>
      ),
    },
    {
      title: <span>T&nbsp;No</span>,
      dataIndex: "TokenNo",
      key: "TokenNo",
      render: (text, record) => (
        <Tag color="#87d068">
          <div
            style={{
              width: 5,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <span style={{ fontWeight: "bold" }}>{record.TokenNo}</span>
          </div>
        </Tag>
      ),
    },
    {
      title: <span>UH&nbsp;ID</span>,
      dataIndex: "UhId",
      key: "UhId",
    },
    {
      title: <span>Encounter&nbsp;ID</span>,
      dataIndex: "Encounterstr",
      key: "Encounterstr",
    },
    {
      title: <span>Reg&nbsp;Time</span>,
      dataIndex: "EncounterRegTime",
      key: "EncounterRegTime",
      //   width: 30,
      render: (text, record) => (
        <div style={{ width: 40 }}>
          <p>
            <strong>{formatTime(record.RegistrationTime)}</strong>
          </p>
        </div>
      ),
    },
    {
      title: <span>App&nbsp;Time</span>,
      dataIndex: "appointmentTime",
      key: "appointmentTime",

      render: (text, record) => (
        <div style={{ width: 40 }}>
          <p>
            <strong>{formatTime(record.AppointmentTime)}</strong>
          </p>
        </div>
      ),
    },
    {
      title: <span>Patient&nbsp;Details</span>,
      dataIndex: "PatientDetails",
      key: "PatientDetails",

      render: (text, record) => (
        <div style={{ width: 170 }}>
          <p>
            <strong>Name:</strong> {record.PatientName}
            <br />
            <strong>Dob:</strong> {formatDatefortable(record.DateOfBirth)}
          </p>
        </div>
      ),
    },
    {
      title: <span>Visit&nbsp;Details</span>,
      dataIndex: "visitDetails",
      key: "visitDetails",

      render: (text, record) => (
        <div style={{ width: 215, fontSize: "12px" }}>
          <p>
            <strong>Patient Type:</strong> {record.PatientTypeName}
            <br />
            <strong>Department:</strong> {record.DepartementName}
            <br />
            <strong>Provider Name:</strong> {record.ProviderName}
            <br />
            <strong>Service Location:</strong> {record.ServiceLocation}
          </p>
        </div>
      ),
    },
    {
      title: <span>Status</span>,
      dataIndex: "Q_Status",
      key: "Q_Status",

      // render: (text, record) => (
      //   <div style={{ width: 90 }}>
      //     <p> {record.Q_Status}</p>
      //   </div>
      // ),
    },
    {
      title: <span>Action</span>,
      key: "actions",

      render: (text, record, index) => (
        <>
          <Form.Item name={[record.QId, "QueueAction"]}>
            <Select
              style={{ width: 180 }}
              onSelect={(value, option) =>
                handleQueueActionSelect(value, option, record)
              }
              loading={isLoading}
              allowClear
            >
              {QueueActionDropdown[index].map((option) => (
                <Select.Option key={option.LookupID} value={option.LookupID}>
                  {option.LookupDescription}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </>
      ),
    },
  ];

  const encounterColumns = [
    {
      title: <span>Sl&nbsp;No</span>,
      key: "index",

      render: (text, record, index) => {
        const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
        return serialNumber;
      },
    },
    {
      title: <span>Encounter&nbsp;ID</span>,
      dataIndex: "GeneratedEncounterId",
      key: "GeneratedEncounterId",
      width: 200,
    },
    {
      title: <span>Date&nbsp;of&nbsp;Visit</span>,
      dataIndex: "dateOfVisit",
      key: "dateOfVisit",
      render: (text, record, index) => (
        <div>
          <p>
            <span>
              {formatDatefortable(encounterDetails[index].EncounterDate)}
            </span>
          </p>
        </div>
      ),
    },
    {
      title: <span>Attending&nbsp;Doctor</span>,
      dataIndex: "AttendingDoctor",
      key: "AttendingDoctor",

      render: (text, record, index) => (
        <div>
          <p>
            <strong>{encounterDetails[index].ProviderName}</strong>
          </p>
        </div>
      ),
    },
    {
      title: <span>Department</span>,
      dataIndex: "department",
      key: "department",

      render: (text, record, index) => (
        <div>
          <p>
            <strong>{encounterDetails[index].DepartmentName}</strong>
          </p>
        </div>
      ),
    },

    {
      title: <span>Action</span>,
      key: "actions",

      render: (text, record, index) => (
        <>
          <FaEdit />
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
            <Col span={4}>
              <div
                style={{
                  //   padding: "0px  10px",
                  borderRadius: "1em",
                  display: "flex",
                  justifyContent: "start",
                  flexDirection: "column",
                  alignItems: "start",
                  color: "white",
                  width: "100%",
                  //   backgroundColor: "white",
                }}
              >
                <Title level={2} style={{ margin: "0px 0px", color: "white" }}>
                  Queue
                </Title>
              </div>
            </Col>
            <Col span={3} offset={7}>
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
            <Col span={1} offset={9}>
              <div
                style={{
                  //   padding: "0px  10px",
                  borderRadius: "1em",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <MdManageSearch
                  style={{
                    fontSize: "40px",
                    color: "white",
                    marginRight: "20px",
                  }}
                  onClick={handleShowSearchModal}
                />
              </div>
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
                <Form key={selectedPatientRecord.QId} form={form3}>
                  <Table
                    dataSource={patientQueueDetails}
                    columns={columns}
                    rowKey={(row) => row.QId}
                    size="small"
                    className="custom-table"
                    scroll={{ x: 1000 }}
                    onChange={(pagination) => {
                      setCurrentPage(pagination.current);
                      setItemsPerPage(pagination.pageSize);
                    }}
                    bordered
                  />
                </Form>
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
          width={800}
          title="Search By Provider"
          open={isShowSearchModalVisible}
          onOk={handleSearchProvider}
          onCancel={handleShowSearchModalCancel}
          okText="Search"
          maskClosable={false}
        >
          <div>
            <Form
              //   key={selectedRecord.PatientId}
              form={form}
              layout="vertical"
              initialValues={{
                QueueStatus: "All",
                // Provider: "0",
                // Department: "0",
              }}
            >
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={8}>
                  <Form.Item
                    name="Department"
                    label="Department"
                    rules={[
                      {
                        required: true,
                        // message: "Please select title",
                      },
                    ]}
                  >
                    <Select onChange={handleDepartmentChange} allowClear>
                      {QueueDropDown.Departments.map((option) => (
                        <Select.Option
                          key={option.DepartmentId}
                          value={option.DepartmentId}
                        >
                          {option.DepartmentName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="Provider"
                    label="Provider"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select allowClear>
                      {/* <Select.Option key="all" value="0">
                            SELECT VALUE
                          </Select.Option> */}
                      {Providers.map((option) => (
                        <Select.Option
                          key={option.ProviderId}
                          value={option.ProviderId}
                        >
                          {option.ProviderName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="QueueStatus" label="Queue&nbsp;Status">
                    <Select allowClear>
                      <Select.Option key="all" value="All">
                        ALL
                      </Select.Option>
                      {QueueDropDown.QueueStatus.map((option) => (
                        <Select.Option
                          key={option.LookupID}
                          value={option.LookupDescription}
                        >
                          {option.LookupDescription}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
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
          width={900}
          title="MarkArrivalModal"
          open={isMarkArrivalModalVisible}
          onCancel={handleMarkArrivalModalCancel}
          maskClosable={false}
          footer={[
            <Button
              key="start"
              type="primary"
              onClick={openStartConsultationModal}
            >
              Start Consultation
            </Button>,

            <Button
              key="ok"
              type="primary"
              onClick={handleAssignQueue}
              // disabled={IsVisitCreated}
            >
              Assign Queue
            </Button>,
            <Button key="cancel" onClick={handleMarkArrivalModalCancel}>
              Close
            </Button>,
          ]}
        >
          <div>
            <div
              style={{
                padding: "16px",
                borderRadius: "4px",
                margin: "10px",
                // display: "flex",
                // border: "1px solid #d9d9d9",
                // justifyContent: "space-between",
                boxShadow: "0px 0px 2px 2px rgba(86,144,199,1)",
              }}
            >
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                    UHID:
                  </span>
                  <span>
                    {selectedPatientRecord && selectedPatientRecord.UhId}
                  </span>
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
                  <span style={{ fontWeight: "bold" }}>PatientGender:</span>
                  <span>
                    {selectedPatientRecord &&
                      selectedPatientRecord.PatientGender}
                  </span>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                    VisitId:
                  </span>
                  <span>
                    {selectedPatientRecord &&
                      selectedPatientRecord.Encounterstr}
                  </span>
                </Col>
                <Col span={8}>
                  <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                    Age:
                  </span>
                  <span>
                    {selectedPatientRecord && selectedPatientRecord.Age}
                  </span>
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
            <Form
              key={selectedPatientRecord.QId}
              form={form1}
              layout="vertical"
            >
              <Row
                style={{ margin: "24px 0px" }}
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              >
                <Col span={8}>
                  <div style={{ width: "80%" }}>
                    <span style={{ fontWeight: "bold", margin: "8px" }}>
                      Service Location
                    </span>
                    <p style={{ margin: "8px" }}>
                      {selectedPatientRecord &&
                        selectedPatientRecord.ServiceLocation}
                    </p>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ width: "60%" }}>
                    <span style={{ fontWeight: "bold", margin: "8px" }}>
                      Visit Reason
                    </span>
                    <p style={{ margin: "8px" }}>
                      {selectedPatientRecord && selectedPatientRecord.Reason}
                    </p>
                  </div>
                </Col>

                <Col span={8}>
                  <div style={{ width: "80%" }}>
                    <span style={{ fontWeight: "bold", margin: "8px" }}>
                      Appointment Time
                    </span>
                    <p style={{ margin: "8px" }}>
                      {selectedPatientRecord &&
                        selectedPatientRecord.AppointmentTime}
                    </p>
                  </div>
                </Col>
              </Row>
              <Row
                style={{ marginLeft: "8px" }}
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              >
                <Col span={6}>
                  <Form.Item name="TokenNo" label="Token no">
                    <Input allowClear />
                  </Form.Item>
                </Col>
                <Col span={8} offset={1}>
                  <div style={{ width: "70%" }}>
                    <span style={{ fontWeight: "bold", margin: "10px 8px" }}>
                      Current Queue Length
                    </span>
                    <p style={{ margin: "10px" }}>
                      {NewQueueModel && NewQueueModel.QLength}
                    </p>
                  </div>
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
          width={900}
          title="PATIENT VITAL SIGNS"
          open={isPatientVitalSignsModalVisible}
          onCancel={handlePatientVitalSignsModalCancel}
          maskClosable={false}
          footer={[
            <Button
              key="cancel"
              type="default"
              onClick={handlePatientVitalSignsModalCancel}
            >
              Close
            </Button>,
          ]}
        >
          <div>
            <div
              style={{
                padding: "16px",
                borderRadius: "4px",
                margin: "10px",
                // display: "flex",
                // border: "1px solid #d9d9d9",
                // justifyContent: "space-between",
                boxShadow: "0px 0px 2px 2px rgba(86,144,199,1)",
              }}
            >
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                    UHID:
                  </span>
                  <span>
                    {selectedPatientRecord && selectedPatientRecord.UhId}
                  </span>
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
                  <span style={{ fontWeight: "bold" }}>PatientGender:</span>
                  <span>
                    {selectedPatientRecord &&
                      selectedPatientRecord.PatientGender}
                  </span>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                    VisitId:
                  </span>
                  <span>
                    {selectedPatientRecord &&
                      selectedPatientRecord.Encounterstr}
                  </span>
                </Col>
                <Col span={8}>
                  <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                    Age:
                  </span>
                  <span>
                    {selectedPatientRecord && selectedPatientRecord.Age}
                  </span>
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
              <Col span={1} offset={19}>
                <Button
                  type="primary"
                  size="middle"
                  style={{
                    margin: "0px 17px",
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
                    dataSource={encounterDetails}
                    columns={encounterColumns}
                    rowKey={(row) => row.PatientVitalId}
                    size="small"
                    className="custom-table"
                    // scroll={{ x: 300 }}
                    // onChange={(pagination) => {
                    //   setCurrentPage(pagination.current);
                    //   setItemsPerPage(pagination.pageSize);
                    // }}
                    bordered
                  />
                </Col>
              </Row>
            </Spin>
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
              key={selectedPatientRecord.PatientId}
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
      <ConfigProvider
        theme={{
          token: {
            zIndexPopupBase: 3000,
          },
        }}
      >
        {/* {contextHolder} */}
        <Modal
          width={600}
          title="REVERT TO CHECK-IN"
          open={isRevertToCheckInModalVisible}
          onOk={handleConfirmCheckIn}
          // okButtonProps={{ disabled: IsVisitCreated }}
          onCancel={handleRevertToCheckInModalCancel}
          okText="Yes"
          cancelText="No"
          maskClosable={false}
        >
          <Row
            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            style={{ margin: "0px 10px" }}
          >
            <Col span={20}>
              <strong>
                Are you sure you want to revert this patient to Check In?{" "}
              </strong>
            </Col>
          </Row>
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
          width={900}
          title="PUSH PATIENT"
          open={isPushPatientModalVisible}
          onCancel={handlePushPatientModalCancel}
          maskClosable={false}
          footer={[
            <Button
              key="ok"
              type="primary"
              onClick={handlePushPatientPosition}
              // disabled={IsVisitCreated}
            >
              Push Patient
            </Button>,
            <Button key="cancel" onClick={handlePushPatientModalCancel}>
              Cancel
            </Button>,
          ]}
        >
          <div>
            <div
              style={{
                padding: "16px",
                borderRadius: "4px",
                margin: "10px",
                // display: "flex",
                // border: "1px solid #d9d9d9",
                // justifyContent: "space-between",
                boxShadow: "0px 0px 2px 2px rgba(86,144,199,1)",
              }}
            >
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                    UHID:
                  </span>
                  <span>
                    {selectedPatientRecord && selectedPatientRecord.UhId}
                  </span>
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
                  <span style={{ fontWeight: "bold" }}>PatientGender:</span>
                  <span>
                    {selectedPatientRecord &&
                      selectedPatientRecord.PatientGender}
                  </span>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                    VisitId:
                  </span>
                  <span>
                    {selectedPatientRecord &&
                      selectedPatientRecord.Encounterstr}
                  </span>
                </Col>
                <Col span={8}>
                  <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                    Age:
                  </span>
                  <span>
                    {selectedPatientRecord && selectedPatientRecord.Age}
                  </span>
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
            <Form
              key={selectedPatientRecord.QId}
              form={form1}
              layout="vertical"
            >
              <Row
                style={{ margin: "24px 0px" }}
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              >
                <Col span={8}>
                  <div style={{ width: "80%" }}>
                    <span style={{ fontWeight: "bold", margin: "8px" }}>
                      Service Location
                    </span>
                    <p style={{ margin: "8px" }}>
                      {selectedPatientRecord &&
                        selectedPatientRecord.ServiceLocation}
                    </p>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ width: "60%" }}>
                    <span style={{ fontWeight: "bold", margin: "8px" }}>
                      Provider
                    </span>
                    <p style={{ margin: "8px" }}>
                      {selectedPatientRecord &&
                        selectedPatientRecord.ProviderName}
                    </p>
                  </div>
                </Col>
              </Row>
              <Row
                style={{ marginLeft: "8px" }}
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              >
                <Col span={6}>
                  <Form.Item name="PushToPosition" label="Push to Position">
                    <Input allowClear />
                  </Form.Item>
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
          width={600}
          title="START CONSULTATION"
          open={isStartConsultationModalVisible}
          onCancel={handleStartConsultationModalCancel}
          onOk={handleConfirmStartConsultation}
          okText="Start"
          cancelText="Cancel"
          maskClosable={false}
        >
          <Form
            form={form1}
            layout="vertical"
            initialValues={{ StartConsultationTime: selectedTime }}
          >
            <Row
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              style={{ margin: "0px 5px" }}
            >
              <Col span={20}>
                <strong>
                  Are you sure you want to start consultation for this patient?
                </strong>
              </Col>
            </Row>
            <Row
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              style={{ margin: "10px 5px" }}
            >
              <Col span={10}>
                <Form.Item name="StartConsultationTime">
                  <TimePicker onChange={handleTimeChange} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
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
          width={600}
          title="CLOSE CONSULTATION"
          open={isCloseConsultationModalVisible}
          onCancel={handleCloseConsultationModalCancel}
          onOk={handleConfirmCloseConsultation}
          okText="Save"
          cancelText="Cancel"
          maskClosable={false}
        >
          <div>
            <div
              style={{
                padding: "16px",
                borderRadius: "4px",
                margin: "10px",
                // display: "flex",
                // border: "1px solid #d9d9d9",
                // justifyContent: "space-between",
                boxShadow: "0px 0px 2px 2px rgba(86,144,199,1)",
              }}
            >
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                    UHID:
                  </span>
                  <span>
                    {selectedPatientRecord && selectedPatientRecord.UhId}
                  </span>
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
                  <span style={{ fontWeight: "bold" }}>PatientGender:</span>
                  <span>
                    {selectedPatientRecord &&
                      selectedPatientRecord.PatientGender}
                  </span>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                    VisitId:
                  </span>
                  <span>
                    {selectedPatientRecord &&
                      selectedPatientRecord.Encounterstr}
                  </span>
                </Col>
                <Col span={8}>
                  <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                    Age:
                  </span>
                  <span>
                    {selectedPatientRecord && selectedPatientRecord.Age}
                  </span>
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
            <Form
              key={selectedPatientRecord.QId}
              form={form1}
              layout="vertical"
              initialValues={{ CloseConsultationTime: selectedTime }}
            >
              <Row
                style={{ margin: "24px 0px" }}
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              >
                <Col span={12}>
                  <div style={{ width: "80%" }}>
                    <span style={{ fontWeight: "bold", margin: "8px" }}>
                      Service Location
                    </span>
                    <p style={{ margin: "8px" }}>
                      {selectedPatientRecord &&
                        selectedPatientRecord.ServiceLocation}
                    </p>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ width: "60%" }}>
                    <span style={{ fontWeight: "bold", margin: "8px" }}>
                      Provider
                    </span>
                    <p style={{ margin: "8px" }}>
                      {selectedPatientRecord &&
                        selectedPatientRecord.ProviderName}
                    </p>
                  </div>
                </Col>
              </Row>
              <Row
                style={{ marginLeft: "8px" }}
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              >
                <Col span={10}>
                  <Form.Item name="DispositionType" label="Disposition Type">
                    <Select allowClear>
                      {QueueDropDown.DispositionType.map((option) => (
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
                <Col span={10} offset={1}>
                  <Form.Item
                    name="CloseConsultationTime"
                    label="Close Consult Time"
                  >
                    <TimePicker onChange={handleTimeChange} />
                  </Form.Item>
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
          width={600}
          title="Revert To Mark Arrival"
          open={isRevertToMarkArrivalModalVisible}
          onOk={handleConfirmMarKArrival}
          // okButtonProps={{ disabled: IsVisitCreated }}
          onCancel={handleRevertToMarkArrivalModalCancel}
          okText="Yes"
          cancelText="No"
          maskClosable={false}
        >
          <Row
            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            style={{ margin: "0px 10px" }}
          >
            <Col span={20}>
              <strong>
                Are you sure you want to revert this patient to Mark Arrival?{" "}
              </strong>
            </Col>
          </Row>
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
          width={1000}
          title="ANTENATAL VITALS"
          open={isAntenatalVitalsModalVisible}
          onCancel={handleAntenatalVitalsModalCancel}
          // onOk={handleConfirmCloseConsultation}
          okText="Save"
          cancelText="Cancel"
          maskClosable={false}
        >
          <div>
            <div
              style={{
                padding: "16px",
                borderRadius: "4px",
                margin: "10px",
                boxShadow: "0px 0px 2px 2px rgba(86,144,199,1)",
              }}
            >
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                    UHID:
                  </span>
                  <span>
                    {selectedPatientRecord && selectedPatientRecord.UhId}
                  </span>
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
                  <span style={{ fontWeight: "bold" }}>PatientGender:</span>
                  <span>
                    {selectedPatientRecord &&
                      selectedPatientRecord.PatientGender}
                  </span>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                    VisitId:
                  </span>
                  <span>
                    {selectedPatientRecord &&
                      selectedPatientRecord.Encounterstr}
                  </span>
                </Col>
                <Col span={8}>
                  <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                    Age:
                  </span>
                  <span>
                    {selectedPatientRecord && selectedPatientRecord.Age}
                  </span>
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
          </div>
        </Modal>
      </ConfigProvider>
    </>
  );
};

export default Queue;
