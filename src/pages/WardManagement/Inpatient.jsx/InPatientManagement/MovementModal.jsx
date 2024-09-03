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
import dayjs from "dayjs";

import PatientHeader from "../../../../components/PatientHeader";

function Movement({ bed, patient, Dropdown, open, handleClose, handleSubmit, handleDropdown }) {
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    handleClose();
  };

  const getDropdown = async (value, SLId, Id, PId) => {
    debugger
    form.setFieldsValue({ ServiceLocation: '' })
    handleDropdown(value, SLId, Id, PId)
  }

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
              onFinish={handleSubmit}
              initialValues={{
                ExpectedReturnTime: dayjs(new Date())
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
                    initialValue={Dropdown.PatientsCurrentDetails.DepartmentId}
                  >
                    <Select style={{ width: "100%" }} placeholder='Select Department' allowClear onChange={(value) => getDropdown(value, 0, 1, 0)}>
                      {Dropdown.FacilityDepartment.map((option) => (
                        <Select.Option key={option.FacilityDepartmentId} value={option.FacilityDepartmentId}>
                          {option.DepartmentName}
                        </Select.Option>
                      ))}
                    </Select>
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
                    initialValue={Dropdown.PatientsCurrentDetails.ServiceLocationId}
                  >
                    <Select style={{ width: "100%" }} placeholder='Select ServiceLocation' allowClear>
                      {Dropdown.FacilityDeptServiceLocation.map((option) => (
                        <Select.Option key={option.FacilityDepartmentServiceLocationId} value={option.FacilityDepartmentServiceLocationId}>
                          {option.ServiceLocationName}
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
                    name="BedId"
                    initialValue={Dropdown.PatientsCurrentDetails.BedID}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    style={{ marginBottom: "0rem" }}
                    name="MovementReason"
                    label="Reason for Movement"
                    rules={[
                      {
                        required: true,
                        message: "Please select Reason",
                      },
                    ]}
                  >
                    <Select style={{ width: "100%" }} >
                      {Dropdown.ReasonForTransfer.map((option) => (
                        <Select.Option key={option.LookupID} value={option.LookupID}>
                          {option.LookupDescription}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    style={{ marginBottom: "3rem" }}
                    name="ExpectedReturnTime"
                    label="Expected Return Time"
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
