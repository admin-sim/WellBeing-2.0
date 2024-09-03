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
  message,
  Row,
  Select,
  Checkbox,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
const { Text } = Typography;
import male from "../../../../assets/m.png";
import { FcDocument, FcInfo, FcOpenedFolder } from "react-icons/fc";
import { DollarTwoTone, FolderOpenTwoTone } from "@ant-design/icons";
import PatientHeader from "../../../../components/PatientHeader";
import customAxios from '../../../../components/customAxios/customAxios.jsx'
import { urlGetBeds, urlSaveModal, urlGetServiceLocation } from "../../../../../endpoints.js";
import dayjs from "dayjs";


function AmendDischargeInitiationModal({ bed, patient, Dropdown, open, handleClose }) {
  const [form] = Form.useForm();
  const [beds, setBeds] = useState([])
  const [bedNumber, setBedNumber] = useState()
  const [blockChecked, setBlockChecked] = useState(false)
  const handleCancel = () => {
    form.resetFields();
    handleClose();
  };

  const onFinish = async (values) => {
    debugger

    handleCancel();
  }

  return (
    <div>
      <Modal
        width={"70%"}
        height={"auto"}
        centered
        title={
          <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>
            Amend Discharge Initiation
          </span>
        }
        open={open}
        maskClosable={false}
        footer={null}
        onCancel={handleCancel}
      >
        <PatientHeader patient={patient} />
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
          <Col span={16}>
            <Form
              style={{ marginTop: "1rem" }}
              layout="vertical"
              form={form}
              onFinish={onFinish}
            >
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    style={{ marginBottom: "0.5rem" }}
                    name="FacilityDepartmentProvider"
                    label="Discharge Advised By"
                    rules={[
                      {
                        required: true,
                        message: "Please select Reason",
                      },
                    ]}
                    initialValue={Dropdown.PatientsCurrentDetails.ProviderId}
                  >
                    <Select style={{ width: "100%" }} defaultValue={Dropdown.PatientsCurrentDetails.ProviderId}>
                      {Dropdown.FacilityDepartmentProvider.map((option) => (
                        <Select.Option key={option.ProviderId} value={option.ProviderId}>
                          {option.ProviderName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
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
                  <Form.Item
                    style={{ marginBottom: "0.5rem" }}
                    name="AdvisedDate&Time"
                    label="Advised Date&Time"
                    rules={[
                      {
                        required: true,
                        message: "Please select Reason",
                      },
                    ]}
                    // initialValue={Dropdown.DischargeDetails.AdvisedDateTime}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      showTime={{ format: "hh:mm A" }}
                      format="dddd , DD-MM-YYYY , hh:mm A"
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    style={{ marginBottom: "0.5rem" }}
                    name="ExpectedDate&TimeofDischarge"
                    label="Expected Date & Time of Discharge"
                    rules={[
                      {
                        required: true,
                        message: "Please select",
                      },
                    ]}
                    // initialValue={Dropdown.DischargeDetails.ExpectedDischargeDate}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      showTime={{ format: "hh:mm A" }}
                      format="dddd , DD-MM-YYYY , hh:mm A"
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    style={{ marginBottom: "0.5rem" }}
                    name="DispositionType"
                    label="Disposition Type"
                    rules={[
                      {
                        required: true,
                        message: "Please select Reason",
                      },
                    ]}
                  >
                    <Select style={{ width: "100%" }}>
                      {Dropdown.DispositionType.map((option) => (
                        <Select.Option key={option.LookupID} value={option.LookupID}>
                          {option.LookupDescription}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    style={{ marginBottom: "0.5rem" }}
                    name="Reason"
                    label="Reason"
                    rules={[
                      {
                        required: true,
                        message: "Please select",
                      },
                    ]}
                  >
                    <Select style={{ width: "100%" }}>
                      {(Dropdown.ReasonForAmend || []).map(option => (
                        <Select.Option key={option.LookupID} value={option.LookupID}>
                          {option.LookupDescription}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={32} style={{ height: "1.8rem" }}>
                <Col offset={17} span={3}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Save
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

export default AmendDischargeInitiationModal;
