import {
  ArrowLeftOutlined,
  EditOutlined,
  PlusCircleFilled,
  PlusCircleOutlined,
  PlusOutlined,
  PlusSquareFilled,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Row,
  Col,
  Typography,
  Button,
  Form,
  Checkbox,
  Select,
  Divider,
  Collapse,
  notification,
  Modal,
  Table,
} from "antd";
import { useForm } from "antd/es/form/Form";
import Title from "antd/es/typography/Title";
import TextArea from "antd/es/input/TextArea";
import Input from "antd/es/input/Input";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  urlCreateNewService,
  urlAddNewService,
} from "../../../../../endpoints";
import customAxios from "../../../../components/customAxios/customAxios";
import OrderingAttributeModal from "./OrderingAttributeModal";
import MedicalCodeModal from "./MedicalCodeModal";
import TurnAroundTimeTableModal from "./TurnAroundTimeTableModal";
const { Panel } = Collapse;
function CreateService() {
  const [form] = Form.useForm();
  const location = useLocation();
  const Serviceclassificationid = location.state.serviceclassificationid;
  const [uom, setUom] = useState([]);
  const [category, setCategory] = useState([]);
  const [servicegroupname, setServiceGroupName] = useState([]);
  const [serviceclassificationname, setServiceClassificationName] = useState(
    []
  );
  const [testresulttypes, setTestResultTypes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMedicalModalVisible, setIsMedicalModalVisible] = useState(false);
  const [isTurnAroundTimeModalVisible, setIsTurnAroundTimeModalVisible] = useState(false);
  const [orderAtributeDropdown, setOrderAtributeDropDown] = useState([]);
  console.log("Serviceclassificationid", Serviceclassificationid);
  const [ageGenderRestriction, setAgeGenderRestriction] = useState([]);
  const [turnAroundTime, setTurnAroundTime] = useState([]);
  const [medicalCode, setMedicalCode] = useState([]);
  const [keyCounter, setKeyCounter] = useState(0);
  const [keyCounterTAT, setKeyCounterTAT] = useState(0);
  const [keyCounterMED, setKeyCounterMED] = useState(0);
  const [serviceDropDown, setServiceDropDown] = useState({
    Genders: [],
    Uoms: [],
    MedicalCodeTypes: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      debugger;
      try {
        const response = await customAxios.get(
          `${urlCreateNewService}?ServiceClassificationId=${Serviceclassificationid}`
        );
        if (response.status === 200 && response.data.data != null) {
          const data = response.data.data;
          console.log("dataaaaa", data);
          setTestResultTypes(data.TestResultTypes);
          setUom(data.Uoms);
          setCategory(data.Category);
          setServiceGroupName(data.ServiceGroupName);
          setServiceClassificationName(data.ServiceClassificationName);
          setServiceDropDown(data);
        } else {
          console.error("Failed to fetch patient details");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const options = [
    {
      value: "true",
      label: "Active",
    },
    {
      value: "false",
      label: "Hidden",
    },
  ];

  const onFinish = async (values) => {
    debugger;
    values.ServiceClassificationId = Serviceclassificationid;
    try {
      const response = await customAxios.post(urlAddNewService, values, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status == 200 && response.data.data == true) {
        notification.success({
          message: "Success",
          description: "ServiceAdded Succeessfully.....",
        });
        form.resetFields();
        const url = "/Service";
        navigate(url);
      } else {
        notification.error({
          message: "Error",
          description: "Something Went Wrong.....",
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Something Went Wrong.....",
      });
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const showMedicalCodeModel = () => {
    setIsMedicalModalVisible(true);
  };
  const showTurnArountTimeModel = () => {
    setIsTurnAroundTimeModalVisible(true);
  };


  const handleSubmit = (values) => {
    debugger;
    console.log(values);
    // Ensure values is an array
    const valuesArray = Array.isArray(values) ? values : [values];

    // Map the incoming values and add a key to each
    const valuesWithKeys = valuesArray.map((value, index) => ({
      ...value,
      key: keyCounter + index,
    }));

    // Increment the key counter
    setKeyCounter(keyCounter + valuesArray.length);

    // Update the state with the new values with keys
    setAgeGenderRestriction((prev) => [...prev, ...valuesWithKeys]);
  };

  
  const handleMedicalCodeSubmit = (values) => {
    debugger;
    console.log(values);
   
   // Ensure values is an array
    const valuesArray = Array.isArray(values) ? values : [values];

    // Map the incoming values and add a key to each
    const valuesWithKeys = valuesArray.map((value, index) => ({
      ...value,
      key: keyCounterMED + index,
    }));

    // Increment the key counter
    setKeyCounterMED(keyCounterMED + valuesArray.length);

    // Update the state with the new values with keys
    setMedicalCode((prev) => [...prev, ...valuesWithKeys]);
  };
  const handleTurnAroundTimeSubmit = (values) => {
    debugger;

    
   
    const valuesArray = Array.isArray(values) ? values : [values];

    // Map the incoming values and add a key to each
    const valuesWithKeys = valuesArray.map((value, index) => ({
      ...value,
      key: keyCounterTAT + index,
    }));

    // Increment the key counter
    setKeyCounterTAT(keyCounterTAT + valuesArray.length);

    // Update the state with the new values with keys
    setTurnAroundTime((prev) => [...prev, ...valuesWithKeys]);
  };


  const columns = [
    {
      title: "Gender",
      dataIndex: "GenderType",
      key: "GenderType",
    },
    {
      title: "Start Age",
      dataIndex: "StartAge",
      key: "StartAge",
    },
    {
      title: "Age Unit",
      dataIndex: "StartAgeUnitShortName",
      key: "StartAgeUnitShortName",
    },
    {
      title: "End Age",
      dataIndex: "EndAge",
      key: "EndAge",
    },
    {
      title: "Age Unit",
      dataIndex: "EndAgeUnitShortName",
      key: "EndAgeUnitShortName",
    },
  ];
  const columnsTurnAroundTime = [
    {
      title: "Order Priority",
      dataIndex: "OrderPriorityId",
      key: "OrderPriorityId",
    },
    {
      title: "Tat Value",
      dataIndex: "TatValue",
      key: "TatValue",
    },
    {
      title: "Tat UOM",
      dataIndex: "UOM",
      key: "UOM",
    },
    
  ];
  const columnMedicalCode = [
    {
      title: "Medical Code Type",
      dataIndex: "MedicalCodeTypeName",
      key: "MedicalCodeTypeName",
    },
    {
      title: "Version",
      dataIndex: "Version",
      key: "Version",
    },
    {
      title: "Medical CodeType Description",
      dataIndex: "MedicalCodeTypeDescription",
      key: "MedicalCodeTypeDescription",
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "Action",
    },
  ];

  const handleClick = () => {
    // Your handle click logic here

    console.log("Plus icon clicked");
  };

  return (
    <>
      <Layout>
        <div
          style={{
            width: "100%",
            backgroundColor: "white",
            minHeight: "max-content",
            borderRadius: "10px",
          }}
        >
          <Row
            style={{
              padding: "0.5rem 2rem 0.5rem 2rem",
              backgroundColor: "#40A2E3",
              borderRadius: "10px 10px 0px 0px ",
            }}
          >
            <Col span={16}>
              <Title
                level={4}
                style={{
                  color: "white",
                  fontWeight: 500,
                  margin: 0,
                  paddingTop: 0,
                }}
              >
                Create Service Definition Manager
              </Title>
            </Col>
            <Col offset={5} span={3}>
              <Button
                className="dfja"
                icon={<ArrowLeftOutlined style={{ fontSize: "1.1rem" }} />}
                onClick={() => navigate("/Service")}
              >
                Back to list
              </Button>
            </Col>
          </Row>

          <Form
            style={{ margin: "1rem 2rem" }}
            layout="vertical"
            form={form}
            onFinish={onFinish}
          >
            <Row gutter={32}>
              <Col span={8}>
                <strong>Service Group:</strong> {servicegroupname}
              </Col>
              <Col span={8}>
                <strong>Service Classification:</strong>{" "}
                {serviceclassificationname}
              </Col>
            </Row>
            <Row gutter={18}>
              <Col span={6}>
                <Form.Item
                  name="ShortName"
                  label="Service Code"
                  rules={[
                    {
                      required: true,
                      message: "Please enter ServiceCode",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="LongName"
                  label="Service Name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter ServiceName",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  name="UomId"
                  label="Uom"
                  rules={[
                    {
                      required: true,
                      message: "Please select Uom",
                    },
                  ]}
                >
                  <Select
                    style={{ width: "100%" }}
                    placeholder="SelectUom"
                    allowClear
                  >
                    {uom.map((option) => (
                      <Select.Option key={option.UomId} value={option.UomId}>
                        {option.ShortName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="CategoryId"
                  label="Category"
                  rules={[
                    {
                      required: true,
                      message: "Please select category",
                    },
                  ]}
                >
                  <Select
                    style={{ width: "100%" }}
                    placeholder="SelectCategory"
                    allowClear
                  >
                    {category.map((option) => (
                      <Select.Option
                        key={option.LookupID}
                        value={option.LookupID}
                      >
                        {option.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={18}>
              <Col span={6}>
                <Form.Item
                  name="Status"
                  label="Status"
                  rules={[
                    {
                      required: true,
                      message: "Please select Status",
                    },
                  ]}
                  initialValue="true" // Add this line
                >
                  <Select style={{ width: "100%" }} options={options} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Remarks">
                  <Form.Item name="Remarks" noStyle>
                    <Input.TextArea />
                  </Form.Item>
                </Form.Item>
              </Col>
            </Row>

            <Collapse accordion>
              <Panel header="Lab Details" key="1">
                <Row gutter={16}>
                  <Col span={24}>
                    <Row gutter={16}>
                      <Col span={4}>
                        <Form.Item
                          label="Test Type"
                          name="IsSubTest"
                          valuePropName="checked"
                        >
                          <Checkbox>Is SubTest ?</Checkbox>
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          label="Category"
                          name="IsRadiology"
                          valuePropName="checked"
                        >
                          <Checkbox> Is Radiology ? </Checkbox>
                        </Form.Item>
                      </Col>

                      <Col span={4}>
                        <Form.Item name="ResultType" label="Result Type">
                          <Select
                            style={{ width: "100%" }}
                            placeholder="SelectResultType"
                            allowClear
                          >
                            {testresulttypes.map((option) => (
                              <Select.Option
                                key={option.LookupID}
                                value={option.LookupID}
                              >
                                {option.LookupDescription}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={6}>
                        <Form.Item label="Templates" name="TemplateID">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label="Sample Type" name="SampleTypeId">
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row gutter={16}>
                      <Col span={4}>
                        <Form.Item
                          label="&nbsp;"
                          name="IsFromTestValues"
                          valuePropName="checked"
                        >
                          <Checkbox> IsResult From Test Values ? </Checkbox>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="Test Values" name="TestValues">
                          <Input.TextArea />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label="Select Normal Value"
                          name="NormalValForTestVal"
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label="Lab UOM" name="LabUOM">
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Panel>
            </Collapse>
            <Collapse accordion style={{ marginTop: "0.5rem" }}>
              <Panel header="Ordering Attribute" key="2">
                <Row gutter={16}>
                  <Col span={5}>
                    <Form.Item
                      label="Is Orderable"
                      name="Is Orderable"
                      valuePropName="checked"
                    >
                      <Checkbox>Is Orderable ?</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item
                      label="Frequency Applicable"
                      name="Frequency Applicable"
                      valuePropName="checked"
                    >
                      <Checkbox> Frequency Applicable ? </Checkbox>
                    </Form.Item>
                  </Col>

                  <Col span={5}>
                    <Form.Item
                      label="Schedule Applicable"
                      name="Schedule Applicable"
                      valuePropName="checked"
                    >
                      <Checkbox> Schedule Applicable? </Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item
                      label="Is Quantity Applicable"
                      name="Is Quantity Applicable"
                      valuePropName="checked"
                    >
                      <Checkbox>Is Quantity Applicable ?</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Divider orientation="left"> ApplicablePatientType</Divider>
                  <Col span={5}>
                    <Form.Item
                      label="Emergency Patient"
                      name="Emergency Patient"
                      valuePropName="checked"
                    >
                      <Checkbox>Emergency Patient</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item
                      label="Frequency Applicable"
                      name="Frequency Applicable"
                      valuePropName="checked"
                    >
                      <Checkbox>In Patient </Checkbox>
                    </Form.Item>
                  </Col>

                  <Col span={5}>
                    <Form.Item
                      label="Ambulatory Patient"
                      name="Ambulatory Patient"
                      valuePropName="checked"
                    >
                      <Checkbox>Ambulatory Patient </Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item
                      label="Short Stay Patient"
                      name="Short Stay Patient"
                      valuePropName="checked"
                    >
                      <Checkbox>Short Stay Patient</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Divider orientation="left">
                    Age-Gender Restriction
                    <PlusCircleFilled
                      style={{ marginLeft: 8 }}
                      onClick={showModal}
                    />
                  </Divider>
                  <OrderingAttributeModal
                    options={serviceDropDown}
                    open={isModalVisible}
                    handleClose={() => setIsModalVisible(false)}
                    handleSubmit={handleSubmit}
                    // discountDetails={discountDetails}
                    // setCharges={setCharges}
                  />
                </Row>
                <Table
                  // style={{ padding: '0rem 2rem' }}
                  dataSource={ageGenderRestriction}
                  columns={columns}
                  pagination={false}
                  //rowKey={(row) => row.ChargeID} // Specify the custom id property here
                  locale={{
                    emptyText: (
                      <span style={{ color: "" }}>No data available</span>
                    ),
                  }}
                  bordered
                ></Table>
              </Panel>
            </Collapse>

            <Collapse accordion style={{ marginTop: "0.5rem" }}>
              <Panel header="Execution Attributes" key="3">
                <Row gutter={16}>
                  <Col span={5}>
                    <Form.Item
                      label="Schedule Applicable"
                      name="Schedule Applicable"
                      valuePropName="checked"
                    >
                      <Checkbox> Result Applicable </Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item label="Result Template" name="Result Template">
                      <input type="text" disabled />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item
                      label="Anesthetist Required"
                      name="Anesthetist Required"
                      valuePropName="checked"
                    >
                      <Checkbox>Anesthetist Required</Checkbox>
                    </Form.Item>
                  </Col>
                  <Divider orientation="left">
                    Estimated Service Duration
                  </Divider>
                </Row>
                <Row gutter={16}>
                  <Col span={5}>
                    <Form.Item label="Min." name="Min">
                      <Input style={{ width: "100%" }} disabled />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item label="Standard" name="Standard">
                      <Input style={{ width: "100%" }} disabled />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item label="Max." name="Max.">
                      <Input style={{ width: "100%" }} disabled />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item label="Uom" name="UomEx">
                      <Select
                        style={{ width: "100%" }}
                        placeholder="SelectUom"
                        allowClear
                      >
                        {uom.map((option) => (
                          <Select.Option
                            key={option.UomId}
                            value={option.UomId}
                          >
                            {option.ShortName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Panel>
            </Collapse>
            <Collapse accordion style={{ marginTop: "0.5rem" }}>
              <Panel
                header={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>Turn Around Time</span>
                    <Button
                      type="text"
                      icon={<PlusCircleOutlined />}
                      onClick={showTurnArountTimeModel}
                    />
                  </div>
                }
                key="4"
              >
                <Table
                  // style={{ padding: '0rem 2rem' }}
                  dataSource={turnAroundTime}
                  columns={columnsTurnAroundTime}
                  pagination={false}
                  //rowKey={(row) => row.ChargeID} // Specify the custom id property here
                  locale={{
                    emptyText: (
                      <span style={{ color: "" }}>No data available</span>
                    ),
                  }}
                  bordered
                ></Table>
                <TurnAroundTimeTableModal
                  options={serviceDropDown}
                  open={isTurnAroundTimeModalVisible}
                  handleClose={() => setIsTurnAroundTimeModalVisible(false)}
                  handleSubmit={handleTurnAroundTimeSubmit}
              
                  // discountDetails={discountDetails}
                  // setCharges={setCharges}
                />
              </Panel>
            </Collapse>
            <Collapse accordion style={{ marginTop: "0.5rem" }}>
              <Panel
                header={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>Medical Codes</span>
                    <Button
                      type="text"
                      icon={<PlusCircleOutlined />}
                      onClick={showMedicalCodeModel}
                    />
                  </div>
                }
                key="5"
              >
                <Table
                  // style={{ padding: '0rem 2rem' }}
                  dataSource={medicalCode}
                  columns={columnMedicalCode}
                  //rowKey={(row) => row.ChargeID} // Specify the custom id property here
                  locale={{
                    emptyText: (
                      <span style={{ color: "" }}>No data available</span>
                    ),
                  }}
                  bordered
                  pagination={false}
                ></Table>
                <MedicalCodeModal
                  options={serviceDropDown}
                  open={isMedicalModalVisible}
                  handleClose={() => setIsMedicalModalVisible(false)}
                  handleSubmit={handleMedicalCodeSubmit}
                  // discountDetails={discountDetails}
                  // setCharges={setCharges}
                />
              </Panel>
            </Collapse>
            <Row gutter={32} style={{ marginTop: "1.5rem" }}>
              {" "}
              {/* Added this line */}
              <Col offset={20} span={2}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item>
                  <Button type="default">Cancel</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Layout>
    </>
  );
}

export default CreateService;
