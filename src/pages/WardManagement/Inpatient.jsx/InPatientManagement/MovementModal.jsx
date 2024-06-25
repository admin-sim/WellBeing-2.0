import {
  Avatar,
  Badge,
  Button,
  Col,
  ConfigProvider,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  TimePicker,
  Tooltip,
  Typography,
} from "antd";
import React from "react";

import PatientHeader from "../../../../components/PatientHeader";

function Movement({ bed, open, handleClose }) {
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    handleClose();
  };

  return (
    <div>
      <Modal
        width={"60%"}
        height={"auto"}
        centered
        title={
          <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>
            Movement
          </span>
        }
        open={open}
        maskClosable={false}
        footer={null}
        onCancel={handleCancel}
      >
        <PatientHeader patient={bed} />
        <Row gutter={16}>
          <Col span={10}>
            <div
              style={{
                border: "1px solid silver",
                borderRadius: "0.5rem",
                padding: "0.5rem",
                marginTop: "1.2rem",
              }}
            >
              <Row>
                <Col span={24}>Admitted Date and Time</Col>
                <Col span={24}>
                  <b>14-05-2024 04:18:00 PM</b>
                </Col>
              </Row>
              <Row style={{ marginTop: "0.5rem" }}>
                <Col span={12}>
                  <Col span={23}>Department</Col>
                  <Col span={23}>
                    <b>General Medicine</b>
                  </Col>
                </Col>

                <Col span={12}>
                  <Col span={24}>Service Location</Col>
                  <Col span={24}>
                    <b>First Floor</b>
                  </Col>
                </Col>
              </Row>
              <Row style={{ marginTop: "0.5rem" }}>
                <Col span={12}>
                  <Col span={23}>Provider</Col>
                  <Col span={23}>
                    <b>Dr. Clement Atlee</b>
                  </Col>
                </Col>

                <Col span={12}>
                  <Col span={24}>Ward Category</Col>
                  <Col span={24}>
                    <b>General Ward</b>
                  </Col>
                </Col>
              </Row>
              <Row style={{ marginTop: "0.5rem" }}>
                <Col span={12}>
                  <Col span={23}>Ward</Col>
                  <Col span={23}>
                    <b>Female Ward First Floor</b>
                  </Col>
                </Col>

                <Col span={12}>
                  <Col span={24}>Bed</Col>
                  <Col span={24}>
                    <b>FWFF2</b>
                  </Col>
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={14}>
            <Form
              style={{ marginTop: "1rem" }}
              layout="vertical"
              form={form}
              onFinish={(values) => {
                console.log(values);
                handleCancel();
              }}
            >
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    style={{ marginBottom: "0rem" }}
                    name="Department"
                    label="Department"
                    rules={[
                      {
                        required: true,
                        message: "Please select Reason",
                      },
                    ]}
                  >
                    <Select style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    style={{ marginBottom: "0rem" }}
                    name="ServiceLocation"
                    label="Service Location"
                    rules={[
                      {
                        required: true,
                        message: "Please select Reason",
                      },
                    ]}
                  >
                    <Select style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    style={{ marginBottom: "0rem" }}
                    name="Reason"
                    label="Reason for Movement"
                    rules={[
                      {
                        required: true,
                        message: "Please select Reason",
                      },
                    ]}
                  >
                    <Select style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    style={{ marginBottom: "3rem" }}
                    name="DateTimeTransfer"
                    label="Date and Time of Transfer"
                    rules={[
                      {
                        required: true,
                        message: "Please Enter Lookup Description",
                      },
                    ]}
                  >
                    <TimePicker
                      style={{ width: "100%" }}
                      showTime={{ format: "hh:mm A" }}
                      format="hh:mm A"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={32} style={{ height: "2rem" }}>
                <Col offset={15} span={4}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item>
                    <Button type="default" danger onClick={handleCancel}>
                      Cancel
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

export default Movement;
