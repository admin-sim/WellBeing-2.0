import React, { useState, useEffect } from "react";
import {
  Spin,
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  DatePicker,
  Divider,
  notification,
  Table,
  Popconfirm,
  Modal,
} from "antd";
import Layout from "antd/es/layout/layout";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router";
const { Option } = Select;

import {
  urlAddNewAndUpdateProvider,
  urlAddNewAndUpdateProviderIdentification,
  urlGetProviderIdentificationDetails,
  urlDeleteProviderIdentification,
  urlAddNewAndUpdateProviderCredential,
  urlGetProviderCredentialDetails,
  urlDeleteProviderCredential,
} from "../../../../../endpoints.js";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import Title from "antd/es/typography/Title";
import TextArea from "antd/es/input/TextArea";
import WebcamImage from "../../../../components/WebCam/index.jsx";
import dayjs from "dayjs";

const ProviderEdit = () => {
  const location = useLocation();
  const [credentialsModal, setCredentialsModal] = useState();
  const [IdentifiersModal, setIdentifiersModal] = useState();
  //   const [providerRecord, setProviderRecord] = useState();

  // Access the state object (e.g., record) from location
  const { record } = location.state;
  const providerRecord = record;

  //   useEffect(() => {
  //     setProviderRecord(record);
  //   }, []);

  const handleReset = () => {
    form.resetFields();
  };

  const [form] = Form.useForm();
  const [credentialForm] = Form.useForm();
  const [identifierForm] = Form.useForm();

  const navigate = useNavigate();

  const searchProvider = () => {
    const url = `/Provider/Search`;
    // Navigate to the new URL
    navigate(url);
  };

  const handleOnFinish = async (values) => {
    console.log("Received values from form: ", values);
  };

  const showCredentialsModal = () => {
    setCredentialsModal(true);
  };

  const handleCredentialsModalClose = () => {
    credentialForm.resetFields();
    setCredentialsModal(false);
  };
  const showIdentifiersModal = () => {
    setIdentifiersModal(true);
  };

  const handleIdentifierModalClose = () => {
    identifierForm.resetFields();
    setIdentifiersModal(false);
  };

  const options = [
    {
      value: "jack",
      label: "Jack",
    },
    {
      value: "lucy",
      label: "Lucy",
    },
    {
      value: "Yiminghe",
      label: "yiminghe",
    },
  ];
  const credentialsColumns = [
    {
      title: "Sl No",
      dataIndex: "SlNo",
      width: "5rem",
    },
    {
      title: "Credential Type",
      dataIndex: "CredentialType",
    },
    {
      title: "Card No",
      dataIndex: "CardNo",
    },
    {
      title: "Remarks",
      dataIndex: "Remarks",
    },
    {
      title: "Action",
      dataIndex: "Action",
      fixed: "right",
      width: "8rem",
      render: (text, record) => (
        <Row gutter={40}>
          <Col offset={3} span={4}>
            <Button
              size="small"
              icon={<EditOutlined style={{ fontSize: "0.9rem" }} />}
            ></Button>
          </Col>
          <Col span={12}>
            <Popconfirm
              title="Sure to delete this Employee?"
              //   onConfirm={() =>}
              okText="Yes"
              cancelText="No"
            >
              <Button
                size="small"
                style={{ marginLeft: "0.5rem" }}
                icon={
                  <DeleteOutlined
                    style={{ fontSize: "0.9rem", color: "red" }}
                  />
                }
              ></Button>
            </Popconfirm>
          </Col>
        </Row>
      ),
    },
  ];
  const credentialsData = [
    {
      key: "1",
      SlNo: 1,
      CredentialType: "MBBS",
      CardNo: 32,
      Remarks: "Remarks Content",
    },
    {
      key: "2",
      SlNo: 2,
      CredentialType: "MD",
      CardNo: 321,
      Remarks: "Remarks Content",
    },
    {
      key: "3",
      SlNo: 3,
      CredentialType: "MS",
      CardNo: 322,
      Remarks: "Remarks Content",
    },
  ];
  const identifiersData = [
    {
      key: "1",
      SlNo: 1,
      IdentifierType: "MBBS",
      CardNo: 32,
      Remarks: "Remarks Content",
      ExpiryDate: "12-08-2024",
    },
    {
      key: "2",
      SlNo: 2,
      IdentifierType: "MD",
      CardNo: 321,
      Remarks: "Remarks Content",
      ExpiryDate: "22-09-2025",
    },
    {
      key: "3",
      SlNo: 3,
      IdentifierType: "MS",
      CardNo: 322,
      Remarks: "Remarks Content",
      ExpiryDate: "05-08-2023",
    },
  ];
  const identifiersColumns = [
    {
      title: "Sl No",
      dataIndex: "SlNo",
      width: "5rem",
    },
    {
      title: "Identifier Type",
      dataIndex: "IdentifierType",
    },
    {
      title: "Card No",
      dataIndex: "CardNo",
    },
    {
      title: "Exipry Date",
      dataIndex: "ExpiryDate",
    },
    {
      title: "Remarks",
      dataIndex: "Remarks",
    },
    {
      title: "Action",
      dataIndex: "Action",
      fixed: "right",
      width: "8rem",
      render: (text, record) => (
        <Row gutter={40}>
          <Col offset={3} span={4}>
            <Button
              size="small"
              icon={<EditOutlined style={{ fontSize: "0.9rem" }} />}
            ></Button>
          </Col>
          <Col span={12}>
            <Popconfirm
              title="Sure to delete this Employee?"
              //   onConfirm={() =>}
              okText="Yes"
              cancelText="No"
            >
              <Button
                size="small"
                style={{ marginLeft: "0.5rem" }}
                icon={
                  <DeleteOutlined
                    style={{ fontSize: "0.9rem", color: "red" }}
                  />
                }
              ></Button>
            </Popconfirm>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <>
      <Layout>
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
                Edit Provider Registration
              </Title>
            </Col>
            <Col offset={5} span={3}>
              <Button icon={<SearchOutlined />} onClick={searchProvider}>
                Search Provider
              </Button>
            </Col>
          </Row>

          <Divider orientation="left">Provider Details</Divider>

          <Form
            layout="vertical"
            form={form}
            name="register"
            onFinish={handleOnFinish}
            scrollToFirstError={true}
            initialValues={{
              ProviderName: providerRecord?.Name?.Name,
              Gender: providerRecord?.Gender,
              Mobile: providerRecord?.ContactDetails?.Mobile,
              Landline: providerRecord?.ContactDetails?.Landline,
              Email: providerRecord?.ContactDetails?.Email,
              dob: dayjs(providerRecord?.DOB, "DD-MM-YYYY"),
            }}
            style={{ padding: "0rem 2rem" }}
          >
            <Row gutter={20}>
              <Col span={18}>
                <Row gutter={16}>
                  <Col span={3}>
                    <Form.Item
                      name="title"
                      label="Title"
                      // hasFeedback
                      rules={[
                        {
                          required: true,
                          message: "Please select title",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select Title"
                        options={options}
                        allowClear
                      />
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item
                      name="ProviderName"
                      label="First Name"
                      rules={[
                        {
                          required: true,
                          message: "Please add First Name",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item name="ProviderMiddleName" label="Middle Name">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item
                      name="PatientLastName"
                      label="Last Name"
                      rules={[
                        {
                          required: true,
                          message: "Please add Last Name",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={3}>
                    <Form.Item
                      name="Gender"
                      label="Gender"
                      // hasFeedback
                      rules={[
                        {
                          required: true,
                          message: "Please select gender",
                        },
                      ]}
                    >
                      <Select
                        placeholder="select"
                        allowClear
                        options={options}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="BloodGroup" label="Qualification">
                          <Input allowClear />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="dob"
                          label="Date&nbsp;of&nbsp;Birth"
                          rules={[
                            {
                              required: true,
                              message: "Please select Date Of Birth",
                            },
                          ]}
                        >
                          <DatePicker
                            // size="small"
                            style={{ width: "100%" }}
                            format={"DD-MM-YYYY"}
                            allowClear={false}
                            suffixIcon={null}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>

                  <Col span={7}>
                    <Form.Item
                      name="titleFatherHusband"
                      label="Structural Role"
                      rules={[
                        {
                          required: true,
                          message: "Please select Structural Role",
                        },
                      ]}
                    >
                      <Select allowClear options={options} />
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item
                      name="titleFatherHusband"
                      label="Consultant Type"
                      rules={[
                        {
                          required: true,
                          message: "Please select Consultant Type",
                        },
                      ]}
                    >
                      <Select allowClear options={options} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col
                span={6}
                style={{
                  overflow: "hidden",
                  paddingRight: "0px",
                  marginTop: "-30px",
                }}
              >
                <WebcamImage
                //  onImageUpload={handleImageUpload}
                />
              </Col>
            </Row>

            <Divider orientation="left">Address</Divider>
            <Row gutter={14}>
              <Col span={6}>
                <Form.Item
                  name="PermanentAddress1"
                  label="Address"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Address",
                    },
                  ]}
                >
                  <TextArea placeholder="Add Address" autoSize />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  name="country"
                  label="Country"
                  rules={[
                    {
                      required: true,
                      message: "Please select country",
                    },
                  ]}
                >
                  <Select allowClear options={options} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  name="state"
                  label="State"
                  rules={[
                    {
                      required: true,
                      message: "Please select state",
                    },
                  ]}
                >
                  <Select allowClear options={options} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  name="city"
                  label="Place"
                  rules={[
                    {
                      required: true,
                      message: "Please select place",
                    },
                  ]}
                >
                  <Select allowClear options={options} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  name="area"
                  label="Area"
                  rules={[
                    {
                      required: true,
                      message: "Please select area",
                    },
                  ]}
                >
                  <Select allowClear options={options} />
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item name="PermanentPinCode" label="Pin Code">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Divider orientation="left">Contact Details</Divider>
            <Row gutter={14}>
              <Col span={6}>
                <Form.Item
                  name="Mobile"
                  label="Mobile Number"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your mobile number.",
                    },
                    {
                      pattern: new RegExp(/^(\+\d{1,3})?\d{10,12}$/),
                      message: "Invalid mobile number!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="Landline" label="Landline Number">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="Email"
                  label="Email Id"
                  rules={[
                    {
                      type: "email",
                      message: "Please input valid E-mail",
                    },
                    {
                      required: true,
                      message: "Please enter email-id",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Table
              pagination={false}
              title={() => (
                <>
                  <Row
                    style={{
                      backgroundColor: "#40A2E3",
                      padding: "0.3rem 0rem 0.3rem 1.5rem",
                      color: "white",
                      borderRadius: "5px",
                    }}
                  >
                    <Col
                      span={5}
                      style={{
                        fontWeight: 500,
                        letterSpacing: "0.5px",
                        fontSize: "1.2rem",
                      }}
                    >
                      Provider Credentials
                    </Col>
                    <Col
                      offset={15}
                      span={4}
                      style={{
                        fontWeight: 500,
                        letterSpacing: "0.5px",
                        fontSize: "1.2rem",
                      }}
                    >
                      <Button onClick={showCredentialsModal}>
                        <PlusCircleOutlined />
                        Add Credentials
                      </Button>
                    </Col>
                  </Row>
                </>
              )}
              columns={credentialsColumns}
              bordered
              dataSource={credentialsData}
              size="small"
              style={{
                margin: "0 0 1.5rem 0",
                boxShadow: "0px 0px 1px 1px rgba(0,0,0,0.2)",
              }}
            />
            <Table
              pagination={false}
              title={() => (
                <>
                  <Row
                    style={{
                      backgroundColor: "#40A2E3",

                      color: "white",
                      borderRadius: "5px",
                      padding: "0.3rem 0rem 0.3rem 1.5rem",
                    }}
                  >
                    <Col
                      span={5}
                      style={{
                        fontWeight: 500,
                        letterSpacing: "0.5px",
                        fontSize: "1.2rem",
                      }}
                    >
                      Provider Identifiers
                    </Col>
                    <Col
                      offset={15}
                      span={4}
                      style={{
                        fontWeight: 500,
                        letterSpacing: "0.5px",
                        fontSize: "1.2rem",
                      }}
                    >
                      <Button onClick={showIdentifiersModal}>
                        <PlusCircleOutlined />
                        Add Identifiers
                      </Button>
                    </Col>
                  </Row>
                </>
              )}
              columns={identifiersColumns}
              bordered
              dataSource={identifiersData}
              size="small"
              style={{
                margin: "0 0 1.5rem 0",
                boxShadow: "0px 0px 1px 1px rgba(0,0,0,0.2)",
              }}
            />

            <Row justify="end">
              <Col style={{ marginRight: "10px" }}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Update
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button type="primary" onClick={handleReset}>
                    Back
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Modal
            title="Credentials"
            open={credentialsModal}
            maskClosable={false}
            footer={null}
            onCancel={handleCredentialsModalClose}
          >
            <Form
              style={{ margin: "1rem 0" }}
              layout="vertical"
              form={credentialForm}
              credentialForm={credentialForm}
              onFinish={(values) => {
                console.log(values);
                handleCredentialsModalClose();
              }}
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="CredentialType"
                    label="Credential Type"
                    rules={[
                      {
                        required: true,
                        message: "Please select Credential Type",
                      },
                    ]}
                  >
                    <Select style={{ width: "100%" }} options={options} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="CardNo"
                    label="Card Number"
                    rules={[
                      {
                        required: true,
                        message: "Please Enter Card Number",
                      },
                    ]}
                  >
                    <Input style={{ width: "100%" }} options={options} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="Remarks" label="Remarks">
                    <Input style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="Status" label="Status">
                    <Input style={{ width: "100%" }} options={options} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={32} style={{ height: "1.8rem" }}>
                <Col offset={14} span={4}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item>
                    <Button
                      type="default"
                      danger
                      onClick={handleCredentialsModalClose}
                    >
                      Cancel
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
          <Modal
            title="Identifiers"
            open={IdentifiersModal}
            maskClosable={false}
            footer={null}
            onCancel={handleIdentifierModalClose}
          >
            <Form
              style={{ margin: "1rem 0" }}
              layout="vertical"
              form={identifierForm}
              onFinish={(values) => {
                console.log(values);
                handleIdentifierModalClose();
              }}
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="IdentificationType"
                    label="Identification Type"
                    rules={[
                      {
                        required: true,
                        message: "Please select Identification Type",
                      },
                    ]}
                  >
                    <Select style={{ width: "100%" }} options={options} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="CardNo"
                    label="Card Number"
                    rules={[
                      {
                        required: true,
                        message: "Please Enter Card Number",
                      },
                    ]}
                  >
                    <Input style={{ width: "100%" }} options={options} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="expiryDate"
                    label="Expiry Date"
                    rules={[
                      {
                        required: true,
                        message: "Please enter expiry date",
                      },
                    ]}
                  >
                    <DatePicker
                      format={"DD-MM-YYYY"}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="Remarks" label="Remarks">
                    <Input style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="Status" label="Status">
                    <Input style={{ width: "100%" }} options={options} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={32} style={{ height: "1.8rem" }}>
                <Col offset={14} span={4}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item>
                    <Button
                      type="default"
                      danger
                      onClick={handleIdentifierModalClose}
                    >
                      Cancel
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        </div>
      </Layout>
    </>
  );
};

export default ProviderEdit;
