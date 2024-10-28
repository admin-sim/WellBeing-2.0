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
import { urlSaveDischargeInitiation } from "../../../../../endpoints.js";
import dayjs from "dayjs";


function AmendDischargeInitiationModal({ bed, patient, Dropdown, open, handleClose }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)
  const handleCancel = () => {
    form.resetFields();
    setLoading(false)
    handleClose();
  };
  const [isDeceased, setIsDeceased] = useState(true)

  const onFinish = async (values) => {
    debugger
    setLoading(true)
    const Amend = {
      Department: (Dropdown.PatientsCurrentDetails || {}).DepartmentId,
      LocationId: bed.ServiceLocationId,
      BedID: bed.BedID,
      PatientID: values.PatientId,
      DischargeAdvisedBy: values.FacilityDepartmentProvider,
      dateExpected: values.ExpectedDateTimeofDischarge.format('DD-MM-YYYY'),
      timeExpected: values.ExpectedDateTimeofDischarge.format('HH:mm:ss'),
      DispositionTypeId: values.DispositionType,
      dateAdvised: values.AdvisedDateTime.format('DD-MM-YYYY'),
      timeAdvised: values.AdvisedDateTime.format('HH:mm:ss'),
      dateDeceased: values.DateDeceased.format('DD-MM-YYYY'),
      timeDeceased: values.DateDeceased.format('HH:mm:ss'),
      DischargeStatus: 'Initiated',
      EncounterId: values.EncounterId,
      AmendReason: values.Reason,
      WardCategoryID: (Dropdown.PatientsCurrentDetails || {}).WardCategoryID
    }
    try {
      const response = await customAxios.get(
        `${urlSaveDischargeInitiation}?Department=${Amend.Department}&LocationId=${Amend.LocationId}&BedID=${Amend.BedID}&PatientID=${Amend.PatientID}&DischargeAdvisedBy=${Amend.DischargeAdvisedBy}&dateExpected=${Amend.dateExpected}&timeExpected=${Amend.timeExpected}&DispositionTypeId=${Amend.DispositionTypeId}
        &dateAdvised=${Amend.dateAdvised}&timeAdvised=${Amend.timeAdvised}&dateDeceased=${Amend.dateDeceased}&timeDeceased=${Amend.timeDeceased}&DischargeStatus=${Amend.DischargeStatus}&EncounterId=${Amend.EncounterId}&AmendReason=${Amend.AmendReason}&WardCategoryID=${Amend.WardCategoryID}`
      );
      if (response.status === 200 && response.data === 'Success') {
        message.success(response.data)
        handleCancel()
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const handleDiseaseDate = (value) => {
    debugger
    if (value == 9070) {
      setIsDeceased(false)
    } else {
      setIsDeceased(true)
    }
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
              initialValues={{
                AdvisedDateTime: dayjs(),
                ExpectedDateTimeofDischarge: dayjs(),
                DateDeceased: dayjs()
              }}
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
                    name="AdvisedDateTime"
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
                      format="DD-MM-YYYY , hh:mm A"
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    style={{ marginBottom: "0.5rem" }}
                    name="ExpectedDateTimeofDischarge"
                    label="Expected Date & Time of Discharge"
                    rules={[
                      {
                        required: true,
                        message: "Please select",
                      },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      showTime={{ format: "hh:mm A" }}
                      format="DD-MM-YYYY , hh:mm A"
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
                        message: "Please select Disposition",
                      },
                    ]}
                  >
                    <Select style={{ width: "100%" }} onChange={handleDiseaseDate} placeholder='Select Disposition'>
                      {Dropdown.DispositionType.map((option) => (
                        <Select.Option key={option.LookupID} value={option.LookupID}>
                          {option.LookupDescription}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24} hidden={isDeceased}>
                  <Form.Item
                    name="DateDeceased"
                    label="Deceased Date & Time"
                    rules={[
                      {
                        required: !isDeceased,
                        message: "Please select",
                      },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      showTime={{ format: "hh:mm A" }}
                      format="DD-MM-YYYY , hh:mm A"
                    />
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
                    <Select style={{ width: "100%" }} placeholder='Select Reason'>
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
                    <Button type="primary" htmlType="submit" loading={loading}>
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

export default AmendDischargeInitiationModal;
