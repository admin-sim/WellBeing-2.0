import React, { useState, useEffect } from "react";
import Layout from "antd/es/layout/layout";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
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
  Modal,
} from "antd";
//import { CloseSquareFilled } from '@ant-design/icons';
import { useNavigate } from "react-router";
import {
  urlGetPurshaseOrderDetails,
  urlSearchItemReceipt,
} from "../../../../endpoints.js";
import { Option } from "antd/es/mentions";
import { render } from "react-dom";
import customAxios from "../../../components/customAxios/customAxios.jsx";
import CustomTable from "../../../components/customTable/index.jsx";
//import { format } from 'prettier';
//import { useLocation } from 'react-router-dom';

const ItemReceipt = () => {
  const [Dropdown, setDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    DateFormat: [],
  });

  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isTable, setIsTable] = useState(false);
  const { Title } = Typography;
  const [fromDate, setFromDate] = useState(dayjs().subtract(1, "day"));
  const [toDate, setToDate] = useState(dayjs());
  const [error, setError] = useState(null);
  const [reportUrl, setReportUrl] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    try {
      customAxios.get(urlGetPurshaseOrderDetails, {}).then((response) => {
        const apiData = response.data.data;
        setDropDown(apiData);
      });
    } catch (error) {
      console.error("Error fetching purchase order details:", error);
    }
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

  const GetModelDetails = (text, record, index) => {
    const IndentReceiptId = record.IndentReceiptId ? record.IndentReceiptId : 0;
    const IssueId = record.IssueId;
    navigate("/UpdateItemReceipt", { state: { IssueId, IndentReceiptId } });
  };

  const disableFromDate = (current) => {
    // Disable dates that are after today
    return current && current.isAfter(dayjs().endOf("day"));
  };

  const disableToDate = (current) => {
    // Disable dates that are before the selected fromDate or after today
    return (
      current &&
      (current.isBefore(fromDate, "day") ||
        current.isAfter(dayjs().endOf("day")))
    );
  };

  const columns = [
    {
      title: "Sl No",
      dataIndex: "key",
      key: "key",
      width: 60,
    },
    {
      title: "Issue Number",
      dataIndex: "IssueNumber",
      key: "IssueNumber",
      width: 100,
      render: (text, record, index) => {
        if (
          record.ReceiptStatus === "Finalize" &&
          record.IssueStatus === "Finalize"
        ) {
          return <Tag style={{ marginLeft: "5px" }}>{text}</Tag>;
        }
        return (
          <Button
            type="link"
            onClick={() => GetModelDetails(text, record, index)}
          >
            {text}
          </Button>
        );
      },
    },
    {
      title: "Indent Number",
      dataIndex: "IndentNumber",
      key: "IndentNumber",
      width: 100,
    },
    {
      title: "Receipt Number",
      dataIndex: "ReceiptNumber",
      key: "ReceiptNumber",
      width: 100,
    },
    {
      title: "Indent Type",
      dataIndex: "IndentType",
      key: "IndentType",
      width: 150,
    },
    {
      title: "Indent Date",
      dataIndex: "IndentDatestring",
      key: "IndentDatestring",
      width: 100,
    },
    {
      title: "Issue Date",
      dataIndex: "IssueDateString",
      key: "IssueDateString",
      width: 100,

    },
    {
      title: "Issueing Store",
      dataIndex: "IssueStoreName",
      key: "IssueStoreName",
      width: 150,
    },
    {
      title: "Requesting Location",
      dataIndex: "RequestStoreName",
      key: "RequestStoreName",
      width: 140,
    },
    {
      title: "Issue Status",
      dataIndex: "IssueStatus",
      key: "IssueStatus",
      width: 140,
      render: (text) => {
        return (
          <Tag color={colorMapping[`${text}`]} key={text}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Receipt Status",
      dataIndex: "ReceiptStatus",
      key: "ReceiptStatus",
      width: 120,
      render: (text) => {
        return (
          <Tag color={colorMapping[`${text}`]} key={text}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      width: 60,
      render: (_, record) => <Button type="link" onClick={(value) => handleReport(value, record)}>Report</Button>,
    },
  ];

  const handleReport = async (value, record) => {
    setLoading(true)
    try {
      const request = {
        PONO: record.IssueNumber,
        use: 'admin',
        FileType: "pdf", // or 'excel'
      };
      const { url, blob } = await fetchReport(request);
      setReportUrl(url);
      // setBlobData(blob);
      setIsModalVisible(true);
    } catch (error) {
      setError(error.message);
    }
  };

  async function fetchReport(request) {
    const response = await fetch(
      "https://192.168.29.254:808/api/ReportsApi/GetPatientConsumptionRpt",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      }
    );
    console.log("respo", response);

    if (!response.ok) {
      setLoading(false)
      throw new Error("Failed to fetch report");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    setLoading(false)
    return { url, blob };
  }

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const postData1 = {
        IndentType: values.IndentType ? values.IndentType : "",
        IndentOwner: values.IndentOwner ? values.IndentOwner : "",
        IndentNumber: values.IndentNumber ? values.IndentNumber : "",
        IssueStatus: values.IssueStatus ? values.IssueStatus : "",
        FromDate: values.FromDate ? values.FromDate.format("DD-MM-YYYY") : "",
        ToDate: values.ToDate ? values.ToDate.format("DD-MM-YYYY") : "",
        IssueStore: values.IssueStore ? values.IssueStore : "",
        ReceiptStatus: values.ReceiptStatus ? values.ReceiptStatus : "",
        RequestingLocation: values.RequestingLocation
          ? values.RequestingLocation
          : "",
      };
      customAxios
        .get(
          `${urlSearchItemReceipt}?IndentType=${postData1.IndentType}&IndentOwner=${postData1.IndentOwner}&IndentNumber=${postData1.IndentNumber}&IssueStatus=${postData1.IssueStatus}&FromDateString=${postData1.FromDate}&ToDateString=${postData1.ToDate}&IssuingStoreId=${postData1.IssueStore}&ReceiptStatus=${postData1.ReceiptStatus}&RequestingStoreId=${postData1.RequestingLocation}`,
          null,
          {
            params: postData1,
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          debugger;
          const newColumnData = response.data.data.IndentReceiptList.filter(
            (obj) => obj.IssueStatus === "Finalize"
          ).map((obj, index) => {
            return { ...obj, key: index + 1 };
          });
          setFilteredData(newColumnData);

          setLoading(false);
        });
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
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
              Item Receipt
            </Title>
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
              IndentType: 0,
              ReceiptStatus: 0,
              IssueStatus: 0,
            }}
            onFinish={onFinish}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row" span={6}>
                <Form.Item label="Indent Type" name="IndentType">
                  <Select>
                    <Select.Option key={0} value={0}>
                      All
                    </Select.Option>
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
                      key="Reorder Level Based"
                      value="Reorder Level Based"
                    ></Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="IndentNumber" label="Indent Number">
                  <Input style={{ width: "100%" }} allowClear />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={4}>
                <Form.Item name="FromDate" label="From Date">
                  <DatePicker
                    value={fromDate}
                    onChange={(date) => setFromDate(date)}
                    disabledDate={disableFromDate}
                    style={{ width: "100%" }}
                    format="DD-MM-YYYY"
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={4}>
                <Form.Item name="ToDate" label="To Date">
                  <DatePicker
                    value={toDate}
                    onChange={(date) => setToDate(date)}
                    disabledDate={disableToDate}
                    style={{ width: "100%" }}
                    format="DD-MM-YYYY"
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={4}>
                <Form.Item name="IssueStore" label="Issue Store">
                  <Select allowClear placeholder="Select Value">
                    {Dropdown.StoreDetails.map((Option) => (
                      <Select.Option
                        key={Option.StoreId}
                        value={Option.StoreId}
                      >
                        {Option.LongName}
                      </Select.Option>
                    ))}
                    ;
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item
                  name="RequestingLocation"
                  label="Requesting Location"
                >
                  <Select allowClear placeholder="Select Value">
                    {Dropdown.StoreDetails.map((Option) => (
                      <Select.Option
                        key={Option.StoreId}
                        value={Option.StoreId}
                      >
                        {Option.LongName}
                      </Select.Option>
                    ))}
                    ;
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="IndentOwner" label="Indent Owner">
                  <Input style={{ width: "100%" }} allowClear />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={4}>
                <Form.Item name="IssueStatus" label="Issue Status">
                  <Select>
                    <Select.Option key={0} value={0}>
                      All
                    </Select.Option>
                    <Select.Option key="Draft" value="Draft"></Select.Option>
                    <Select.Option
                      key="Completed"
                      value="Completed"
                    ></Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={4}>
                <Form.Item name="ReceiptStatus" label="Receipt Status">
                  <Select>
                    <Select.Option key={0} value={0}>
                      All
                    </Select.Option>
                    <Select.Option key="Draft" value="Draft"></Select.Option>
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
                    loading={loading}
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
          <CustomTable
            dataSource={filteredData}
            columns={columns}
            isFilter={true}
            actionColumn={false}
            loading={loading}
          />
        </Card>
      </div>
      <div>
        {error && <div>Error: {error}</div>}

        <Modal
          title="Report"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              Close
            </Button>,
          ]}
          width={"60rem"} // You can adjust the width as needed
        >
          {reportUrl && (
            <iframe
              src={reportUrl}
              style={{ width: "100%", height: "500px", border: "none" }}
              title="Report"
            />
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default ItemReceipt;
