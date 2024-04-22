import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Input, InputNumber, Row, Select, DatePicker, Divider, notification, Table, Modal, Tooltip, Skeleton, Checkbox, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Layout from 'antd/es/layout/layout';
import { useNavigate } from 'react-router';
import { urlGetAllServiceGroups, urlGetServiceClassificationsForServiceGroup, urlSaveNewServiceClassification } from '../../../../../endpoints';
import customAxios from '../../../../components/customAxios/customAxios';
import Title from 'antd/es/typography/Title';
const { TextArea } = Input;
const ServiceClassification = () => {
  const [serviceGroups, setServiceGroups] = useState([]);
  const [serviceGroupId, setServiceGroupId] = useState([]);
  const [isgeneratedshortname, setIsGenereratedShortName] = useState(false);
  const [printGroups, setPrintGroups] = useState([]);
  const [orderGroups, setOrderGroups] = useState([]);
  const [serviceClassifications, setServiceClassifications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServiceClassification, setEditingServiceClassification] = useState(null);

  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10, // Change this value according to your pagination settings
  });

  const showModal = () => {
    // Check if serviceGroups array is empty
    if (serviceGroupId.length === 0) {
      // Show error message using Ant Design's message component
      message.warning('Please select a ServiceGroup first.');
    } else {
      // Open the modal
      setIsModalOpen(true);
    }
  };


  // Set initial values when the modal opens
  useEffect(() => {
    if (isModalOpen && editingServiceClassification) {
      setIsGenereratedShortName(editingServiceClassification.GeneratedServiceShortName);
      form1.setFieldsValue({
        ShortName: editingServiceClassification.ShortName,
        LongName: editingServiceClassification.LongName,
        Remarks: editingServiceClassification.Remark,
        Status:editingServiceClassification.Status,
        OrderGroup:editingServiceClassification.OrderGroupId,
        PrintingGroup:editingServiceClassification.PrintGroupId,
        GenerateServiceShortName:editingServiceClassification.GeneratedServiceShortName
      });
    }
  }, [isModalOpen, editingServiceClassification]);

  const handleClose = () => {
    setEditingServiceClassification(null)
    form1.resetFields();
    setIsModalOpen(false);
  };

  const handleEdit = (record) => {
    debugger;
    form1.resetFields();
    setEditingServiceClassification(record);
    setIsModalOpen(true);

  };

  useEffect(() => {
    const fetchData = async () => {
      debugger;
      try {
        const response = await customAxios.get(`${urlGetAllServiceGroups}`);
        if (response.status === 200 && response.data && response.data.data && response.data.data.ServiceGroups && response.data.data.OrderGroups && response.data.data.PrintGroups) {
          const servicegroups = response.data.data.ServiceGroups;
          const ordergroups = response.data.data.OrderGroups;
          const printgroups = response.data.data.PrintGroups;
          setServiceGroups(servicegroups);
          setOrderGroups(ordergroups);
          setPrintGroups(printgroups);
        } else {
          console.error('Failed to fetch service groups or response data is incomplete');
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
      setServiceGroupId(value);
      // Call your API here using the selected LookupID
      const response = await customAxios.get(`${urlGetServiceClassificationsForServiceGroup}?ServiceGroupId=${value}`);
      //const data = await response.json();
      if (response.status === 200) {
        const classification = response.data.data.ServiceClassifications;
        setServiceClassifications(classification);
      }
    } else {
      // Clear the service classifications if the service group is cleared
      setServiceClassifications([]);
      form.setFieldsValue({ ServiceClassifications: null });
      setServices([]);

    }
  };



  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
    setIsGenereratedShortName(e.target.checked);
  };
  const options = [
    {
      value: "true",
      label: "Active",
    },
    {
      value: "false",
      label: "Hidden",
    },
  ];



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
    },
    {
      title: 'LongName',
      dataIndex: 'LongName',
      key: 'LongName',

    },
    {
      title: 'OrderGroup',
      dataIndex: 'OrderGroupName',
      key: 'OrderGroupName',

    },
    {
      title: 'PrintGroup',
      dataIndex: 'PrintGroupName',
      key: 'PrintGroupName',

    },

    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, row) => (
        <>
          <Tooltip title="Edit">
            <Button icon={<EditOutlined  />} onClick={() => handleEdit(row)} />
          </Tooltip>
        </>
      ),
    },
  ];

  const onFinish = async (values) => {
    debugger;
    const { ShortName, LongName, Status, } = values;

    // Check if the required fields are present
    if (!ShortName || !LongName || !Status) {
      notification.error({
        message: 'Error',
        description: 'All fields are required.',
      });
      return;
    }
    // If OrderGroup or PrintingGroup is undefined, make it null
    const OrderGroup = values.OrderGroup === undefined ? null : values.OrderGroup;
    const PrintingGroup = values.PrintingGroup === undefined ? null : values.PrintingGroup;
    // Check if Remarks is undefined or an empty string, then set it to ""
const Remarks = values.Remarks === undefined || values.Remarks === "" ? '""': values.Remarks;

    try {
      // Create a query string
      const params = new URLSearchParams();
      params.append('ServiceGroupId', serviceGroupId);
      if (editingServiceClassification && editingServiceClassification.ServiceClassificationId !== null) {
        params.append('ServiceClassificationId', editingServiceClassification.ServiceClassificationId);
      }
      params.append('ShortName', ShortName);
      params.append('LongName', LongName);
      params.append('Status', Status);
      if (OrderGroup !== null) {
        params.append('OrderGroupId', OrderGroup);
      }
      if (PrintingGroup !== null) {
        params.append('PrintGroupId', PrintingGroup);
      }
      params.append('Remark', Remarks);
      params.append('GeneratedServiceShortName', isgeneratedshortname);

      const response = await customAxios.post(`${urlSaveNewServiceClassification}?${params.toString()}`);

      if (response.status == 200 && response.data.data != null) {
        if (response.data.data == true) {
          notification.warning({
            message: "warning",
            description: "Service Classification Already Exists...",
          });
        } else {
          notification.success({
            message: "success",
            description: "Data Saved Successfully...",
          });
          setServiceClassifications(response.data.data);
          form1.resetFields();
          setIsModalOpen(false);
        }
      } else {
        notification.error({
          message: "Error",
          description: "Something Went Wrong...",
        });
      }

    } catch (error) {
      notification.error({
        message: "Error",
        description: "An error occurred while adding the user.",
      });
    }
  };








  return (
    <Layout style={{ zIndex: '999999999' }}>
      <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>

        <Row style={{ padding: '0.5rem 2rem 0rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
          <Col span={16}>
            <Title level={4} style={{ color: 'white', fontWeight: 500 }}>
              ServiceClassification
            </Title>
          </Col>
          <Col offset={3} span={3}>
            <Button icon={<PlusCircleOutlined />} onClick={showModal}>
              CreateServiceClassification
            </Button>
          </Col>
        </Row>

        <Form
          layout="vertical"

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
          </Row>
        </Form>
        <Divider orientation="left"></Divider>
        <Table
          style={{ padding: '0rem 2rem' }}
          dataSource={serviceClassifications}
          columns={columns}
        
          rowKey={(row) => row.ServiceClassificationId} // Specify the custom id property here
          size="small"
          bordered
          pagination={pagination}
          onChange={(pagination) => setPagination(pagination)}
        />
        <Modal
          width={600}
          title="Add New Place"
          open={isModalOpen}
          maskClosable={false}
          footer={null}
          onCancel={handleClose}
        >
          <Form

            layout="vertical"
            variant="outlined"
            size="default"
            style={{ padding: '0rem 2rem' }}
            form={form1}

            onFinish={onFinish}

          >
            {/* Your form items */}
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={8}>
                <Form.Item
                  name="ShortName"
                  label="ShortName"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter ShortName",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  name="LongName"
                  label="LongName"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter LongName",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="Status"
                  label="Status"
                  rules={[
                    {
                      required: true,
                      message: "Please select Status",
                    },
                  ]}
                  initialValue="true" // Add this line
                >
                  <Select style={{ width: "100%" }} options={options} />
                </Form.Item>
              </Col>


            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} >
              <Col span={24}>
                <Form.Item
                  name="Remarks"
                  label="Remarks"

                >
                  <TextArea style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} >
              <Col span={8}>
                <Form.Item
                  name="OrderGroup"
                  label="Status"

                >

                  <Select style={{ width: "100%" }} placeholder="Select Printgroup" allowClear>
                    {orderGroups.map((option) => (
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
              <Col span={8}>
                <Form.Item
                  name="GenerateServiceShortName"
                  label="&nbsp;"
                  valuePropName="checked"
                >
                  <Checkbox onChange={onChange}>Generated Service Short Name</Checkbox>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="PrintingGroup"
                  label="Printing Group"

                >
                  <Select style={{ width: "100%" }} placeholder="Select Printgroup" allowClear>
                    {printGroups.map((option) => (
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

            </Row>

            <Row gutter={32} style={{ height: "1.8rem" }}>
              <Col offset={12} span={6}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item>
                  <Button type="default" onClick={handleClose}>
                    Cancel
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </Layout>
  );
};
export default ServiceClassification;