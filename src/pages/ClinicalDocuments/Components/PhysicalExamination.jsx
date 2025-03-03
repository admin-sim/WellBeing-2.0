import {
  Button,
  Col,
  Collapse,
  Form,
  Image,
  Input,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
  message,
  Modal,
  Tabs,
  Spin,
} from "antd";
import CustomTable from "../../../components/customTable/index.jsx";
import Layout from "antd/es/layout/layout";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import PageHeader from "../../../components/PageHeader/index.jsx";
import { Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState, useEffect } from "react";
import { FaHistory } from "react-icons/fa";
import { PiInfo } from "react-icons/pi";
import CustomRadioGroup from "../../../components/customRadioGroup";
import lungs from "../../../assets/lungs.svg";
import stethoscope from "../../../assets/stethoscope.svg";
import heart from "../../../assets/heart.svg";
import gastro from "../../../assets/gastro.svg";
import bones from "../../../assets/bones.svg";
import customAxios from "../../../components/customAxios/customAxios";

import {
  urlSaveGeneralExamination,
  urlGetAllGE,
  urlEditGeneralExam,
  urlSaveSystemicExam,
  urlGetAllPE,
  urlEditPE,
  urlDeletePE,
} from "../../../../endpoints";
import {
  ColWithSixSpan,
  ColWithThreeSpan,
} from "../../../components/customGridColumns";

function PhysicalExamination(Patient) {
  const [form1] = useForm(); // Form for General Examination
  const [form2] = useForm(); // Form for Systemic Examination
  const [patientId, setPatientId] = useState(null);
  const [encounterId, setEncounterId] = useState(null);
  const [generaldataexist, setgeneraldataexist] = useState(null);
  const [systemicdataexist, setsystemicdataexist] = useState(null);

  useEffect(() => {
    debugger;
    if (Patient?.Patient?.PatientId && Patient?.Patient?.Encounter) {
      setPatientId(Patient.Patient.PatientId);
      setEncounterId(Patient.Patient.Encounter);
    }
  }, [Patient]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const { Title } = Typography;

  const [previousDetails, setPreviousDetails] = useState("Last One Week");
  useEffect(() => {
    if (isModalVisible) {
      fetchGeneralExaminationData();
    }
  }, [isModalVisible]);

  const fetchGeneralExaminationData = async () => {
    try {
      debugger;

      const range = getRangeFromPreviousDetails(previousDetails); // Convert range text to DateTime
      const response = await customAxios.get(
        `${urlGetAllGE}?PatientId=${patientId}&EncounterId=${encounterId}&Range=${range}`
      );

      if (response?.data?.data?.PatientGeneralExamination) {
        setgeneraldataexist(true);
        setGeneralData(response.data.data.PatientGeneralExamination);
        setPickleData(response.data.data.PatientGeneralExamination);
      } else {
        message.warning("No data found.");

        setGeneralData([]);
        setPickleData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch data.");
    }
  };

  const getRangeFromPreviousDetails = (detail) => {
    const now = new Date();
    switch (detail) {
      case "Last One Week":
        return new Date(now.setDate(now.getDate() - 7)).toISOString();
      case "Last One Month":
        return new Date(now.setMonth(now.getMonth() - 1)).toISOString();
      case "Last Six Months":
        return new Date(now.setMonth(now.getMonth() - 6)).toISOString();
      case "Last One Year":
        return new Date(now.setFullYear(now.getFullYear() - 1)).toISOString();
      default:
        return now.toISOString();
    }
  };

  const handlePreviousDetailsChange = (value) => {
    setPreviousDetails(value);
    fetchGeneralExaminationData(); // Fetch data based on the new range
    fetchSystemicExaminationData();
  };

  const generalColumns = [
    {
      title: "SLNo",
      dataIndex: "key",
      key: "key",
      render: (text, record, index) => index + 1, // Dynamically set SLNo based on the index
    },
    { title: "UHID", dataIndex: "UHId", key: "UHID" },
    { title: "Encounter", dataIndex: "Encounter", key: "Encounter" },
    {
      title: "Conscious",
      dataIndex: "Conscious",
      key: "Conscious",
      render: (text) =>
        text?.endsWith("Yes") ? "Yes" : text?.endsWith("No") ? "No" : text,
    },
    {
      title: "Cooperative",
      dataIndex: "Cooperative",
      key: "Cooperative",
      render: (text) =>
        text?.endsWith("Yes") ? "Yes" : text?.endsWith("No") ? "No" : text,
    },
    {
      title: "Comfortable",
      dataIndex: "Comfortable",
      key: "Comfortable",
      render: (text) =>
        text?.endsWith("Yes") ? "Yes" : text?.endsWith("No") ? "No" : text,
    },
    {
      title: "Toxic",
      dataIndex: "Toxic",
      key: "Toxic",
      render: (text) =>
        text?.endsWith("Yes") ? "Yes" : text?.endsWith("No") ? "No" : text,
    },
    {
      title: "Dyspneic",
      dataIndex: "Dyspneic",
      key: "Dyspneic",
      render: (text) =>
        text?.endsWith("Yes") ? "Yes" : text?.endsWith("No") ? "No" : text,
    },
    { title: "Build", dataIndex: "Build", key: "Build" },
    { title: "Nourishment", dataIndex: "Nourishment", key: "Nourishment" },
    {
      title: "Action",
      key: "action",
      render: () => (
        <a
          href="#"
          onClick={() => handleEdit()}
          style={{ textDecoration: "none" }}
        >
          <EditOutlined />
        </a>
      ),
    },
  ];

  const pickleColumns = [
    {
      title: "SLNo",
      dataIndex: "key",
      key: "key",
      render: (text, record, index) => index + 1, // Dynamically set SLNo based on the index
    },
    { title: "UHID", dataIndex: "UHId", key: "UHID" },
    { title: "Encounter", dataIndex: "Encounter", key: "Encounter" },
    {
      title: "Pallor",
      dataIndex: "Pallor",
      key: "Pallor",
      render: (text) =>
        text?.endsWith("Yes") ? "Yes" : text?.endsWith("No") ? "No" : text,
    },
    {
      title: "Icterus",
      dataIndex: "Icterus",
      key: "Icterus",
      render: (text) =>
        text?.endsWith("Yes") ? "Yes" : text?.endsWith("No") ? "No" : text,
    },
    {
      title: "Cyanosis",
      dataIndex: "Cyanosis",
      key: "Cyanosis",
      render: (text) =>
        text?.endsWith("Yes") ? "Yes" : text?.endsWith("No") ? "No" : text,
    },
    {
      title: "Clubbing",
      dataIndex: "Clubbing",
      key: "Clubbing",
      render: (text) =>
        text?.endsWith("Yes") ? "Yes" : text?.endsWith("No") ? "No" : text,
    },
    {
      title: "Koilonychia",
      dataIndex: "Koilonychia",
      key: "Koilonychia",
      render: (text) =>
        text?.endsWith("Yes") ? "Yes" : text?.endsWith("No") ? "No" : text,
    },
    {
      title: "Lymphadenopathi",
      dataIndex: "Lymphadenopathi",
      key: "Lymphadenopathy",
      render: (text) =>
        text?.endsWith("Yes") ? "Yes" : text?.endsWith("No") ? "No" : text,
    },
    {
      title: "Pedal Edema",
      dataIndex: "PedalEdema",
      key: "PedalEdema",
      render: (text) =>
        text?.endsWith("Yes") ? "Yes" : text?.endsWith("No") ? "No" : text,
    },
  ];

  const [generalData, setGeneralData] = useState([]);
  const [pickleData, setPickleData] = useState([]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  const handleEdit = async () => {
    try {
      debugger;
      const response = await customAxios.get(
        `${urlEditGeneralExam}?PatientId=${patientId}&EncounterId=${encounterId}`
      );

      if (response?.data) {
        const editData = response.data.data;

        // Map the response data to the form fields
        form1.setFieldsValue({
          Conscious: editData.Conscious,
          Cooperative: editData.Cooperative,
          Comfortable: editData.Comfortable,
          Toxic: editData.Toxic,
          Dyspneic: editData.Dyspneic,
          Build: editData.Build,
          Nourishment: editData.Nourishment,
          Pallor: editData.Pallor,
          Icterus: editData.Icterus,
          Cyanosis: editData.Cyanosis,
          Clubbing: editData.Clubbing,
          Koilonychia: editData.Koilonychia,
          Lymphadenopathy: editData.Lymphadenopathy,
          PedalEdema: editData.PedalEdema,
        });
        handleClose();
        // Set the data in state (if you need to store it for other purposes)
        setEditData(editData);

        // Open the modal for editing
        setIsEditModalVisible(true);
      }
    } catch (error) {
      console.error("Error fetching edit data:", error);
    }
  };

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleSaveGeneralExamination = async () => {
    try {
      debugger;
      // Validate fields and get values
      const values = await form1.validateFields();
      console.log("Form Values:", values);
      const isFormEmpty = Object.values(values).every(value => 
        value === undefined || value === null || value === ""
      );
  
      if (isFormEmpty) {
        message.error("Please fill the values before saving.");
        return; // Stop execution if form is empty
      }
      values.PatientId = patientId;
      values.EncounterId = encounterId;

      // Transform form values into a flat dictionary format
      const generalExamination = Object.entries(values)
        .filter(([key, value]) => value !== undefined) // Exclude undefined values
        .reduce((acc, [key, value]) => {
          if (typeof value === "object") {
            acc[key] = JSON.stringify(value); // Serialize object to JSON string
          } else {
            acc[key] = String(value); // Convert other values to strings
          }
          return acc;
        }, {});
        
      // Construct the payload for the API
      const payload = {
        GeneralExamination: generalExamination,
      };

      console.log("Payload:", payload);

      // Post values to the API
      const response = await customAxios.post(
        urlSaveGeneralExamination,
        generalExamination
      );

      // Handle API response
      if (response.data) {
        message.success("General examination saved successfully!");
        form1.resetFields();
        setgeneraldataexist(false);
      } else {
        message.error("Failed to save general examination.");
        form1.resetFields();
      }
    } catch (error) {
      console.error("Save failed:", error);
      message.error("An error occurred while saving.");
    }
  };

  const generalExaminationForm = (
    <>
      <Form
        form={form1}
        layout="vertical"
      >
        <Row gutter={32} justify={"end"} style={{ marginBottom: "1rem" }}>
          <Col>
            <Button
              size="middle"
              onClick={showModal} // Open modal on click
              style={{
                borderRadius: "2rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              Previous General Examination
              <FaHistory style={{ marginLeft: "0.5rem" }} />
            </Button>
          </Col>
        </Row>
        <Row gutter={32}>
          <Col span={5}>
            <CustomRadioGroup
              name="Conscious"
              label="Conscious"
              options={[
                { value: "ConsciousYes", label: "Yes" },
                { value: "ConsciousNo", label: "No" },
              ]}
            />
          </Col>
          <Col span={5}>
            <CustomRadioGroup
              name="Cooperative"
              label="Cooperative"
              options={[
                { value: "CooperativeYes", label: "Yes" },
                { value: "CooperativeNo", label: "No" },
              ]}
            />
          </Col>
          <Col span={5}>
            <CustomRadioGroup
              name="Comfortable"
              label="Comfortable"
              options={[
                { value: "ComfortableYes", label: "Yes" },
                { value: "ComfortableNo", label: "No" },
              ]}
            />
          </Col>
          <Col span={5}>
            <CustomRadioGroup
              name="Toxic"
              label="Toxic"
              options={[
                { value: "ToxicYes", label: "Yes" },
                { value: "ToxicNo", label: "No" },
              ]}
            />
          </Col>
          <Col span={4}>
            <CustomRadioGroup
              name="Dyspneic"
              label="Dyspneic"
              options={[
                { value: "DyspneicYes", label: "Yes" },
                { value: "DyspneicNo", label: "No" },
              ]}
            />
          </Col>
          <Col span={10}>
            <CustomRadioGroup
              name="Build"
              label="Build"
              options={[
                { value: "Moderate", label: "Moderate" },
                { value: "Heavy", label: "Heavy" },
                { value: "Thin", label: "Thin" },
              ]}
            />
          </Col>
          <Col span={10}>
            <CustomRadioGroup
              name="Nourishment"
              label="Nourishment"
              options={[
                { value: "Obese", label: "Obese" },
                { value: "Well", label: "Well" },
                { value: "Cachectic", label: "Cachectic" },
              ]}
            />
          </Col>
          <Col span={24} style={{ margin: "0 0 0.7rem 0" }}>
            <span style={{ fontWeight: 600, fontSize: "1rem" }}>Pickel</span>
          </Col>
          <Col span={5}>
            <CustomRadioGroup
              name="Pallor"
              label="Pallor"
              options={[
                { value: "PallorYes", label: "Yes" },
                { value: "PallorNo", label: "No" },
              ]}
            />
          </Col>
          <Col span={5}>
            <CustomRadioGroup
              name="Icterus"
              label="Icterus"
              options={[
                { value: "IcterusYes", label: "Yes" },
                { value: "IcterusNo", label: "No" },
              ]}
            />
          </Col>
          <Col span={5}>
            <CustomRadioGroup
              name="Cyanosis"
              label="Cyanosis"
              options={[
                { value: "CyanosisYes", label: "Yes" },
                { value: "CyanosisNo", label: "No" },
              ]}
            />
          </Col>
          <Col span={5}>
            <CustomRadioGroup
              name="Clubbing"
              label="Clubbing"
              options={[
                { value: "ClubbingYes", label: "Yes" },
                { value: "ClubbingNo", label: "No" },
              ]}
            />
          </Col>
          <Col span={4}>
            <CustomRadioGroup
              name="Koilonychia"
              label="Koilonychia"
              options={[
                { value: "KoilonychiaYes", label: "Yes" },
                { value: "KoilonychiaNo", label: "No" },
              ]}
            />
          </Col>
          <Col span={5}>
            <CustomRadioGroup
              name="Lymphadenopathy"
              label="Lymphadenopathi"
              options={[
                { value: "LymphadenopathiYes", label: "Yes" },
                { value: "LymphadenopathiNo", label: "No" },
              ]}
            />
          </Col>
          <Col span={5}>
            <CustomRadioGroup
              name="Pedal Edema"
              label="Pedal Edema"
              options={[
                { value: "PedalEdemaYes", label: "Yes" },
                { value: "PedalEdemaNo", label: "No" },
              ]}
            />
          </Col>
        </Row>
      </Form>

      <Row gutter={32} justify={"end"} style={{ margin: "1rem 0 0 0" }}>
        <Col>
          <Button size="middle" type="primary" onClick={handleSaveGeneralExamination}>
            {generaldataexist ? "Update" : "Save"}
          </Button>
        </Col>
        <Col>
          <Button
            size="middle"
            danger
            onClick={() => {
              form1.resetFields();
              setgeneraldataexist(false); // Set the flag to false after resetting the form
            }}
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </>
  );

  const handleSystemicSubmit = async (values) => {
    try {
      debugger;
      const formData = [];
      const sections = [
        {
          name: "Respiratoryform",
          idField: "RespiratoryId",
          fields: [
            "RespiratoryRate",
            "ObRespiratoryRate",
            "TachypneaRate",
            "AccessaryMuscles",
            "IntercostalRetractions",
          ],
        },
        {
          name: "Auscultationform",
          idField: "AuscultationId",
          fields: [
            "LConAuscultation",
            "Rhonchi",
            "Wheeze",
            "Cripititions",
            "AirwayEntry",
            "BreathMovements",
            "BreathSounds",
          ],
        },
        {
          name: "Cardiovascularform",
          idField: "CardiovascularId",
          fields: [
            "PulseRate",
            "RegularRate",
            "ObservedRRR",
            "Thachycardia",
            "Bhradycardia",
            "JugularVenous",
            "S1S2Heard",
            "NoSoundsMurmurs",
          ],
        },
        {
          name: "Gastrointestinalform",
          idField: "GastrointestinalId",
          fields: [
            "Inspection",
            "Palpation",
            "Tender",
            "Tenderless",
            "Hepatomegaly",
            "Splenomegaly",
            "Hernia",
            "BowelSounds",
            "Murphysign",
            "McBurneypoint",
          ],
        },
        {
          name: "Musculosceletalform",
          idField: "MusculosceletalId",
          fields: [
            "Ambulatory",
            "Assistant",
            "Wheelchair",
            "Walkingstick",
            "Gait",
            "Extraocular",
            "Flexion",
            "Lateral",
            "Extension",
            "Splurling",
            "Movement",
            "UlimbSRM",
            "UlimbWStr",
            "UlimbWRM",
            "UlimbERef",
            "UlimbESen",
            "UlimbEWast",
            "UlimbEStr",
            "UlinbERM",
            "UlimbSRef",
            "UlimbSSen",
            "UlimbSWast",
            "UlimbSStr",
            "LULEWast",
            "LULEStr",
            "LULERM",
            "LULSRef",
            "LULSSen",
            "LULSWast",
            "LULSStr",
            "LULSRM",
            "UlimbHRef",
            "UlimbHSen",
            "UlimbHWast",
            "UlimbHStr",
            "UlimbHRM",
            "UlimbWRef",
            "UlimbWSen",
            "UlimbWWast",
            "LULHRef",
            "LULHSen",
            "LULHWast",
            "LULHStr",
            "LULHRM",
            "LULWRef",
            "LULWSen",
            "LULWWast",
            "LULWStr",
            "LULWRM",
            "LULERef",
            "LULESen",
            "SLR",
          ],
        },
      ];
      const PatientId = patientId; // Ensure patientId is defined
      const EncounterId = encounterId; // Ensure encounterId is defined

      console.log("PatientId:", PatientId, "EncounterId:", EncounterId); // Debugging

      // Convert values to URL-encoded format and populate formData
      sections.forEach(({ name, idField, fields }) => {
        const params = new URLSearchParams();
        let hasData = false;
        const formId = editData?.[idField] || "0";
        params.append("id", formId);
        fields.forEach((field) => {
          const value = values[field];
          if (value !== undefined && value !== null && value !== "") {
            params.append(field, value);
            hasData = true;
          }
        });

        if (hasData) {
          formData.push({
            formName: name,
            formData: params.toString(), // Include formData as a string
            PatientId, // Include PatientId
            EncounterId, // Include EncounterId
          });
        }
      });

      if (formData.length === 0) {
        message.warning("Please Enter Details of Physical Examination.");
        return;
      }

      console.log("Form Data:", formData); // Debugging

      // Send the formData as a list of objects
      const response = await customAxios.post(urlSaveSystemicExam, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data) {
        message.success("Physical Examination Saved Successfully!");
        form2.resetFields();
        setsystemicdataexist(false);
      }
    } catch (error) {
      console.error("Save failed:", error);
      message.error("An error occurred while saving.");
    }
  };

  const [activeButtons, setActiveButtons] = useState({
    Respiratory: false,
    Auscultation: false,
    CardiovascularSystem: false,
    GastrointestinalSystem: false,
    MusculoskeletalExamination: false,
  });

  const handleButtonClick = (buttonName) => {
    setActiveButtons((prev) => ({
      ...prev,
      [buttonName]: !prev[buttonName],
    }));
  };
  const containsDropdown = [
    { id: "+", name: "+" },
    { id: "-", name: "-" },
  ];

  const dropset = [
    { id: "Yes", name: "Yes" },
    { id: "No", name: "No" },
  ];
  // Modal for Previous Systemic Examination details//
  const [isPreviousExamModalVisible, setPreviousExamModalVisible] =
    useState(false);
  const handleOpenModal = () => setPreviousExamModalVisible(true);
  const handleCloseModal = () => setPreviousExamModalVisible(false);
  const [respiratoryData, setRespiratoryData] = useState([]);
  const [asculationData, setAsculationData] = useState([]);
  const [cardiovascularData, setCardiovascularData] = useState([]);
  const [gastrointestinalData, setGastrointestinalData] = useState([]);
  const [musculatoryData, setMusculatoryData] = useState([]);
  const respiratoryColumns = [
    {
      title: "SL No",
      dataIndex: "key",
      key: "key",
    },
    { title: "UHID", dataIndex: "UHId", key: "uhid" },
    { title: "Encounter", dataIndex: "Encounter", key: "encounter" },
    {
      title: "Respiratory Rate",
      dataIndex: "RespiratoryRate",
      key: "respiratoryRate",
    },
    {
      title: "Observed Respiratory Rate",
      dataIndex: "ObRespiratoryRate",
      key: "observedRespiratoryRate",
    },
    {
      title: "Tachypnea Rate",
      dataIndex: "TachypneaRate",
      key: "tachypneaRate",
    },
    {
      title: "Accessory Muscles",
      dataIndex: "AccessaryMuscles",
      key: "accessoryMuscles",
    },
    {
      title: "Intercostal Retractions",
      dataIndex: "IntercostalRetractions",
      key: "IntercostalRetractions",
    },
  ];

  const auscultationColumns = [
    {
      title: "SL No",
      dataIndex: "key",
      key: "key",
    },
    { title: "UHID", dataIndex: "UHId", key: "uhid" },
    { title: "Encounter", dataIndex: "Encounter", key: "encounter" },
    {
      title: "Auscultation",
      dataIndex: "LConAuscultation",
      key: "auscultation",
    },
    { title: "Ronchi", dataIndex: "Rhonchi", key: "ronchi" },
    { title: "Wheeze", dataIndex: "Wheeze", key: "wheeze" },
    { title: "Cripitations", dataIndex: "Cripititions", key: "cripitations" },
    { title: "Airway Entry", dataIndex: "AirwayEntry", key: "AirwayEntry" },
    {
      title: "Breath Movements",
      dataIndex: "BreathMovements",
      key: "BreathMovements",
    },
    {
      title: "Breath Sounds Rt/Lt",
      dataIndex: "BreathSounds",
      key: "BreathSounds",
    },
  ];

  const cardiovascularColumns = [
    {
      title: "SL No",
      dataIndex: "key",
      key: "key",
    },
    { title: "UHID", dataIndex: "UHId", key: "uhid" },
    { title: "Encounter", dataIndex: "Encounter", key: "encounter" },
    { title: "Pulse Rate", dataIndex: "PulseRate", key: "pulseRate" },
    { title: "Regular Rate Rhythm(RRR)", dataIndex: "RegularRate", key: "rrr" },
    { title: "Observed RR", dataIndex: "ObservedRRR", key: "ObservedRRR" },
    { title: "Tachycardia", dataIndex: "Thachycardia", key: "tachycardia" },
    { title: "Bradycardia", dataIndex: "Bhradycardia", key: "bradycardia" },
    {
      title: "Jugular Venous Pulse",
      dataIndex: "JugularVenous",
      key: "JugularVenous",
    },
    { title: "S1 S2 Heard", dataIndex: "S1S2Heard", key: "S1S2Heard" },
    {
      title: "No Added Sounds and Murmurs",
      dataIndex: "NoSoundsMurmurs",
      key: "NoSoundsMurmurs",
    },
  ];

  const gastrointestinalColumns = [
    {
      title: "SL No",
      dataIndex: "key",
      key: "key",
    },
    { title: "UHID", dataIndex: "UHId", key: "uhid" },
    { title: "Encounter", dataIndex: "Encounter", key: "encounter" },
    { title: "Inspection", dataIndex: "Inspection", key: "inspection" },
    { title: "Palpation", dataIndex: "Palpation", key: "palpation" },
    { title: "Tender", dataIndex: "Tender", key: "tender" },
    { title: "Tendernes in", dataIndex: "Tenderless", key: "Tenderless" },
    {
      title: "Hepato megaly  ",
      dataIndex: "Hepatomegaly",
      key: "Hepatomegaly",
    },
    {
      title: "Spleno megaly  ",
      dataIndex: "Splenomegaly",
      key: "Splenomegaly",
    },
    { title: "Hernia", dataIndex: "Hernia", key: "Hernia" },
    { title: "Bowel Sounds", dataIndex: "BowelSounds", key: "BowelSounds" },
    { title: "Murphy's  Sign", dataIndex: "Murphysign", key: "Murphysign" },
    {
      title: "McBurney's Point",
      dataIndex: "McBurneypoint",
      key: "McBurneypoint",
    },
  ];

  const musculoskeletalBasicDetails = [
    {
      title: "SL No",
      dataIndex: "key",
      key: "key",
    },
    { title: "UHID", dataIndex: "UHId", key: "UHID" },
    { title: "Encounter", dataIndex: "Encounter", key: "Encounter" },

    // { title: "SLR", dataIndex: "SLR", key: "SLR" },
  ];
  const musculoskeletalAmbulation = [
    { title: "Freely Ambulatory", dataIndex: "Ambulatory", key: "Ambulatory" },
    { title: "Assistant Support", dataIndex: "Assistant", key: "Assistant" },
    { title: "Wheelchair", dataIndex: "Wheelchair", key: "Wheelchair" },
    { title: "Walking Stick", dataIndex: "Walkingstick", key: "Walkingstick" },
    { title: "Gait", dataIndex: "Gait", key: "Gait" },
  ];
  const musculoskeletalCervicalNeck = [
    {
      title: "Extra-ocular Movement",
      dataIndex: "Extraocular",
      key: "Extraocular",
    },
    { title: "Flexion", dataIndex: "Flexion", key: "Flexion" },
    { title: "Lateral Blending", dataIndex: "Lateral", key: "Lateral" },
    { title: "Extension", dataIndex: "Extension", key: "Extension" },
    { title: "Spurling's Sign", dataIndex: "Splurling", key: "Splurling" },
    { title: "Range of Movement", dataIndex: "Movement", key: "Movement" },
  ];
  const musculoskeletalShoulder = [
    {
      title: "Upper Limb Shoulder Range of Motion",
      dataIndex: "UlimbSRM",
      key: "UlimbSRM",
    },
    {
      title: "Upper Limb Shoulder Reflex",
      dataIndex: "UlimbSRef",
      key: "UlimbSRef",
    },
    {
      title: "Upper Limb Shoulder Sensory",
      dataIndex: "UlimbSSen",
      key: "UlimbSSen",
    },
    {
      title: "Upper Limb Shoulder Wasting",
      dataIndex: "UlimbSWast",
      key: "UlimbSWast",
    },
    {
      title: "Upper Limb Shoulder Strength",
      dataIndex: "UlimbSStr",
      key: "UlimbSStr",
    },
  ];
  const musculoskeletalElbow = [
    {
      title: "Upper Limb Elbow Reflex",
      dataIndex: "UlimbERef",
      key: "UlimbERef",
    },
    {
      title: "Upper Limb Elbow Sensory",
      dataIndex: "UlimbESen",
      key: "UlimbESen",
    },
    {
      title: "Upper Limb Elbow Wasting",
      dataIndex: "UlimbEWast",
      key: "UlimbEWast",
    },
    {
      title: "Upper Limb Elbow Strength",
      dataIndex: "UlimbEStr",
      key: "UlimbEStr",
    },
    {
      title: "Upper Limb Elbow Range of Motion",
      dataIndex: "UlinbERM",
      key: "UlinbERM",
    },
  ];
  const musculoskeletalWrist = [
    {
      title: "Upper Limb Wrist Reflex",
      dataIndex: "UlimbWRef",
      key: "UlimbWRef",
    },
    {
      title: "Upper Limb Wrist Sensory",
      dataIndex: "UlimbWSen",
      key: "UlimbWSen",
    },
    {
      title: "Upper Limb Wrist Wasting",
      dataIndex: "UlimbWWast",
      key: "UlimbWWast",
    },
    {
      title: "Upper Limb Wrist Strength",
      dataIndex: "UlimbWStr",
      key: "UlimbWStr",
    },
    {
      title: "Upper Limb Wrist Range of Motion",
      dataIndex: "UlimbWRM",
      key: "UlimbWRM",
    },
  ];
  const musculoskeletalHand = [
    {
      title: "Upper Limb Hand Reflex",
      dataIndex: "UlimbHRef",
      key: "UlimbHRef",
    },
    {
      title: "Upper Limb Hand Sensory",
      dataIndex: "UlimbHSen",
      key: "UlimbHSen",
    },
    {
      title: "Upper Limb Hand Wasting",
      dataIndex: "UlimbHWast",
      key: "UlimbHWast",
    },
    {
      title: "Upper Limb Hand Strength",
      dataIndex: "UlimbHStr",
      key: "UlimbHStr",
    },
    {
      title: "Upper Limb Hand Range of Motion",
      dataIndex: "UlimbHRM",
      key: "UlimbHRM",
    },
  ];

  const musculoskeletalLeftUpperLimbElbow = [
    { title: "Elbow Reflex", dataIndex: "LULERef", key: "LULERef" },
    { title: "Elbow Sensory", dataIndex: "LULESen", key: "LULESen" },
    { title: "Elbow Wasting", dataIndex: "LULEWast", key: "LULEWast" },
    { title: "Elbow Strength", dataIndex: "LULEStr", key: "LULEStr" },
    { title: "Elbow Range of Motion", dataIndex: "LULERM", key: "LULERM" },
  ];
  const musculoskeletalLeftUpperLimbWrist = [
    { title: "Wrist Reflex", dataIndex: "LULWRef", key: "LULWRef" },
    { title: "Wrist Sensory", dataIndex: "LULWSen", key: "LULWSen" },
    { title: "Wrist Wasting", dataIndex: "LULWWast", key: "LULWWast" },
    { title: "Wrist Strength", dataIndex: "LULWStr", key: "LULWStr" },
    { title: "Wrist Range of Motion", dataIndex: "LULWRM", key: "LULWRM" },
  ];
  const musculoskeletalLeftUpperLimbHand = [
    { title: "Hand Reflex", dataIndex: "LULHRef", key: "LULHRef" },
    { title: "Hand Sensory", dataIndex: "LULHSen", key: "LULHSen" },
    { title: "Hand Wasting", dataIndex: "LULHWast", key: "LULHWast" },
    { title: "Hand Strength", dataIndex: "LULHStr", key: "LULHStr" },
    { title: "Hand Range of Motion", dataIndex: "LULHRM", key: "LULHRM" },
  ];

  const musculoskeletalLeftUpperLimbShoulder = [
    { title: "Shoulder Reflex", dataIndex: "LULSRef", key: "LULHRef" },
    { title: "Shoulder Sensory", dataIndex: "LULSStr", key: "LULHSen" },
    { title: "Shoulder Wasting", dataIndex: "LULSWast", key: "LULHWast" },
    { title: "Shoulder Strength", dataIndex: "LULSSen", key: "LULHStr" },
    { title: "Shoulder Range of Motion", dataIndex: "LULSRM", key: "LULHRM" },
  ];


  const handleEditPE = async (record, type) => {
    debugger;
    try {
      const response = await customAxios.get(
        `${urlEditPE}?id=${record}&type=${type}`
      );

      if (response?.data) {
        const editData = response.data.data;

        // Close any existing modals
        handleCloseModal();

        // Set form values based on the response
        form2.setFieldsValue(editData);

        // Maintain edit data in state (if needed)
        setEditData(editData);

        // Dynamically activate buttons by checking fields in the response
        const newActiveButtons = {
          Respiratory: !!(
            editData.RespiratoryRate ||
            editData.ObRespiratoryRate ||
            editData.TachypneaRate ||
            editData.AccessaryMuscles ||
            editData.IntercostalRetractions
          ),
          Auscultation: !!(
            editData.LConAuscultation ||
            editData.Rhonchi ||
            editData.Wheeze ||
            editData.Cripititions ||
            editData.AirwayEntry ||
            editData.BreathMovements ||
            editData.BreathSounds
          ),
          CardiovascularSystem: !!(
            editData.PulseRate ||
            editData.RegularRate ||
            editData.ObservedRRR ||
            editData.Thachycardia ||
            editData.Bhradycardia ||
            editData.JugularVenous ||
            editData.S1S2Heard ||
            editData.NoSoundsMurmurs
          ),
          GastrointestinalSystem: !!(
            editData.Inspection ||
            editData.Palpation ||
            editData.Tender ||
            editData.Tenderless ||
            editData.Hepatomegaly ||
            editData.Splenomegaly ||
            editData.Hernia ||
            editData.BowelSounds ||
            editData.Murphysign ||
            editData.McBurneypoint
          ),
          MusculoskeletalExamination: !!(
            editData.Ambulatory ||
            editData.Assistant ||
            editData.Wheelchair ||
            editData.Walkingstick ||
            editData.Gait ||
            editData.Extraocular ||
            editData.Flexion ||
            editData.Lateral ||
            editData.Extension ||
            editData.Splurling ||
            editData.Movement ||
            editData.UlimbSRM ||
            editData.UlimbWStr ||
            editData.UlimbWRM ||
            editData.UlimbERef ||
            editData.UlimbESen ||
            editData.UlimbEWast ||
            editData.UlimbEStr ||
            editData.UlinbERM ||
            editData.UlimbSRef ||
            editData.UlimbSSen ||
            editData.UlimbSWast ||
            editData.UlimbSStr ||
            editData.LULEWast ||
            editData.LULEStr ||
            editData.LULERM ||
            editData.LULSRef ||
            editData.LULSSen ||
            editData.LULSWast ||
            editData.LULSStr ||
            editData.LULSRM ||
            editData.UlimbHRef ||
            editData.UlimbHSen ||
            editData.UlimbHWast ||
            editData.UlimbHStr ||
            editData.UlimbHRM ||
            editData.UlimbWRef ||
            editData.UlimbWSen ||
            editData.UlimbWWast ||
            editData.LULHRef ||
            editData.LULHSen ||
            editData.LULHWast ||
            editData.LULHStr ||
            editData.LULHRM ||
            editData.LULWRef ||
            editData.LULWSen ||
            editData.LULWWast ||
            editData.LULWStr ||
            editData.LULWRM ||
            editData.LULERef ||
            editData.LULESen ||
            editData.SLR
          ),

        };

        // Update the state to activate the respective buttons
        setActiveButtons((prev) => ({
          ...prev,
          ...newActiveButtons,
        }));
      }
    } catch (error) {
      console.error("Error fetching edit data:", error);
    }
  };
  const handleDeletePE = async (record, type) => {
    try {
      const response = await customAxios.get(
        `${urlDeletePE}?id=${record}&type=${type}`
      );

      if (response.status === 200 && response.data) {
        message.success("Record deleted successfully!");
        fetchSystemicExaminationData();
      } else {
        message.error("Failed to delete the record.");
      }
    } catch (error) {
      console.error("Error deleting the record:", error);
    }
  };

  const iteeems = [
    {
      key: "1",
      label: "Respiratory",
      children: (

        <CustomTable
          columns={respiratoryColumns}
          dataSource={respiratoryData}
          rowKey="slNo"
          pagination={false}
          bordered
          // onEdit={() => handleEditPE("RESP",3)}
          onEdit={(record) => handleEditPE(record.RespiratoryId, "RESP")}
          onDelete={(record) => handleDeletePE(record.RespiratoryId, "RESP")}
        />


      ),
    },
    {
      key: "2",
      label: "Auscultation",
      children: (

        <CustomTable
          columns={auscultationColumns}
          rowKey="slNo"
          dataSource={asculationData}
          pagination={false}
          actionColumn={true}
          bordered
          onEdit={(record) => handleEditPE(record.AuscultationId, "AUSC")}
          onDelete={(record) => handleDeletePE(record.AuscultationId, "AUSC")}
        />


      ),
    },
    {
      key: "3",
      label: "Cardiovascular",
      children: (

        <CustomTable
          columns={cardiovascularColumns}
          rowKey="slNo"
          dataSource={cardiovascularData}
          pagination={false}
          onEdit={(record) => handleEditPE(record.CardiovascularId, "CARD")}
          onDelete={(record) => handleDeletePE(record.CardiovascularId, "CARD")}
          bordered
        />

      ),
    },
    {
      key: "4",
      label: "Gastrointestinal System",
      children: (

        <CustomTable
          dataSource={gastrointestinalData}
          rowKey="slNo"
          columns={gastrointestinalColumns}
          isFilter={true}
          pagination={false}
          scroll={{ x: 1000 }}
          tableLayout="auto"
          onEdit={(record) => handleEditPE(record.GastrointestinalId, "GAST")}
          onDelete={(record) => handleDeletePE(record.GastrointestinalId, "GAST")}
        />

      ),
    },
    {
      key: "5",
      label: "Musculoskeletal Examination",
      children: (
        <>

          <CustomTable
            columns={musculoskeletalBasicDetails}
            dataSource={musculatoryData}
            pagination={false}
            onEdit={(record) => handleEditPE(record.MusculosceletalId, "Musc")}
            onDelete={(record) => handleDeletePE(record.MusculosceletalId, "Musc")}
            bordered
          />
          <CustomTable
            columns={musculoskeletalAmbulation}
            dataSource={musculatoryData}
            pagination={false}
            actionColumn={false}
            bordered
          />
          <CustomTable
            columns={musculoskeletalCervicalNeck}
            dataSource={musculatoryData}
            pagination={false}
            actionColumn={false}
            bordered
          />
          <CustomTable
            columns={musculoskeletalShoulder}
            dataSource={musculatoryData}
            pagination={false}
            actionColumn={false}
            bordered
          />
          <CustomTable
            columns={musculoskeletalElbow}
            dataSource={musculatoryData}
            pagination={false}
            actionColumn={false}
            bordered
          />
          <CustomTable
            columns={musculoskeletalWrist}
            dataSource={musculatoryData}
            pagination={false}
            actionColumn={false}
            bordered
          />
          <CustomTable
            columns={musculoskeletalHand}
            dataSource={musculatoryData}
            pagination={false}
            actionColumn={false}
            bordered
          />
          <CustomTable
            columns={musculoskeletalLeftUpperLimbElbow}
            dataSource={musculatoryData}
            pagination={false}
            actionColumn={false}
            bordered
          />
          <CustomTable
            columns={musculoskeletalLeftUpperLimbHand}
            dataSource={musculatoryData}
            pagination={false}
            actionColumn={false}
            bordered
          />
          <CustomTable
            columns={musculoskeletalLeftUpperLimbWrist}
            dataSource={musculatoryData}
            pagination={false}
            actionColumn={false}
            bordered
          />
          <CustomTable
            columns={musculoskeletalLeftUpperLimbShoulder}
            dataSource={musculatoryData}
            pagination={false}
            actionColumn={false}
            bordered
          />

        </>
      ),
    },
  ];

  useEffect(() => {
    if (isPreviousExamModalVisible) {
      fetchSystemicExaminationData();
    }
  }, [isPreviousExamModalVisible]);

  const fetchSystemicExaminationData = async () => {
    try {
      debugger

      const range = getRangeFromPreviousDetails(previousDetails); // Convert range text to DateTime

      const response = await customAxios.get(
        `${urlGetAllPE}?PatientId=${patientId}&EncounterId=${encounterId}&Range=${range}`
      );

      if (response?.data?.data) {
        debugger;
        setsystemicdataexist(true);
        const newColumnData = response.data.data.Musculosceletals.map(
          (obj, index) => {
            return { ...obj, key: index + 1 };
          }
        );
        const newColumnData1 = response.data.data.Gastrointestinals.map(
          (obj, index) => {
            return { ...obj, key: index + 1 };
          }
        );
        const newColumnData2 = response.data.data.Cardiovasculars.map(
          (obj, index) => {
            return { ...obj, key: index + 1 };
          }
        );
        const newColumnData3 = response.data.data.Auscultations.map(
          (obj, index) => {
            return { ...obj, key: index + 1 };
          }
        );
        const newColumnData4 = response.data.data.Respiratories.map(
          (obj, index) => {
            return { ...obj, key: index + 1 };
          }
        );
        // setFilteredData(newColumnData);
        setMusculatoryData(newColumnData);
        setGastrointestinalData(newColumnData1);
        setCardiovascularData(newColumnData2);
        setAsculationData(newColumnData3);
        setRespiratoryData(newColumnData4);
      } else {

        message.warning("No data found.");
      }
    } catch (error) {

      console.error("Error fetching data:", error);
      message.error("Failed to fetch data.");
    }
  };

  const systemicExamination = (
    <>
      <Row
        gutter={16}
        justify={"end"}
        style={{ marginBottom: "1rem", marginTop: "0" }}
      >
        <Col>
          <Button
            size="middle"
            onClick={handleOpenModal} // Open modal on click
            style={{
              borderRadius: "2rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            Previous Systemic Examination
            <FaHistory style={{ marginLeft: "0.5rem" }} />
          </Button>
        </Col>
      </Row>
      <Layout>
        <Modal
          open={isPreviousExamModalVisible}
          // onOk={() => isPreviousExamModalVisible(false)}
          onCancel={handleCloseModal}
          width="90%"
          centered
          footer={null}
        >
          <PageHeader
            title={"Previous Systemic Examination Details"}
            button={false}
          />
          <Select
            value={previousDetails}
            onChange={handlePreviousDetailsChange}
            style={{ width: 200, marginTop: 20 }}
          >
            <Option value="Last One Week">Last One Week</Option>
            <Option value="Last One Month">Last One Month</Option>
            <Option value="Last Six Months">Last Six Months</Option>
            <Option value="Last One Year">Last One Year</Option>
          </Select>
          <Tabs
            defaultActiveKey="1"
            items={iteeems}
            tabPosition="top"
            style={{ height: "60vh", overflow: "auto" }}
          />

          <Row gutter={32} justify={"end"} style={{ margin: "1rem 0 1rem 0" }}>
            <Button size="middle" danger onClick={handleCloseModal}>
              Close
            </Button>
          </Row>
        </Modal>
      </Layout>

      <div
        style={{
          padding: "0.4rem",
          margin: "0",
          backgroundColor: "#D6E4FF",
          display: "flex",
          alignItems: "center",
          borderRadius: "0.5rem",
        }}
      >
        <PiInfo style={{ fontSize: "1.2rem" }} /> &nbsp;Select the type of
        physical examination to enter details
      </div>
      <Form
        form={form2}
        onFinish={handleSystemicSubmit} // Connect handler here
        layout="vertical"
      ></Form>
      <Row
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          marginTop: "1rem",
        }}
        gutter={32}
      >
        <Col>
          <Button
            size="middle"
            type={activeButtons.Respiratory ? "primary" : "default"}
            style={{ borderRadius: "1rem" }}
            onClick={() => handleButtonClick("Respiratory")}
          >
            Respiratory
          </Button>
        </Col>
        <Col>
          <Button
            size="middle"
            type={activeButtons.Auscultation ? "primary" : "default"}
            style={{ borderRadius: "1rem" }}
            onClick={() => handleButtonClick("Auscultation")}
          >
            Auscultation
          </Button>
        </Col>
        <Col>
          <Button
            size="middle"
            type={activeButtons.CardiovascularSystem ? "primary" : "default"}
            style={{ borderRadius: "1rem" }}
            onClick={() => handleButtonClick("CardiovascularSystem")}
          >
            Cardiovascular System
          </Button>
        </Col>
        <Col>
          <Button
            size="middle"
            type={activeButtons.GastrointestinalSystem ? "primary" : "default"}
            style={{ borderRadius: "1rem" }}
            onClick={() => handleButtonClick("GastrointestinalSystem")}
          >
            Gastrointestinal System
          </Button>
        </Col>
        <Col>
          <Button
            size="middle"
            type={
              activeButtons.MusculoskeletalExamination ? "primary" : "default"
            }
            style={{ borderRadius: "1rem" }}
            onClick={() => handleButtonClick("MusculoskeletalExamination")}
          >
            Musculoskeletal Examination
          </Button>
        </Col>
      </Row>

      {activeButtons.Respiratory && (
        <Row style={{ marginTop: "2rem" }} gutter={32}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "1.3rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
              width: "100%",
            }}
          >
            <Image
              src={lungs}
              alt="Respiratory"
              height="2.5rem"
              width="auto"
              style={{ marginRight: "1.2rem" }}
            />
            Respiratory
          </div>
          <Col span={4}>
            <Form.Item name="RespiratoryRate" label="Respiratory Rate">
              <Select placeholder="Select Rate" allowClear>
                <Select.Option key={0} value={"Increase"}>
                  Increase
                </Select.Option>
                <Select.Option key={1} value={"Decrease"}>
                  Decrease
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="ObRespiratoryRate"
              label="Observed&nbsp;Respiratory&nbsp;Rate"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="TachypneaRate" label="Tachypnea">
              <Select placeholder="Select" allowClear>
                <Select.Option key={0} value={"Normal"}>
                  Normal
                </Select.Option>
                <Select.Option key={1} value={"Abnormal"}>
                  Abnormal
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              style={{ marginTop: "-0.6rem" }}
              name="AccessaryMuscles"
              label={
                <span>Accessory Muscles (Strenocleidomastoid)</span>
                //   <Tooltip title="Accessory Muscles&nbsp;(Strenocleidomastoid)">
                //     Accessory&nbsp;Muscles&nbsp;(Strenocleidomastoid)
                //   </Tooltip>
              }
            >
              <Select placeholder="Select" allowClear>
                {containsDropdown.map((option) => (
                  <Select.Option key={option.id} value={option.id}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              name="IntercostalRetractions"
              label="Intercostal Retractions"
            >
              <Select placeholder="Select" allowClear>
                {containsDropdown.map((option) => (
                  <Select.Option key={option.id} value={option.id}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      )}

      {activeButtons.Auscultation && (
        <Row style={{ marginTop: "2rem" }} gutter={32}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "1.3rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
              width: "100%",
            }}
          >
            <Image
              src={stethoscope}
              alt="stethescope"
              height="2.5rem"
              width="auto"
              style={{ marginRight: "1.2rem" }}
            />
            Auscultation
          </div>
          <ColWithSixSpan>
            <Form.Item
              name="LConAuscultation"
              label="Lungs Clear on Auscultation"
              required
              style={{ marginTop: "1rem" }} 
            >
              <Select placeholder="Select" allowClear>
                {containsDropdown.map((option) => (
                  <Select.Option key={option.id} value={option.id}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="Rhonchi" label="Ronchi">
              <Input />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="Wheeze" label="Wheezes">
              <Select placeholder="Select" allowClear>
                {containsDropdown.map((option) => (
                  <Select.Option key={option.id} value={option.id}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="Cripititions" label="Crepitations">
              <Select placeholder="Select" allowClear>
                {containsDropdown.map((option) => (
                  <Select.Option key={option.id} value={option.id}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="AirwayEntry" label="Airway Entry">
              <Select placeholder="Select" allowClear>
                <Select.Option key={0} value={"BilateralEqual"}>
                  Bilateral Equal
                </Select.Option>
                <Select.Option key={1} value={""}>
                  to be add
                </Select.Option>
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="BreathMovements" label="Breath Movements Rt/Lt">
              <Select placeholder="Select" allowClear>
                <Select.Option key={0} value={"Symentrical"}>
                  Symentrical
                </Select.Option>
                <Select.Option key={1} value={""}>
                  to be add
                </Select.Option>
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="BreathSounds" label="Breath Sounds Rt/Lt">
              <Select placeholder="Select" allowClear>
                <Select.Option key={0} value={"Symentrical"}>
                  Symentrical
                </Select.Option>
                <Select.Option key={1} value={""}>
                  to be add
                </Select.Option>
              </Select>
            </Form.Item>
          </ColWithSixSpan>
        </Row>
      )}
      {activeButtons.CardiovascularSystem && (
        <Row style={{ marginTop: "2rem" }} gutter={32}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "1.3rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
              width: "100%",
            }}
          >
            <Image
              src={heart}
              alt="Heart"
              height="2.5rem"
              width="auto"
              style={{ marginRight: "1.2rem" }}
            />
            Cardiovascular System
          </div>
          <ColWithSixSpan>
            <Form.Item name="PulseRate" label="Pulse Rate" required>
              <Input placeholder="Enter Here" allowClear></Input>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="RegularRate" label="Regular Rate & Rhythm(RRR)">
              <Select placeholder="Select" allowClear>
                {dropset.map((option) => (
                  <Select.Option key={option.id} value={option.id}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="ObservedRRR" label="Observed RRR">
              <Select placeholder="Select" allowClear>
                {dropset.map((option) => (
                  <Select.Option key={option.id} value={option.id}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="Thachycardia" label="Tachycardia">
              <Select placeholder="Select" allowClear>
                <Select.Option key={0} value={"Elivated"}>
                  Elivated
                </Select.Option>
                <Select.Option key={1} value={""}>
                  to be add
                </Select.Option>
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="Bhradycardia" label="Bradycardia">
              <Select placeholder="Select" allowClear>
                {dropset.map((option) => (
                  <Select.Option key={option.id} value={option.id}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="JugularVenous" label="Jugular Venous Pulse">
              <Select placeholder="Select" allowClear>
                {containsDropdown.map((option) => (
                  <Select.Option key={option.id} value={option.id}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="S1S2Heard" label="S1 S2 Heard">
              <Select placeholder="Select" allowClear>
                {containsDropdown.map((option) => (
                  <Select.Option key={option.id} value={option.id}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item
              name="NoSoundsMurmurs"
              label="No Added Sounds and Murmurs"
            >
              <Select placeholder="Select" allowClear>
                {containsDropdown.map((option) => (
                  <Select.Option key={option.id} value={option.id}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </ColWithSixSpan>
        </Row>
      )}
      {activeButtons.GastrointestinalSystem && (
        <Row style={{ marginTop: "2rem" }} gutter={32}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "1.3rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
              width: "100%",
            }}
          >
            <Image
              src={gastro}
              alt="Heart"
              height="2rem"
              width="auto"
              style={{ marginRight: "1.2rem" }}
            />
            Gastrointestinal System
          </div>
          <ColWithSixSpan>
            <Form.Item name="Inspection" label="Inspection" required>
              <Select placeholder="Select" allowClear>
                <Select.Option key={0} value={"Scaphoid"}>
                  Scaphoid
                </Select.Option>
                <Select.Option key={1} value={""}>
                  to be add
                </Select.Option>
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="Palpation" label="Palpation">
              <Select placeholder="Select" allowClear>
                <Select.Option key={0} value={"Soft"}>
                  Soft
                </Select.Option>
                <Select.Option key={1} value={""}>
                  to be add
                </Select.Option>
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="Tender" label="Tender">
              <Select placeholder="Select" allowClear>
                {dropset.map((option) => (
                  <Select.Option key={option.id} value={option.id}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="Tenderless" label="Tenderness in">
              <Select placeholder="Select" allowClear>
                <Select.Option key={0} value={"RightLumbar"}>
                  Right Lumbar
                </Select.Option>
                <Select.Option key={1} value={""}>
                  to be add
                </Select.Option>
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="Hepatomegaly" label="Hepatomegaly">
              <Select placeholder="Select" allowClear>
                {dropset.map((option) => (
                  <Select.Option key={option.id} value={option.id}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="Splenomegaly" label="Splenomegaly">
              <Select placeholder="Select" allowClear>
                <Select.Option key={0} value={"Symentrical"}>
                  Symentrical
                </Select.Option>
                <Select.Option key={1} value={""}>
                  to be add
                </Select.Option>
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="Hernia" label="Hernia">
              <Select placeholder="Select" allowClear>
                {dropset.map((option) => (
                  <Select.Option key={option.id} value={option.id}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="BowelSounds" label="Bowel Sounds">
              <Select placeholder="Select" allowClear>
                {containsDropdown.map((option) => (
                  <Select.Option key={option.id} value={option.id}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="Murphysign" label="Murphy's Sign">
              <Select placeholder="Select" allowClear>
                {containsDropdown.map((option) => (
                  <Select.Option key={option.id} value={option.id}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="McBurneypoint" label="McBurney's Point">
              <Select placeholder="Select" allowClear>
                <Select.Option key={0} value={"Thender"}>
                  Thender
                </Select.Option>
                <Select.Option key={1} value={""}>
                  to be add
                </Select.Option>
              </Select>
            </Form.Item>
          </ColWithSixSpan>
        </Row>
      )}
      {activeButtons.MusculoskeletalExamination && (
        <>
          <Row style={{ marginTop: "2rem" }} gutter={32}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "1.3rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
                width: "100%",
              }}
            >
              <Image
                src={bones}
                alt="Heart"
                height="2.5rem"
                width="auto"
                style={{ marginRight: "1.2rem" }}
              />
              Musculoskeletal Examination
            </div>
            <Col span={24} style={{ margin: "0.5rem 0 0.7rem 0" }}>
              <span style={{ fontWeight: 600, fontSize: "1rem" }}>
                Ambulatory
              </span>
            </Col>
            <ColWithSixSpan>
              <Form.Item name="Ambulatory" label="Freely Ambulatory" required>
                <Select placeholder="Select" allowClear>
                  {dropset.map((option) => (
                    <Select.Option key={option.id} value={option.id}>
                      {option.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="Assistant" label="with Assistant (Support)">
                <Select placeholder="Select" allowClear>
                  {dropset.map((option) => (
                    <Select.Option key={option.id} value={option.id}>
                      {option.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="Wheelchair" label="With WheelChair">
                <Select placeholder="Select" allowClear>
                  {dropset.map((option) => (
                    <Select.Option key={option.id} value={option.id}>
                      {option.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="Walkingstick" label="With Walking Stick">
                <Select placeholder="Select" allowClear>
                  {dropset.map((option) => (
                    <Select.Option key={option.id} value={option.id}>
                      {option.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="Gait" label="Gait">
                <Select placeholder="Select" allowClear>
                  <Select.Option key={0} value={"Normal"}>
                    Normal
                  </Select.Option>
                  <Select.Option key={1} value={"Abnormal"}>
                    Abnormal
                  </Select.Option>
                </Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="Extraocular" label="Extra-Ocular Movements">
                <Select placeholder="Select" allowClear>
                  <Select.Option key={0} value={"Intact"}>
                    Intact
                  </Select.Option>
                  <Select.Option key={1} value={""}>
                    to be add
                  </Select.Option>
                </Select>
              </Form.Item>
            </ColWithSixSpan>
            <Col span={24} style={{ margin: "0 0 0.7rem 0" }}>
              <span style={{ fontWeight: 600, fontSize: "1rem" }}>Neck</span>
            </Col>
            <ColWithSixSpan>
              <Form.Item name="Flexion" label="Flexion">
                <Select placeholder="Select" allowClear>
                  <Select.Option key={0} value={"NoReflection"}>
                    No Reflection
                  </Select.Option>
                  <Select.Option key={1} value={""}>
                    to be add
                  </Select.Option>
                </Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="Lateral" label="Lateral Bending">
                <Select placeholder="Select" allowClear>
                  <Select.Option key={0} value={"NoReflection"}>
                    No Reflection
                  </Select.Option>
                  <Select.Option key={1} value={""}>
                    to be add
                  </Select.Option>
                </Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="Extension" label="Extension">
                <Select placeholder="Select" allowClear>
                  <Select.Option key={0} value={"NoReflection"}>
                    No Reflection
                  </Select.Option>
                  <Select.Option key={1} value={""}>
                    to be add
                  </Select.Option>
                </Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="Splurling" label="Spurling's Sign">
                <Select placeholder="Select" allowClear>
                  <Select.Option key={0} value={"Positive"}>
                    Positive
                  </Select.Option>
                  <Select.Option key={1} value={"Negative"}>
                    Negative
                  </Select.Option>
                </Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="Movement" label="Range of Movement">
                <Select placeholder="Select" allowClear>
                  <Select.Option key={0} value={"intact"}>
                    intact
                  </Select.Option>
                  <Select.Option key={1} value={""}>
                    to be add
                  </Select.Option>
                </Select>
              </Form.Item>
            </ColWithSixSpan>
          </Row>
          <Row>
            <Row gutter={[16, 16]}>
              {/* Upper Limb Section */}
              <Col span={24} style={{ margin: "0 0 0.7rem 0" }}>
                <span style={{ fontWeight: 600, fontSize: "1rem" }}>
                  Upper Limb
                </span>
              </Col>
              <Col span={24}>
                <Row
                  gutter={16}
                  style={{
                    fontWeight: 600,
                    background: "#f5f5f5",
                    padding: "5px 0",
                  }}
                >
                  <Col span={4}>Name of the Joint</Col>
                  <Col span={4}>Range of Motion</Col>
                  <Col span={4}>Strength</Col>
                  <Col span={4}>Wasting</Col>
                  <Col span={4}>Sensation</Col>
                  <Col span={4}>Reflexes</Col>
                </Row>
              </Col>

              {/* /* Shoulder */}
              <Col span={24}>
                <Row gutter={16}>
                  <Col span={4}>
                    <label>Shoulder</label>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="UlimbSRM">
                      <Select placeholder="Select" allowClear>
                        <Option value="Flexion">Flexion</Option>
                        <Option value="">to be add</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="UlimbSStr">
                      <Select placeholder="Select" allowClear>
                        <Option value="Grading0">Grading 0</Option>
                        <Option value="Grading1">Grading 1</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="UlimbSWast">
                      <Select placeholder="Select" allowClear>
                        <Option value="+">+</Option>
                        <Option value="-">-</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="UlimbSSen">
                      <Select placeholder="Select" allowClear>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="UlimbSRef">
                      <Select placeholder="Select" allowClear>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              {/* Elbow */}
              <Col span={24}>
                <Row gutter={16}>
                  <Col span={4}>
                    <label>Elbow</label>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="UlinbERM">
                      <Select placeholder="Select" allowClear>
                        <Option value="flexiod">flexiod</Option>
                        <Option value="">to be add</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="UlimbEStr">
                      <Select placeholder="Select" allowClear>
                        <Option value="Grading0">Grading 0</Option>
                        <Option value="Grading1">Grading 1</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="UlimbEWast">
                      <Select placeholder="Select" allowClear>
                        <Option value="+">+</Option>
                        <Option value="-">-</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="UlimbESen">
                      <Select placeholder="Select" allowClear>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="UlimbERef">
                      <Select placeholder="Select" allowClear>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              {/* Wrist */}
              <Col span={24}>
                <Row gutter={16}>
                  <Col span={4}>
                    <label>Wrist</label>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="UlimbWRM">
                      <Select placeholder="Select" allowClear>
                        <Option value="flexiod">flexiod</Option>
                        <Option value="">to be add</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="UlimbWStr">
                      <Select placeholder="Select" allowClear>
                        <Option value="Grading0">Grading 0</Option>
                        <Option value="Grading1">Grading 1</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="UlimbWWast">
                      <Select placeholder="Select" allowClear>
                        <Option value="+">+</Option>
                        <Option value="-">-</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="UlimbWSen">
                      <Select placeholder="Select" allowClear>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="UlimbWRef">
                      <Select placeholder="Select" allowClear>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              {/* Hand */}
              <Col span={24}>
                <Row gutter={16}>
                  <Col span={4}>
                    <label>Hand</label>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="UlimbHRM">
                      <Select placeholder="Select" allowClear>
                        <Option value="flexiod">flexiod</Option>
                        <Option value="">to be add</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="UlimbHStr">
                      <Select placeholder="Select" allowClear>
                        <Option value="Grading0">Grading 0</Option>
                        <Option value="Grading1">Grading 1</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="UlimbHWast">
                      <Select placeholder="Select" allowClear>
                        <Option value="+">+</Option>
                        <Option value="-">-</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="UlimbHSen">
                      <Select placeholder="Select" allowClear>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="UlimbHRef">
                      <Select placeholder="Select" allowClear>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              {/* Upper Limb Section */}
              <Col span={24} style={{ margin: "0 0 0.7rem 0" }}>
                <span style={{ fontWeight: 600, fontSize: "1rem" }}>
                  Lower Limb
                </span>
              </Col>
              <Col span={24}>
                <Row
                  gutter={16}
                  style={{
                    fontWeight: 600,
                    background: "#f5f5f5",
                    padding: "5px 0",
                  }}
                >
                  <Col span={4}>Name of the Joint</Col>
                  <Col span={4}>Range of Motion</Col>
                  <Col span={4}>Strength</Col>
                  <Col span={4}>Wasting</Col>
                  <Col span={4}>Sensation</Col>
                  <Col span={4}>Reflexes</Col>
                </Row>
              </Col>
              {/* Shoulder */}
              <Col span={24}>
                <Row gutter={16}>
                  <Col span={4}>
                    <label>Shoulder</label>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="LULSRM">
                      <Select placeholder="Select" allowClear>
                        <Option value="Flexion">Flexion</Option>
                        <Option value="">to be add</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="LULSStr">
                      <Select placeholder="Select" allowClear>
                        <Option value="Grading0">Grading 0</Option>
                        <Option value="Grading1">Grading 1</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="LULSWast">
                      <Select placeholder="Select" allowClear>
                        <Option value="+">+</Option>
                        <Option value="-">-</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="LULSSen">
                      <Select placeholder="Select" allowClear>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="LULSRef">
                      <Select placeholder="Select" allowClear>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              {/* Elbow */}
              <Col span={24}>
                <Row gutter={16}>
                  <Col span={4}>
                    <label>Elbow</label>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="LULERM">
                      <Select placeholder="Select" allowClear>
                        <Option value="flexiod">flexiod</Option>
                        <Option value="">to be add</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="LULEStr">
                      <Select placeholder="Select" allowClear>
                        <Option value="Grading0">Grading 0</Option>
                        <Option value="Grading1">Grading 1</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="LULEWast">
                      <Select placeholder="Select" allowClear>
                        <Option value="+">+</Option>
                        <Option value="-">-</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="LULESen">
                      <Select placeholder="Select" allowClear>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="LULERef">
                      <Select placeholder="Select" allowClear>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              {/* Wrist */}
              <Col span={24}>
                <Row gutter={16}>
                  <Col span={4}>
                    <label>Wrist</label>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="LULWRM">
                      <Select placeholder="Select" allowClear>
                        <Option value="flexiod">flexiod</Option>
                        <Option value="">to be add</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="LULWStr">
                      <Select placeholder="Select" allowClear>
                        <Option value="Grading0">Grading 0</Option>
                        <Option value="Grading1">Grading 1</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="LULWWast">
                      <Select placeholder="Select" allowClear>
                        <Option value="+">+</Option>
                        <Option value="-">-</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="LULWSen">
                      <Select placeholder="Select" allowClear>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="LULWRef">
                      <Select placeholder="Select" allowClear>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              {/* Hand */}
              <Col span={24}>
                <Row gutter={16}>
                  <Col span={4}>
                    <label>Hand</label>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="LULHRM">
                      <Select placeholder="Select" allowClear>
                        <Option value="flexiod">flexiod</Option>
                        <Option value="">to be add</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="LULHStr">
                      <Select placeholder="Select" allowClear>
                        <Option value="Grading0">Grading 0</Option>
                        <Option value="Grading1">Grading 1</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="LULHWast">
                      <Select placeholder="Select" allowClear>
                        <Option value="+">+</Option>
                        <Option value="-">-</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="LULHSen">
                      <Select placeholder="Select" allowClear>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item name="LULHRef">
                      <Select placeholder="Select" allowClear>
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
            <ColWithSixSpan>
              <Form.Item
                style={{ marginTop: "1rem" }}
                name="SLR"
                label="SLR (Straight Leg Rise test)"
              >
                <Select placeholder="Select" allowClear>
                  <Select.Option key={1} value={""}>
                    to be add
                  </Select.Option>
                </Select>
              </Form.Item>
            </ColWithSixSpan>
          </Row>
        </>
      )}
      {(activeButtons.MusculoskeletalExamination ||
        activeButtons.GastrointestinalSystem ||
        activeButtons.CardiovascularSystem ||
        activeButtons.Auscultation ||
        activeButtons.Respiratory) && (
        <Row gutter={32} justify={"end"} style={{ margin: "0 0 5rem 0" }}>
          <Col>
            <Button size="middle" type="primary" htmlType="submit">
              {systemicdataexist ? "Update" : "Submit"}
            </Button>
          </Col>
          <Col>
            <Button
              size="middle"
              danger
              onClick={() => {
                form2.resetFields();
                setsystemicdataexist(false); // Set the flag to false after resetting the form
              }}
            >
              Abort
            </Button>
          </Col>
        </Row>
      )}
    </>
  );

  const items = [
    {
      key: "1",
      label: (
        <span style={{ fontSize: "1rem", fontWeight: 700 }}>
          General Examination
        </span>
      ),
      children: generalExaminationForm,
    },
    {
      key: "2",
      label: (
        <span style={{ fontSize: "1rem", fontWeight: 700 }}>
          Physical Examination / Systemic Examination
        </span>
      ),
      children: systemicExamination,
    },
  ];

  return (
    <>
      <Row
        style={{ display: "flex", justifyContent: "space-between" }}
        gutter={32}
      >
        <Col style={{ fontSize: "1rem" }}>Physical Examination</Col>
      </Row>
      <Layout
        style={{
          width: "100%",
          backgroundColor: "white",
          minHeight: "max-content",
          borderRadius: "10px",
        }}
      >
        <Modal
          open={isModalVisible}
          onCancel={handleClose}
          footer={null}
          width={900}
        // bodyStyle={{
        //   padding: 20,
        //   backgroundColor: "#f8f9fa",
        //   borderRadius: "0 0 8px 8px",
        // }}
        >
          <PageHeader title={"Physical General Examination"} button={false} />
          <div>
            <div style={{ marginBottom: 20 }}>
              <span style={{ marginRight: 8, fontWeight: "bold" }}>
                Previous Details:
              </span>
              <Select
                value={previousDetails}
                onChange={handlePreviousDetailsChange}
                style={{ width: 200, marginTop: 20 }}
              >
                <Option value="Last One Week">Last One Week</Option>
                <Option value="Last One Month">Last One Month</Option>
                <Option value="Last Six Months">Last Six Months</Option>
                <Option value="Last One Year">Last One Year</Option>
              </Select>
            </div>
            <Table
              columns={generalColumns}
              dataSource={generalData}
              rowKey="SLNo"
              pagination={false}
              bordered
              style={{
                marginBottom: 20,
                border: "1px solid #dee2e6",
                borderRadius: "8px",
              }}
            />
            <Title level={4} style={{ marginBottom: 10, color: "#007bff" }}>
              Pickle
            </Title>
            <Table
              columns={pickleColumns}
              dataSource={pickleData}
              rowKey="SLNo"
              pagination={false}
              bordered
              style={{
                border: "1px solid #dee2e6",
                borderRadius: "8px",
              }}
            />
          </div>
          <Row gutter={32} justify={"end"} style={{ margin: "1rem 0 1rem 0" }}>
            <Button size="middle" danger onClick={handleClose}>
              Close
            </Button>
          </Row>
        </Modal>
      </Layout>

      <div
        style={{
          margin: "1rem 0",
          border: "1px solid grey",
          borderRadius: "0.5rem",
          backgroundColor: "#fff",
        }}
      >
        <Form form={form2} onFinish={handleSystemicSubmit} layout="vertical">
          <Collapse items={items} bordered={false} ghost size="large" />
        </Form>
      </div>
    </>
  );
}

export default PhysicalExamination;