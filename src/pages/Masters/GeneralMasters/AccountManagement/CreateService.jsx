import {
  ArrowLeftOutlined,
  EditOutlined,
  PlusCircleFilled,
  PlusCircleOutlined,
  PlusOutlined,
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
  Table
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
  const [orderAtributeDropdown, setOrderAtributeDropDown] = useState([]);
  console.log("Serviceclassificationid", Serviceclassificationid);
  const [ageGenderRestriction, setAgeGenderRestriction] = useState([]);
  const [keyCounter, setKeyCounter] = useState(0);
  const [serviceDropDown, setServiceDropDown] = useState({

    Genders: [],
    Uoms: [],
 
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
          console.log('dataaaaa',data);
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

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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
  setAgeGenderRestriction(prev => [...prev, ...valuesWithKeys]);
  };

  const columns = [
    {
      title: "Gender",
      dataIndex: "GenderType",
      key: "GenderType",
    },
    {
      title: "StartAge",
      dataIndex: "StartAge",
      key: "StartAge",
    },
    {
      title: "AgeUnit",
      dataIndex: "StartAgeUnitShortName",
      key: "StartAgeUnitShortName",
    },
    {
      title: "EndAge",
      dataIndex: "EndAge",
      key: "EndAge",
    },
    {
      title: "AgeUnit",
      dataIndex: "EndAgeUnitShortName",
      key: "EndAgeUnitShortName",
    },
  ];

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
                  //rowKey={(row) => row.ChargeID} // Specify the custom id property here
                  size="small"
                  locale={{
                    emptyText: (
                      <span style={{ color: "" }}>No data available</span>
                    ),
                  }}
                  bordered
                  
                ></Table>
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
