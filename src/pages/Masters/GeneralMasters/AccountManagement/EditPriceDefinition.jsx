import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Input, InputNumber, Row, Select, DatePicker, Divider, notification, Table, Modal, Tooltip, Skeleton } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Layout from 'antd/es/layout/layout';
import { useNavigate } from 'react-router';
import { urlGetAllServiceGroups, urlGetServiceClassificationsForServiceGroup, urlGetAllServicePricesForSelectedServiceClassification ,urlRevisionServicePrices} from '../../../../../endpoints';
import customAxios from '../../../../components/customAxios/customAxios';
import Title from 'antd/es/typography/Title';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

const EditPriceDefinition = () => {
  const [serviceGroups, setServiceGroups] = useState([]);
  const [serviceClassifications, setServiceClassifications] = useState([]);
  const [services, setServices] = useState([]);
  const [modifiedServices, setModifiedServices] = useState([]);
  const [serviceclassificationid, setServiceClassificationId] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10, // Change this value according to your pagination settings
  });

  const location = useLocation();
  const value = location.state.value;

  
  const [form] = Form.useForm();
  // Convert strings to dayjs objects
  const effectiveFrom = dayjs(value.EffectiveFromDatestring, 'DD-MM-YYYY');
  const effectiveTo = dayjs(value.EffectiveToDatestring, 'DD-MM-YYYY');
  // Set initial form values
  React.useEffect(() => {

    form.setFieldsValue({
        effectiveFrom,
        effectiveTo
    });
}, []);



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
      if (response.status === 200 && response.data.data.ServiceClassifications != null) {

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
        const response = await customAxios.get(`${urlGetAllServicePricesForSelectedServiceClassification}?ServiceClassificationId=${value}`);
        // const data = await response.json();
        if (response.status === 200) {
          const ServicePriceDefinitions = response.data.data.ServicePriceDefinitions;

          setServices(ServicePriceDefinitions);
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



  const columns = [
    {
      title: "ServiceName",
      dataIndex: "LongName",
      key: "LongName",
      // width: 150,

    },
    {
      title: "Qty",
      dataIndex: "Qty",
      key: "Qty",
      width: 200,
      render: (_, record) => (
        <Form.Item
          name={`Qty_${record.ServiceId}`}
          initialValue={record.Qty}
          rules={[
            {
              required: true,
              // message: 'required',
            },
            {
              type: 'number',
              min: 0,
              // message: 'required',
            },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            value={record.Qty}
            onChange={(value) =>
              handleTableInputChange(
                record.ServiceId,
                "Qty",
                value
              )
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "UomName",
      dataIndex: "UomName",
      key: "UomName",
      width: 150,

    },
    {
      title: "Price",
      dataIndex: "Price",
      key: "Price",
      width: 150,
      render: (_, record) => (
        <Form.Item
          name={`Price_${record.ServiceId}`}
          initialValue={record.Price}
          rules={[
            {
              required: true,
              message: 'Price is required',
            },
            {
              type: 'number',
              min: 0,
              message: 'Price must be a non-negative number',
            },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            value={record.Price}
            onChange={(value) =>
              handleTableInputChange(record.ServiceId, "Price", value)
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "MinPrice",
      dataIndex: "MinPrice",
      key: "MinPrice",
      width: 120,
      render: (_, record) => (
        <Form.Item
          name={`MinPrice_${record.ServiceId}`}
          initialValue={record.MinPrice}
          rules={[
            {
              required: true,
              message: 'MinPrice is required',
            },
            {
              type: 'number',
              min: 0,
              message: 'MinPrice must be a non-negative number',
            },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            value={record.MinPrice}
            onChange={(value) =>
              handleTableInputChange(record.ServiceId, "MinPrice", value)
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "MaxPrice",
      dataIndex: "MaxPrice",
      key: "MaxPrice",
      width: 150,
      render: (_, record) => (
        <Form.Item
          name={`MaxPrice_${record.ServiceId}`}
          initialValue={record.MaxPrice}
          rules={[
            {
              required: true,
              message: 'MaxPrice is required',
            },
            {
              type: 'number',
              min: 0,
              message: 'MaxPrice must be a non-negative number',
            },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            value={record.MaxPrice}
            onChange={(value) =>
              handleTableInputChange(record.ServiceId, "MaxPrice", value)
            }
          />
        </Form.Item>
      ),
    },
  ];
  const handleTableInputChange = (ServiceId, dataIndex, value) => {
    setServices((prevDataSource) =>
      prevDataSource.map((item) =>
        item.ServiceId === ServiceId
          ? { ...item, [dataIndex]: value }
          : item
      )
    );

    setModifiedServices((prevModifiedServices) => {
      const existingService = prevModifiedServices.find(
        (service) => service.ServiceId === ServiceId
      );

      if (existingService) {
        return prevModifiedServices.map((service) =>
          service.ServiceId === ServiceId
            ? { ...service, [dataIndex]: value }
            : service
        );
      } else {
        const newService = services.find(
          (service) => service.ServiceId === ServiceId
        );
        return [...prevModifiedServices, { ...newService, [dataIndex]: value }];
      }
    });
};



  const handleOnFinish =async (values) => {
    const { ServiceGroups, ServiceClassifications, effectiveFrom, effectiveTo } = values;
   const  EffectiveFrom=value.EffectiveFromDatestring;
   const EffectiveTo=value.EffectiveToDatestring;

    console.log(services);
    await form.validateFields();

    try {
      const response = await customAxios.post(urlRevisionServicePrices, modifiedServices, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status==200 && response.data.data == true) {
        notification.success({
          message: "Success",
          description: "ServiceAdded Succeessfully.....",
        });
        //form.resetFields();
       // const url = "/Service";
       // navigate(url);
      } else {
        notification.error({
          message: "Error",
          description: "Something Went Wrong.....",
        });
      }
    } catch (error) {
        notification.error({
            message: "Error",
            description: "Something Went Wrong.....",
          });
    }
    

    // Your logic here
};




  return (
    <Layout style={{ zIndex: '999999999' }}>
      <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>

        <Row style={{ padding: '0.5rem 2rem 0rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
          <Col span={16}>
            <Title level={4} style={{ color: 'white', fontWeight: 500 }}>
              EditPriceDefinition
            </Title>
          </Col>
        </Row>

        <Form
          layout="vertical"
          onFinish={handleOnFinish}
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
            <Col className="gutter-row" span={4}>
              <div>
                <Form.Item label="EffectiveFromDate" name="effectiveFrom"
                >
                  <DatePicker format='DD-MM-YYYY' />
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={4}>
              <div>
                <Form.Item  label="EffectiveToDate"name="effectiveTo"
                >
                  <DatePicker format='DD-MM-YYYY' />
                </Form.Item>
              </div>
            </Col>
            <Col className="gutter-row" span={2}>
              <Form.Item label="&nbsp;">
                <Button type="primary"  htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Col>
          </Row>

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
    
        </Form>
      </div>
    </Layout>
  );
};
export default EditPriceDefinition;
