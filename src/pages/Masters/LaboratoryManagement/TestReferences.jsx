import React, { useState, useRef, useEffect } from "react";
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import Layout from 'antd/es/layout/layout';
import {
    Spin,
    Skeleton,
    Tag,
    InputNumber,
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
    AutoComplete,
    message,
} from "antd";
//import { CloseSquareFilled } from '@ant-design/icons';
import { useNavigate } from "react-router";

import { urlTestReferencesIndex, urlLoadSubTestMapGridData, urlSaveTestReference, urlLoadTestReferenceGrid } from "../../../../endpoints";
import customAxios from "../../../components/customAxios/customAxios";

import TextArea from "antd/es/input/TextArea";
import CustomTable from "../../../components/customTable";
//import { format } from 'prettier';
//import { useLocation } from 'react-router-dom';

const TestMethods = () => {
    const [subTestMappingIndex, setSubTestMappingIndex] = useState({
        SingleTests: [],
        Gender: [],
        Durations: [],
        ListTestMethodModel: []
    });
    const [form] = Form.useForm();
    const [subTestOptions, setSubTestOptions] = useState([]);
    const { Title } = Typography;
    const hasEffectRun = useRef(false);
    const [filteredData, setFilteredData] = useState([]);
    useEffect(() => {
        if (!hasEffectRun.current) {
            try {
                customAxios.get(urlTestReferencesIndex).then((response) => {
                    debugger
                    const apiData = response.data.data;
                    const MainOptions = apiData.SingleTests.map(item => ({ value: item.ServiceId, label: item.LongName }));
                    const SubOptions = apiData.ListTestMethodModel.map(item => ({ value: item.TestMethodID, label: item.MethodName, TestID: item.TestID }));
                    // setSubTestMappingIndex(apiData);
                    setSubTestMappingIndex((prevState) => ({
                        ...prevState,
                        SingleTests: [...prevState.SingleTests, ...MainOptions],
                        ListTestMethodModel: [...prevState.ListTestMethodModel, ...SubOptions],
                        Gender: [...prevState.Gender, ...apiData.Gender],
                        Durations: [...prevState.Durations, ...apiData.Durations]
                    }));
                    setSubTestOptions(SubOptions)
                });
            } catch (error) {
                //console.error("Error fetching purchase order details:", error);        
            }
            hasEffectRun.current = true;
        }
    }, []);

    const LoadTestReferenceGrid =async()=>{
        const values=form.getFieldsValue();
        const response = await customAxios.get(`${urlLoadTestReferenceGrid}?TestId=${value}&TestId=${value}&TestId=${value}&TestId=${value}`);
        if(response.status===200 && response.data!=null){
            setFilteredData(response.data.data.ListTestReferenceModel);
        }
    }

    
    const onFinish = async (values) => {
        debugger;
        const postData = {
            TestId: values.TestId,
            TestMethodId: values.TestMethodId,
            PeriodsID: values.PeriodsId,
            FromAge: values.FromAge,
            ToAge: values.ToAge,
            Low: values.Low,
            High: values.High,
            Description: values.Description,
            Gender: values.Gender,
            OperatorType: values.OperatorType,

        }
        const response = await customAxios.post(urlSaveTestReference, postData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(response.status===200 && response.data!=null){
            message.success(Response.data.data.Status);
        }

    };

   

    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());



    const onChange = (value) => {
        debugger
        const filteredList = subTestMappingIndex.ListTestMethodModel.filter(
            (item) => item.TestID === value
        );
        if (value === undefined) {
            setSubTestMappingIndex((prevState) => ({
                ...prevState,
                ListTestMethodModel: subTestOptions
            }))
        } else {
            setSubTestMappingIndex((prevState) => ({
                ...prevState,
                ListTestMethodModel: filteredList
            }))
        }
    }

    const handleDelete = () => {

    }

    const columns = [
        {
            title: "Duration",
            dataIndex: "SubTestName",
   
        },
        {
            title: "From Age",
            dataIndex: "TestOrder",
        
        },
        {
            title: "To Age",
            dataIndex: "TestOrder",
         
        },
        {
            title: "Low",
            dataIndex: "TestOrder",
    
        },
        {
            title: "High",
            dataIndex: "TestOrder",
   
        },
        {
            title: "Description",
            dataIndex: "TestOrder",
           
        },
    
    ];

    return (
        <Layout style={{ zIndex: '999999999' }}>
            <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
                <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
                    <Col span={16}>
                        <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
                        Test Reference Management
                        </Title>
                    </Col>
                </Row>
                <Card>
                    <Form
                        form={form}
                        name="control-hooks"
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                           // Gender: 8,
                            OperatorType: 'between (<>)',
                            PeriodsId: 12202
                        }}
                    >
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={8}>
                                <Form.Item label="Tests" name="TestId"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input!'
                                        }
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        allowClear
                                        optionFilterProp="children"
                                        onChange={onChange}
                                        //onSearch={onSearch}
                                        filterOption={filterOption}
                                        options={subTestMappingIndex.SingleTests}
                                    />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item name="TestMethodId" label="Method Name">
                                    <Select
                                        showSearch
                                        allowClear
                                        optionFilterProp="children"
                                        // onChange={onChange}
                                        // onSearch={onSearch}
                                        filterOption={filterOption}
                                        options={subTestMappingIndex.ListTestMethodModel}
                                    />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item name="Gender" label="Gender">
                                    <Select>
                                        {subTestMappingIndex.Gender.map((option) => (
                                            <Select.Option key={option.LookupID} value={option.LookupID}>{option.LookupDescription}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        
                        <Row gutter={16} style={{backgroundColor:"#EAEAEC",boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"}}>
                            <Col className="gutter-row" span={6}>
                                <Form.Item label="Durations" name="PeriodsId">
                                    <Select>
                                        {subTestMappingIndex.Durations.map((option) => (
                                            <Select.Option key={option.LookupID} value={option.LookupID}>{option.LookupDescription}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item name="FromAge" label="From Age"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input!'
                                        }
                                    ]}
                                >
                                    <InputNumber allowClear min={0} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item name="ToAge" label="To Age"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input!'
                                        }
                                    ]}
                                >
                                    <InputNumber allowClear min={0} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item name="OperatorType" label="Operators">
                                    <Select>
                                        <Select.Option key='<>' value='between (<>)'></Select.Option>
                                        <Select.Option key='<' value='less Than (<)'></Select.Option>
                                        <Select.Option key='>' value='greater Than (>)'></Select.Option>
                                        <Select.Option key='<=' value='less Than or Equal (<=)'></Select.Option>
                                        <Select.Option key='>=' value='greater Than or Equal (>=)'></Select.Option>
                                        <Select.Option key='==' value='equals to (==)'></Select.Option>
                                        <Select.Option key='!=' value='not equals to (!=)'></Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item name="Low" label="Low"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input!'
                                        }
                                    ]}
                                >
                                    <InputNumber min={0} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item name="High" label="High">
                                    <InputNumber min={0} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <Form.Item name="Description" label="Description">
                                    <TextArea />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={2}>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" style={{ marginTop: 30 }}>
                                        Save
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <CustomTable
                    dataSource={filteredData}
                    columns={columns}
                    onDelete={handleDelete}
                />
            </div>
        </Layout>
    );
};

export default TestMethods;
