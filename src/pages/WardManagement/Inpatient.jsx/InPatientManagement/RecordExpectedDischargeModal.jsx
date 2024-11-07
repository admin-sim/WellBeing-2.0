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
import React, { useState } from "react";
const { Text } = Typography;
import male from "../../../../assets/m.png";
import { FcDocument, FcInfo, FcOpenedFolder } from "react-icons/fc";
import { DollarTwoTone, FolderOpenTwoTone } from "@ant-design/icons";
import PatientHeader from "../../../../components/PatientHeader";
import dayjs from "dayjs";

function RecordExpectedDischarge({ bed, patient, Dropdown, open, handleClose, handleFinish }) {
  const [form] = Form.useForm();
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
            Record Expected Discharge
          </span>
        }
        open={open}
        maskClosable={false}
        footer={null}
        onCancel={handleCancel}
      >
        <PatientHeader patient={patient} />
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
                  <b>{Dropdown.PatientsCurrentDetails.AdmittedDateString}</b>
                </Col>
              </Row>
              <Row style={{ marginTop: "0.5rem" }}>
                <Col span={12}>
                  <Col span={23}>Department</Col>
                  <Col span={23}>
                    <b>{Dropdown.PatientsCurrentDetails.DepartmentName}</b>
                  </Col>
                </Col>
                <Col span={12}>
                  <Col span={24}>Service Location</Col>
                  <Col span={24}>
                    <b>{Dropdown.PatientsCurrentDetails.ServiceLocationName}</b>
                  </Col>
                </Col>
              </Row>
              <Row style={{ marginTop: "0.5rem" }}>
                <Col span={12}>
                  <Col span={23}>Provider</Col>
                  <Col span={23}>
                    <b>{Dropdown.PatientsCurrentDetails.Provider}</b>
                  </Col>
                </Col>
                <Col span={12}>
                  <Col span={24}>Ward Category</Col>
                  <Col span={24}>
                    <b>{Dropdown.PatientsCurrentDetails.WardCategory}</b>
                  </Col>
                </Col>
              </Row>
              <Row style={{ marginTop: "0.5rem" }}>
                <Col span={12}>
                  <Col span={23}>Ward</Col>
                  <Col span={23}>
                    <b>{Dropdown.PatientsCurrentDetails.Ward}</b>
                  </Col>
                </Col>
                <Col span={12}>
                  <Col span={24}>Bed</Col>
                  <Col span={24}>
                    <b>{Dropdown.PatientsCurrentDetails.Bed}</b>
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
              onFinish={handleFinish}
              initialValues={{ DateTimeDischarge: dayjs() }}
            >
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    style={{ marginBottom: "0.9rem" }}
                    name="Department"
                    label="Discharge Advised By"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Please select Reason",
                  //   },
                  // ]}
                  >
                    <Select style={{ width: "100%" }}>
                      {Dropdown.FacilityDepartmentProvider.map((option) => (
                        <Select.Option key={option.ProviderId} value={option.ProviderId}>
                          {option.ProviderName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item hidden
                    name="PatientId"
                    initialValue={Dropdown.PatientsCurrentDetails.PatientID}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item hidden
                    name="EncounterId"
                    initialValue={Dropdown.PatientsCurrentDetails.EncounterId}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item hidden
                    name="Bed"
                    initialValue={Dropdown.PatientsCurrentDetails.BedID}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    style={{ marginBottom: "0.9rem" }}
                    name="DateTimeDischarge"
                    label="Expected Date and Time of Discharge"
                    rules={[
                      {
                        required: true,
                        message: "Please Enter Lookup Description",
                      },
                    ]}
                  >
                    <DatePicker
                      placeholder="Select Date and Time"
                      style={{ width: "100%" }}
                      showTime={{ format: "hh:mm A" }}
                      format="DD-MM-YYYY , hh:mm A"
                      disabledDate={(current) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return current && current < today;
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={32} style={{ height: "1.8rem", marginTop: "8rem" }}>
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

export default RecordExpectedDischarge;
