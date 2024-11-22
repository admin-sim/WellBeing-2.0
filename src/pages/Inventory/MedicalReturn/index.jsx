import React, { useState, useEffect } from "react";
import Layout from 'antd/es/layout/layout';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import male from "../../../assets/m.png";
import dayjs from 'dayjs';
import {
  Spin,
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
  AutoComplete,
  Avatar,
  InputNumber
} from "antd";
//import { CloseSquareFilled } from '@ant-design/icons';
import { useNavigate } from "react-router";
const { Text } = Typography;
import {
  urlSearchUHID,
  urlGetLastEncounter,
  urlGetPatientHeaderDetails,
  urlGetConsumptionReturnList
} from "../../../../endpoints.js";
import { render } from "react-dom";
import customAxios from "../../../components/customAxios/customAxios.jsx";
import PatientHeader from "../../../components/PatientHeader/index.jsx";
import AdvancedPatientSearch from "../../../components/AdvancedPatientSearch/index.jsx";
import PageHeader from "../../../components/PageHeader/index.jsx";
//import { useLocation } from 'react-router-dom';

const MedicalReturn = () => {

  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);
  const [form] = Form.useForm();
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
  const [isTable, setIsTable] = useState(false);
  const [encounter, setEncounter] = useState([])
  const { Title } = Typography;
  const [patientData, setPatientData] = useState(null);

  const colorMapping = {
    Created: "#4E31AA",
    Draft: "#6EACDA",
    Pending: "#F5004F",
    "Partially Pending": "#8E3E63",
    Finalize: "#52c41a",
    Completed: "#FF9100",
  };

  const getPanelValue = async (searchText) => {
    if (searchText == '') {
      form.resetFields()
      return false
    }
    if (searchText === '') {
      setEncounter([])
    }
    try {
      customAxios.get(`${urlSearchUHID}?Uhid=${searchText}`).then((response) => {
        const apiData = response.data.data;
        const newOptions = apiData.map(item => ({ value: item.UhId, key: item.PatientId, Name: item.PatientFirstName + ' ' + item.PatientLastName }));
        setAutoCompleteOptions(newOptions);
      });
    } catch (error) {
      //console.error("Error fetching purchase order details:", error);        
    }
  }

  const handleSelect = (value, option) => {
    form.setFieldsValue({ Name: option.Name })
    try {
      customAxios.get(`${urlGetLastEncounter}?Uhid=${option.value}`).then((response) => {
        if (response.data.data.length > 0) {
          setEncounter(response.data.data);
          form.setFieldsValue({ EncounterId: response.data.data[0].EncounterId });
          form.setFieldsValue({ PatientId: option.key });
          form.setFieldsValue({ Encounter: response.data.data[0].GeneratedEncounterId })
        } else {
          setEncounter([]);
          form.setFieldsValue({ EncounterId: '' });
          form.setFieldsValue({ PatientId: '' });
        }
      });
    } catch (error) {
      //console.error("Error fetching purchase order details:", error);        
    }
  }

  const columns = [
    {
      title: "Product",
      dataIndex: "ServiceName",
      key: "ServiceName",
      render: (text, record, index) => (
        <>
          {text}
          < Form.Item hidden name='ServiceID' initialValue={record.ServiceID}><Input /></Form.Item>
          <Form.Item hidden name='ChargeID' initialValue={record.ChargeID}><Input /></Form.Item>
        </>
      ),
    },
    {
      title: "Batch No",
      dataIndex: "BatchNo",
      key: "BatchNo",
      render: (text, record) => (
        text
      )
    },
    {
      title: "Expiry Date",
      dataIndex: "EXPDateString",
      key: "EXPDateString",
      render: (text, record) => (
        text
      )
    },
    {
      title: "Returned Quantity",
      dataIndex: "ReturnedQty",
      key: "ReturnedQty",
      render: (text, record) => (
        text
      )
    },
    {
      title: "Returnable Quantity",
      dataIndex: "Quantity",
      key: "Quantity",
      render: (text, record) => (
        text
      )
    },
    {
      title: "Return Qty",
      dataIndex: "ReturnQty",
      key: "ReturnQty",
      render: (text, record) => (
        <InputNumber min={0} allowClear />
      )
    },
    {
      title: "Return Amt/Unit",
      dataIndex: "Rate",
      key: "Rate",
      render: (text, record) => (
        text
      )
    },
    {
      title: "Tax Amt/Unit",
      dataIndex: "TaxAmount",
      key: "TaxAmount",
      render: (text, record) => (
        text
      )
    },
    {
      title: "Discount",
      dataIndex: "DiscountAmount",
      key: "DiscountAmount",
      render: (text, record) => (
        text
      )
    },
    {
      title: "Net Return Amount",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        record.ReturnQty * record.Rate
      )
    }
  ];

  const onFinish = async (values) => {
    debugger;

  };

  const onReset = () => {
    form.resetFields();
  };

  const SelectPatient = async () => {
    await form.validateFields()
    const formdata = form.getFieldsValue()
    try {
      const response = await customAxios.get(
        `${urlGetPatientHeaderDetails}?PatientId=${formdata.PatientId}&EncounterId=${formdata.EncounterId}`
      );
      if (response.status === 200 && response.data.data != null) {
        const detailsheader = response.data.data.EncounterModel;
        setPatientData(detailsheader);
        setIsTable(true)
      } else {
        console.error("Failed to fetch patient details");
        setIsTable(false)
      }
    } catch (error) {
      console.error("Error:", error);
    }
    try {
      const response = await customAxios.get(
        `${urlGetConsumptionReturnList}?PatientId=${formdata.PatientId}&EncounterId=${formdata.EncounterId}&Encounter=${formdata.Encounter}`
      );
      if (response.status === 200 && response.data.data != null) {
        setFilteredData(response.data.data.PatientAccountCharges)
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function handleOnSubmit(value) {
    debugger
    try {
      const response = await customAxios.get(
        `${urlGetPatientHeaderDetails}?PatientId=${value.patientId}&EncounterId=${value.Encounter}`
      );
      if (response.status === 200 && response.data.data != null) {
        const detailsheader = response.data.data.EncounterModel;
        setPatientData(detailsheader);
        setIsTable(true)
      }
    } catch (error) { }
    try {
      setLoading(true)
      const response = await customAxios.get(
        `${urlGetConsumptionReturnList}?PatientId=${value.patientId}&EncounterId=${value.Encounter}&Encounter=${null}`
      );
      if (response.status === 200 && response.data.data != null) {
        const detailsheader = response.data.data.EncounterModel;
        setFilteredData(detailsheader);
        setLoading(false)
      }
    } catch (error) { }
  }

  return (
    <Layout
      style={{
        width: "100%",
        backgroundColor: "white",
        minHeight: "max-content",
        borderRadius: "10px",
      }}
    >
      <PageHeader title={"Medical Return"} button={false} />
      <AdvancedPatientSearch handleOnSubmit={handleOnSubmit} />
      {isTable && (
        <Card>
          <div style={{ margin: "0 2rem 1rem 2rem" }}>
            <PatientHeader patient={patientData} />
          </div>
          {/* <Table
                    dataSource={filteredData}
                    columns={columns}
                    pagination={{
                      showTotal: (total, range) =>
                        `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                    }}
                    rowKey={(row) => row.ChargeID} // Specify the custom id property here
                    locale={{
                      emptyText: <span style={{ color: "" }}>No data available</span>,
                    }}
                    // size="small"
                    bordered
                  /> */}
          <Table loading={loading}
            dataSource={filteredData}
            columns={columns}
            rowKey={(row) => row.ChargeID}
            locale={{
              emptyText: <span style={{ color: "" }}>No data available</span>,
            }}
            bordered
            pagination={{
              showTotal: (total, range) =>
                `Showing ${range[0]} to ${range[1]} of ${total} entries`,
            }}
            scroll={{ x: 1400 }}
            summary={(pageData) => {
              let netamt = 0;
              let rate = 0;
              let returnqty = 0;
              pageData.forEach(
                ({
                  ReturnQty,
                  Rate
                }) => {
                  returnqty += ReturnQty;
                  rate += Rate;
                }
              );
              return (
                <>
                  <Table.Summary.Row>
                    <Table.Summary.Cell
                      index={0}
                      colSpan={8}
                    ></Table.Summary.Cell>
                    <Table.Summary.Cell index={3}>
                      <Text type="danger">Total</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>
                      <Text type="danger">{returnqty * rate}</Text>
                    </Table.Summary.Cell>
                    {/* <Table.Summary.Cell index={2}>
                              <Text type="danger">{insamt}</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={2}>
                              <Text type="danger">{taxamt}</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={2}>
                              <Text type="danger">{netinsamt}</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={2}>
                              <Text type="danger">Total</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={2}>
                              <Text type="danger">{discamt.toFixed(2)}</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={2}>
                              <Text type="danger">{taxrate}</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={2}>
                              <Text type="danger">{patientnetamt}</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={2}>
                              <Text type="danger">{adjamt}</Text>
                            </Table.Summary.Cell> */}
                    <Table.Summary.Cell
                      index={2}
                      colSpan={9}
                    ></Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              );
            }}
          />
          <Row justify="end">
            <Col>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Col>
            {/* <Col>
                  <Form.Item>
                    <Button type="default" onClick={onReset}>
                      Reset
                    </Button>
                  </Form.Item>
                </Col> */}
          </Row>
        </Card>
      )}
    </Layout>
  );

  //   return (
  //     <Layout style={{ zIndex: '999999999' }}>
  //       <div style={{ width: '100%', backgroundColor: 'white', minHeight: 'max-content', borderRadius: '10px' }}>
  //         <Row style={{ padding: '0.5rem 2rem 0.5rem 2rem', backgroundColor: '#40A2E3', borderRadius: '10px 10px 0px 0px ' }}>
  //           <Col span={16}>
  //             <Title level={4} style={{ color: 'white', fontWeight: 500, margin: 0, paddingTop: 0 }}>
  //               Medical Return
  //             </Title>
  //           </Col>
  //         </Row>
  //         <Card>
  //           <Form
  //             form={form}
  //             name="control-hooks"
  //             layout="vertical"
  //             variant="outlined"
  //             // size="Default"
  //             style={{
  //               maxWidth: 1500,
  //             }}
  //             onFinish={onFinish}
  //           >
  //             <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
  //               <Col className="gutter-row" span={4}>
  //                 <Form.Item label="UHID" name="UHID"
  //                   rules={[
  //                     {
  //                       required: true,
  //                     },
  //                   ]}
  //                 >
  //                   {/* <AutoComplete
  //                     options={autoCompleteOptions}
  //                     // options={autoCompleteOptions[record.key]}
  //                     onSearch={getPanelValue}
  //                     onSelect={(value, option) => handleSelect(value, option)}
  //                     placeholder="Search for a Uhid"
  //                     allowClear
  //                   /> */}
  //                   <AutoComplete
  //                     options={autoCompleteOptions}
  //                     onSearch={(value) => getPanelValue(value)}
  //                     onSelect={(value, option) => handleSelect(value, option)}
  //                     // value={uhId}
  //                     placeholder="Search for a Uhid"
  //                     allowClear
  //                   />
  //                 </Form.Item>
  //               </Col>
  //               <Col className="gutter-row" span={4}>
  //                 <Form.Item name="Name" label="Name"
  //                   rules={[
  //                     {
  //                       required: true,
  //                     },
  //                   ]}
  //                 >
  //                   <Input style={{ width: '100%' }} allowClear />
  //                 </Form.Item>
  //                 <Form.Item name="PatientId" hidden>
  //                   <Input />
  //                 </Form.Item>
  //               </Col>
  //               <Col className="gutter-row" span={4}>
  //                 <Form.Item name="EncounterId" label="EncounterId"
  //                   rules={[
  //                     {
  //                       required: true,
  //                     },
  //                   ]}
  //                 >
  //                   <Select disabled={encounter.length <= 1}
  //                     onChange={(value, option) => {
  //                       form.setFieldsValue({ Encounter: option.children });
  //                     }}
  //                   >
  //                     {encounter.map((option) => (
  //                       <Select.Option key={option.EncounterId} value={option.EncounterId}>
  //                         {option.GeneratedEncounterId}
  //                       </Select.Option>
  //                     ))}
  //                   </Select>
  //                 </Form.Item>
  //                 <Form.Item name="Encounter" hidden>
  //                   <Input />
  //                 </Form.Item>
  //               </Col>
  //               <Col className="gutter-row" span={1} style={{ marginTop: 30 }}>
  //                 <Form.Item>
  //                   <Button type="primary" onClick={SelectPatient}>
  //                     Select
  //                   </Button>
  //                 </Form.Item>
  //               </Col>
  //               <Col className="gutter-row" span={2} style={{ marginTop: 30 }}>
  //                 <Form.Item>
  //                   <Button type="primary" onClick={onReset}>
  //                     Reset
  //                   </Button>
  //                 </Form.Item>
  //               </Col>
  //             </Row>
  //             {isTable && (
  //               <>
  //                 <div style={{ margin: "0 2rem 1rem 2rem" }}>
  //                   <PatientHeader patient={patientData} />
  //                 </div>
  //                 {/* <Table
  //                   dataSource={filteredData}
  //                   columns={columns}
  //                   pagination={{
  //                     showTotal: (total, range) =>
  //                       `Showing ${range[0]} to ${range[1]} of ${total} entries`,
  //                   }}
  //                   rowKey={(row) => row.ChargeID} // Specify the custom id property here
  //                   locale={{
  //                     emptyText: <span style={{ color: "" }}>No data available</span>,
  //                   }}
  //                   // size="small"
  //                   bordered
  //                 /> */}
  //                 <Table
  //                   dataSource={filteredData}
  //                   columns={columns}
  //                   rowKey={(row) => row.ChargeID}
  //                   locale={{
  //                     emptyText: <span style={{ color: "" }}>No data available</span>,
  //                   }}
  //                   bordered
  //                   pagination={{
  //                     showTotal: (total, range) =>
  //                       `Showing ${range[0]} to ${range[1]} of ${total} entries`,
  //                   }}
  //                   scroll={{ x: 1400 }}
  //                   summary={(pageData) => {
  //                     let netamt = 0;
  //                     let rate = 0;
  //                     let returnqty = 0;
  //                     pageData.forEach(
  //                       ({
  //                         ReturnQty,
  //                         Rate
  //                       }) => {
  //                         returnqty += ReturnQty;
  //                         rate += Rate;
  //                       }
  //                     );
  //                     return (
  //                       <>
  //                         <Table.Summary.Row>
  //                           <Table.Summary.Cell
  //                             index={0}
  //                             colSpan={8}
  //                           ></Table.Summary.Cell>
  //                           <Table.Summary.Cell index={3}>
  //                             <Text type="danger">Total</Text>
  //                           </Table.Summary.Cell>
  //                           <Table.Summary.Cell index={2}>
  //                             <Text type="danger">{returnqty * rate}</Text>
  //                           </Table.Summary.Cell>
  //                           {/* <Table.Summary.Cell index={2}>
  //                             <Text type="danger">{insamt}</Text>
  //                           </Table.Summary.Cell>
  //                           <Table.Summary.Cell index={2}>
  //                             <Text type="danger">{taxamt}</Text>
  //                           </Table.Summary.Cell>
  //                           <Table.Summary.Cell index={2}>
  //                             <Text type="danger">{netinsamt}</Text>
  //                           </Table.Summary.Cell>
  //                           <Table.Summary.Cell index={2}>
  //                             <Text type="danger">Total</Text>
  //                           </Table.Summary.Cell>
  //                           <Table.Summary.Cell index={2}>
  //                             <Text type="danger">{discamt.toFixed(2)}</Text>
  //                           </Table.Summary.Cell>
  //                           <Table.Summary.Cell index={2}>
  //                             <Text type="danger">{taxrate}</Text>
  //                           </Table.Summary.Cell>
  //                           <Table.Summary.Cell index={2}>
  //                             <Text type="danger">{patientnetamt}</Text>
  //                           </Table.Summary.Cell>
  //                           <Table.Summary.Cell index={2}>
  //                             <Text type="danger">{adjamt}</Text>
  //                           </Table.Summary.Cell> */}
  //                           <Table.Summary.Cell
  //                             index={2}
  //                             colSpan={9}
  //                           ></Table.Summary.Cell>
  //                         </Table.Summary.Row>
  //                       </>
  //                     );
  //                   }}
  //                 />
  //               </>
  //             )}
  //             <Row justify="end">
  //               <Col>
  //                 <Form.Item>
  //                   <Button type="primary" htmlType="submit">
  //                     Save
  //                   </Button>
  //                 </Form.Item>
  //               </Col>
  //               {/* <Col>
  //                 <Form.Item>
  //                   <Button type="default" onClick={onReset}>
  //                     Reset
  //                   </Button>
  //                 </Form.Item>
  //               </Col> */}
  //             </Row>
  //           </Form>
  //         </Card>
  //       </div>
  //     </Layout>
  //   );
};

export default MedicalReturn;
