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
} from "antd";
//import { CloseSquareFilled } from '@ant-design/icons';
import { useNavigate } from "react-router";

import {
  urlGetPurshaseOrderDetails,
  urlUrgentIssueSearchIndent,
} from "../../../endpoints.js";
import customAxios from "../../components/customAxios/customAxios";
import CustomTable from "../../components/customTable/index.jsx";
import { render } from "react-dom";
//import { useLocation } from 'react-router-dom';

const UrgentIssue = () => {
  const [UrgentIssueDropdown, setUrgentIssueDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    DateFormat: [],
  });

  const [filteredData, setFilteredData] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { Title } = Typography;
  const [fromDate, setFromDate] = useState(dayjs().subtract(1, "day"));
  const [toDate, setToDate] = useState(dayjs());

  useEffect(() => {
    try {
      customAxios.get(urlGetPurshaseOrderDetails, {}).then((response) => {
        const apiData = response.data.data;
        setUrgentIssueDropDown(apiData);
      });
    } catch (error) {
      console.error("Error fetching purchase order details:", error);
    }
    form.submit();
  }, []);

  const navigate = useNavigate();
  const handleAddTemplate = (IssueId) => {
    navigate("/CreateUrgentIssue", { state: { IssueId } });
  };

  const colorMapping = {
    Created: "blue",
    Draft: "geekblue",
    Pending: "volcano",
    "Partially Pending": "orange",
    Completed: "green",
    Finalize: "#52c41a",
  };

  const columns = [
    {
      title: "Sl No",
      key: "key",
      dataIndex: "key",
    },
    {
      title: "Issue Id",
      dataIndex: "IssueNumber",
      key: "IssueNumber",
      sorter: (a, b) => a.IssueNumber - b.IssueNumber,
      sortDirections: ["descend", "ascend"],
      render: (text, record, index) => {
        if (
          record.IssueStatus === "Created" ||
          record.IssueStatus === "Draft"
        ) {
          return (
            <Button
              type="link"
              onClick={() => handleAddTemplate(record.IssueId)}
            >
              {text}
            </Button>
          );
        }
        return <Tag style={{ marginLeft: "15px" }}>{text}</Tag>;
      },
    },
    {
      title: "Issue Date",
      dataIndex: "IssueDate",
      key: "IssueDate",
      sorter: (a, b) => a.IssueDate.localeCompare(b.IssueDate),
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
      title: "Issuing Store",
      dataIndex: "IssueStoreName",
      key: "IssueStoreName",
      sorter: (a, b) => new Date(a.IssueStoreName) - new Date(b.IssueStoreName),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Issue Status",
      dataIndex: "IssueStatus",
      key: "IssueStatus",
      sorter: (a, b) => a.IssueStatus.localeCompare(b.IssueStatus),
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
    setLoading(true);
    try {
      const postData1 = {
        IssueStatus: values.IssueStatus ? values.IssueStatus : null,
        IssuingStoreId: values.IssuingStore ? values.IssuingStore : 0,
        RequestingStoreId: values.RequestingStore ? values.RequestingStore : 0,
        FromDateString: values.FromDate
          ? values.FromDate.format("DD-MM-YYYY")
          : "",
        ToDateString: values.ToDate ? values.ToDate.format("DD-MM-YYYY") : "",
      };
      customAxios
        .get(
          `${urlUrgentIssueSearchIndent}?IssueStatus=${postData1.IssueStatus}&IssuingStoreId=${postData1.IssuingStoreId}&RequestingStoreId=${postData1.RequestingStoreId}&FromDateString=${postData1.FromDateString}&ToDateString=${postData1.ToDateString}`,
          null,
          {
            params: postData1,
            headers: {
              "Content-Type": "application/json", // Replace with the appropriate content type if needed
            },
          }
        )
        .then((response) => {
          const newColumnData = response.data.data.newIndentIssueModel.map(
            (obj, index) => {
              return { ...obj, key: index + 1 };
            }
          );
          setFilteredData(newColumnData);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      // Handle any errors here
      console.error("Error:", error);
    }
    // setIsSearchLoading(false);
  };

  const onReset = () => {
    form.resetFields();
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
              Urgent Issue
            </Title>
          </Col>
          <Col offset={5} span={2}>
            <Button
              icon={<PlusCircleOutlined />}
              style={{ marginRight: 0 }}
              onClick={() => handleAddTemplate(0)}
            >
              Add Urgent Issue
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
              IssueStatus: "",
            }}
            onFinish={onFinish}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row" span={6}>
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
              <Col className="gutter-row" span={6}>
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
              <Col className="gutter-row" span={6}>
                <Form.Item label="Issuing Store" name="IssuingStore">
                  <Select placeholder="Select Value">
                    {UrgentIssueDropdown.StoreDetails.map((option) => (
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
                  name="RequestingStore"
                  label="Requesting Location"
                  rules={[{ required: false }]}
                >
                  <Select placeholder="Select Value">
                    {UrgentIssueDropdown.StoreDetails.map((option) => (
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
                <Form.Item label="Issue Status" name="IssueStatus">
                  <Select>
                    <Select.Option key="" value="">
                      All
                    </Select.Option>
                    <Select.Option key="Draft" value="Draft"></Select.Option>
                    <Select.Option
                      key="Finalize"
                      value="Finalize"
                    ></Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end">
              <Col>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
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
        </Card>
        <Spin spinning={loading}>
          <CustomTable
            dataSource={filteredData}
            columns={columns}
            isFilter={true}
            size="small"
            bordered
          />
        </Spin>
      </div>
    </Layout>
  );
};

export default UrgentIssue;
