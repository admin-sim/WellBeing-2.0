import {
  ArrowLeftOutlined,
  EditOutlined,
  LoadingOutlined,
  PlusCircleFilled,
  PlusCircleOutlined,
  PlusOutlined,
  PlusSquareFilled,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Row,
  Col,
  Typography,
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
  DatePicker,
  Spin,
} from "antd";
import { useForm } from "antd/es/form/Form";
import Title from "antd/es/typography/Title";
import TextArea from "antd/es/input/TextArea";
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
import PackageIndicationModal from "./PackageIndicationModal";
import dayjs from "dayjs";
import CustomTable from "../../../../components/customTable";
import { v4 as uuidv4 } from "uuid";
import { set } from "lodash";
import { render } from "react-dom";

const { Panel } = Collapse;
function CreateService() {
  const [form] = Form.useForm();
  const location = useLocation();
  const Serviceclassificationid = location.state.serviceclassificationid;
  const ServiceId = location.state.serviceid;
  const [uom, setUom] = useState([]);
  const [category, setCategory] = useState([]);
  const [servicegroupname, setServiceGroupName] = useState([]);
  const [serviceclassificationname, setServiceClassificationName] = useState(
    []
  );
  const [testresulttypes, setTestResultTypes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMedicalModalVisible, setIsMedicalModalVisible] = useState(false);
  const [isTurnAroundTimeModalVisible, setIsTurnAroundTimeModalVisible] =
    useState(false);
  const [ispackageModalVisible, setIsPackageModalVisible] = useState(false);
  const [orderAtributeDropdown, setOrderAtributeDropDown] = useState([]);
  const [ageGenderRestriction, setAgeGenderRestriction] = useState([]);
  const [turnAroundTime, setTurnAroundTime] = useState([]);
  const [packageInd, setPackageInd] = useState([]);
  const [medicalCode, setMedicalCode] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyCounterTAT, setKeyCounterTAT] = useState(0);
  const [keyCounterPAK, setKeyCounterPAK] = useState(0);
  const [keyCounterMED, setKeyCounterMED] = useState(0);
  const [serviceDropDown, setServiceDropDown] = useState({
    Genders: [],
    Uoms: [],
    MedicalCodeTypes: [],
    Indicators: [],
  });
  const [templateList, setTemplateList] = useState([]);
  const [templatedisable, setTemplateDisable] = useState(true);
  const [reultTypeDisable, setResultTypeDisable] = useState(false);
  const [isTestValuesDisabled, setIsTestValuesDisabled] = useState(true);
  const [isRadiologyChecked, setIsRadiologyChecked] = useState(false);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [testoptions, setTestOptions] = useState([]);
  const [packageLine, setPackageLine] = useState(null);
  const [ageLine, setAgeLine] = useState(null);
  const [tatLine, setTatLine] = useState(null);
  const [medicalLine, setMediaclLine] = useState(null);
  const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

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
    setLoading(true);
    if (ServiceId > 0) {
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
            IsAtomic: data.IsAtomic === "Y" ? true : false,
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
            // Pakages
            PackageToDate: dayjs(data.PackageToDateString, "DD-MM-YYYY"),
            PackageNumberEncounter: data.PackageNumberEncounter,
            PackageIsMultiEncounter:
              data.PackageIsMultiEncounter === "Y" ? true : false,
            PackageIsHealth: data.PackageIsHealth === "Y" ? true : false,
            PackageFromDate: dayjs(data.PackageFromDateString, "DD-MM-YYYY"),
            PackageDays: data.PackageDays,
            PackageAmount: data.PackageAmount,
            IsProviderRequired: data.IsProviderRequired,
            IsServiceEditable: data.IsServiceEditable,
            IsAssociateCharge: data.IsAssociateCharge,
            IsSurgeryCharge: data.IsSurgeryCharge,
          });
          const pa = response.data.data.ServicePackage.map((i) => {
            return {
              ...i,
              key: uuidv4(),
              Indicator: { id: i.IndicatorId, text: i.IndicatorName },
              UomName: i.ServiceUomName,
              IsExcluded: i.IsExcluded === "Y" ? "True" : "False",
              IsReplaceable: i.IsReplaceable === "Y" ? "True" : "False",
              AllowFund: i.AllowFund === "Y" ? "True" : "False",
            };
          });

          setPackageInd(pa);

          const age = response.data.data.ListServiceOrdering.map((i) => {
            return {
              ...i,
              key: uuidv4(),
            };
          });
          setAgeGenderRestriction(age);

          const tat = response.data.data.ListServiceTat.map((i) => {
            return {
              ...i,
              key: uuidv4(),
              TatUomShortName: i.TatUomName,
            };
          });
          setTurnAroundTime(tat);

          const med = response.data.data.ListServiceMedicalCode.map((i) => {
            return {
              ...i,
              key: uuidv4(),
            };
          });
          setMedicalCode(med);

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
          setLoading(false);
        } else {
          console.error("Failed to fetch patient details");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }
    setLoading(false)
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
    // If checked, set ResultType to the LookupDescription of the first option
    if (checked && testresulttypes.length > 0) {
      form.setFieldsValue({ ResultType: testresulttypes[2].LookupID });
    } else {
      // Optionally reset ResultType if unchecked
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
      // Optionally reset ResultType if unchecked
      form.setFieldsValue({ ResultType: undefined });
    }
  };

  const navigate = useNavigate();

  const handleTestValuesChange = (e) => {
    const value = e.target.value;
    // setTestValues(value);

    // Split the input by '|' and filter out empty values
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
    values.ServiceClassificationId = Serviceclassificationid;
    values.ServiceId = ServiceId ? ServiceId : 0;
    values.IsAtomic = values.IsAtomic ? "True" : "False";

    values.FromDate = values.PackageFromDate?.format("DD-MM-YYYY");
    values.ToDate = values.PackageToDate?.format("DD-MM-YYYY");

    values.PackageDays = values.PackageDays ?? values.PackageDays;
    values.PackageAmount = values.PackageAmount ? values.PackageAmount : 0;
    values.PackageNumberEncounter = values.PackageNumberEncounter
      ? values.PackageNumberEncounter
      : 0;

    values.PackageIsHealth = values.PackageIsHealth ? "True" : "False";
    values.PackageIsMultiEncounter = values.PackageIsMultiEncounter
      ? "True"
      : "False";
    values.IsFromTestValues = values.IsFromTestValues ? true : false;
    values.IsRadiology = values.IsRadiology ? true : false;
    values.IsSubTest = values.IsSubTest ? true : false;
    const pkg = packageInd.filter((item) => item.ServicePackageId);
    const newpkg = packageInd.filter(
      (item) => !item.ServicePackageId && item.ActiveFlag !== false
    );

    const age = ageGenderRestriction.filter(
      (item) => item.ServiceOrderAttributeId
    );
    const newage = ageGenderRestriction.filter(
      (item) => !item.ServiceOrderAttributeId && item.ActiveFlag !== false
    );

    const tat = turnAroundTime.filter((item) => item.TatId);
    const newtat = turnAroundTime.filter(
      (item) => !item.TatId && item.ActiveFlag !== false
    );

    const med = medicalCode.filter((item) => item.MedicalCodeId);
    const newmed = medicalCode.filter(
      (item) => !item.MedicalCodeId && item.ActiveFlag !== false
    );

    const Service = {
      AddNewService: values,
      ListServiceOrdering: age?.length > 0 ? age : null,
      ListServiceTat: tat?.length > 0 ? tat : null,
      ListServiceMedicalCode: med?.length > 0 ? med : null,
      NewGender: newage?.length > 0 ? newage : null,
      NewListServiceTat: newtat?.length > 0 ? newtat : null,
      NewMedicalCode: newmed?.length > 0 ? newmed : null,
      ServiceLabAttribute: null,
      NewServicePackage: pkg?.length > 0 ? pkg : null,
      ServicePackage: newpkg?.length > 0 ? newpkg : null,
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const showMedicalCodeModel = () => {
    setIsMedicalModalVisible(true);
  };

  const showTurnArountTimeModel = () => {
    setIsTurnAroundTimeModalVisible(true);
  };
  const showPackageModal = () => {
    setIsPackageModalVisible(true);
  };

  const handleSubmit = (values) => {
    // console.log(values);
    // const valuesArray = Array.isArray(values) ? values : [values];

    // const valuesWithKeys = valuesArray.map((value, index) => ({
    //   ...value,
    //   key: keyCounter + index,
    // }));

    // setKeyCounter(keyCounter + valuesArray.length);

    // setAgeGenderRestriction((prev) => [...prev, ...valuesWithKeys]);
    let pag;
    if (values.key === "0") {
      values.key = uuidv4();
      pag = [...ageGenderRestriction, { ...values }];
    } else {
      pag = ageGenderRestriction.map((item) =>
        item.key === values.key ? { ...item, ...values } : item
      );
    }
    setAgeGenderRestriction(pag);
  };

  const handleMedicalCodeSubmit = (values) => {
    // const valuesArray = Array.isArray(values) ? values : [values];

    // const valuesWithKeys = valuesArray.map((value, index) => ({
    //   ...value,
    //   key: keyCounterMED + index,
    // }));

    // setKeyCounterMED(keyCounterMED + valuesArray.length);

    // setMedicalCode((prev) => [...prev, ...valuesWithKeys]);
    let pag;
    if (values.key === "0") {
      values.key = uuidv4();
      pag = [...medicalCode, { ...values }];
    } else {
      pag = medicalCode.map((item) =>
        item.key === values.key ? { ...item, ...values } : item
      );
    }
    setMedicalCode(pag);
  };

  const handleTurnAroundTimeSubmit = (values) => {
    // const valuesArray = Array.isArray(values) ? values : [values];

    // const valuesWithKeys = valuesArray.map((value, index) => ({
    //   ...value,
    //   key: keyCounterTAT + index,
    // }));

    // setKeyCounterTAT(keyCounterTAT + valuesArray.length);

    // setTurnAroundTime((prev) => [...prev, ...valuesWithKeys]);
    let pag;
    if (values.key === "0") {
      values.key = uuidv4();
      pag = [...turnAroundTime, { ...values }];
    } else {
      pag = turnAroundTime.map((item) =>
        item.key === values.key ? { ...item, ...values } : item
      );
    }
    setTurnAroundTime(pag);
  };

  const handlePackageIndicatiotrSubmit = (values) => {
    let pag;
    if (values.key === "0") {
      values.key = uuidv4();
      pag = [...packageInd, { ...values }];
    } else {
      pag = packageInd.map((item) =>
        item.key === values.key ? { ...item, ...values } : item
      );
    }
    setPackageInd(pag);
  };

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
      dataIndex: "StartAgeUomName",
      key: "StartAgeUomName",
    },
    {
      title: "End Age",
      dataIndex: "EndAge",
      key: "EndAge",
    },
    {
      title: "Age Unit",
      dataIndex: "EndAgeUomName",
      key: "EndAgeUomName",
    },
  ];

  const columnsPackageInd = [
    {
      title: "Indicator",
      dataIndex: ["Indicator", "text"],
    },
    {
      width: 200,
      title: "Description",
      dataIndex: ["DescriptionName"],
    },
    {
      title: "Excluded",
      dataIndex: "IsExcluded",
      render: (text) => {
        return text === "True" || text === "Y" ? "Yes" : "No";
      },
    },
    {
      title: "Replaceable",
      dataIndex: "IsReplaceable",
      render: (text) => {
        return text === "True" || text === "Y" ? "Yes" : "No";
      },
    },
    {
      title: "Qty",
      dataIndex: "MaxQty",
    },
    {
      title: "UOM",
      dataIndex: ["UomName"],
    },
    {
      title: "Amount",
      dataIndex: "MaxAmount",
    },
    {
      title: "Preference",
      dataIndex: "Preference",
      render: (text) => {
        return text === "Q" ? "Quantity" : "Amount";
      },
    },
    {
      title: "Package Price",
      dataIndex: "PkgPrice",
    },
    {
      title: "Allowed Refund",
      dataIndex: "AllowFund",
      render: (text) => {
        return text === "True" || text === "Y" ? "Yes" : "No";
      },
    },
    {
      title: "Refund Amt",
      dataIndex: "MaximunRefundAmount",
    },
    // {
    //   title: "Action",
    //   dataIndex: "Action",
    //   delete: "delete",
    //   render: (text, record) => (
    //     <Button
    //       type="link"
    //       onClick={() => {
    //         setPackageInd((prev) =>
    //           prev.filter((item) => item.key !== record.key)
    //         );
    //       }}
    //     >
    //       Delete
    //     </Button>
    //   ),
    // },
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
      render: (text) => (text ? "Active" : "Hidden"),
    },
    // {
    //   title: "Action",
    //   dataIndex: "Action",
    //   key: "Action",
    // },
  ];

  const handleEdit1 = (record, type) => {
    if (type === "M") {
      setMediaclLine(record);
      setIsMedicalModalVisible(true);
    } else if (type === "T") {
      setTatLine(record);
      setIsTurnAroundTimeModalVisible(true);
    } else if (type === "O") {
      setAgeLine(record);
      setIsModalVisible(true);
    }
  };

  const handleDelete1 = (record, type) => {
    let temp = ageGenderRestriction;

    if (type === "O") temp = ageGenderRestriction;
    if (type === "M") temp = medicalCode;
    if (type === "T") temp = turnAroundTime;

    const newpkg = temp.map((item) => {
      if (item.key === record.key) {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });

    if (type === "O") setAgeGenderRestriction(newpkg);
    if (type === "M") setMedicalCode(newpkg);
    if (type === "T") setTurnAroundTime(newpkg);
  };

  const handleEdit = (record) => {
    setPackageLine(record);
    setIsPackageModalVisible(true);
  };

  const handleDelete = (record) => {
    const newpkg = packageInd.map((item) => {
      if (item.key === record.key) {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });
    setPackageInd(newpkg);
  };

  return (
    <Spin spinning={loading} indicator={antIcon}>
      <Layout>
        <div
          style={{
            width: "100%",
            backgroundColor: "white",
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
                Create Service Definition Manager
              </Title>
            </Col>
            <Col offset={5} span={3}>
              <Button
                className="dfja"
                icon={<ArrowLeftOutlined style={{ fontSize: "1.1rem" }} />}
                onClick={() => navigate("/Service")}
              >
                Back to list
              </Button>
            </Col>
          </Row>
          <Form
            style={{ margin: "0.5rem 1rem" }}
            layout="vertical"
            form={form}
            onFinish={onFinish}
            initialValues={{
              IsAtomic: true,
              IsOrderable: true,
              EmergencyPatient: true,
              InPatient: true,
              AmbulatoryPatient: true,
              ShortStayPatient: true,
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
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Please select category",
                  //   },
                  // ]}
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
                <Form.Item
                  name="IsAtomic"
                  label="Is Automic"
                  valuePropName="checked"
                >
                  <Checkbox />
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
                  initialValue="true" // Add this line
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
                  label="Is Provider Required"
                  valuePropName="checked"
                >
                  <Checkbox />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="IsServiceEditable"
                  label="Is Service Editable"
                  valuePropName="checked"
                >
                  <Checkbox />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="IsAssociateCharge"
                  label="Is Associate Charge"
                  valuePropName="checked"
                >
                  <Checkbox />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="IsSurgeryCharge"
                  label="Is Surgery Charge"
                  valuePropName="checked"
                >
                  <Checkbox />
                </Form.Item>
              </Col>
            </Row>
            {servicegroupname.includes("Package Services") && (
              <Collapse
                accordion
                defaultActiveKey={["6"]}
                style={{ marginTop: "0.5rem" }}
              >
                <Panel
                  header={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>Package</span>
                      <Button
                        type="text"
                        icon={<PlusCircleOutlined />}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent closing the panel
                          showPackageModal();
                        }}
                      />
                    </div>
                  }
                  key="6"
                >
                  <Row gutter={16}>
                    <Col span={24}>
                      <Row gutter={16}>
                        <Col span={4}>
                          <Form.Item
                            label={
                              <span>
                                Pkg Days
                                <Tooltip title="PKG Days">
                                  <span style={{ cursor: "pointer" }}>🛈</span>
                                </Tooltip>
                              </span>
                            }
                            name="PackageDays"
                            rules={[
                              {
                                required: true,
                                message: "Required",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            label={
                              <span>
                                Pkg Amount
                                <Tooltip title=" PKG Amount">
                                  <span style={{ cursor: "pointer" }}>🛈</span>
                                </Tooltip>
                              </span>
                            }
                            name="PackageAmount"
                            rules={[
                              {
                                required: true,
                                message: "Required",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            label="EffectiveFrom"
                            rules={[
                              {
                                required: true,
                                message: "Required",
                              },
                            ]}
                            name="PackageFromDate"
                          >
                            <DatePicker
                              style={{ width: "100%" }}
                              // onChange={handleEfeectiveFrom}
                              format="DD-MM-YYYY"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            label="EffectiveTo"
                            rules={[
                              {
                                required: true,
                                message: "Required",
                              },
                            ]}
                            name="PackageToDate"
                          >
                            <DatePicker
                              style={{ width: "100%" }}
                              // onChange={handleEfeectiveTo}
                              format="DD-MM-YYYY"
                            />
                          </Form.Item>
                        </Col>

                        <Col span={3}>
                          <Form.Item
                            label="Health Check"
                            name="PackageIsHealth"
                            valuePropName="checked"
                          >
                            <Checkbox onChange={handleCheckboxChange} />
                          </Form.Item>
                        </Col>

                        <Col span={3}>
                          <Form.Item
                            label="Multi Encounter"
                            name="PackageIsMultiEncounter"
                            valuePropName="checked"
                          >
                            <Checkbox onChange={handleCheckboxChange} />
                          </Form.Item>
                        </Col>
                        <Col span={2}>
                          <Form.Item
                            label={<span>No Of Encs</span>}
                            name="PackageNumberEncounter"
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  {/* <Table
                    // style={{ padding: '0rem 2rem' }}
                    dataSource={packageInd}
                    columns={columnsPackageInd}
                    pagination={false}
                    //rowKey={(row) => row.ChargeID} // Specify the custom id property here
                    locale={{
                      emptyText: (
                        <span style={{ color: "" }}>No data available</span>
                      ),
                    }}
                    bordered
                  ></Table> */}
                  <CustomTable
                    dataSource={packageInd.filter(
                      (item) => item.ActiveFlag !== false
                    )}
                    columns={columnsPackageInd}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                  <PackageIndicationModal
                    options={serviceDropDown}
                    open={ispackageModalVisible}
                    handleClose={() => (
                      setIsPackageModalVisible(false), setPackageLine(null)
                    )}
                    handleSubmit={handlePackageIndicatiotrSubmit}
                    packageLine={packageLine}
                  />
                </Panel>
              </Collapse>
            )}
            <Collapse accordion style={{ marginTop: "0.5rem" }}>
              <Panel header="Lab Details" key="1">
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
                            disabled={templatedisable} // Disable if no options
                          >
                            {filteredTemplates.map((option) => (
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
                          <Input />
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
              <Panel header="Ordering Attribute" key="2">
                <Row gutter={16}>
                  <Col span={5}>
                    <Form.Item
                      label="Is Orderable"
                      name="IsOrderable"
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
                  <Divider orientation="left"> Applicable Patient Type</Divider>
                  <Col span={5}>
                    <Form.Item
                      label="Emergency Patient"
                      name="EmergencyPatient"
                      valuePropName="checked"
                    >
                      <Checkbox>Emergency Patient</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item
                      label="In Patient"
                      name="InPatient"
                      valuePropName="checked"
                    >
                      <Checkbox>In Patient </Checkbox>
                    </Form.Item>
                  </Col>

                  <Col span={5}>
                    <Form.Item
                      label="Ambulatory Patient"
                      name="AmbulatoryPatient"
                      valuePropName="checked"
                    >
                      <Checkbox>Ambulatory Patient </Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item
                      label="Short Stay Patient"
                      name="ShortStayPatient"
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
                      onClick={showModal}
                    />
                  </Divider>
                  <OrderingAttributeModal
                    options={serviceDropDown}
                    open={isModalVisible}
                    handleClose={() => (
                      setIsModalVisible(false), setAgeLine(null)
                    )}
                    handleSubmit={handleSubmit}
                    record={ageLine}
                    // discountDetails={discountDetails}
                    // setCharges={setCharges}
                  />
                </Row>
                {/* <Table
                  // style={{ padding: '0rem 2rem' }}
                  dataSource={ageGenderRestriction}
                  columns={columns}
                  pagination={false}
                  //rowKey={(row) => row.ChargeID} // Specify the custom id property here
                  locale={{
                    emptyText: (
                      <span style={{ color: "" }}>No data available</span>
                    ),
                  }}
                  bordered
                ></Table> */}
                <CustomTable
                  columns={columns}
                  dataSource={(ageGenderRestriction || {}).filter(
                    (item) => item.ActiveFlag !== false
                  )}
                  onDelete={(e) => handleDelete1(e, "O")}
                  onEdit={(e) => handleEdit1(e, "O")}
                />
              </Panel>
            </Collapse>

            <Collapse accordion style={{ marginTop: "0.5rem" }}>
              <Panel header="Execution Attributes" key="3">
                <Row gutter={16}>
                  <Col span={5}>
                    <Form.Item
                      label="Schedule Applicable"
                      name="Schedule Applicable"
                      valuePropName="checked"
                    >
                      <Checkbox> Result Applicable </Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item label="Result Template" name="Result Template">
                      <input type="text" disabled />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item
                      label="Anesthetist Required"
                      name="Anesthetist Required"
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
                    <Form.Item label="Min." name="Min">
                      <Input style={{ width: "100%" }} disabled />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item label="Standard" name="Standard">
                      <Input style={{ width: "100%" }} disabled />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item label="Max." name="Max.">
                      <Input style={{ width: "100%" }} disabled />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item label="Uom" name="UomEx">
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
                      onClick={showTurnArountTimeModel}
                    />
                  </div>
                }
                key="4"
              >
                {/* <Table
                  // style={{ padding: '0rem 2rem' }}
                  dataSource={turnAroundTime}
                  columns={columnsTurnAroundTime}
                  pagination={false}
                  //rowKey={(row) => row.ChargeID} // Specify the custom id property here
                  locale={{
                    emptyText: (
                      <span style={{ color: "" }}>No data available</span>
                    ),
                  }}
                  bordered
                ></Table> */}
                <CustomTable
                  columns={columnsTurnAroundTime}
                  dataSource={(turnAroundTime || {}).filter(
                    (item) => item.ActiveFlag !== false
                  )}
                  onEdit={(e) => handleEdit1(e, "T")}
                  onDelete={(e) => handleDelete1(e, "T")}
                />
                <TurnAroundTimeTableModal
                  options={serviceDropDown}
                  open={isTurnAroundTimeModalVisible}
                  handleClose={() => (
                    setIsTurnAroundTimeModalVisible(false), setTatLine(null)
                  )}
                  handleSubmit={handleTurnAroundTimeSubmit}
                  record={tatLine}
                  // discountDetails={discountDetails}
                  // setCharges={setCharges}
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
                      onClick={showMedicalCodeModel}
                    />
                  </div>
                }
                key="5"
              >
                {/* <Table
                  // style={{ padding: '0rem 2rem' }}
                  dataSource={medicalCode}
                  columns={columnMedicalCode}
                  //rowKey={(row) => row.ChargeID} // Specify the custom id property here
                  locale={{
                    emptyText: (
                      <span style={{ color: "" }}>No data available</span>
                    ),
                  }}
                  bordered
                  pagination={false}
                ></Table> */}
                <CustomTable
                  columns={columnMedicalCode}
                  dataSource={(medicalCode || {}).filter(
                    (item) => item.ActiveFlag !== false
                  )}
                  onEdit={(e) => handleEdit1(e, "M")}
                  onDelete={(e) => handleDelete1(e, "M")}
                />
                <MedicalCodeModal
                  options={serviceDropDown}
                  open={isMedicalModalVisible}
                  handleClose={() => (
                    setIsMedicalModalVisible(false), setMediaclLine(null)
                  )}
                  handleSubmit={handleMedicalCodeSubmit}
                  record={medicalLine}
                  // discountDetails={discountDetails}
                  // setCharges={setCharges}
                />
              </Panel>
            </Collapse>
            <Row gutter={32} style={{ marginTop: "1.5rem" }}>
              {" "}
              <Col offset={20} span={2}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    {ServiceId > 0 ? "Update" : "Save"}
                  </Button>
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item>
                  <Button type="default" onClick={() => navigate("/Service")}>
                    Cancel
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Layout>
    </Spin>
  );
}

export default CreateService;
