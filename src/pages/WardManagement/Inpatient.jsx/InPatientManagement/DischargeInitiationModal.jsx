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
  message,
  Select,
} from "antd";
import React, { useState } from "react";
import PatientHeader from "../../../../components/PatientHeader";
import customAxios from '../../../../components/customAxios/customAxios.jsx'
import { urlSaveDischargeInitiation } from "../../../../../endpoints.js";
import dayjs from "dayjs";

function DischargeInitiationModal({ bed, patient, Dropdown, open, handleClose }) {
  const [form] = Form.useForm();
  const [provider, setProvider] = useState(true)
  const [disposition, setDisposition] = useState(true)
  const handleCancel = () => {
    setProvider(true)
    setDisposition(true)
    form.resetFields();
    handleClose();
  };

  const SelectProvider = (e) => {
    debugger
    if (e) {
      setProvider(false)

    } else {
      setProvider(true)

    }
  }

  const SelectDisposition = (e) => {
    debugger
    if (e) {
      if (e === 9070) {
        setDisposition(false)
      }
      else {
        setDisposition(true)
      }
    } else {
      setDisposition(true)
    }
  }

  return (
    <div>
      <Modal
        width={"60%"}
        height={"auto"}
        centered
        title={
          <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>
            Discharge Initiation
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
              onFinish={async (values) => {
                debugger
                const discharge = {
                  Department: values.Department,
                  ServiceLocationId: values.LocationId,
                  BedID: values.BedId,
                  PatientID: values.PatientId,
                  DischargeAdvisedBy: values.Provider,
                  dateExpected: values.ExpectedDateTime ? values.ExpectedDateTime.format('DD-MM-YYYY') : '',
                  timeExpected: values.ExpectedDateTime ? values.ExpectedDateTime.format('HH:mm:ss') : '',
                  DispositionTypeId: values.DispositionType,
                  dateAdvised: values.AdvisedDateTime ? values.AdvisedDateTime.format('DD-MM-YYYY') : '',
                  timeAdvised: values.AdvisedDateTime ? values.AdvisedDateTime.format('HH:mm:ss') : '',
                  dateDeceased: !disposition ? values.DeceasedDateTime.format('DD-MM-YYYY') : null,
                  timeDeceased: !disposition ? values.DeceasedDateTime.format('HH:mm:ss') : null,
                  DischargeStatus: 'Initiated',
                  EncounterId: values.EncounterId,
                  AmendReason: 0,
                  WardCategoryID: values.WardCategoryID
                };
                try {
                  const response = await customAxios.get(
                    `${urlSaveDischargeInitiation}?Department=${discharge.Department}&LocationId=${discharge.ServiceLocationId}&BedID=${discharge.BedID}&PatientID=${discharge.PatientID}&DischargeAdvisedBy=${discharge.DischargeAdvisedBy}&dateExpected=${discharge.dateExpected}&timeExpected=${discharge.timeExpected}&ID=${discharge}&DispositionTypeId=${discharge.DispositionTypeId}
                    &dateAdvised=${discharge.dateAdvised}&timeAdvised=${discharge.timeAdvised}&dateDeceased=${discharge.dateDeceased}&timeDeceased=${discharge.timeDeceased}&DischargeStatus=${discharge.DischargeStatus}&EncounterId=${discharge.EncounterId}&AmendReason=${discharge.AmendReason}&WardCategoryID=${discharge.WardCategoryID}`
                  );
                  if (response.status === 200 && response.data === 'Success') {
                    message.success(response.data)
                    handleCancel()
                  }
                } catch (error) {
                  console.error("Error:", error);
                }
                // form.resetFields()
                // handleCancel();
              }}
              initialValues={{
                ExpectedDateTime: dayjs(),
                AdvisedDateTime: dayjs(),
                DeceasedDateTime: dayjs()
              }}
            >
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    // style={{ marginBottom: "0.9rem" }}
                    name="ExpectedDateTime"
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
                      format="dddd , DD-MM-YYYY , hh:mm A"
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name="Provider"
                    label="Discharge Advised By"
                    rules={[
                      {
                        required: true,
                        message: "Please select Reason",
                      },
                    ]}
                  >
                    <Select style={{ width: "100%" }} placeholder='Select Provider' allowClear onChange={SelectProvider}>
                      {Dropdown.FacilityDepartmentProvider.map((option) => (
                        <Select.Option key={option.ProviderId} value={option.ProviderId}>
                          {option.ProviderName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item hidden={provider}
                    name="AdvisedDateTime"
                    label="Advised Date&Time"
                    rules={[
                      {
                        required: true,
                        message: "Please Enter",
                      },
                    ]}
                  >
                    <DatePicker
                      placeholder="Select Date and Time"
                      style={{ width: "100%" }}
                      showTime={{ format: "hh:mm A" }}
                      format="dddd , DD-MM-YYYY , hh:mm A"
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name="DispositionType"
                    label="Disposition Type"
                    rules={[
                      {
                        required: true,
                        message: "Please select Reason",
                      },
                    ]}
                  >
                    <Select style={{ width: "100%" }} allowClear onChange={SelectDisposition}>
                      {Dropdown.DispositionType.map((option) => (
                        <Select.Option key={option.LookupID} value={option.LookupID}>
                          {option.LookupDescription}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item hidden={disposition}
                    name="DeceasedDateTime"
                    label="Deceased Date&Time"
                    rules={[
                      {
                        required: true,
                        message: "Please Enter",
                      },
                    ]}
                  >
                    <DatePicker
                      placeholder="Select Date and Time"
                      style={{ width: "100%" }}
                      showTime={{ format: "hh:mm A" }}
                      format="dddd , DD-MM-YYYY , hh:mm A"
                    />
                  </Form.Item>
                  <Form.Item hidden name="PatientId" initialValue={Dropdown.PatientsCurrentDetails.PatientID}>
                    <Input />
                  </Form.Item>
                  <Form.Item hidden name="EncounterId" initialValue={Dropdown.PatientsCurrentDetails.EncounterId}>
                    <Input />
                  </Form.Item>
                  <Form.Item hidden name="LocationId" initialValue={Dropdown.PatientsCurrentDetails.ServiceLocationId}>
                    <Input />
                  </Form.Item>
                  <Form.Item hidden name="BedId" initialValue={Dropdown.PatientsCurrentDetails.BedID}>
                    <Input />
                  </Form.Item>
                  <Form.Item hidden name="WardCategoryID" initialValue={Dropdown.PatientsCurrentDetails.WardCategoryID}>
                    <Input />
                  </Form.Item>
                  <Form.Item hidden name="Department" initialValue={Dropdown.PatientsCurrentDetails.DepartmentId}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={32} style={{ height: "1.8rem", marginTop: "3rem" }}>
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

export default DischargeInitiationModal;
