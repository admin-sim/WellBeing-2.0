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
import CustomTable from "../../components/customTable/index.jsx";
import { urlGetPurshaseOrderDetails, urlSearchStoreConsumption } from "../../../endpoints.js";
import customAxios from "../../components/customAxios/customAxios";
import { render } from "react-dom";
//import { format } from 'prettier';
//import { useLocation } from 'react-router-dom';

const StoreConsumption = () => {
  const [Dropdown, setDropDown] = useState({
    DocumentType: [],
    StoreDetails: [],
    SupplierList: [],
    DateFormat: [],
  });

  const [paginationSize, setPaginationSize] = useState(5);
  const [filteredData, setFilteredData] = useState([]);
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
    form.submit()
  }, []);

  const navigate = useNavigate();
  const handleAddTemplate = (StoreConsupmtionId) => {
    navigate("/CreateStoreConsumption", { state: { StoreConsupmtionId } });
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
      dataIndex: 'key',
    },
    {
      title: "Consumption Number",
      dataIndex: "IssueNumber",
      key: "IssueNumber",
      sorter: (a, b) => a.IssueNumber - b.IssueNumber,
      sortDirections: ["descend", "ascend"],
      render: (text, record) => {
        if (record.IssueStatus == "Finalize") {
          return <Tag style={{ marginLeft: '15px' }}>{text}</Tag>;
        }
        return <Button type='link' onClick={() => handleAddTemplate(record.IssueId)}>{text}</Button>
      }
    },
    {
      title: "Consumption Date",
      dataIndex: "IssueDate",
      key: "IssueDate",
      sorter: (a, b) => a.IssueDate.localeCompare(b.IssueDate),
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
      title: "Issuing Store",
      dataIndex: "IssueStoreName",
      key: "IssueStoreName",
      sorter: (a, b) => new Date(a.IssueStoreName) - new Date(b.IssueStoreName),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Consumption Status",
      dataIndex: "IssueStatus",
      key: "IssueStatus",
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


  const onFinish = async (values) => {
    setIsSearchLoading(true);
    setLoading(true);
    try {
      const postData1 = {
        IssuingStore: values.IssuingStore ? values.IssuingStore : 0,
        IssueStatus: values.IssueStatus === 0 ? null : values.IssueStatus,
        FromDateString: values.FromDate ? values.FromDate.format("DD-MM-YYYY") : "",
        ToDateString: values.ToDate ? values.ToDate.format("DD-MM-YYYY") : "",
      };
      customAxios
        .get(
          `${urlSearchStoreConsumption}?IssuingStoreId=${postData1.IssuingStore}&FromDateString=${postData1.FromDateString}&ToDateString=${postData1.ToDateString}&IssueStatus=${postData1.IssueStatus}`,
          null,
          {
            params: postData1,
            headers: {
              "Content-Type": "application/json", // Replace with the appropriate content type if needed
            },
          }
        )
        .then((response) => {
          const ApiData = response.data.data.newIndentIssueModel.map((item, index) => {
            return {
              ...item,
              key: index + 1
            }
          })
          setFilteredData(ApiData);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      // Handle any errors here
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
              Store Consumption
            </Title>
          </Col>
          <Col offset={4} span={2}>
            <Button icon={<PlusCircleOutlined />} style={{ marginRight: 0 }} onClick={() => handleAddTemplate(0)}>
              Add Store Consumption
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
              IssueStatus: 0
            }}
            onFinish={onFinish}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row" span={6}>
                <Form.Item label="From Date" name="FromDate">
                  <DatePicker style={{ width: '100%' }} format='DD-MM-YYYY' />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="ToDate" label="To Date">
                  <DatePicker style={{ width: '100%' }} format='DD-MM-YYYY' />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="IssuingStore" label="Issuing Store">
                  <Select allowClear placeholder='Select Value'>
                    {Dropdown.StoreDetails.map((Option) => (
                      <Select.Option key={Option.StoreId} value={Option.StoreId}>{Option.LongName}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <Form.Item name="IssueStatus" label="Issue Status">
                  <Select>
                    <Select.Option key={0} value={0}>All</Select.Option>
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
              isFilter={true}
              size="small"
              bordered
            />
          </Spin>
        </Card>
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
      </div>
    </Layout>
  );
};

export default StoreConsumption;
