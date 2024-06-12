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
  Tooltip,
  Typography,
} from "antd";
import React from "react";
const { Text } = Typography;
import male from "../../../../assets/m.png";
import { FcDocument, FcInfo, FcOpenedFolder } from "react-icons/fc";
import { DollarTwoTone, FolderOpenTwoTone } from "@ant-design/icons";
import PatientHeader from "../../../../components/PatientHeader";

function DirectTransferModal({ bed, open, handleClose }) {
  const [form] = Form.useForm();
  console.log("bed info", bed);
  const handleCancel = () => {
    form.resetFields();
    handleClose();
  };

  return (
    <div>
      <Modal
        width={"70%"}
        height={"auto"}
        centered
        title={
          <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>
            Direct Transfer
          </span>
        }
        open={open}
        maskClosable={false}
        footer={null}
        onCancel={handleCancel}
      >
         <PatientHeader patient={bed} />
        <Row gutter={16}>
          <Col span={8}>
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
          <Col span={16}>
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
                <Col span={12}>
                  <Form.Item
                    style={{ marginBottom: "0.5rem" }}
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
                <Col span={12}>
                  <Form.Item
                    style={{ marginBottom: "0.5rem" }}
                    name="Provider"
                    label="Provider"
                    rules={[
                      {
                        required: true,
                        message: "Please select Reason",
                      },
                    ]}
                  >
                    <Select disabled style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    style={{ marginBottom: "0.5rem" }}
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
                <Col span={12}>
                  <Form.Item
                    style={{ marginBottom: "0.5rem" }}
                    name="WardCategory"
                    label="Ward Category"
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
                <Col span={12}>
                  <Form.Item
                    style={{ marginBottom: "0.5rem" }}
                    name="Ward"
                    label="Ward"
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
                <Col span={12}>
                  <Form.Item
                    style={{ marginBottom: "0.5rem" }}
                    name="Bed"
                    label="Bed"
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
                    style={{ marginBottom: "0.5rem" }}
                    name="DateTimeTransfer"
                    label="Date and Time of Transfer"
                    rules={[
                      {
                        required: true,
                        message: "Please Enter Lookup Description",
                      },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      showTime={{ format: "hh:mm A" }}
                      format="dddd , DD-MM-YYYY , hh:mm A"
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="Reason" label="Reason for Transfer">
                    <Select style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={32} style={{ height: "1.8rem" }}>
                <Col offset={17} span={3}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Form.Item>
                </Col>
                <Col span={3}>
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

export default DirectTransferModal;
