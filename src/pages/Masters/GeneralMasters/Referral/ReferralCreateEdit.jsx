import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Form, Input, Layout, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import Title from "antd/es/typography/Title";
import React from "react";
import { useNavigate } from "react-router-dom";

function ReferralCreateEdit() {
  const navigate = useNavigate();
  const [form] = useForm();
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
                Referral Manager
              </Title>
            </Col>
            <Col offset={5} span={3}>
              <Button
                className="dfja"
                icon={<ArrowLeftOutlined style={{ fontSize: "1.1rem" }} />}
                onClick={() => navigate("/Referral")}
              >
                Back to list
              </Button>
            </Col>
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
              <Col span={8}>
                <Form.Item
                  name="ReferrerType"
                  label="Referrer Type"
                  rules={[
                    {
                      required: true,
                      message: "Please select Referrer Type",
                    },
                  ]}
                >
                  <Select style={{ width: "100%" }} options={options} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="ReferrerTitle"
                  label="Referrer Title"
                  rules={[
                    {
                      required: true,
                      message: "Please Select Referrer Title",
                    },
                  ]}
                >
                  <Select style={{ width: "100%" }} options={options} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="ReferrerFirstName"
                  label="Referrer First Name"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Referrer First Name",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={18}>
              <Col span={8}>
                <Form.Item
                  name="ReferrerMiddleName"
                  label="Referrer Middle Name"
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="ReferrerLastName" label="Referrer Last Name">
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="Gender"
                  label="Gender"
                  rules={[
                    {
                      required: true,
                      message: "Please Select Gender",
                    },
                  ]}
                >
                  <Select style={{ width: "100%" }} options={options} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={18}>
              <Col span={8}>
                <Form.Item
                  name="Qualification"
                  label="Qualification"
                  rules={[
                    {
                      required: true,
                      message: "Please enter qualification",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="Address"
                  label="Address"
                  rules={[
                    {
                      required: true,
                      message: "Please enter address",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="Area"
                  label="Area"
                  rules={[
                    {
                      required: true,
                      message: "Please select area",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item
                  name="Pin"
                  label="Pin"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Pin",
                    },
                  ]}
                >
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
                  ]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="Landline Number" label="Landline Number">
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="email"
                  label="Contact Email"
                  rules={[
                    {
                      type: "email",
                      message: "Please enter valid email",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Divider orientation="left">Status Details</Divider>
            <Row gutter={18}>
              <Col span={8}>
                <Form.Item name="status" label="Status">
                  <Select style={{ width: "100%" }} options={options} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={32} style={{ height: "1.8rem" }}>
              <Col offset={20} span={2}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item>
                  <Button type="default">Cancel</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Layout>
    </>
  );
}

export default ReferralCreateEdit;
