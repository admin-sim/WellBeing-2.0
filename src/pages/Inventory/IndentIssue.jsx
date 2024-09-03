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
  urlSearchIndentIssue,
} from "../../../endpoints.js";
import customAxios from "../../components/customAxios/customAxios";
import CustomTable from "../../components/customTable/index.jsx";
//import { format } from 'prettier';
//import { useLocation } from 'react-router-dom';

const IndentIssue = () => {
  const [IndentIssueDropdown, setIndentIssueDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    DateFormat: [],
  });

  const [filteredData, setFilteredData] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { Title } = Typography;
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState(dayjs().subtract(1, "day"));
  const [toDate, setToDate] = useState(dayjs());
  const [dropDownLoad, setDropDownLoading] = useState(true);

  useEffect(() => {
    try {
      customAxios.get(urlGetPurshaseOrderDetails, {}).then((response) => {
        const apiData = response.data.data;
        setIndentIssueDropDown(apiData);
      });
    } catch (error) {
      console.error("Error fetching purchase order details:", error);
    }
    form.submit();
    setDropDownLoading(false)
  }, []);

  const colorMapping = {
    Created: "#4E31AA",
    Draft: "#6EACDA",
    Pending: "#F5004F",
    "Partially Pending": "#8E3E63",
    Finalize: "#52c41a",
    Completed: "#FF9100",
  };

  const GetIndentById = (record) => {
    const IndentId = record.IndentId;
    if (record.Exists == "Exists") {
      alert(
        "Indent Issue with same Indent Number already exists!!Please finalize previous Indent Issue."
      );
    } else {
      navigate("/UpdateIndentIssue", { state: { IndentId } });
    }
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
      width: 80,
    },
    {
      title: "Issue Number",
      dataIndex: "IssueNumber",
      key: "IssueNumber",
      sorter: (a, b) => a.IssueNumber - b.IssueNumber,
      sortDirections: ["descend", "ascend"],
      width: 100
    },
    {
      title: "Indent Type",
      dataIndex: "IndentType",
      key: "IndentType",
      width: 80,
      sorter: (a, b) => a.IndentType.localeCompare(b.IndentType),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Indent Number",
      dataIndex: "IndentNumber",
      key: "IndentNumber",
      width: 100,
      sorter: (a, b) => new Date(a.IndentNumber) - new Date(b.IndentNumber),
      sortDirections: ["descend", "ascend"],
      render: (text, record, index) => {
        if (record.IssueStatus !== "Finalize") {
          return (
            <Button type="link" onClick={() => GetIndentById(record)}>
              {text}
            </Button>
          );
        }
        return <Tag style={{ marginLeft: "15px" }}>{text}</Tag>;
      },
    },
    {
      title: "Indent Date",
      dataIndex: "IndentDatestring",
      key: "IndentDatestring",
      width: 100,
      sorter: (a, b) => a.IndentDatestring.localeCompare(b.IndentDatestring),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Issue Date",
      dataIndex: "IssueDateString",
      key: "IssueDateString",
      width: 100,
      sorter: (a, b) => a.IssueDatestring.localeCompare(b.IssueDatestring),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Issueing Store",
      dataIndex: "IssueStoreName",
      key: "IssueStoreName",
      width: 150,
      sorter: (a, b) => a.IssueStoreName.localeCompare(b.IssueStoreName),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Requesting Location",
      dataIndex: "StoreName",
      key: "StoreName",
      width: 150,
      sorter: (a, b) => a.StoreName.localeCompare(b.StoreName),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Document Owner",
      dataIndex: "DocumentOwner",
      key: "DocumentOwner",
      width: 80,
      sorter: (a, b) => a.DocumentOwner.localeCompare(b.DocumentOwner),
      sortDirections: ["descend", "ascend"],
      render: (text) => {
        return (
          <Tag color={colorMapping[`${text}`]} key={text}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Indent Status",
      dataIndex: "IndentStatus",
      key: "IndentStatus",
      width: 80,
      sorter: (a, b) => a.IndentStatus.localeCompare(b.IndentStatus),
      sortDirections: ["descend", "ascend"],
      render: (text) => {
        return (
          <Tag color={colorMapping[`${text}`]} key={text}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Issue Status",
      dataIndex: "IssueStatus",
      key: "IssueStatus",
      width: 80,
      sorter: (a, b) => a.IssueStatus.localeCompare(b.IssueStatus),
      sortDirections: ["descend", "ascend"],
      render: (text) => {
        return (
          <Tag color={colorMapping[`${text}`]} key={text}>
            {text}
          </Tag>
        );
      },
    },
    {
      width: 80,
      render: (_, row) => <Button type="link">Report</Button>,
    },
  ];

  const onFinish = async (values) => {
    debugger;

    setLoading(true);
    try {
      const postData1 = {
        IndentNumber: values.IndentNumber ? values.IndentNumber : "",
        IndentType: values.IndentType ? values.IndentType : "",
        RequestingStoreId: values.RequestingStore ? values.RequestingStore : "",
        IssuingStoreId: values.IssuingStore ? values.IssuingStore : "",
        FromDate: values.FromDate ? values.FromDate.format("DD-MM-YYYY") : "",
        ToDate: values.ToDate ? values.ToDate.format("DD-MM-YYYY") : "",
        IndentStatus: values.IndentStatus ? values.IndentStatus : "",
        IndentOwner: values.IndentOwner ? values.IndentOwner : "",
        IssueStatus: values.IndentStatus ? values.IndentStatus : "",
      };
      customAxios
        .get(
          `${urlSearchIndentIssue}?IndentNumber=${postData1.IndentNumber}&IndentType=${postData1.IndentType}&RequestingStoreId=${postData1.RequestingStoreId}&IssuingStoreId=${postData1.IssuingStoreId}&FromDateString=${postData1.FromDate}&ToDateString=${postData1.ToDate}&IndentStatus=${postData1.IndentStatus}&IndentOwner=${postData1.IndentOwner}&IssueStatus=${postData1.IssueStatus}`,
          null,
          {
            params: postData1,
            headers: {
              "Content-Type": "application/json", // Replace with the appropriate content type if needed
            },
          }
        )
        .then((response) => {
          const newColumnData = response.data.data.newIndentIssueModel.map((obj, index) => {
            return { ...obj, key: index + 1 };
          });
          setFilteredData(newColumnData);
          setLoading(false);
        })
    } catch (error) {
      // Handle any errors here
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
              Indent Issue
            </Title>
          </Col>
        </Row>
        <Card>
          <Form
            form={form}
            name="control-hooks"
            layout="vertical"
            variant="outlined"

            initialValues={{
              FromDate: dayjs().subtract(1, "day"),
              ToDate: dayjs(),
              IndentStatus: 0,
              IndentType: 0,
              IssueStatus: 0,
            }}
            onFinish={onFinish}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row" span={6}>
                <Form.Item label="Indent Type" name="IndentType">
                  <Select loading={dropDownLoad}>
                    <Select.Option key={0} value={0}>
                      All
                    </Select.Option>
                    {IndentIssueDropdown.DocumentType.map((option) => (
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
                <Form.Item name="IndentNumber" label="Indent Number">
                  <Input style={{ width: "100%" }} />
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
                <Form.Item label="Issuing Store" name="IssuingStore">
                  <Select allowClear placeholder="Select Value" loading={dropDownLoad}>
                    {IndentIssueDropdown.StoreDetails.map((option) => (
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
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row" span={6}>
                <Form.Item name="RequestingStore" label="Requesting Store">
                  <Select allowClear placeholder="Select Value" loading={dropDownLoad}>
                    {IndentIssueDropdown.StoreDetails.map((option) => (
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
                <Form.Item label="Indent Owner" name="IndentOwner">
                  <Input style={{ width: "100%" }}></Input>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={4}>
                <Form.Item label="Indent Status" name="IndentStatus">
                  <Select loading={dropDownLoad}> 
                    <Select.Option key={0} value={0}>
                      All
                    </Select.Option>
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
              <Col className="gutter-row" span={4}>
                <Form.Item label="Issue Status" name="IssueStatus">
                  <Select loading={dropDownLoad}>
                    <Select.Option key={0} value={0}>
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
          <Spin spinning={loading}>
            <CustomTable dataSource={filteredData} isFilter={true} actionColumn={false} columns={columns} />
          </Spin>
        </Card>
      </div>
    </Layout>
  );
};

export default IndentIssue;
