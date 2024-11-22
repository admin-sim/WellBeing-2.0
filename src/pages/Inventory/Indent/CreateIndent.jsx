
import React, { useEffect, useState } from "react";
import Button from "antd/es/button";
import {
  urlCreatePurchaseOrder,
  urlAutocompleteProduct,
  urlGetProductDetailsById,
  urlAddNewIndent,
  urlEditIndent,
  urlUpdateIndent,
} from "../../../../endpoints.js";
import { v4 as uuidv4 } from "uuid";
import Select from "antd/es/select";
import {
  ConfigProvider,
  message,
  Typography,
  Checkbox,
  Tooltip,
  Modal,
  Card,
  Popconfirm,
  Spin,
  Col,
  Divider,
  Row,
  AutoComplete,
} from "antd";
import Input from "antd/es/input";
import Form from "antd/es/form";
import { DatePicker } from "antd";
import Layout from "antd/es/layout/layout";
//import Typography from 'antd/es/typography';
import { useNavigate } from "react-router";
import { Table, InputNumber } from "antd";
import {
  LeftOutlined,
  CloseSquareFilled,
  DeleteOutlined,
  PlusOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import PageHeader from "../../../components/PageHeader/index.jsx";
import customAxios from "../../../components/customAxios/customAxios.jsx";
import CustomTable from "../../../components/customTable/index.jsx";

const CreateIndent = () => {
  const [DropDown, setDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    UOM: [],
    TaxType: [],
    DateFormat: [],
  });

  let [counter, setCounter] = useState(0);
  let [productCount, setProductcount] = useState(1);

  //const { PoHeaderId, SupplierId, StoreId } = useParams();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const { Title } = Typography;
  const { TextArea } = Input;
  const { Option } = Select;
  const navigate = useNavigate();

  const [istablevisible, setIstablevisible] = useState(false);
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
  const fields = form1.getFieldsValue();
  const location = useLocation();
  const indentId = location.state.IndentId;
  const [buttonTitle, setButtonTitle] = useState("Save");
  const [indentStatus, setIndentStatus] = useState(false);
  const [dropDownLoad, setDropDownLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const initialDataSource =
    indentId === 0
      ? [
        {
          key: uuidv4(),
          ProductName: "",
          // ProductId: '',
          UomId: "",
          RequestingQty: "",
          RequestingStoreStock: "",
          IssuingStoreStock: "",
          Favourite: false,
          ActiveFlag: true,
        },
      ]
      : [];

  const [data, setData] = useState([]);

  useEffect(() => {
    customAxios.get(urlCreatePurchaseOrder).then((response) => {
      const apiData = response.data.data;
      setDropDown(apiData);
    });
    setDropDownLoading(false);
  }, []);

  useEffect(() => {
    debugger;

    fetchData();
  }, []);

  const fetchData = async () => {
    if (indentId > 0) {
      setLoading(true);
      setButtonTitle("Update");
      customAxios
        .get(`${urlEditIndent}?IndentId=${indentId}`)
        .then((response) => {
          const apiData = response.data.data;
          const products = apiData.IndentDetails.map((item, index) => ({
            ...item,
            key: index + 1,
            RequestingStoreStock: apiData.IndentDetails[index].AvlReqQuantity,
            IssuingStoreStock: apiData.IndentDetails[index].AvlIssueQuantity,
            RequestingQty: apiData.IndentDetails[index].RequestQty,
            Favourite:
              apiData.IndentDetails[index].Favourite === "Y" ? true : false,
          }));
          setIstablevisible(true);
          setData(products);
          setProductcount(products.length + 1);
          const formdata = apiData.newIndentModel;
          form1.setFieldsValue({
            RequestingStoreId: formdata.RequestingStoreId,
            IndentNumber: formdata.IndentNumber,
            IndentDatestring: formdata.IndentDatestring
              ? dayjs(formdata.IndentDatestring, "DD-MM-YYYY")
              : null,
            IssueingStoreId: formdata.IssueingStoreId,
            IndentType: formdata.IndentType,
            IndentCategory: formdata.IndentCategory,
            Remarks: formdata.Remarks,
            IndentStatus:
              formdata.IndentStatus === "Created" ? "" : formdata.IndentStatus,
            IndentId: formdata.IndentId,
            IndentTemplateId: ""
          });
          setLoading(false);
        });
    }
  }

  const handleToIndent = () => {
    const url = "/Indent";
    navigate(url);
  };

  const handleDelete = (record) => {
    debugger;
    const newData = data.map((item) => {
      if (item.key === record.key) {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });
    setData(newData);
  };

  const handleSelectProduct = (value, option, column, record) => {
    debugger;
    const va = form1.getFieldsValue();
    customAxios
      .get(`${urlGetProductDetailsById}?ProductId=${option.key}`)
      .then((response) => {
        debugger;
        const apiData = response.data.data;
        const issqty = apiData.Stock.filter(
          (item) => item.StoreId == va.IssueingStoreId
        );
        const reqqty = apiData.Stock.filter(
          (item) => item.StoreId == va.RequestingStoreId
        );
        const IsstotalQuantity = issqty.reduce(
          (sum, element) => sum + element.Quantity,
          0
        );
        const ReqtotalQuantity = reqqty.reduce(
          (sum, element) => sum + element.Quantity,
          0
        );
        const newData = data.map((item) => {
          if (item.key === record.key) {
            const updatedItem = {
              ...item,
              [column]: option.key,
              ProductName: option.value,
              ProductId: option.key,
              UomId: option.UomId,
              IssuingStoreStock: IsstotalQuantity,
              RequestingStoreStock: ReqtotalQuantity,
            };
            return updatedItem;
          }
          return item;
        });
        setData(newData);
        form1.setFieldsValue({
          [record.key]: { IssuingStoreStock: IsstotalQuantity },
        });
        form1.setFieldsValue({
          [record.key]: { RequestingStoreStock: ReqtotalQuantity },
        });
        form1.setFieldsValue({ [record.key]: { UomId: option.UomId } });
      });
    form1.setFieldsValue({ [record.key]: { ProductId: option.key } });
  };

  const handleSelect = (value, option, column, record) => {
    const va = form1.getFieldsValue();
    if (va.RequestingStoreId !== undefined && va.IssueingStoreId != undefined) {
      if (va.RequestingStoreId !== va.IssueingStoreId) {
        setIstablevisible(true);
        setData(initialDataSource)
      } else {
        setData((prevState) => { return [] })
        form1.resetFields();
        setIstablevisible(false);
        message.warning("Please select Different Stores");
      }
    } else {
      setData([]);
      setIstablevisible(false);
    }
  };

  const handleUomChange = (option, column, index, record) => {
    const newData = data.map((item) => {
      if (item.key === record.key) {
        const updatedItem = {
          ...item,
          [column]: option.value,
          ShortName: option.children,
        };
        return updatedItem;
      }
      return item;
    });
    setData(newData);
  };

  const handleSearch = async (searchText) => {
    if (searchText) {
      const response = await customAxios.get(
        `${urlAutocompleteProduct}?Product=${searchText}`
      );
      const apiData = response.data.data;
      const filteredApiData = apiData.filter(apiItem =>
        !data.some(option => option.ProductId === apiItem.ProductId)
      );
      const newOptions = filteredApiData.map((item) => ({
        value: item.LongName,
        key: item.ProductId,
        UomId: item.UOMPrimaryUOM,
      }));
      setAutoCompleteOptions(newOptions);
    }
  };

  const AddProduct = async () => {
    debugger;
    setAutoCompleteOptions([]);

    // const allFields = ["IndentType"];
    // const fieldsToValidate = allFields.filter(
    //   (field) => field !== "IndentType"
    // );
    await form1.validateFields();
    setData([
      ...data,
      {
        key: uuidv4(),
        ProductName: "",
        // ProductId: '',
        UomId: "",
        RequestingQty: "",
        RequestingStoreStock: "",
        IssuingStoreStock: "",
        Favourite: false,
        ActiveFlag: true,
      },
    ]);
    // setProductcount(productCount + 1);
  };

  const validateEqualValue = (record, value) => {
    debugger
    if (value <= record.IssuingStoreStock) {
      const newdata = data.map((item) => {
        if (item.ProductId === record.ProductId) {
          const updated = { ...item, RequestingQty: value == null ? undefined : value };
          return updated;
        }
        return item;
      });
      setData(newdata);
      return Promise.resolve();
    }
    return Promise.reject(new Error("not Greater than Issue Store Stock!"));
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "ProductName",
      fixed: "left",
      key: 'ProductName',
      width: 250,
      render: (text, record, index) => (
        <>
          <Form.Item
            name={[record.key, "ProductName"]}
            rules={[{ required: true, message: "Required" }]}
            initialValue={record.ProductName}
          >
            <AutoComplete
              defaultValue={record.ProductName}
              options={autoCompleteOptions}
              onSearch={handleSearch}
              onSelect={(value, option) =>
                handleSelectProduct(value, option, "ProductName", record)
              }
              onChange={(value) => {
                if (!value) {
                  setAutoCompleteOptions([]);
                }
              }}
              allowClear={{
                clearIcon: <CloseSquareFilled />,
              }}
              disabled={!!record.IndentLineId}
            />
          </Form.Item>
          <Form.Item
            name={[record.key, "ProductId"]}
            initialValue={record.ProductId}
            hidden
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            name={[record.key, "IndentLineId"]}
            initialValue={record.IndentLineId}
            hidden
          >
            <Input></Input>
          </Form.Item>
        </>
      ),
    },
    {
      title: "UOM",
      dataIndex: "UomId",
      key: 'UomId',
      width: 100,
      render: (text, record, index) => (
        <>
          <Form.Item
            name={[record.key, "UomId"]}
            rules={[{ required: true, message: "Required" }]}
            initialValue={record.UomId}
          >
            <Select
              defaultValue={record.UomId}
              disabled={!!indentId}
              onChange={(value, option) =>
                handleUomChange(option, "UomId", index, record)
              }
            >
              {DropDown.UOM.map((option) => (
                <Option key={option.UomId} value={option.UomId}>
                  {option.ShortName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </>
      ),
    },
    {
      title: "Requesting Qty",
      dataIndex: "RequestingQty",
      key: 'RequestingQty',
      width: 100,
      render: (text, record) => (
        <Form.Item
          name={[record.key, "RequestingQty"]}
          rules={[
            {
              required: true,
              message: "Please input!",
            },
            {
              validator: (_, value) => validateEqualValue(record, value),
            },
          ]}
          initialValue={record.RequestingQty}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      ),
    },
    {
      title: "Requesting Store Stock",
      dataIndex: "RequestingStoreStock",
      key: 'RequestingStoreStock',
      width: 100,
      render: (text, record) => (
        <Form.Item
          initialValue={record.RequestingStoreStock}
          name={[record.key, "RequestingStoreStock"]}
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            defaultValue={record.RequestingQty}
            disabled
          />
        </Form.Item>
      ),
    },
    {
      title: "Issuing Store Stock",
      dataIndex: "IssuingStoreStock",
      key: 'IssuingStoreStock',
      width: 100,
      render: (text, record) => (
        <Form.Item
          name={[record.key, "IssuingStoreStock"]}
          initialValue={record.IssuingStoreStock}
          rules={[
            {
              required: true,
              type: "number",
              min: 1,
              message: 'value must greater than 0!'
            }
          ]}
        >
          <InputNumber
            min={0}
            disabled
            style={{ width: "100%" }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Fav",
      dataIndex: "Favourite",
      width: 50,
      key: 'Favourite',
      render: (text, record) => (
        <Form.Item
          initialValue={record.Favourite}
          name={[record.key, "Favourite"]}
          style={{ width: 100 }}
          valuePropName="checked"
        >
          <Checkbox></Checkbox>
        </Form.Item>
      ),
    },
    {
      title: (

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={AddProduct}
        ></Button>
      ),
      dataIndex: "add",
      key: 'add',
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

  const handleCancel = () => {
    const url = "/Indent";
    navigate(url);
  };

  // const handleOnFinish = async (values) => {
  //   debugger;
  //   const va = form1.getFieldsValue();
  //   data;

  //   const products = [];
  //   for (let i = 0; i <= productCount; i++) {
  //     if (data[i] !== undefined) {
  //       const product = {
  //         ProductId: data[i].ProductId,
  //         UomId: data[i].UomId,
  //         RequestQty: data[i].RequestingQty,
  //         Favourite: data[i].Favourite === true ? "Y" : "N",
  //         IssuingStoreStock: data[i].IssuingStoreStock,
  //         RequestingStoreStock: data[i].RequestingStoreStock,
  //         QuantityTobeIssued: data[i].IssuingStoreStock,
  //         IndentLineId:
  //           data[i].IndentLineId === undefined ? 0 : data[i].IndentLineId,
  //         ActiveFlag: data[i].ActiveFlag,
  //       };
  //       products.push(product);
  //     }
  //   }
  //   if (products.length == 0) {
  //       message.warning("Please Add Products");
  //     return false;
  //   }
  //   const Indent = {
  //     IndentDatestring: values.IndentDatestring.format("DD-MM-YYYY"),
  //     IndentId: values.IndentId === undefined ? 0 : values.IndentId,
  //     RequestingStoreId: values.RequestingStoreId,
  //     IssueingStoreId: values.IssueingStoreId,
  //     IndentTemplateId:
  //       values.IndentTemplateId === undefined ? 0 : values.IndentTemplateId,
  //     IndentType: values.IndentType,
  //     Remarks: values.Remarks === undefined ? null : values.Remarks,
  //     IndentStatus: !indentStatus ? "Created" : values.IndentStatus,
  //     IndentCategory: "StoreIndent",
  //   };
  //   const postData = {
  //     newIndentModel: Indent,
  //     IndentDetails: products,
  //   };
  //   try {
  //     if (indentId > 0) {
  //       const response = await customAxios.post(urlUpdateIndent, postData, {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });
  //       message.success("Indent Updated!");
  //     } else {
  //       const response = await customAxios.post(urlAddNewIndent, postData, {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });
  //       message.success("Indent Created!");
  //     }
  //     handleCancel();
  //   } catch (error) {
  //     // Handle error
  //   }
  // };

  const handleOnFinish = async (values) => {
    debugger;
    const newdata = data.filter(item => item.ProductId)
    const products = newdata
      .filter((item, index) => index <= newdata.length && item !== undefined)
      .map((item) => ({
        ProductId: item.ProductId,
        UomId: item.UomId,
        RequestQty: item.RequestingQty,
        Favourite: item.Favourite ? "Y" : "N",
        IssuingStoreStock: item.IssuingStoreStock,
        RequestingStoreStock: item.RequestingStoreStock,
        QuantityTobeIssued: item.IssuingStoreStock,
        IndentLineId: item.IndentLineId || 0,
        ActiveFlag: item.ActiveFlag,
      }));

    if (products.length === 0 || !products.some(product => product.ActiveFlag)) {
      message.warning("Please Add Products");
      return false;
    }
    const activeProducts = products.filter((product) => product.ActiveFlag);

    const indent = {
      IndentDatestring: values.IndentDatestring.format("DD-MM-YYYY"),
      IndentId: values.IndentId || 0,
      RequestingStoreId: values.RequestingStoreId,
      IssueingStoreId: values.IssueingStoreId,
      IndentTemplateId: values.IndentTemplateId || 0,
      IndentType: values.IndentType,
      Remarks: values.Remarks || null,
      IndentStatus: indentStatus ? values.IndentStatus : "Created",
      IndentCategory: "StoreIndent",
    };

    const postData = {
      newIndentModel: indent,
      IndentDetails: indentId === 0 ? activeProducts : products,
    };

    try {
      const url = indentId > 0 ? urlUpdateIndent : urlAddNewIndent;
      const response = await customAxios.post(url, postData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status == 200) {
        message.success(indentId > 0 ? "Indent Updated!" : "Indent Created!");
        handleCancel();
      } else {
        message.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting form: ", error);
      message.error("An error occurred while submitting the form. Please try again.");
    }
  };


  const SubmitCheck = (event) => {
    setIndentStatus(event.target.checked);
  };

  return (
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
          title={"Create Indent"}
          buttonLabel="Back"
          buttonIcon={<LeftOutlined />}
          onButtonClick={handleToIndent}
        />
        <Card>
          <Form
            layout="vertical"
            onFinish={handleOnFinish}
            variant="outlined"
            style={{
              //   maxWidth: 1500,
            }}
            name="trigger"
            form={form1}
            initialValues={{
              IndentDatestring: dayjs(),
            }}
          >
            <Row
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              style={{ marginBottom: "0" }}
              align="Bottom"
            >
              <Col className="gutter-row" span={6}>
                <Form.Item
                  label="Indent Date"
                  name="IndentDatestring"
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
                    disabled={!!form1.getFieldValue("IndentId")}
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
                  label="Requesting Store"
                  name="RequestingStoreId"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Select
                    loading={dropDownLoad}
                    allowClear
                    placeholder="Select Value"
                    onChange={handleSelect}
                    disabled={!!form1.getFieldValue("IndentId")}
                  >
                    {DropDown.StoreDetails.map((option) => (
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
                  label="Issuing Store"
                  name="IssueingStoreId"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Select
                    loading={dropDownLoad}
                    allowClear
                    placeholder="Select Value"
                    onChange={handleSelect}
                    disabled={!!form1.getFieldValue("IndentId")}
                  >
                    {DropDown.StoreDetails.map((option) => (
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
                <div>
                  <Form.Item label="Remarks" name="Remarks">
                    <TextArea autoSize allowClear />
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item label="Indent Template" name="IndentTemplateId">
                  <Select allowClear placeholder="Select Value"></Select>
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
                  <Select allowClear placeholder="Select Value">
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
              <Col className="gutter-row" span={3}>
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
              <Col className="gutter-row" span={3}>
                <Form.Item
                  name="SubmitCheck"
                  style={{ paddingTop: 30 }}
                  valuePropName="checked"
                >
                  <Checkbox onChange={SubmitCheck}>Submit</Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end" style={{ padding: "0rem 1rem" }}>
              <Col style={{ marginRight: "10px" }}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
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
            <Spin spinning={loading}>
              {istablevisible ? (
                <CustomTable
                  dataSource={data.filter((item) => item.ActiveFlag !== false)}
                  columns={columns}
                  isFilter={false}
                  actionColumn={false}
                  bordered
                />
              ) : null}
            </Spin>
          </Form>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateIndent;