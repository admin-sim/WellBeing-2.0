import customAxios from "../../components/customAxios/customAxios.jsx";
import React, { useEffect, useState } from "react";
import Button from "antd/es/button";
import {
  urlCreateStoreReturn,
  urlSearchReceipt,
  urlGetStoreProductDetails,
  urlAddNewStoreReturn,
  urlStoreReturnEdit,
  urlAcknowledgeReturnCreate,
  urlAddNewAcknowledgeReturn,
} from "../../../endpoints";
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
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
//import { Calculate } from '@mui/icons-material';

const CreateAcknowledageReturn = () => {
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

  const { Title } = Typography;

  const [data, setData] = useState([]);
  const [issueStatus, setIssueStatus] = useState();

  const location = useLocation();
  const record = location.state.record;
  const navigate = useNavigate();
  useEffect(() => {
    customAxios.get(urlCreateStoreReturn).then((response) => {
      const apiData = response.data.data;
      setDropDown(apiData);
      //setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    debugger;
    const fetchData = async () => {
      if (record) {
        try {
          const response = await customAxios.get(
            `${urlAcknowledgeReturnCreate}?ReturnHeaderId=${
              record.ReturnHeaderId
            }&AcknowledgeReturnHeaderId=${
              record.AcknowledgeReturnHeaderId
                ? record.AcknowledgeReturnHeaderId
                : 0
            }`
          );
          if (response.status === 200 && response.data.data !== null) {
            const editedData = response.data.data;
            const products = editedData.ReturnDetails.map((item, index) => {
              const acknowledgeDetails =
                editedData.AcknowledgeReturnDetails.find(
                  (ackItem) => ackItem.ProductId === item.ProductId
                );

              return {
                key: index,
                index: index + 1,
                Product: item.Product,
                Uom: item.Uom,
                BatchNo: item.BatchNo,
                EXPDate: item.EXPDate !== null ? item.EXPDate : "",
                ReturnQty: item.ReturnQty,
                AcceptQty: item.ReturnQty,
                Remarks: acknowledgeDetails ? acknowledgeDetails.Remarks : "",
                ReturnLineId: acknowledgeDetails ? acknowledgeDetails.ReturnLineId : 0,
                UomId: item.UomId, 
                ProductId: item.ProductId,
                LineId: acknowledgeDetails
                  ? acknowledgeDetails.ReturnLineId
                  : 0,
              };
            });

            setData(products);
            const formdata = editedData.newReturnModel;
            form1.setFieldsValue({
              ReturningStore: formdata.StoreId,
              AcknowledgingStore: formdata.SupplierId,
              ReturnID: formdata.ReturnNumber,

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
          ReturnQty: data[i].ReturnQty,
          EXPDateString: dayjs(data[i].EXPDate).format("DD-MM-YYYY"),
          ReturnLineId:  data[i].ReturnLineId ,
        };
        products.push(product);
      }
    }
    const storeReturn = {
      FacilityId: 1,
      StoreId: values.ReturningStore,
      ReturnStoreId: values.AcknowledgingStore,
      ReturnDatestring: values.AcknowledgeDate
        ? values.AcknowledgeDate.format("DD-MM-YYYY")
        : null,
      ReturnStatus: !issueStatus ? "Created" : values.Status,
      ReturnHeaderId: record.ReturnHeaderId,
      AcknowledgeReturnHeaderId:record.AcknowledgeReturnHeaderId ? record.AcknowledgeReturnHeaderId : 0 ,    
    };
    const postData = {
      newReturnModel: storeReturn,
      ReturnDetails: products,
    };
    try {
      const response = await customAxios.post(urlAddNewAcknowledgeReturn, postData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      handleToBack();
    } catch (error) {
      // Handle error
    }
  };

  const handleToBack = () => {
    const url = "/AcknowledgeReturn";
    navigate(url);
  };

  const SubmitChanged = (event) => {
    setIssueStatus(event.target.checked);
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "Product",
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
      dataIndex: "EXPDate",
      key: "EXPDate",
      sorter: (a, b) => a.EXPDate.localeCompare(b.EXPDate),
      sortDirections: ["descend", "ascend"],
      render: (text) => {
        const dateParts = text.split("T")[0].split("-");
        const year = dateParts[0];
        const month = dateParts[1];
        const day = dateParts[2];

        return `${day}-${month}-${year}`;
      },
    },
    {
      title: "Returned Quantity",
      dataIndex: "ReturnQty",
      key: "ReturnQty",
      render: (text) => {
        // Display 0 if Quantity is null
        return text === null ? 0 : text;
      },
    },
    {
      title: "Accepted Qty",
      dataIndex: "ReturnQty",
      key: "ReturnQty",
      render: (text) => {
        // Display 0 if Quantity is null
        return text === null ? 0 : text;
      },
    },
  ];

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
              Create Store Return
            </Title>
          </Col>
          <Col offset={6} span={2}>
            <Button
              icon={<LeftOutlined />}
              style={{ marginBottom: 0 }}
              onClick={handleToBack}
            >
              Back
            </Button>
          </Col>
        </Row>
        <Form
          layout="vertical"
          onFinish={handleOnFinish}
          variant="outlined"
          style={{
            maxWidth: 1500,
          }}
          form={form1}
          initialValues={{
            AcknowledgeDate: dayjs(),
          }}
        >
          <Row
            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            style={{ padding: "1rem 0.5rem", marginBottom: "0" }}
            align="Bottom"
          >
            <Col className="gutter-row" span={8}>
              <Form.Item label="Return ID" name="ReturnID">
                <Input disabled style={{ width: "100%" }} allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
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
                  <Select disabled allowClear placeholder="Select Value">
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
              </div>
            </Col>
            <Col className="gutter-row" span={8}>
              <div>
                <Form.Item
                  label="Acknowledging Store"
                  name="AcknowledgingStore"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Select disabled allowClear placeholder="Select Value">
                    {DropDown.ReturnStoreDetails.map((option) => (
                      <Select.Option
                        key={option.StoreId}
                        value={option.StoreId}
                      >
                        {option.LongName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={8}>
              <div>
                <Form.Item
                  label="Acknowledge Date"
                  name="AcknowledgeDate"
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
            <Col span={4}>
              <div>
                <Form.Item
                  label="Acknowledge Status"
                  name="Status"
                  rules={[
                    {
                      required: issueStatus,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Select allowClear placeholder="Select Value">
                    <Select.Option key="Draft" value="Draft"></Select.Option>
                    <Select.Option
                      key="Finalize"
                      value="Finalize"
                    ></Select.Option>
                  </Select>
                </Form.Item>
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
          </Row>
          <Row justify="end" style={{ padding: "0rem 1rem" }}>
            <Col style={{ marginRight: "10px" }}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button onClick={handleToBack} type="primary">
                  Cancel
                </Button>
              </Form.Item>
            </Col>
          </Row>
          <Table columns={columns} dataSource={data} />
        </Form>
      </div>
    </Layout>
  );
};

export default CreateAcknowledageReturn;
