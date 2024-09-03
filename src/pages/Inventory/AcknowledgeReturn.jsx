import React, { useState, useEffect } from "react";
import Layout from "antd/es/layout/layout";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import CustomTable from "../../components/customTable/index.jsx";
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
  urlSearchAcknowledgeReturn,
} from "../../../endpoints.js";
import customAxios from "../../components/customAxios/customAxios";
//import { format } from 'prettier';
//import { useLocation } from 'react-router-dom';

const AcknowledageReturn = () => {
  const [Dropdown, setDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    DateFormat: [],
  });

  const [filteredData, setFilteredData] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [form] = Form.useForm();
  const { Title } = Typography;
  const navigate = useNavigate();
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

  const colorMapping = {
    Created: "#4E31AA",
    Draft: "#6EACDA",
    Pending: "#F5004F",
    "Partially Pending": "#8E3E63",
    Finalize: "#52c41a",
    Completed: "#FF9100",
  };

  const GetModelDetails = (record) => {
    debugger;
    navigate("/CreateAcknowledageReturn", { state: { record } });
  };

  const columns = [
    {
      title: "Returned ID",
      dataIndex: "ReturnNumber",
      key: "ReturnNumber",
      sorter: (a, b) => a.ReturnNumber - b.ReturnNumber,
      sortDirections: ["descend", "ascend"],
      render: (text, record, index) => {
        if (record.AcknowlegeStatus !== "Finalize") {
          return (
            <Button type="link" onClick={() => GetModelDetails(record)}>
              {text}
            </Button>
          );
        }
        return <Tag style={{ marginLeft: "15px" }}>{text}</Tag>;
      },
    },
    {
      title: "Returned Date",
      dataIndex: "ReturnDate",
      key: "ReturnDate",
      sorter: (a, b) => a.ReturnDate.localeCompare(b.ReturnDate),
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
      title: "Acknowledge Date",
      dataIndex: "AcknowledgeDate",
      key: "AcknowledgeDate",
      render: (text) => {
        // Check if the date is null or undefined
        if (!text) {
          return "-"; // Return a placeholder or empty string for null values
        }

        // Split and format the date if it exists
        const dateParts = text.split("T")[0].split("-");
        const year = dateParts[0];
        const month = dateParts[1];
        const day = dateParts[2];

        return `${day}-${month}-${year}`;
      },
    },

    {
      title: "Returned Store",
      dataIndex: "ReturnStoreName",
      key: "ReturnStoreName",
    },
    {
      title: "Acknowledging Store",
      dataIndex: "StoreName",
      key: "StoreName",
    },
    {
      title: "Return Status",
      dataIndex: "ReturnStatus",
      key: "ReturnStatus",
      sorter: (a, b) => a.ReturnStatus.localeCompare(b.ReturnStatus),
      sortDirections: ["descend", "ascend"],
      render: (text) => {
        return (
          <Tag color={colorMapping[`${text}`]} key={text}>
            {text?.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Acknowledge Status",
      dataIndex: "AcknowlegeStatus",
      key: "AcknowlegeStatus",
      render: (text) => {
        return (
          <Tag color={colorMapping[`${text}`]} key={text}>
            {text?.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Report",
      dataIndex: "Report",
      key: "Report",
      render: (record) => {
        return <Button type="link">Report</Button>;
      },
    },
  ];
  const onFinish = async (values) => {
    debugger;

    try {
      const postData1 = {
        ReturnID: values.ReturnID ? values.ReturnID : "",
        ReturnedStore: values.ReturnedStore ? values.ReturnedStore : 0,
        AcknowledgingStore: values.AcknowledgingStore
          ? values.AcknowledgingStore
          : 0,
        AcknowledgeStatus: values.AcknowledgeStatus
          ? values.AcknowledgeStatus
          : "",
        ReturnStatus: values.ReturnStatus ? values.ReturnStatus : "",
        FromDateString: values.FromDate
          ? values.FromDate.format("DD-MM-YYYY")
          : null,
        ToDateString: values.ToDate ? values.ToDate.format("DD-MM-YYYY") : null,
      };
      customAxios
        .get(
          `${urlSearchAcknowledgeReturn}?ReturnID=${postData1.ReturnID}&ReturnedStore=${postData1.ReturnedStore}&AcknowledgingStore=${postData1.AcknowledgingStore}&AcknowledgeStatus=${postData1.AcknowledgeStatus}&ReturnStatus=${postData1.ReturnStatus}&FromDateString=${postData1.FromDateString}&ToDateString=${postData1.ToDateString}`,
          null,
          {
            params: postData1,
            headers: {
              "Content-Type": "application/json", // Replace with the appropriate content type if needed
            },
          }
        )
        .then((response) => {
          debugger;
          setFilteredData(response.data.data.AcknowledgeReturnDetails);
        });
    } catch (error) {
      // Handle any errors here
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
              Acknowledge Return
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
              AcknowledageStatus: 0,
            }}
            onFinish={onFinish}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row" span={8}>
                <Form.Item label="Return ID" name="ReturnID">
                  <Input style={{ width: "100%" }} allowClear />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={4}>
                <Form.Item name="FromDate" label="From Date">
                  <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={4}>
                <Form.Item name="ToDate" label="To Date">
                  <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={8}>
                <Form.Item name="ReturnedStore" label="Returned Store">
                  <Select allowClear placeholder="Select Value">
                    {Dropdown.StoreDetails.map((option) => (
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
              <Col className="gutter-row" span={8}>
                <Form.Item
                  name="AcknowledgingStore"
                  label="Acknowledaging Store"
                >
                  <Select allowClear placeholder="Select Value">
                    {Dropdown.StoreDetails.map((option) => (
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
              <Col className="gutter-row" span={8}>
                <Form.Item label="Acknowledage Status" name="AcknowledgeStatus">
                  <Select>
                    <Select.Option key={0} value={0}>
                      All
                    </Select.Option>
                    <Select.Option
                      key="Created"
                      value="Created"
                    ></Select.Option>
                    <Select.Option key="Draft" value="Draft"></Select.Option>
                    <Select.Option
                      key="Finalize"
                      value="Finalize"
                    ></Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={8}>
                <Form.Item label="Returning Status" name="ReturnStatus">
                  <Select>
                    <Select.Option key={0} value={0}>
                      All
                    </Select.Option>
                    <Select.Option
                      key="Created"
                      value="Created"
                    ></Select.Option>
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
                  <Button
                    type="primary"
                    loading={isSearchLoading}
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
              isFilter={true}
              actionColumn={false}
              bordered
            />
          </Spin>
          {/* <Table
            display={setIsTable}
            dataSource={filteredData}
            columns={columns}
            pagination={{
              onChange: (current, pageSize) => {
                setPage(current);
                setPaginationSize(pageSize);
              },
              defaultPageSize: 5,
              hideOnSinglePage: true,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `Showing ${range[0]} to ${range[1]} of ${total} entries`,
            }}
            rowKey={(row) => row.AppUserId}
            size="small"
            bordered
          /> */}
        </Card>
      </div>
    </Layout>
  );
};

export default AcknowledageReturn;
