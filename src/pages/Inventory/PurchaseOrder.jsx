import React, { useState, useEffect } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import Layout from "antd/es/layout/layout";
import {
  Spin,
  Skeleton,
  Tag,
  Typography,
  Select,
  Button,
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  Card,
  Divider,
  Tooltip,
  Table,
} from "antd";
//import { CloseSquareFilled } from '@ant-design/icons';
import { useNavigate } from "react-router";

import {
  urlGetPurshaseOrderDetails,
  urlSearchPurchaseOrder,
} from "../../../endpoints.js";
import customAxios from "../../components/customAxios/customAxios";
import CustomTable from "../../components/customTable/index.jsx";
import moment from "moment";

const PurchaseOrder = () => {
  const [purchaseOrderDropdown, setPurchaseOrderDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    DateFormat: [],
  });

  const [filteredData, setFilteredData] = useState([]);
  const [dropDownLoad, setDropDownLoading] = useState(true);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { Title } = Typography;
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

  useEffect(() => {
    try {
      customAxios.get(urlGetPurshaseOrderDetails, {}).then((response) => {
        const apiData = response.data.data;
        setPurchaseOrderDropDown(apiData);
      });

    } catch (error) {
      console.error("Error fetching purchase order details:", error);
    }
    setDropDownLoading(false);
    form.submit();
  }, []);


  const navigate = useNavigate();



  const colorMapping = {
    Created: "#4E31AA",
    Draft: "#6EACDA",
    Pending: "#F5004F",
    "Partially Pending": "#8E3E63",
    Finalize: "#52c41a",
    Completed: "#FF9100",
  };

  const GetPobyId = (PoHeaderId) => {
    navigate("/CreatePurchaseOrder", { state: { PoHeaderId } });
  };
  const columns = [
    {
      title: "Sl. No.",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "PO Number",
      dataIndex: "PONumber",
      key: "PONumber",
      sorter: (a, b) => a.PONumber - b.PONumber,
      sortDirections: ["descend", "ascend"],
      render: (text, record, index) => {
        if (record.PoStatus === "Created" || record.PoStatus === "Draft") {
          return (
            <Button type="link" onClick={() => GetPobyId(record.PoHeaderId)}>
              {text}
            </Button>
          );
        }
        return <Tag style={{ marginLeft: "15px" }}>{text}</Tag>;
      },
    },
    {
      title: "Document Type",
      dataIndex: "DocumentTypeName",
      key: "DocumentTypeName",
      sorter: (a, b) => a.DocumentTypeName.localeCompare(b.DocumentTypeName),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Po Date",
      dataIndex: "PoDateString",
      key: "PoDateString",
      sorter: (a, b) => new Date(a.PoDateString) - new Date(b.PoDateString),
      sortDirections: ["descend", "ascend"],
      // render: (text) => {
      //   const dateParts = text.split("T")[0].split("-");
      //   const year = dateParts[0];
      //   const month = dateParts[1];
      //   const day = dateParts[2];

      //   return `${day}-${month}-${year}`;
      // },
    },
    {
      title: "Supplier Name",
      dataIndex: "SupplierName",
      key: "SupplierName",
      sorter: (a, b) => a.SupplierName.localeCompare(b.SupplierName),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Store Name",
      dataIndex: "StoreName",
      key: "StoreName",
      sorter: (a, b) => a.StoreName.localeCompare(b.StoreName),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "PO Auth By",
      dataIndex: "PORaisedBy",
      key: "PORaisedBy",
      sorter: (a, b) => a.PurchaseOrderId.localeCompare(b.PurchaseOrderId),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Po Status",
      dataIndex: "PoStatus",
      key: "PoStatus",
      sorter: (a, b) => a.PoStatus.localeCompare(b.PoStatus),
      sortDirections: ["descend", "ascend"],
      render: (text) => {
        return (
          <Tag color={colorMapping[`${text}`]} key={text}>
            {text.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      render: (_, row) => <Button type="link">Report</Button>,
    },
  ];

 
  const onFinish = async (values) => {
    debugger;
    setLoading(true);
    try {
      const postData1 = {
        DocumentType: values.DocumentType ? values.DocumentType : "",
        Supplier: values.Supplier ? values.Supplier : "",
        ProcurementStore: values.ProcurementStore
          ? values.ProcurementStore
          : "",
        DocumentStatus: values.DocumentStatus ? values.DocumentStatus : "",
        FromDate: values.FromDate ? values.FromDate.format("DD-MM-YYYY") : "",
        ToDate: values.ToDate ? values.ToDate.format("DD-MM-YYYY") : "",
        PONumber: values.PONumber ? values.PONumber : "",
      };
      customAxios
        .get(
          `${urlSearchPurchaseOrder}?DocumentType=${postData1.DocumentType}&Supplier=${postData1.Supplier}&ProcurementStore=${postData1.ProcurementStore}&DocumentStatus=${postData1.DocumentStatus}&FromDate=${postData1.FromDate}&ToDate=${postData1.ToDate}&PoNumber=${postData1.PONumber}`,
          null,
          {
            params: postData1,
            headers: {
              "Content-Type": "application/json", // Replace with the appropriate content type if needed
            },
          }
        )
        .then((response) => {

          const newColumnData = response.data.data.PurchaseOrderDetails.map((obj, index) => {
            return { ...obj, key: index + 1 };
          });
          setFilteredData(newColumnData);
          // setCurrentPage1(1);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      // Handle any errors here
      console.error("Error:", error);
    }

  };


  const onReset = () => {

    form.resetFields();
  };

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
              Purchase Order
            </Title>
          </Col>
          <Col offset={5} span={2}>
            <Button
              icon={<PlusCircleOutlined />}
              style={{ marginRight: 0 }}
              onClick={() => GetPobyId(0)}
            >
              Add Purchase Order
            </Button>
          </Col>
        </Row>
        <Card>
          <Form
            form={form}
            name="control-hooks"
            layout="vertical"
            variant="outlined"
            style={{
              maxWidth: 1500,
            }}
            initialValues={{
              FromDate: dayjs().subtract(1, "day"),
              ToDate: dayjs(),
              DocumentType: 0,
              Supplier: 0,
              ProcurementStore: 0,
              DocumentStatus: "",
            }}
            onFinish={onFinish}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row" span={6}>
                <Form.Item label="DocumentType" name="DocumentType">
                  <Select loading={dropDownLoad}>
                    <Select.Option key={0} value={0}>
                      All
                    </Select.Option>
                    {purchaseOrderDropdown.DocumentType.map((option) => (
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
              <Col className="gutter-row" span={6}>
                <Form.Item name="Supplier" label="Supplier">
                  <Select loading={dropDownLoad}>
                    <Select.Option key={0} value={0}>
                      All
                    </Select.Option>
                    {purchaseOrderDropdown.SupplierList.map((option) => (
                      <Select.Option
                        key={option.VendorId}
                        value={option.VendorId}
                      >
                        {option.LongName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="FromDate" label="From Date">
                  <DatePicker
                    value={fromDate}
                    onChange={(date) => setFromDate(date)}
                    disabledDate={(current) => current > moment()}
                    style={{ width: "100%" }}
                    format="DD-MM-YYYY"
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="ToDate" label="To Date">
                  <DatePicker
                    value={toDate}
                    onChange={(date) => setToDate(date)}
                    disabledDate={(current) => current < fromDate} // disable dates before fromDate
                    style={{ width: "100%" }}
                    format="DD-MM-YYYY"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  name="ProcurementStore"
                  label="Procurement Store"
                  rules={[{ required: false }]}
                >
                  <Select loading={dropDownLoad}>
                    <Select.Option key={0} value={0}>
                      All
                    </Select.Option>
                    {purchaseOrderDropdown.StoreDetails.map((option) => (
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
                <Form.Item label="PO Number" name="PONumber">
                  <Input allowClear style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item label="PO Status" name="DocumentStatus">
                  <Select>
                    <Select.Option key="" value="">
                      All
                    </Select.Option>
                    <Select.Option
                      key="Created"
                      value="Created"
                    ></Select.Option>
                    <Select.Option key="Draft" value="Draft"></Select.Option>
                    <Select.Option
                      key="Pending"
                      value="Pending"
                    ></Select.Option>
                    <Select.Option
                      key="Partially Pending"
                      value="Partially Pending"
                    ></Select.Option>
                    <Select.Option
                      key="Completed"
                      value="Completed"
                    ></Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end">
              <Col>
                <Form.Item>
                  <Button
                    type="primary"

                    htmlType="submit"
                  >
                    Search
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button type="default" onClick={onReset}>
                    Reset
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Spin spinning={loading}>
            <CustomTable
              dataSource={filteredData}
              columns={columns}
              actionColumn={false}
              isFilter={true}
              bordered
            />
          </Spin>
        </Card>
      </div>
    </Layout>
  );
};

export default PurchaseOrder;
