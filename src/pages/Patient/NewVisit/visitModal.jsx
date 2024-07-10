import customAxios from "../../../components/customAxios/customAxios.jsx";
import React, { useEffect, useState } from "react";
import { Col, ConfigProvider, Row, Select, Card, Space } from "antd";
import Input from "antd/es/input";
import Form from "antd/es/form";
import { Modal } from "antd";
import Button from "antd/es/button";
import {
  urlGetDepartmentBasedOnPatitentType,
  urlGetProviderBasedOnDepartment,
  urlGetServiceLocationBasedonId,
  urlGetWardsBasedOnWardCategory,
  urlGetBedsForWard,
} from "../../../../endpoints.js";

import PatientHeader from "../../../components/PatientHeader/index.jsx";
import PropTypes from "prop-types";

const VisitModal = (
  details,
  handleOk,
  ModalLoader,
  close,
  IsVisitCreated,
  patientHeaderDetails,
  encounterId,
  form1,
  dropdown,
  isCancelOrEditVisit,
  isCancelEncounter,
  submitLoader
) => {
  debugger;
  const [Dropdown, setDropdown] = useState(details.dropdown);

  useEffect(() => {
    setDropdown(details.dropdown);
  }, [details]);

  const [departments, setDepartments] = useState([]);
  const [providers, setProviders] = useState([]);
  const [serviceLocations, setServiceLocations] = useState([]);
  const [serviceLocationId, setServiceLocationId] = useState();
  const [wardsLoader, setWardsLoader] = useState(false);
  const [BedsLoader, setBedsLoader] = useState(false);
  const [wards, setWards] = useState([]);
  const [beds, setBeds] = useState([]);
  const [showWard, setShowWard] = useState(details.showWard);

  const [departmentLoader, setDepartmentLoader] = useState(false);
  const [providerLoader, setProviderLoader] = useState(false);

  const [patientTypeValue, setpatientTypeSelectValue] = useState(null);

  const handlePatientTypeChange = async (value) => {
    setpatientTypeSelectValue(value);

    debugger;
    try {
      // Update the options for the second select based on the value of the first select
      if (value === 23 || value === 24 || value === 25) {
        setShowWard(true);
      } else {
        setShowWard(false);
      }
      if (value !== undefined) {
        details.form1.resetFields([
          "Provider",
          "Department",
          "ServiceLocation",
          "WardCategory",
          "Ward",
          "Bed",
        ]);
        setDepartmentLoader(true);
        const response = await customAxios.get(
          `${urlGetDepartmentBasedOnPatitentType}?PatientType=${value}`
        );

        if (response.status === 200) {
          setDepartmentLoader(false);
          const dept = response.data.data.Departments;
          setDepartments(dept);
          setProviders([]);
          setServiceLocations([]);
        } else {
          // Handle other response statuses if needed
        }
      } else {
        setDepartmentLoader(false);
        setDepartments([]);
        setProviders([]);
        setServiceLocations([]);
        details.form1.resetFields();
      }
    } catch (error) {
      // Handle errors (e.g., network issues)
      console.error("Error fetching data:", error);
    }
  };

  const handleDepartmentChange = async (value) => {
    debugger;
    try {
      // Update the options for the second select based on the value of the first select
      if (value != null) {
        details.form1.resetFields([
          "Provider",
          "ServiceLocation",
          "WardCategory",
          "Ward",
          "Bed",
        ]);
        setProviderLoader(true);
        const providerResponse = await customAxios.get(
          `${urlGetProviderBasedOnDepartment}?DepartmentId=${value}`
        );
        const serviceLocationResponse = await customAxios.get(
          `${urlGetServiceLocationBasedonId}?DepartmentId=${value}&patienttype=${patientTypeValue}`
        );
        if (providerResponse.status === 200) {
          setProviderLoader(false);
          const provider = providerResponse.data.data.Providers;
          setProviders(provider);
          setBeds([]);
          setWards([]);
        } else {
          console.error("Failed to fetch providers");
        }

        if (serviceLocationResponse.status === 200) {
          setProviderLoader(false);
          const serviceLoc = serviceLocationResponse.data.data.ServiceLocations;
          setServiceLocations(serviceLoc);
          setBeds([]);
          setWards([]);
        } else {
          console.error("Failed to fetch service locations");
        }
      } else {
        setProviderLoader(false);
        setProviders([]);
        setServiceLocations([]);
        setBeds([]);
        setWards([]);
        details.form1.resetFields([
          "Provider",
          "ServiceLocation",
          "WardCategory",
          "Ward",
          "Bed",
        ]);
      }
    } catch (error) {
      // Handle errors (e.g., network issues)
      console.error("Error fetching data:", error);
    }
  };

  const handleServiceLocationChange = (value) => {
    if (value !== undefined) {
      details.form1.resetFields(["WardCategory", "Ward", "Bed"]);
      setServiceLocationId(value);
      //setWardComponentsDisabled(false);
    } else {
      setServiceLocationId(null);
      details.form1.resetFields(["WardCategory", "Ward", "Bed"]);
      setWards([]);
      setBeds([]);
      //setponentsDisaWardCombled(true);
    }
  };

  const handleWardCategoryChange = async (value) => {
    debugger;
    try {
      if (value !== undefined) {
        details.form1.resetFields(["Ward", "Bed"]);
        setWardsLoader(true);
        const response = await customAxios.get(
          `${urlGetWardsBasedOnWardCategory}?WardCategory=${value}&ServiceLocationId=${serviceLocationId}`
        );

        if (response.status === 200) {
          setWardsLoader(false);
          const wardsOptions = response.data.data.Wards;
          setWards(wardsOptions);
          setBeds([]);
        } else {
          // Handle other response statuses if needed
        }
      } else {
        details.form1.resetFields(["Ward", "Bed"]);
        setWards([]);
        setBeds([]);
      }
    } catch (error) {
      // Handle errors (e.g., network issues)
      console.error("Error fetching data:", error);
    }
  };

  const handleWardChange = async (value) => {
    debugger;
    try {
      if (value !== undefined) {
        details.form1.resetFields(["Bed"]);
        setBedsLoader(true);
        const response = await customAxios.get(
          `${urlGetBedsForWard}?id=${value}`
        );
        if (response.status === 200) {
          setBedsLoader(false);
          const bedsOptions = response.data.data.Beds;
          setBeds(bedsOptions);
        } else {
          // Handle other response statuses if needed
        }
      } else {
        details.form1.resetFields(["Bed"]);
        setBeds([]);
      }
    } catch (error) {
      // Handle errors (e.g., network issues)
      console.error("Error fetching data:", error);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          zIndexPopupBase: 3000,
        },
      }}
    >
      {/* {contextHolder} */}
      <Modal
        width={1000}
        title="Create Visit"
        open={details.open}
        onOk={details.handleOk}
        // okButtonProps={{ disabled: IsVisitCreated }}
        //confirmLoading={ModalLoader}
        confirmLoading={details.ModalLoader}
        onCancel={details.close}
        okText="Submit"
        maskClosable={false}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={details.submitLoader}
            onClick={details.handleOk}
            disabled={details.IsVisitCreated}
          >
            Submit
          </Button>,
          <Button key="back" onClick={details.close}>
            Cancel
          </Button>,
        ]}
      >
        <PatientHeader
          patient={details.patientHeaderDetails}
          encounterId={details.encounterId}
        ></PatientHeader>
        <Space size={"large"}> {""}</Space>
        <div>
          <Form
            form={details.form1}
            disabled={details.IsVisitCreated}
            // initialValues={{ EncounterType: encounterTypeId }}
            layout="vertical"
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={12}>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col span={12}>
                    <Form.Item
                      name="PatientType"
                      label="Patient Type"
                      rules={[
                        {
                          required: true,
                          message: "Please select Patient Type",
                        },
                      ]}
                    >
                      <Select
                        onChange={handlePatientTypeChange}
                        disabled={details.isCancelOrEditVisit}
                        allowClear
                      >
                        {Dropdown.PatientType.map((option) => (
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
                  <Col span={12}>
                    <Form.Item name="EncounterType" label="Encounter Type">
                      <Select allowClear>
                        {Dropdown.EncounterType.map((option) => (
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
                  <Col span={12}>
                    <Form.Item
                      name="Department"
                      label="Department"
                      rules={[
                        {
                          required: true,
                          message: "Please select Department",
                        },
                      ]}
                    >
                      {details.isCancelOrEditVisit ? (
                        <Select
                          disabled={details.isCancelOrEditVisit}
                          allowClear
                        >
                          {Dropdown.Departments.map((option) => (
                            <Select.Option
                              key={option.DepartmentId}
                              value={option.DepartmentId}
                            >
                              {option.DepartmentName}
                            </Select.Option>
                          ))}
                        </Select>
                      ) : (
                        <Select
                          onChange={handleDepartmentChange}
                          loading={departmentLoader}
                          allowClear
                        >
                          {departments.map((option) => (
                            <Select.Option
                              key={option.DepartmentId}
                              value={option.DepartmentId}
                            >
                              {option.DepartmentName}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="EncounterReason" label="Encounter Reason">
                      <Select allowClear>
                        {Dropdown.EncounterReason.map((option) => (
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
                  <Col span={12}>
                    <Form.Item
                      name="Provider"
                      label="Provider"
                      rules={[
                        { required: true, message: "Please select Provider" },
                      ]}
                    >
                      {details.isCancelOrEditVisit ? (
                        <Select
                          disabled={details.isCancelOrEditVisit}
                          allowClear
                        >
                          {Dropdown.Providers.map((option) => (
                            <Select.Option
                              key={option.ProviderId}
                              value={option.ProviderId}
                            >
                              {option.ProviderName}
                            </Select.Option>
                          ))}
                        </Select>
                      ) : (
                        <Select allowClear loading={providerLoader}>
                          {providers.map((option) => (
                            <Select.Option
                              key={option.ProviderId}
                              value={option.ProviderId}
                            >
                              {option.ProviderName}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="referredBy" label="Referred By">
                      <Select allowClear>
                        {Dropdown.ReferredBy.map((option) => (
                          <Select.Option
                            key={option.ReferrerId}
                            value={option.ReferrerId}
                          >
                            {option.ReferrerType}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="ServiceLocation"
                      label="Service Location"
                      rules={[
                        {
                          required: true,
                          message: "Please select Service Location",
                        },
                      ]}
                    >
                      {details.isCancelOrEditVisit ? (
                        <Select
                          disabled={details.isCancelOrEditVisit}
                          allowClear
                        >
                          {Dropdown.ServiceLocations.map((option) => (
                            <Select.Option
                              key={option.FacilityDepartmentServiceLocationId}
                              value={option.FacilityDepartmentServiceLocationId}
                            >
                              {option.ServiceLocationName}
                            </Select.Option>
                          ))}
                        </Select>
                      ) : (
                        <Select
                          allowClear
                          onChange={handleServiceLocationChange}
                          loading={providerLoader}
                        >
                          {serviceLocations.map((option) => (
                            <Select.Option
                              key={option.FacilityDepartmentServiceLocationId}
                              value={option.FacilityDepartmentServiceLocationId}
                            >
                              {option.ServiceLocationName}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  {showWard && (
                    <Col span={12}>
                      <Form.Item name="admittedUnder" label="Admitted Under">
                        <Select
                          loading={providerLoader}
                          allowClear
                          showSearch // Enable search functionality
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          filterSort={(optionA, optionB) =>
                            optionA.children
                              .toLowerCase()
                              .localeCompare(optionB.children.toLowerCase())
                          } // Custom filtering logic
                        >
                          {providers.map((option) => (
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
                  )}

                  {showWard && (
                    <>
                      <Col span={12}>
                        <Form.Item
                          name="WardCategory"
                          label="Ward Category"
                          rules={[
                            {
                              required: true,
                              message: "Please select ward category ",
                            },
                          ]}
                        >
                          <Select
                            allowClear
                            disabled={details.isCancelOrEditVisit}
                            onChange={handleWardCategoryChange}
                          >
                            {Dropdown.WardCategory.map((option) => (
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
                      <Col span={12}>
                        <Form.Item
                          name="Ward"
                          label="Ward"
                          rules={[
                            {
                              required: true,
                              message: "Please select ward ",
                            },
                          ]}
                        >
                          {details.isCancelOrEditVisit ? (
                            <Select
                              allowClear
                              disabled={details.isCancelOrEditVisit}
                            >
                              {Dropdown.Wards.map((option) => (
                                <Select.Option
                                  key={option.WardID}
                                  value={option.WardID}
                                >
                                  {option.WardName}
                                </Select.Option>
                              ))}
                            </Select>
                          ) : (
                            <Select
                              allowClear
                              loading={wardsLoader}
                              onChange={handleWardChange}
                            >
                              {wards.map((option) => (
                                <Select.Option
                                  key={option.WardID}
                                  value={option.WardID}
                                >
                                  {option.WardName}
                                </Select.Option>
                              ))}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="Bed" label="Bed">
                          {details.isCancelOrEditVisit ? (
                            <Select
                              allowClear
                              disabled={details.isCancelOrEditVisit}
                            >
                              {Dropdown.Beds.map((option) => (
                                <Select.Option
                                  key={option.BedID}
                                  value={option.BedID}
                                >
                                  {option.BedNo}
                                </Select.Option>
                              ))}
                            </Select>
                          ) : (
                            <Select
                              allowClear
                              // disabled={wardComponentsDisabled}
                              loading={BedsLoader}
                            >
                              {beds.map((option) => (
                                <Select.Option
                                  key={option.BedID}
                                  value={option.BedID}
                                >
                                  {option.BedNo}
                                </Select.Option>
                              ))}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                    </>
                  )}
                </Row>
              </Col>

              <Col span={12}>
                <Card
                  title="Next of Kin Details"
                  bordered={true}
                  style={{ marginBottom: "24px" }}
                  //   className="capture"
                >
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={12}>
                      <Form.Item name="KinTitle" label="Title">
                        <Select allowClear>
                          {Dropdown.KinTitle.map((option) => (
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
                    <Col span={12}>
                      <Form.Item name="KinName" label="Next of Kin Name">
                        <Input allowClear />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="KinAddress" label="Next of Kin Address">
                        <Input allowClear />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="KinContactNo"
                        label="Next of Kin Contact No"
                        rules={[
                          {
                            pattern: new RegExp(/^\d{10}$/),
                            message: "Invalid Contact Number",
                          },
                        ]}
                      >
                        <Input allowClear maxLength={10} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>

              {details.isCancelOrEditVisit && (
                <>
                  <Col span={12}>
                    {details.isCancelEncounter ? (
                      <Form.Item
                        name="CancelEdit"
                        label="Cancel Reason"
                        rules={[
                          {
                            required: true,
                            message: "Please select Reason ",
                          },
                        ]}
                      >
                        <Select allowClear>
                          {Dropdown.EncounterCancelReason.map((option) => (
                            <Select.Option
                              key={option.LookupID}
                              value={option.LookupID}
                            >
                              {option.LookupDescription}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    ) : (
                      <Form.Item
                        name="EditReason"
                        label="Edit Reason"
                        rules={[
                          {
                            required: true,
                            message: "Please select Reason",
                          },
                        ]}
                      >
                        <Select allowClear>
                          {Dropdown.EncounterEditReason.map((option) => (
                            <Select.Option
                              key={option.LookupID}
                              value={option.LookupID}
                            >
                              {option.LookupDescription}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    )}
                  </Col>
                </>
              )}
            </Row>
          </Form>
        </div>
      </Modal>
    </ConfigProvider>
    // <div>visitModal</div>
  );
};

VisitModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleOk: PropTypes.func.isRequired,
  ModalLoader: PropTypes.bool,
  close: PropTypes.func.isRequired,
  IsVisitCreated: PropTypes.bool,
  patientHeaderDetails: PropTypes.object.isRequired,
  encounterId: PropTypes.string,
  form1: PropTypes.object.isRequired,
  dropdown: PropTypes.object.isRequired,
  showWard: PropTypes.bool,
  isCancelOrEditVisit: PropTypes.bool.isRequired,
  isCancelEncounter: PropTypes.bool.isRequired,
  //   isCancel: PropTypes.bool.isRequired,
};

export default VisitModal;
