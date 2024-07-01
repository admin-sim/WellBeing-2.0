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
} from "antd";
import Title from "antd/es/typography/Title";

import Input from "antd/es/input/Input";
import customAxios from "../../../../components/customAxios/customAxios";
import React, { useEffect, useState } from "react";
import {
  urlCreatePriceTariff,
  urlSaveNewPriceTariff,
  urlEditPriceTariffChargeParameter,
  urlGetDropDownsForPricetariif,
  urlSaveNewPriceTariffChargeParameter,
  urlEditPriceTariff,
  urlUpdatePriceTariff,
} from "../../../../../endpoints";
import PriceChargeModal from "./PriceChargeModal";
import EditPriceChargeModal from "./EditPriceChargeModal";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { Transfer } from "antd";
import CustomTable from "../../../../components/customTable";
import dayjs from "dayjs";

const { TextArea } = Input;

function CreatePriceTariff() {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [facilities, setFacilities] = useState([]);
  const location = useLocation();
  const EditedPricetariffId = location.state?.PriceTariffId;
  console.log("EditedPricetariffId", EditedPricetariffId);
  const navigate = useNavigate();
  const [effectiveFromDate, setEffectiveFromDate] = useState(null);
  const [effectiveToDate, setEffectiveToDate] = useState(null);
  const [effectiveFromDatemodal, setEffectiveFromDateModal] = useState(null);
  const [effectiveToDatemodal, setEffectiveToDateModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transferData, setTransferData] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [columnData, setColumnData] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [transferError, setTransferError] = useState(false);
  const [priceTariffId, setPriceTariffId] = useState(0);
  const [linedata, setLinedata] = useState(null);

  const [editedpriceTariffId, setEditedPriceTariffId] = useState(0);
  const [editedpriceTarifflineId, setEditedPriceTariffLineId] = useState(null);
  const [pricetariffDropdown, setPriceariffDropdown] = useState({
    PatientType: [],
    Nationality: [],
    Gender: [],
    Indicators: [],
    WardType: [],
    Provider: [],
    PatientTypeFlag: false,
    NationalityFlag: false,
    GenderFlag: false,
    WardTypeFlag: false,
    FamilyIncomeFlag: false,
    ProviderFlag: false,
  });
  const [editpricetariffDropdown, setEditPriceariffDropdown] = useState({
    PatientType: [],
    Nationality: [],
    Gender: [],
    Indicators: [],
    WardType: [],
    Provider: [],
    PatientTypeFlag: false,
    NationalityFlag: false,
    GenderFlag: false,
    WardTypeFlag: false,
    FamilyIncomeFlag: false,
    ProviderFlag: false,
  });

  const handleCancel = () => {
    navigate("/PriceTariff");
  };

  const handleEdit = async (record) => {
    try {
      const response = await customAxios.get(
        `${urlEditPriceTariffChargeParameter}?PriceTariffLine=${record.PriceTariffLineId}`
      );
      if (response.status === 200 && response.data.data != null) {
        const editpricechargeparameteres = response.data.data;
        setEditPriceariffDropdown(editpricechargeparameteres);
        setLinedata(editpricechargeparameteres.AddNewBillTariffLineModel);
        setEditedPriceTariffLineId(record.PriceTariffLineId);
        setEditModalOpen(true);
      } else {
        console.error("Failed to fetch patient details");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // const handleDelete = async (record) => {
  //   try {
  //     const response = await customAxios.get(
  //       `${urlEditPriceTariffChargeParameter}?PriceTariffLine=${record.PriceTariffLineId}`
  //     );
  //     if (response.status === 200 && response.data.data != null) {
  //       const editpricechargeparameteres = response.data.data;
  //       setEditPriceariffDropdown(editpricechargeparameteres);
  //       setLinedata(editpricechargeparameteres.AddNewBillTariffLineModel);
  //       setEditedPriceTariffLineId(record.PriceTariffLineId);
  //       setEditModalOpen(true);
  //     } else {
  //       console.error("Failed to fetch patient details");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };


  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    debugger;
    if (EditedPricetariffId) {
      // Check if EditedPricetariffId exists
      const fetchData1 = async () => {
        const Revision = 0;
        try {
          const response = await customAxios.get(
            `${urlEditPriceTariff}?PriceTariff=${EditedPricetariffId}&Revision=${Revision}`
          );
          if (response.status === 200 && response.data.data != null) {
            const editpricetariffdetail = response.data.data;
            form.setFieldsValue({
              ShortPriceDescription:
                editpricetariffdetail.AddNewBillTariff.LongPriceDescription,
              LongPriceDescription:
                editpricetariffdetail.AddNewBillTariff.LongPriceDescription,
              Remarks: editpricetariffdetail.AddNewBillTariff.Remarks,
              FacilityId: editpricetariffdetail.AddNewBillTariff.FacilityId,
              Status: editpricetariffdetail.AddNewBillTariff.Status,
              EffectiveFrom: editpricetariffdetail.AddNewBillTariff
                .EffectiveFromDate
                ? dayjs(
                    editpricetariffdetail.AddNewBillTariff.EffectiveFromDate,
                    "DD-MM-YYYY"
                  )
                : null,
              EffectiveTo: editpricetariffdetail.AddNewBillTariff
                .EffectiveToDate
                ? dayjs(
                    editpricetariffdetail.AddNewBillTariff.EffectiveToDate,
                    "DD-MM-YYYY"
                  )
                : null,
            });
            const filteredtransData =
              editpricetariffdetail.SelectedChargeParameters.map((item) => ({
                key: item.LookupID,
                title: item.LookupDescription,
                // Add more fields as needed
              }));
            // Set the pre-selected items in Transfer
            setTargetKeys(filteredtransData.map((item) => item.key));
            setColumnData(editpricetariffdetail.BillTariffLineModels);
          } else {
            console.error("Failed to fetch patient details");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData1(); // Call the fetchData function
    }
  }, []);

  const handleChange = (nextTargetKeys) => {
    if (nextTargetKeys.length > 0) {
      setTransferError(false); // Reset the error state
    }
    setTargetKeys(nextTargetKeys);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await customAxios.get(`${urlCreatePriceTariff}`);
      if (response.status == 200 && response.data.data != null) {
        setFacilities(response.data.data.Facilities);
        const transData = response.data.data.ChargeParameters.map((item) => ({
          key: item.LookupID, // Replace 'id' with the unique key in your data
          title: item.LookupDescription, // Replace 'name' with the field you want to display in the list
          // Add more fields as needed
        }));
        setTransferData(transData);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const onFinish = async (values) => {
    debugger;
    setLoading(true);

    values.EffectiveFromDate = values.EffectiveFrom
      ? values.EffectiveFrom.format("DD-MM-YYYY")
      : "";
    values.EffectiveToDate = values.EffectiveTo
      ? values.EffectiveTo.format("DD-MM-YYYY")
      : "";
    if (EditedPricetariffId > 0) {
      values.PriceTariffId = EditedPricetariffId;

      try {
        const response = await customAxios.post(urlUpdatePriceTariff, values, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status == 200 && response.data) {
          if (response.data > 0 && response.data != "") {
            message.success("PriceTariffUpdated Successfully");
            setLoading(false);
            navigate("/PriceTariff");
          } else {
            message.error("Something Went Wrong");
          }
        }
      } catch (error) {
        message.error("Something went wrong");
        console.error(error);
        setLoading(false);
      }
    } else {
      try {
        const response = await customAxios.post(urlSaveNewPriceTariff, values, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status == 200 && response.data) {
          if (response.data > 0 && response.data != null) {
            setPriceTariffId(response.data);
            message.success("PriceTariffCreated Successfully");
          } else {
            message.error("PriceTariff With Same Name Already Exists");
          }
        }
      } catch (error) {
        message.error("Something went wrong");
        console.error(error);
        setLoading(false);
      }
    }

    setLoading(false);
  };

  const showModal = async () => {
    if (targetKeys.length === 0) {
      setTransferError(true);
      //message.error('Please select at least one item before proceeding.');
      return; // Stop execution if targetKeys is empty
    }

    setTransferError(false); // Reset the error state

    try {
      if (targetKeys.length > 0) {
        // Check if targetKeys has elements
        // Create an array of MasterModel objects using targetKeys
        const masterModels = targetKeys.map((key) => ({
          LookupID: key, // Assuming LookupID should be assigned targetKey
          // You can assign other properties based on your requirement
        }));

        const response = await customAxios.post(
          urlGetDropDownsForPricetariif,
          masterModels,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200 && response.data.data != null) {
          if (response.data.data) {
            setPriceariffDropdown(response.data.data);
            setIsModalOpen(true);
            //message.success('PriceTariffCreated Successfully');
          } else {
            message.error("PriceTariff With Same Name Already Exists");
          }
        }
      } else {
        // Handle case when targetKeys is empty
        message.error("No keys selected");
      }
    } catch (error) {
      message.error("Something went wrong");
      console.error(error);
    }
  };

  const columns = [
    {
      title: "ChargeParameter",
      dataIndex: "PatientTypeName",
      key: "PatientTypeName",
    },
    {
      title: "Indicator",
      dataIndex: "IndicatorName",
      key: "IndicatorName",
    },
    {
      title: "Tariff Line Indicator",
      dataIndex: "TariffLineIndicator",
      key: "TariffLineIndicator",
    },
    {
      title: "Factor/Amount",
      dataIndex: "FactorAmount",
      key: "FactorAmount",
    },
    {
      title: "Value",
      dataIndex: "TariffLineValue",
      key: "TariffLineValue",
    },
    {
      title: "Effective From Date",
      dataIndex: "EffectiveFromDate",
      key: "EffectiveFromDate",
    },
    {
      title: "Effective To Date",
      dataIndex: "EffectiveToDate",
      key: "EffectiveToDate",
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
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
                  <Form.Item name="ShortPriceDescription" label="ShortName">
                    <Input style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item name="LongPriceDescription" label="LongName">
                    <Input style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item name="Remarks" label="Remarks">
                    <TextArea
                      placeholder="Remarks"
                      autoSize={{
                        minRows: 1,
                        maxRows: 3,
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item name="FacilityId" label="Facility">
                    <Select>
                      {facilities.map((option) => (
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
                <Col className="gutter-row" span={6}>
                  <Form.Item label="EffectiveFrom" name="EffectiveFrom">
                    <DatePicker
                      style={{ width: "100%" }}
                      // onChange={handleEfeectiveFrom}
                      format="DD-MM-YYYY"
                    />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Form.Item label="EffectiveTo" name="EffectiveTo">
                    <DatePicker
                      style={{ width: "100%" }}
                      // onChange={handleEfeectiveTo}
                      format="DD-MM-YYYY"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row justify="end">
                <Col>
                  <Form.Item
                    style={{
                      display:
                        priceTariffId === 0 &&
                        (EditedPricetariffId === 0 ||
                          EditedPricetariffId == null)
                          ? "inline-block"
                          : "none",
                    }}
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        display:
                          priceTariffId === 0 &&
                          (EditedPricetariffId === 0 ||
                            EditedPricetariffId == null)
                            ? "inline-block"
                            : "none",
                      }}
                    >
                      Save
                    </Button>
                  </Form.Item>
                  <Form.Item
                    style={{
                      display:
                        EditedPricetariffId > 0 ? "inline-block" : "none",
                    }}
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        display:
                          EditedPricetariffId > 0 ? "inline-block" : "none",
                      }}
                    >
                      Update
                    </Button>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item>
                    <Button type="default" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
              <div
                style={{
                  display:
                    priceTariffId > 0 || EditedPricetariffId > 0
                      ? "block"
                      : "none",
                }}
              >
                <div>
                  <Form.Item
                    label="Transfer"
                    validateStatus={transferError ? "error" : ""}
                    help={
                      transferError ? "Please select at least one item" : ""
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please select at least one item",
                      },
                    ]}
                  >
                    <Transfer
                      dataSource={transferData}
                      targetKeys={targetKeys}
                      onChange={handleChange}
                      render={(item) => item.title}
                      disabled={columnData?.length > 0}
                    />
                  </Form.Item>
                </div>
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
                      marginTop: "3rem",
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
                      ></Title>
                    </Col>
                    <Col offset={5} span={3}>
                      <Button
                        style={{ marginLeft: "8rem" }}
                        icon={<PlusCircleOutlined />}
                        onClick={showModal}
                      ></Button>
                    </Col>
                  </Row>
                </div>
                <div>
                  <Spin spinning={loading}>
                    <CustomTable
                      columns={columns}
                      dataSource={columnData}
                      actionColumn={true}
                      isFilter={true}
                      onEdit={handleEdit}
                      //onDelete={handleDelete}
                      rowKey={(row) => row.PriceTariffLineId}
                    />
                  </Spin>
                  <PriceChargeModal
                    options={pricetariffDropdown}
                    open={isModalOpen}
                    handleClose={() => setIsModalOpen(false)}
                    priceTariffId={priceTariffId}
                    setColumnData={setColumnData}
                  />
                  <EditPriceChargeModal
                    options={editpricetariffDropdown}
                    open={editModalOpen}
                    handleClose={() => setEditModalOpen(false)}
                    editedpriceTarifflineId={editedpriceTarifflineId}
                    setColumnData={setColumnData}
                    linedata={linedata}
                  />
                </div>
              </div>
            </Form>
          </Card>
        </div>
      </Layout>
    </>
  );
}

export default CreatePriceTariff;
