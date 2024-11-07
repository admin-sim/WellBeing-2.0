import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Layout,
  Modal,
  Row,
  AutoComplete,
  Select,
  Table,
  Tabs,
  message
} from "antd";
import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  RedoOutlined,
  CloseSquareFilled
} from "@ant-design/icons";
import { debounce } from "lodash";
import PatientHeader from "../../../../components/PatientHeader";
import CustomTable from "../../../../components/customTable";
import Title from "antd/es/typography/Title";
import { TfiReload } from "react-icons/tfi";
import customAxios from '../../../../components/customAxios/customAxios.jsx'
import { urlGetAllAutocompleteServicesAsync, urlGetServiceCharge, urlAddNewCharge, urlPackageDescriptionServiceforclincal, urlPackageDescriptionServicewithoutDiagServc, urlLoadSampleCollectionGrid } from "../../../../../endpoints.js";
import dayjs from "dayjs";
import ColumnGroup from "antd/es/table/ColumnGroup";
import { render } from "react-dom";

function OrderEntry({ bed, patient, Dropdown, open, handleClose, handleOrderEntry, handleFinish }) {
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm(); // Initialize form3
  const [tableData, setTableData] = useState([]);
  const [services, setServices] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serviceDetails, setServiceDetails] = useState();
  const [sampleCollectionGrid, setSampleCollectionGrid] = useState([]);

  const handleCancel = () => {
    form1.resetFields();
    form2.resetFields();
    form3.resetFields();
    handleClose();
  };

  useEffect(() => {
    setLoading(false)
  }, [Dropdown])

  const handleAutoCompleteChange = async (value) => {
    debugger;
    setLoading(true);
    try {
      if (!value.trim()) {
        setServices(null);
        setLoading(false);
        return;
      }
      const response = await customAxios.get(
        `${urlPackageDescriptionServicewithoutDiagServc}?Description=${value}`
      );
      const responseData = response.data.data || [];
      if (
        Array.isArray(responseData) &&
        responseData.length > 0 &&
        responseData[0].Id !== undefined
      ) {
        const newOptions = responseData
          .map((option) => ({
            value: option.Name,
            label: option.Name,
            key: option.Id,
          }))
        setServices(newOptions)
      } else {
        setServices(null);
        form1.setFieldValue("Services", "");
      }
    } catch (error) {
      setServices(null);
    }
    setLoading(false);
  };

  const handleAutoCompleteChangeDia = async (value) => {
    debugger;
    setLoading(true);
    try {
      if (!value.trim()) {
        setServices(null);
        setLoading(false);
        return;
      }
      const response = await customAxios.get(
        `${urlPackageDescriptionServiceforclincal}?Description=${value}`
      );
      const responseData = response.data.data || [];
      if (
        Array.isArray(responseData) &&
        responseData.length > 0 &&
        responseData[0].Id !== undefined
      ) {
        const newOptions = responseData
          .map((option) => ({
            value: option.Name,
            label: option.Name,
            key: option.Id,
          }))
        setServices(newOptions)
      } else {
        setServices(null);
        form1.setFieldValue("Services", "");
      }
    } catch (error) {
      setServices(null);
    }
    setLoading(false);
  };

  const debouncedHandleAutoCompleteChangeService = debounce(
    handleAutoCompleteChange,
    300
  );

  const debouncedHandleAutoCompleteChangeServiceDia = debounce(
    handleAutoCompleteChangeDia,
    300
  );

  const onChange = async (key) => {
    debugger
    form1.resetFields()
    form2.resetFields()
    form3.resetFields()
    setServices([])
    if (key == '4') {
      try {
        const response = await customAxios.get(
          `${urlLoadSampleCollectionGrid}?PatientId=${bed.PatientId}&EncounterId=${bed.EncounterId}&SelclabId=${0}`
        );
        if (response.status == 200) {
          setSampleCollectionGrid(response.data.data);
        }
      } catch (error) {
        throw error;
      }
    }
  };

  const handleAddRow = () => {
    setTableData([
      ...tableData,
      {
        key: tableData.length + 1,
        Drug: "",
        Route: "",
        Frequency: "",
        IntervalInDays: "",
        TotalQty: "",
        Instruction: "",
      },
    ]);
  };

  const handleDeleteRow = (key) => {
    const newData = tableData.filter((row) => row.key !== key);
    setTableData(newData);
  };

  const handleInputChange = (value, key, column) => {
    const newData = tableData.map((row) => {
      if (row.key === key) {
        return { ...row, [column]: value };
      }
      return row;
    });
    setTableData(newData);
  };

  const columns2 = [
    {
      title: "Service Name",
      dataIndex: "ServiceName",
      key: "key",
    },
    {
      title: "Date",
      dataIndex: "StrServiceDate",
      key: "key",
    },
    {
      title: "Provider",
      dataIndex: "ProviderName",
      key: "key",
    },
    {
      title: "Charge Amount",
      dataIndex: "Rate",
      key: "key",
    },
  ];

  const columns3 = [
    {
      title: "Service Name",
      dataIndex: "ServiceName",
      key: "key",
    },
    {
      title: "Service Date",
      dataIndex: "AdmittedDateString",
      key: "key",
    },
    {
      title: "OrderBy",
      dataIndex: "Provider",
      key: "key",
    },
  ];

  const columns5 = [
    {
      title: "Test Name",
      dataIndex: "testName",
    },
    {
      title: "Template Name",
      dataIndex: "TemplateName",
      render: (text) => <a>{text}</a>,
    },
  ];

  const dataSource5 = [
    {
      key: "1",
      testName: "Urin Analysis",
      TemplateName: "Template",
    },
  ];
  
  const columns4 = [
    {
      title: "Test Name",
      dataIndex: "testName",
    },
    {
      title: "Lab Number",
      dataIndex: "LabNumber",
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const fetchDataForSelectedService = async (ServiceId) => {
    debugger
    try {
      const response = await customAxios.get(
        `${urlGetServiceCharge}?ServiceId=${ServiceId}&PatientId=${bed.PatientId}&EncounterId=${bed.EncounterId}`
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  };

  const handleSelect = async (value, option) => {
    debugger;
    setLoading(true);
    if (option.key) {
      try {
        const newData = await fetchDataForSelectedService(option.key);
        setServiceDetails(newData)
        if (newData.servicePrice) {
          form1.setFieldsValue({
            Provider: newData.servicePrice.ProviderName,
          });
        }
      } catch (error) {
        setLoading(false);
      }
    }
    setLoading(false);
  };

  const handleSelectDia = async (value, option) => {
    debugger;
    setLoading(true);
    if (option.key) {
      try {
        const newData = await fetchDataForSelectedService(option.key);
        setServiceDetails(newData)
        if (newData.servicePrice) {
          form2.setFieldsValue({
            Provider: newData.servicePrice.ProviderName,
          });
        }
      } catch (error) {
        setLoading(false);
      }
    }
    setLoading(false);
  };

  return (
    <div>
      <Modal
        width={"80%"}
        height={"100vh"}
        centered
        title={
          <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>
            Nurse Order
          </span>
        }
        open={open}
        maskClosable={false}
        footer={null}
        onCancel={handleCancel}
      >
        <PatientHeader patient={patient} />
        <Tabs
          size="small"
          onChange={onChange}
          tabBarGutter={0}
          type="card"
          style={{ marginTop: "1rem" }}
          tabBarStyle={{ display: "flex" }}
          defaultActiveKey={1}
        >
          <Tabs.TabPane
            tab={
              <div
                style={{
                  // width: "35vw",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                Order Details
              </div>
            }
            key="1"
          >
            <Layout style={{ border: "1px solid #ccc", borderRadius: "10px" }}>
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
                    padding: "0.5rem 1rem 0.5rem 1rem",
                    backgroundColor: "#40A2E3",
                    borderRadius: "10px 10px 0px 0px ",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Col>
                    <Title
                      level={4}
                      style={{
                        color: "white",
                        fontWeight: 500,
                        margin: 0,
                        paddingTop: 0,
                      }}
                    >
                      Patient Bill
                    </Title>
                  </Col>
                  <Col>
                    <Button type="link">
                      <TfiReload
                        style={{
                          color: "white",
                          fontWeight: "bolder",
                          fontSize: "1.5rem",
                        }}
                      />
                    </Button>
                  </Col>
                </Row>
                <Form
                  layout="vertical"
                  form={form1}
                  onFinish={async (values) => {
                    debugger
                    setLoading(true)
                    const service = {
                      StrServiceDate: values.Date ? values.Date.format('DD-MM-YYYY') : '',
                      PatientId: bed.PatientId,
                      ProviderID: serviceDetails.servicePrice.ProviderID,
                      EncounterId: bed.EncounterId,
                      ServiceId: serviceDetails.servicePrice.ServiceId,
                      Rate: serviceDetails.servicePrice.ChargeAmount,
                      ChargeAmount: serviceDetails.servicePrice.ChargeAmount,
                      NetAmount: serviceDetails.servicePrice.ChargeAmount,
                      PatientChargeAmount: serviceDetails.servicePrice.PatientChargeAmount,
                      PatientTypeID: patient.PatientType,
                      OrderEntry: 1
                    }
                    const response = await customAxios.post(urlAddNewCharge, service, {
                      headers: {
                        "Content-Type": "application/json",
                      },
                    });
                    if (response.status == 200 && response.data != null) {
                      handleOrderEntry(response.data.PatientAccountCharges)
                      form1.resetFields()
                      setLoading(false)
                      message.success("Charge Added Successfully");
                    }
                    // handleCancel();
                  }}
                  style={{ margin: "1rem" }}
                  initialValues={{
                    Date: dayjs()
                  }}
                >
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        name="Service"
                        label="Service"
                        rules={[
                          {
                            required: true,
                            message: "Please enter Service",
                          },
                        ]}
                      >
                        <AutoComplete
                          options={services}
                          //onSearch={handleAutoCompleteChange}
                          onSearch={debouncedHandleAutoCompleteChangeService}
                          onSelect={handleSelect}
                          onChange={(value) => {

                          }}
                          allowClear={{
                            clearIcon: <CloseSquareFilled />,
                          }}
                          loading={loading}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        name="Date"
                        label="Date"
                        rules={[
                          {
                            required: true,
                            message: "Please select Date",
                          },
                        ]}
                      >
                        <DatePicker style={{ width: "100%" }} format='DD-MM-YYYY' />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="Provider"
                        label="Provider"
                        rules={[
                          {
                            required: true,
                            message: "Please enter Provider",
                          },
                        ]}
                      >
                        <Input style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col offset={1} span={4}>
                      <Form.Item label="&nbsp;">
                        <Button type="primary" htmlType="submit" loading={loading}>
                          Add Service
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Layout>
            <Row>
              <Col span={24} style={{ marginTop: "0rem" }}>
                <CustomTable
                  title={() => (
                    <span
                      style={{
                        color: "indigo",
                        fontWeight: "700",
                        fontSize: "1rem",
                      }}
                    >
                      Charge Details
                    </span>
                  )}
                  columns={columns2}
                  dataSource={(Dropdown.PatientAccountCharges || []).filter(item => item.ServiceGroupID != 1042)}
                  pagination={false}
                  // onDelete={(record) => {
                  //   alert("Deleting Sl No. : " + record.slno);
                  // }}
                  actionColumn={false}
                  isFilter={true}
                  bordered
                  scroll={{
                    y: 120,
                  }}
                />
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <div
                style={{
                  // width: "35vw",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                Order Diagnostic Services
              </div>
            }
            key="2"
          >
            <Layout style={{ border: "1px solid #ccc", borderRadius: "10px" }}>
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
                    padding: "0.5rem 1rem 0.5rem 1rem",
                    backgroundColor: "#40A2E3",
                    borderRadius: "10px 10px 0px 0px ",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Col>
                    <Title
                      level={4}
                      style={{
                        color: "white",
                        fontWeight: 500,
                        margin: 0,
                        paddingTop: 0,
                      }}
                    >
                      Diagnostic Order Entry
                    </Title>
                  </Col>
                  <Col>
                    <Button type="link">
                      <TfiReload
                        style={{
                          color: "white",
                          fontWeight: "bolder",
                          fontSize: "1.5rem",
                        }}
                      />
                    </Button>
                  </Col>
                </Row>
                <Form
                  layout="vertical"
                  form={form2}
                  onFinish={async (values) => {
                    debugger
                    setLoading(true)
                    const service = {
                      StrServiceDate: values.Date ? values.Date.format('DD-MM-YYYY') : '',
                      PatientId: bed.PatientId,
                      ProviderID: serviceDetails.servicePrice.ProviderID,
                      EncounterId: bed.EncounterId,
                      ServiceId: serviceDetails.servicePrice.ServiceId,
                      Rate: serviceDetails.servicePrice.ChargeAmount,
                      ChargeAmount: serviceDetails.servicePrice.ChargeAmount,
                      NetAmount: serviceDetails.servicePrice.ChargeAmount,
                      PatientChargeAmount: serviceDetails.servicePrice.PatientChargeAmount,
                      PatientTypeID: patient.PatientType,
                      OrderEntry: 1
                    }
                    const response = await customAxios.post(urlAddNewCharge, service, {
                      headers: {
                        "Content-Type": "application/json",
                      },
                    });
                    if (response.status == 200 && response.data != null) {
                      handleOrderEntry(response.data.PatientAccountCharges)
                      form2.resetFields()
                      setLoading(false)
                      message.success("Charge Added Successfully");
                    }
                    // handleCancel();
                  }}
                  style={{ margin: "1rem" }}
                  initialValues={{
                    Date: dayjs()
                  }}
                >
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        name="Service"
                        label="Service"
                        rules={[
                          {
                            required: true,
                            message: "Please enter Service",
                          },
                        ]}
                      >
                        <AutoComplete
                          options={services}
                          //onSearch={handleAutoCompleteChange}
                          onSearch={debouncedHandleAutoCompleteChangeServiceDia}
                          onSelect={handleSelectDia}
                          onChange={(value) => {

                          }}
                          allowClear={{
                            clearIcon: <CloseSquareFilled />,
                          }}
                          loading={loading}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        name="Date"
                        label="Date"
                        rules={[
                          {
                            required: true,
                            message: "Please select Date",
                          },
                        ]}
                      >
                        <DatePicker style={{ width: "100%" }} format='DD-MM-YYYY' />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="Provider"
                        label="Provider"
                        rules={[
                          {
                            required: true,
                            message: "Please enter Provider",
                          },
                        ]}
                      >
                        <Input style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col offset={1} span={4}>
                      <Form.Item label="&nbsp;">
                        <Button type="primary" htmlType="submit" loading={loading}>
                          Add Service
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={3}>
                      <Form.Item>
                        <Button type="primary">Send To Lab</Button>
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Form.Item>
                        <Checkbox>STAT</Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Layout>
            <Row>
              <Col span={24} style={{ marginTop: "0rem" }}>
                <CustomTable
                  title={() => (
                    <span
                      style={{
                        color: "indigo",
                        fontWeight: "700",
                        fontSize: "1rem",
                      }}
                    >
                      Charge Details
                    </span>
                  )}
                  columns={columns2}
                  dataSource={(Dropdown.PatientAccountCharges || []).filter(item => item.ServiceGroupID == 1042)}
                  pagination={false}
                  actionColumn={false}
                  isFilter={true}
                  bordered
                  scroll={{
                    y: 120,
                  }}
                />
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <div
                style={{
                  // width: "35vw",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                Previous Order Details
              </div>
            }
            key="3"
          >
            <Layout style={{ border: "1px solid #ccc", borderRadius: "10px" }}>
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
                    padding: "0.5rem 1rem 0.5rem 1rem",
                    backgroundColor: "#40A2E3",
                    borderRadius: "10px 10px 0px 0px ",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Col>
                    <Title
                      level={4}
                      style={{
                        color: "white",
                        fontWeight: 500,
                        margin: 0,
                        paddingTop: 0,
                      }}
                    >
                      Previous Order Details
                    </Title>
                  </Col>
                  <Col>
                    <Button type="link">
                      <TfiReload
                        style={{
                          color: "white",
                          fontWeight: "bolder",
                          fontSize: "1.5rem",
                        }}
                      />
                    </Button>
                  </Col>
                </Row>
                <Form
                  layout="vertical"
                  form={form3}
                  onFinish={(values) => {
                    setLoading(true),
                      handleFinish(values)
                  }}
                  style={{ margin: "1rem" }}
                  initialValues={{
                    FromDate: dayjs().subtract(1, 'day'),
                    ToDate: dayjs(),
                  }}
                >
                  <Row gutter={16}>
                    <Col span={4}>
                      <Form.Item
                        name="FromDate"
                        label="From Date"
                        rules={[
                          {
                            required: true,
                            message: "Please select Date",
                          },
                        ]}
                      >
                        <DatePicker style={{ width: "100%" }} format='DD-MM-YYYY' />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        name="ToDate"
                        label="To Date"
                        rules={[
                          {
                            required: true,
                            message: "Please select Date",
                          },
                        ]}
                      >
                        <DatePicker style={{ width: "100%" }} format='DD-MM-YYYY' />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="Indicator"
                        label="Indicator"
                        rules={[
                          {
                            required: true,
                            message: "Please select Indicator",
                          },
                        ]}
                        initialValue={2060}
                      >
                        <Select style={{ width: '100%' }} defaultValue={2060}>
                          {(Dropdown ? Dropdown.DocumentType : []).map((option) => (
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
                    <Col span={6}>
                      <Form.Item
                        name="Description"
                        label="Description"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Please select Description",
                      //   },
                      // ]}
                      >
                        <Input style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item label="&nbsp;">
                        <Button type="primary" htmlType="submit">
                          Search
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Layout>
            <Row>
              <Col span={24} style={{ marginTop: "0rem" }}>
                <CustomTable
                  title={() => (
                    <span
                      style={{
                        color: "indigo",
                        fontWeight: "700",
                        fontSize: "1rem",
                      }}
                    >
                      Charge Details
                    </span>
                  )}
                  columns={columns3}
                  dataSource={Dropdown.OrderModel || []}
                  pagination={false}
                  // onDelete={(record) => {
                  //   alert("Deleting Sl No. : " + record.slno);
                  // }}
                  actionColumn={false}
                  isFilter={true}
                  bordered
                  scroll={{
                    y: 120,
                  }}
                  loading={loading}
                />
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <div
                style={{
                  // width: "35vw",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                Lab Reports
              </div>
            }
            key="4"
          >
            <Layout style={{ border: "1px solid #ccc", borderRadius: "10px" }}>
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
                    padding: "0.5rem 1rem 0.5rem 1rem",
                    backgroundColor: "#40A2E3",
                    borderRadius: "10px 10px 0px 0px ",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Col>
                    <Title
                      level={4}
                      style={{
                        color: "white",
                        fontWeight: 500,
                        margin: 0,
                        paddingTop: 0,
                      }}
                    >
                      Lab Reports
                    </Title>
                  </Col>
                  <Col>
                    <Button type="link">
                      <TfiReload
                        style={{
                          color: "white",
                          fontWeight: "bolder",
                          fontSize: "1.5rem",
                        }}
                      />
                    </Button>
                  </Col>
                </Row>
                <Table
                  size="small"
                  rowSelection={{
                    type: Checkbox,
                    ...rowSelection,
                  }}
                  columns={columns4}
                  dataSource={sampleCollectionGrid}
                  pagination={{
                    pageSize: 10,
                  }}
                />
                <Row>
                  <Col
                    span={23}
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      margin: "0.5rem 0 1rem 0",
                    }}
                  >
                    <Button type="primary">View Report</Button>
                  </Col>
                </Row>
                <Table columns={columns5} dataSource={dataSource5} size="small" />
              </div>
            </Layout>
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </div >
  );
}

export default OrderEntry;
