import React, { useState, useEffect } from "react";
import Layout from 'antd/es/layout/layout';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
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

import { urlGetPurshaseOrderDetails, urlStockExpiryBasedOnExpiryCondition } from "../../../endpoints.js";
import customAxios from "../../components/customAxios/customAxios";
//import { format } from 'prettier';
//import { useLocation } from 'react-router-dom';

const StockExpiry = () => {
  const [StockExpiryDropdown, setStockExpiryDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    DateFormat: []
  });
  const [paginationSize, setPaginationSize] = useState(5);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const { Title } = Typography;

  useEffect(() => {
    try {
      customAxios.get(urlGetPurshaseOrderDetails, {}).then((response) => {
        const apiData = response.data.data;
        setStockExpiryDropDown(apiData);
        setIsLoading(false);
      });
    } catch (error) {
      console.error("Error fetching purchase order details:", error);
    }
  }, []);

  const colorMapping = {
    Created: "blue",
    Draft: "geekblue",
    Pending: "volcano",
    "Partially Pending": "orange",
    Completed: "green",
  };

  const GetModelDetails = (text, record, index) => {
    debugger;
    console.log("welcome");
  };
  const columns = [
    {
      title: "Sl No",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Product Name",
      dataIndex: "ProductName",
      key: "ProductName",
      sorter: (a, b) => a.ProductName - b.ProductName,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Batch Number",
      dataIndex: "BatchNo",
      key: "BatchNo",
      sorter: (a, b) => a.BatchNo.localeCompare(b.BatchNo),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Expiry Date",
      dataIndex: "EXPDate",
      key: "EXPDate",
      sorter: (a, b) => new Date(a.EXPDate) - new Date(b.EXPDate),
      sortDirections: ["descend", "ascend"],
      render: (text) => {
        return text;
      },
    },
    {
      title: "Quantity",
      dataIndex: "BalanceQty",
      key: "BalanceQty",
    },
  ];

  // const handleSearch = (value) => {
  //   setSearchText(value);
  //   if (value === '') {
  //     setFilteredData(loadUsers);
  //   } else {
  //     const filtered = loadUsers.filter(entry =>
  //       Object.values(entry).some(val =>
  //         val && val.toString().toLowerCase().includes(value.toLowerCase())
  //       )
  //     );
  //     setFilteredData(filtered);
  //   }
  // };

  /* const validateUserRole = (rule, value) => {
     if (value) {
       const existsInOptions = originalOptions.some(option => option.LookupDescription === value);
       if (!existsInOptions) {
         return Promise.reject('Please select a valid UserRole from the list.');
       }
     }
     return Promise.resolve();
   };*/

  const [formatedFromDate, setFormatedFromDate] = useState();
  const [formatedToDate, setFormatedToDate] = useState();
  function formatDate(inputDate) {
    const dateParts = inputDate.split("/");
    if (dateParts.length === 3) {
      const [year, month, day] = dateParts;
      return `${day}-${month}-${year}`;
    }
    return inputDate; // Return as is if not in the expected format
  }

  const onFinish = async (values) => {
    debugger;
    const temp = values.StoreLocation
    const temp1 = parseInt(values.StockExpiryIn)
    try {
      customAxios.get(`${urlStockExpiryBasedOnExpiryCondition}?StoreLocation=${temp}&StockExpireIn=${temp1}`).then((response) => {
        debugger;
        const apiData = response.data.data;
        setFilteredData(apiData.IndentDetails)
        setShowTable(true)
      });
    } catch (error) {
      //console.error("Error fetching purchase order details:", error);        
    }
  };

  const onReset = () => {
    setShowTable(false)
    form.resetFields();
  };

  return (
    <Layout style={{ zIndex: '999999999' }}>
      <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
        <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
          <Col span={16}>
            <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
              Stock Expiry
            </Title>
          </Col>
        </Row>
        <Card>
          <Form
            form={form}
            name="control-hooks"
            layout="vertical"
            variant="outlined"
            size="Default"
            style={{
              maxWidth: 1500,
            }}
            initialValues={{
              StockExpiryIn: '0'
            }}
            onFinish={onFinish}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row" span={6}>
                <Form.Item label="Store Location" name="StoreLocation"
                  rules={[
                    {
                      required: true,
                      message: 'Please input!'
                    }
                  ]}
                >
                  <Select allowClear placeholder='Select Value'>
                    {StockExpiryDropdown.StoreDetails.map((option) => (
                      <Select.Option key={option.StoreId} value={option.StoreId}>
                        {option.LongName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="StockExpiryIn" label="Stock Expiry In">
                  <Select allowClear>
                    <Select.Option key='0' value='0'>All</Select.Option>
                    <Select.Option key='1' value='1'>Expired</Select.Option>
                    <Select.Option key='7' value='7'>Expiring in a Week</Select.Option>
                    <Select.Option key='15' value='15'>Expiring in 15 Days</Select.Option>
                    <Select.Option key='30' value='30'>Expiring in a Month</Select.Option>
                    <Select.Option key='90' value='90'>Expiring in 3 Months</Select.Option>
                    <Select.Option key='180' value='180'>Expiring in 6 Months</Select.Option>
                    <Select.Option key='365' value='365'>Expiring in a Year</Select.Option>
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
        </Card>
        {showTable && (
          <Table
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
          />
        )}
      </div>
    </Layout>
  );
};

export default StockExpiry;
