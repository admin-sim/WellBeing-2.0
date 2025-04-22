import customAxios from "../../../components/customAxios/customAxios.jsx";
import React, { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router";
import {
  ColWithEightSpan,
  ColWithSixSpan,
} from "../../../components/customGridColumns/index.jsx";
import {
  Col,
  ConfigProvider,
  Row,
  Select,
  Typography,
  Spin,
  notification,
  Tooltip,
} from "antd";
import { TimePicker } from "antd";
import Input from "antd/es/input";
import Form from "antd/es/form";
import { Modal, Table, Layout, Tag } from "antd";
import Button from "antd/es/button";
import {
  urlGetAllQueues,
  urlGetProviderBasedOnDepartment,
  urlGetMarkArrival,
  urlAssignQueue,
  urlRevertCheckIn,
  urlPushPatientQueuePosition,
  urlStartConsultation,
  urlCloseConsultation,
  urlRevertToMarkArrival,
  urlGetPatientHeaderDetails,
} from "../../../../endpoints";
import "../../Patient/style.css";
import dayjs from "dayjs";
import { MdManageSearch } from "react-icons/md";
import { message } from "antd";
import "../style.css";
import PatientHeader from "../../../components/PatientHeader/index.jsx";

const Queue = () => {
  const [patientHeaderDetails, setPatientHeaderDetails] = useState([]);
  const { Title } = Typography;
  const [isLoading, setLoading] = useState(false);
  const [serachLoading, setSearchLoading] = useState(false);
  const [assignTokenLoader, setAssignTokenLoader] = useState(false);
  const [pushPatientLoader, setPushPatientLoader] = useState(false);
  const [revertToCheckInLoader, setRevertToCheckInLoader] = useState(false);
  const [startConsLoader, setStartConsLoader] = useState(false);
  const [closeConsLoader, setCloseConsLoader] = useState(false);
  const navigate = useNavigate();
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
  const [formSubmitted, setFormSubmitted] = useState(false);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatients = patientQueueDetails.slice(startIndex, endIndex);
  const totalPatients = patientQueueDetails.length;

  useEffect(() => {
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

  const handleTimeChange = (time, timeString) => {
    setSelectedTime(dayjs(time));
    // form1.setFieldsValue({ConsultationTime:dayjs(time)})
  };

  const handleShowSearchModal = () => {
    // setSelectedRecord(record); // Set the selected record when the modal is opened

    setIsShowSearchModalVisible(true);
  };

  const handleShowSearchModalCancel = () => {
    //
    setIsShowSearchModalVisible(false);
    setProviders([]);
  };

  const handleDepartmentChange = async (value) => {
    try {
      // Update the options for the second select based on the value of the first select
      if (value != null) {
        const providerResponse = await customAxios.get(
          `${urlGetProviderBasedOnDepartment}?DepartmentId=${value}`
        );

        if (providerResponse.status === 200) {
          const provider = providerResponse.data.data.Providers;
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

  // const filterQueueActions = (queueModel, queueAction) => {
  //   return queueModel.map((patient) => {
  //     let options = [...queueAction];
  //     if (patient.Gender !== 8) {
  //       options = options.filter(
  //         (option) => option.LookupDescription !== "Antenatal Vitals"
  //       );
  //       if (patient.Q_Status === "Awaiting Arrival") {
  //         options = options.filter((option) =>
  //           ["Mark Arrival", "Patient Vital Signs"].includes(
  //             option.LookupDescription
  //           )
  //         );
  //       } else if (patient.Q_Status === "Arrived") {
  //         options = options.filter((option) =>
  //           [
  //             "Patient Vital Signs",
  //             "Push Patient",
  //             "Revert To CheckIn",
  //             "Start Consultation",
  //           ].includes(option.LookupDescription)
  //         );
  //       } else if (patient.Q_Status === "Consultation In Progress") {
  //         options = options.filter((option) =>
  //           [
  //             "Patient Vital Signs",
  //             "Revert to MarkArrival",
  //             "Close Consultation",
  //           ].includes(option.LookupDescription)
  //         );
  //       } else if (patient.Q_Status === "Consulted") {
  //         options = options.filter((option) =>
  //           ["Patient Vital Signs"].includes(option.LookupDescription)
  //         );
  //       }
  //     } else {
  //       if (patient.Q_Status === "Awaiting Arrival") {
  //         options = options.filter((option) =>
  //           [
  //             "Mark Arrival",
  //             "Patient Vital Signs",
  //             "Antenatal Vitals",
  //           ].includes(option.LookupDescription)
  //         );
  //       } else if (patient.Q_Status === "Arrived") {
  //         options = options.filter((option) =>
  //           [
  //             "Patient Vital Signs",
  //             "Push Patient",
  //             "Revert To CheckIn",
  //             "Start Consultation",
  //             "Antenatal Vitals",
  //           ].includes(option.LookupDescription)
  //         );
  //       } else if (patient.Q_Status === "Consultation In Progress") {
  //         options = options.filter((option) =>
  //           [
  //             "Patient Vital Signs",
  //             "Revert to MarkArrival",
  //             "Close Consultation",
  //             "Antenatal Vitals",
  //           ].includes(option.LookupDescription)
  //         );
  //       } else if (patient.Q_Status === "Consulted") {
  //         options = options.filter((option) =>
  //           ["Patient Vital Signs", "Antenatal Vitals"].includes(
  //             option.LookupDescription
  //           )
  //         );
  //       }
  //     }

  //     return options;
  //   });
  // };

  const filterQueueActions = (queueModel, queueAction) => {
    return queueModel.map((patient) => {
      let options = [...queueAction];
  
      // Remove "Antenatal Vitals" unconditionally
      options = options.filter(option => option.LookupDescription !== "Antenatal Vitals");
  
      if (patient.Q_Status === "Awaiting Arrival") {
        options = options.filter((option) =>
          ["Mark Arrival", "Patient Vital Signs"].includes(option.LookupDescription)
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
  
      return options;
    });
  };  

  const handleSearchProvider = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      selectedProvider = values.Provider || 0;
      console.log("values", values);
      setSearchLoading(true);
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
          setSearchLoading(false);
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
          setSearchLoading(false);
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

        const response1 = await customAxios.get(
          `${urlGetPatientHeaderDetails}?PatientId=${record.PatientId}&&EncounterId=${record.EncounterId}`
        );

        if (response.status === 200 && response1.status === 200) {
          setLoading(false);
          setPatientHeaderDetails(response1.data.data.EncounterModel);
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
      const url = `/PatientVitalSigns`;
      console.log(url);
      // navigate(url);
      navigate(url, {
        state: {
          PatientRecord: record,
        },
      });
    } else if (option.children === "Revert To CheckIn") {
      setLoading(false);
      setIsRevertToCheckInModalVisible(true);
    } else if (option.children === "Push Patient") {
      try {
        const response = await customAxios.get(
          `${urlGetPatientHeaderDetails}?PatientId=${record.PatientId}&&EncounterId=${record.EncounterId}`
        );
        if (response.status === 200) {
          setLoading(false);
          const HeaderDetails = response.data.data.EncounterModel;
          setPatientHeaderDetails(HeaderDetails);
          setIsPushPatientModalVisible(true);
        }
      } catch (error) {
        console.log("error raised here", error);
      }
    } else if (option.children === "Start Consultation") {
      setLoading(false);
      form1.setFieldsValue({ StartConsultationTime: dayjs() });
      setIsStartConsultationModalVisible(true);
    } else if (option.children === "Close Consultation") {
      try {
        const response = await customAxios.get(
          `${urlGetPatientHeaderDetails}?PatientId=${record.PatientId}&&EncounterId=${record.EncounterId}`
        );
        if (response.data !== null) {
          setLoading(false);
          const HeaderDetails = response.data.data.EncounterModel;
          setPatientHeaderDetails(HeaderDetails);
          form1.setFieldsValue({ CloseConsultationTime: dayjs() });
          setIsCloseConsultationModalVisible(true);
        }
      } catch (error) {
        console.log("error raised here", error);
      }
    } else if (option.children === "Revert to MarkArrival") {
      setLoading(false);
      setIsRevertToMarkArrivalModalVisible(true);
    } else if (option.children === "Antenatal Vitals") {
      try {
        const response = await customAxios.get(
          `${urlGetPatientHeaderDetails}?PatientId=${record.PatientId}&&EncounterId=${record.EncounterId}`
        );
        if (response.data !== null) {
          setLoading(false);
          const HeaderDetails = response.data.data.EncounterModel;
          setPatientHeaderDetails(HeaderDetails);
          setIsAntenatalVitalsModalVisible(true);
        }
      } catch (error) {
        console.log("error raised here", error);
      }
    }
  };

  const handleMarkArrivalModalCancel = () => {
    //
    setIsMarkArrivalModalVisible(false);
    form3.resetFields();
    setSelectedTime(null);
    form1.resetFields();
    // setProviders([]);
  };

  const handleRevertToCheckInModalCancel = () => {
    //
    setIsRevertToCheckInModalVisible(false);
    form3.resetFields();
    // setProviders([]);
  };

  const handlePushPatientModalCancel = () => {
    //
    setIsPushPatientModalVisible(false);
    form3.resetFields();
    form1.resetFields();
    // setProviders([]);
  };

  const handleStartConsultationModalCancel = () => {
    //
    setIsStartConsultationModalVisible(false);
    setSelectedTime(null);
    form3.resetFields();

    // setProviders([]);
  };

  const handleCloseConsultationModalCancel = () => {
    //
    setIsCloseConsultationModalVisible(false);
    setSelectedTime(null);
    form3.resetFields();
    form1.resetFields();
    // setProviders([]);
  };
  const handleRevertToMarkArrivalModalCancel = () => {
    //
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
    //
    setIsAntenatalVitalsModalVisible(false);
    form3.resetFields();
    // setProviders([]);
  };

  const handleAssignQueue = async () => {
    const inputvalues = await form1.validateFields();
    console.log("the assign Queue values", inputvalues);
    // const fl1 = Flag === "All" ? '"All"' : Flag;

    setFormSubmitted(true);

    setAssignTokenLoader(true);
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
        setIsMarkArrivalModalVisible(false);
        setAssignTokenLoader(false);
        if (response.data.data.QueueMessage !== null) {
          const queueModel = response.data.data.QueueModel;
          const queueAction = response.data.data.QueueAction;
          setPatientQueueDetails(response.data.data.QueueModel);
          const filteredQueueAction = filterQueueActions(
            queueModel,
            queueAction
          );
          setIsMarkArrivalModalVisible(false);
          setFormSubmitted(false);
          setQueueActionDropdown(filteredQueueAction);
          form3.resetFields();
          notification.warning({
            message: "Token number already exists.",
          });
        } else {
          const queueModel = response.data.data.QueueModel;
          const queueAction = response.data.data.QueueAction;
          setPatientQueueDetails(response.data.data.QueueModel);
          const filteredQueueAction = filterQueueActions(
            queueModel,
            queueAction
          );
          setIsMarkArrivalModalVisible(false);
          setFormSubmitted(false);
          setQueueActionDropdown(filteredQueueAction);
          form3.resetFields();
          notification.success({
            message: "Patient Assigned into Queue",
            // description: `The Patient with UHID ${selectedPatientRecord.UhId}  Token No is generated.`,
          });
        }
      } else {
        console.error("Failed to fetch providers");
      }
    } catch (error) {
      console.log("error raised here", error);
    }
  };

  const handleConfirmCheckIn = async () => {
    setRevertToCheckInLoader(true);
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
        setRevertToCheckInLoader(false);
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
    const values = await form1.validateFields();
    setPushPatientLoader(true);
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
        setPushPatientLoader(false);
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

  const handleConfirmStartConsultation = async () => {
    const inputvalues = form1.getFieldsValue();
    const formatedTime = inputvalues.StartConsultationTime.format("HH:mm:ss");
    const tokenNo =
      selectedPatientRecord.TokenNo === 0 ? 1 : selectedPatientRecord.TokenNo;
    console.log("start Consultations", formatedTime);
    setStartConsLoader(true);
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
        setStartConsLoader(false);
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
    const inputvalues = await form1.validateFields();
    const formatedTime = inputvalues.CloseConsultationTime.format("HH:mm:ss");
    //console.log("close Consultations", formatedTime);
    // long QId, long PatientID, int ProviderId, int Disposition, string CloseConsultTime, string Flag
    setCloseConsLoader(true);
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
        setCloseConsLoader(false);
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

  return (
    <>
      <Layout
        style={{
          width: "100%",
          backgroundColor: "white",
          minHeight: "max-content",
          borderRadius: "10px",
        }}
      >
        <Row
          style={{
            padding: "0.5rem 1.5rem 0.5rem 1.5rem",
            backgroundColor: "#40A2E3",
            borderRadius: "10px 10px 0px 0px",
          }}
        >
          <Col
            span={24}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title
              level={4}
              style={{
                color: "white",
                fontWeight: 500,
                margin: 0,
                paddingTop: 0,
              }}
            >
              Queue
            </Title>
            <Col>
              <Tooltip title="Number of Patients in Queue" placement="bottom">
                <span style={{ display: "flex", alignItems: "center" }}>
                  <FaUsers style={{ fontSize: "30px", color: "#fff" }} />
                  <div
                    style={{
                      height: "1rem",
                      color: "#fff",
                      padding: "0.5rem",
                      fontSize: "1.5rem",
                      display: "flex",
                      alignItems: "center",
                      fontWeight: 600,
                    }}
                  >
                    {patientQueueDetails?.length}
                  </div>
                </span>
              </Tooltip>
            </Col>
            <Tooltip title="Search" placement="bottom">
              <Button
                type="link"
                style={{ color: "#fff", fontSize: "2rem" }}
                size="middle"
                className="dfja"
                icon={<MdManageSearch />}
                onClick={handleShowSearchModal}
              />
            </Tooltip>
          </Col>
        </Row>
        <div style={{ width: "100%" }}>
          <Row
            gutter={16}
            style={{ margin: "1rem 0 0 0.5rem", width: "inherit" }}
          >
            <Col span={24}>
              {/* <Title level={4}> List of Patients in queue</Title> */}
              <Title level={5}>
                Showing {startIndex + totalPatients ? 1 : 0} to{" "}
                {Math.min(endIndex, totalPatients)} of {totalPatients} Patients
              </Title>
            </Col>
          </Row>
        </div>
        <Spin spinning={isLoading}>
          <Row gutter={16}>
            <Col span={24}>
              <Form
                key={selectedPatientRecord.QId}
                form={form3}
                style={{ margin: "0 0.5rem" }}
              >
                <Table
                  dataSource={patientQueueDetails}
                  columns={columns}
                  rowKey={(row) => row.QId}
                  size="small"
                  className="custom-table"
                  scroll={{ x: 1000 }}
                  // onChange={(pagination) => {
                  //   setCurrentPage(pagination.current);
                  //   setItemsPerPage(pagination.pageSize);
                  // }}
                  pagination={{
                    current: currentPage,
                    pageSize: itemsPerPage,
                    total: totalPatients,
                    onChange: (page, pageSize) => {
                      setCurrentPage(page);
                      setItemsPerPage(pageSize);
                    },
                  }}
                  bordered
                />
              </Form>
            </Col>
          </Row>
        </Spin>
      </Layout>

      <Modal
        width="50rem"
        title="Search By Provider"
        open={isShowSearchModalVisible}
        onOk={handleSearchProvider}
        onCancel={handleShowSearchModalCancel}
        okText="Search"
        cancelButtonProps={{ danger: "true" }}
        maskClosable={false}
        confirmLoading={serachLoading}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            QueueStatus: "All",
          }}
        >
          <Row gutter={16}>
            <ColWithEightSpan>
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
            </ColWithEightSpan>
            <ColWithEightSpan>
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
            </ColWithEightSpan>
            <ColWithEightSpan>
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
            </ColWithEightSpan>
          </Row>
        </Form>
      </Modal>

      <Modal
        width="60rem"
        title="Mark Arrival"
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
            loading={assignTokenLoader}
            disabled={formSubmitted}
          >
            Assign Queue
          </Button>,
          <Button danger key="cancel" onClick={handleMarkArrivalModalCancel}>
            Close
          </Button>,
        ]}
      >
        <div>
          <PatientHeader patient={patientHeaderDetails}></PatientHeader>
          <Form
            key={selectedPatientRecord.QId}
            form={form1}
            layout="vertical"
            disabled={formSubmitted}
          >
            <Row style={{ margin: "1rem 0" }} gutter={16}>
              <ColWithSixSpan>
                <span style={{ fontWeight: "bold" }}>
                  Service&nbsp;Location
                </span>
                <p>
                  {selectedPatientRecord &&
                    selectedPatientRecord.ServiceLocation}
                </p>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <span style={{ fontWeight: "bold" }}>Visit Reason</span>
                <p>
                  {selectedPatientRecord?.Reason
                    ? selectedPatientRecord.Reason
                    : "-"}
                </p>
              </ColWithSixSpan>

              <ColWithSixSpan>
                <span style={{ fontWeight: "bold" }}>Appointment Time</span>
                <p>
                  {selectedPatientRecord &&
                    selectedPatientRecord.AppointmentTime}
                </p>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item
                  name="TokenNo"
                  label="Token no"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a token number",
                    },
                    {
                      pattern: /^[1-9]\d*$/,
                      message:
                        "Token number must be a positive and no special characters",
                    },
                  ]}
                >
                  <Input allowClear maxLength={3} />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <span style={{ fontWeight: "bold" }}>Current Queue Length</span>
                <p>{NewQueueModel && NewQueueModel.QLength}</p>
              </ColWithSixSpan>
            </Row>
          </Form>
        </div>
      </Modal>

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
        confirmLoading={revertToCheckInLoader}
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
            loading={pushPatientLoader}
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
          <PatientHeader patient={patientHeaderDetails}></PatientHeader>
          <Form key={selectedPatientRecord.QId} form={form1} layout="vertical">
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
                <Form.Item
                  name="PushToPosition"
                  label="Push to Position"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a position number",
                    },
                    {
                      pattern: /^[1-9]\d*$/,
                      message: "No special characters",
                    },
                  ]}
                >
                  <Input allowClear maxLength={2} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>

      <Modal
        width={600}
        title="START CONSULTATION"
        open={isStartConsultationModalVisible}
        onCancel={handleStartConsultationModalCancel}
        onOk={handleConfirmStartConsultation}
        okText="Start"
        cancelText="Cancel"
        maskClosable={false}
        // confirmLoading={startConsLoader}
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

      <Modal
        width={800}
        title="CLOSE CONSULTATION"
        open={isCloseConsultationModalVisible}
        onCancel={handleCloseConsultationModalCancel}
        onOk={handleConfirmCloseConsultation}
        okText="Save"
        cancelText="Cancel"
        maskClosable={false}
        confirmLoading={closeConsLoader}
      >
        <div>
          <PatientHeader patient={patientHeaderDetails}></PatientHeader>
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
                <Form.Item
                  name="DispositionType"
                  label="Disposition Type"
                  rules={[
                    {
                      required: true,
                      message: "Disposition type is required",
                    },
                  ]}
                >
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
          <PatientHeader patient={patientHeaderDetails}></PatientHeader>
        </div>
      </Modal>
    </>
  );
};

export default Queue;
