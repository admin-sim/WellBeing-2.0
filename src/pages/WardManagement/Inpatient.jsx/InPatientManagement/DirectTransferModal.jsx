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
import { urlSaveModal } from "../../../../../endpoints.js";
import dayjs from "dayjs";


function DirectTransferModal({ bed, patient, Dropdown, open, handleClose, handleDropdown }) {
  const [form] = Form.useForm();
  const [beds, setBeds] = useState([])
  const [bedNumber, setBedNumber] = useState()
  const [blockChecked, setBlockChecked] = useState(false)
  const handleCancel = () => {
    form.resetFields();
    handleClose();
  };

  const Block = (event) => {
    setBlockChecked(event.target.checked)
  }

  const onFinish = async (values) => {
    debugger
    const form = {
      DepartmentId: values.Department,
      ProviderId: values.Provider,
      ToServiceLocationId: values.ToServiceLocation,
      FromServiceLocationId: values.FromServiceLocation,
      ToWardId: values.ToWard,
      FromWardId: values.FromWard,
      ToBedId: values.ToBed,
      FromBedId: values.FromBed,
      ReasonforTransfer: values.Reason,
      PatientID: values.PatientId,
      AdtType: 'Direct',
      AdtStatus: 'Direct',
      RetainBed: blockChecked ? 'Y' : 'N',
      dateTransfer: values.DateTimeTransfer ? values.DateTimeTransfer.format("DD-MM-YYYY") : '',
      timeTransfer: values.DateTimeTransfer ? values.DateTimeTransfer.format('HH:mm:ss') : '',
      EncounterId: values.EncounterId,
      ID: 1,
      FromWardCategoryID: values.FromWardCategory,
      ToWardCategoryID: values.ToWardCategory,
      dateBlock: values.BlockTill ? values.BlockTill.format("DD-MM-YYYY") : '',
      timeBlock: values.BlockTill ? values.BlockTill.format('HH:mm:ss') : ''
      // BedNo: bedNumber
    }
    const response = await customAxios.get(
      `${urlSaveModal}?DepartmentId=${form.DepartmentId}&ProviderId=${form.ProviderId}&ToServiceLocationId=${form.ToServiceLocationId}&FromServiceLocationId=${form.FromServiceLocationId}
      &ToWardId=${form.ToWardId}&FromWardId=${form.FromWardId}&FromBedId=${form.FromBedId}&ToBedId=${form.ToBedId}&ReasonforTransfer=${form.ReasonforTransfer}
      &PatientID=${form.PatientID}&AdtType=${form.AdtType}&AdtStatus=${form.AdtStatus}&RetainBed=${form.RetainBed}&dateTransfer=${form.dateTransfer}&timeTransfer=${form.timeTransfer}
      &EncounterId=${form.EncounterId}&ID=${form.ID}&FromWardCategoryID=${form.FromWardCategoryID}
      &ToWardCategoryID=${form.ToWardCategoryID}&dateBlock=${form.dateBlock}&timeBlock=${form.timeBlock}`
    );
    if (response.status === 200 && response.data.data != null) {
      if (response.data.data === 'Failure') {
        message.warning(response.data.data)
        return false;
      } else if (response.data.data === 'Success') {
        message.success(response.data.data)
        handleCancel();
      } else {
        message.warning(response.data.data)
        return false;
      }
    } else {
      console.error("Failed to fetch patient details");
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

  const getDropdown = async (value, SLId, Id, PId) => {
    debugger
    if (Id === 1) {
      form.setFieldsValue({ ToServiceLocation: '' })
      form.setFieldsValue({ ToWardCategory: '' })
      form.setFieldsValue({ ToWard: '' })
      form.setFieldsValue({ ToBed: '' })
    } else if (Id === 2) {
      form.setFieldsValue({ ToWardCategory: '' })
      form.setFieldsValue({ ToWard: '' })
      form.setFieldsValue({ ToBed: '' })
    } else if (Id === 3) {
      form.setFieldsValue({ ToWard: '' })
      form.setFieldsValue({ ToBed: '' })
    } else {
      form.setFieldsValue({ ToBed: '' })
    }
    handleDropdown(value, SLId, Id, PId)
  }

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
                DateTimeTransfer: dayjs(),
                BlockTill: dayjs()
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
                    initialValue={Dropdown.PatientsCurrentDetails.DepartmentId}
                  >
                    <Select style={{ width: "100%" }} defaultValue={Dropdown.PatientsCurrentDetails.DepartmentId}
                      onChange={(value) => getDropdown(value, 0, 1, 0)} placeholder='Select' allowClear>
                      {Dropdown.FacilityDepartment.map((option) => (
                        <Select.Option key={option.FacilityDepartmentId} value={option.FacilityDepartmentId}>
                          {option.DepartmentName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
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
                    name="Provider"
                    label="Provider"
                    rules={[
                      {
                        required: true,
                        message: "Please select Reason",
                      },
                    ]}
                    initialValue={Dropdown.PatientsCurrentDetails.ID}
                  >
                    <Select disabled style={{ width: "100%" }} defaultValue={Dropdown.PatientsCurrentDetails.ID}>
                      <Select.Option key={Dropdown.PatientsCurrentDetails.ID} value={Dropdown.PatientsCurrentDetails.ID}>
                        {Dropdown.PatientsCurrentDetails.Provider}
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item hidden
                    name="FromServiceLocation"
                    initialValue={Dropdown.PatientsCurrentDetails.ServiceLocationId}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    style={{ marginBottom: "0.5rem" }}
                    name="ToServiceLocation"
                    label="Service Location"
                    rules={[
                      {
                        required: true,
                        message: "Please select",
                      },
                    ]}
                    initialValue={Dropdown.PatientsCurrentDetails.ServiceLocationId}
                  >
                    <Select style={{ width: "100%" }} defaultValue={Dropdown.PatientsCurrentDetails.ServiceLocationId}
                      onChange={(value) => getDropdown(value, 0, 2, 0)} placeholder='Select' allowClear>
                      {Dropdown.FacilityDeptServiceLocation.map((option) => (
                        <Select.Option key={option.FacilityDepartmentServiceLocationId} value={option.FacilityDepartmentServiceLocationId}>
                          {option.ServiceLocationName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item hidden
                    name="FromWardCategory"
                    initialValue={Dropdown.PatientsCurrentDetails.WardCategoryID}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    style={{ marginBottom: "0.5rem" }}
                    name="ToWardCategory"
                    label="Ward Category"
                    rules={[
                      {
                        required: true,
                        message: "Please select Reason",
                      },
                    ]}
                    initialValue={Dropdown.PatientsCurrentDetails.WardCategoryID}
                  >
                    <Select style={{ width: "100%" }} defaultValue={Dropdown.PatientsCurrentDetails.WardCategory}
                      onChange={(value) => getDropdown(value, form.getFieldValue('ToServiceLocation'), 3, form.getFieldValue('PatientId'))}
                      placeholder='Select' allowClear>
                      {Dropdown.WardCategory.map((option) => (
                        <Select.Option key={option.LookupID} value={option.LookupID}>
                          {option.LookupDescription}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item hidden
                    name="FromWard"
                    initialValue={Dropdown.PatientsCurrentDetails.WardID}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    style={{ marginBottom: "0.5rem" }}
                    name="ToWard"
                    label="Ward"
                    // initialValue={Dropdown.PatientsCurrentDetails.WardID}
                    rules={[
                      {
                        required: true,
                        message: "Please select",
                      },
                    ]}
                  >
                    <Select style={{ width: "100%" }} onChange={(value) => getDropdown(value, 0, 4, 0)} placeholder='Select' allowClear>
                      {Dropdown.Wards.map(option => (
                        <Select.Option key={option.WardID} value={option.WardID}>
                          {option.WardName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item hidden
                    name="FromBed"
                    initialValue={Dropdown.PatientsCurrentDetails.BedID}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    style={{ marginBottom: "0.5rem" }}
                    name="ToBed"
                    label="Bed"
                    rules={[
                      {
                        required: true,
                        message: "Please select",
                      },
                    ]}
                  >
                    <Select style={{ width: "100%" }} allowClear placeholder='Select'>
                      {(Dropdown.Beds || []).map(option => (
                        <Select.Option key={option.BedID} value={option.BedID}>
                          {option.BedNo}
                          {/* {setBedNumber(option.BedNo)} */}
                        </Select.Option>
                      ))}
                    </Select>
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
                  <Form.Item name="Reason" label="Reason for Transfer"
                    rules={[
                      {
                        required: true,
                        message: "Please select",
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
                  <Form.Item name="Block" valuePropName='checked'>
                    <Checkbox onChange={Block}>Retain Bed</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={24} hidden={!blockChecked}>
                  <Form.Item name="BlockTill" label="Block Till"
                    rules={[
                      {
                        required: blockChecked,
                        message: "Please select",
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
