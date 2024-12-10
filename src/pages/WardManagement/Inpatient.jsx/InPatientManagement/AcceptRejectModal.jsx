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
    message,
    Modal,
    Row,
    Select,
    TimePicker,
    Tooltip,
    Typography,
} from "antd";
import React, { useState } from "react";
import dayjs from "dayjs";

import PatientHeader from "../../../../components/PatientHeader";
import { useSearchParams } from "react-router-dom";
import { urlSaveAcceptOrReject } from "../../../../../endpoints";
import customAxios from "../../../../components/customAxios/customAxios";

function AcceptRejectModal({ bed, patient, Dropdown, open, handleClose, handleDropdown }) {
    const [form] = Form.useForm();
    const [flag, setFlag] = useState(0)

    const handleCancel = () => {
        form.resetFields();
        handleClose();
    };

    // async function WardChange(params) {
    //     const response = await customAxios.get(
    //         `${urlGetBeds}?WardId=${params}&ID=${1}`
    //     );
    //     if (response.status === 200) {
    //         updatedDropdown((prevDropdown) => {
    //             const updatedDropdown = {
    //                 ...prevDropdown,
    //                 Beds: response.data.data.Beds,
    //             };
    //             return updatedDropdown;
    //         });
    //     }
    // }

    const getDropdown = async (value) => {
        debugger;
        handleDropdown(value);
    }

    function handleStatus(value) {
        debugger
        if (value == 'Accept') {
            setFlag(0)
        } else {
            setFlag(1)
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
                        Confirm/Reject Transfer
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
                            onFinish={async (value) => {
                                debugger
                                const data1 = {
                                    AdtID: value.AdtID,
                                    AssignedBed: value.AssignedBed,
                                    WardID: value.AssignedWard,
                                    ToBedID: value.BedId,
                                    ConfirmationStatus: value.ConfirmationStatus,
                                    PatientId: value.PatientId,
                                    ExecutedStatus: flag == 1 ? 'Reject' : 'Confirmed',
                                    RejectReason: flag == 1 ? value.ReasonForRejection : 0,
                                    AdtStatus: flag == 1 ? 'Reject' : 'Confirmed'
                                }
                                const response = await customAxios.post(urlSaveAcceptOrReject, data1, {
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                });
                                if (response.status === 200 && response == 'Success') {
                                    message.success(response)
                                    handleCancel()
                                } else {
                                    message.error('Failure')
                                }
                            }}
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="PreferredTransferDate"
                                        label="Preferred Transfer Date"
                                    >
                                        <label>{(Dropdown.RequestedPatientDetails || {}).PreferredTime}</label>
                                    </Form.Item>
                                </Col>
                                <br />
                                <Col span={12}>
                                    <Form.Item
                                        name="ReasonForTransfer"
                                        label="Reason For Transfer"
                                    >
                                        <label>{(Dropdown.RequestedPatientDetails || {}).ReasonForTransfer}</label>
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
                                    <Form.Item hidden name="AdtID"
                                        initialValue={(Dropdown.RequestedPatientDetails || {}).AdtId}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                {/* <Col span={24}><b>{Dropdown.PatientsCurrentDetails.ServiceLocationName}</b></Col> */}
                                <Col span={24}>
                                    <Form.Item
                                        name="Department"
                                        label="Department"
                                    >
                                        <label>{(Dropdown.RequestedPatientDetails || {}).DepartmentName}</label>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="Provider"
                                        label="Provider"
                                    >
                                        <label>{(Dropdown.RequestedPatientDetails || {}).Provider}</label>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="ServiceLocation"
                                        label="Service Location"
                                    >
                                        <label>{(Dropdown.RequestedPatientDetails || {}).ServiceLocationName}</label>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="AssignedWard" label="Assigned Ward">
                                        <Select style={{ width: "100%" }} onChange={(value) => getDropdown(value)}>
                                            {Dropdown.Wards.map((option) => {
                                                if (option.WardID !== Dropdown.PatientsCurrentDetails.WardID) {
                                                    if (
                                                        option.Gender === "Both" ||
                                                        option.Gender.toLowerCase() === Dropdown.PatientsCurrentDetails.Gender.toLowerCase()
                                                    ) {
                                                        return (
                                                            <Select.Option key={option.WardID} value={option.WardID}>
                                                                {option.WardName}
                                                            </Select.Option>
                                                        );
                                                    }
                                                }
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="AssignedBed" label="Assigned Bed">
                                        <Select style={{ width: "100%" }}>
                                            {Dropdown.Beds.map((option) => (
                                                <Select.Option key={option.BedID} value={option.BedID}>
                                                    {option.BedNo}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="ConfirmationStatus" label="Confirmation Status">
                                        <Select style={{ width: "100%" }} placeholder='Select' onChange={handleStatus}>
                                            <Select.Option key='Accept'>Accept</Select.Option>
                                            <Select.Option key='Reject'>Reject</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="ReasonForRejection" label="Reason For Rejection" hidden={flag == 0 ? true : false}>
                                        <Select style={{ width: "100%" }}>
                                            {Dropdown.ReasonForRejection.map((option) => (
                                                <Select.Option key={option.LookupID} value={option.LookupID}>
                                                    {option.LookupDescription}
                                                </Select.Option>
                                            ))}
                                        </Select>
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

export default AcceptRejectModal;
