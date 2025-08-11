import {
  Badge,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Layout,
  message,
  Popconfirm,
  Row,
  Select,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import PageHeader from "../../../components/PageHeader";
import PatientHeader from "../../../components/PatientHeader";
import { useForm } from "antd/es/form/Form";

import { FaAnglesLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

import {
  urlGetCreateProcedure,
  urlGetPatientHeaderDetails,
  urlGetProcedureName,
  urlGetServiceChargeforProcedure,
  urlSaveNewProcedureCharges,
} from "../../../../endpoints";

import customAxios from "../../../components/customAxios/customAxios";
import { useLocation } from "react-router-dom";
import { ColWithSixSpan } from "../../../components/customGridColumns";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { use } from "react";

function CreateProcedure() {
  const [form] = Form.useForm();
  const location = useLocation();
  const [patientData, setPatientData] = useState(null);
  const PatientId = location.state.patientId;
  const EncounterId = location.state.encounterId;
  const [anesthesiaType, setAnesthesiaType] = useState(null);
  const [chargeType, setChargeType] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [procedures, setProcedures] = useState(null);
  const [providers, setProviders] = useState(null);
  const [existingprocedures, setExistingProcedures] = useState(null);
  const [additionalChargesSurgery, setAdditionalChargesSurgery] = useState([]);
  const [providerId, setProviderId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDataHeader();
  }, []);

  const fetchDataHeader = async () => {
    try {
      const response = await customAxios.get(
        `${urlGetPatientHeaderDetails}?PatientId=${PatientId}&EncounterId=${EncounterId}`
      );
      if (response.status === 200 && response.data != null) {
        const detailsheader = response.data.data.EncounterModel;
        setPatientData(detailsheader);
      } else {
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchdata();
  }, []);

  const fetchdata = async () => {
    try {
      const response = await customAxios.get(
        `${urlGetCreateProcedure}?Patient=${PatientId}&EncounterId=${EncounterId}`
      );
      if (response.status === 200 && response.data != null) {
        const AnesthesiaType = response.data.data.AnesthesiaType;
        setAnesthesiaType(AnesthesiaType);
        const chargeType = response.data.data.AnesthesiaChargeType;
        setChargeType(chargeType);
        setProviderId(response.data.data.ProviderId);
      } else {
      }
    } catch (error) {}
  };

  const [anesthesiaTypeId, setAnesthesiaTypeId] = useState(null);
  const [chargeTypeId, setChargeTypeId] = useState(null);

  useEffect(() => {
    const fetchProcedureName = async () => {
      if (anesthesiaTypeId && chargeTypeId && PatientId && EncounterId) {
        setReceiptInsAmtData([]);
        form.setFields([]);
        try {
          const response = await customAxios.get(
            `${urlGetProcedureName}?AnesthesiaTypeId=${anesthesiaTypeId}&AnesthesiaChargeTypeId=${chargeTypeId}&Patient=${PatientId}&EncounterId=${EncounterId}`
          );

          if (response.status === 200 && response.data) {
            setProcedures(response.data.data.Services);
            setProviders(response.data.data.Provider);
            setExistingProcedures(response.data.data.ProcedureCharges);
            setAdditionalChargesSurgery(
              response.data.data.AdditionalChargesSurgery
            );
            setGroupId(response.data.data.ServiceGroupId ?? 1045);
            if (response.data.data.ProcedureCharges?.length > 0) {
              const procedureCharges = response.data.data.ProcedureCharges;
              const formattedCharges = procedureCharges.map((item, index) => ({
                key: index + 1,
                IsChargeable: item.IsChargeable ?? false,
                ServiceId: item.ProcedureId ?? "",
                Rate: item.Rate ?? 0,
                ChargeAmount: item.ChargeAmount ?? 0,
                ProviderId: providerId ?? 0,
                Priority: item.Priority ?? 0,
                DiscP: item.DiscountRate ?? 0,
                DiscAmount: item.Discount ?? 0,
                ServiceTax: item.ServiceTax ?? false,
                NetAmount: item.NetAmount ?? 0,
                TaxAmount: item.TaxAmount ?? 0,
                ServiceClassificationID: item.ServiceClassificationID ?? 0,
              }));

              setReceiptInsAmtData(formattedCharges);
              form.resetFields();
              const fieldsToSet = [];

              formattedCharges.forEach((item, index) => {
                fieldsToSet.push(
                  { name: ["IsChargeable", index], value: item.IsChargeable },
                  { name: ["ServiceId", index], value: item.ServiceId },
                  { name: ["Rate", index], value: item.Rate },
                  { name: ["ChargeAmount", index], value: item.ChargeAmount },
                  { name: ["ProviderId", index], value: item.ProviderId },
                  { name: ["Priority", index], value: item.Priority },
                  { name: ["DiscP", index], value: item.DiscP },
                  { name: ["DiscAmount", index], value: item.DiscAmount },
                  { name: ["ServiceTax", index], value: item.ServiceTax },
                  { name: ["NetAmount", index], value: item.NetAmount }
                );
              });

              form.setFields(fieldsToSet);
              setTimeout(() => {
                form.validateFields();
              }, 0);
              const newSurgeryData =
                response.data.data.ProcedureCharges[0].ProcedureChargesDetails.map(
                  (item) => {
                    const found =
                      response.data.data.AdditionalChargesSurgery.find(
                        (i) =>
                          i.ChargeEntryCatalogId === item.AssociativeServiceId
                      );

                    return {
                      ...item,
                      SurgeryRuleId: item.AssociativeServiceId,
                      ...(found || {}),
                    };
                  }
                );

              setAdditionalChargesSurgery(newSurgeryData);
            } else {
              setReceiptInsAmtData(initialDataSource);
              form.resetFields();
            }
          }
        } catch (error) {
          console.error("Error fetching procedure name", error);
        }
      }
    };

    fetchProcedureName();
  }, [anesthesiaTypeId, chargeTypeId, PatientId, EncounterId]);

  const initialDataSource = [
    {
      key: 1,
      IsChargeable: true,
      ServiceId: "",
      Rate: 0,
      ChargeAmount: 0,
      ProviderId: "",
      Priority: 1,
      DiscP: 0,
      DiscAmount: 0,
      ServiceTax: true,
      NetAmount: 0,
      ServiceClassificationID: 0,
      TaxAmount: 0,
    },
  ];
  const [receiptInsAmtData, setReceiptInsAmtData] = useState(initialDataSource);

  const handleInputChange = (value, column, key) => {
    const newData = receiptInsAmtData.map((item) => {
      if (item.key === key) {
        let newValue = value;

        // If DiscP is being updated, enforce max 100
        if (column === "DiscP") {
          let discP = parseFloat(value) || 0;

          if (discP > 100) {
            discP = 100;
            newValue = 100; // Force the value to 100
          }

          const rate = parseFloat(item.Rate) || 0;
          const chargeAmount = parseFloat(item.ChargeAmount) || 0;
          const discAmount = (rate * discP) / 100;
          const netAmount = chargeAmount - discAmount;

          return {
            ...item,
            [column]: discP,
            DiscAmount: discAmount,
            NetAmount: netAmount,
          };
        }

        return {
          ...item,
          [column]: newValue,
        };
      }

      return item;
    });

    setReceiptInsAmtData(newData);

    // Optionally update form values to reflect DiscAmount and NetAmount
    const updatedItem = newData.find((item) => item.key === key);
    if (updatedItem) {
      form.setFieldsValue({
        [`DiscAmount`]: {
          [key - 1]: updatedItem.DiscAmount,
        },
        [`NetAmount`]: {
          [key - 1]: updatedItem.NetAmount,
        },
        [`DiscP`]: {
          [key - 1]: updatedItem.DiscP,
        },
      });
    }
  };

  const fetchProcedureDetails = async (serviceId, recordKey) => {
    try {
      const response = await customAxios.get(
        `${urlGetServiceChargeforProcedure}?anesthesiaTypeId=${anesthesiaTypeId}&anesthesiaChargeTypeId=${chargeTypeId}&serviceId=${serviceId}`
      );

      if (response.status === 200 && response.data) {
        const priceDef = response.data.data.ServicePriceDefinition;

        const price = priceDef?.Price || 0;
        const serviceClassId = priceDef?.ServiceClassificationId || "";

        setReceiptInsAmtData((prevData) =>
          prevData.map((item) =>
            item.key === recordKey
              ? {
                  ...item,
                  Rate: price,
                  ChargeAmount: price,
                  NetAmount: price,
                  ServiceClassificationID: serviceClassId,
                  DiscP: 0,
                  DiscAmount: 0,
                }
              : item
          )
        );

        const newSurgeryData = additionalChargesSurgery.map(
          (item, index, arr) => {
            if (index === 0) {
              form.setFieldsValue({
                ChargeAmount: {
                  [item.SurgeryRuleId]: (price * item.ChargeValue) / 100,
                },
                NetAmount: {
                  [item.SurgeryRuleId]: (price * item.ChargeValue) / 100,
                },
                DiscountRate: {
                  [item.SurgeryRuleId]: 0,
                },
                DiscountAmount: {
                  [item.SurgeryRuleId]: 0,
                },
              });
              return {
                ...item,
                ChargeAmount: (price * item.ChargeValue) / 100,
                NetAmount: (price * item.ChargeValue) / 100,
                DiscountRate: 0,
                DiscountAmount: 0,
                ProviderId: providerId,
                IsChargeable: true,
                ServiceQty: 1,
                AssociativeServiceId: item.ChargeEntryCatalogId,
                ServiceGroupId: groupId,
              };
            } else {
              const prevItem = arr[index - 1];
              const prevChargeAmount = (price * prevItem.ChargeValue) / 100;
              form.setFieldsValue({
                ChargeAmount: {
                  [item.SurgeryRuleId]:
                    (prevChargeAmount * item.ChargeValue) / 100,
                },
                NetAmount: {
                  [item.SurgeryRuleId]:
                    (prevChargeAmount * item.ChargeValue) / 100,
                },
                DiscountRate: {
                  [item.SurgeryRuleId]: 0,
                },
                DiscountAmount: {
                  [item.SurgeryRuleId]: 0,
                },
              });
              return {
                ...item,
                ChargeAmount: (prevChargeAmount * item.ChargeValue) / 100,
                NetAmount: (prevChargeAmount * item.ChargeValue) / 100,
                DiscountRate: 0,
                DiscountAmount: 0,
                ProviderId: providerId,
                IsChargeable: true,
                ServiceQty: 1,
                AssociativeServiceId: item.ChargeEntryCatalogId,
                ServiceGroupId: groupId,
              };
            }
          }
        );

        setAdditionalChargesSurgery(newSurgeryData);

        form.setFieldsValue({
          [`Rate`]: { [recordKey - 1]: price },
          [`ChargeAmount`]: { [recordKey - 1]: price },
          [`NetAmount`]: { [recordKey - 1]: price },
          [`ServiceClassificationID`]: { [recordKey - 1]: serviceClassId },
          // 👇 Clear discount-related form fields too
          [`DiscP`]: { [recordKey - 1]: 0 },
          [`DiscAmount`]: { [recordKey - 1]: 0 },
        });
        // You can update form state or fields here if needed
      }
    } catch (error) {
      console.error("Failed to fetch procedure details", error);
    }
  };

  const receiptInscolumns = [
    {
      title: "Chargeable",
      dataIndex: "IsChargeable",
      key: "IsChargeable",
      width: 40,
      render: (text, record) => (
        <Form.Item
          name={["IsChargeable", record.key - 1]}
          valuePropName="checked"
          initialValue={true}
        >
          <Checkbox
          // onChange={(e) =>
          //   handleInputChange(e.target.checked, "IsChargeable", record.key)
          // }
          ></Checkbox>
        </Form.Item>
      ),
    },
    {
      title: "ProcedureName",
      dataIndex: "ServiceId",
      width: 500,
      key: "ServiceId",
      render: (text, record, index) => (
        <Form.Item
          name={["ServiceId", record.key - 1]}
          rules={[{ required: true, message: "Required" }]}
        >
          <Select
            onChange={(value) => {
              handleInputChange(value, "ServiceId", record.key);
              fetchProcedureDetails(value, record.key);
            }}
          >
            {procedures?.map((option) => (
              <Option key={option.ServiceId} value={option.ServiceId}>
                {option.LongName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "Rate",
      dataIndex: "Rate",
      width: 150,
      key: "Rate",
      render: (text, record) => (
        <Form.Item
          name={["Rate", record.key - 1]}
          style={{ width: "100%" }}
          rules={[{ required: true, message: "Required" }]}
        >
          <InputNumber
            disabled
            style={{ width: "100%" }}
            min={0}
            onChange={(value) => handleInputChange(value, "Rate", record.key)}
          />
        </Form.Item>
      ),
    },
    {
      title: "ChargeAmount",
      dataIndex: "ChargeAmount",
      width: 100,
      key: "ChargeAmount",
      render: (text, record) => (
        <Form.Item
          name={["ChargeAmount", record.key - 1]}
          style={{ width: "100%" }}
          rules={[{ required: true, message: "Required" }]}
        >
          <InputNumber
            disabled
            style={{ width: "100%" }}
            min={0}
            onChange={(value) =>
              handleInputChange(value, "ChargeAmount", record.key)
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Provider",
      dataIndex: "ProviderId",
      width: 350,
      key: "ProviderId",
      render: (text, record, index) => (
        <Form.Item
          name={["ProviderId", record.key - 1]}
          rules={[
            {
              required: true,
              message: "Provider is required.",
            },
          ]}
          initialValue={providerId}
        >
          <Select
            onChange={(value) =>
              handleInputChange(value, "ProviderId", record.key)
            }
          >
            {providers?.map((option) => (
              <Option key={option.ProviderId} value={option.ProviderId}>
                {`${option.ProviderFirstName} ${option.ProviderLastName}`}
              </Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "Priority",
      dataIndex: "Priority",
      key: "Priority",
      render: (text, record, index) => (
        <Form.Item
          name={["Priority", record.key - 1]}
          style={{ width: "100%" }}
          // initialValue={record.Branch}
        >
          <Input
            // disabled
            min={0}
            defaultValue={text}
            onChange={(e) =>
              handleInputChange(e.target.value, "Priority", record.key)
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "DiscP",
      dataIndex: "DiscP",
      key: "DiscP",
      render: (text, record, index) => (
        <Form.Item
          name={["DiscP", record.key - 1]}
          style={{ width: "100%" }}
          //initialValue={record.IfscCode}
        >
          <Input
            min={0}
            defaultValue={text}
            onChange={(e) =>
              handleInputChange(e.target.value, "DiscP", record.key)
            }
            // disabled
          />
        </Form.Item>
      ),
    },
    {
      title: "DiscAmount",
      dataIndex: "DiscAmount",
      key: "DiscAmount",
      render: (text, record, index) => (
        <Form.Item
          name={["DiscAmount", record.key - 1]}
          style={{ width: "100%" }}
          //initialValue={record.AuthRefNo}
        >
          <Input
            disabled
            min={0}
            defaultValue={text}
            onChange={(e) =>
              handleInputChange(e.target.value, "DiscAmount", record.key)
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "ServiceTax?",
      dataIndex: "ServiceTax",
      key: "ServiceTax",
      width: 40,
      render: (text, record) => (
        <Form.Item
          name={["ServiceTax", record.key - 1]}
          valuePropName="checked"
          initialValue={true}
        >
          <Checkbox
            onChange={(e) =>
              handleInputChange(e.target.checked, "ServiceTax", record.key)
            }
          ></Checkbox>
        </Form.Item>
      ),
    },
    {
      title: "NetAmount",
      dataIndex: "NetAmount",
      key: "NetAmount",
      render: (text, record, index) => (
        <Form.Item
          name={["NetAmount", record.key - 1]}
          style={{ width: "100%" }}
          //initialValue={record.AuthRefNo}
        >
          <Input
            // disabled
            min={0}
            defaultValue={text}
            onChange={(e) =>
              handleInputChange(e.target.value, "NetAmount", record.key)
            }
          />
        </Form.Item>
      ),
    },
    {
      dataIndex: "add",
      key: "add",
      width: 50,
      render: (text, record) => (
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => handleInstrumentDelete(record)}
        >
          <DeleteOutlined />
        </Popconfirm>
      ),
      //<Button type="primary" icon={<DeleteOutlined />} onClick={() => handleDelete(record)}></Button>
    },
  ];

  const handleFinish = async (values) => {
    debugger;
    try {
      let saved = false;

      for (const item of receiptInsAmtData) {
        const charamt = parseFloat(item.ChargeAmount) || 0;
        const discamt = parseFloat(item.DiscAmount) || 0;
        const temp = true;

        if (charamt >= discamt && temp === true) {
          const object = {
            FacilityId: 1,
            PatientId: PatientId,
            EncounterId: EncounterId,
            AnesthesiaTypeId: anesthesiaTypeId,
            AnesthesiaTypeChargeId: chargeTypeId,
            IsChargeable: item.IsChargeable,
            ProcedureId: item.ServiceId,
            Rate: item.Rate,
            ChargeAmount: item.ChargeAmount,
            ProviderId: providerId,
            Priority: item.Priority,
            Discount: item.DiscAmount,
            DiscountRate: item.DiscP,
            ServiceTax: item.ServiceTax || false,
            TaxAmount: item.TaxAmount || 0,
            NetAmount: item.NetAmount,
            ServiceGroupId: groupId,
            ServiceclassificationId: item.ServiceClassificationID,
          };

          const procedurelist = additionalChargesSurgery;

          const payload = {
            AddNewProcedureCharges: object,
            ProcedureChargesDetails: procedurelist,
          };

          const response = await customAxios.post(
            urlSaveNewProcedureCharges,
            payload,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.status === 200) {
            //alert("Procedure saved successfully!");
            message.success("Procedure saved successfully");
            saved = true;
          }

          break; // ✅ exit after saving one, since API only supports single object
        }
      }

      if (!saved) {
        alert("No valid procedures to save.");
      }
    } catch (error) {
      console.error("Save failed:", error);
      alert("Something went wrong while saving.");
    }
  };

  const expandDataSource = (additionalChargesSurgery || []).map((i) => {
    return {
      ...i,
    };
  });

  function DiscountRateChange(value, column, record) {
    const discPer = parseFloat(value) || 0;
    const chargeAmount = parseFloat(record.ChargeAmount) || 0;
    const discountAmt = (chargeAmount * discPer) / 100;
    const netAmount = chargeAmount - discountAmt;

    const newSurgeryData = additionalChargesSurgery.map((item) => {
      if (item.SurgeryRuleId === record.SurgeryRuleId) {
        return {
          ...item,
          NetAmount: netAmount,
          DiscountRate: value,
          DiscountAmount: discountAmt,
        };
      }
      return item;
    });

    setAdditionalChargesSurgery(newSurgeryData);

    form.setFieldsValue({
      DiscountAmount: {
        [record.SurgeryRuleId]: discountAmt,
      },
      NetAmount: {
        [record.SurgeryRuleId]: netAmount,
      },
    });
    //   return {
    //     ...item,
    //     DiscountRate: discPer,
    //     DiscountAmount: discountAmt,
    //     NetAmount: netAmount,
    //   };
    // }
  }

  const expandColumns = [
    { title: "Associated Services", dataIndex: "ChargeEntryCatalogName" },
    {
      title: "Provider",
      dataIndex: "ProviderId",
      width: 200,
      render: (text, record, index) => (
        <>
          <Form.Item
            name={["ProviderId", record.SurgeryRuleId]}
            rules={[
              {
                required: true,
                message: "Provider is required.",
              },
            ]}
            initialValue={providerId}
          >
            <Select>
              {providers?.map((option) => (
                <Option key={option.ProviderId} value={option.ProviderId}>
                  {`${option.ProviderFirstName} ${option.ProviderLastName}`}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name={["IsChargeable", record.SurgeryRuleId]}
            initialValue={true}
            hidden
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            name={["AssociativeServiceId", record.SurgeryRuleId]}
            initialValue={record.ChargeEntryCatalogId}
            hidden
          >
            <input />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Qty",
      dataIndex: "ServiceQty",
      render: (text, record) => (
        <Form.Item
          name={["ServiceQty", record.SurgeryRuleId]}
          style={{ width: "100%" }}
          initialValue={1}
        >
          <InputNumber disabled style={{ width: "100%" }} min={0} />
        </Form.Item>
      ),
    },
    {
      title: "Charge Amount",
      dataIndex: "ChargeAmount",
      render: (text, record) => (
        <Form.Item
          name={["ChargeAmount", record.SurgeryRuleId]}
          style={{ width: "100%" }}
          rules={[{ required: true, message: "Required" }]}
          initialValue={record.ChargeAmount}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            // onChange={(value) => handleInputChange(value, "Rate", record.key)}
          />
        </Form.Item>
      ),
    },
    {
      title: "Disc(%)",
      dataIndex: "DiscountRate",
      render: (text, record) => (
        <Form.Item
          name={["DiscountRate", record.SurgeryRuleId]}
          style={{ width: "100%" }}
          rules={[{ required: true, message: "Required" }]}
          initialValue={record.DiscountRate}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            max={100}
            onChange={(value) =>
              DiscountRateChange(value, "DiscountRate", record)
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Discount",
      dataIndex: "DiscountAmount",
      render: (text, record) => (
        <Form.Item
          name={["DiscountAmount", record.SurgeryRuleId]}
          style={{ width: "100%" }}
          rules={[{ required: true, message: "Required" }]}
          initialValue={record.DiscountAmount}
        >
          <InputNumber disabled style={{ width: "100%" }} min={0} />
        </Form.Item>
      ),
    },
    {
      title: "Net Amount",
      dataIndex: "NetAmount",
      render: (text, record) => (
        <Form.Item
          name={["NetAmount", record.SurgeryRuleId]}
          style={{ width: "100%" }}
          rules={[{ required: true, message: "Required" }]}
          initialValue={record.NetAmount}
        >
          <InputNumber
            value={record.NetAmount}
            style={{ width: "100%" }}
            min={0}
          />
        </Form.Item>
      ),
    },
  ];

  const expandedRowRender = () => (
    <Table
      columns={expandColumns}
      dataSource={expandDataSource}
      pagination={false}
    />
  );

  return (
    <Layout
      style={{
        width: "100%",
        backgroundColor: "white",
        minHeight: "max-content",
        borderRadius: "10px",
      }}
    >
      <PageHeader
        title={"Procedure Charges"}
        buttonIcon={<FaAnglesLeft style={{ fontSize: "1rem" }} />}
        buttonLabel={"Back"}
        onButtonClick={() => navigate("/ProcedureCharges")}
      />
      <div style={{ margin: "0 1rem 1rem 1rem" }}>
        <PatientHeader patient={patientData} style={{ marginBottom: "1rem" }} />
      </div>
      <div style={{ margin: "1rem" }}>
        {/* These selects are now outside the Form */}
        <Row gutter={16} style={{ marginBottom: "1rem" }}>
          <ColWithSixSpan>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ marginBottom: "8px" }}>AnesthesiaType</label>
              <Select
                showSearch
                placeholder="Select the AnesthesiaType"
                style={{ width: "100%" }}
                onChange={(value) => setAnesthesiaTypeId(value)}
                value={anesthesiaTypeId}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
              >
                {anesthesiaType?.map((response) => (
                  <Select.Option
                    key={response.LookupID}
                    value={response.LookupID}
                  >
                    {response.LookupDescription}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ marginBottom: "8px" }}>ChargeType</label>
              <Select
                showSearch
                placeholder="Select the ChargeType"
                style={{ width: "100%" }}
                onChange={(value) => setChargeTypeId(value)}
                value={chargeTypeId}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
              >
                {chargeType?.map((response) => (
                  <Select.Option
                    key={response.LookupID}
                    value={response.LookupID}
                  >
                    {response.LookupDescription}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </ColWithSixSpan>
        </Row>

        {/* The Form now only contains the table and action buttons */}
        <Form
          form={form}
          layout="vertical"
          size="small"
          onFinish={handleFinish}
        >
          {/* <Table
            dataSource={receiptInsAmtData}
            columns={receiptInscolumns}
            rowClassName={(record) => (record.disabled ? "disabled-row" : "")}
            size="small"
            bordered
            pagination={false}
            style={{ marginBottom: 24 }}
          /> */}
          <Table
            columns={receiptInscolumns}
            expandable={{
              expandedRowRender,
              rowExpandable: (record) => {
                return record.ServiceId != null && record.ServiceId !== "";
              },
            }}
            dataSource={receiptInsAmtData}
            pagination={false}
            size="small"
            bordered
          />
          <Row justify={"end"} gutter={16}>
            <Col>
              <Form.Item>
                <Button htmlType="submit" type="primary">
                  Save
                </Button>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button danger onClick={() => navigate("/ProcedureCharges")}>
                  Cancel
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Layout>
  );
}

export default CreateProcedure;
