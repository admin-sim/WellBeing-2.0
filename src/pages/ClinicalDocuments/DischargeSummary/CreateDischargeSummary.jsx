import {
    Button,
    Col,
    Form,
    Input,
    Spin,
    Popconfirm,
    Row,
    Select,
    Table,
    Divider,
    Tabs,
    Tooltip,
    AutoComplete,
    Checkbox,
    DatePicker,
    message,
  } from "antd";
  import moment from "moment";
  import {
    DeleteOutlined,
    EditOutlined,
    PlusCircleOutlined,
  } from "@ant-design/icons";
  import React, { useEffect, useState } from "react";
  import Layout from "antd/es/layout/layout";
  import PageHeader from "../../../components/PageHeader/index.jsx";
  import PatientHeader from "../../../components/PatientHeader/index.jsx";
  import { useNavigate } from "react-router";
  import {
    urlGetPatientHeaderDetails,
    urlGetDischargeSummary,
    urlGetDischargeSummaryForEdit,
    urlAddNewDischargeSummary,
    urlGetAllPatientComplaints,
    urlSearchExistingPrescription,
    urlGetAllDrugs,
    urlGetProductDetails,
    urlAddNewNewRequest,
    urlUpdateIndent,
    urlAddNewPatientIndent,
    urlGetPrescriptionByPrescriptionHedderId,
    urlUpdateRequest,
    urlGetNewRequest,
  } from "../../../../endpoints";
  import dayjs from "dayjs";
  import { v4 as uuidv4 } from "uuid";
  import { useForm } from "antd/es/form/Form";
  import { useLocation } from "react-router-dom";
  import customAxios from "../../../components/customAxios/customAxios.jsx";
  import DischargeSummary from "./index.jsx";
  const DischargeForm = () => {
    const [patientData, setPatientData] = useState();
    const location = useLocation();
    const Patient = location.state.record;
    const [saveTriggered, setSaveTriggered] = useState(false);
    const [dsModel, setDsModel] = useState([]);
    const [dSummary, setDSummary] = useState(null);
    const [EDsummary, setEDSummary] = useState(null);
    const [form] = useForm();
    const [form1] = useForm();
    const initial = [
      {
        key: uuidv4(),
        DrugId: "",
        Route: "",
        Frequency: "",
        IntervalInDays: "",
        TotalQty: "",
        Instruction: "",
        ActiveFlag: true,
        PrescriptionStatus: true,
      },
    ];
    const [buttonTitle, setButtonTitle] = useState("Save");
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState(initial);
    const [productOptions, setProductOptions] = useState([]);
    const [tabName, setTabName] = useState("New");
    const [tableData2, setTableData2] = useState([]);
    const navigate = useNavigate();
    const [defaultActiveKey, setDefaultActiveKey] = useState("1");
    const [dropDown, setDropDown] = useState({
      StoreModel: [],
      Route: [],
      Frequency: [],
    });
  
    useEffect(() => {
      debugger
      const fetch = async () => {
        const response = await customAxios.get(
          `${urlGetNewRequest}?EncounterId=${Patient.EncounterId}&Patientid=${Patient.PatientId}`
        );
        if (response.status === 200 && response.data.data !== null) {
          setDropDown(response.data.data);
          form.setFieldsValue({ Store: response.data.data.StoreId });
          // const newdata =
          //   response.data.data.ExistingPrescriptionModel.map(
          //     (item, index) => {
          //       return {
          //         ...item,
          //         key: uuidv4(),
          //         index: index + 1
          //       };
          //     }
          //   );
          // setTableData2(newdata);
        } else {
          console.error("Failed to fetch Record EDD");
        }
        // } catch (error) {
        //   console.error("Error:", error);}
        // } finally {
        //   setLoading(false)
        // }
        // urlGetNewRequest}
      };
      fetch();
    }, []);
    
    const handleSearch = async (searchText) => {
      if (searchText) {
        const response = await customAxios.get(
          `${urlGetAllDrugs}?Type=${searchText}`
        );
        const apiData = response.data.data;
        const newdata = apiData.map((item) => {
          return {
            label: item.ProductName + " (Stock)" + item.CurrentStock,
            value: item.ProductName,
            id: item.ProductId,
          };
        });
        setProductOptions(newdata);
      }
    };
  
    const handleInputChange = async (value, record, option) => {
      const response = await customAxios.get(
        `${urlGetProductDetails}?ProductId=${option.id}`
      );
      const apiData = response.data.data;
      if (response.status === 200 && apiData != null) {
        form1.setFieldsValue({
          [record.key]: { DrugId: apiData.ProductDefinitionId },
        });
        form1.setFieldsValue({ [record.key]: { UomId: apiData.UOMPrimaryUOM } });
      }
    };
  
    const getInstruction = (value) => {
      switch (value) {
        case 5:
          return { text: "Afternoon", round: 1 };
        case 4:
          return { text: "Night", round: 1 };
        case 3:
          return { text: "Morning, Afternoon and Night", round: 3 };
        case 2:
          return { text: "Morning", round: 1 };
        default:
          return { text: "Morning and Night", round: 2 };
      }
    };
  
    const SelectFrequency = (value, option, record) => {
      const total = 0;
      const interval = form1.getFieldValue([record.key, "IntervalInDays"]);
      if (value) {
        form1.setFieldsValue({
          [record.key]: { Instruction: getInstruction(value).text },
        });
        if (interval) {
          form1.setFieldsValue({
            [record.key]: {
              TotalQty: getInstruction(value).round * parseInt(interval),
            },
          });
        } else {
          form1.setFieldsValue({ [record.key]: { TotalQty: total } });
        }
      } else {
        form1.setFieldsValue({ [record.key]: { Instruction: "" } });
        form1.setFieldsValue({ [record.key]: { TotalQty: 0 } });
      }
    };
  
    const Interval = (value, record) => {
      const form3data = form1.getFieldsValue();
      const specific = form3data[record.key].Frequency;
      form1.setFieldsValue({
        [record.key]: {
          TotalQty:
            getInstruction(specific).round * (value ? parseInt(value) : 1),
        },
      });
    };
    const handleAddRow = async () => {
      setProductOptions([]);
      await form1.validateFields();
      setDataSource([
        ...dataSource,
        {
          key: uuidv4(),
          DrugId: "",
          Route: "",
          Frequency: "",
          IntervalInDays: "",
          TotalQty: "",
          Instruction: "",
          ActiveFlag: true,
          PrescriptionStatus: true,
        },
      ]);
      // const newData = {
      //   key: dataSource.length + 1,
      //   name: `Drug${dataSource.length + 1}`,
      // };
      // setDataSource([...dataSource, newData]);
    };
  
    const handleDeleteRow = (record) => {
      const newData = dataSource.map((item) => {
        if (item.key === record.key) {
          return { ...item, PrescriptionStatus: false };
        }
        return item;
      });
      setDataSource(newData);
    };
  
    const columns = [
      {
        title: "Drug",
        dataIndex: "Drug",
        width: 300,
        render: (text, record) => (
          <>
            <Form.Item
              name={[record.key, "Drug"]}
              style={{ marginBottom: 0 }}
              rules={[{ required: true, message: "Please input drug!" }]}
              initialValue={record.DrugName}
            >
              <AutoComplete
                disabled={!!record.PrescriptionLineId}
                options={productOptions}
                onSearch={handleSearch}
                onSelect={(value, option) =>
                  handleInputChange(value, record, option)
                }
              />
            </Form.Item>
            <Form.Item
              hidden
              name={[record.key, "DrugId"]}
              initialValue={record.DrugId}
            >
              <Input />
            </Form.Item>
            <Form.Item
              hidden
              name={[record.key, "UomId"]}
              initialValue={record.UomId}
            >
              <Input />
            </Form.Item>
            <Form.Item
              hidden
              name={[record.key, "PrescriptionLineId"]}
              initialValue={record.PrescriptionLineId}
            >
              <Input />
            </Form.Item>
            <Form.Item
              hidden
              name={[record.key, "IndentLineId"]}
              initialValue={record.IndentLineId}
            >
              <Input />
            </Form.Item>
          </>
        ),
      },
      {
        title: "Route",
        dataIndex: "Route",
        render: (text, record) => (
          <Form.Item
            name={[record.key, "Route"]}
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: "Please select route!" }]}
            initialValue={record.Route}
          >
            <Select style={{ width: "100%" }}>
              {(dropDown.Route || []).map((option) => (
                <Select.Option key={option.LookupID} value={option.LookupID}>
                  {option.LookupDescription}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        ),
      },
      {
        title: "Frequency",
        dataIndex: "Frequency",
        render: (text, record) => (
          <Form.Item
            name={[record.key, "Frequency"]}
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: "Please input frequency!" }]}
            initialValue={record.FrequencyId}
          >
            <Select
              style={{ width: "100%" }}
              onChange={(value, option) => SelectFrequency(value, option, record)}
              allowClear
            >
              {(dropDown.Frequency || []).map((option) => (
                <Select.Option
                  key={option.FrequencyId}
                  value={option.FrequencyId}
                >
                  {option.FrequencyName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        ),
      },
      {
        title: "IntervalInDays",
        dataIndex: "IntervalInDays",
        render: (text, record) => (
          <Form.Item
            name={[record.key, "IntervalInDays"]}
            style={{ marginBottom: 0 }}
            initialValue={record.Interval}
          >
            <Input
              value={text}
              onChange={(e) => Interval(e.target.value, record)}
            />
          </Form.Item>
        ),
      },
      // {
      //   title: "TotalQty",
      //   dataIndex: "TotalQty",
      //   render: (text, record) => (
      //     <Form.Item
      //       name={[record.key, "TotalQty"]}
      //       style={{ marginBottom: 0 }}
      //       initialValue={record.TotalQty}
      //     >
      //       <Input
      //         value={text}
      //         // onChange={(e) =>
      //         //   handleInputChange(e.target.value, record.key, "TotalQty")
      //         // }
      //       />
      //     </Form.Item>
      //   ),
      // },
      {
        title: "Instruction",
        dataIndex: "Instruction",
        render: (text, record) => (
          <Form.Item
            name={[record.key, "Instruction"]}
            style={{ marginBottom: 0 }}
            initialValue={record.Instruction}
          >
            <Input value={text} />
          </Form.Item>
        ),
      },
      {
        title: (
          <Button type="link" onClick={handleAddRow}>
            <PlusCircleOutlined />
          </Button>
        ),
        // render: (_, record) => (
        //   <Button type="link" danger onClick={() => handleDeleteRow(record.key)}>
        //     <DeleteOutlined />
        //   </Button>
        // ),
        render: (_, record) => (
          <Popconfirm
            danger
            title="Sure to delete?"
            onConfirm={() => handleDeleteRow(record)}
          >
            <DeleteOutlined />
          </Popconfirm>
        ),
      },
    ];
    const [formData, setFormData] = useState({
      diagnosis: "",
      symptoms: "",
      chiefComplaint: "",
      historyAllergy: "",
      clinicalFindings: "",
      courseInHospital: "",
      adviceOnDischarge: "",
      dischargeMedication: [
        {
          drug: "",
          route: "IV",
          frequency: "0-0-1",
          intervalDays: 2,
          instruction: "",
        },
      ],
      followUpDate: "",
      surgeryDate: "",
      FollowUpCheck: "",
      SurgeryCheck: "",
      showFollowUpDate: false,
      showSurgeryDate: false,
    });
  
    const cellStyle = {
      padding: "8px",
      border: "1px solid #ddd",
      backgroundColor: "#fff",
    };
  
    const headerCellStyle = {
      background: "#007bff",
      color: "#fff",
      textAlign: "left",
      padding: "8px",
      border: "1px solid #ddd",
    };
  
    const inputStyle = {
      width: "100%",
      padding: "6px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    };
    // const handleInputChangeOR = (e) => {
    //   const { name, value } = e.target;
    //   setFormData((prev) => ({ ...prev, [name]: value }));
    // };
    const handleSave = async () => {
      try {
        // Get form values
        // const formData = form1.getFieldsValue();
  
        // Make an API call to save data
        const response = await customAxios.post(
          urlAddNewDischargeSummary,
          formData
        );
  
        if (response.status === 200 || response.status === 201) {
          message.success("Data saved successfully!");
          form.resetFields(); // Reset the form after successful save
        } else {
          message.error("Failed to save data. Please try again.");
        }
      } catch (error) {
        console.error("Error saving data:", error);
        message.error("An error occurred while saving data.");
      }
    };
    // useEffect(() => {
    //   const handleSave = async () => {
    //     try {
    //       if (!saveTriggered) return; // Exit if save isn't triggered
  
    //       // Get form values
    //       const formData = form.getFieldsValue();
  
    //       // Make an API call to save data
    //       const response = await axios.post(urlAddNewDischargeSummary, formData);
  
    //       if (response.status === 200 || response.status === 201) {
    //         message.success("Data saved successfully!");
    //         form.resetFields(); // Reset the form after successful save
    //       } else {
    //         message.error("Failed to save data. Please try again.");
    //       }
    //     } catch (error) {
    //       console.error("Error saving data:", error);
    //       message.error("An error occurred while saving data.");
    //     } finally {
    //       setSaveTriggered(false); // Reset the save trigger
    //     }
    //   };
  
    //   handleSave();
    // }, [saveTriggered]); // Only re-run when `saveTriggered` changes
  
    // // Function to trigger the save process
    // const triggerSave = () => {
    //   setSaveTriggered(true);
    // };
  
    const handleCancel = () => {
      navigate("/DischargeSummary");
    };
  
    // const handleMedicationChange = (index, e) => {
    //   const { name, value } = e.target;
    //   const medications = [...formData.dischargeMedication];
    //   medications[index][name] = value;
    //   setFormData((prev) => ({ ...prev, dischargeMedication: medications }));
    // };
  
    // const addMedication = () => {
    //   setFormData((prev) => ({
    //     ...prev,
    //     dischargeMedication: [
    //       ...prev.dischargeMedication,
    //       { drug: '', route: 'IV', frequency: '0-0-1', intervalDays: 2, instruction: '' },
    //     ],
    //   }));
    // };
    // const removeMedication = (index) => {
    //   setFormData((prev) => ({
    //     ...prev,
    //     dischargeMedication: prev.dischargeMedication.filter((_, i) => i !== index),
    //   }));
    // };
    const handleOnFinish = async (values) => {
      try {
        // Log form values for debugging
        console.log("Form Values Submitted:", values);
  
        // Make API call to save form data
        const response = await customAxios.post(
          urlAddNewDischargeSummary,
          values
        );
  
        if (response.status === 200 || response.status === 201) {
          message.success("Data saved successfully!");
          form.resetFields(); // Reset the form fields on successful submission
        } else {
          message.error("Failed to save data. Please try again.");
        }
      } catch (error) {
        console.error("Error saving data:", error);
        message.error("An error occurred while saving data.");
      }
    };
  
    const handleUpdate = () => {
      console.log("Form data:", formData);
      alert("Form updated successfully!");
    };
  
    // // Handler for Follow-Up Checkbox
    // const handleFollowUpCheck = (event) => {
    //   debugger;
    //   setFormData((prev) => ({
    //     ...prev,
    //     showFollowUpDate: event.target.checked,
    //   }));
    //   form.setFieldsValue({
    //     followUpDate: event.target.checked ? dayjs() : null,
    //   });
    // };
  
    // // Handler for Surgery Checkbox
    // const handleSurgeryCheck = (event) => {
    //   debugger;
    //   setFormData((prev) => ({
    //     ...prev,
    //     showSurgeryDate: event.target.checked,
    //   }));
    //   form.setFieldsValue({
    //     surgeryDate: event.target.checked ? dayjs() : null,
    //   });
    // };
   
    // useEffect(() => {
    //   const initialValues = form.getFieldsValue();
    //   setFormData({
    //     showFollowUpDate: initialValues.FollowUpCheck || false,
    //     showSurgeryDate: initialValues.SurgeryCheck || false,
    //   });
    // }, [form]);
    
    // Follow-Up Checkbox Handler
    // const handleFollowUpCheck = (event) => {
    //   setFormData((prev) => ({
    //     ...prev,
    //     showFollowUpDate: event.target.checked,
    //   }));
     
    // };
    
    // // Surgery Checkbox Handler
    // const handleSurgeryCheck = (event) => {
    //   setFormData((prev) => ({
    //     ...prev,
    //     showSurgeryDate: event.target.checked,
    //   }));
    
    // };
    
    const handleSubmit = async (values) => {
      debugger;
      const Drugss = [];
      await form.validateFields();
  
      const mapValues = {
        // Define the new structure to map values to
        DischargeSummaryMedicationId: dsModel?.DischargeSummaryMedicationId ?? 0,
        DischargeSummaryID: dsModel?.DischargeSummaryID ?? 0,
        DiaProcedure: values.diagnosis,
        Symptoms: values.symptoms,
        ChiefComplaint: values.chiefComplaint,
        HistoryAllergy: values.historyAllergy,
        ClinicalFinding: values.clinicalFindings,
        CourseInHospital: values.courseInHospital,
        Advice: values.adviceOnDischarge,
        Surgery: values.surgeryDate ? values.surgeryDate.toDate() : null, // If date exists, use it
        // : dayjs().format("DD-MM-YYYY"), // Use current date in DD-MM-YYYY format if no date is provided
        FollowUpDate: values.followUpDate ? values.followUpDate.toDate() : null, // If date exists, use it
        // : dayjs().format("DD-MM-YYYY"), // Use current date in DD-MM-YYYY format if no date is provided
        FollowUpDate1: values.followUpDate
          ? values.followUpDate.format("DD-MM-YYYY")
          : null,
        Surgery1: values.surgeryDate
          ? values.surgeryDate.format("DD-MM-YYYY")
          : null,
        PatientId: Patient.PatientId, // Patient info from Patient object
        EncounterId: Patient.EncounterId, // Encounter info from Patient object
        FollowUpCheck: values.FollowUpCheck ? values.FollowUpCheck : false,
        SurgeryCheck: values.SurgeryCheck ? values.SurgeryCheck : false,
      };
  
      // Additional logic for medications
      const form2data = form1.getFieldsValue() || {}; // default to an empty object if form1 is null or undefined
  
      for (let i = 0; i < dataSource.length; i++) {
        const item = form2data[dataSource[i].key] || {}; // default to an empty object if the key does not exist or is null
      
        // Check for PrescriptionStatus and handle the case if no drugs are selected
        // const Products = dataSource.filter(
        //   (item) => item.PrescriptionStatus === true
        // );
      
        // if (Products.length === 0) {
        //   message.warning("Please Add Drug");
        //   return false;
        // }
      
        if (
          item &&
          dataSource[i].PrescriptionLineId ===
            (form2data[dataSource[i].key] || {}).PrescriptionLineId
        ) {
          const Drug = {
            DischargeSummaryMedicationId:
              dsModel?.DischargeSummaryMedicationId ?? 0, // Nullish coalescing to default if undefined or null
            DischargeSummaryID: dsModel?.DischargeSummaryID ?? 0,
            DrugId: item.DrugId || 0, // default to 0 if DrugId is null or undefined
            UomId: item.UomId || 0, // default to 0 if UomId is null or undefined
            Dose: item.Dose || 0, // default to 0 if Dose is null or undefined
            Route: item.Route ? item.Route.toString() : "", // default to empty string if Route is null or undefined
            FrequencyId: item.Frequency || 0, // default to 0 if Frequency is null or undefined
            Interval: item.IntervalInDays ? parseInt(item.IntervalInDays) : 0, // safely parse the interval
            Instruction: item.Instruction || "", // default to empty string if Instruction is null or undefined
            EncounterId: Patient?.EncounterId || null, // use optional chaining and default to null
            PatientId: Patient?.PatientId || null, // use optional chaining and default to null
            PrescriptionStatus: true,
            ActiveFlag: true,
            Dsmstatus:true,
          };
          Drugss.push(Drug);
        } else {
          const Drug = {
            DrugId: dataSource[i].DrugId || 0, // default to 0 if DrugId is null or undefined
            UomId: dataSource[i].UomId || 0, // default to 0 if UomId is null or undefined
            Dose: dataSource[i].Dose || 0, // default to 0 if Dose is null or undefined
            Route: dataSource[i].Route ? dataSource[i].Route.toString() : "", // default to empty string if Route is null or undefined
            FrequencyId: dataSource[i].FrequencyId || null, // default to null if FrequencyId is null or undefined
            Interval: dataSource[i].Interval ? parseInt(dataSource[i].Interval) : 0, // safely parse the interval
            Instruction: dataSource[i].Instruction || "", // default to empty string if Instruction is null or undefined
            EncounterID: Patient?.EncounterId || null, // use optional chaining and default to null
            PatientId: Patient?.PatientId || null, // use optional chaining and default to null
            PrescriptionStatus: false,
            ActiveFlag: false,
            Dsmstatus:false,
          };
          Drugss.push(Drug);
        }
      }
      
  
      const Summary = {
        DischargeSummaryModel: Drugss,
        DischargeSummary: mapValues,
      };
      console.log("Summary before processing:", Summary);
      // Post data to backend based on URL logic
      // const urlIndent = !!obj.PriscptionHedderId ? urlUpdateIndent : urlAddNewPatientIndent;
      // const urlPres = !!obj.PriscptionHedderId ? urlUpdateRequest : urlAddNewNewRequest;
      const response = await customAxios.post(
        urlAddNewDischargeSummary,
        Summary,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200) {
        // const Prescription = Drugss.map((item) => ({
        //   ...item,
        //   IndentId: response.data.data.IndentId,
        //   IndentNumber: response.data.data.IndentNumber,
        //   Stock: item.Stock ? item.Stock : 0,
        // }));
        // message.success("Success");
        message.success("Success");
        form1.resetFields();
        form.resetFields();
        setDataSource(initial);
        navigate("/DischargeSummary");
  
        // const response1 = await customAxios.post(urlPres, Prescription, {
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // });
  
        if (response1.status === 200 && response1.data === "Success") {
          message.success("Success");
          form1.resetFields();
          setDataSource(initial);
          navigate("/DischargeSummary");
        }
      }
    };
    
    
  
    useEffect(() => {
      const fetchDataHeader = async () => {
        try {
          const response = await customAxios.get(
            `${urlGetPatientHeaderDetails}?PatientId=${Patient.PatientId}&EncounterId=${Patient.EncounterId}`
          );
          if (response.status === 200 && response.data.data != null) {
            const detailsheader = response.data.data.EncounterModel;
            setPatientData(detailsheader);
          }
        } catch (error) {}
      };
      fetchDataHeader();
    }, []);
  
    useEffect(() => {
      const fetchDischargeSummary = async () => {
        try {
          const response = await customAxios.get(
            `${urlGetDischargeSummary}?PatientId=${Patient.PatientId}&EncounterId=${Patient.EncounterId}&Uhid=${Patient.UhId}`
          );
          if (response.status === 200 && response.data.data != null) {
            const detaileader = response.data.data.dsModel[0].DischargeSummaryID;
            setDsModel(response.data.data.dsModel[0]);
            setDSummary(detaileader);
          }
        } catch (error) {}
      };
      fetchDischargeSummary();
    }, []);
  
    const handleFollowUpCheck = (event) => {
      const checked = event.target.checked;
      setFormData((prev) => ({
        ...prev,
        showFollowUpDate: checked,
      }));
    
      // Update followUpDate based on checkbox state
      // form.setFieldsValue({
      //   followUpDate: checked ? form.getFieldValue('followUpDate')
      // });
    };
    
    const handleSurgeryCheck = (event) => {
      const checked = event.target.checked;
      setFormData((prev) => ({
        ...prev,
        showSurgeryDate: checked,
      }));
    
      // Update surgeryDate based on checkbox state
      // form.setFieldsValue({
      //   surgeryDate: checked ? form.getFieldValue('surgeryDate') 
      // });
    };
    
    useEffect(() => {
      const fetchDischargeSummaryForEdit = async () => {
        debugger
        try {
          const response = await customAxios.get(
            `${urlGetDischargeSummaryForEdit}?PatientId=${Patient.PatientId}&EncounterId=${Patient.EncounterId}`
          );
  
          if (response.status === 200 && response.data.data) {
            const data = response.data.data.dsModel || [];
            const medications = response.data.data.dsModel;
  
            // Prefill form fields with API data
            form.setFieldsValue({
              diagnosis: data[0]?.DiaProcedure || "",
              symptoms: data[0]?.Symptoms || "",
              chiefComplaint: data[0]?.ChiefComplaint || "",
              historyAllergy: data[0]?.HistoryAllergy || "",
              clinicalFindings: data[0]?.ClinicalFinding || "",
              courseInHospital: data[0]?.CourseInHospital || "",
              adviceOnDischarge: data[0]?.Advice || "",
              followUpDate: dayjs(data[0].FollowUpDate1, "DD-MM-YYYY"),
              surgeryDate: dayjs(data[0].Surgery1, "DD-MM-YYYY"),
              FollowUpCheck: data[0]?.FollowUpCheck,
              SurgeryCheck: data[0]?.SurgeryCheck,
            });
  
            // Map medication data to the format for table rows
            // Save deleted medication keys to localStorage
            // const medicationData = medications
            // .map((med, index) => {
            //   // Create the medication object with possible nulls replaced by default values
            //   const medication = {
            //     key: index,
            //     DrugName: med.DrugName || null,
            //     Route: med?.Route ? parseInt(med.Route) : null,
            //     FrequencyId: med?.FrequencyId || null,
            //     Interval: med?.Interval || null,
            //     Instruction: med?.Instruction || null,
            //   };
          
            //   // Check if any of the properties are null or empty, return null if so
            //   if (Object.values(medication).some(value => value === null || value === "")) {
            //     return null; // Skip this medication if any field is null or empty
            //   }
          
            //   return medication;
            // })
            // .filter(medication => medication !== null); // Remove any null values from the result
            const medicationData = medications.map((med, index) => ({
              key: index,
              DrugName: med.DrugName || null,
              Route: parseInt(med?.Route) || "",
              FrequencyId: med?.FrequencyId || 0,
              Interval: med?.Interval || 0,
              Instruction: med?.Instruction || "",
            }));
  
            // Update the table data source with the fetched medication data
            setDataSource(medicationData);
            setDsModel(data);
          }
        } catch (error) {
          console.error("Error fetching discharge summary for edit:", error);
        }
      };
  
      fetchDischargeSummaryForEdit();
    }, [Patient.PatientId, Patient.EncounterId]);
  
    
    
    return (
      <Layout
        style={{
          width: "100%",
          backgroundColor: "white",
          minHeight: "max-content",
          borderRadius: "10px",
        }}
      >
        <PageHeader title={"Discharge Summary"} button={false} />
        <Row
          gutter={32}
          style={{
            display: "flex",
            alignItems: "end",
          }}
        >
          <Col span={32}>
            <PatientHeader patient={patientData} />
          </Col>
          <Col
            span={4}
            style={{
              display: "flex",
              alignItems: "end",
              justifyContent: "center",
            }}
          ></Col>
        </Row>
        <Form
          layout="vertical"
          form={form}
          name="dischargeForm"
          onFinish={handleSubmit}
          scrollToFirstError={true}
          style={{
            padding: "16px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            marginTop: "20px",
          }}
          initialValues={{
            FollowUpCheck: false,
            SurgeryCheck: false,
            followUpDate: null,
            surgeryDate: null,
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="🩺 Diagnosis and Procedure"
                name="diagnosis"
                initialValue={formData.diagnosis}
                rules={[
                  {
                    required: true,
                    message: "Please enter the diagnosis and procedure",
                  },
                ]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>
  
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="🤒 Symptoms"
                name="symptoms"
                initialValue={formData.symptoms}
                rules={[{ required: true, message: "Please enter symptoms" }]}
              >
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="🗣️ Chief Complaint"
                name="chiefComplaint"
                initialValue={formData.chiefComplaint}
                rules={[
                  { required: true, message: "Please enter the chief complaint" },
                ]}
              >
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>
  
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="🌿 History and Allergy"
                name="historyAllergy"
                initialValue={formData.historyAllergy}
              >
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>
  
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="🔍 Clinical Findings"
                name="clinicalFindings"
                initialValue={formData.clinicalFindings}
              >
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>
  
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="🏥 Course in Hospital"
                name="courseInHospital"
                initialValue={formData.courseInHospital}
              >
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>
  
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="📋 Advice on Discharge"
                name="adviceOnDischarge"
                initialValue={formData.adviceOnDischarge}
              >
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>
          <Form form={form1} component={false}>
            <Row>
              <Col span={24} style={{ marginTop: "1rem" }}>
                <Row>
                  <Col span={24}>
                    <PageHeader title={"Discharge Medication"} button={false} />
                  </Col>
                </Row>
                <Table
                  columns={columns}
                  dataSource={dataSource.filter(
                    (item) => item.PrescriptionStatus !== false
                  )}
                  pagination={false}
                  bordered
                  scroll={{
                    y: 200,
                  }}
                />
              </Col>
            </Row>
          </Form>
          <Row gutter={16} style={{ marginTop: "2rem" }}>
            {/* Follow-Up Date Section */}
            <Col span={12}>
              <Form.Item valuePropName="checked" name="FollowUpCheck">
                <Checkbox
                  checked={formData.showFollowUpDate}
                  onChange={handleFollowUpCheck}
                >
                  Follow-Up Date
                </Checkbox>
              </Form.Item>
              {formData.showFollowUpDate && (
                <Form.Item
                  name="followUpDate"
                  label="Follow-Up Date"
                  initialValue={formData.followUpDate}
                  rules={[
                    {
                      required: true,
                      message: "Please select the follow-up date",
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    disabledDate={(current) => {
                      // Disable past dates and dates beyond 1 year
                      const today = moment().startOf("day");
                      const nextYear = moment().add(1, "years").endOf("day");
                      return current && (current < today || current > nextYear);
                    }}
                  />
                </Form.Item>
              )}
            </Col>
  
            {/* Surgery Date Section */}
            <Col span={12}>
              <Form.Item valuePropName="checked" name="SurgeryCheck">
                <Checkbox
                  checked={formData.showSurgeryDate}
                  onChange={handleSurgeryCheck}
                >
                  Surgery Date
                </Checkbox>
              </Form.Item>
              {formData.showSurgeryDate && (
                <Form.Item
                  name="surgeryDate"
                  label="Surgery Date"
                  initialValue={formData.surgeryDate}
                  rules={[
                    { required: true, message: "Please select the surgery date" },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    disabledDate={(current) => {
                      // Disable future dates and dates older than 2 years
                      const today = moment().endOf("day");
                      const twoYearsAgo = moment()
                        .subtract(2, "years")
                        .startOf("day");
                      return (
                        current && (current > today || current < twoYearsAgo)
                      );
                    }}
                  />
                </Form.Item>
              )}
            </Col>
          </Row>
  
          <Row gutter={16} justify="end" style={{ marginTop: "16px" }}>
            <Col>
              <Button type="primary" htmlType="submit">
                {dSummary ? "Update" : "Save"}
              </Button>
            </Col>
            <Col>
              <Button danger onClick={handleCancel}>
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </Layout>
    );
  };
  
  export default DischargeForm;
  