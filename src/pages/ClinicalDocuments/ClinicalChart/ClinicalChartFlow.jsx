import React, { useState, useEffect } from "react";
import { Tabs, Button, Table, Layout, Card, Row, Form, Input, Col } from 'antd'
import customAxios from "../../../components/customAxios/customAxios";
import { urlClinicalChartFlows, urlGetAllEncounterByPatientId } from "../../../../endpoints";
import { useNavigate } from "react-router";
import PageHeader from '../../../components/PageHeader/index'
import UhidSelectComponet from '../../../components/UhidSelectComponent/index'

function ClinicalChartFlow() {
    const [form1] = Form.useForm();
    const [defaultActiveKey, setDefaultActiveKey] = useState("2");
    const [tableData, setTableData] = useState([])
    const [loading, setLoading] = useState()
    const navigate = useNavigate();
    const SelectPatient = (record) => {
        navigate("/ClinicalChart", { state: { record } });
    }

    useEffect(() => {
        fetch('Ambulatory Patient')
    }, [])

    async function fetch(type) {
        setLoading(true)
        const response = await customAxios.get(`${urlClinicalChartFlows}?PatientType=${type}`)
        if (response.status == 200) {
            const newData = response.data.data.PatientList.map((item, index) => {
                return {
                    ...item,
                    key: index + 1
                }
            })
            setTableData(newData)
            setLoading(false)
        }
    }

    const onTabChange = async (key) => {
        if (key == '1') {
            await form1.validateFields()
            form1.submit()
        } else if (key == '22') {
            fetch('Ambulatory Patient')
        } else if (key == '23') {
            fetch('InPatient')
        } else if (key == '24') {
            fetch('Day Care')
        } else {
            fetch('Emergency')
        }
        setDefaultActiveKey(key)
    };

    async function handleSelectPatient(params) {
        debugger
        SelectPatient(params)
    }
    const columns = [
        {
            title: "Sl. No.",
            dataIndex: "key",
        },
        {
            title: "UHID",
            dataIndex: "UhId",
        },
        {
            title: "Encounter",
            dataIndex: "GeneratedEncounterId",
            render: (text, record) => {
                return (
                    <Button type="link" onClick={() => handleSelectPatient(record)}>{record.GeneratedEncounterId}</Button>
                );

            },
        },
        {
            title: "Provider",
            dataIndex: "ProviderName",
        },
        {
            title: "Name",
            dataIndex: "PatientFirstName"
        }
    ];

    async function handleSelectUHID(va, op) {
        debugger
        if (op != undefined) {
            form1.setFieldsValue({ 'PatientId': op.data.PatientId })
            form1.setFieldsValue({ 'Name': op.data.PatientFirstName + ' ' + op.data.PatientLastName })
            form1.setFieldsValue({ 'UHID': op.value })
        }
    }

    return (
        <Layout style={{ zIndex: '999999999' }}>
            <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
                <PageHeader title={"Clinical Chart"} button={false} />
                <Card>
                    <Form
                        layout="vertical"
                        form={form1}
                        onFinish={async (values) => {
                            debugger
                            setLoading(true)
                            const response = await customAxios.get(`${urlGetAllEncounterByPatientId}?PatientId=${values.PatientId}`)
                            if (response.status == 200) {
                                const newData = response.data.data.map((item, index) => {
                                    return {
                                        ...item,
                                        key: index + 1
                                    }
                                })
                                setTableData(newData)
                                setDefaultActiveKey('1')
                                setLoading(false)
                            }
                        }}>
                        <Row gutter={32}>
                            <Col span={6}>
                                <Form.Item name='UHID' label='UHID'
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter UHID",
                                        },
                                    ]}
                                >
                                    <UhidSelectComponet handleSelectUHID={handleSelectUHID} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name='Name' label='Name'>
                                    <Input />
                                </Form.Item>
                                <Form.Item name='PatientId' hidden>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="&nbsp;">
                                    <Button type="primary" htmlType="submit" onClick={() => form1.submit()}>
                                        Search
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Tabs
                            defaultActiveKey="22"
                            size="small"
                            onChange={onTabChange}
                            tabBarGutter={0}
                            activeKey={defaultActiveKey}
                            // type="card"
                            style={{ marginTop: "1rem" }}
                        // tabBarStyle={{ display: "flex", justifyContent: "right" }}
                        >
                            <Tabs.TabPane
                                tab={
                                    <div
                                        style={{
                                            width: "3vw",
                                            textAlign: "center",
                                            fontWeight: "600",
                                        }}
                                    >
                                        ALL
                                    </div>
                                }
                                key="1"
                            >
                                {/* <Table columns={columns} dataSource={tableData} /> */}
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab={
                                    <div
                                        style={{
                                            width: "3vw",
                                            textAlign: "center",
                                            fontWeight: "600",
                                        }}
                                    >
                                        OP
                                    </div>
                                }
                                key="22"
                            >
                                {/* <Table columns={columns} dataSource={tableData} /> */}
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab={
                                    <div
                                        style={{
                                            width: "3vw",
                                            textAlign: "center",
                                            fontWeight: "600",
                                        }}
                                    >
                                        IP
                                    </div>
                                }
                                key="23"
                            >
                                {/* <Table columns={columns} dataSource={tableData} /> */}
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab={
                                    <div
                                        style={{
                                            width: "3vw",
                                            textAlign: "center",
                                            fontWeight: "600",
                                        }}
                                    >
                                        DM
                                    </div>
                                }
                                key="24"
                            >
                                {/* <Table columns={columns} dataSource={tableData} /> */}
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab={
                                    <div
                                        style={{
                                            width: "3vw",
                                            textAlign: "center",
                                            fontWeight: "600",
                                        }}
                                    >
                                        EM
                                    </div>
                                }
                                key="25"
                            >
                                {/* <Table columns={columns} dataSource={tableData} loading={loading} /> */}
                            </Tabs.TabPane>
                        </Tabs>
                    </div>
                    <Table columns={columns} dataSource={tableData} loading={loading} />
                </Card>
            </div>
        </Layout>
    )
}

export default ClinicalChartFlow

// import React, { useState, useEffect } from "react";
// import Layout from 'antd/es/layout/layout';
// import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
// // import male from "../../assets/m.png";
// import dayjs from 'dayjs';
// import {
//     Spin,
//     Tag,
//     Typography,
//     Select,
//     Button,
//     Form,
//     Input,
//     Row,
//     Col,
//     DatePicker,
//     Card,
//     Divider,
//     Tooltip,
//     Table,
//     AutoComplete,
//     Avatar,
//     InputNumber,
//     message
// } from "antd";
// //import { CloseSquareFilled } from '@ant-design/icons';
// import { useNavigate } from "react-router";
// const { Text } = Typography;

// import { urlSearchUHID, urlGetLastEncounter, urlGetPatientHeaderDetails, urlGetConsumptionReturnList } from "../../../../endpoints";
// import customAxios from "../../../components/customAxios/customAxios";
// import PatientHeader from "../../../components/PatientHeader";
// import { render } from "react-dom";
// //import { useLocation } from 'react-router-dom';

// function ClinicalChartFlow() {
//     const [paginationSize, setPaginationSize] = useState(5);
//     const [filteredData, setFilteredData] = useState([]);
//     const [page, setPage] = useState(1);
//     const [form] = Form.useForm();
//     const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
//     const [isTable, setIsTable] = useState(false);
//     const [encounter, setEncounter] = useState([])
//     const { Title } = Typography;
//     const [patientData, setPatientData] = useState(null);

//     const getPanelValue = async (searchText) => {
//         if (searchText == '') {
//             form.resetFields()
//             return false
//         }
//         if (searchText === '') {
//             setEncounter([])
//         }
//         try {
//             customAxios.get(`${urlSearchUHID}?Uhid=${searchText}`).then((response) => {
//                 const apiData = response.data.data;
//                 const newOptions = apiData.map(item => ({ value: item.UhId, key: item.PatientId, Name: item.PatientFirstName + ' ' + item.PatientLastName }));
//                 setAutoCompleteOptions(newOptions);
//             });
//         } catch (error) {
//             //console.error("Error fetching purchase order details:", error);
//         }
//     }

//     const handleSelect = (value, option) => {
//         form.setFieldsValue({ Name: option.Name })
//         try {
//             customAxios.get(`${urlGetLastEncounter}?Uhid=${option.value}`).then((response) => {
//                 if (response.data.length > 0) {
//                     setEncounter(response.data);
//                     form.setFieldsValue({ EncounterId: response.data[0].EncounterId });
//                     form.setFieldsValue({ PatientId: option.key });
//                     form.setFieldsValue({ Encounter: response.data[0].GeneratedEncounterId })
//                 } else {
//                     setEncounter([]);
//                     form.setFieldsValue({ EncounterId: '' });
//                     form.setFieldsValue({ PatientId: '' });
//                 }
//             });
//         } catch (error) {
//             //console.error("Error fetching purchase order details:", error);
//         }
//     }

//     const columns = [
//         {
//             title: "Product",
//             dataIndex: "ServiceName",
//             key: "ServiceName",
//             render: (text, record, index) => (
//                 <>
//                     {text}
//                     < Form.Item hidden name='ServiceID' initialValue={record.ServiceID}><Input /></Form.Item>
//                     <Form.Item hidden name='ChargeID' initialValue={record.ChargeID}><Input /></Form.Item>
//                 </>
//             ),
//         },
//         {
//             title: "Batch No",
//             dataIndex: "BatchNo",
//             key: "BatchNo",
//             render: (text, record) => (
//                 text
//             )
//         },
//         {
//             title: "Expiry Date",
//             dataIndex: "EXPDateString",
//             key: "EXPDateString",
//             render: (text, record) => (
//                 text
//             )
//         },
//         {
//             title: "Returned Quantity",
//             dataIndex: "ReturnedQty",
//             key: "ReturnedQty",
//             render: (text, record) => (
//                 text
//             )
//         },
//         {
//             title: "Returnable Quantity",
//             dataIndex: "Quantity",
//             key: "Quantity",
//             render: (text, record) => (
//                 text
//             )
//         },
//         {
//             title: "Return Qty",
//             dataIndex: "ReturnQty",
//             key: "ReturnQty",
//             render: (text, record) => (
//                 <InputNumber min={0} allowClear />
//             )
//         },
//         {
//             title: "Return Amt/Unit",
//             dataIndex: "Rate",
//             key: "Rate",
//             render: (text, record) => (
//                 text
//             )
//         },
//         {
//             title: "Tax Amt/Unit",
//             dataIndex: "TaxAmount",
//             key: "TaxAmount",
//             render: (text, record) => (
//                 text
//             )
//         },
//         {
//             title: "Discount",
//             dataIndex: "DiscountAmount",
//             key: "DiscountAmount",
//             render: (text, record) => (
//                 text
//             )
//         },
//         {
//             title: "Net Return Amount",
//             dataIndex: "actions",
//             key: "actions",
//             render: (text, record) => (
//                 record.ReturnQty * record.Rate
//             )
//         }
//     ];

//     const onFinish = async (values) => {
//         debugger;
//     };

//     const onReset = () => {
//         form.resetFields();
//     };

//     const navigate = useNavigate();
//     const SelectPatient = async () => {
//         const va = form.getFieldsValue()
//         navigate("/ClinicalChart", { state: { va } });
//     }

//     return (
//         <Layout style={{ zIndex: '999999999' }}>
//             <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
//                 <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
//                     <Col span={16}>
//                         <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
//                             Clinical Chart Flow
//                         </Title>
//                     </Col>
//                 </Row>
//                 <Card>
//                     <Form
//                         form={form}
//                         name="control-hooks"
//                         layout="vertical"
//                         variant="outlined"
//                         // size="Default"
//                         style={{
//                             maxWidth: 1500,
//                         }}
//                         onFinish={onFinish}
//                     >
//                         <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
//                             <Col className="gutter-row" span={4}>
//                                 <Form.Item label="UHID" name="UHID"
//                                     rules={[
//                                         {
//                                             required: true,
//                                         },
//                                     ]}
//                                 >
//                                     <AutoComplete
//                                         options={autoCompleteOptions}
//                                         onSearch={(value) => getPanelValue(value)}
//                                         onSelect={(value, option) => handleSelect(value, option)}
//                                         // value={uhId}
//                                         placeholder="Search for a Uhid"
//                                         allowClear
//                                     />
//                                 </Form.Item>
//                             </Col>
//                             <Col className="gutter-row" span={4}>
//                                 <Form.Item name="Name" label="Name"
//                                     rules={[
//                                         {
//                                             required: true,
//                                         },
//                                     ]}
//                                 >
//                                     <Input style={{ width: '100%' }} allowClear />
//                                 </Form.Item>
//                                 <Form.Item name="PatientId" hidden>
//                                     <Input />
//                                 </Form.Item>
//                             </Col>
//                             <Col className="gutter-row" span={4}>
//                                 <Form.Item name="EncounterId" label="EncounterId"
//                                     rules={[
//                                         {
//                                             required: true,
//                                         },
//                                     ]}
//                                 >
//                                     <Select disabled={encounter.length <= 1}
//                                         onChange={(value, option) => {
//                                             form.setFieldsValue({ Encounter: option.children });
//                                         }}
//                                     >
//                                         {encounter.map((option) => (
//                                             <Select.Option key={option.EncounterId} value={option.EncounterId}>
//                                                 {option.GeneratedEncounterId}
//                                             </Select.Option>
//                                         ))}
//                                     </Select>
//                                 </Form.Item>
//                                 <Form.Item name="Encounter" hidden>
//                                     <Input />
//                                 </Form.Item>
//                             </Col>
//                             <Col className="gutter-row" span={1} style={{ marginTop: 30 }}>
//                                 <Form.Item>
//                                     <Button type="primary" onClick={SelectPatient}>
//                                         Select
//                                     </Button>
//                                 </Form.Item>
//                             </Col>
//                             <Col className="gutter-row" span={2} style={{ marginTop: 30 }}>
//                                 <Form.Item>
//                                     <Button type="primary" onClick={onReset}>
//                                         Reset
//                                     </Button>
//                                 </Form.Item>
//                             </Col>
//                         </Row>
//                         {isTable && (
//                             <>
//                                 <div style={{ margin: "0 2rem 1rem 2rem" }}>
//                                     <PatientHeader patient={patientData} />
//                                 </div>
//                                 <Table
//                                     dataSource={filteredData}
//                                     columns={columns}
//                                     rowKey={(row) => row.ChargeID}
//                                     locale={{
//                                         emptyText: <span style={{ color: "" }}>No data available</span>,
//                                     }}
//                                     bordered
//                                     pagination={{
//                                         showTotal: (total, range) =>
//                                             `Showing ${range[0]} to ${range[1]} of ${total} entries`,
//                                     }}
//                                     scroll={{ x: 1400 }}
//                                     summary={(pageData) => {
//                                         let netamt = 0;
//                                         let rate = 0;
//                                         let returnqty = 0;
//                                         pageData.forEach(
//                                             ({
//                                                 ReturnQty,
//                                                 Rate
//                                             }) => {
//                                                 returnqty += ReturnQty;
//                                                 rate += Rate;
//                                             }
//                                         );
//                                         return (
//                                             <>
//                                                 <Table.Summary.Row>
//                                                     <Table.Summary.Cell
//                                                         index={0}
//                                                         colSpan={8}
//                                                     ></Table.Summary.Cell>
//                                                     <Table.Summary.Cell index={3}>
//                                                         <Text type="danger">Total</Text>
//                                                     </Table.Summary.Cell>
//                                                     <Table.Summary.Cell index={2}>
//                                                         <Text type="danger">{returnqty * rate}</Text>
//                                                     </Table.Summary.Cell>
//                                                     <Table.Summary.Cell
//                                                         index={2}
//                                                         colSpan={9}
//                                                     ></Table.Summary.Cell>
//                                                 </Table.Summary.Row>
//                                             </>
//                                         );
//                                     }}
//                                 />
//                             </>
//                         )}
//                         {/* <Row justify="end">
//                             <Col>
//                                 <Form.Item>
//                                     <Button type="primary" htmlType="submit">
//                                         Save
//                                     </Button>
//                                 </Form.Item>
//                             </Col>
//                         </Row> */}
//                     </Form>
//                 </Card>
//             </div>
//         </Layout>
//     );
// };

// export default ClinicalChartFlow;

// import customAxios from "../../../components/customAxios/customAxios.jsx";
// import React, { useEffect, useState } from "react";
// import { LeftOutlined } from "@ant-design/icons";
// import { useNavigate } from "react-router";
// import { Col, ConfigProvider, Row, Select } from "antd";
// import Input from "antd/es/input";
// import Form from "antd/es/form";
// import { Card, Modal, Table, message } from "antd";
// import { AutoComplete } from "antd";
// import { DatePicker, Spin } from "antd";
// import Button from "antd/es/button";
// import {
//   urlGetPatientDetail,
//   urlSearchPatientRecord,
//   urlGetDepartmentBasedOnPatitentType,
//   urlGetProviderBasedOnDepartment,
//   urlGetServiceLocationBasedonId,
//   urlSearchUHID,
//   urlAddNewVisit,
//   urlAddNewVisit1,
//   urlGetWardsBasedOnWardCategory,
//   urlGetBedsForWard,
//   urlGetEncounterDetails,
//   urlGetPatientHeaderDetails,
// } from "../../../../endpoints.js";

// import debounce from "lodash/debounce";

// import { EnvironmentOutlined } from "@ant-design/icons";
// import "../../Patient/style.css";
// import Title from "antd/es/typography/Title.js";
// import PageHeader from "../../../components/PageHeader/index.jsx";
// import PatientHeader from "../../../components/PatientHeader/index.jsx";
// import { set } from "lodash";
// import VisitModal from "../../Patient/NewVisit/visitModal.jsx";

// const containsDropdown = [
//   { id: "1", name: "Starts With" },
//   { id: "2", name: "Ends With" },
//   { id: "3", name: "Sounds Like" },
//   { id: "4", name: "Anywhere" },
// ];

// const ClinicalChartFlow = () => {
//   const [patientDropdown, setPatientDropdown] = useState({
//     Genders: [],
//     Title: [],
//     CardType: [],
//   });
//   const [visitsDropdown, setVisitDropdown] = useState({});
//   // PatientType: [],
//   // KinTitle: [],
//   // EncounterType: [],
//   // EncounterReason: [],
//   // ReferredBy: [],
//   // WardCategory: [],
//   // });
//   const [loading, setLoading] = useState(false);
//   const [AutoCompleteLoader, setAutomaticLoader] = useState(false);
//   const [ModalLoader, setModalLoader] = useState(false);
//   const [departmentLoader, setDepartmentLoader] = useState(false);
//   const [providerLoader, setProviderLoader] = useState(false);
//   //const [serviceLocationLoader, setServiceLocationLoader] = useState(false);
//   const [submitLoader, setIsSubmitLoader] = useState(false);

//   const [options, setOptions] = useState([]);

//   const [patientsearchDetails, setPatientSearchDetails] = useState([]);
//   const [patientHeaderDetails, setPatientHeaderDetails] = useState({});
//   const [encounterId, setEncounterId] = useState();
//   const [selectedUhId, setSelectedUhId] = useState(null);

//   const navigate = useNavigate();
//   const [form] = Form.useForm();
//   const [form1] = Form.useForm();
//   const [selecteddob, setdob] = useState(undefined);
//   const [selectedRegFrom, setRegFrom] = useState(undefined);
//   const [selectedRegTo, setRegTo] = useState(undefined);

//   const [isVisitModalVisible, setIsVisitModalVisible] = useState(false);
//   const [patientTypeValue, setpatientTypeSelectValue] = useState(null);

//   const [departments, setDepartments] = useState([]);
//   const [providers, setProviders] = useState([]);
//   const [serviceLocations, setServiceLocations] = useState([]);

//   const [messageApi, contextHolder] = message.useMessage();
//   const [IsVisitCreated, setIsVisitCreated] = useState(false);

//   const [isMoreModalVisible, setIsMoreModalVisible] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [showWard, setShowWard] = useState(false);

//   const [serviceLocationId, setServiceLocationId] = useState();
//   const [wardsLoader, setWardsLoader] = useState(false);
//   const [BedsLoader, setBedsLoader] = useState(false);
//   const [wards, setWards] = useState([]);
//   const [beds, setBeds] = useState([]);
//   const [encounterTypeId, setEncounterTypeId] = useState();

//   useEffect(() => {
//     debugger;

//     customAxios.get(urlGetPatientDetail).then((response) => {
//       const apiData = response.data.data;
//       setPatientDropdown(apiData);
//     });
//   }, []);

//   const disabledDate = (current) => {
//     // Disable dates that are in the future
//     return current && current > new Date();
//   };

//   const handleReset = () => {
//     form.resetFields();
//     setPatientSearchDetails(null);
//   };

//   const handleAutoCompleteChange = debounce(async (value) => {
//     try {
//       setAutomaticLoader(true); // Set loading state to true

//       if (!value.trim()) {
//         setOptions([]); // Set options to an empty array
//         setAutomaticLoader(false); // Set loading state to false
//         return;
//       }

//       const response = await customAxios.get(`${urlSearchUHID}?Uhid=${value}`);
//       const responseData = response.data.data || [];

//       // Ensure responseData is an array and has the expected structure
//       if (
//         Array.isArray(responseData) &&
//         responseData.length > 0 &&
//         responseData[0].UhId !== undefined
//       ) {
//         setAutomaticLoader(false);
//         const newOptions = responseData.map((option) => ({
//           value: option.UhId,
//           label: option.UhId,
//           key: option.PatientId,
//         }));
//         setOptions(newOptions);
//       } else {
//         setOptions([]); // Set options to an empty array if the structure is not as expected
//       }
//     } catch (error) {
//       setAutomaticLoader(false);
//       console.error("Error fetching suggestions:", error);
//       setOptions([]); // Set options to an empty array in case of an error
//     }
//   }, 300); // Debounce time in milliseconds (adjust as needed)

//   const handleSelect = (value, option) => {
//     setSelectedUhId(option.value);
//   };

//   function formatDate(inputDate) {
//     if (!inputDate) return '""';
//     const dateParts = inputDate.split("-");
//     if (dateParts.length === 3) {
//       const [year, month, day] = dateParts;
//       return `${day}-${month}-${year}`;
//     }
//     return inputDate; // Return as is if not in the expected format
//   }

//   const formatDatefortable = (dateString) => {
//     if (!dateString) return '""';
//     const date = new Date(dateString);
//     return `${date.getDate().toString().padStart(2, "0")}-${(
//       date.getMonth() + 1
//     )
//       .toString()
//       .padStart(2, "0")}-${date.getFullYear()}`;
//   };

//   const handleDateChange = (date, dateString) => {
//     const dateinput = formatDate(dateString);
//     setdob(dateinput);
//   };

//   const handleRegFromDateChange = (date, dateString) => {
//     debugger;
//     const dateinput1 = formatDate(dateString);
//     setRegFrom(dateinput1);
//   };

//   const handleRegToDateChange = (date, dateString) => {
//     const dateinput2 = formatDate(dateString);
//     setRegTo(dateinput2);
//   };

//   const handleBackToList = () => {
//     const url = `/patient`;
//     // Navigate to the new URL
//     navigate(url);
//   };

//   const navigateToAddPatient = () => {
//     const url = `/patient/NewPatient`;
//     // Navigate to the new URL
//     navigate(url);
//   };

//   const handleOnSearch = (values) => {
//     debugger;

//     // Handle form submission logic here
//     console.log("Form submitted with values:", values);

//     try {
//       setLoading(true);
//       values.dob = selecteddob;
//       values.RegFrom = selectedRegFrom;
//       values.RegTo = selectedRegTo;
//       // Assuming postData1 is an object with your input values
//       const postData1 = {
//         Uhid:
//           values.Uhid === undefined || values.Uhid === "" ? '""' : values.Uhid, // Set to empty string when left blank
//         NameFilter: values.NameFilter === undefined ? "" : values.NameFilter,
//         PatientName:
//           values.PatientName === undefined || values.PatientName === ""
//             ? '""'
//             : values.PatientName,
//         DateOfBirth: values.dob === undefined ? '""' : values.dob,
//         RegistrationFrom: values.RegFrom === undefined ? '""' : values.RegFrom,
//         RegistrationTo: values.RegTo === undefined ? '""' : values.RegTo,
//         Age: values.Age === undefined || values.Age === "" ? "" : values.Age,
//         Gender: values.PatientGender === undefined ? "" : values.PatientGender,
//         MobileNumber:
//           values.MobileNumber === undefined || values.MobileNumber === ""
//             ? '""'
//             : values.MobileNumber,
//         City:
//           values.City === undefined || values.City === "" ? '""' : values.City,
//         identifierType:
//           values.IdentifierType === undefined ? "" : values.IdentifierType,
//         IdentifierTypeValue:
//           values.IdentifierValue === undefined || values.IdentifierValue === ""
//             ? '""'
//             : values.IdentifierValue,
//       };
//       customAxios
//         .get(
//           `${urlSearchPatientRecord}?Uhid=${postData1.Uhid}&NameFilter=${postData1.NameFilter}&PatientName=${postData1.PatientName}&DateOfBirth=${postData1.DateOfBirth}&RegistrationFrom=${postData1.RegistrationFrom}&RegistrationTo=${postData1.RegistrationTo}&Age=${postData1.Age}&Gender=${postData1.Gender}&MobileNumber=${postData1.MobileNumber}&City=${postData1.City}&IdentifierType=${postData1.identifierType}&IdentifierTypeValue=${postData1.IdentifierTypeValue}`,
//           null,
//           {
//             params: postData1,
//           }
//         )
//         .then((response) => {
//           setLoading(false);
//           console.log("Response:", response.data);
//           //resetForm();
//           setPatientSearchDetails(response.data.data.Patients);
//           setOptions([]);
//         });
//     } catch (error) {
//       setLoading(false);
//       // Handle any errors here
//       console.error("Error:", error);
//     }
//     // Reset the form fields
//   };

//   const [selectedRecord, setSelectedRecord] = useState(null); // New state variable to store selected record

//   const handlevisitmodal = async (record) => {
//     debugger;
//     setSelectedRecord(record);

//     setIsVisitCreated(false);
//     setModalLoader(true);
//     const response = await customAxios.get(
//       `${urlGetEncounterDetails}?PatientId=${
//         record.PatientId
//       }&PatientType=${0}&AppointmentId=${0}`
//     );
//     const response1 = await customAxios.get(
//       `${urlGetPatientHeaderDetails}?PatientId=${record.PatientId}`
//     );

//     if (response.data !== null && response1.data !== null) {
//       setPatientHeaderDetails(response1.data.data.EncounterModel);
//       setModalLoader(false);
//       setVisitDropdown(response.data.data);
//       setEncounterTypeId(response.data.data.EncounterTypeId);
//       form1.setFieldsValue({
//         EncounterType: response.data.data.EncounterTypeId,
//       });
//       setIsVisitModalVisible(true);
//     }
//   };

//   // console.log("This is the visit drop down", visitsDropdown);
//   // console.log("This is the patient header", patientHeaderDetails);

//   const handleEditRegistrationsDetails = (record) => {
//     debugger;

//     const url = `/patient/PatientEdit`;

//     // Navigate to the new URL
//     navigate(url, {
//       state: {
//         selectedRow: record,
//       },
//     });
//   };

//   const handlemoredetailsmodal = (record) => {
//     debugger;
//     setSelectedRecord(record); // Set the selected record when the modal is opened
//     setIsMoreModalVisible(true);
//   };

//   const handleOk = async () => {
//     debugger;

//     try {
//       await form1.validateFields();
//       const values = form1.getFieldsValue();

//       setIsVisitCreated(true);
//       setIsSubmitLoader(true);
//       const postData = {
//         PatientId: selectedRecord.PatientId,
//         PatientType: values.PatientType,
//         FacilityDepartmentId: values.Department,
//         FacilityDepartmentServiceLocationId: values.ServiceLocation,
//         ProviderId: values.Provider,
//         EncounterTypeId: values.EncounterType,
//         EncounterReasonId: values.EncounterReason,
//         KinTitle: values.KinTitle,
//         KinName: values.KinName,
//         KinAddress: values.KinAddress,
//         KinContactNo: values.KinContactNo,
//         ReferredBy: values.referredBy,
//         AttendingProviderId: values.admittedUnder,
//         WardCategoryId: values.WardCategory,
//         WardId: values.Ward,
//         BedId: values.Bed,
//       };

//       // Send a POST request to the server
//       const response = await customAxios.post(urlAddNewVisit1, postData, {
//         headers: {
//           "Content-Type": "application/json",
//           // Add any other required headers here
//         },
//       });

//       if (response.data != null) {
//         setIsSubmitLoader(false);
//         if (response.data.EncounterResult != null) {
//           messageApi.warning({
//             type: "warning",
//             content: `Patient visit is already created as In-Patient`,
//           });
//         } else {
//           const genVisitId = response.data.GeneratedEncounterId;
//           setEncounterId(genVisitId);
//           messageApi.open({
//             type: "success",
//             content: `Successfully  visit created for patient.`,
//           });
//         }
//       } else {
//         setIsSubmitLoader(false);
//         messageApi.open({
//           type: "error",
//           content: `Visit Creation Unsuccessful`,
//         });
//         form1.resetFields();
//       }

//       // setIsModalVisible(false);
//       setDepartments([]);
//       setProviders([]);
//       setServiceLocations([]);
//       // form1.resetFields();

//       // Additional logic after the asynchronous operation
//     } catch (error) {
//       setIsSubmitLoader(false);
//       if (error.errorFields) {
//         // Highlight the fields with errors
//         form1.scrollToField(error.errorFields[0].name, {
//           behavior: "smooth",
//         });
//         message.error("Please fill all required fields.");
//       } else {
//         console.error("Failed to send data to server: ", error);
//         message.error(`Error creating visit for patient: ${error.message}.`);
//         form1.resetFields();
//       }
//     }
//   };

//   const handleVisitModalCancel = () => {
//     setIsVisitModalVisible(false);
//     setIsVisitCreated(false);
//     setDepartments([]);
//     setProviders([]);
//     setServiceLocations([]);
//     setPatientHeaderDetails([]);
//     setEncounterId(null);
//     setShowWard(false);
//     form1.resetFields();
//   };

//   const handleMoreModalCancel = () => {
//     setIsMoreModalVisible(false);
//   };

//   const columns = [
//     {
//       title: "Sl No",
//       key: "index",

//       render: (text, record, index) => {
//         const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
//         return serialNumber;
//       },
//     },
//     {
//       title: "UHID",
//       dataIndex: "UhId",
//       key: "UhId",
//       sorter: (a, b) => {
//         const numA = parseInt(a.UhId.split("/")[1], 10);
//         const numB = parseInt(b.UhId.split("/")[1], 10);
//         return numA - numB;
//       },
//       sortDirections: ["descend", "ascend"],
//       render: (text, record) => (
//         <span style={{ fontWeight: "bold" }}>{record.UhId}</span>
//       ),
//     },
//     {
//       title: "PatientDetails",
//       dataIndex: "PatientName",
//       key: "PatientName",
//       sorter: (a, b) => a.PatientName.localeCompare(b.PatientName),
//       sortDirections: ["descend", "ascend"],
//       render: (text, record) => (
//         <div>
//           <p>
//             <strong>Name:</strong> {record.PatientName}
//             <br />
//             <strong>Gender:</strong> {record.PatientGender}
//             <br />
//             <strong>Mob No:</strong> {record.MobileNumber}
//             <br />
//             <strong>Dob:</strong> {formatDatefortable(record.DateOfBirth)}{" "}
//           </p>
//         </div>
//       ),
//     },
//     {
//         title: "Encounter",
//         dataIndex: "Encounter",
//         key: "Encounter",
//         // sorter: (a, b) => {
//         //   const numA = parseInt(a.UhId.split("/")[1], 10);
//         //   const numB = parseInt(b.UhId.split("/")[1], 10);
//         //   return numA - numB;
//         // },
//         sortDirections: ["descend", "ascend"],
//         render: (text, record) => (
//           <span style={{ fontWeight: "bold" }}>{record.UhId}</span>
//         ),
//       },
//     {
//       title: "Actions",
//       key: "actions",
//       width: 200,
//       render: (text, record) => (
//         <>
//           <div>
//             <p>
//               <a
//                 href="#"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   handlevisitmodal(record);
//                 }}
//               >
//                 Go To Clinical Chart
//               </a>
//             </p>
//           </div>
//           {/* <div>
//             <p>
//               <a
//                 href="#"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   handleEditRegistrationsDetails(record);
//                 }}
//               >
//                 Edit Registration Details
//               </a>
//             </p>
//           </div>
//           <div>
//             <p>
//               <a
//                 href="#"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   handlemoredetailsmodal(record);
//                 }}
//               >
//                 More Details
//               </a>
//             </p>
//           </div> */}
//         </>
//       ),
//     },
//   ];

//   return (
//     <div>
//       {/* <Card
//         title={
//           <Title
//             level={3}
//             style={{
//               color: "white",
//               fontWeight: 500,
//               margin: 0,
//               paddingTop: 0,
//             }}
//           >
//             Patient Search
//           </Title>
//         }
//         className="custom-card"
//         extra={
//           <Button
//             type="default"
//             onClick={handleBackToList}
//             style={{
//               color: "blue",
//             }}
//           >
//             <LeftOutlined style={{ color: "blue" }} />
//             Back to list
//           </Button>
//         }
//       > */}
//       <div
//         style={{
//           width: "100%",
//           backgroundColor: "white",
//           // minHeight: "min-content",
//           borderRadius: "10px",
//         }}
//       >
//         <PageHeader
//           title="Patient Search"
//           buttonLabel="Back to list"
//           buttonIcon={<LeftOutlined />}
//           onButtonClick={handleBackToList}
//         />
//         <Form
//           layout="vertical"
//           onFinish={handleOnSearch}
//           variant="outlined"
//           size="default"
//           style={{
//             padding: "1rem 1rem 0rem 1rem",
//           }}
//           form={form}
//         >
//           <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
//             <Col className="gutter-row" span={6}>
//               <div>
//                 <Form.Item label="UHID" name="Uhid">
//                   <AutoComplete
//                     id="uhid-autocomplete"
//                     options={options}
//                     //loading={AutoCompleteLoader}
//                     onSearch={handleAutoCompleteChange}
//                     onSelect={handleSelect}
//                     value={selectedUhId}
//                     filterOption={(inputValue, option) =>
//                       option.value
//                         .toUpperCase()
//                         .includes(inputValue.toUpperCase())
//                     }
//                     allowClear
//                   />
//                 </Form.Item>
//                 {AutoCompleteLoader && (
//                   <Spin
//                     style={{
//                       position: "absolute",
//                       top: "50%",
//                       left: "50%",
//                       transform: "translate(-50%, -50%)",
//                       zIndex: 1,
//                     }}
//                   />
//                 )}
//               </div>
//             </Col>
//             <Col className="gutter-row" span={6}>
//               <div>
//                 <Form.Item label="Name Filter" name="NameFilter">
//                   <Select allowClear>
//                     {containsDropdown.map((option) => (
//                       <Select.Option key={option.id} value={option.id}>
//                         {option.name}
//                       </Select.Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//               </div>
//             </Col>
//             <Col className="gutter-row" span={6}>
//               <div>
//                 <Form.Item label=" Patient Name" name="PatientName">
//                   <Input allowClear />
//                 </Form.Item>
//               </div>
//             </Col>
//             <Col className="gutter-row" span={6}>
//               <div>
//                 <Form.Item label="Date of Birth" name="dob">
//                   <DatePicker
//                     style={{ width: "100%" }}
//                     onChange={handleDateChange}
//                     disabledDate={disabledDate}
//                     placeholder="DD-MM-YYYY"
//                     allowClear
//                   />
//                 </Form.Item>
//               </div>
//             </Col>
//           </Row>
//           <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
//             <Col className="gutter-row" span={6}>
//               <div>
//                 <Form.Item label="Identifier Type" name="IdentifierType">
//                   <Select allowClear>
//                     {patientDropdown.CardType.map((option) => (
//                       <Select.Option
//                         key={option.LookupID}
//                         value={option.LookupID}
//                       >
//                         {option.LookupDescription}
//                       </Select.Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//               </div>
//             </Col>
//             <Col className="gutter-row" span={6}>
//               <div>
//                 <Form.Item label="Identifier Value" name="IdentifierValue">
//                   <Input allowClear />
//                 </Form.Item>
//               </div>
//             </Col>
//             <Col className="gutter-row" span={6}>
//               <div>
//                 <Form.Item label="Registration From" name="RegFrom">
//                   <DatePicker
//                     style={{ width: "100%" }}
//                     onChange={handleRegFromDateChange}
//                     disabledDate={disabledDate}
//                     placeholder="DD-MM-YYYY"
//                     allowClear
//                   />
//                 </Form.Item>
//               </div>
//             </Col>
//             <Col className="gutter-row" span={6}>
//               <div>
//                 <Form.Item label="Registration To" name="RegTo">
//                   <DatePicker
//                     style={{ width: "100%" }}
//                     onChange={handleRegToDateChange}
//                     disabledDate={disabledDate}
//                     placeholder="DD-MM-YYYY"
//                     allowClear
//                   />
//                 </Form.Item>
//               </div>
//             </Col>
//           </Row>
//           <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
//             <Col className="gutter-row" span={6}>
//               <div>
//                 <Form.Item
//                   label="Mobile Number :"
//                   name="MobileNumber"
//                   rules={[
//                     {
//                       pattern: new RegExp(/^\d{10}$/),
//                       message: "Invalid mobile number!",
//                     },
//                   ]}
//                 >
//                   <Input allowClear />
//                 </Form.Item>
//               </div>
//             </Col>
//             <Col className="gutter-row" span={6}>
//               <div>
//                 <Form.Item label="City" name="City">
//                   <Input allowClear />
//                 </Form.Item>
//               </div>
//             </Col>
//             <Col className="gutter-row" span={6}>
//               <div>
//                 <Form.Item
//                   label="Age"
//                   name="Age"
//                   rules={[
//                     {
//                       pattern: new RegExp(/^\d{1,3}$/),
//                       message: "Invalid Age",
//                     },
//                   ]}
//                 >
//                   <Input allowClear />
//                 </Form.Item>
//               </div>
//             </Col>
//             <Col className="gutter-row" span={6}>
//               <div>
//                 <Form.Item
//                   style={{ width: "100%" }}
//                   label="Gender"
//                   name="PatientGender"
//                 >
//                   <Select allowClear>
//                     {patientDropdown.Genders.map((option) => (
//                       <Select.Option
//                         key={option.LookupID}
//                         value={option.LookupID}
//                       >
//                         {option.LookupDescription}
//                       </Select.Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//               </div>
//             </Col>
//           </Row>
//           <Row justify="end">
//             <Col style={{ marginRight: "10px" }}>
//               <Form.Item disabled={loading}>
//                 <Button type="primary" htmlType="submit" disabled={loading}>
//                   {/* Search */}
//                   {loading ? "Searching..." : "Search"}
//                 </Button>
//               </Form.Item>
//             </Col>
//             <Col>
//               <Form.Item>
//                 <Button danger onClick={handleReset}>
//                   Clear
//                 </Button>
//               </Form.Item>
//             </Col>
//           </Row>
//         </Form>
//         <Spin spinning={loading || ModalLoader}>
//           <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
//             <Col span={24}>
//               <Table
//                 dataSource={patientsearchDetails}
//                 columns={columns}
//                 className="custom-table"
//                 rowKey={(row) => row.PatientId}
//                 size="small"
//                 onChange={(pagination) => {
//                   setCurrentPage(pagination.current);
//                   setItemsPerPage(pagination.pageSize);
//                 }}
//                 bordered
//               />
//             </Col>
//           </Row>
//         </Spin>
//         <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
//           <Col className="gutter-row" span={12} offset={6}>
//             <div
//               style={{
//                 padding: "10px 10px",
//                 borderRadius: "4px",
//                 margin: "10px",
//                 backgroundColor: "#d9f7be",
//                 display: "flex",
//                 justifyContent: "space-between",
//               }}
//             >
//               <span>
//                 If you are sure, patient is not registered, then
//                 <Button
//                   type="primary"
//                   onClick={navigateToAddPatient}
//                   style={{ margin: "5px" }}
//                 >
//                   Register New Patient
//                 </Button>
//               </span>
//             </div>
//           </Col>
//         </Row>
//       </div>

//       <ConfigProvider
//         theme={{
//           token: {
//             zIndexPopupBase: 3000,
//           },
//         }}
//       >
//         {contextHolder}

//         {isVisitModalVisible && visitsDropdown.PatientType !== undefined && (
//           <VisitModal
//             open={isVisitModalVisible}
//             handleOk={handleOk}
//             ModalLoader={ModalLoader}
//             close={handleVisitModalCancel}
//             IsVisitCreated={IsVisitCreated}
//             patientHeaderDetails={patientHeaderDetails}
//             encounterId={encounterId}
//             form1={form1}
//             dropdown={visitsDropdown}
//             showWard={showWard}
//             isCancelOrEditVisit={false}
//             isCancelEncounter={false}
//           />
//         )}
//       </ConfigProvider>
//       <ConfigProvider
//         theme={{
//           token: {
//             zIndexPopupBase: 3000,
//           },
//         }}
//       >
//         {contextHolder}
//         <Modal
//           width={700}
//           title="More Details"
//           open={isMoreModalVisible}
//           // onOk={handleOk}
//           // okButtonProps={{ disabled: IsVisitCreated }}
//           onCancel={handleMoreModalCancel}
//           maskClosable={false}
//           footer={null}
//         >
//           <div
//             style={{
//               padding: "16px",
//               borderRadius: "4px",
//               margin: "10px",
//               backgroundColor: "#f9f0ff",
//               // display: "flex",
//               // border: "1px solid #d9d9d9",
//               // justifyContent: "space-between",
//               boxShadow: "0px 0px 2px 2px rgba(86,144,199,1)",
//             }}
//           >
//             <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
//               <Col span={8}>
//                 <span style={{ fontWeight: "bold", marginRight: "8px" }}>
//                   UHID :
//                 </span>
//                 <span>{selectedRecord && selectedRecord.UhId}</span>
//               </Col>
//               <Col span={8}>
//                 <span style={{ fontWeight: "bold", marginRight: "8px" }}>
//                   Name :
//                 </span>
//                 <span>{selectedRecord && selectedRecord.PatientName}</span>
//               </Col>
//               <Col span={8}>
//                 <span style={{ fontWeight: "bold" }}>Patient Gender : </span>
//                 <span>{selectedRecord && selectedRecord.PatientGender}</span>
//               </Col>
//             </Row>
//             <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
//               <Col span={8}>
//                 <span style={{ fontWeight: "bold", marginRight: "8px" }}>
//                   Age :
//                 </span>
//                 <span>{selectedRecord && selectedRecord.Age}</span>
//               </Col>
//               <Col span={8}>
//                 <span style={{ fontWeight: "bold", marginRight: "8px" }}>
//                   Dob :
//                 </span>
//                 <span>
//                   {selectedRecord &&
//                     formatDatefortable(selectedRecord.DateOfBirth)}
//                 </span>
//               </Col>
//             </Row>
//           </div>
//           <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
//             <Col span={12}>
//               <div
//                 style={{
//                   padding: "5px 5px",
//                   margin: "10px 10px",
//                 }}
//               >
//                 <strong style={{ fontSize: "15px" }}>
//                   <EnvironmentOutlined /> Present address
//                 </strong>
//                 <br></br>
//                 <span>
//                   {selectedRecord && selectedRecord.PermanentAddress1
//                     ? selectedRecord.PermanentAddress1
//                     : "N/A"}
//                 </span>
//                 <br></br>
//                 <span>{selectedRecord && selectedRecord.AreaName}</span>
//                 <br></br>
//                 <span>{selectedRecord && selectedRecord.PlaceName}</span>
//                 <br></br>
//                 <span>{selectedRecord && selectedRecord.StateName}</span>
//                 <br></br>
//                 <span>{selectedRecord && selectedRecord.CountryName}</span>
//               </div>
//             </Col>
//             <Col span={8}>
//               <div style={{ padding: "5px 5px", margin: "10px 10px" }}>
//                 <strong>Marital Status : </strong>
//                 <span>
//                   {selectedRecord && selectedRecord.MaritalStatusString
//                     ? selectedRecord.MaritalStatusString
//                     : "N/A"}
//                 </span>
//                 <br></br>
//                 <strong>Father / Spouse name : </strong>
//                 <span>
//                   {selectedRecord && selectedRecord.FatherHusbandName
//                     ? selectedRecord.FatherHusbandName
//                     : "N/A"}
//                 </span>
//                 <br></br>
//               </div>
//             </Col>
//           </Row>
//         </Modal>
//       </ConfigProvider>
//     </div>
//   );
// };
// export default ClinicalChartFlow;
