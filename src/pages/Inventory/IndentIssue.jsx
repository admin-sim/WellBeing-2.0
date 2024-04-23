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

import { urlGetPurshaseOrderDetails, urlSearchIndentIssue } from "../../../endpoints.js";
import customAxios from "../../components/customAxios/customAxios";
//import { format } from 'prettier';
//import { useLocation } from 'react-router-dom';

const IndentIssue = () => {
    const [IndentIssueDropdown, setIndentIssueDropDown] = useState({
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
    const navigate = useNavigate();

    useEffect(() => {
        try {
            customAxios.get(urlGetPurshaseOrderDetails, {}).then((response) => {
                const apiData = response.data.data;
                setIndentIssueDropDown(apiData);
            });
        } catch (error) {
            console.error("Error fetching purchase order details:", error);
        }
        form.submit();
    }, []);

    const colorMapping = {
        Created: "blue",
        Draft: "geekblue",
        Pending: "volcano",
        "Partially Pending": "orange",
        Completed: "green",
    };

    const GetIndentById = (IndentId) => {
        navigate("/UpdateIndentIssue", { state: { IndentId } });
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
            title: "Indent Type",
            dataIndex: "IndentType",
            key: "IndentType",
            sorter: (a, b) => a.IndentType.localeCompare(b.IndentType),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Indent Number",
            dataIndex: "IndentNumber",
            key: "IndentNumber",
            sorter: (a, b) => new Date(a.IndentNumber) - new Date(b.IndentNumber),
            sortDirections: ["descend", "ascend"],
            render: (text, record, index) => {
                if (record.IndentStatus === "Pending" || record.IndentStatus == "Created") {
                    return (<Button type="link" onClick={() => GetIndentById(record.IndentId)}>
                        {text}
                    </Button>
                    )
                }
                return (<Tag style={{ marginLeft: '15px' }}>{text}</Tag>);
            },
        },
        {
            title: "Indent Date",
            dataIndex: "IndentDate",
            key: "IndentDate",
            sorter: (a, b) => a.IndentDate.localeCompare(b.IndentDate),
            sortDirections: ["descend", "ascend"],
            render: (text) => {
                if (text !== null) {
                    const dateParts = text.split('T')[0].split('-');
                    const year = dateParts[0];
                    const month = dateParts[1];
                    const day = dateParts[2];

                    return `${day}-${month}-${year}`;
                }
            },
        },
        {
            title: "Issue Date",
            dataIndex: "IssueDate",
            key: "IssueDate",
            sorter: (a, b) => a.IssueDate.localeCompare(b.IssueDate),
            sortDirections: ["descend", "ascend"],
            render: (text) => {
                if (text !== null) {
                    const dateParts = text.split('T')[0].split('-');
                    const year = dateParts[0];
                    const month = dateParts[1];
                    const day = dateParts[2];

                    return `${day}-${month}-${year}`;
                }
            },
        },
        {
            title: "Issueing Store",
            dataIndex: "IssueStoreName",
            key: "IssueStoreName",
            sorter: (a, b) => a.IssueStoreName.localeCompare(b.IssueStoreName),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Requesting Location",
            dataIndex: "StoreName",
            key: "StoreName",
            sorter: (a, b) => a.StoreName.localeCompare(b.StoreName),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Document Owner",
            dataIndex: "DocumentOwner",
            key: "DocumentOwner",
            sorter: (a, b) => a.DocumentOwner.localeCompare(b.DocumentOwner),
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
        setIsSearchLoading(true);
        setLoading(true);
        try {
            const postData1 = {
                IndentNumber: values.IndentNumber === undefined ? null : values.IndentNumber,
                IndentType: values.IndentType === 0 ? null : values.IndentType,
                RequestingStoreId: values.RequestingStore === undefined ? 0 : values.RequestingStore,
                IssuingStoreId: values.IssuingStore === undefined ? 0 : values.IssuingStore,
                FromDate: values.FromDate,
                ToDate: values.ToDate,
                IndentStatus: values.IndentStatus === 0 ? null : values.IndentStatus,
                IndentOwner: values.IndentOwner === undefined ? null : values.IndentOwner,
                IssueStatus: values.IndentStatus === 0 ? null : values.IndentStatus
            };
            customAxios
                .get(
                    `${urlSearchIndentIssue}?IndentNumber=${postData1.IndentNumber}&IndentType=${postData1.IndentType}&RequestingStoreId=${postData1.RequestingStoreId}&IssuingStoreId=${postData1.IssuingStoreId}&FromDate=${postData1.FromDate}&ToDate=${postData1.ToDate}&IndentStatus=${postData1.IndentStatus}&IndentOwner=${postData1.IndentOwner}&IssueStatus=${postData1.IssueStatus}`,
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
        form.resetFields();
    };

    return (
        <Layout style={{ zIndex: '999999999' }}>
            <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
                <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
                    <Col span={16}>
                        <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
                            Indent Issue
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
                            IndentStatus: 0,
                            IndentType: 0,
                            IssueStatus: 0,
                        }}
                        onFinish={onFinish}
                    >
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="Indent Type" name="IndentType">
                                    <Select>
                                        <Select.Option key={0} value={0}>All</Select.Option>
                                        {IndentIssueDropdown.DocumentType.map((option) => (
                                            <Select.Option key={option.LookupID} value={option.LookupID}>
                                                {option.LookupDescription}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item name="IndentNumber" label="Indent Number">
                                    <Input style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <Form.Item name="FromDate" label="From Date">
                                    <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
                                </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={4}>
                                <Form.Item name="ToDate" label="To Date">
                                    <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <Form.Item label="Issuing Store" name="IssuingStore">
                                    <Select allowClear placeholder='Select Value'>
                                        {IndentIssueDropdown.StoreDetails.map((option) => (
                                            <Select.Option key={option.StoreId} value={option.StoreId}>
                                                {option.LongName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={6}>
                                <Form.Item name="RequestingStore" label="Requesting Store">
                                    <Select allowClear placeholder='Select Value'>
                                        {IndentIssueDropdown.StoreDetails.map((option) => (
                                            <Select.Option key={option.StoreId} value={option.StoreId}>
                                                {option.LongName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="Indent Owner" name="IndentOwner">
                                    <Input style={{ width: '100%' }}></Input>
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
                <Table display={setIsTable}
                    dataSource={filteredData}
                    columns={columns}
                    pagination={{
                        onChange: (current, pageSize) => {
                            setPage(current);
                            setPaginationSize(pageSize);
                        },
                        defaultPageSize: 5, // Set your default pagination size
                        hideOnSinglePage: true,
                        showSizeChanger: true,
                        showTotal: (total, range) =>
                            `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                    }}
                    rowKey={(row) => row.AppUserId} // Specify the custom id property here
                    size="small"
                    bordered
                />
            </div>
        </Layout>
    );
};

export default IndentIssue;
