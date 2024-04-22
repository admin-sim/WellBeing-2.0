import {
  ArrowLeftOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Layout,
  Row,
  Table,
  Select,
  Popconfirm,
  Modal,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import Title from "antd/es/typography/Title";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PayerEdit = () => {
  const location = useLocation();

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

  const [identifierForm] = Form.useForm();

  const navigate = useNavigate();

  const searchPayer = () => {
    const url = `/Payer/Search`;
    // Navigate to the new URL
    navigate(url);
  };

  const handleOnFinish = async (values) => {
    console.log("Received values from form: ", values);
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
      title: "Card Type",
      dataIndex: "CredentialType",
    },
    {
      title: "Card No",
      dataIndex: "CardNo",
    },
    {
      title: "Expiry Date",
      dataIndex: "Date",
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
      CredentialType: "Pan Card",
      CardNo: 32,
      Remarks: "Remarks Content",
      Date: "12/02/2024",
    },
    {
      key: "2",
      SlNo: 2,
      CredentialType: "Aadhar Card",
      CardNo: 321,
      Date: "12/02/2024",
      Remarks: "Remarks Content",
    },
    {
      key: "3",
      SlNo: 3,
      CredentialType: "EPIC",
      CardNo: 322,
      Date: "12/02/2024",
      Remarks: "Remarks Content",
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
                Edit Payer Registration
              </Title>
            </Col>
            {/* <Col offset={5} span={3}>
              <Button
                className="dfja"
                icon={<SearchOutlined style={{ fontSize: "1.1rem" }} />}
                onClick={() => navigate("/PayerSearch")}
              >
                Search Payer
              </Button>
            </Col> */}
          </Row>

          <Form
            style={{ margin: "1rem 2rem" }}
            layout="vertical"
            form={form}
            onFinish={(values) => {
              console.log(values);
              //   handleClose();
            }}
          >
            <Row gutter={18}>
              <Col span={6}>
                <Form.Item
                  name="PayerType"
                  label="Payer Type"
                  rules={[
                    {
                      required: true,
                      message: "Please select Payer Type",
                    },
                  ]}
                >
                  <Select style={{ width: "100%" }} options={options} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="PayerName"
                  label="Payer Name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Payer Name",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="EffectiveFrom"
                  label="Effective From"
                  rules={[
                    {
                      required: true,
                      message: "Please enter effective from date",
                    },
                  ]}
                >
                  <DatePicker format={"DD-MM-YYYY"} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="EffectiveTo"
                  label="Effective To"
                  rules={[
                    {
                      required: true,
                      message: "Please enter effective to date",
                    },
                  ]}
                >
                  <DatePicker format={"DD-MM-YYYY"} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={18}>
              <Col span={6}>
                <Form.Item name="ContactPerson" label="Contact Person">
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="Status" label="Status">
                  <Select options={options} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item name="Tariff" label="Tariff">
                  <Checkbox
                    style={{ width: "100%" }}
                    // onChange={}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Divider orientation="left">Address Details</Divider>
            <Row gutter={18}>
              <Col span={6}>
                <Form.Item
                  name="Line"
                  label="Line"
                  rules={[
                    {
                      required: true,
                      message: "Please enter address",
                    },
                  ]}
                >
                  <TextArea style={{ width: "100%" }} rows={1} autoSize />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="Country"
                  label="Country"
                  rules={[
                    {
                      required: true,
                      message: "Please select country",
                    },
                  ]}
                >
                  <Select style={{ width: "100%" }} options={options} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="State"
                  label="State"
                  rules={[
                    {
                      required: true,
                      message: "Please select state",
                    },
                  ]}
                >
                  <Select style={{ width: "100%" }} options={options} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="Place"
                  label="Place"
                  rules={[
                    {
                      required: true,
                      message: "Please enter place",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={18}>
              <Col span={6}>
                <Form.Item name="Zip" label="Zip">
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Divider orientation="left">Contact Details</Divider>
            <Row gutter={18}>
              <Col span={8}>
                <Form.Item
                  name="MobileNumber"
                  label="Mobile Number"
                  rules={[
                    {
                      required: true,
                      message: "Please enter mobile number",
                    },
                    {
                      pattern: /^\d{10}$/,
                      message: "Please enter a valid 10 digit number!",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} maxLength={10} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="Landline Number"
                  label="Landline Number"
                  rules={[
                    {
                      required: true,
                      message: "Please enter landline number",
                    },
                    {
                      pattern: /^\d{10}$/,
                      message: "Please enter a valid 10 digit number!",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} maxLength={10} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="email"
                  label="Contact Email"
                  rules={[
                    {
                      type: "email",
                      message: "The input is not valid E-mail!",
                    },
                    {
                      required: true,
                      message: "Please enter contact E-mail!",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Divider orientation="left">Financial Attributes</Divider>
            <Row gutter={18}>
              <Col span={8}>
                <Form.Item name="credit" label="Credit Days">
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col offset={1} span={6}>
                <Form.Item name="Dunning" label="Is Dunning Applicable">
                  <Checkbox style={{ width: "100%" }} />
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
                      Payer Identifiers
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
              columns={credentialsColumns}
              bordered
              dataSource={credentialsData}
              size="small"
              style={{
                margin: "0 0 1.5rem 0",
                boxShadow: "0px 0px 1px 1px rgba(0,0,0,0.2)",
              }}
            />
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
            <Row
              gutter={32}
              style={{ height: "1.8rem", paddingBottom: "2rem" }}
            >
              <Col offset={20} span={2}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Update
                  </Button>
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item>
                  <Button type="default" danger>
                    Back
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Layout>
    </>
  );
};

export default PayerEdit;
