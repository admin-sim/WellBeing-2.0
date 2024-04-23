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

import { urlGetPurshaseOrderDetails, urlSearchOpeningStock } from "../../../endpoints.js";
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
  const [paginationSize, setPaginationSize] = useState(5);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isTable, setIsTable] = useState(false);
  const { Title } = Typography;
  useEffect(() => {
    try {
      customAxios.get(urlGetPurshaseOrderDetails, {}).then((response) => {
        const apiData = response.data.data;
        setDropDown(apiData);
      });
    } catch (error) {
      console.error("Error fetching purchase order details:", error);
    }
  }, []);

  const navigate = useNavigate();
  const handleAddTemplate = () => {
    navigate(`/CreateOpeningStock`);
  };

  const colorMapping = {
    Created: "blue",
    Draft: "geekblue",
    Pending: "volcano",
    "Partially Pending": "orange",
    Completed: "green",
  };

  const columns = [
    {
      title: "Sl No",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Opening Stock ID",
      dataIndex: "GRNNumber",
      key: "GRNNumber",
      sorter: (a, b) => a.GRNNumber - b.GRNNumber,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Stock Recieved Date",
      dataIndex: "GRNDate",
      key: "GRNDate",
      sorter: (a, b) => a.GRNDate.localeCompare(b.GRNDate),
      sortDirections: ["descend", "ascend"],
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
    },    
    {
      render: (_, row) => (
        <Button type="link">Report</Button>
      ),
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

  const handleSubmit = (values) => {
    // Handle form submission logic here
    console.log("Form submitted with values:", values);

    console.log("Form Values:", values);
    //const uhid = selectedUhId ? selectedUhId.UhId : '';

    // ... Repeat for other parameters
  };
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
    try {
      const postData1 = {
        ReceivingStore: values.ReceivingStore === undefined ? 0 : values.ReceivingStore,
        Status: values.Status === 0 ? null : values.Status,        
        FromDate: values.FromDate,
        ToDate: values.ToDate,        
      };
      customAxios
        .get(
          `${urlSearchOpeningStock}?ReceivingStore=${postData1.ReceivingStore}&Status=${postData1.Status}&FromDate=${postData1.FromDate}&ToDate=${postData1.ToDate}`,
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
          setFilteredData(response.data.data.GRNAgainstPODetails);
        })
    } catch (error) {
      console.error("Error:", error);
    }
    setIsSearchLoading(false);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Layout style={{ zIndex: '999999999' }}>
      <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
        <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
          <Col span={16}>
            <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
              Opening Stock
            </Title>
          </Col>
          <Col offset={5} span={2}>
            <Button icon={<PlusCircleOutlined />} style={{ marginRight: 0 }} onClick={handleAddTemplate}>
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
            size="Default"
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
                  <Select allowClear placeholder='Select Value'>
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
        </Card>
        <Table display={setIsTable}
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
      </div>
    </Layout>
  );
};

export default OpeningStock;
