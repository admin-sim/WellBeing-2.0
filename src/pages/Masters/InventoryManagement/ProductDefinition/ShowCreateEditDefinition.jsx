import React, { useEffect, useState } from "react";
import {
  urlAddNewProduct,
  urlShowCreateDefinition,
  urlShowEditDefinition,
  urlUpdateProduct,
} from "../../../../../endpoints.js";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import "./showCreateEditDefinition.css";
import {
  Button,
  Checkbox,
  Col,
  Collapse,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Spin,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import { LeftOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form.js";
import TextArea from "antd/es/input/TextArea.js";
import { IoMdAddCircle, IoMdAddCircleOutline } from "react-icons/io";
import { v4 as uuidv4 } from "uuid";
import CustomTable from "../../../../components/customTable/index.jsx";
import {
  ColWithEightSpan,
  ColWithSixSpan,
  ColWithSixteenSpan,
  ColWithTwelveSpan,
} from "../../../../components/customGridColumns/index.jsx";

function ShowEditDefinition() {
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState();
  const [UomData, setUomData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState({});
  const [buttonTitle, setButtonTitle] = useState('Add To List');
  const location = useLocation();
  const navigate = useNavigate();
  const record = location.state.record;
  const type = location.state.type
  const [isModalOpen, setIsModalOpen] = useState()
  const [form] = useForm();
  const [form1] = useForm();

  useEffect(() => {
    async function fetch() {
      debugger
      if (type) {
        try {
          setLoading(true);
          await customAxios
            .get(
              `${urlShowCreateDefinition}?ProductGroup=${record?.ProductGroupId}&Classification=${record?.ProductClassificationId}`
            )
            .then((response) => {
              const apiData = response.data.data;
              setApiData(apiData);
            });
        } catch (error) {
          console.error("Error fetching Product Definitiondetails:", error);
        }
      } else {
        try {
          setLoading(true);
          await customAxios
            .get(
              `${urlShowEditDefinition}?Id=${record?.ProductDefinitionId}&ProductGroup=${record?.ProductGroupId}`
            )
            .then((response) => {
              const apiData = response.data.data;
              const newUom = apiData.ProductUom.map((i) => {
                return {
                  ...i,
                  key: uuidv4(),
                  AlternateUOML: i.AlternateUOMName,
                  EquivalentUOML: i.EquivalentUOMName
                }
              })
              setUomData(newUom)
              form.setFieldsValue({ 'HSNSAC': apiData.NewProductDefinitionModel.HSNSAC })
              form.setFieldsValue({ 'ShortName': apiData.NewProductDefinitionModel.ShortName })
              form.setFieldsValue({ 'LongName': apiData.NewProductDefinitionModel.LongName })
              form.setFieldsValue({ 'Manufacturer': apiData.NewProductDefinitionModel.Manufacturer == 0 ? undefined : apiData.NewProductDefinitionModel.Manufacturer })
              form.setFieldsValue({ 'TrackingMethod': apiData.NewProductDefinitionModel.TrackingMethod })
              form.setFieldsValue({ 'IsAtomic': apiData.NewProductDefinitionModel.IsAtomic })
              form.setFieldsValue({ 'Sourcing': apiData.NewProductDefinitionModel.Sourcing })
              form.setFieldsValue({ 'Expiry': apiData.NewProductDefinitionModel.Expiry })
              form.setFieldsValue({ 'Status': apiData.NewProductDefinitionModel.Status })
              form.setFieldsValue({ 'Remrks': apiData.NewProductDefinitionModel.Remrks })
              form.setFieldsValue({ 'UOMPrimaryUOM': apiData.NewProductDefinitionModel.UOMPrimaryUOM })
              form.setFieldsValue({ 'UOMDecimalPlaces': apiData.NewProductDefinitionModel.UOMDecimalPlaces })
              form.setFieldsValue({ 'ProductDefinitionId': apiData.NewProductDefinitionModel.ProductDefinitionId })
              form.setFieldsValue({ 'BillingIsChargeable': apiData.NewProductDefinitionModel.BillingIsChargeable === 'N' ? false : true })
              form.setFieldsValue({ 'BillingIsProviderMandatory': apiData.NewProductDefinitionModel.BillingIsProviderMandatory === 'N' ? false : true })
              form.setFieldsValue({ 'BillingPricingMethod': apiData.NewProductDefinitionModel.BillingPricingMethod })
              form.setFieldsValue({ 'Serialization': apiData.NewProductDefinitionModel.Serialization===null ? 'Auto' : apiData.NewProductDefinitionModel.Serialization })
              form.setFieldsValue({ 'MinimumStock': apiData.NewProductDefinitionModel.MinimumStock })
              form.setFieldsValue({ 'MaximumStock': apiData.NewProductDefinitionModel.MaximumStock })
              form.setFieldsValue({ 'ReorderLevel': apiData.NewProductDefinitionModel.ReorderLevel })
              form.setFieldsValue({ 'MinimumStockDays': apiData.NewProductDefinitionModel.MinimumStockDays })
              form.setFieldsValue({ 'BarcodeApplicability': apiData.NewProductDefinitionModel.BarcodeApplicability })
              form.setFieldsValue({ 'DefaultPrice': apiData.NewProductDefinitionModel.DefaultPrice })
              form.setFieldsValue({ 'MinimumShelfLifeinDays': apiData.NewProductDefinitionModel.MinimumShelfLifeinDays })
              form.setFieldsValue({ 'LeadTimeinDays': apiData.NewProductDefinitionModel.LeadTimeinDays })
              form.setFieldsValue({ 'DrugForm': apiData.NewProductDefinitionModel.DrugForm })
              setApiData(apiData);
            });
        } catch (error) {
          console.error("Error fetching Product Definitiondetails:", error);
        }
      }
      setLoading(false);
    }
    fetch()
  }, []);

  const handleBackToList = () => {
    console.log("back");
    navigate("/ProductDefinition");
  };

  const onFinish = async (values) => {
    try {
      const Product = {
        ProductClassificationId: record.ProductClassificationId,
        ProductDefinitionId: values.ProductDefinitionId,
        HSNSAC: values.HSNSAC,
        LongName: values.LongName,
        ShortName: values.ShortName,
        Manufacturer: values.Manufacturer,
        TrackingMethod: values.TrackingMethod,
        Sourcing: values.Sourcing,
        Expiry: values.Expiry,
        IsAtomic: values.IsAtomic ? "True" : "False",
        Status: values.Status,
        Remarks: values.Remarks,
        UOMPrimaryUOM: values.UOMPrimaryUOM,
        UOMDecimalPlaces: values.UOMDecimalPlaces ? values.UOMDecimalPlaces : 0,
        BillingIsChargeable:
          values.BillingIsChargeable === true ||
            values.BillingIsChargeable === undefined
            ? "True"
            : "False",
        BillingIsProviderMandatory:
          values.BillingIsProviderMandatory === true ||
            values.BillingIsProviderMandatory === undefined
            ? "True"
            : "False",
        BillingPricingMethod:
          values.BillingPricingMethod === "Regulated Price" ||
            values.BillingPricingMethod === undefined
            ? "Regulated Price"
            : values.BillingPricingMethod,
        OrderIsOrderable:
          values.OrderIsOrderable === true ||
            values.OrderIsOrderable === undefined
            ? "True"
            : "False",
        OrderIsIntervalApplicable:
          values.OrderIsIntervalApplicable === true ||
            values.OrderIsIntervalApplicable === undefined
            ? "True"
            : "False",
        OrderIsQuantityApplicable:
          values.OrderIsQuantityApplicable === true ||
            values.OrderIsQuantityApplicable === undefined
            ? "True"
            : "False",
        OrderDuration: values.OrderDuration,
        OrderUOM: values.OrderUOM,
        OrderDefaultFrequency: values.OrderDefaultFrequency,
        OrderRoute: values.OrderRoute,
        OrderPatTypeEmergency: values.OrderPatTypeEmergency ? "True" : "False",
        OrderPatTypeIp: values.OrderPatTypeIp ? "True" : "False",
        OrderPatTypeAmbulatory: values.OrderPatTypeAmbulatory
          ? "True"
          : "False",
        OrderPatTypeShortstay: values.OrderPatTypeShortstay ? "True" : "False",
      };

      const Stock = {
        Serialization:
          values.Serialization === "Auto" || values.Serialization === undefined
            ? "Auto"
            : values.Serialization,
        DrugForm: values.DrugForm,
        MinimumStockDays: values.MinimumStockDays,
        MinimumStock: values.MinimumStock,
        LeadTimeinDays: values.LeadTimeinDays,
        MaximumStock: values.MaximumStock,
        ReorderLevel: values.ReorderLevel,
        ReorderQuantity: values.ReorderQuantity,
        BarcodeApplicability:
          values.BarcodeApplicability === "Not Applicable" ||
            values.BarcodeApplicability === undefined
            ? "Not Applicable"
            : values.BarcodeApplicability,
        DefaultPrice: values.DefaultPrice,
        MinimumShelfLifeinDays: values.MinimumShelfLifeinDays,
        IsConsumptionAllowed:
          values.IsConsumptionAllowed === true ||
            values.IsConsumptionAllowed === undefined
            ? "True"
            : "False",
      };

      const datafiltered = UomData.filter(item => item.ActiveFlag === true)

      const ProductDefinition = {
        NewProductDefinitionModel: Product,
        ProductDefinition: type ? datafiltered : UomData,
        ProductStock: Stock,
        Gender: null,
      };
      //Send a POST request to the server 
      if (type) {
        const response = await customAxios.post(
          urlAddNewProduct,
          ProductDefinition,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200 && response.data.data === true) {
          message.success("Product Definition Is Success");
          navigate("/ProductDefinition");
        }
      } else {
        const response = await customAxios.post(
          urlUpdateProduct,
          ProductDefinition,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200 && response.data.data === true) {
          message.success("Product Definition Is Success");
          navigate("/ProductDefinition");
        }
      }

    } catch (error) { }
  };

  const UOMColumns = [
    {
      title: "Alternate UOM Units",
      dataIndex: "AlternateUOMUnits",
      key: "1",
      width: 180,
    },
    {
      title: "Alternate UOM",
      dataIndex: "AlternateUOML",
      key: "2",
      width: 180,
    },
    {
      title: "Equivalent UOM Units",
      dataIndex: "EquivalentUOMUnits",
      key: "3",
      width: 180,
    },
    {
      title: "Equivalent UOM",
      dataIndex: "EquivalentUOML",
      key: "4",
      width: 180,
    },
  ];

  const AgeGenderRestrictionColumns = [
    {
      title: "Gender",
      dataIndex: "Gender",
      key: "1",
      width: 100,
    },
    {
      title: "Start Age",
      dataIndex: "StartAge",
      key: "2",
      width: 100,
    },
    {
      title: "Age Unit",
      dataIndex: "AgeUnit",
      key: "3",
      width: 100,
    },
    {
      title: "End Age",
      dataIndex: "EndAge",
      key: "4",
      width: 100,
    },
    {
      title: "Age Unit",
      dataIndex: "AgeUnit",
      key: "5",
      width: 100,
    },
  ];

  function handleCloseModal() {
    form1.resetFields()
    setIsModalOpen(false)
    setButtonTitle('Add To List')
  }

  function handleEditUom(value) {
    form1.setFieldsValue({ 'AlternateUOMUnit': value.AlternateUOMUnits })
    form1.setFieldsValue({ 'EquivalentUOMUnit': value.EquivalentUOMUnits })
    form1.setFieldsValue({ 'AUOMLabel': value.AlternateUOML })
    form1.setFieldsValue({ 'EUOMLabel': value.EquivalentUOML })
    form1.setFieldsValue({ 'AUOM': value.AlternateUOM })
    form1.setFieldsValue({ 'EUOM': value.EquivalentUOM })
    setIsModalOpen(true)
    setSelectedRecord(value)
    setButtonTitle('Update')
  }

  function handleDeleteUom(value) {
    debugger
    const newData = UomData.map((item) => {
      if (item.key === value.key) {
        return { ...item, ActiveFlag: false };
      }
      return item;
    });
    setUomData(newData);
  }

  const itemsUOM = [
    {
      key: "1",
      label: <span style={{ fontSize: "1rem", fontWeight: 600 }}>UOM</span>,
      children: (
        <div style={{ borderBottom: "1px solid silver" }}>
          <Row gutter={16}>
            <ColWithSixSpan>
              <Form.Item
                name="UOMPrimaryUOM"
                label="Primary UOM"
                rules={[
                  {
                    required: true,
                    message: "Primary UOM is Required",
                  },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  options={apiData?.UOM?.map((option) => ({
                    value: option.UomId,
                    label: option.FullName,
                  }))}
                />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="decimalPlaces" label="Decimal Places">
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </ColWithSixSpan>
          </Row>
          <CustomTable
            columns={UOMColumns}
            dataSource={UomData.filter(item => item.ActiveFlag === true)}
            // actionColumn={false}
            onEdit={handleEditUom}
            onDelete={handleDeleteUom}
          />
        </div>
      ),
      extra: (
        <Button
          onClick={async (e) => {
            e.stopPropagation();
            await form.validateFields(['UOMPrimaryUOM'])
            setIsModalOpen(true)
          }}
          type="link"
          icon={
            <IoMdAddCircleOutline
              style={{ fontSize: "1.5rem", color: "blueviolet" }}
            />
          }
        />
      ),
    },
    {
      key: "2",
      label: <span style={{ fontSize: "1rem", fontWeight: 600 }}>Billing</span>,
      children: (
        <div style={{ borderBottom: "1px solid silver" }}>
          <Row gutter={16}>
            <ColWithEightSpan>
              <Form.Item
                valuePropName="checked"
                name="BillingIsChargeable"
                label=" "
              >
                <Checkbox>Is Chargeable</Checkbox>
              </Form.Item>
            </ColWithEightSpan>
            <ColWithEightSpan>
              <Form.Item
                name="BillingIsProviderMandatory"
                valuePropName="checked"
                label=" "
              >
                <Checkbox checked>Is Provider Mandatory</Checkbox>
              </Form.Item>
            </ColWithEightSpan>
            <ColWithEightSpan>
              <Form.Item
                name="BillingPricingMethod"
                label="Pricing Method"
                initialValue="Regulated Price"
              >
                <Select
                  style={{ width: "100%" }}
                  options={[
                    { value: "Regulated Price", label: "Regulated Price" },
                    { value: "Fixed Price", label: "Fixed Price" },
                    { value: "Cost Markup Price", label: "Cost Markup Price" },
                  ]}
                />
              </Form.Item>
            </ColWithEightSpan>
          </Row>
        </div>
      ),
    },
    {
      key: "3",
      label: <span style={{ fontSize: "1rem", fontWeight: 600 }}>Stock</span>,
      children: (
        <div style={{ borderBottom: "1px solid silver" }}>
          <Row gutter={16}>
            <ColWithSixSpan>
              <Form.Item
                name="Serialization"
                label="Serialization"
                rules={[
                  {
                    required: true,
                    message: "Serialization is Required",
                  },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  options={[
                    { value: "Auto", label: "Auto" },
                    { value: "Manual", label: "Manual" },
                  ]}
                />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="DrugForm" label="Drug Form">
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="MinimumStockDays" label="Minimum Stock Days">
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="MinimumStock" label="Minimum Stock">
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="LeadTimeinDays" label="Lead Time">
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </ColWithSixSpan>

            <ColWithSixSpan>
              <Form.Item name="ReorderLevel" label="Reorder Level">
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="ReorderQuantity" label="Reorder Quantity">
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="MaximumStock" label="Maximum Stock">
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item
                name="BarcodeApplicability"
                label="Barcode Applicability"
                initialValue="Not Applicable"
              >
                <Select
                  style={{ width: "100%" }}
                  options={[
                    { value: "Not Applicable", label: "Not Applicable" },
                    {
                      value: "Manufacturer Barcode",
                      label: "Manufacturer Barcode",
                    },
                    { value: "Hosital Barcode", label: "Hosital Barcode" },
                  ]}
                />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="DefaultPrice" label="Default Price">
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item
                name="MinimumShelfLifeinDays"
                label="Minimum Shelf Life in Days"
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item
                name="IsConsumptionAllowed"
                valuePropName="checked"
                label=" "
              >
                <Checkbox checked>Is Consumption Allowed</Checkbox>
              </Form.Item>
            </ColWithSixSpan>
          </Row>
        </div>
      ),
    },
    {
      key: "4",
      label: (
        <span style={{ fontSize: "1rem", fontWeight: 600 }}>
          Ordering Attributes
        </span>
      ),
      children: (
        <div style={{ borderBottom: "1px solid silver" }}>
          <Row gutter={32}>
            <ColWithEightSpan>
              <Form.Item
                name="OrderIsOrderable"
                valuePropName="checked"
                label=" "
              >
                <Checkbox checked>Is Orderable</Checkbox>
              </Form.Item>
            </ColWithEightSpan>
            <ColWithEightSpan style={{ alignItems: "center" }}>
              <Form.Item
                name="OrderIsIntervalApplicable"
                valuePropName="checked"
                label=" "
              >
                <Checkbox checked> Is Interval Applicable</Checkbox>
              </Form.Item>
            </ColWithEightSpan>
            <ColWithEightSpan>
              <Form.Item
                name="OrderIsQuantityApplicable"
                valuePropName="checked"
                label=" "
              >
                <Checkbox checked> Is Quantity Applicable</Checkbox>
              </Form.Item>
            </ColWithEightSpan>
            <Divider style={{ margin: "0" }} orientation="left">
              Default Dosage
            </Divider>
            <ColWithSixSpan>
              <Form.Item name="OrderDuration" label="Duration">
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="OrderUOM" label="UOM">
                <Select
                  style={{ width: "100%" }}
                  options={apiData?.UOM?.map((option) => ({
                    value: option.UomId,
                    label: option.FullName,
                  }))}
                />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="OrderDefaultFrequency" label="Default Frequency">
                <Select
                  style={{ width: "100%" }}
                  options={apiData?.DefaultFrequency?.map((option) => ({
                    value: option.LookupID,
                    label: option.LookupDescription,
                  }))}
                />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="OrderRoute" label="Route">
                <Select
                  style={{ width: "100%" }}
                  options={apiData?.Route?.map((option) => ({
                    value: option.LookupID,
                    label: option.LookupDescription,
                  }))}
                />
              </Form.Item>
            </ColWithSixSpan>
            <Divider style={{ margin: "0" }} orientation="left">
              Applicable Patient Type
            </Divider>
            <ColWithSixSpan>
              <Form.Item
                valuePropName="checked"
                name="OrderPatTypeEmergency"
                label=" "
              >
                <Checkbox>Emergency Patient</Checkbox>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item
                valuePropName="checked"
                name="OrderPatTypeIp"
                label=" "
              >
                <Checkbox>In Patient</Checkbox>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item
                valuePropName="checked"
                name="OrderPatTypeAmbulatory"
                label=" "
              >
                <Checkbox>Ambulatory Patient</Checkbox>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item
                valuePropName="checked"
                name="OrderPatTypeShortstay"
                label=" "
              >
                <Checkbox>Short Stay Patient</Checkbox>
              </Form.Item>
            </ColWithSixSpan>
            <Divider
              style={{ margin: "0", display: "flex", alignItems: "center" }}
              orientation="left"
            >
              <span>Age-Gender Restriction</span>{" "}
              <Button
                type="link"
                icon={<IoMdAddCircle style={{ fontSize: "1.2rem" }} />}
              />
            </Divider>
          </Row>
          <CustomTable
            columns={AgeGenderRestrictionColumns}
            dataSource={null}
          />
        </div>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <div
        style={{
          width: "100%",
          backgroundColor: "white",
          borderRadius: "10px",
        }}
      >
        <PageHeader
          title="Product Definition"
          buttonLabel="Back to list"
          buttonIcon={<LeftOutlined />}
          onButtonClick={handleBackToList}
        />
        <Row
          style={{
            padding: "1rem 1rem 0 1rem",
            borderBottom: "1px solid #E5E4E2",
          }}
        >
          <ColWithTwelveSpan>
            <p>
              Product Group : <strong>{record?.ProductGroup}</strong>
            </p>
          </ColWithTwelveSpan>
          <ColWithTwelveSpan>
            <p>
              Product Classification :{" "}
              <strong>{record?.ProductClassification}</strong>
            </p>
          </ColWithTwelveSpan>
        </Row>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ margin: "1rem" }}
          initialValues={{
            Serialization: "Auto",
            IsAtomic: true,
            BillingIsChargeable: true,
            BillingIsProviderMandatory: true,
            IsConsumptionAllowed: true,
            OrderIsOrderable: true,
            OrderIsIntervalApplicable: true,
            OrderIsQuantityApplicable: true,
          }}
        >
          <Row gutter={16}>
            <ColWithSixteenSpan>
              <Row gutter={32}>
                <ColWithSixSpan>
                  <Form.Item
                    name="HSNSAC"
                    label="HSN/SAC"
                    rules={[
                      {
                        required: true,
                        message: "HSN Required",
                      },
                    ]}
                  >
                    <Input style={{ width: "100%" }} />
                  </Form.Item>
                  <Form.Item name="ProductDefinitionId" hidden>
                    <Input />
                  </Form.Item>
                </ColWithSixSpan>
                <ColWithSixSpan>
                  <Form.Item
                    name="ShortName"
                    label="Short Name"
                    rules={[
                      {
                        required: true,
                        message: "Short Name is Required",
                      },
                    ]}
                  >
                    <Input style={{ width: "100%" }} />
                  </Form.Item>
                </ColWithSixSpan>
                <ColWithTwelveSpan>
                  <Form.Item
                    name="LongName"
                    label="Long Name"
                    rules={[
                      {
                        required: true,
                        message: "Long Name is Required",
                      },
                    ]}
                  >
                    <Input style={{ width: "100%" }} />
                  </Form.Item>
                </ColWithTwelveSpan>
                <ColWithTwelveSpan>
                  <Form.Item name="Manufacturer" label="Manufacturer">
                    <Select
                      style={{ width: "100%" }}
                      options={apiData?.Manufacturer?.map((option) => ({
                        value: option.VendorId,
                        label: option.LongName,
                      }))}
                    />
                  </Form.Item>
                </ColWithTwelveSpan>
                <ColWithSixSpan>
                  <Form.Item
                    name="TrackingMethod"
                    label="Tracking Method"
                    initialValue="BatchID"
                    rules={[
                      {
                        required: true,
                        message: "Tracking Method is Required",
                      },
                    ]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      options={[
                        { value: "BatchID", label: "Batch ID" },
                        { value: "Product", label: "Product" },
                        { value: "Serialized", label: "Serialized" },
                        {
                          value: "Batch&serialized",
                          label: "Batch & serialized",
                        },
                      ]}
                    />
                  </Form.Item>
                </ColWithSixSpan>

                <ColWithSixSpan>
                  <Form.Item valuePropName="checked" name="IsAtomic" label=" ">
                    <Checkbox checked style={{ width: "100%" }}>
                      is Atomic
                    </Checkbox>
                  </Form.Item>
                </ColWithSixSpan>
                <ColWithSixSpan>
                  <Form.Item
                    name="Sourcing"
                    label="Sourcing"
                    rules={[
                      {
                        required: true,
                        message: "Sourcing is Required",
                      },
                    ]}
                    initialValue="Inventoried" // Setting Inventoried as the default value
                  >
                    <Select
                      style={{ width: "100%" }}
                      options={[
                        { value: "Inventoried", label: "Inventoried" },
                        { value: "On Demand", label: "On Demand" },
                        { value: "Vendor Managed", label: "Vendor Managed" },
                      ]}
                    />
                  </Form.Item>
                </ColWithSixSpan>
                <ColWithSixSpan>
                  <Form.Item
                    name="Expiry"
                    label="Expiry"
                    rules={[
                      {
                        required: true,
                        message: "Expiry is Required",
                      },
                    ]}
                    initialValue="Month wise" // Setting "Month wise" as the default value
                  >
                    <Select
                      style={{ width: "100%" }}
                      options={[
                        { value: "Month wise", label: "Month wise" },
                        { value: "Date wise", label: "Date wise" },
                        { value: "Not applicable", label: "Not applicable" },
                      ]}
                    />
                  </Form.Item>
                </ColWithSixSpan>
                <ColWithSixSpan>
                  <Form.Item
                    name="Status"
                    label="Status"
                    initialValue="True"
                    rules={[
                      {
                        required: true,
                        message: "Status is Required",
                      },
                    ]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      options={[
                        { value: "True", label: "Active" },
                        { value: "False", label: "Hidden" },
                      ]}
                    />
                  </Form.Item>
                </ColWithSixSpan>
              </Row>
            </ColWithSixteenSpan>
            <ColWithEightSpan>
              <Form.Item name="Remarks" label="Remarks">
                <TextArea style={{ width: "100%" }} rows={4} />
              </Form.Item>
            </ColWithEightSpan>
          </Row>
          <Row
            justify={"end"}
            gutter={32}
            style={{ paddingBottom: "1rem", borderBottom: "1px solid #E5E4E2" }}
          >
            <Col>
              <Button
                type="primary"
                htmlType="submit"
                size="middle"
                style={{
                  marginRight: "1rem",
                }}
              >
                {type ? 'Save' : 'Update'}
              </Button>
              <Button danger onClick={handleBackToList} size="middle">
                Cancel
              </Button>
            </Col>
          </Row>
          <div style={{ paddingBottom: "1rem" }}>
            <Collapse
              accordion
              ghost
              bordered={false}
              items={itemsUOM}
              defaultActiveKey={["1"]}
              className="showCreateEditDefinition"
            />
          </div>
        </Form>
        <Modal
          width={"60rem"}
          maskClosable={false}
          title="Delivery Schedule"
          open={isModalOpen}
          footer={false}
          onCancel={handleCloseModal}
        >
          <Form
            layout="vertical"
            form={form1}
            onFinish={async (value) => {
              debugger
              if (buttonTitle === 'Update') {
                const newData = UomData.map((item) => {
                  if (item.key === selectedRecord.key) {
                    return {
                      ...item,
                      AlternateUOMUnits: value.AlternateUOMUnit,
                      AlternateUOML: value.AUOMLabel,
                      AlternateUOM: value.AUOM,
                      EquivalentUOMUnits: value.EquivalentUOMUnit,
                      EquivalentUOML: value.EUOMLabel,
                      EquivalentUOM: value.EUOM
                    };
                  }
                  return item;
                });
                setUomData(newData);
              } else {
                setUomData([
                  ...UomData,
                  {
                    key: uuidv4(),
                    AlternateUOMUnits: value.AlternateUOMUnit,
                    AlternateUOML: value.AUOMLabel,
                    AlternateUOM: value.AUOM,
                    EquivalentUOMUnits: value.EquivalentUOMUnit,
                    EquivalentUOML: value.EUOMLabel,
                    EquivalentUOM: value.EUOM,
                    ActiveFlag: true,
                  },
                ]);
              }
              handleCloseModal()
            }}
          >
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item name='AlternateUOMUnit' label='Alternate UOM Unit'
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name='AUOM' label='UOM'
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Select
                    style={{ width: "100%" }}
                    options={apiData?.UOM?.map((option) => ({
                      value: option.UomId,
                      label: option.FullName,
                    }))}
                    onChange={(value, option) => {
                      form1.setFieldsValue({ AUOMLabel: option.label });
                    }}
                  />
                </Form.Item>
                <Form.Item name="AUOMLabel" hidden>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name='EquivalentUOMUnit' label='Equivalent UOM Unit'
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name='EUOM' label='UOM'
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Select
                    style={{ width: "100%" }}
                    options={apiData?.UOM?.map((option) => ({
                      value: option.UomId,
                      label: option.FullName,
                    }))}
                    onChange={(value, option) => {
                      form1.setFieldsValue({ EUOMLabel: option.label });
                    }}
                  />
                </Form.Item>
                <Form.Item name="EUOMLabel" hidden>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end" gutter={26} style={{ marginTop: '20px' }}>
              <Col>
                <Form.Item>
                  <Button type="primary" loading={loading} htmlType="submit">
                    {buttonTitle}
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button danger onClick={handleCloseModal}>
                    Cancel
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </Spin>
  );
}

export default ShowEditDefinition;
