import {
  Button,
  Checkbox,
  Col,
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
import { useNavigate, useLocation } from "react-router-dom";
import {
  urlDeleteSelectedProcedureCharges,
  urlGetCreateProcedure,
  urlGetPatientHeaderDetails,
  urlGetProcedureName,
  urlGetServiceChargeforProcedure,
  urlSaveNewProcedureCharges,
} from "../../../../endpoints";
import customAxios from "../../../components/customAxios/customAxios";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

function CreateProcedure() {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();

  // Fix: Use optional chaining to avoid TypeError if location.state is null
  const PatientId = location.state?.patientId;
  const EncounterId = location.state?.encounterId;

  // Redirect if PatientId or EncounterId is missing
  useEffect(() => {
    if (!PatientId || !EncounterId) {
      message.error("Missing patient or encounter information.");
      navigate("/ProcedureCharges");
    }
    // eslint-disable-next-line
  }, [PatientId, EncounterId, navigate]);

  const [patientData, setPatientData] = useState(null);
  const [anesthesiaType, setAnesthesiaType] = useState(null);
  const [chargeType, setChargeType] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [procedures, setProcedures] = useState(null);
  const [providers, setProviders] = useState(null);
  const [existingprocedures, setExistingProcedures] = useState(null);
  const [hoveredRowKey, setHoveredRowKey] = useState(null);

  useEffect(() => {
    if (PatientId && EncounterId) fetchDataHeader();
    // eslint-disable-next-line
  }, [PatientId, EncounterId]);

  const fetchDataHeader = async () => {
    try {
      const response = await customAxios.get(
        `${urlGetPatientHeaderDetails}?PatientId=${PatientId}&EncounterId=${EncounterId}`
      );
      if (response.status === 200 && response.data != null) {
        const detailsheader = response.data.data.EncounterModel;
        setPatientData(detailsheader);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (PatientId && EncounterId) fetchdata();
    // eslint-disable-next-line
  }, [PatientId, EncounterId]);

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
      }
    } catch (error) {}
  };

  const [anesthesiaTypeId, setAnesthesiaTypeId] = useState(null);
  const [chargeTypeId, setChargeTypeId] = useState(null);

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

          if (response.data.data.ProcedureCharges?.length > 0) {
            const procedureCharges = response.data.data.ProcedureCharges;
            setGroupId(response.data.data.ServiceGroupId ?? 1045);
            const formattedCharges = procedureCharges.map((item, index) => ({
              key: index + 1,
              ProcedureChargeId: item.ProcedureChargeId,
              IsChargeable: item.IsChargeable ?? false,
              ServiceId: item.ProcedureId ?? "",
              Rate: item.Rate ?? 0,
              ChargeAmount: item.ChargeAmount ?? 0,
              ProviderId: item.ProviderId ?? "",
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

  useEffect(() => {
    fetchProcedureName();
    // eslint-disable-next-line
  }, [anesthesiaTypeId, chargeTypeId, PatientId, EncounterId]);

  const handleInputChange = (value, column, key) => {
    const newData = receiptInsAmtData.map((item) => {
      if (item.key === key) {
        let newValue = value;

        if (column === "DiscP") {
          let discP = parseFloat(value) || 0;

          if (discP > 100) {
            discP = 100;
            newValue = 100;
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

        form.setFieldsValue({
          [`Rate`]: { [recordKey - 1]: price },
          [`ChargeAmount`]: { [recordKey - 1]: price },
          [`NetAmount`]: { [recordKey - 1]: price },
          [`ServiceClassificationID`]: { [recordKey - 1]: serviceClassId },
          [`DiscP`]: { [recordKey - 1]: 0 },
          [`DiscAmount`]: { [recordKey - 1]: 0 },
        });
      }
    } catch (error) {
      console.error("Failed to fetch procedure details", error);
    }
  };

  async function handleInstrumentDelete(record) {
    try {
      const response = await customAxios.get(
        `${urlDeleteSelectedProcedureCharges}?ProcedureChargeId=${record.ProcedureChargeId}`
      );
      if (response.status === 200 && response.data) {
        fetchProcedureName();
      }
    } catch (error) {
      console.error("Error fetching procedure name", error);
    }
  }

  function handleAddRow() {
    const lastRow = receiptInsAmtData[receiptInsAmtData.length - 1];
    if (
      !lastRow.ServiceId ||
      !lastRow.Rate ||
      !lastRow.ChargeAmount ||
      !lastRow.ProviderId
    ) {
      message.warning("Please ensure all required fields in the current row are completed before adding a new entry.");
      return;
    }

    const newKey = receiptInsAmtData.length + 1;
    setReceiptInsAmtData([
      ...receiptInsAmtData,
      {
        key: newKey,
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
    ]);
  }

  // Remove all width properties for auto table width
  const receiptInscolumns = [
    {
      title: "Chargeable",
      dataIndex: "IsChargeable",
      key: "IsChargeable",
      render: (text, record) => (
        <Form.Item
          name={["IsChargeable", record.key - 1]}
          valuePropName="checked"
          initialValue={true}
          style={{ marginBottom: 0 }}
        >
          <Checkbox
            style={{ margin: 0, padding: 0 }}
            onChange={e =>
              handleInputChange(e.target.checked, "IsChargeable", record.key)
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Procedure",
      dataIndex: "ServiceId",
      key: "ServiceId",
      ellipsis: false,
      width: 220, // Set a fixed width for the cell
      render: (text, record) => {
        const selectedServiceIds = receiptInsAmtData
          .filter(item => item.key !== record.key)
          .map(item => item.ServiceId);

        return (
          <Form.Item
            name={["ServiceId", record.key - 1]}
            rules={[{ required: true, message: "Required" }]}
            style={{ marginBottom: 0 }}
          >
            <Select
              showSearch
              style={{ width: 210 }}
              dropdownMatchSelectWidth={false}
              dropdownStyle={{ minWidth: 350, maxWidth: 500 }}
              optionFilterProp="children"
              onChange={value => {
                handleInputChange(value, "ServiceId", record.key);
                fetchProcedureDetails(value, record.key);
              }}
            >
              {procedures
                ?.filter(option => !selectedServiceIds.includes(option.ServiceId))
                .map(option => (
                  <Select.Option key={option.ServiceId} value={option.ServiceId}>
                    {option.LongName}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        );
      },
    },
    {
      title: "Rate",
      dataIndex: "Rate",
      key: "Rate",
      render: (text, record) => (
        <Form.Item
          name={["Rate", record.key - 1]}
          style={{ marginBottom: 0 }}
          rules={[{ required: true, message: "Required" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            size="small"
            onChange={value => handleInputChange(value, "Rate", record.key)}
          />
        </Form.Item>
      ),
    },
    {
      title: "Amount",
      dataIndex: "ChargeAmount",
      key: "ChargeAmount",
      render: (text, record) => (
        <Form.Item
          name={["ChargeAmount", record.key - 1]}
          style={{ marginBottom: 0 }}
          rules={[{ required: true, message: "Required" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            size="small"
            onChange={value => handleInputChange(value, "ChargeAmount", record.key)}
          />
        </Form.Item>
      ),
    },
    {
      title: "Provider",
      dataIndex: "ProviderId",
      key: "ProviderId",
      ellipsis: false,
      width: 200, // Set a fixed width for the cell
      render: (text, record) => (
        <Form.Item
          name={["ProviderId", record.key - 1]}
          rules={[{ required: true, message: "Provider is required." }]}
          style={{ marginBottom: 0 }}
        >
          <Select
            showSearch
            style={{ width: 190 }}
            dropdownMatchSelectWidth={false}
            dropdownStyle={{ minWidth: 300, maxWidth: 400 }}
            optionFilterProp="children"
            onChange={value =>
              handleInputChange(value, "ProviderId", record.key)
            }
          >
            {providers?.map(option => (
              <Select.Option key={option.ProviderId} value={option.ProviderId}>
                {`${option.ProviderFirstName} ${option.ProviderLastName}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "Priority",
      dataIndex: "Priority",
      key: "Priority",
      render: (text, record) => (
        <Form.Item
          name={["Priority", record.key - 1]}
          style={{ marginBottom: 0 }}
        >
          <Input
            min={0}
            defaultValue={text}
            size="small"
            onChange={e =>
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
      render: (text, record) => (
        <Form.Item name={["DiscP", record.key - 1]} style={{ marginBottom: 0 }}>
          <Input
            min={0}
            defaultValue={text}
            size="small"
            onChange={e =>
              handleInputChange(e.target.value, "DiscP", record.key)
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "DiscAmount",
      dataIndex: "DiscAmount",
      key: "DiscAmount",
      render: (text, record) => (
        <Form.Item name={["DiscAmount", record.key - 1]} style={{ marginBottom: 0 }}>
          <Input
            disabled
            min={0}
            defaultValue={text}
            size="small"
          />
        </Form.Item>
      ),
    },
    {
      title: "ServiceTax?",
      dataIndex: "ServiceTax",
      key: "ServiceTax",
      render: (text, record) => (
        <Form.Item
          name={["ServiceTax", record.key - 1]}
          valuePropName="checked"
          initialValue={true}
          style={{ marginBottom: 0 }}
        >
          <Checkbox
            onChange={e =>
              handleInputChange(e.target.checked, "ServiceTax", record.key)
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "NetAmount",
      dataIndex: "NetAmount",
      key: "NetAmount",
      render: (text, record) => (
        <Form.Item name={["NetAmount", record.key - 1]} style={{ marginBottom: 0 }}>
          <Input
            min={0}
            defaultValue={text}
            size="small"
            onChange={e =>
              handleInputChange(e.target.value, "NetAmount", record.key)
            }
          />
        </Form.Item>
      ),
    },
    {
      title: (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddRow}
          size="small"
        />
      ),
      dataIndex: "add",
      key: "add",
      render: (text, record) => (
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => {
            if (record.ProcedureChargeId) {
              handleInstrumentDelete(record);
            } else {
              setReceiptInsAmtData(prev =>
                prev.filter(item => item.key !== record.key)
              );
            }
          }}
        >
          <Button type="text" icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  const [saving, setSaving] = useState(false);

  const handleFinish = async (values) => {
    try {
      setSaving(true);

      const filledRows = receiptInsAmtData.filter(
        item =>
          item.ServiceId &&
          item.Rate &&
          item.ChargeAmount &&
          item.ProviderId
      );

      if (filledRows.length !== receiptInsAmtData.length) {
        setReceiptInsAmtData(filledRows);
        message.info("Empty/incomplete rows were removed.");
      }

      const unsavedRows = filledRows.filter(item => !item.ProcedureChargeId);

      if (unsavedRows.length === 0) {
        message.info("No new procedures to save.");
        setSaving(false);
        return;
      }

      let saved = false;
      for (const item of unsavedRows) {
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
            ProviderId: item.ProviderId,
            Priority: item.Priority,
            Discount: item.DiscAmount,
            DiscountRate: item.DiscP,
            ServiceTax: item.ServiceTax || false,
            TaxAmount: item.TaxAmount || 0,
            NetAmount: item.NetAmount,
            ServiceGroupId: groupId,
            ServiceclassificationId: item.ServiceClassificationID,
          };
          const payload = {
            AddNewProcedureCharges: object,
            ProcedureChargesDetails: [],
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
            saved = true;
          }
        }
      }
      if (saved) {
        message.success("Procedures saved successfully");
        fetchProcedureName(); // reload all saved procedures
      } else {
        message.info("No valid new procedures to save.");
      }
    } catch (error) {
      console.error("Save failed:", error);
      alert("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

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
        <Row gutter={16} style={{ marginBottom: "1rem" }}>
          <Col>
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
          </Col>
          <Col>
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
          </Col>
        </Row>
        {/* Only show the table and form if both types are selected */}
        {(anesthesiaTypeId && chargeTypeId) && (
          <Form
            form={form}
            layout="vertical"
            size="small"
            onFinish={handleFinish}
          >
            <Table
              dataSource={receiptInsAmtData}
              columns={receiptInscolumns}
              rowClassName={(record) => (record.disabled ? "disabled-row" : "")}
              size="small"
              bordered
              pagination={false}
              style={{ marginBottom: 12 }}
              onRow={(record) => ({
                onMouseEnter: () => setHoveredRowKey(record.key),
                onMouseLeave: () => setHoveredRowKey(null),
              })}
            />
            <Row justify={"end"} gutter={16}>
              <Col>
                <Form.Item>
                  <Button htmlType="submit" type="primary" loading={saving}>
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
        )}
      </div>
    </Layout>
  );
}

export default CreateProcedure;