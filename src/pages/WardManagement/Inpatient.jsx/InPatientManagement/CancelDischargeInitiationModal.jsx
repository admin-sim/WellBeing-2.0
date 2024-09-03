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
import { urlCancelDischargeInitiation, urlSaveModal, urlGetServiceLocation } from "../../../../../endpoints.js";
import dayjs from "dayjs";


function CancelDischargeInitiationModal({ bed, patient, Dropdown, open, handleClose }) {
  const [form] = Form.useForm();
  const [beds, setBeds] = useState([])
  const [bedNumber, setBedNumber] = useState()
  const [blockChecked, setBlockChecked] = useState(false)
  const handleCancel = () => {
    form.resetFields();
    handleClose();
  };

  // const GetBeds = async (value) => {
  //   setBeds([])
  //   try {
  //     const response = await customAxios.get(
  //       `${urlGetBeds}?WardId=${value}&ID=${1}`
  //     );
  //     if (response.status === 200 && response.data.data != null) {
  //       const detailsheader = response.data.data.EncounterModel;
  //       setBeds(response.data.data.Beds);
  //     } else {
  //       console.error("Failed to fetch patient details");
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // }

  const Block = (event) => {
    setBlockChecked(event.target.checked)
  }

  const onFinish = async (values) => {
    debugger
    const cancel = {
      DischargeID: values.DischargeID,
      BedId: values.BedID,
      ReasonForCancelDischargeInitiation: values.Reason,
      DischargeStatus: 'Cancelled',
      PatientID: values.PatientId,
      EncounterId: values.EncounterId
    }
    try {
      const response = await customAxios.get(
        `${urlCancelDischargeInitiation}?DischargeID=${cancel.DischargeID}&BedId=${cancel.BedId}&ReasonForCancelDischargeInitiation=${cancel.ReasonForCancelDischargeInitiation}&DischargeStatus=${cancel.DischargeStatus}&PatientID=${cancel.PatientID}&EncounterId=${cancel.EncounterId}`
      );
      if (response.status === 200 && response.data === "Success") {
        message.success(response.data)
        handleCancel();
      } else {
        console.error("Failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // const DepartChange = async (value) => {
  //   debugger
  //   const response = await customAxios.get(
  //     `${urlGetServiceLocation}?FacilityDepartmentId=${value}&ID=${1}`);
  //   if (response.status === 200 && response.data.data != null) {
  //     Dropdown.FacilityDeptServiceLocation = response.data.data.FacilityDeptServiceLocation
  //   } else {
  //     console.error("Failed to fetch patient details");
  //   }
  // }

  // const fetchServiceLocation = (value) => {
  //   debugger
  //   Dropdown.FacilityDeptServiceLocation = []
  // const departmentValue = form.getFieldValue('Department');
  // if (departmentValue) {
  //   try {
  //     const response = await customAxios.get(
  //       `${urlGetServiceLocation}?FacilityDepartmentId=${departmentValue}&ID=${1}`
  //     );
  //     // setDropdown((prevDropdown) => ({
  //     //   ...prevDropdown,
  //     //   FacilityDeptServiceLocation: response.data.data.FacilityDeptServiceLocation,
  //     // }));
  //     // Dropdown.FacilityDeptServiceLocation = response.data.data.FacilityDeptServiceLocation
  //   } catch (error) {
  //     console.error('Error fetching service location:', error);
  //   }
  // }
  // };

  return (
    <div>
      <Modal
        width={"70%"}
        height={"auto"}
        centered
        title={
          <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>
            Cancel Discharge Initiation
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
                  <Row>
                    <b>Discharge Advised By :</b>
                  </Row>
                  <Row>
                    {Dropdown.DischargeDetails ? Dropdown.DischargeDetails.Provider : 'N/A'}</Row>
                </Col>
                <Col span={24}>
                  <Row>
                    <b>Advised Date&Time :</b>
                  </Row>
                  <Row>{Dropdown.DischargeDetails ? Dropdown.DischargeDetails.AdvisedDateTimeString : 'N/A'}</Row>
                </Col>
                <Col span={24}>
                  <Row>
                    <b>Expected Date & Time of Discharge :</b>
                  </Row>
                  <Row>{Dropdown.DischargeDetails ? Dropdown.DischargeDetails.ExpectedDischargeDateString : 'N/A'}</Row>
                </Col>
                <Col span={24}>
                  <Row>
                    <b>Disposition Type :</b>
                  </Row>
                  <Row>{Dropdown.DischargeDetails ? Dropdown.DischargeDetails.DispositionType : 'N/A'}</Row>
                </Col>
                <Col span={24}>
                  <Form.Item hidden
                    name="PatientId"
                    initialValue={Dropdown.PatientsCurrentDetails.PatientID}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item hidden
                    name="DischargeID"
                    initialValue={Dropdown.DischargeDetails ? Dropdown.DischargeDetails.DischargeId : 'N/A'}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item hidden
                    name="BedID"
                    initialValue={Dropdown.PatientsCurrentDetails.BedID}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item hidden
                    name="EncounterId"
                    initialValue={Dropdown.PatientsCurrentDetails.EncounterId}
                  >
                    <Input />
                  </Form.Item>
                  <Col span={24}>
                    <Form.Item name="Reason" label="Reason for Cancel"
                      rules={[
                        {
                          required: true,
                          message: "Please select",
                        },
                      ]}
                    >
                      <Select style={{ width: "100%" }} >
                        {(Dropdown.ReasonForTransfer || []).map((option) => (
                          <Select.Option key={option.LookupID} value={option.LookupID}>
                            {option.LookupDescription}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
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

export default CancelDischargeInitiationModal;
