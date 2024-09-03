import {
    Avatar,
    Badge,
    Button,
    Col,
    Tabs,
    DatePicker,
    Divider,
    Form,
    Input,
    Modal,
    message,
    Row,
    Select,
    Checkbox,
    Table,
    Typography,
} from "antd";
import React, { useEffect, useState } from "react";
const { Text } = Typography;
import male from "../../../../assets/m.png";
import { FcDocument, FcInfo, FcOpenedFolder } from "react-icons/fc";
import { DollarTwoTone, FolderOpenTwoTone } from "@ant-design/icons";
import PatientHeader from "../../../../components/PatientHeader";
import dayjs from "dayjs";


function DischargeModal({ bed, patient, Dropdown, open, handleClose }) {
    const [form] = Form.useForm();
    const [beds, setBeds] = useState([])
    const [bedNumber, setBedNumber] = useState()
    const [blockChecked, setBlockChecked] = useState(false)
    const data = Dropdown.DischargeClearance
    const handleCancel = () => {
        form.resetFields();
        handleClose();
    };

    const Block = (event) => {
        setBlockChecked(event.target.checked)
    }

    const onFinish = async (values) => {
        debugger
        handleCancel();
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

    const columns = [
        {
            title: `Tasks`,
            key: 'DischargeClearanceSetUp',
            dataIndex: 'DischargeClearanceSetUp'
        },
        {
            title: "Tasks Status",
            dataIndex: "ClearanceStatusString",
            key: "ClearanceStatusString",
        },
        {
            title: "Performed By",
            dataIndex: "PerformedBy",
            key: "PerformedBy",
        },
        {
            title: "Perfomed Date",
            dataIndex: "ClearanceDate",
            key: "ClearanceDate",
        },
    ]

    const dischargeHeaders = [
        {
            label: `Tasks`,
            key: 1,
            children: <Table columns={columns} dataSource={data} />
        },
        {
            label: `Discharge`,
            key: 2,
            disabled: true,
            children: <Table columns={columns} dataSource={data} />,
        }
    ]

    return (
        <div>
            <Modal
                width={"70%"}
                height={"auto"}
                centered
                title={
                    <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                        Discharge Patient
                    </span>
                }
                open={open}
                maskClosable={false}
                footer={null}
                onCancel={handleCancel}
            >
                <PatientHeader patient={patient} />
                <Row gutter={24}>
                    <Form
                        style={{ marginTop: "1rem", width: '100%' }}
                        layout="vertical"
                        form={form}
                        onFinish={onFinish}
                    >
                        <div style={{ marginTop: "1.5rem" }} >
                            <Tabs
                                defaultActiveKey="1"
                                type="card"
                                size="small"
                                items={dischargeHeaders}
                            />
                        </div>
                        <Row justify="end">
                            <Col>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Save
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item>
                                    <Button type="default" onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>

                    {/* <Col span={16}>
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
                                        <Select style={{ width: "100%" }} defaultValue={Dropdown.PatientsCurrentDetails.DepartmentId}>
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
                                        <Select style={{ width: "100%" }} defaultValue={Dropdown.PatientsCurrentDetails.ServiceLocationId}>
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
                                        <Select style={{ width: "100%" }} defaultValue={Dropdown.PatientsCurrentDetails.WardCategory}>
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
                                        // initialValue={Dropdown.PatientsCurrentDetails.Ward}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please select",
                                            },
                                        ]}
                                    >
                                        <Select style={{ width: "100%" }}>
                                            {Dropdown.Wards
                                                .filter(option => option.WardID === Dropdown.PatientsCurrentDetails.WardID)
                                                .map(option => (
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
                                        <Select style={{ width: "100%" }}>
                                            {(beds || [])
                                                .map(option => (
                                                    <Select.Option key={option.BedID} value={option.BedID}>
                                                        {option.BedNo} */}
                    {/* {setBedNumber(option.BedNo)} */}
                    {/* </Select.Option>
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
                                        <Checkbox onChange={Block}>Submit</Checkbox>
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
                                </Col> */}
                    {/* </Row>
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
                        </Form> */}
                    {/* </Col> */}
                </Row>
            </Modal>
        </div>
    );
}

export default DischargeModal;
