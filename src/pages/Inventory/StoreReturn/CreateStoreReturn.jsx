import React, { useEffect, useState } from "react";
import Button from "antd/es/button";
import {
  urlCreateStoreReturn,
  urlSearchReceipt,
  urlGetStoreProductDetails,
  urlAddNewStoreReturn,
  urlStoreReturnEdit,
  urlStoreReturnShowBatch,
  urlShowReceiptList,
} from "../../../../endpoints";
import Select from "antd/es/select";
import {
  ConfigProvider,
  Typography,
  Checkbox,
  Tag,
  Modal,
  Popconfirm,
  Spin,
  Col,
  Divider,
  Row,
  Card,
  message,
  AutoComplete,
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
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import customAxios from "../../../components/customAxios/customAxios.jsx";
import PageHeader from "../../../components/PageHeader/index.jsx";
import CustomTable from "../../../components/customTable/index.jsx";
//import { Calculate } from '@mui/icons-material';

const CreateStoreReturn = () => {
  const [DropDown, setDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    ReturnStoreDetails: [],
    UOM: [],
    TaxType: [],
    DateFormat: [],
  });

  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();
  const { Title } = Typography;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataModal, setDataModal] = useState([]);
  const [data, setData] = useState([]);
  const [issueStatus, setIssueStatus] = useState();
  const [productOptions, setProductOptions] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const location = useLocation();
  const ReturnHeaderId = location.state.ReturnHeaderId;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [efromDate, setEFromDate] = useState(dayjs().subtract(1, "day"));
  const [etoDate, setEToDate] = useState(dayjs());
  const [rfromDate, setRFromDate] = useState(dayjs().subtract(1, "day"));
  const [rtoDate, setRToDate] = useState(dayjs());
  const [recieptDetails, setRecieptDetails] = useState();
  const [buttonTitle, setButtonTitle] = useState("Save");
  const [isSingleStage, setIsSingleStage] = useState(false);

  useEffect(() => {
    customAxios
      .get(urlCreateStoreReturn, { params: { type: "Store Return" } })
      .then((response) => {
        const apiData = response.data.data;
        setDropDown(apiData);
      });
  }, []);

  const disableEFromDate = (current) => {
    return current && current.isAfter(dayjs().endOf("day"));
  };

  const disableEToDate = (current) => {
    return (
      current &&
      (current.isBefore(efromDate, "day") ||
        current.isAfter(dayjs().endOf("day")))
    );
  };

  const disableRFromDate = (current) => {
    return current && current.isAfter(dayjs().endOf("day"));
  };

  const disableRToDate = (current) => {
    return (
      current &&
      (current.isBefore(rfromDate, "day") ||
        current.isAfter(dayjs().endOf("day")))
    );
  };

  function handleStoreChange(option) {
    debugger;
    setIsSingleStage(option.IsSingleStage);
    form1.setFieldsValue({ Status: "" });
  }

  useEffect(() => {
    const fetchData = async () => {
      debugger;
      if (ReturnHeaderId > 0) {
        setButtonTitle("Update");
        try {
          const response = await customAxios.get(
            `${urlStoreReturnEdit}?ReturnHeaderId=${ReturnHeaderId}`
          );
          if (response.status == 200 && response.data.data != null) {
            const editeddata = response.data.data;
            const products = editeddata.ReturnDetails.map((item, index) => ({
              ...item,
              key: index,
              ProductName: item.Product,
              index: index + 1,
            }));
            setData(products);

            const formdata = editeddata.newReturnModel;
            form1.setFieldsValue({
              ReturningStore: formdata.StoreId,
              ReturningLocation: formdata.SupplierId,
              // ReturnHeaderId: formdata.ReturnHeaderId
            });
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, []);

  const handleSearch = async (searchText) => {
    if (searchText) {
      const form1va = form1.getFieldValue();
      const response = await customAxios.get(
        `${urlGetStoreProductDetails}?product=${searchText}&storeId=${form1va.ReturningStore}`
      );
      const apiData = response.data.data;
      const newOptions = apiData.map((item) => ({
        value: item.LongName,
        key: item.ProductDefinitionId,
      }));
      setProductOptions(newOptions);
    } else {
      form2.setFieldsValue({ ProductId: 0 });
      setProductOptions([]);
    }
  };
  const handleSelect = (value, option, column) => {
    form2.setFieldsValue({ ProductId: option.key });
  };

  const onFinishModel = async (values) => {
    setLoading(true);
    const formdata = form1.getFieldsValue();
    let ExpDateFrom = "";
    let ExpDateTo = "";
    const check = values.Check != undefined ? values.Check : true;
    if (check) {
      ExpDateFrom = efromDate.format("DD-MM-YYYY");
      ExpDateTo = etoDate.format("DD-MM-YYYY");
    }
    const search = {
      Store: formdata.ReturningStore,
      Supplier: formdata.ReturningLocation ? formdata.ReturningLocation : 0,
      Product: values.Product ? values.Product : 0,
      ExpToString:
        values.ExpiryDateTo && check
          ? values.ExpiryDateTo.format("DD-MM-YYYY")
          : ExpDateFrom,
      ExpFromString:
        values.ExpiryDateFrom && check
          ? values.ExpiryDateFrom.format("DD-MM-YYYY")
          : ExpDateTo,
      RecFromString: values.ReceiptDateFrom
        ? values.ReceiptDateFrom.format("DD-MM-YYYY")
        : rfromDate.format("DD-MM-YYYY"),
      RecToString: values.ReceiptDateTo
        ? values.ReceiptDateTo.format("DD-MM-YYYY")
        : rtoDate.format("DD-MM-YYYY"),
    };
    try {
      const response = await customAxios.get(
        `${urlSearchReceipt}?Store=${search.Store}&Supplier=${search.Supplier}&Product=${search.Product}&ExpToString=${search.ExpToString}&ExpFromString=${search.ExpFromString}&RecFromString=${search.RecFromString}&RecToString=${search.RecToString}`
      );
      if (response.status == 200 && response.data.data != null) {
        const newColumnData = response.data.data.newIndentIssueModel.map(
          (item, index) => {
            return { ...item, key: item.StockId };
          }
        );
        setRecieptDetails(newColumnData);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // const ModelDelete = (record) => {
  //   const newData = dataModel.filter((item) => item.key !== (record.key === undefined ? record.toString() : record.key));
  //   setDataModel(newData);
  // };

  // const handleInputChange = (value, option, key) => {
  //   setInputValues((prevState) => ({ ...prevState, [key]: value }));
  // };

  const onOkModal = () => {};

  const onCancelModel = () => {
    setIsModalOpen(false);
  };

  const handleOnFinish = async (values) => {
    debugger;
    if (data.length == 0) {
      message.warning("Please Add Product/Batch");
      return false;
    }

    const products = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i] !== undefined) {
        const product = {
          ProductId: data[i].ProductId,
          UomId: data[i].UomId,
          BatchNo: data[i].BatchNo,
          ReturnQty: values[i].ReturnQty,
          EXPDateString: dayjs(data[i].EXPDate).format("DD-MM-YYYY"),
        };
        products.push(product);
      }
    }
    const storeReturn = {
      FacilityId: 1,
      StoreId: values.ReturningStore,
      SupplierId: values.ReturningLocation,
      ReturnDatestring: values.ReturningDate.format("DD-MM-YYYY"),
      ReturnStatus: !issueStatus ? "Created" : values.Status,
      ReturnHeaderId: ReturnHeaderId,
    };
    const postData = {
      newReturnModel: storeReturn,
      ReturnDetails: products,
    };
    try {
      const response = await customAxios.post(urlAddNewStoreReturn, postData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      handleToBack();
    } catch (error) {
      // Handle error
    }
  };

  const addtolist = async () => {
    if (selectedRowKeys.length == 0) {
      message.warning("Please Select Alteast one Batch!");
      return false;
    } else {
      const newdata = selectedRowKeys.map((item) => {
        return {
          StockId: item.StockId,
          StoreId: form1.getFieldValue("ReturningStore"),
        };
      });
      const response = await customAxios.post(urlShowReceiptList, newdata, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newData = response.data.data.newIndentIssueModel.map(
        (item, index) => {
          return {
            ...item,
            key: index,
            index: index + 1,
          };
        }
      );
      setData(newData);
      form2.resetFields();
      setDataModal([]);
      setSelectedRowKeys([]);
      setIsModalOpen(false);
    }
    // Filter selected items
    // const selectedItems = dataModal.filter(item => selectedRowKeys.includes(item.key));

    // if (selectedItems.length > 0) {
    //   // Map selected items to a new array with updated keys and indices
    //   const newItems = selectedItems.map((item, index) => ({
    //     ...item,
    //     key: index,      // Ensure a unique key for each item
    //     index: index + 1 // Adjust index if needed
    //   }));

    //   // Update the state with the new items
    //   setData(newItems);
    //   setIsModalOpen(false);
    // } else {
    //   message.warning("Please select at least one product");
    //   return false;
    // }
  };

  const onFinishFailed = () => {};

  const OpenModel = async () => {
    await form1.validateFields(["ReturningStore"]);
    form2.resetFields();
    setIsModalOpen(true);
    form2.submit();
  };

  const handleToBack = () => {
    const url = "/StoreReturn";
    navigate(url);
  };

  const handleReset = () => {
    form2.resetFields();
  };

  const SubmitChanged = (event) => {
    setIssueStatus(event.target.checked);
  };

  const handleclose = () => {
    setIsModalOpen(false);
    form2.resetFields();
    setDataModal([]);
  };

  const handleSelectChange = (e, key) => {
    const newSelectedRowKeys = e.target.checked
      ? [...selectedRowKeys, key]
      : selectedRowKeys.filter((k) => k !== key);

    setSelectedRowKeys(newSelectedRowKeys);
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "ProductName",
      key: "ProductName",
    },
    {
      title: "Uom",
      dataIndex: "Uom",
      key: "Uom",
    },
    {
      title: "BatchNo",
      dataIndex: "BatchNo",
      key: "BatchNo",
    },
    {
      title: "Expiry Date",
      dataIndex: "EXPDateString",
      key: "EXPDateString",
      sorter: (a, b) => a.EXPDateString.localeCompare(b.EXPDateString),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Returned Quantity",
      dataIndex: "Quantity",
      key: "Quantity",
      render: (text) => {
        return text === null ? 0 : text;
      },
    },
    {
      title: "Returnable Qty",
      dataIndex: "BalanceQty",
      key: "ReturnableQty",
      render: (text, record) => {
        return ReturnHeaderId && ReturnHeaderId > 0
          ? record.AvlQuantity
          : record.BalanceQty;
      },
    },
    {
      title: "Return Quantity",
      dataIndex: "ReturnQty",
      key: "ReturnQty",
      width: 300,
      render: (text, record) => (
        <>
          <Form.Item
            name={[record.key, "ReturnQty"]}
            initialValue={record.ReturnQty}
            rules={[
              {
                required: true,
                message: "Please input!",
              },
              {
                validator: (_, value) => {
                  if (value > record.BalanceQty) {
                    return Promise.reject(
                      new Error(
                        "Return Qty should not be Greater than Returnable."
                      )
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber min={0} style={{ marginTop: 10 }} allowClear />
          </Form.Item>
        </>
      ),
    },
  ];

  const isRowSelected = (record) => {
    return selectedRowKeys.some(
      (row) => row.StockId === record.StockId
      // row.GrnBatchId === record.GrnBatchId
    );
  };

  const handleCheckboxChange = (checked, record) => {
    const newSelectedRowKeys = checked
      ? [
          ...selectedRowKeys,
          {
            GRNHeaderId: record.GRNHeaderId,
            GrnBatchId: record.GrnBatchId,
            GrnLineId: record.GrnLineId,

            StockId: record.StockId,
            GRNNumber: record.GRNNumber,
          },
        ]
      : selectedRowKeys.filter(
          (key) =>
            key.GRNHeaderId !== record.GRNHeaderId &&
            key.GrnBatchId !== record.GrnBatchId
        );
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const Modalcolumns = [
    {
      // title: '',
      dataIndex: "key",
      key: "key",
      render: (_, record) => (
        <Checkbox
          checked={isRowSelected(record)}
          onChange={(e) => handleCheckboxChange(e.target.checked, record)}
        />
      ),
    },
    {
      title: "Product",
      dataIndex: "ProductName",
      key: "ProductName",
    },
    {
      title: "Quantity",
      dataIndex: "BalanceQty",
      key: "BalanceQty",
    },
    {
      title: "BatchNo",
      dataIndex: "BatchNo",
      key: "BatchNo",
    },
    {
      title: "Expiry Date",
      dataIndex: "EXPDateString",
      key: "EXPDateString",
      sorter: (a, b) => a.EXPDateString.localeCompare(b.EXPDateString),
      sortDirections: ["descend", "ascend"],
    },
  ];

  function handleStore() {
    setData([]);
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
          title={"Create Store Return"}
          buttonLabel="Back"
          buttonIcon={<LeftOutlined />}
          onButtonClick={handleToBack}
        />
        <Card>
          <Form
            layout="vertical"
            onFinish={handleOnFinish}
            variant="outlined"
            size="default"
            style={{
              maxWidth: 1500,
            }}
            form={form1}
            initialValues={{
              ReturningDate: dayjs(),
            }}
          >
            <Row
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              style={{ padding: "1rem 2rem", marginBottom: "0" }}
              align="Bottom"
            >
              <Col className="gutter-row" span={8}>
                <div>
                  <Form.Item
                    label="Returning Store"
                    name="ReturningStore"
                    rules={[
                      {
                        required: true,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <Select
                      allowClear
                      placeholder="Select Value"
                      onChange={handleStore}
                      onSelect={(value, option) =>
                        handleStoreChange(option.stage)
                      }
                    >
                      {DropDown.StoreDetails.map((option) => (
                        <Select.Option
                          key={option.StoreId}
                          value={option.StoreId}
                          stage={option}
                        >
                          {option.StoreType}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row" span={8}>
                <div>
                  <Form.Item
                    label="Returned to Location"
                    name="ReturningLocation"
                    rules={[
                      {
                        required: true,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <Select
                      allowClear
                      placeholder="Select Value"
                      onChange={handleStore}
                    >
                      {DropDown.ReturnStoreDetails.map((option) => (
                        <Select.Option
                          key={option.StoreId}
                          value={option.StoreId}
                        >
                          {option.StoreType}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row" span={8}>
                <div>
                  <Form.Item
                    label="Returning Date"
                    name="ReturningDate"
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
                      disabled
                    />
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row" span={4}>
                <div>
                  <Form.Item
                    label="Status"
                    name="Status"
                    rules={[
                      {
                        required: issueStatus,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <Select allowClear placeholder="Select Value">
                      <Select.Option
                        hidden={isSingleStage}
                        key="Draft"
                        value="Draft"
                      ></Select.Option>
                      <Select.Option
                        key="Finalize"
                        value="Finalize"
                      ></Select.Option>
                    </Select>
                  </Form.Item>
                  {/* <Form.Item label="Status" name="Status">
                    <Select allowClear placeholder='Select Value'>
                      {DropDown.StoreDetails.map((option) => (
                        <Select.Option key={option.StoreId} value={option.StoreId}>
                          {option.StoreType}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item> */}
                </div>
              </Col>
              <Col className="gutter-row" span={6}>
                <div>
                  <Form.Item
                    name="SubmitCheck"
                    style={{ marginTop: "30px" }}
                    valuePropName="checked"
                  >
                    <Checkbox onChange={SubmitChanged}>Submit</Checkbox>
                  </Form.Item>
                </div>
              </Col>
              <Col className="gutter-row" span={6}>
                <div>
                  <Form.Item name="Remarks" style={{ marginTop: "30px" }}>
                    <Button type="link" onClick={OpenModel}>
                      Search Product/Batch No
                    </Button>
                  </Form.Item>
                </div>
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
                  <Button type="primary" onClick={handleToBack}>
                    Cancel
                  </Button>
                </Form.Item>
              </Col>
            </Row>
            <CustomTable
              columns={columns}
              dataSource={data}
              actionColumn={false}
            />
          </Form>
        </Card>
        <Modal
          title="Search For Product"
          // onOk={onOkModal}
          onCancel={onCancelModel}
          width={1000}
          open={isModalOpen}
          footer={false}
        >
          <Form
            name="basic"
            layout="vertical"
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
              Check: true,
              ExpiryDateFrom: efromDate,
              ExpiryDateTo: etoDate,
              ReceiptDateFrom: rfromDate,
              ReceiptDateTo: rtoDate,
            }}
            onFinish={onFinishModel}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={form2}
          >
            <Row>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  label="Product"
                  name="Product"
                  style={{ marginLeft: "10px" }}
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                >
                  <AutoComplete
                    options={productOptions}
                    onSearch={handleSearch}
                    onSelect={(value, option) =>
                      handleSelect(value, option, "Product")
                    }
                    placeholder="Search for a product"
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={1}>
                <Form.Item name="Check" valuePropName="checked">
                  <Checkbox style={{ marginTop: 30 }} />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={9}>
                <Form.Item label="Expiry Date From" name="ExpiryDateFrom">
                  <DatePicker
                    value={efromDate}
                    onChange={(date) => setEFromDate(date)}
                    disabledDate={disableEFromDate}
                    style={{ width: "100%" }}
                    format="DD-MM-YYYY"
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={8}>
                <Form.Item label="Expiry Date To" name="ExpiryDateTo">
                  <DatePicker
                    value={etoDate}
                    onChange={(date) => setEToDate(date)}
                    disabledDate={disableEToDate}
                    style={{ width: "100%" }}
                    format="DD-MM-YYYY"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col className="gutter-row" span={7}></Col>
              <Col className="gutter-row" span={9}>
                <Form.Item label="Receipt Date From" name="ReceiptDateFrom">
                  <DatePicker
                    value={rfromDate}
                    onChange={(date) => setRFromDate(date)}
                    disabledDate={disableRFromDate}
                    style={{ width: "100%" }}
                    format="DD-MM-YYYY"
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={8}>
                <Form.Item label="Receipt Date To" name="ReceiptDateTo">
                  <DatePicker
                    value={rtoDate}
                    onChange={(date) => setRToDate(date)}
                    disabledDate={disableRToDate}
                    style={{ width: "100%" }}
                    format="DD-MM-YYYY"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end" style={{ padding: "0rem 1rem" }}>
              <Col style={{ marginRight: "10px" }}>
                <Form.Item>
                  <Button type="primary" htmlType="SearchList">
                    Get Stock
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button type="primary" onClick={handleReset}>
                    Reset
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Form
            name="Search for Product"
            style={{
              width: "100%",
            }}
            onFinish={addtolist}
            form={form3}
          >
            <CustomTable
              columns={Modalcolumns}
              loading={loading}
              dataSource={recieptDetails}
              locale={{ emptyText: "Nodata" }}
              actionColumn={false}
            />
          </Form>
          <Row justify={"end"} style={{ margin: "1rem 1.5rem 0" }}>
            <Form.Item>
              <Button onClick={addtolist} type="primary">
                Add To List
              </Button>
            </Form.Item>
          </Row>
        </Modal>
      </div>
    </Layout>
  );
};

export default CreateStoreReturn;
