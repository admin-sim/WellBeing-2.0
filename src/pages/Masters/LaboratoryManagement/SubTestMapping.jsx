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
    Popconfirm,
    message
} from "antd";
//import { CloseSquareFilled } from '@ant-design/icons';
import { useNavigate } from "react-router";

import { urlLoadTestForMapping, urlLoadSubTestMapGridData, urlDeleteSubTest, urlSaveNewSubTestmap } from "../../../../endpoints";
import customAxios from "../../../components/customAxios/customAxios";
import CustomTable from "../../../components/customTable";
import { v4 as uuidv4 } from "uuid";
//import { format } from 'prettier';
//import { useLocation } from 'react-router-dom';

const SubTestMapping = () => {
    const [subTestMappingIndex, setSubTestMappingIndex] = useState({
        MainTests: [],
        ProfileTests: [],
        AllDiagnosticTests: [],
        SubTests: [],
        AllFacility: []
    });
   
    const [filteredData, setFilteredData] = useState([]);
 

    const [form] = Form.useForm();

    const { Title } = Typography;
    const hasEffectRun = useRef(false);

    useEffect(() => {
        if (!hasEffectRun.current) {
            try {
                customAxios.get(urlLoadTestForMapping).then((response) => {
                    debugger
                    const apiData = response.data.data;
                    const MainOptions = apiData.ProfileTests.map(item => ({ value: item.ServiceId, label: item.LongName }));
                    const SubOptions = apiData.AllDiagnosticTests.map(item => ({ value: item.ServiceId, label: item.LongName }));
                    // setSubTestMappingIndex(apiData);
                    setSubTestMappingIndex((prevState) => ({
                        ...prevState,
                        ProfileTests: [...prevState.ProfileTests, ...MainOptions],
                        AllDiagnosticTests: [...prevState.AllDiagnosticTests, ...SubOptions]
                    }));
                });
            } catch (error) {
                //console.error("Error fetching purchase order details:", error);        
            }
            hasEffectRun.current = true;
        }
    }, []);

  

   

    const onFinish = async (values) => {
        debugger;
        const TestMethodModel = {
            MainTestId: values.MainTests,
            SubTestId: values.SubTests,
            TestOrder: values.TestOrder
        }

        const postData = {
            SubTestMappingModel: TestMethodModel
        }
        const response = await customAxios.post(urlSaveNewSubTestmap, postData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.data.data.Status === 'SubTest Mapped Successfully.') {
            message.success('SubTest Mapped Successfully.')
        } else {
            message.error('SubTest Is Already Exists.');
        }
        onChange(values.MainTests)
        form.setFieldsValue({ SubTests: undefined })
        form.setFieldsValue({ TestOrder: undefined })
    };



    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const onSearch = (value) => {
        debugger;

    };

    const onChange = (value) => {
        debugger
        try {
            customAxios.get(`${urlLoadSubTestMapGridData}?MainTestId=${value}`).then((response) => {
                debugger;
                const apiData = response.data.data.SubTestMappingList.map(
                    (item,index) => ({
                      ...item,
                      key: uuidv4(),
                    })
                  );
                  setFilteredData(apiData)
            });
        } catch (error) {
            //console.error("Error fetching purchase order details:", error);        
        }
    }

    const handleDelete = (row) => {
        debugger
        try {
            customAxios.delete(`${urlDeleteSubTest}?subtestId=${row.SubTestId}`).then((response) => {
                debugger;
                if (response.data.data.Status == 'Failed To Delete Record.') {
                    message.error(response.data.data.Status)
                } else {
                    message.success(response.data.data.Status);
                }
                onChange(row.MainTestID)
                form.setFieldsValue({ SubTests: undefined })
                form.setFieldsValue({ TestOrder: undefined })
            });
        } catch (error) {
            //console.error("Error fetching purchase order details:", error);        
        }
    }
    const columns = [
        {
            title: "SubTest Name",
            dataIndex: "SubTestName",
  
        },
        {
            title: "TestOrder",
            dataIndex: "TestOrder",
 
        }
      
    ];

    return (
        <Layout style={{ zIndex: '999999999' }}>
            <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
                <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
                    <Col span={16}>
                        <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
                            ProfileTest Mapping Management
                        </Title>
                    </Col>
                </Row>
                <Card>
                    <Form
                        form={form}
                        name="control-hooks"
                        layout="vertical"
                        variant="outlined"
                        onFinish={onFinish}
                    >
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={8}>
                                <Form.Item label="Main Tests" name="MainTests"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input!'
                                        }
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Select a person"
                                        optionFilterProp="children"
                                        onChange={onChange}
                                        onSearch={onSearch}
                                        filterOption={filterOption}
                                        options={subTestMappingIndex.ProfileTests}
                                    />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <Form.Item name="SubTests" label="Sub Tests"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input!'
                                        }
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Select a person"
                                        optionFilterProp="children"
                                        // onChange={onChange}
                                        // onSearch={onSearch}
                                        filterOption={filterOption}
                                        options={subTestMappingIndex.AllDiagnosticTests}
                                    />
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={4}>
                                <Form.Item name="TestOrder" label="Test Order"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input!'
                                        }
                                    ]}
                                >
                                    <InputNumber min={0} />
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
                    isFilter={true}
                    onDelete={handleDelete}
                />
            </div>
        </Layout>
    );
};

export default SubTestMapping;
