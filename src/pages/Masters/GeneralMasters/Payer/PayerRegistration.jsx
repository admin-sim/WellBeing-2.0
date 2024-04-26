import { ArrowLeftOutlined, SearchOutlined } from "@ant-design/icons";
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
  Select,
} from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import Title from "antd/es/typography/Title";
import React from "react";
import { useNavigate } from "react-router-dom";

function PayerRegistration() {
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
                Payer Registration
              </Title>
            </Col>
            <Col offset={5} span={3}>
              <Button
                className="dfja"
                icon={<SearchOutlined style={{ fontSize: "1.1rem" }} />}
                onClick={() => navigate("/PayerSearch")}
              >
                Search Payer
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
                  <Input style={{ width: "100%" }} maxLength={10}/>
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

            <Row
              gutter={32}
              style={{ height: "1.8rem", paddingBottom: "2rem" }}
            >
              <Col offset={20} span={2}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item>
                  <Button type="default" danger>
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
}

export default PayerRegistration;
