import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Input, InputNumber, Row, Select, DatePicker, Divider, notification, Table, Modal, Tooltip,Skeleton } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Layout from 'antd/es/layout/layout';
import { useNavigate } from 'react-router';
import { urlGetAllServiceGroups,urlGetServiceClassificationsForServiceGroup, urlGetServicesForSelectedServiceClassification } from '../../../../../endpoints';
import customAxios from '../../../../components/customAxios/customAxios';
import Title from 'antd/es/typography/Title';

const Service = () => {
  const [serviceGroups, setServiceGroups] = useState([]);
  const [serviceClassifications, setServiceClassifications] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceclassificationid, setServiceClassificationId] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10, // Change this value according to your pagination settings
  });


  useEffect(() => {
    const fetchData = async () => {
      debugger;
      try {
        const response = await customAxios.get(`${urlGetAllServiceGroups}`);
        if (response.status === 200) {
          const servicegroups = response.data.data.ServiceGroups; // Assuming your API response structure matches the provided data
          setServiceGroups(servicegroups);
        } else {
          console.error('Failed to fetch patient details');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleServiceGroupChange = async (value) => {
    debugger;
    if (value != null) {
      // Call your API here using the selected LookupID
      setServiceClassifications([]);
      form.setFieldsValue({ ServiceClassifications: null });
      const response = await customAxios.get(`${urlGetServiceClassificationsForServiceGroup}?ServiceGroupId=${value}`);
      //const data = await response.json();
      if (response.status === 200 && response.data.data.ServiceClassifications!=null) {
       
        const classification = response.data.data.ServiceClassifications;
        setServiceClassifications(classification);
      }
    } else {
      // Clear the service classifications if the service group is cleared
      setServiceClassifications([]);
      form.setFieldsValue({ ServiceClassifications: null });
      setServices([]);
      setServiceClassificationId(null);
     
    }
  };

  const handleServiceClassificationChange = async (value) => {
    debugger;
    if (value) {
      setServiceClassificationId(value);
      try {
        // Call your API here using the selected ServiceClassificationId
        const response = await customAxios.get(`${urlGetServicesForSelectedServiceClassification}?ServiceClassificationId=${value}`);
        // const data = await response.json();
        if (response.status === 200) {
          const services = response.data.data.Services;
        
          setServices(services);
        }
      } catch (error) {
        // Handle any errors that occur during the API call
        console.error('Error fetching services:', error);
      }
    } else {
      // Clear the services if the service classification is cleared
      setServices([]);
      setServiceClassificationId(null);
    }
  };
  
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const handleCreateService = async () => {
    try {
      // Trigger form validation
      await form.validateFields();
      navigate("/CreateService", { state: { serviceclassificationid } });
    } catch (error) {
      // If validation fails, errors will be thrown and can be caught here
      console.log('Validation failed:', error);
    }
  };

  const columns = [
    {
      title: "Sl No",
      key: "index",
      width: 70,
      render: (text, record, index) =>
        index + 1 + (pagination.current - 1) * pagination.pageSize, // Calculate the correct serial number
    },
    {
      title: 'ShortName',
      dataIndex: 'ShortName',
      key: 'ShortName',
      sorter: (a, b) => a.ShortName - b.ShortName,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'LongName',
      dataIndex: 'LongName',
      key: 'LongName',
      sorter: (a, b) => a.LongName.localeCompare(b.LongName),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'UomName',
      dataIndex: 'UomName',
      key: 'UomName',
      sorter: (a, b) => a.UomName.localeCompare(b.UomName),
      sortDirections: ['descend', 'ascend'],
    },

    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, row) => (
        <>
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} onClick={() => handleEdit(row)} />
          </Tooltip>
        </>
      ),
    },
  ];
 

  // const handleSearch = (value) => {
  //   debugger;
  //   if (!value) {
  //     // Reset services to the original list when the search value is null, undefined, or empty
  //     setServices(orginalservices);
  //   } else {
  //     const filtered = orginalservices.filter(entry =>
  //       Object.values(entry).some(val => 
  //         val && val.toString().toLowerCase().includes(value.toLowerCase())
  //       )
  //     );
  //     setServices(filtered);
  //   }
  // };
  

  return (
    <Layout style={{ zIndex: '999999999' }}>
      <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>

        <Row style={{ padding: '0.5rem 2rem 0rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
          <Col span={16}>
            <Title level={4} style={{ color: 'white', fontWeight: 500 }}>
              Service Definition Manager
            </Title>
          </Col>
          <Col offset={5} span={3}>
            <Button icon={<PlusCircleOutlined />} onClick={handleCreateService}>
              Create Service
            </Button>
          </Col>
        </Row>

        <Form
          layout="vertical"
          //onFinish={handleOnFinish}
          variant="outlined"
          size="default"
          style={{ padding: '0rem 2rem' }}
          form={form}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item
                  label="ServiceGroups"
                  name="ServiceGroups"
                  rules={[
                    {
                      required: true,
                      message: 'ServiceGroup Is Required'
                    }
                  ]}
                >
                  <Select allowClear onChange={handleServiceGroupChange}>
                    {serviceGroups.map((option) => (
                      <Select.Option key={option.LookupID} value={option.LookupID}>
                        {option.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>
                <Form.Item
                  style={{ width: '100%' }}
                  label="Service Classifications"
                  name="ServiceClassifications"
                  rules={[
                    {
                      required: true,
                      message: 'ServiceClassification Is Required'
                    }
                  ]}
                >
                  <Select allowClear onChange={handleServiceClassificationChange}>
                    {serviceClassifications.map((option) => (
                      <Select.Option key={option.ServiceClassificationId} value={option.ServiceClassificationId}>
                        {option.LongName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
          </Row>
        </Form>
        <Divider orientation="left"></Divider>
        <Table
        style={{ padding: '0rem 2rem' }}
        dataSource={services}
        columns={columns}
       
        rowKey={(row) => row.ServiceId} // Specify the custom id property here
        size="small"
        bordered
        pagination={pagination}
        onChange={(pagination) => setPagination(pagination)}
      />

      </div>
    </Layout>
  );
};
export default Service;
