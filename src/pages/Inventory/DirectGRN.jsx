import React, { useState, useEffect } from "react";
import Layout from 'antd/es/layout/layout';
import {
    EditOutlined,
    DeleteOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
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

import { urlGetPurshaseOrderDetails, urlSearchGRN } from "../../../endpoints.js";
import customAxios from "../../components/customAxios/customAxios";
import { render } from "react-dom";
//import { format } from 'prettier';
//import { useLocation } from 'react-router-dom';

const DirectGRN = () => {
    const [DirectGRNDropdown, setDirectGRNDropDown] = useState({
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
    const [isTableHasValues, setIsTableHasValues] = useState(false);

    useEffect(() => {
        try {
            customAxios.get(urlGetPurshaseOrderDetails, {}).then((response) => {
                debugger;
                const apiData = response.data.data;
                setDirectGRNDropDown(apiData);                
            });
        } catch (error) {
            console.error("Error fetching purchase order details:", error);
        }
        form.submit();
    }, []);

    const navigate = useNavigate();
    const handleAddTemplate = () => {
        navigate(`/CreateDirectGRN`);
    };

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
            title: "GRN Number",
            dataIndex: "GRNNumber",
            key: "GRNNumber",
            sorter: (a, b) => a.GRNNumber - b.GRNNumber,
            sortDirections: ["descend", "ascend"],
            render: (text, record, index) => {
                if (record.GRNStatus === "Created" || record.GRNStatus === "Draft") {
                    return (<Button type="link" onClick={() => GetModelDetails(text, record, index)}>
                        {text}
                    </Button>
                    )
                }
                return (<Tag style={{ marginLeft: '15px' }}>{text}</Tag>);
            },
        },
        {
            title: "Document Type",
            dataIndex: "DocumentTypeName",
            key: "DocumentTypeName",
            sorter: (a, b) => a.DocumentTypeName.localeCompare(b.DocumentTypeName),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "GRN Date",
            dataIndex: "GRNDate",
            key: "GRNDate",
            sorter: (a, b) => new Date(a.GRNDate) - new Date(b.GRNDate),
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
            title: "Supplier",
            dataIndex: "SupplierName",
            key: "SupplierName",
            sorter: (a, b) => a.SupplierName.localeCompare(b.SupplierName),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Store",
            dataIndex: "StoreName",
            key: "StoreName",
            sorter: (a, b) => a.StoreName.localeCompare(b.StoreName),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "GRN Owner",
            dataIndex: "GRNOwner",
            key: "GRNOwner",
            sorter: (a, b) => a.GRNOwner.localeCompare(b.GRNOwner),
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "GRN Status",
            dataIndex: "GRNStatus",
            key: "GRNStatus",
            sorter: (a, b) => a.GRNStatus.localeCompare(b.GRNStatus),
            sortDirections: ["descend", "ascend"],
            render: (text) => {
                return (
                    <Tag color={colorMapping[`${text}`]} key={text}>
                        {text.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: "Invoice Number",
            dataIndex: "InvoiceNumber",
            key: "InvoiceNumber",
            sorter: (a, b) => a.InvoiceNumber.localeCompare(b.InvoiceNumber),
            sortDirections: ["descend", "ascend"],
            render: (text) => {
                return (
                    <Tag style={{ marginLeft: '15px' }}>{text}</Tag>
                );
            },
        },
        {
            render: (_, row) => (
                <Button type="link">Report</Button>
            )
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
                DocumentType: values.DocumentType,
                Supplier: values.Supplier === undefined ? 0 : values.Supplier,
                ReceivingStore: values.ProcurementStore === undefined ? 0 : values.ProcurementStore,
                GRNStatus: values.GRNStatus === 0 ? null : values.GRNStatus,
                FromDate: values.FromDate,
                ToDate: values.ToDate,
                GRNNumber: values.GRNNumber === undefined ? null : values.GRNNumber,
                GrnType: "Direct GRN"
            };
            customAxios
                .get(
                    `${urlSearchGRN}?DocumentType=${postData1.DocumentType}&Supplier=${postData1.Supplier}&ReceivingStore=${postData1.ReceivingStore}&GRNStatus=${postData1.GRNStatus}&FromDate=${postData1.FromDate}&ToDate=${postData1.ToDate}&GRNNumber=${postData1.GRNNumber}&GrnType=${postData1.GrnType}`,
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
                    setFilteredData(response.data.data.GRNAgainstPODetails);
                    if (response.data.data.GRNAgainstPODetails.length > 0) {
                        setIsTableHasValues(true);
                    } else {
                        setIsTableHasValues(false);
                    }
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
        setIsTableHasValues(false);
        form.resetFields();
    };

    return (
        <Layout style={{ zIndex: '999999999' }}>
            <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
                <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
                    <Col span={16}>
                        <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
                            Direct GRN
                        </Title>
                    </Col>
                    <Col offset={5} span={2}>
                        <Button icon={<PlusCircleOutlined />} style={{ marginRight: 0 }} onClick={handleAddTemplate}>
                            Add Direct GRN
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
                            DocumentType: 0,
                            GRNStatus: 0,
                        }}
                        onFinish={onFinish}
                    >
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="DocumentType" name="DocumentType">
                                    <Select>
                                        <Select.Option key={0} value={0}>All</Select.Option>
                                        {DirectGRNDropdown.DocumentType.map((option) => (
                                            <Select.Option key={option.LookupID} value={option.LookupID}>
                                                {option.LookupDescription}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item name="Supplier" label="Supplier">
                                    <Select placeholder='Select Value' allowClear>
                                        {DirectGRNDropdown.SupplierList.map((option) => (
                                            <Select.Option key={option.VendorId} value={option.VendorId}>
                                                {option.LongName}
                                            </Select.Option>
                                        ))}
                                    </Select>
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
                        </Row>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={6}>
                                <Form.Item name="ProcurementStore" label="Receiving Store">
                                    <Select placeholder='Select Value' allowClear>
                                        {DirectGRNDropdown.StoreDetails.map((option) => {
                                            if (option.StoreId === 1) {
                                                return (
                                                    <Select.Option key={option.StoreId} value={option.StoreId}>
                                                        {option.LongName}
                                                    </Select.Option>
                                                );
                                            }
                                            return null;
                                        })}
                                        {/* {DirectGRNDropdown.StoreDetails.map((option) => {
                                            debugger;
                                            if (option.StoreId === 1) {                                                
                                                render(
                                                    <Select.Option key={option.StoreId} value={option.StoreId}>
                                                        {option.LongName}
                                                    </Select.Option>
                                                )
                                            }
                                        })} */}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="GRN Number" name="GRNNumber">
                                    <Input allowClear />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="GRN Status" name="GRNStatus">
                                    <Select>
                                        <Select.Option key={0} value={0}>All</Select.Option>
                                        <Select.Option key="Created" value="Created"></Select.Option>
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
                        {isTableHasValues && (
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
                        )}
                    </Form>
                </Card>
            </div>
        </Layout>
    );
};

export default DirectGRN;
