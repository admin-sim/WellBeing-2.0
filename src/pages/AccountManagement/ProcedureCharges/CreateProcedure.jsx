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

  const PatientId = location.state?.patientId;
  const EncounterId = location.state?.encounterId;

  useEffect(() => {
    if (!PatientId || !EncounterId) {
      message.error("Missing patient or encounter information.");
      navigate("/ProcedureCharges");
    }

  }, [PatientId, EncounterId, navigate]);

  const [patientData, setPatientData] = useState(null);
  const [anesthesiaType, setAnesthesiaType] = useState(null);
  const [chargeType, setChargeType] = useState(null);
  const [groupId, setGroupId] = useState(null); // This state will hold the ServiceGroupId ***  important for saving procedures  ***
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
    } catch (error) {
      console.error("Error fetching patient header details:", error);
      message.error("Failed to load Patient & Encounter header details.");
    }
  };

  useEffect(() => {
    if (PatientId && EncounterId) fetchdata();
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
    } catch (error) {
      console.error("Error fetching initial create procedure data:", error);
      message.error("Failed to load initial procedure data.");
    }
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
      TaxAmount: 0
    },
  ];

  const [receiptInsAmtData, setReceiptInsAmtData] = useState(initialDataSource);

  const fetchProcedureName = async () => {
    if (anesthesiaTypeId && chargeTypeId && PatientId && EncounterId) {
      setReceiptInsAmtData([]); // Clear existing data before fetching new
      form.resetFields(); // Reset form fields to clear old values
      try {
        const response = await customAxios.get(
          `${urlGetProcedureName}?AnesthesiaTypeId=${anesthesiaTypeId}&AnesthesiaChargeTypeId=${chargeTypeId}&Patient=${PatientId}&EncounterId=${EncounterId}`
        );

        if (response.status === 200 && response.data) {
          setProcedures(response.data.data.Services);
          setProviders(response.data.data.Provider);
          setExistingProcedures(response.data.data.ProcedureCharges); 

         
          setGroupId(response.data.data.ServiceGroupId); // This should get the "Surgical Services" ID

          if (response.data.data.ProcedureCharges?.length > 0) {
            const procedureCharges = response.data.data.ProcedureCharges;
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
        console.error("Error fetching procedure name and data:", error);
        message.error("Failed to load procedure names or existing charges.");
      }
    }
  };

  useEffect(() => {
    fetchProcedureName();
  }, [anesthesiaTypeId, chargeTypeId, PatientId, EncounterId]);

  const handleInputChange = (value, column, key) => {
    const newData = receiptInsAmtData.map((item) => {
      if (item.key === key) {
        let updatedItem = { ...item, [column]: value };

        // Recalculate DiscAmount and NetAmount if Rate, ChargeAmount, or DiscP changes
        if (column === "Rate" || column === "ChargeAmount" || column === "DiscP") {
          const rate = parseFloat(updatedItem.Rate) || 0;
          const chargeAmount = parseFloat(updatedItem.ChargeAmount) || 0;
          let discP = parseFloat(updatedItem.DiscP) || 0;

          if (column === "DiscP") {
            if (discP > 100) {
              discP = 100;
              updatedItem.DiscP = 100;
              form.setFieldsValue({ [`DiscP`]: { [key - 1]: 100 } }); 
            }
          }

          const discAmount = (rate * discP) / 100; 
          const netAmount = chargeAmount - discAmount;

          updatedItem = {
            ...updatedItem,
            DiscAmount: discAmount,
            NetAmount: netAmount,
          };

          form.setFieldsValue({
            [`DiscAmount`]: { [key - 1]: updatedItem.DiscAmount },
            [`NetAmount`]: { [key - 1]: updatedItem.NetAmount },
          });
        }
        return updatedItem;
      }
      return item;
    });

    setReceiptInsAmtData(newData);
  };

  const fetchProcedureDetails = async (serviceId, recordKey) => {
    try {
      const response = await customAxios.get(
        `${urlGetServiceChargeforProcedure}?anesthesiaTypeId=${anesthesiaTypeId}&anesthesiaChargeTypeId=${chargeTypeId}&serviceId=${serviceId}`
      );

      if (response.status === 200 && response.data) {
        const priceDef = response.data.data.ServicePriceDefinition;

        const price = priceDef?.Price || 0;
        const serviceClassId = priceDef?.ServiceClassificationId || 0; 

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
      message.error("Failed to get service charge details.");
    }
  };

  async function handleInstrumentDelete(record) {
    try {
      if (record.ProcedureChargeId) {
        const response = await customAxios.get(
          `${urlDeleteSelectedProcedureCharges}?ProcedureChargeId=${record.ProcedureChargeId}`
        );
        if (response.status === 200 && response.data) {
          message.success("Procedure charge deleted successfully.");
          fetchProcedureName(); 
        } else {
          message.error("Failed to delete procedure charge on server.");
        }
      } else {
        setReceiptInsAmtData((prev) =>
          prev.filter((item) => item.key !== record.key)
        );
        message.info("Unsaved procedure row removed.");
      }
    } catch (error) {
      console.error("Error deleting procedure charge:", error);
      message.error("An error occurred while trying to delete the procedure charge.");
    }
  }

  function handleAddRow() {
    const lastRow = receiptInsAmtData[receiptInsAmtData.length - 1];
    if (
      !lastRow.ProcedureChargeId && 
      (!lastRow.ServiceId ||
        lastRow.Rate === 0 || 
        lastRow.ChargeAmount === 0 || 
        !lastRow.ProviderId)
    ) {
      message.warning("Please ensure all required fields (Procedure, Rate, Amount, Provider) in the current row are completed before adding a new entry.");
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

  const receiptInscolumns = [
    {
      title: "Chargeable",
      dataIndex: "IsChargeable",
      key: "IsChargeable",
      align: "center",
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
      width: 220,
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
              style={{ width: 250 }}
              dropdownMatchSelectWidth={false}
              dropdownStyle={{ width: 350 }}
              optionFilterProp="children"
              onChange={value => {
                handleInputChange(value, "ServiceId", record.key);
                fetchProcedureDetails(value, record.key);
              }}
              disabled={record.ProcedureChargeId ? true : false} 
            >
              {procedures
                ?.filter(option => !selectedServiceIds.includes(option.ServiceId) || option.ServiceId === record.ServiceId) 
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
            style={{ width: 80 }}
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
            style={{ width: 100 }}
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
      width: 220,
      render: (text, record) => (
        <Form.Item
          name={["ProviderId", record.key - 1]}
          rules={[{ required: true, message: "Provider is required." }]}
          style={{ marginBottom: 0 }}
        >
          <Select
            showSearch
            style={{ width: 210 }}
            dropdownStyle={{ minWidth: 250, maxWidth: 350 }}
            optionFilterProp="children"
            onChange={value =>
              handleInputChange(value, "ProviderId", record.key)
            }
          >
            {providers?.map(option => (
              <Select.Option
                key={option.ProviderId}
                value={option.ProviderId}
                title={`${option.ProviderFirstName} ${option.ProviderLastName}`}
              >
                <span style={{
                  display: "inline-block",
                  maxWidth: 200,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  verticalAlign: "middle"
                }}>
                  {`${option.ProviderFirstName} ${option.ProviderLastName}`}
                </span>
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
            style={{ width: 50 }}
            onChange={e =>
              handleInputChange(e.target.value, "Priority", record.key)
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Disc % ",
      dataIndex: "DiscP",
      key: "DiscP",
      render: (text, record) => (
        <Form.Item name={["DiscP", record.key - 1]} style={{ marginBottom: 0 }}>
          <Input
            min={0}
            defaultValue={text}
            size="small"
            style={{ width: 50 }}
            onChange={e =>
              handleInputChange(e.target.value, "DiscP", record.key)
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Disc Amt",
      dataIndex: "DiscAmount",
      key: "DiscAmount",
      render: (text, record) => (
        <Form.Item name={["DiscAmount", record.key - 1]} style={{ marginBottom: 0 }}>
          <Input
            disabled // This should be calculated, not directly editable
            min={0}
            defaultValue={text}
            size="small"
            style={{ width: 60 }}
          />
        </Form.Item>
      ),
    },
    {
      title: "STax?",
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
      fixed: "right",
      render: (text, record) => (
        <Form.Item name={["NetAmount", record.key - 1]} style={{ marginBottom: 0 }}>
          <Input
            disabled // This should be calculated, not directly editable
            min={0}
            defaultValue={text}
            size="small"
            style={{ width: 80 }}
          />
        </Form.Item>
      ),
    },
    {
      title: (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 48 }}>
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={handleAddRow}
            size="small"
            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
          />
        </div>
      ),
      key: "actions",
      fixed: "right",
      width: 60,
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 48 }}>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => {
              handleInstrumentDelete(record); //  delete logic...
            }}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              size="small"
              danger
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "red",
                border: "1px solid #ff4d4f",
                borderRadius: "50%"
              }}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const [saving, setSaving] = useState(false);

  const handleFinish = async (values) => {
    try {
      setSaving(true);

      // Filter out incomplete rows and only get the "new" ones (without ProcedureChargeId)
      const unsavedNewRows = receiptInsAmtData.filter(
        item =>
          !item.ProcedureChargeId && // Only new items
          item.ServiceId &&
          item.Rate !== 0 && // Rate must be non-zero
          item.ChargeAmount !== 0 && // ChargeAmount must be non-zero
          item.ProviderId
      );

      if (unsavedNewRows.length === 0) {
        message.info("No new, valid procedures to save.");
        setSaving(false);
        return;
      }

      let allNewProceduresSavedSuccessfully = true;

      for (const item of unsavedNewRows) {
        const charamt = parseFloat(item.ChargeAmount) || 0;
        const discamt = parseFloat(item.DiscAmount) || 0;

        if (charamt < discamt) {
          message.error(`Charge amount (${charamt}) cannot be less than discount amount (${discamt}) for a procedure.`);
          allNewProceduresSavedSuccessfully = false;
          continue; // Skip this item
        }
        
        if (!groupId) {
             message.error("Service Group ID (Surgical Services) is missing. Cannot save procedures.");
             allNewProceduresSavedSuccessfully = false;
             continue;
        }

        const procedureChargeObject = {
          FacilityId: 1, // Confirm this ID with your backend's expectation
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
          ServiceClassificationId: item.ServiceClassificationID, 
        };

        const payload = {
 
         AddNewProcedureCharges: procedureChargeObject,
          ProcedureChargesDetails: [], 
        };

        console.log("Attempting to save new procedure with payload:", payload);

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
          message.success(`Procedure for saved successfully.`);
        } else {
          allNewProceduresSavedSuccessfully = false;
          message.error(`Failed to save procedure: ${item.ServiceId}. Server responded with status ${response.status}.`);
        }
      }

      if (allNewProceduresSavedSuccessfully && unsavedNewRows.length > 0) {
        message.success("All new procedures saved successfully!");
        fetchProcedureName(); 
      } else if (!allNewProceduresSavedSuccessfully) {
        message.warn("Some new procedures failed to save. Check console for details.");
      }

    } catch (error) {
      console.error("Overall Save failed:", error.response ? error.response.data : error.message);
      message.error(`An error occurred during saving: ${error.response?.data?.message || error.message}`);
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
              scroll={{ x: 'max-content' }}
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