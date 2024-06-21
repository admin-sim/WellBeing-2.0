import React, { useState, useEffect } from "react";
import Layout from 'antd/es/layout/layout';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import {
    Spin,
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

import { urlGetPurshaseOrderDetails, urlSearchPatientIndent } from "../../../endpoints.js";
import customAxios from "../../components/customAxios/customAxios";
//import { format } from 'prettier';
//import { useLocation } from 'react-router-dom';

const PatientIndent = () => {
    const [PatientIndentDropdown, setPatientIndentDropDown] = useState({
        DocumentType: [],
        StoreDetails: [],
        SupplierList: [],
        DateFormat: []
    });
    const [paginationSize, setPaginationSize] = useState(5);
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isTable, setIsTable] = useState(false);
    const { Title } = Typography;

    useEffect(() => {
        try {
            customAxios.get(urlGetPurshaseOrderDetails, {}).then((response) => {
                debugger;
                const apiData = response.data.data;
                setPatientIndentDropDown(apiData);
            });
        } catch (error) {
            console.error("Error fetching purchase order details:", error);
        }
        form.submit();
    }, []);

    const navigate = useNavigate();

    const colorMapping = {
        Created: "blue",
        Draft: "geekblue",
        Pending: "volcano",
        "Partially Pending": "orange",
        Completed: "green",
    };

    const GetIndentById = (IndentId) => {
        debugger;
        navigate("/CreatePatientIndent", { state: { IndentId } });
    };

    const columns = [
        {
            title: "Sl No",
            key: "index",
            render: (text, record, index) => index + 1,
        },
        {
            title: "UHID",
            dataIndex: "UhId",
            key: "UhId",
            sorter: (a, b) => a.UhId - b.UhId,
            sortDirections: ["descend", "ascend"],
            render: (text, record, index) => (
                <Tag>{text}</Tag>
            ),
        },
        {
            title: "Encounter",
            dataIndex: "Encounter",
            key: "Encounter",
            sorter: (a, b) => a.Encounter.localeCompare(b.Encounter),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Patient Name",
            dataIndex: "PatientName",
            key: "PatientName",
            sorter: (a, b) => new Date(a.PatientName) - new Date(b.PatientName),
            sortDirections: ["ascend", "descend"],
            render: (text) => {
                return text;
            },
        },
        {
            title: "Indent Number",
            dataIndex: "IndentNumber",
            key: "IndentNumber",
            sorter: (a, b) => a.IndentNumber.localeCompare(b.IndentNumber),
            sortDirections: ["descend", "ascend"],
            render: (text, record, index) => {
                if (record.IndentStatus === "Created" || record.IndentStatus === "Draft") {
                    return (<Button type="link" onClick={() => GetIndentById(record.IndentId)}>
                        {text}
                    </Button>
                    )
                }
                return (<Tag style={{ marginLeft: '15px' }}>{text}</Tag>);
            },
        },
        {
            title: "Indent Type",
            dataIndex: "IndentType",
            key: "IndentType",
            sorter: (a, b) => a.IndentType.localeCompare(b.IndentType),
            sortDirections: ["descend", "ascend"],
            render: (text) => {
                return text;
            },
        },
        {
            title: "Indent Date",
            dataIndex: "IndentDate",
            key: "IndentDate",
            sorter: (a, b) => a.IndentDate.localeCompare(b.IndentDate),
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
            title: "Issuing Store",
            dataIndex: "IssueStoreName",
            key: "IssueStoreName",
            sorter: (a, b) => a.IssueStoreName.localeCompare(b.IssueStoreName),
            sortDirections: ["descend", "ascend"],
            render: (text) => {
                return (
                    <Tag color={colorMapping[`${text}`]} key={text}>
                        {text}
                    </Tag>
                );
            },
        },
        {
            title: "Indented By",
            dataIndex: "IndentedBy",
            key: "IndentedBy",
            sorter: (a, b) => a.IndentedBy.localeCompare(b.IndentedBy),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Status",
            dataIndex: "IndentStatus",
            key: "IndentStatus",
            sorter: (a, b) => a.IndentStatus.localeCompare(b.IndentStatus),
            sortDirections: ["descend", "ascend"],
            render: (text) => {
                return (
                    <Tag color={colorMapping[`${text}`]} key={text}>
                        {text}
                    </Tag>
                );
            },
        },
        {
            render: (_, row) => (
                <Button type="link">Report</Button>
            ),
        },
    ];

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
        try {
            const postData1 = {
                IndentType: values.IndentType === 0 ? null : values.IndentType,
                // IndentStatus: values.IndentStatus,
                IssuingStoreId: values.IssuingStore === undefined ? 0 : values.IssuingStore,
                IndentStatus: values.POStatus === undefined ? null : values.POStatus,
                FromDate: values.FromDate,
                ToDate: values.ToDate,
                IndentNumber: values.PONumber === undefined ? null : values.PONumber,
            };
            customAxios
                .get(
                    `${urlSearchPatientIndent}?IndentType=${postData1.IndentType}&IndentStatus=${postData1.IndentStatus}&IssuingStoreId=${postData1.IssuingStoreId}&FromDate=${postData1.FromDate}&ToDate=${postData1.ToDate}&IndentNumber=${postData1.IndentNumber}`,
                    null,
                    {
                        params: postData1,
                        headers: {
                            "Content-Type": "application/json", // Replace with the appropriate content type if needed
                        },
                    }
                )
                .then((response) => {
                    debugger;
                    setFilteredData(response.data.data.IndentDetails);
                })
                .finally(() => {
                    setLoading(false);
                });
        } catch (error) {
            // Handle any errors here
            console.error("Error:", error);
        }
        setIsSearchLoading(false);
    };

    const onReset = () => {
        setFilteredData([]);
        form.resetFields();
    };

    return (
        <Layout style={{ zIndex: '999999999' }}>
            <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
                <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
                    <Col span={16}>
                        <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
                            Patient Indent
                        </Title>
                    </Col>
                    <Col offset={5} span={2}>
                        <Button icon={<PlusCircleOutlined />} style={{ marginRight: 0 }} onClick={() => GetIndentById(0)}>
                            Add Patient Indent
                        </Button>
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
                            IndentStatus: 0,
                            IndentType: 0
                        }}
                        onFinish={onFinish}
                    >
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="Indent Type" name="IndentType">
                                    <Select>
                                        <Select.Option key={0} value={0}>All</Select.Option>
                                        <Select.Option key='Effective' value='Effective'></Select.Option>
                                        <Select.Option key='Consumption Based' value='Consumption Based'></Select.Option>
                                        <Select.Option key='Urgent' value='Urgent'></Select.Option>
                                        <Select.Option key='Reorder level Based' value='Reorder level Based'></Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item name="IndentNumber" label="Indent Number">
                                    <Input style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item name="FromDate" label="From Date">
                                    <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item name="ToDate" label="To Date">
                                    <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="Issuing Store" name="IssuingStore">
                                    <Select allowClear placeholder='Select Value'>
                                        {PatientIndentDropdown.StoreDetails.map((option) => (
                                            <Select.Option key={option.StoreId} value={option.StoreId}>
                                                {option.LongName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
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
                <Table display={setIsTable}
                    dataSource={filteredData}
                    columns={columns}
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

export default PatientIndent;
