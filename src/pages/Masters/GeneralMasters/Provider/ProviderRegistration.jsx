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
} from "antd";
import Layout from "antd/es/layout/layout";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
const { Option } = Select;

import {} from "../../../../../endpoints.js";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import Title from "antd/es/typography/Title";
import TextArea from "antd/es/input/TextArea";
import WebcamImage from "../../../../components/WebCam/index.jsx";
import dayjs from "dayjs";

const Provider = () => {
  const handleReset = () => {
    form.resetFields();
  };

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const searchProvider = () => {
    const url = `/Provider/Search`;
    // Navigate to the new URL
    navigate(url);
  };

  const handleOnFinish = async (values) => {
    console.log("Received values from form: ", values);
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
                Provider Registration
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
                      name="PatientFirstName"
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
                    <Form.Item name="PatientMiddleName" label="Middle Name">
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
                      name="PatientGender"
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
                    <Row gutter={32}>
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
                            style={{ width: "100%" }}
                            format={"DD-MM-YYYY"}
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
                  name="MobileNumber"
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
                <Form.Item name="LandlineNumber" label="Landline Number">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="EmailId"
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

            <Row justify="end">
              <Col style={{ marginRight: "10px" }}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button type="default" danger onClick={handleReset}>
                    Reset
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

export default Provider;
