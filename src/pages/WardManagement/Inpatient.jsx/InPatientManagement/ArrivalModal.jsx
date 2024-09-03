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

function ArrivalModal({ bed, patient, Dropdown, open, handleClose, handleSubmit }) {
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
                        Arrival
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
                            // onFinish={(values) => {
                            // debugger
                            // const movement = {
                            //   MovementId: 0,
                            //   Department: values.Department,
                            //   ServiceLocationId: values.ServiceLocation,
                            //   BedID: values.BedId,
                            //   PatientID: values.PatientId,
                            //   MovementReason: values.Reason,
                            //   timeMovement: values.ExpectedReturnTime ? values.ExpectedReturnTime.format('HH:mm:ss') : '',
                            //   Actualtime: 0,
                            //   ReasonforDelay: 0,
                            //   Status: 1
                            // }
                            // handleCancel();
                            // }}
                            initialValues={{
                                ActualTime: dayjs()
                            }}
                        >
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item name="Department" initialValue={Dropdown.PatientsCurrentDetails.DepartmentId} hidden>
                                        <Input />
                                    </Form.Item>
                                    Department
                                </Col>
                                <Col span={24}>
                                    <b>{Dropdown.PatientsCurrentDetails.DepartmentName}</b>
                                </Col>
                                <br />
                                <Col span={24}>
                                    Service Location
                                    <Form.Item name="ServiceLocation" initialValue={Dropdown.PatientsCurrentDetails.ServiceLocationId} hidden>
                                        <Input />
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
                                    <Form.Item hidden name="MovementId"
                                        initialValue={(Dropdown.MovementDetails || {}).MovementId}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24}><b>{Dropdown.PatientsCurrentDetails.ServiceLocationName}</b></Col>
                                <Col span={24}>
                                    Reason for Movement
                                    <Form.Item name="MovementReason" hidden initialValue={(Dropdown.MovementDetails || {}).ReasonId}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24}><b>{(Dropdown.MovementDetails || {}).ReasonForTransfer}</b></Col>
                                <Row>
                                    <Col span={24}>
                                        Expected Return Time
                                        {/* <Form.Item hidden name="ExpectedReturnTime">
                                            <Input />
                                        </Form.Item> */}
                                    </Col>
                                    <Col span={24}><b>{(Dropdown.MovementDetails || {}).ExpectedReturnTime}</b></Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item name="ActualTime" label='ActualTime'>
                                            <TimePicker
                                                style={{ width: "100%" }}
                                                showTime={{ format: "hh:mm A" }}
                                                format="hh:mm A"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Col span={24}>
                                    <Form.Item name="ReasonforDelay" label="Reason for Delay">
                                        <Select style={{ width: "100%" }}>
                                            {Dropdown.ReasonForTransfer.map((option) => (
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

export default ArrivalModal;
