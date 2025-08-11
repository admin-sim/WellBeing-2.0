import React, { useEffect, useState } from "react";
import Button from "antd/es/button";
import {
  urlCreatePurchaseOrder,
  urlSearchUHID,
  urlGetLastEncounter,
  urlAutocompleteProduct,
  urlUpdatePatientIndent,
  urlEditPatientIndent,
  urlGetProductDetailsById,
  urlAddNewPatientIndent,
  urlGetDrNotes,
  urlCreatePatientIndent,
} from "../../../../endpoints.js";
import Select from "antd/es/select";
import {
  ConfigProvider,
  Card,
  Typography,
  Checkbox,
  Tooltip,
  Modal,
  Skeleton,
  Popconfirm,
  Spin,
  Col,
  Divider,
  Row,
  AutoComplete,
  message,
} from "antd";
import Input from "antd/es/input";
import Form from "antd/es/form";
import { DatePicker } from "antd";
import Layout from "antd/es/layout/layout";
import { LeftOutlined } from "@ant-design/icons";
//import Typography from 'antd/es/typography';
import { useNavigate } from "react-router";
import { Table, InputNumber } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import customAxios from "../../../components/customAxios/customAxios.jsx";
import PageHeader from "../../../components/PageHeader/index.jsx";
import UhidSelectComponent from "../../../components/UhidSelectComponent/index.jsx";
import CustomTable from "../../../components/customTable/index.jsx";
import { ColWithEightSpan } from "../../../components/customGridColumns/index.jsx";
import CkEditor from "../../../components/CKEditor/index.jsx";

const CreatePatientIndent = () => {
  const [DropDown, setDropDown] = useState({
    IssueingStoreDetails: [],
    RequestingStoreDetails: [],
    PatientIdentificationType: [],
    UOM: [],
    Gender: [],
    DateFormat: [],
  });

  let [counter, setCounter] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  const indentId = location.state.IndentId;
  const Patient = location.state.bed;
  const [dropDownLoad, setDropDownLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [openCKModel, setOpenCKModel] = useState(false);
  const [templateEditorData, setTemplateEditorData] = useState("");

  const initialDataSource =
    indentId === 0
      ? [
          {
            key: uuidv4(),
            ProductName: "",
            ProductId: "",
            UomId: "",
            RequestQty: "",
            RequestingStoreStock: "",
            IssuingStoreStock: "",
            Favourite: false,
            ActiveFlag: true,
          },
        ]
      : [];

  const [encounter, setEncounter] = useState([]);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();
  const { Title } = Typography;
  const { TextArea } = Input;
  const { Option } = Select;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState(initialDataSource);
  const [dataModal, setDataModal] = useState([]);
  const [poloading, setPoloading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [autoCompleteProduct, setAutoCompleteProduct] = useState([]);
  const fields = form1.getFieldsValue();
  const [buttonTitle, setButtonTitle] = useState("Save");
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [indentStatus, setIndentStatus] = useState(false);
  const [isProductAvailable, setIsProductAvailable] = useState(false);
  const [uhid, setUhid] = useState();
  const [key, setKey] = useState(null);
  const [customKey, setCustomKey] = useState(filteredData?.length + 1000);

  useEffect(() => {
    customAxios
      .get(urlCreatePatientIndent, {
        params: { EncounterId: 0, LocationId: 0 },
      })
      .then((response) => {
        const apiData = response.data.data;
        setDropDown(apiData);
      });
    setDropDownLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (indentId > 0) {
      setLoading(true);
      setButtonTitle("Update");
      customAxios
        .get(`${urlEditPatientIndent}?IndentId=${indentId}`)
        .then((response) => {
          const apiData = response.data.data;
          setEncounter(
            response.data.data.EncounterList.filter(
              (item) => item.EncounterId === apiData.newIndentModel.EncounterId
            )
          );
          const products = apiData.IndentDetails.map((item, index) => ({
            ...item,
            key: index,
            IssuingStoreStock: apiData.IndentDetails[index].AvlIssueQuantity,
            RequestingStoreStock: apiData.IndentDetails[index].AvlReqQuantity,
            Favourite:
              apiData.IndentDetails[index].Favourite == "N" ? false : true,
            RequestQty: item.RequestQty == 0 ? "" : item.RequestQty,
            index: uuidv4(),
          }));
          setData(products);
          setCounter(products.length);
          setIsTableVisible(true);
          const formdata = apiData.newIndentModel;
          setUhid(formdata.UhId);
          form1.setFieldsValue({
            IssuingStore: formdata.IssueingStoreId,
            IndentType: formdata.IndentType,
            Remarks: formdata.Remarks,
            IndentTemplate:
              formdata.IndentTemplateId == 0
                ? undefined
                : formdata.IndentTemplateId,
            IndentStatus:
              formdata.IndentStatus == "Created"
                ? undefined
                : formdata.IndentStatus,
            UHID: formdata.UhId,
            Name: formdata.PatientName,
            Encounter: formdata.EncounterId,
            EncounterId: formdata.EncounterId,
            PatientId: formdata.PatientId,
            IndentId: formdata.IndentId,
          });
        });
      setLoading(false);
    } else if (Patient) {
      setUhid(Patient.UhId);
      GetEncounter(Patient.PatientId);
      form1.setFieldsValue({
        UHID: Patient.UhId,
        Name: Patient.PatientName,
        Encounter: Patient.EncounterId,
        EncounterId: Patient.EncounterId,
        PatientId: Patient.PatientId,
      });
    }
  };

  const onOkModal = () => {
    form2
      .validateFields()
      .then(() => {
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.log("Validation error:", error);
      });
  };

  const onFinishmodal = (values) => {
    setPoloading(true);
    setIsPoSearchTable(true);
    const postData = {
      Supplier: values.Supplier,
      ReceivingStore: values.ReceivingStore,
      POStatus: values.POStatus,
      FromDate:
        values.PODateFrom === undefined || values.PODateFrom === null
          ? ""
          : (
              values.PODateFrom.$D.toString().padStart(2, "0") +
              "-" +
              (values.PODateFrom.$M + 1).toString().padStart(2, "0") +
              "-" +
              values.PODateFrom.$y
            ).toString(),
      ToDate:
        values.PODateTo === undefined || values.PODateTo === null
          ? ""
          : (
              values.PODateTo.$D.toString().padStart(2, "0") +
              "-" +
              (values.PODateTo.$M + 1).toString().padStart(2, "0") +
              "-" +
              values.PODateTo.$y
            ).toString(), // A sample value
    };
    // try {
    //   customAxios.get(`${urlSearchPendingPO}?Supplier=${postData.Supplier}&ReceivingStore=${postData.ReceivingStore}&POStatus=${postData.POStatus}&PODateFrom=${postData.FromDate}&PODateTo=${postData.ToDate}`).then((response) => {
    //     debugger;
    //     const apiData = response.data.data;
    //     setDataModal(apiData.PurchaseOrderDetails);
    //     setPoloading(false);
    //   });
    // } catch (error) {
    //   // Handle the error as needed
    // }
  };

  const handleCancel1 = () => {
    setCustomKey(customKey + 1);
    setTemplateEditorData("");
    form.resetFields();
    setOpenCKModel(false);
    setButtonTitle("Save");
    setReadOnly(false);
  };

  const AddProduct = async () => {
    setAutoCompleteProduct([]);
    const fieldsToValidate = data.map((record) => [record.key, "ProductName"]);
    await form2.validateFields(fieldsToValidate);
    setData([
      ...data,
      {
        key: uuidv4(),
        ProductName: "",
        ProductId: "",
        UomId: "",
        RequestQty: "",
        RequestingStoreStock: "",
        IssuingStoreStock: "",
        Favourite: false,
        ActiveFlag: true,
      },
    ]);
    // setCounter(counter + 1);
    setIsProductAvailable(false);
  };

  const getPanelValue1 = (value, key) => {
    if (value === "") {
      form2.setFieldsValue({ [key]: { uom: "" } });
      form2.setFieldsValue({ [key]: { RequestQty: "" } });
      form2.setFieldsValue({ [key]: { Favourite: false } });
      form2.setFieldsValue({ [key]: { IssuingStoreStock: "" } });
    }
    try {
      customAxios
        .get(`${urlAutocompleteProduct}?Product=${value}`)
        .then((response) => {
          const apiData = response.data.data;
          const filteredApiData = apiData.filter(
            (apiItem) =>
              !data.some(
                (option) =>
                  option.ProductId === apiItem.ProductId && option.ActiveFlag
              )
          );
          const newOptions = filteredApiData.map((item) => ({
            value: item.LongName,
            key: item.ProductId,
            UomId: item.UOMPrimaryUOM,
          }));
          setAutoCompleteProduct(newOptions);
        });
    } catch (error) {
      // Handle the error as needed
    }
  };

  const handleSelect1 = (value, option, key) => {
    form2.setFieldsValue({ [key]: { UomId: option.UomId } });
    form2.setFieldsValue({ [key]: { ProductId: option.key } });
    customAxios
      .get(`${urlGetProductDetailsById}?ProductId=${option.key}`)
      .then((response) => {
        const apiData = response.data.data;
        let reqstr = form1.getFieldValue("IssuingStore");
        let qty = 0;
        apiData.Stock.forEach((value) => {
          if (value.StoreId === reqstr) {
            qty += value.Quantity;
          }
        });
        const newData = data.map((item) => {
          if (item.key === key) {
            const updatedItem = {
              ...item,
              // [column]: option.key,
              // LongName: option.value,
              UomId: option.UomId,
              ProductId: option.key,
              // PoRate: apiData.PORate !== null ? apiData.PORate.PoRate : 0,
            };
            return updatedItem;
          }
          return item;
        });
        setData(newData);
        form2.setFieldsValue({ [key]: { IssuingStoreStock: qty } });
      });
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "ProductName",
      key: "ProductName",
      width: 450,
      render: (_, record) => (
        <>
          <Form.Item
            name={[record.key, "ProductName"]}
            style={{ width: "100%" }}
            rules={[
              {
                required: true,
                message: "Please input!",
              },
            ]}
            initialValue={record.ProductName}
          >
            <AutoComplete
              style={{ width: "100%" }}
              disabled={!!indentId && record.IndentLineId}
              options={autoCompleteProduct}
              onSearch={(value) => getPanelValue1(value, record.key)}
              onSelect={(value, option) =>
                handleSelect1(value, option, record.key)
              }
              placeholder="Search for a product"
              allowClear
            />
          </Form.Item>
          <Form.Item
            name={[record.key, "ProductId"]}
            hidden
            initialValue={record.ProductId}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            name={[record.key, "IndentLineId"]}
            hidden
            initialValue={record.IndentLineId}
          >
            <Input></Input>
          </Form.Item>
        </>
      ),
    },
    {
      title: "UOM",
      dataIndex: "UomId",
      key: "UomId",
      width: 150,
      render: (text, record) => (
        <Form.Item
          name={[record.key, "UomId"]}
          style={{ width: "100%" }}
          initialValue={record.UomId}
        >
          <Select disabled defaultValue={record.UomId}>
            {DropDown.UOM.map((option) => (
              <Select.Option key={option.UomId} value={option.UomId}>
                {option.FullName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "Requesting Qty",
      dataIndex: "RequestQty",
      key: "RequestQty",
      render: (text, record) => (
        <Form.Item
          style={{ width: "100%" }}
          initialValue={record.RequestQty}
          name={[record.key, "RequestQty"]}
          rules={[
            {
              required: true,
              message: "Please input!",
            },
            {
              validator: (_, value) => {
                if (
                  value > form2.getFieldValue([record.key, "IssuingStoreStock"])
                ) {
                  return Promise.reject(
                    new Error("Not Greater Than Issue Stock")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
      ),
    },
    indentId > 0
      ? {
          title: "RequestingStoreStock",
          dataIndex: "RequestingStoreStock",
          key: "RequestingStoreStock",
          render: (text, record) => (
            <Form.Item
              name={[record.key, "RequestingStoreStock"]}
              initialValue={record.RequestingStoreStock}
            >
              <Input disabled />
            </Form.Item>
          ),
        }
      : {},
    {
      title: "Issuing Store Stock",
      dataIndex: "IssuingStoreStock",
      key: "IssuingStoreStock",
      render: (text, record) => (
        <Form.Item
          name={[record.key, "IssuingStoreStock"]}
          initialValue={record.IssuingStoreStock}
          rules={[
            {
              required: true,
              type: "number",
              min: 1,
              message: "value must greater than 0!",
            },
          ]}
        >
          <InputNumber disabled style={{ width: "100%" }} />
        </Form.Item>
      ),
    },
    {
      title: "Fav",
      dataIndex: "Favourite",
      key: "Favourite",
      render: (text, record) => (
        <>
          <Form.Item
            name={[record.key, "Favourite"]}
            initialValue={record.Favourite}
            valuePropName="checked"
          >
            <Checkbox onChange={() => FavouriteChanged(record)}></Checkbox>
          </Form.Item>
        </>
      ),
    },
    {
      title: (
        <Tooltip title="Please Add Product!" open={isProductAvailable}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={AddProduct}
          ></Button>
        </Tooltip>
      ),
      // title: <Button type="primary" icon={<PlusOutlined />} onClick={AddProduct}></Button>,
      dataIndex: "add",
      key: "add",
      width: 50,
      render: (text, record) => (
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => handleDelete(record)}
        >
          <DeleteOutlined />
        </Popconfirm>
      ),
    },
  ];

  const handleDelete = (record) => {
    const newData = data.map((item) => {
      if (item.key === record.key) {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });
    setData(newData);
  };

  const Modelcolumns = [
    {
      title: "Date",
      dataIndex: "datestring",
      key: "datestring",
      sorter: (a, b) => a.datestring.localeCompare(b.datestring),
    },
    {
      title: "Time",
      dataIndex: "Time",
      key: "Time",
      sorter: (a, b) => a.Time.localeCompare(b.Time),
    },
    // {
    //     title: 'View',
    //     dataIndex: 'view',
    //     key: 'view',
    //     sorter: (a, b) => a.view.localeCompare(b.view),
    // }
  ];

  const onCancelmodal = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    const url = "/PatientIndent";
    navigate(url);
  };

  function handleView(params) {
    debugger;
    setTemplateEditorData(params.DrNote);
    setOpenCKModel(true);
  }

  async function ShowModel() {
    const form1data = form1.getFieldsValue();
    await form1.validateFields(["UHID", "PatientId", "EncounterId"]);
    customAxios
      .get(
        `${urlGetDrNotes}?EncounterId=${form1data.EncounterId}&PatientId=${form1data.PatientId}`
      )
      .then((response) => {
        const apiData = response.data.data.DrNotesList;
        setDataModal(apiData);
        setIsModalOpen(true);
      });
  }

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleOnFinish = async (values) => {
    setLoading(true);
    await form2.validateFields();
    const products = [];
    if (data.length == 0) {
      setIsProductAvailable(true);
      return false;
    } else {
      const temp = data.filter((item) => item.ActiveFlag == true);
      if (temp.length == 0) {
        setIsProductAvailable(true);
        return false;
      }
    }
    const formData = form2.getFieldsValue();

    const mergedData = data.map((item) => {
      const matchingFormItem = formData[item.key];
      if (matchingFormItem) {
        return { ...item, ...matchingFormItem };
      }
      return item;
    });

    setData(mergedData);
    for (let i = 0; i < mergedData.length; i++) {
      if (mergedData[i].ProductId != "") {
        mergedData[i].RequestQty =
          mergedData[i].RequestQty == "" ? 0 : mergedData[i].RequestQty;
        mergedData[i].Favourite = mergedData[i].Favourite == false ? "N" : "Y";
        mergedData[i].IndentLineId = mergedData[i].IndentLineId
          ? mergedData[i].IndentLineId
          : 0;
        products.push(mergedData[i]);
      }
    }

    const Indent = {
      IndentId: values.IndentId ? values.IndentId : 0,
      IndentDatestring: values.IndentDate
        ? values.IndentDate.format("DD-MM-YYYY")
        : "",
      IndentStatus: !indentStatus ? "Created" : values.IndentStatus,
      IndentTemplateId: values.IndentTemplate ? values.IndentTemplate : 0,
      IndentType: values.IndentType,
      IssueingStoreId: values.IssuingStore,
      Name: values.Name,
      Remarks: values.Remarks,
      UHID: values.UHID === undefined ? 0 : values.UHID,
      SubmitCheck: values.SubmitCheck,
      PatientId: values.PatientId,
      EncounterId: values.Encounter,
      IndentCategory: "PatientIndent",
      RequestingStoreId: 0,
    };
    const postData = {
      newIndentModel: Indent,
      IndentDetails: products,
    };
    if (indentId > 0) {
      const response = await customAxios.post(
        urlUpdatePatientIndent,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      handleCancel();
    } else {
      const response = await customAxios.post(
        urlAddNewPatientIndent,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      handleCancel();
    }
  };

  const FavouriteChanged = (record) => {
    record.Favourite = !record.Favourite;
  };

  const SubmitChanged = (event) => {
    setIndentStatus(event.target.checked);
  };

  const handleStoreChange = (value) => {
    setData(initialDataSource);
    setAutoCompleteProduct([]);
    form2.resetFields();
    setIsTableVisible(true);
  };

  async function GetEncounter(value) {
    await customAxios
      .get(`${urlGetLastEncounter}?patientId=${value}`)
      .then((response) => {
        const apiData = response.data;
        if (apiData.length > 0) {
          setEncounter(apiData);
          form1.setFieldsValue({ Encounter: apiData[0].EncounterId });
          form1.setFieldsValue({ EncounterId: apiData[0].EncounterId });
          // form1.setFieldsValue({ PatientId: option.data.PatientId });
        }
      });
  }

  function handleSelect2(value, option) {
    if (value) {
      form1.setFieldsValue({
        Name: option.data.PatientFirstName + " " + option.data.PatientLastName,
      });
      form1.setFieldsValue({ UHID: value });
      customAxios
        .get(`${urlGetLastEncounter}?patientId=${option.data.PatientId}`)
        .then((response) => {
          const apiData = response.data;
          if (apiData.length > 0) {
            setEncounter(apiData);
            form1.setFieldsValue({ Encounter: apiData[0].EncounterId });
            form1.setFieldsValue({ EncounterId: apiData[0].EncounterId });
            form1.setFieldsValue({ PatientId: option.data.PatientId });
          } else {
            setEncounter([]);
            form1.setFieldsValue({ EncounterId: "" });
            form1.setFieldsValue({ Encounter: "" });
            form1.setFieldsValue({ PatientId: "" });
          }
        });
    } else {
      setEncounter([]);
      form1.setFieldsValue({ EncounterId: "" });
      form1.setFieldsValue({ Encounter: "" });
      form1.setFieldsValue({ PatientId: "" });
      form1.setFieldsValue({ Name: "" });
    }
  }

  return (
    <Layout style={{ zIndex: "999999999" }}>
      <div
        style={{
          width: "100%",
          backgroundColor: "white",
          minHeight: "max-content",
          borderRadius: "10px",
        }}
      >
        <PageHeader
          title={"Create Patient Indent"}
          buttonLabel="Back"
          buttonIcon={<LeftOutlined />}
          onButtonClick={handleCancel}
        />
        <Card>
          <Form
            layout="vertical"
            onFinish={handleOnFinish}
            variant="outlined"
            style={{
              maxWidth: 1500,
            }}
            name="trigger"
            form={form1}
            initialValues={{
              IndentDate: dayjs(),
              SubmitCheck: false,
            }}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} align="Bottom">
              <Col className="gutter-row" span={6}>
                <Form.Item
                  label="Indent Date"
                  name="IndentDate"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD-MM-YYYY"
                    disabledDate={(current) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return current && current < today;
                    }}
                  />
                </Form.Item>
                <Form.Item name="IndentId" hidden>
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  label="Issuing Store"
                  name="IssuingStore"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Select
                    loading={dropDownLoad}
                    placeholder="Select Value"
                    onChange={handleStoreChange}
                    disabled={!!indentId}
                  >
                    {DropDown.IssueingStoreDetails.map((option) => (
                      <Select.Option
                        key={option.StoreId}
                        value={option.StoreId}
                      >
                        {option.LongName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  label="Indent Type"
                  name="IndentType"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Select placeholder="Select Value" allowClear>
                    <Select.Option
                      key="Effective"
                      value="Effective"
                    ></Select.Option>
                    <Select.Option
                      key="Consumption Based"
                      value="Consumption Based"
                    ></Select.Option>
                    <Select.Option key="Urgent" value="Urgent"></Select.Option>
                    <Select.Option
                      key="Reorder level Based"
                      value="Reorder level Based"
                    ></Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <div>
                  <Form.Item label="Remarks" name="Remarks">
                    <TextArea autoSize allowClear />
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item label="Indent Template" name="IndentTemplate">
                  <Select allowClear placeholder="Select Value"></Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  label="Indent Status"
                  name="IndentStatus"
                  rules={[
                    {
                      required: indentStatus,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Select allowClear placeholder="Select Value">
                    <Option value="Draft">Draft</Option>
                    <Option value="Pending">Finalize</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={7}>
                <Form.Item
                  name="SubmitCheck"
                  style={{ marginTop: "30px" }}
                  valuePropName="checked"
                >
                  <Checkbox onChange={SubmitChanged}>Submit</Checkbox>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  label="UHID"
                  name="UHID"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <UhidSelectComponent
                    selectedUhId={uhid}
                    handleSelectUHID={handleSelect2}
                  />
                  <Button type="link" onClick={ShowModel}>
                    Dr Note
                  </Button>
                </Form.Item>
                <Form.Item name="PatientId" hidden>
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  label="Name"
                  name="Name"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} disabled></Input>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  label="Encounter"
                  name="Encounter"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Select disabled={encounter.length > 1 ? false : true}>
                    {encounter.map((option) => (
                      <Select.Option
                        key={option.EncounterId}
                        value={option.EncounterId}
                      >
                        {option.GeneratedEncounterId}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="EncounterId" hidden>
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end" style={{ padding: "0rem 1rem" }}>
              <Col style={{ marginRight: "10px" }}>
                <Form.Item>
                  <Button type="primary" htmlType="submit" disabled={loading}>
                    {buttonTitle}
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button type="primary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Form.Item>
              </Col>
            </Row>
            <Divider style={{ marginTop: "0" }}></Divider>
          </Form>
          <Form
            // onFinish={handleOnFinish}
            variant="outlined"
            style={{
              maxWidth: 1500,
            }}
            form={form2}
          >
            <Spin spinning={loading}>
              {isTableVisible ? (
                <div>
                  <Table
                    columns={columns}
                    dataSource={data.filter(
                      (item) => item.ActiveFlag !== false
                    )}
                    scroll={{ x: 0 }}
                  />
                  {/* <Spin spinning={loading}>
                                    {/* <CustomTable
                                        dataSource={data.filter((item) => item.ActiveFlag !== false)}
                                        columns={columns}
                                        isFilter={false}
                                        // actionColumn={false}
                                        actionColumnName={<Button
                                            type="primary"
                                            icon={<PlusOutlined />}
                                            onClick={AddProduct}
                                        ></Button>}
                                        onDelete={handleDelete}
                                        bordered
                                    /> */}
                  {/* </Spin> */}
                </div>
              ) : null}
            </Spin>
          </Form>
        </Card>
        <ConfigProvider
          theme={{
            token: {
              zIndexPopupBase: 3000,
            },
          }}
        >
          <Modal
            title="Doctor Note"
            onOk={onOkModal}
            onCancel={onCancelmodal}
            width={500}
            open={isModalOpen}
          >
            <Form
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              style={{
                width: "100%",
              }}
              initialValues={{
                remember: true,
              }}
              // layout='vertical'
              onFinish={onFinishmodal}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              form={form3}
            >
              {/* <Table columns={Modelcolumns} dataSource={dataModal} scroll={{ x: 0 }} /> */}
              <CustomTable
                columns={Modelcolumns}
                dataSource={dataModal}
                actionColumnName="Action"
                onView={handleView}
              />
            </Form>
          </Modal>
          <Modal
            width={"70%"}
            height={"auto"}
            centered
            title={
              <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                View Doctor Note
              </span>
            }
            open={openCKModel}
            maskClosable={false}
            footer={null}
            onCancel={handleCancel1}
          >
            {/* <Form
                            form={form}
                            // layout="vertical"
                            variant="outlined"
                            initialValues={{
                                Date: dayjs(),
                            }}
                            onFinish={async (values) => {
                                debugger
                                setLoading(true)
                                if (templateEditorData == "") {
                                    message.warning("No data to Save");
                                    return false;
                                }
                                const note = {
                                    DrNoteId: values.DrNoteId ? values.DrNoteId : 0,
                                    PatientId: bed.PatientId,
                                    EncounterId: bed.EncounterId,
                                    datestring: values.Date ? values.Date.format("DD-MM-YYYY") : "",
                                    timestring: values.Date ? values.Date.format("HH:mm:ss") : "",
                                    DrNote: templateEditorData,
                                };
                                const response = await customAxios.post(urlAddNewDrNote, note, {
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                });
                                if (response.status === 200 && response.data.data != null) {
                                    message.success("Success");
                                    setFilteredData(response.data.data.DrNotesList);
                                    form.resetFields();
                                    setTemplateEditorData("");
                                    setButtonTitle("Save");
                                    setReadOnly(false);
                                    setLoading(false)
                                }
                                handleCancel1();
                            }}
                        > */}
            {/* <Row gutter={16} style={{ margin: "1.5rem 0 -1rem 0" }}>
                                <ColWithEightSpan>
                                    <Form.Item
                                        name="Date"
                                        label="Date"
                                        rules={[{ required: true, message: "Please input!" }]}
                                    >
                                        <DatePicker
                                            style={{ width: "100%" }}
                                            showTime={{ format: "hh:mm A" }}
                                            format="dddd , DD-MM-YYYY , hh:mm A"
                                        />
                                    </Form.Item>
                                    <Form.Item name="DrNoteId" hidden><Input /></Form.Item>
                                </ColWithEightSpan>
                            </Row> */}
            <CkEditor
              key={key ? key : customKey}
              initialData={templateEditorData}
              printButton={true}
              // setData={setTemplateEditorData}
            />
            <Row
              justify="end"
              gutter={16}
              style={{ margin: "1rem 0.5rem 0 0" }}
            >
              {/* <Col>
                                    <Form.Item hidden={readOnly}>
                                        <Button type="primary" htmlType="submit" loading={loading}>
                                            {buttonTitle}
                                        </Button>
                                    </Form.Item>
                                </Col> */}
              <Col>
                <Form.Item>
                  <Button danger onClick={handleCancel1}>
                    Cancel
                  </Button>
                </Form.Item>
              </Col>
            </Row>
            {/* </Form> */}
          </Modal>
        </ConfigProvider>
      </div>
    </Layout>
  );
};

export default CreatePatientIndent;
