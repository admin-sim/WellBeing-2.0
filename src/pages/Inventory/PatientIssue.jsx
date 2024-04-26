import React, { useState, useEffect } from "react";
import Layout from 'antd/es/layout/layout';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import {
    AutoComplete,
    Skeleton,
    Tag,
    Typography,
    Select,
    Button,
    Form,
    Input,
    Row,
    Col,
    DatePicker,
    Card,
    Divider,
    Tooltip,
    Table,
} from "antd";
//import { CloseSquareFilled } from '@ant-design/icons';
import { useNavigate } from "react-router";

import { urlGetPurshaseOrderDetails, urlSearchPatientIssue, urlSearchUHID, urlGetAllEncounterByUhid } from "../../../endpoints.js";
import customAxios from "../../components/customAxios/customAxios";
//import { format } from 'prettier';
//import { useLocation } from 'react-router-dom';

const PatientIssue = () => {
    const [PatientIssueDropdown, setPatientIssueDropDown] = useState({
        DocumentType: [],
        StoreDetails: [],
        SupplierList: [],
        DateFormat: [],
        Patient: []
    });
    const [paginationSize, setPaginationSize] = useState(5);
    const [filteredData, setFilteredData] = useState([]);
    const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isTable, setIsTable] = useState(false);
    const { Title } = Typography;
    const [patientName, setPatientName] = useState();

    useEffect(() => {
        try {
            customAxios.get(urlGetPurshaseOrderDetails, {}).then((response) => {
                debugger;
                const apiData = response.data.data;
                setPatientIssueDropDown(apiData);
            });
        } catch (error) {
            console.error("Error fetching purchase order details:", error);
        }
    }, []);

    const colorMapping = {
        Created: "blue",
        Draft: "geekblue",
        Pending: "volcano",
        "Partially Pending": "orange",
        Completed: "green",
    };

    const GetModelDetails = (text, record, index) => {
        debugger;
        console.log("welcome");
    };
    const columns = [
        {
            title: "Sl No",
            key: "index",
            render: (text, record, index) => index + 1,
        },
        {
            title: "Issue Number",
            dataIndex: "IssueNumber",
            key: "IssueNumber",
            sorter: (a, b) => a.IssueNumber - b.IssueNumber,
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Indent Number",
            dataIndex: "IndentNumber",
            key: "IndentNumber",
            sorter: (a, b) => a.IndentNumber.localeCompare(b.IndentNumber),
            sortDirections: ["descend", "ascend"],
            render: (text, record, index) => {
                if (record.IssueStatus === "Created" || record.IssueStatus === "Draft") {
                    return (<Button type="link" onClick={() => GetModelDetails(text, record, index)}>
                        {text}
                    </Button>
                    )
                }
                return (<Tag style={{ marginLeft: '15px' }}>{text}</Tag>);
            },
        },
        {
            title: "Order Date",
            dataIndex: "IndentDate",
            key: "IndentDate",
            sorter: (a, b) => new Date(a.IndentDate) - new Date(b.IndentDate),
            sortDirections: ["descend", "ascend"],
            render: (text) => {
                const dateParts = text.split('T')[0].split('-');
                const year = dateParts[0];
                const month = dateParts[1];
                const day = dateParts[2];

                return `${day}-${month}-${year}`;
            },
        },
        {
            title: "UHID",
            dataIndex: "UhId",
            key: "UhId",
            sorter: (a, b) => a.UhId.localeCompare(b.UhId),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Name",
            dataIndex: "PatientName",
            key: "PatientName",
            sorter: (a, b) => a.PatientName.localeCompare(b.PatientName),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Order By",
            // dataIndex: "OrderBy",
            // key: "OrderBy",
            // sorter: (a, b) => a.OrderBy.localeCompare(b.OrderBy),
            // sortDirections: ["descend", "ascend"],
        },
        {
            title: "Priority",
            dataIndex: "IndentType",
            key: "IndentType",
            sorter: (a, b) => a.IndentType.localeCompare(b.IndentType),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Indent Status",
            dataIndex: "IndentStatus",
            key: "IndentStatus",
            sorter: (a, b) => a.IndentStatus.localeCompare(b.IndentStatus),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Issue Status",
            dataIndex: "IssueStatus",
            key: "IssueStatus",
            sorter: (a, b) => a.IssueStatus.localeCompare(b.IssueStatus),
            sortDirections: ["descend", "ascend"],
        },
        {
            render: (_, row) => (
                <Button type="link">Report</Button>
            ),
        },
    ];

    const getPanelValue = async (searchText) => {
        debugger;
        try {
            customAxios.get(`${urlSearchUHID}?Uhid=${searchText}`).then((response) => {
                const apiData = response.data.data;
                const newOptions = apiData.map(item => ({ value: item.UhId, key: item.UhId, Name: item.PatientFirstName + ' ' + item.PatientLastName }));
                setAutoCompleteOptions(newOptions);
            });
        } catch (error) {
            //console.error("Error fetching purchase order details:", error);        
        }
    }

    const handleSelect = (value, option) => {
        debugger;
        setPatientName(option.Name);
        try {
            customAxios.get(`${urlGetAllEncounterByUhid}?Uhid=${option.key}`).then((response) => {
                debugger;
                const apiData = response.data.data;
            });
        } catch (error) {
            //console.error("Error fetching purchase order details:", error);        
        }
    }
    // const handleSearch = (value) => {
    //   setSearchText(value);
    //   if (value === '') {
    //     setFilteredData(loadUsers);
    //   } else {
    //     const filtered = loadUsers.filter(entry =>
    //       Object.values(entry).some(val =>
    //         val && val.toString().toLowerCase().includes(value.toLowerCase())
    //       )
    //     );
    //     setFilteredData(filtered);
    //   }
    // };

    /* const validateUserRole = (rule, value) => {
       if (value) {
         const existsInOptions = originalOptions.some(option => option.LookupDescription === value);
         if (!existsInOptions) {
           return Promise.reject('Please select a valid UserRole from the list.');
         }
       }
       return Promise.resolve();
     };*/

    const handleSubmit = (values) => {
        // Handle form submission logic here
        console.log("Form submitted with values:", values);

        console.log("Form Values:", values);
        //const uhid = selectedUhId ? selectedUhId.UhId : '';

        // ... Repeat for other parameters
    };
    const [formatedFromDate, setFormatedFromDate] = useState();
    const [formatedToDate, setFormatedToDate] = useState();
    function formatDate(inputDate) {
        const dateParts = inputDate.split("/");
        if (dateParts.length === 3) {
            const [year, month, day] = dateParts;
            return `${day}-${month}-${year}`;
        }
        return inputDate; // Return as is if not in the expected format
    }
    const onFinish = async (values) => {
        debugger;
        const postData1 = {
            IndentType: values.IndentType === 0 ? "0" : values.IndentType,
            IssueStatus: values.IssueStatus === 0 ? "0" : values.IssueStatus,
            IssuingStoreId: values.IssuingStore === undefined ? 0 : values.IssuingStore,
            IndentStatus: values.IndentStatus === 0 ? null : values.IndentStatus,
            FromDate: values.FromDate,
            ToDate: values.ToDate,
            IndentNumber: values.IndentNumber === undefined ? null : values.IndentNumber,
            PatientType: values.PatientType === 0 ? null : values.PatientType,
            PatientName: values.PatientName === undefined ? null : values.PatientName,
            Encounter: values.Encounter === undefined ? null : values.Encounter,
            UHID: values.UHID === undefined ? null : values.undefined,
        };
        try {
            const response = await customAxios.post(urlSearchPatientIssue, postData1);
            debugger;
            setFilteredData(response.data.data.newIndentIssueModel);
        } catch (error) {

        }
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <Layout style={{ zIndex: '999999999' }}>
            <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
                <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
                    <Col span={16}>
                        <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
                            Patient Issue
                        </Title>
                    </Col>
                </Row>
                <Card>
                    <Form
                        form={form}
                        name="control-hooks"
                        layout="vertical"
                        variant="outlined"
                        size="Default"
                        style={{
                            maxWidth: 1500,
                        }}
                        initialValues={{
                            FromDate: dayjs().subtract(1, 'day'),
                            ToDate: dayjs(),
                            IndentType: 0,
                            PatientType: 0,
                            IssueStatus: 0,
                            IndentStatus: 0,                            
                        }}
                        onFinish={onFinish}
                    >
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={8}>
                                <Form.Item
                                    label="Issuing Store"
                                    name="IssuingStore"
                                >
                                    <Select allowClear placeholder='Select Value'>
                                        {PatientIssueDropdown.StoreDetails.map((option) => (
                                            <Select.Option key={option.StoreId} value={option.StoreId}>
                                                {option.LongName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <Form.Item name="UHID" label="UHID">
                                    <AutoComplete
                                        options={autoCompleteOptions}
                                        // options={autoCompleteOptions[record.key]}
                                        onSearch={getPanelValue}                                        
                                        onSelect={(value, option) => handleSelect(value, option)}
                                        placeholder="Search for a Uhid"
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <Form.Item name="PatientName" label="Patient Name">
                                    <Input value={patientName} allowClear style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item name="Encounter" label="Encounter">
                                    <Select allowClear disabled>
                                        {/* {PatientIssueDropdown.DocumentType.map((option) => (
                                        <Select.Option key={option.LookupID} value={option.LookupID}>
                                            {option.LookupDescription}
                                        </Select.Option>
                                    ))} */}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <Form.Item name="OrderId" label="OrderId">
                                    <Input allowClear style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <Form.Item label="Indent Number" name="IndentNumber">
                                    <Input allowClear style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item label="Indent Type" name="IndentType">
                                    <Select>
                                        <Select.Option key={0} value={0}>All</Select.Option>
                                        <Select.Option key="Effective" value="Effective"></Select.Option>
                                        <Select.Option key="Consumption Based" value="Consumption Based"></Select.Option>
                                        <Select.Option key="Urgent" value="Urgent"></Select.Option>
                                        <Select.Option key="Record Level Based" value="Record Level Based"></Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <Form.Item label="From Date" name="FromDate">
                                    <DatePicker style={{ width: '100%' }} format='DD-MM-YYYY' />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <Form.Item label="To Date" name="ToDate">
                                    <DatePicker style={{ width: '100%' }} format='DD-MM-YYYY' />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item label="Patient Type" name="PatientType">
                                    <Select>
                                        <Select.Option key={0} value={0}>All</Select.Option>
                                        {PatientIssueDropdown.Patient.map((option) => (
                                            <Select.Option key={option.LookupID} value={option.LookupID}>
                                                {option.LookupDescription}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <Form.Item label="Indent Status" name="IndentStatus">
                                    <Select>
                                        <Select.Option key={0} value={0}>All</Select.Option>
                                        <Select.Option key="Draft" value="Draft"></Select.Option>
                                        <Select.Option key="Pending" value="Pending"></Select.Option>
                                        <Select.Option key="Partially Pending" value="Partially Pending"></Select.Option>
                                        <Select.Option key="Completed" value="Completed"></Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <Form.Item label="Issue Status" name="IssueStatus">
                                    <Select>
                                        <Select.Option key={0} value={0}>All</Select.Option>
                                        <Select.Option key="Draft" value="Draft"></Select.Option>
                                        <Select.Option key="Finalize" value="Finalize"></Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="end">
                            <Col>
                                <Form.Item>
                                    <Button type="primary" loading={isSearchLoading} htmlType="submit">
                                        Search
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item>
                                    <Button type="default" onClick={onReset}>
                                        Reset
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Table display={setIsTable} dataSource={filteredData} columns={columns}
                    pagination={{
                        onChange: (current, pageSize) => {
                            setPage(current);
                            setPaginationSize(pageSize);
                        },
                        defaultPageSize: 5,
                        hideOnSinglePage: true,
                        showSizeChanger: true,
                        showTotal: (total, range) =>
                            `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                    }}
                    rowKey={(row) => row.AppUserId}
                    size="small"
                    bordered
                />
            </div>
        </Layout>
    );
};

export default PatientIssue;
