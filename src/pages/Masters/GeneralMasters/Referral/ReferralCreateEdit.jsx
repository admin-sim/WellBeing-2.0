import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Form, Input, Layout, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import Title from "antd/es/typography/Title";
import React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../../components/PageHeader";
import {
  ColWithEightSpan,
  ColWithSixSpan,
} from "../../../../components/customGridColumns";

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
          <PageHeader
            title={"Referral Manager"}
            buttonLabel={"Back To List"}
            buttonIcon={<ArrowLeftOutlined style={{ fontSize: "1.1rem" }} />}
            onButtonClick={() => navigate("/Referral")}
          />
          <Form
            style={{ margin: "1rem" }}
            layout="vertical"
            form={form}
            onFinish={(values) => {
              console.log(values);
              //   handleClose();
            }}
          >
            <Row gutter={16}>
              <ColWithSixSpan>
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
              </ColWithSixSpan>
              <ColWithSixSpan>
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
              </ColWithSixSpan>
              <ColWithSixSpan>
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
              </ColWithSixSpan>

              <ColWithSixSpan>
                <Form.Item
                  name="ReferrerMiddleName"
                  label="Referrer Middle Name"
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item name="ReferrerLastName" label="Referrer Last Name">
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
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
              </ColWithSixSpan>

              <ColWithSixSpan>
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
              </ColWithSixSpan>
              <ColWithSixSpan>
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
              </ColWithSixSpan>
              <ColWithSixSpan>
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
              </ColWithSixSpan>

              <ColWithSixSpan>
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
              </ColWithSixSpan>
            </Row>
            <Divider orientation="left">Contact Details</Divider>
            <Row gutter={16}>
              <ColWithEightSpan>
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
              </ColWithEightSpan>
              <ColWithEightSpan>
                <Form.Item name="Landline Number" label="Landline Number">
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </ColWithEightSpan>
              <ColWithEightSpan>
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
              </ColWithEightSpan>
            </Row>
            <Divider orientation="left">Status Details</Divider>
            <Row gutter={16}>
              <ColWithEightSpan>
                <Form.Item name="status" label="Status">
                  <Select style={{ width: "100%" }} options={options} />
                </Form.Item>
              </ColWithEightSpan>
            </Row>

            <Row justify={"end"}>
              <Col style={{ marginRight: "1rem" }}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button type="default" danger>
                    Cancel
                  </Button>
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
