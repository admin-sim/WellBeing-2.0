import React, { useState, useEffect } from "react";
import Layout from 'antd/es/layout/layout';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
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

import { urlGetPurshaseOrderDetails, urlSearchStock } from "../../../endpoints.js";
import customAxios from "../../components/customAxios/customAxios";
//import { format } from 'prettier';
//import { useLocation } from 'react-router-dom';

const OpeningStock = () => {
  const [Dropdown, setDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    DateFormat: []
  });
  const [filteredData, setFilteredData] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { Title } = Typography;
  const [dropDownLoad, setDropDownLoading] = useState(true);

  useEffect(() => {
    try {
      customAxios.get(urlGetPurshaseOrderDetails, {}).then((response) => {
        const apiData = response.data.data;
        setDropDown(apiData);
      });
    } catch (error) {
      console.error("Error fetching purchase order details:", error);
    }
    setDropDownLoading(false)
    form.submit()
  }, []);

  const navigate = useNavigate();
  const handleAddTemplate = (GRNHeaderId) => {
    navigate("/CreateOpeningStock", { state: { GRNHeaderId } });
  };

  const colorMapping = {
    Created: "#4E31AA",
    Draft: "#6EACDA",
    Pending: "#F5004F",
    "Partially Pending": "#8E3E63",
    Finalize: "#52c41a",
    Completed: "#FF9100",
  };

  const columns = [
    {
      title: "Sl No",
      key: "key",
      dataIndex: 'key'
    },
    {
      title: "Opening Stock ID",
      dataIndex: "GRNNumber",
      key: "GRNNumber",
      sorter: (a, b) => a.GRNNumber - b.GRNNumber,
      sortDirections: ["descend", "ascend"],
      render: (text, record, index) => {
        if (record.GRNStatus === "Created" || record.GRNStatus === "Draft") {
          return (
            <Button type="link" onClick={() => handleAddTemplate(record.GRNHeaderId)}>
              {text}
            </Button>
          );
        }
        return <Tag style={{ marginLeft: "15px" }}>{text}</Tag>;
      },
    },
    {
      title: "Stock Recieved Date",
      dataIndex: "GRNDate",
      key: "GRNDate",
      sorter: (a, b) => a.GRNDate.localeCompare(b.GRNDate),
      sortDirections: ["descend", "ascend"],
      render: (text) => {
        const dateParts = text.split('T')[0].split('-');
        const year = dateParts[0];
        const month = dateParts[1];
        const day = dateParts[2];

        return `${day}-${month}-${year}`;
      },
    },
    {
      title: "Recieved Store",
      dataIndex: "StoreName",
      key: "StoreName",
      sorter: (a, b) => new Date(a.StoreName) - new Date(b.StoreName),
      sortDirections: ["descend", "ascend"],
      render: (text) => {
        return text;
      },
    },
    {
      title: "Status",
      dataIndex: "GRNStatus",
      key: "GRNStatus",
      sorter: (a, b) => a.GRNStatus.localeCompare(b.GRNStatus),
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
      render: (_, row) => (
        <Button type="link">Report</Button>
      ),
    },
  ];

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const postData1 = {
        ReceivingStore: values.ReceivingStore ? values.ReceivingStore : 0,
        Status: values.Status === 0 ? null : values.Status,
        FromDate: values.FromDate ? values.FromDate.format("DD-MM-YYYY") : '',
        ToDate: values.ToDate ? values.ToDate.format("DD-MM-YYYY") : '',
      };
      customAxios
        .get(
          `${urlSearchStock}?ReceivingStore=${postData1.ReceivingStore}&Status=${postData1.Status}&FromDateString=${postData1.FromDate}&ToDateString=${postData1.ToDate}`,
          null,
          {
            params: postData1,
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          const ApiData = response.data.data.GRNAgainstPODetails.map((item, index) => {
            return {
              ...item,
              key: index + 1
            }
          })
          setFilteredData(ApiData);
        })
    } catch (error) {
      console.error("Error:", error);
    }
    setIsSearchLoading(false);
    setLoading(false);
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
              Opening Stock
            </Title>
          </Col>
          <Col offset={5} span={2}>
            <Button
              icon={<PlusCircleOutlined />}
              style={{ marginRight: 0 }}
              onClick={() => handleAddTemplate(0)}
            >
              Add Opening Stock
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
              FromDate: dayjs().subtract(1, 'day'),
              ToDate: dayjs(),
              Status: 0,
            }}
            onFinish={onFinish}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row" span={6}>
                <Form.Item label="Receiving Store" name="ReceivingStore">
                  <Select allowClear placeholder='Select Value' loading={dropDownLoad}>
                    {Dropdown.StoreDetails.map((option) => (
                      <Select.Option key={option.StoreId} value={option.StoreId}>
                        {option.LongName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="FromDate" label="Form Date">
                  <DatePicker style={{ width: '100%' }} format='DD-MM-YYYY' />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="ToDate" label="To Date">
                  <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="Status" label="Status">
                  <Select>
                    <Select.Option key={0} value={0}>All</Select.Option>
                    <Select.Option key='Created' value='Created'></Select.Option>
                    <Select.Option key='Draft' value='Draft'></Select.Option>
                    <Select.Option key='Finalize' value='Finalize'></Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end">
              <Col>
                <Form.Item>
                  <Button type="primary" loading={isSearchLoading} htmlType="submit">
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
          {/* <Table display={setIsTable}
          dataSource={filteredData}
          columns={columns}
          pagination={{
            onChange: (current, pageSize) => {
              setPage(current);
              setPaginationSize(pageSize);
            },
            defaultPageSize: 5, // Set your default pagination size
            hideOnSinglePage: true,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `Showing ${range[0]} to ${range[1]} of ${total} entries`,
          }}
          rowKey={(row) => row.AppUserId} // Specify the custom id property here
          size="small"
          bordered
        /> */}
        </Card>
      </div>
    </Layout>
  );
};

export default OpeningStock;
