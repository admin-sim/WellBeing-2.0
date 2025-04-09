import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleFilled,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import {
  Layout,
  Row,
  Col,
  Spin,
  Button,
  Form,
  Checkbox,
  Select,
  Divider,
  Collapse,
  notification,
  Modal,
  Table,
  Tooltip,
  Popconfirm,
  InputNumber,
} from "antd";

import Input from "antd/es/input/Input";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  urlCreateNewService,
  urlAddNewService,
  urlEditService,
  urlUpdateService,
} from "../../../../../endpoints";
import customAxios from "../../../../components/customAxios/customAxios";
import OrderingAttributeModal from "./OrderingAttributeModal";
import MedicalCodeModal from "./MedicalCodeModal";
import TurnAroundTimeTableModal from "./TurnAroundTimeTableModal";
import PageHeader from "../../../../components/PageHeader";
import { FaAnglesLeft } from "react-icons/fa6";
const { Panel } = Collapse;
function CreateService() {
  const [form] = Form.useForm();
  const location = useLocation();
  const Serviceclassificationid = location.state.serviceclassificationid;
  const ServiceId = location.state.serviceid;
  const [uom, setUom] = useState([]);
  const [category, setCategory] = useState([]);
  const [servicegroupname, setServiceGroupName] = useState([]);
  const [serviceclassificationname, setServiceClassificationName] = useState([]);
  const [testresulttypes, setTestResultTypes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMedicalModalVisible, setIsMedicalModalVisible] = useState(false);
  const [isTurnAroundTimeModalVisible, setIsTurnAroundTimeModalVisible] = useState(false);
  const [ageGenderRestriction, setAgeGenderRestriction] = useState([]);
  const [turnAroundTime, setTurnAroundTime] = useState([]);
  const [medicalCode, setMedicalCode] = useState([]);
  const [serviceDropDown, setServiceDropDown] = useState({
    Genders: [],
    Uoms: [],
    MedicalCodeTypes: [],
  });
  const [templateList, setTemplateList] = useState([]);
  const [templatedisable, setTemplateDisable] = useState(true);
  const [reultTypeDisable, setResultTypeDisable] = useState(false);
  const [isTestValuesDisabled, setIsTestValuesDisabled] = useState(true);
  const [isRadiologyChecked, setIsRadiologyChecked] = useState(false);
  const [record, setRecord] = useState(null)
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [testoptions, setTestOptions] = useState([]);
  const [loading, setLoading] = useState(false)
  const [sampleTypes, setSampleTypes] = useState([])
  const [templateListModel, setTemplateListModel] = useState([])


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await customAxios.get(
          `${urlCreateNewService}?ServiceClassificationId=${Serviceclassificationid}`
        );
        if (response.status === 200 && response.data.data != null) {
          const data = response.data.data;
          setTestResultTypes(data.TestResultTypes);
          setUom(data.Uoms);
          setCategory(data.Category);
          setServiceGroupName(data.ServiceGroupName);
          setServiceClassificationName(data.ServiceClassificationName);
          setTemplateList(data.templateListmodel);
          setServiceDropDown(data);
          setSampleTypes(data.SampleTypes)
          setTemplateListModel(data.templateListmodel)
        } else {
          console.error("Failed to fetch patient details");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    EditServiceData();
  }, []);

  const EditServiceData = async () => {
    if (ServiceId > 0) {
      setLoading(true)
      try {
        const response = await customAxios.get(
          `${urlEditService}?Id=${ServiceId}`
        );
        if (response.status === 200 && response.data.data != null) {
          const data = response.data.data.AddNewService;
          form.setFieldsValue({
            serviceclassificationname:
              response.data.data.ServiceClassificationName,
            servicegroupname: response.data.data.ServiceGroupName,
            ShortName: data.ShortName,
            LongName: data.LongName,
            UomId: data.UomId,
            CategoryId: data.CategoryId,
            Status: data.Status,
            Remarks: data.Remarks,
            IsSubTest: data.IsSubTest,
            IsRadiology: data.IsRadiology,
            ResultType: data.ResultType,
            TemplateID: data.TemplateID,
            SampleTypeId: data.SampleTypeId,
            IsFromTestValues: data.IsFromTestValues,
            TestValues: data.TestValues,
            NormalValForTestVal: data.NormalValForTestVal,
            LabUOM: data.LabUOM,
            IsProviderRequired: data.IsProviderRequired,
            IsServiceEditable: data.IsServiceEditable,
            IsAssociateCharge: data.IsAssociateCharge,
            IsSurgeryCharge: data.IsSurgeryCharge
          });

          const order = response.data.data.ListServiceOrdering.map((p) => {
            const startAgeUnitOption = response.data.data?.Uoms.find(
              (option) => option.UomId === p.StartAgeUom
            );
            const endAgeUnitOption = response.data.data?.Uoms.find(
              (option) => option.UomId === p.EndAgeUom
            );

            return {
              ...p,
              key: uuidv4(),
              StartAgeUnitShortName: startAgeUnitOption.LongName,
              EndAgeUnitShortName: endAgeUnitOption.LongName
            }
          })

          setAgeGenderRestriction(order)
          if (data.IsFromTestValues) {
            setIsTestValuesDisabled(false);
            setResultTypeDisable(true);
            setTemplateDisable(true);
          }
          if (data.IsRadiology) {
            setIsRadiologyChecked(true);
            setTemplateDisable(false);
            setResultTypeDisable(true);
          }
          setLoading(false)
        } else {
          setLoading(false)
          console.error("Failed to fetch patient details");
        }
      } catch (error) {
        setLoading(false)
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    const filtered = isRadiologyChecked
      ? templateList.filter((template) => template.IsRadiology)
      : templateList.filter((template) => template.IsLab);

    setFilteredTemplates(filtered);
  }, [isRadiologyChecked, templateList]);

  const handleResultTypeChange = (value, option) => {
    if (option.children === "Template") {
      setTemplateDisable(false);
    } else {
      setTemplateDisable(true);
    }
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsRadiologyChecked(checked);
    if (checked === true) {
      setTemplateDisable(false);
      setResultTypeDisable(true);
    } else {
      setTemplateDisable(true);
      setResultTypeDisable(false);
      form.setFieldsValue({ TemplateID: undefined });
    }
    if (checked && testresulttypes.length > 0) {
      form.setFieldsValue({ ResultType: testresulttypes[2].LookupID });
    } else {
      form.setFieldsValue({ ResultType: undefined });
    }
    form.setFieldsValue({
      IsFromTestValues: undefined,
      TestValues: null,
      NormalValForTestVal: null,
    });
  };

  const handleIsFromTestValues = (e) => {
    const checked = e.target.checked;
    if (checked === true) {
      setIsTestValuesDisabled(false);
      setResultTypeDisable(true);
      setTemplateDisable(true);
      form.setFieldsValue({ IsRadiology: false });
    } else {
      setIsTestValuesDisabled(true);
      setResultTypeDisable(false);
      setTemplateDisable(false);
      form.setFieldsValue({
        TemplateID: undefined,
        TestValues: null,
        NormalValForTestVal: null,
      });
    }
    if (checked && testresulttypes.length > 0) {
      form.setFieldsValue({ ResultType: testresulttypes[0].LookupID });
      form.setFieldsValue({ TemplateID: undefined });
    } else {
      form.setFieldsValue({ ResultType: undefined });
    }
  };

  const navigate = useNavigate();

  const handleTestValuesChange = (e) => {
    const value = e.target.value;

    const newOptions = value
      .split("|")
      .map((opt) => opt.trim())
      .filter((opt) => opt);
    setTestOptions(newOptions);
  };

  const options = [
    {
      value: "true",
      label: "Active",
    },
    {
      value: "false",
      label: "Hidden",
    },
  ];

  const onFinish = async (values) => {
    debugger;
    values.ServiceClassificationId = Serviceclassificationid;
    values.ServiceId = ServiceId ? ServiceId : 0;
    values.IsFromTestValues = values.IsFromTestValues ? values.IsFromTestValues : false;
    values.IsRadiology = values.IsRadiology ? values.IsRadiology : false;
    values.IsSubTest = values.IsSubTest ? values.IsSubTest : false;
    values.OrderIsOrderable = values.OrderIsOrderable !== false ? 'True' : 'False';
    values.OrderPatientTypeIp = values.OrderPatientTypeIp !== false ? 'True' : 'False';
    values.OrderPatientTypeAmbulatory = values.OrderPatientTypeAmbulatory !== false ? 'True' : 'False';
    values.OrderPatientTypeEmergency = values.OrderPatientTypeEmergency !== false ? 'True' : 'False';
    values.OrderPatientTypeShortStay = values.OrderPatientTypeShortStay !== false ? 'True' : 'False';
    values.IsAtomic = values.IsAtomic === true ? 'True' : 'False'
    values.ExecutionResultApplicable = values.ExecutionResultApplicable === true ? 'True' : 'False'
    values.ExecutionRequestAnesthetist = values.ExecutionRequestAnesthetist === true ? 'True' : 'False'

    const validItems = ageGenderRestriction.filter(
      (item) => item.ServiceOrderAttributeId !== undefined
    );

    const tempItems = ageGenderRestriction.filter(
      (item) => item.ServiceOrderAttributeId === undefined && item.ActiveFlag === true
    );

    const validItems1 = turnAroundTime.filter(
      (item) => item.OrderPriorityId !== undefined
    );

    const tempItems1 = turnAroundTime.filter(
      (item) => item.OrderPriorityId === undefined && item.ActiveFlag === true
    );

    const validItems2 = medicalCode.filter(
      (item) => item.MedicalCodeId !== undefined
    );

    const tempItems2 = medicalCode.filter(
      (item) => item.MedicalCodeId === undefined && item.ActiveFlag1 === true
    );

    const Service = {
      AddNewService: values,
      ListServiceOrdering: validItems,
      ListServiceTat: validItems1,
      ListServiceMedicalCode: validItems2,
      NewGender: tempItems,
      NewListServiceTat: tempItems1,
      NewMedicalCode: tempItems2,
      ServiceLabAttribute: null,
      NewServicePackage: null,
      ServicePackage: null
    };

    const url = ServiceId ? urlUpdateService : urlAddNewService;
    try {
      const response = await customAxios.post(url, Service, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status == 200 && response.data.data == true) {
        notification.success({
          message: "Success",
          description: "ServiceAdded Succeessfully.....",
        });
        form.resetFields();
        const url = "/Service";
        navigate(url);
      } else {
        notification.error({
          message: "Error",
          description: "Something Went Wrong.....",
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Something Went Wrong.....",
      });
    }
  };

  const showModal = (record) => {
    setRecord(record)
    setIsModalVisible(true);
  };

  const showMedicalCodeModel = (record) => {
    setRecord(record)
    setIsMedicalModalVisible(true);
  };

  const showTurnArountTimeModel = (record) => {
    setRecord(record)
    setIsTurnAroundTimeModalVisible(true);
  };

  const handleSubmit = (values) => {
    debugger
    const valuesArray = Array.isArray(values) ? values : [values];

    setAgeGenderRestriction((prev) => {
      const updatedList = [...prev];

      valuesArray.forEach((newItem) => {
        const existingIndex = updatedList.findIndex(
          (item) => item.ServiceOrderAttributeId === newItem.ServiceOrderAttributeId && item.key === newItem.key
        );

        if (existingIndex !== -1) {
          updatedList[existingIndex] = {
            ...updatedList[existingIndex],
            ...newItem,
          };
        } else {
          updatedList.push(newItem);
        }
      });

      return updatedList;
    });
    setRecord(null)
  };


  const handleMedicalCodeSubmit = (values) => {
    const valuesArray = Array.isArray(values) ? values : [values];

    setMedicalCode((prev) => {
      const updatedList = [...prev];

      valuesArray.forEach((newItem) => {
        const existingIndex = updatedList.findIndex(
          (item) => item.MedicalCodeId === newItem.MedicalCodeId && item.key === newItem.key
        );

        if (existingIndex !== -1) {
          updatedList[existingIndex] = {
            ...updatedList[existingIndex],
            ...newItem,
          };
        } else {
          updatedList.push(newItem);
        }
      });

      return updatedList;
    });
    setRecord(null)
  };

  const handleTurnAroundTimeSubmit = (values) => {
    debugger
    const valuesArray = Array.isArray(values) ? values : [values];

    setTurnAroundTime((prev) => {
      const updatedList = [...prev];

      valuesArray.forEach((newItem) => {
        const existingIndex = updatedList.findIndex(
          (item) => item.OrderPriorityId === newItem.OrderPriorityId && item.key === newItem.key
        );

        if (existingIndex !== -1) {
          updatedList[existingIndex] = {
            ...updatedList[existingIndex],
            ...newItem,
          };
        } else {
          updatedList.push(newItem);
        }
      });

      return updatedList;
    });
    setRecord(null)
  };

  function onGenderDelete(record) {
    debugger
    const newGender = ageGenderRestriction.map((m) => {
      if (m.key === record.key) {
        return {
          ...m,
          ActiveFlag: false
        }
      }
      return m
    })
    setAgeGenderRestriction(newGender);
  }

  function onTatDelete(record) {
    debugger
    const newTat = turnAroundTime.map((m) => {
      if (m.key === record.key) {
        return {
          ...m,
          ActiveFlag: false
        }
      }
      return m
    })
    setTurnAroundTime(newTat);
  }

  function onMedicalDelete(record) {
    debugger
    const newCode = medicalCode.map((m) => {
      if (m.key === record.key) {
        return {
          ...m,
          ActiveFlag1: false
        }
      }
      return m
    })
    setMedicalCode(newCode);
  }

  const columns = [
    {
      title: "Gender",
      dataIndex: "GenderType",
      key: "GenderType",
    },
    {
      title: "Start Age",
      dataIndex: "StartAge",
      key: "StartAge",
    },
    {
      title: "Age Unit",
      dataIndex: "StartAgeUnitShortName",
      key: "StartAgeUnitShortName",
    },
    {
      title: "End Age",
      dataIndex: "EndAge",
      key: "EndAge",
    },
    {
      title: "Age Unit",
      dataIndex: "EndAgeUnitShortName",
      key: "EndAgeUnitShortName",
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "Action",
      render: (_, record) =>
        <>
          <Button
            size="small"
            onClick={() => showModal(record)}
            icon={<EditOutlined style={{ fontSize: "0.9rem" }} />}
          ></Button>
          <Popconfirm
            title="Are you sure to delete this item?"
            onConfirm={() => onGenderDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined style={{ fontSize: "0.9rem" }} />}
            ></Button>
          </Popconfirm>
        </>
    }
  ];

  const columnsTurnAroundTime = [
    {
      title: "Order Priority",
      dataIndex: "OrderPriorityId",
      key: "OrderPriorityId",
    },
    {
      title: "Tat Value",
      dataIndex: "TatValue",
      key: "TatValue",
    },
    {
      title: "Tat UOM",
      dataIndex: "TatUomShortName",
      key: "TatUomShortName",
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "Action",
      render: (_, record) =>
        <>
          <Button
            size="small"
            onClick={() => showTurnArountTimeModel(record)}
            icon={<EditOutlined style={{ fontSize: "0.9rem" }} />}
          ></Button>
          <Popconfirm
            title="Are you sure to delete this item?"
            onConfirm={() => onTatDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined style={{ fontSize: "0.9rem" }} />}
            ></Button>
          </Popconfirm>
        </>
    }
  ];

  const columnMedicalCode = [
    {
      title: "Medical Code Type",
      dataIndex: "MedicalCodeTypeName",
      key: "MedicalCodeTypeName",
    },
    {
      title: "Version",
      dataIndex: "Version",
      key: "Version",
    },
    {
      title: "Medical CodeType Description",
      dataIndex: "MedicalCodeTypeDescription",
      key: "MedicalCodeTypeDescription",
    },
    {
      title: "Status",
      dataIndex: "ActiveFlag",
      key: "ActiveFlag",
      render: (_, record) => {
        return record.ActiveFlag === true ? 'Active' : 'Hidden'
      }
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "Action",
      render: (_, record) =>
        <>
          <Button
            size="small"
            onClick={() => showMedicalCodeModel(record)}
            icon={<EditOutlined style={{ fontSize: "0.9rem" }} />}
          ></Button>
          <Popconfirm
            title="Are you sure to delete this item?"
            onConfirm={() => onMedicalDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined style={{ fontSize: "0.9rem" }} />}
            ></Button>
          </Popconfirm>
        </>
    }
  ];

  return (
    <>
      <Layout>
        <div
          style={{
            width: "100%",
            backgroundColor: "white",
            minHeight: "max-content",
            borderRadius: "10px",
          }}
        >
          <PageHeader
            title={"Create Service Definition Manager"}
            buttonIcon={<FaAnglesLeft style={{ fontSize: "1rem" }} />}
            buttonLabel={"Back to list"}
            onButtonClick={() => navigate("/Service")}
          />
          <Spin spinning={loading} tip='loading...'>
            <Form
              style={{ margin: "1rem 2rem" }}
              layout="vertical"
              form={form}
              onFinish={onFinish}
              initialValues={{
                OrderIsOrderable: true,
                OrderPatientTypeIp: true,
                OrderPatientTypeAmbulatory: true,
                OrderPatientTypeEmergency: true,
                OrderPatientTypeShortStay: true,
                IsAtomic: true
              }}
            >
              <Row gutter={32}>
                <Col span={8}>
                  <strong>Service Group:</strong> {servicegroupname}
                </Col>
                <Col span={8}>
                  <strong>Service Classification:</strong>{" "}
                  {serviceclassificationname}
                </Col>
              </Row>
              <Row gutter={18}>
                <Col span={6}>
                  <Form.Item
                    name="ShortName"
                    label="Service Code"
                    rules={[
                      {
                        required: true,
                        message: "Please enter ServiceCode",
                      },
                    ]}
                  >
                    <Input style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="LongName"
                    label="Service Name"
                    rules={[
                      {
                        required: true,
                        message: "Please enter ServiceName",
                      },
                    ]}
                  >
                    <Input style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="UomId"
                    label="Uom"
                    rules={[
                      {
                        required: true,
                        message: "Please select Uom",
                      },
                    ]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      placeholder="SelectUom"
                      allowClear
                    >
                      {uom.map((option) => (
                        <Select.Option key={option.UomId} value={option.UomId}>
                          {option.ShortName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="CategoryId"
                    label="Category"
                    rules={[
                      {
                        required: true,
                        message: "Please select category",
                      },
                    ]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      placeholder="SelectCategory"
                      allowClear
                    >
                      {category.map((option) => (
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
              </Row>
              <Row gutter={18}>
                <Col span={6}>
                  <Form.Item style={{ marginTop: 30 }}
                    name="IsAtomic"
                    valuePropName="checked"
                  >
                    <Checkbox>Is Automic</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="Status"
                    label="Status"
                    rules={[
                      {
                        required: true,
                        message: "Please select Status",
                      },
                    ]}
                    initialValue="true"
                  >
                    <Select style={{ width: "100%" }} options={options} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Remarks">
                    <Form.Item name="Remarks" noStyle>
                      <Input.TextArea />
                    </Form.Item>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={18}>
                <Col span={6}>
                  <Form.Item
                    name="IsProviderRequired"
                    valuePropName="checked"
                  >
                    <Checkbox>Is Provider Required</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="IsServiceEditable"
                    valuePropName="checked"
                  >
                    <Checkbox>Is Service Editable</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="IsAssociateCharge"
                    valuePropName="checked"
                  >
                    <Checkbox>Is Associate Charge</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="IsSurgeryCharge"
                    valuePropName="checked"
                  >
                    <Checkbox>Is Surgery Charge</Checkbox>
                  </Form.Item>
                </Col>
              </Row>
              <Collapse accordion>
                <Panel header="Ordering Attribute" key="2">
                  <Row gutter={16}>
                    <Col span={5}>
                      <Form.Item
                        label="Is Orderable"
                        name="OrderIsOrderable"
                        valuePropName="checked"
                      >
                        <Checkbox>Is Orderable ?</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item
                        label="Frequency Applicable"
                        name="FrequencyApplicable"
                        valuePropName="checked"
                      >
                        <Checkbox> Frequency Applicable ? </Checkbox>
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item
                        label="Schedule Applicable"
                        name="ScheduleApplicable"
                        valuePropName="checked"
                      >
                        <Checkbox> Schedule Applicable? </Checkbox>
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item
                        label="Is Quantity Applicable"
                        name="IsQuantityApplicable"
                        valuePropName="checked"
                      >
                        <Checkbox>Is Quantity Applicable ?</Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Divider orientation="left"> ApplicablePatientType</Divider>
                    <Col span={5}>
                      <Form.Item
                        label="Emergency Patient"
                        name="OrderPatientTypeEmergency"
                        valuePropName="checked"
                      >
                        <Checkbox>Emergency Patient</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item
                        label="In Patient"
                        name="OrderPatientTypeIp"
                        valuePropName="checked"
                      >
                        <Checkbox>In Patient </Checkbox>
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item
                        label="Ambulatory Patient"
                        name="OrderPatientTypeAmbulatory"
                        valuePropName="checked"
                      >
                        <Checkbox>Ambulatory Patient </Checkbox>
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item
                        label="Short Stay Patient"
                        name="OrderPatientTypeShortStay"
                        valuePropName="checked"
                      >
                        <Checkbox>Short Stay Patient</Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Divider orientation="left">
                      Age-Gender Restriction
                      <PlusCircleFilled
                        style={{ marginLeft: 8 }}
                        onClick={() => showModal(null)}
                      />
                    </Divider>
                    <OrderingAttributeModal
                      options={serviceDropDown}
                      open={isModalVisible}
                      handleClose={() => setIsModalVisible(false)}
                      handleSubmit={handleSubmit}
                      record={record}
                    />
                  </Row>
                  <Table
                    dataSource={ageGenderRestriction.filter((k) => k.ActiveFlag === true)}
                    columns={columns}
                    pagination={false}
                    locale={{
                      emptyText: (
                        <span style={{ color: "" }}>No data available</span>
                      ),
                    }}
                    bordered
                  ></Table>
                </Panel>
              </Collapse>
              <Collapse accordion style={{ marginTop: "0.5rem" }}>
                <Panel header="Execution Attributes" key="3">
                  <Row gutter={16}>
                    <Col span={5}>
                      <Form.Item
                        label="Schedule Applicable"
                        name="ExecutionResultApplicable"
                        valuePropName="checked"
                      >
                        <Checkbox> Result Applicable </Checkbox>
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item label="Result Template" name="ExecutionResultComponent">
                        <Select type="text" disabled>
                          <Select.Option></Select.Option>
                          <Select.Option></Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item
                        label="Anesthetist Required"
                        name="ExecutionRequestAnesthetist"
                        valuePropName="checked"
                      >
                        <Checkbox>Anesthetist Required</Checkbox>
                      </Form.Item>
                    </Col>
                    <Divider orientation="left">
                      Estimated Service Duration
                    </Divider>
                  </Row>
                  <Row gutter={16}>
                    <Col span={5}>
                      <Form.Item label="Min." name="ExecutionMinimunServiceDuration">
                        <InputNumber min={0} style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item label="Standard" name="ExecutionStandardServiceDuration">
                        <InputNumber min={0} style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item label="Max." name="ExecutionMaximumServiceDuration">
                        <InputNumber min={0} style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item label="Uom" name="ExecutionUomServiceDuration">
                        <Select
                          style={{ width: "100%" }}
                          placeholder="SelectUom"
                          allowClear
                        >
                          {uom.map((option) => (
                            <Select.Option
                              key={option.UomId}
                              value={option.UomId}
                            >
                              {option.ShortName}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Panel>
              </Collapse>
              <Collapse accordion style={{ marginTop: "0.5rem" }}>
                <Panel header="Lab Attributes" key="1">
                  <Row gutter={16}>
                    <Col span={24}>
                      <Row gutter={16}>
                        <Col span={4}>
                          <Form.Item
                            label="Test Type"
                            name="IsSubTest"
                            valuePropName="checked"
                          >
                            <Checkbox>Is SubTest ?</Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            label="Category"
                            name="IsRadiology"
                            valuePropName="checked"
                          >
                            <Checkbox onChange={handleCheckboxChange}>
                              Is Radiology?
                            </Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item name="ResultType" label="Result Type">
                            <Select
                              onChange={handleResultTypeChange}
                              style={{ width: "100%" }}
                              placeholder="SelectResultType"
                              allowClear
                              disabled={reultTypeDisable}
                            >
                              {testresulttypes.map((option) => (
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
                          <Form.Item label="Templates" name="TemplateID">
                            <Select
                              style={{ width: "100%" }}
                              placeholder="Select Result Type"
                              allowClear
                              disabled={templatedisable}
                            >
                              {templateListModel.map((option) => (
                                <Select.Option
                                  key={option.TID}
                                  value={option.TID}
                                >
                                  {option.TempName}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label="Sample Type" name="SampleTypeId">
                            <Select
                              style={{ width: "100%" }}
                              placeholder="SelectResultType"
                              allowClear
                              disabled={reultTypeDisable}
                            >
                              {sampleTypes.map((option) => (
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
                      </Row>
                    </Col>
                    <Col span={24}>
                      <Row gutter={16}>
                        <Col span={4}>
                          <Form.Item
                            label="&nbsp;"
                            name="IsFromTestValues"
                            valuePropName="checked"
                          >
                            <Checkbox onChange={handleIsFromTestValues}>
                              {" "}
                              IsResult From Test Values ?{" "}
                            </Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            label={
                              <span>
                                Test Values&nbsp;
                                <Tooltip title="Enter values separated by '|' (pipe)">
                                  <span style={{ cursor: "pointer" }}>🛈</span>
                                </Tooltip>
                              </span>
                            }
                            name="TestValues"
                          >
                            <Input.TextArea
                              onChange={handleTestValuesChange}
                              disabled={isTestValuesDisabled}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            label="Select Normal Value"
                            name="NormalValForTestVal"
                          >
                            <Select disabled={isTestValuesDisabled}>
                              {testoptions.map((option, index) => (
                                <Select.Option key={index} value={option}>
                                  {option}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label="Lab UOM" name="LabUOM">
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Panel>
              </Collapse>
              <Collapse accordion style={{ marginTop: "0.5rem" }}>
                <Panel
                  header={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>Turn Around Time</span>
                      <Button
                        type="text"
                        icon={<PlusCircleOutlined />}
                        onClick={() => showTurnArountTimeModel(null)}
                      />
                    </div>
                  }
                  key="4"
                >
                  <Table
                    dataSource={turnAroundTime.filter((i) => i.ActiveFlag === true)}
                    columns={columnsTurnAroundTime}
                    pagination={false}
                    locale={{
                      emptyText: (
                        <span style={{ color: "" }}>No data available</span>
                      ),
                    }}
                    bordered
                  ></Table>
                  <TurnAroundTimeTableModal
                    options={serviceDropDown}
                    open={isTurnAroundTimeModalVisible}
                    handleClose={() => setIsTurnAroundTimeModalVisible(false)}
                    handleSubmit={handleTurnAroundTimeSubmit}
                    record={record}
                  />
                </Panel>
              </Collapse>
              <Collapse accordion style={{ marginTop: "0.5rem" }}>
                <Panel
                  header={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>Medical Codes</span>
                      <Button
                        type="text"
                        icon={<PlusCircleOutlined />}
                        onClick={() => showMedicalCodeModel(null)}
                      />
                    </div>
                  }
                  key="5"
                >
                  <Table
                    dataSource={medicalCode.filter((j) => j.ActiveFlag1 === true)}
                    columns={columnMedicalCode}
                    locale={{
                      emptyText: (
                        <span style={{ color: "" }}>No data available</span>
                      ),
                    }}
                    bordered
                    pagination={false}
                  ></Table>
                  <MedicalCodeModal
                    options={serviceDropDown}
                    open={isMedicalModalVisible}
                    handleClose={() => setIsMedicalModalVisible(false)}
                    handleSubmit={handleMedicalCodeSubmit}
                    record={record}
                  />
                </Panel>
              </Collapse>
              <Row gutter={32} style={{ marginTop: "1.5rem" }}>
                {" "}
                <Col offset={20} span={2}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Form.Item>
                    <Button onClick={() => { navigate("/Service"); }} type="default">Cancel</Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Spin>
        </div>
      </Layout>
    </>
  );
}

export default CreateService;
