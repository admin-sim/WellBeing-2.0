import { PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Select,
  Spin,
  Layout,
  Card,
  DatePicker,
  message,
  AutoComplete,
  notification
} from "antd";
import Title from "antd/es/typography/Title";
import Input from "antd/es/input/Input";
import customAxios from "../../../../components/customAxios/customAxios";
import React, { useEffect, useState } from "react";
import {
  urlCreateAutoCharge,
  urlGetAllDepartmentsForFacility,
  urlGetChargeProviders,
  urlGetAllFacilityDepartmentProvider,
  urlGetAllServicesBasedOnFacilityIdAsync,
  urlAddNewAutoCharge
} from "../../../../../endpoints";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { CloseSquareFilled } from "@ant-design/icons";

const { TextArea } = Input;

function CreateAutoCharge() {
  const location = useLocation();
  const EditedPricetariffId = location.state?.PriceTariffId;
  console.log("EditedPricetariffId", EditedPricetariffId);
  const navigate = useNavigate();
  const [services, setServices] = useState(null);
  const [chargeProvider, setChargeProvider] = useState(null);
  const [chargeProviderId, setChargeProviderId] = useState(null);
  const [serviceId, setSelectedServiceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [autoChargeDropDown, setAutoChargeDropDown] = useState({
    PatientType: [],
    Facility: [],
    EncounterType: [],
  });

  const [facilityDept, setFacilityDept] = useState([]);
  const [provider, setProvider] = useState([]);

  const handleCancel = () => {
    navigate("/AutoCharge");
  };

  //   const handleEdit = async (record) => {
  //     try {
  //       const response = await customAxios.get(
  //         `${urlEditPriceTariffChargeParameter}?PriceTariffLine=${record.PriceTariffLineId}`
  //       );
  //       if (response.status === 200 && response.data.data != null) {
  //         const editpricechargeparameteres = response.data.data;
  //         setEditPriceariffDropdown(editpricechargeparameteres);
  //         setLinedata(editpricechargeparameteres.AddNewBillTariffLineModel);
  //         setEditedPriceTariffLineId(record.PriceTariffLineId);
  //         setEditModalOpen(true);
  //       } else {
  //         console.error("Failed to fetch patient details");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  //   const handleEfeectiveFrom = (date, dateString) => {
  //     setEffectiveFromDate(dateString);
  //   };
  //   const handleEfeectiveTo = (date, dateString) => {
  //     setEffectiveToDate(dateString);
  //   };

  useEffect(() => {
    fetchData();
  }, []);

  //   useEffect(() => {
  //     debugger;
  //     if (EditedPricetariffId) {
  //       // Check if EditedPricetariffId exists
  //       const fetchData1 = async () => {
  //         const Revision = 0;
  //         try {
  //           const response = await customAxios.get(
  //             `${urlEditPriceTariff}?PriceTariff=${EditedPricetariffId}&Revision=${Revision}`
  //           );
  //           if (response.status === 200 && response.data.data != null) {
  //             const editpricetariffdetail = response.data.data;
  //             form.setFieldsValue({
  //               ShortPriceDescription:
  //                 editpricetariffdetail.AddNewBillTariff.LongPriceDescription,
  //               LongPriceDescription:
  //                 editpricetariffdetail.AddNewBillTariff.LongPriceDescription,
  //               Remarks: editpricetariffdetail.AddNewBillTariff.Remarks,
  //               FacilityId: editpricetariffdetail.AddNewBillTariff.FacilityId,
  //               Status: editpricetariffdetail.AddNewBillTariff.Status,
  //             });
  //             const filteredtransData =
  //               editpricetariffdetail.SelectedChargeParameters.map((item) => ({
  //                 key: item.LookupID,
  //                 title: item.LookupDescription,
  //                 // Add more fields as needed
  //               }));
  //             // Set the pre-selected items in Transfer
  //             setTargetKeys(filteredtransData.map((item) => item.key));
  //             setColumnData(editpricetariffdetail.BillTariffLineModels);
  //           } else {
  //             console.error("Failed to fetch patient details");
  //           }
  //         } catch (error) {
  //           console.error("Error fetching data:", error);
  //         }
  //       };

  //       fetchData1(); // Call the fetchData function
  //     }
  //   }, []);

  const fetchData = async () => {
    //setLoading(true);
    try {
      const response = await customAxios.get(`${urlCreateAutoCharge}`);
      if (response.status == 200 && response.data.data != null) {
        setAutoChargeDropDown(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
    //setLoading(false);
  };

  const onFinish = async (values) => {
    debugger;
   values.ServiceId=serviceId;
   values.ChargeProviderId=chargeProviderId;
   values.ActiveFlag=true;

    try {
      const response = await customAxios.post(urlAddNewAutoCharge, values, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status==200 && response.data.data) {
        console.log('response.data.data',response.data.data);
        notification.success({
          message: "Success",
          description: "AutoCharge Created Succeessfully.....",
        });
        form.resetFields();
        const url = "/AutoCharge";
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

  const onChange = async (value) => {
    debugger;
    console.log(`selected ${value}`);
    if (value)
      try {
        const response = await customAxios.get(
          `${urlGetAllDepartmentsForFacility}?id=${value}`
        );
        if (response.status == 200 && response.data != null) {
          setFacilityDept(response.data);
        }
      } catch (error) {
        console.error(error);
      }
  };

  const onChangeDept = async (value) => {
    debugger;
    console.log(`selected ${value}`);
    if (value)
      try {
        const response = await customAxios.get(
          `${urlGetAllFacilityDepartmentProvider}?id=${value}`
        );
        if (response.status == 200 && response.data != null) {
          setProvider(response.data);
        }
      } catch (error) {
        console.error(error);
      }
  };

  const handleAutoCompleteChange = async (value) => {
    debugger;
    const selectedfacility = form.getFieldValue("FacilityId");
    if (selectedfacility) {
      setLoading(true); // Start loading
      try {
        if (!value.trim()) {
          setServices(null); // Set options to an empty array
          setLoading(false); // Stop loading
          return;
        }
        const response = await customAxios.get(
          `${urlGetAllServicesBasedOnFacilityIdAsync}?Description=${value}&FacilityId=${selectedfacility}`
        );
        const responseData = response.data || [];
        // Ensure responseData is an array and has the expected structure
        if (
          Array.isArray(responseData) &&
          responseData.length > 0 &&
          responseData[0].ServiceId !== undefined
        ) {
          const newOptions = responseData.map((option) => ({
            value: option.Name,
            label: option.Name,
            key: option.ServiceId,
          }));
          setServices(newOptions);
        } else {
          setServices(null);
          form.setFieldValue("Services", "");
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setServices(null); // Set options to an empty array in case of an error
      }
    }
    setLoading(false); // Stop loading
  };

  const handleSelect = async (value, option) => {
    debugger;
    setSelectedServiceId(option.key);
  };
  const handleChargeProviderAutoCompleteChange = async (value) => {
    debugger;
      try {
        if (!value.trim()) {
          setChargeProvider(null); // Set options to an empty array
         // setLoading(false); // Stop loading
          return;
        }
        const response = await customAxios.get(
          `${urlGetChargeProviders}?ProviderName=${value}`
        );
        const responseData = response.data || [];
        // Ensure responseData is an array and has the expected structure
        if (
          Array.isArray(responseData) &&
          responseData.length > 0 &&
          responseData[0].ProviderId !== undefined
        ) {
          const newOptions = responseData.map((option) => ({
            value: option.ProviderFirstName,
            label: option.ProviderFirstName,
            key: option.ProviderId,
          }));
          setChargeProvider(newOptions);
        } else {
          setChargeProvider(null);
          form.setFieldValue("ChargeProviderId", "");
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setChargeProvider(null); // Set options to an empty array in case of an error
      }
    
    
  };

  const handleChargeProviderSelect = async (value, option) => {
    setChargeProviderId(option.key);
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
                PriceTariff
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
              onFinish={onFinish}
            >
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={6}>
                  <Form.Item name="FacilityId" label="Facility">
                    <Select showSearch onChange={onChange}>
                      {autoChargeDropDown.Facility.map((option) => (
                        <Select.Option
                          key={option.FacilityId}
                          value={option.FacilityId}
                        >
                          {option.FacilityName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item name="DepartmentId" label="Department">
                    <Select
                      showSearch
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    
                      onChange={onChangeDept}
                    >
                      {facilityDept.map((option) => (
                        <Select.Option
                          key={option.FacilityDepartmentId}
                          value={option.FacilityDepartmentId}
                        >
                          {option.DepartmentName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item name="EncounterTypeId" label="EncounterType">
                    <Select showSearch  filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }>
                      {autoChargeDropDown.EncounterType.map((option) => (
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
                <Col className="gutter-row" span={6}>
                  <Form.Item name="ProviderId" label="Provider">
                    <Select  filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      } showSearch>
                      {provider.map((option) => (
                        <Select.Option
                          key={option.ProviderId}
                          value={option.ProviderId}
                        >
                          {option.ProviderName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item name="PatientTypeId" label="PatientType">
                    <Select>
                      {autoChargeDropDown.PatientType.map((option) => (
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
                <Col className="gutter-row" span={6}>
                  <Form.Item
                    label="Services"
                    name="Services"
                    rules={[
                      {
                        required: true,
                        message: "Service Required.",
                      },
                    ]}
                  >
                    <AutoComplete
                      options={services}
                      onSearch={handleAutoCompleteChange}
                      onSelect={handleSelect}
                      onChange={(value) => {
                        if (!value) {
                          setServices(null);
                        }
                      }}
                      allowClear={{
                        clearIcon: <CloseSquareFilled />,
                      }}
                      loading={loading}
                    />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                <Form.Item
                    label="Charge Provider"
                    name="ChargeProviderId"
                    rules={[
                      {
                        required: true,
                        message: "ChargeProvider Required.",
                      },
                    ]}
                  >
                    <AutoComplete
                      options={chargeProvider}
                      onSearch={handleChargeProviderAutoCompleteChange}
                      onSelect={handleChargeProviderSelect}
                      onChange={(value) => {
                        if (!value) {
                          setChargeProvider(null);
                        }
                      }}
                      allowClear={{
                        clearIcon: <CloseSquareFilled />,
                      }}
                     // loading={loading}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={6}>
                  <Form.Item name="Status" label="Status">
                    <Select>
                      <Select.Option
                        key="Active"
                        value="Active"
                      ></Select.Option>
                      <Select.Option
                        key="Hidden"
                        value="Hidden"
                      ></Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row justify="end">
                <Col>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>
                  </Form.Item>
                  {/* <Form.Item
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                    >
                      Update
                    </Button>
                  </Form.Item> */}
                </Col>
                <Col>
                  <Form.Item>
                    <Button type="default" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
      </Layout>
    </>
  );
}

export default CreateAutoCharge;
