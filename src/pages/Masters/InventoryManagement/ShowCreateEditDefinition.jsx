import React, { useEffect, useState } from "react";
import { urlShowCreateDefinition } from "../../../../endpoints.js";
import customAxios from "../../../components/customAxios/customAxios.jsx";
import "./showCreateEditDefinition.css";
import {
  Button,
  Checkbox,
  Col,
  Collapse,
  ConfigProvider,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Spin,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/PageHeader/index.jsx";
import { IoArrowBackOutline } from "react-icons/io5";
import { LeftOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form.js";
import TextArea from "antd/es/input/TextArea.js";
import { IoMdAddCircle, IoMdAddCircleOutline } from "react-icons/io";
import CustomTable from "../../../components/customTable/index.jsx";

function ShowEditDefinition() {
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState();
  const location = useLocation();
  const navigate = useNavigate();
  const record = location.state.record;
  const [form] = useForm();

  useEffect(() => {
    try {
      setLoading(true);
      customAxios
        .get(
          `${urlShowCreateDefinition}?ProductGroup=${record?.ProductGroupId}&Classification=${record?.ProductDefinitionId}`
        )
        .then((response) => {
          const apiData = response.data.data;
          setApiData(apiData);
          console.log(apiData);
        });
    } catch (error) {
      console.error("Error fetching Product Definitiondetails:", error);
    }
    setLoading(false);
  }, []);

  const handleBackToList = () => {
    console.log("back");
    navigate("/ProductDefinition");
  };

  const UOMColumns = [
    {
      title: "Alternate UOM Units",
      dataIndex: "AlternateUOMUnits",
      key: "1",
    },
    {
      title: "Alternate UOM",
      dataIndex: "AlternateUOM",
      key: "2",
    },
    {
      title: "Equivalent UOM Units",
      dataIndex: "EquivalentUOMUnits",
      key: "3",
    },
    {
      title: "Equivalent UOM",
      dataIndex: "EquivalentUOM",
      key: "4",
    },
  ];

  const AgeGenderRestrictionColumns = [
    {
      title: "Gender",
      dataIndex: "Gender",
      key: "1",
    },
    {
      title: "Start Age",
      dataIndex: "StartAge",
      key: "2",
    },
    {
      title: "Age Unit",
      dataIndex: "AgeUnit",
      key: "3",
    },
    {
      title: "End Age",
      dataIndex: "EndAge",
      key: "4",
    },
    {
      title: "Age Unit",
      dataIndex: "AgeUnit",
      key: "5",
    },
  ];

  const itemsUOM = [
    {
      key: "1",
      label: <span style={{ fontSize: "1rem", fontWeight: 600 }}>UOM</span>,
      children: (
        <div style={{ borderBottom: "1px solid silver" }}>
          <Row gutter={32}>
            <Col span={6}>
              <Form.Item
                name="PrimaryUOM"
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
            </Col>
            <Col span={6}>
              <Form.Item name="decimalPlaces" label="Decimal Places">
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <CustomTable
            columns={UOMColumns}
            dataSource={null}
            actionColumn={false}
          />
        </div>
      ),
      extra: (
        <Button
          onClick={() => alert("UOM icon Clicked")}
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
          <Row gutter={32}>
            <Col offset={1} span={7}>
              <Form.Item name="Chargeable" label=" ">
                <Checkbox valuePropName="checked" checked>
                  Is Chargeable
                </Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="IsProviderMandatory" label=" ">
                <Checkbox valuePropName="checked" checked>
                  Is Provider Mandatory
                </Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="pricingMethod"
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
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: "3",
      label: <span style={{ fontSize: "1rem", fontWeight: 600 }}>Stock</span>,
      children: (
        <div style={{ borderBottom: "1px solid silver" }}>
          <Row gutter={32}>
            <Col span={6}>
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
            </Col>
            <Col span={6}>
              <Form.Item name="DrugForm" label="Drug Form">
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="MinimumStockDays" label="Minimum Stock Days">
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="MinimumStock" label="Minimum Stock">
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="LeadTime" label="Lead Time">
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item name="reorderLevel" label="Reorder Level">
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="reorderQuantity" label="Reorder Quantity">
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="MaximumStock" label="Maximum Stock">
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                name="BarcodeApplicability"
                label="Barcode Applicability"
                initialValue="N/A"
              >
                <Select
                  style={{ width: "100%" }}
                  options={[
                    { value: "N/A", label: "Not Applicable" },
                    {
                      value: "Manufacturer Barcode",
                      label: "Manufacturer Barcode",
                    },
                    { value: "Hosital Barcode", label: "Hosital Barcode" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="DefaultPrice" label="Default Price">
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="minShelfLife" label="Minimum Shelf Life in Days">
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name=" IsConsumptionAllowed" label=" ">
                <Checkbox valuePropName="checked" checked>
                  Is Consumption Allowed
                </Checkbox>
              </Form.Item>
            </Col>
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
            <Col offset={1} span={7}>
              <Form.Item name="Orderable" label=" ">
                <Checkbox valuePropName="checked" checked>
                  Is Orderable
                </Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="IntervalApplicable" label=" ">
                <Checkbox valuePropName="checked" checked>
                  {" "}
                  Is Interval Applicable
                </Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="QuantityApplicable" label=" ">
                <Checkbox valuePropName="checked" checked>
                  {" "}
                  Is Quantity Applicable
                </Checkbox>
              </Form.Item>
            </Col>
            <Divider style={{ margin: "0" }} orientation="left">
              Default Dosage
            </Divider>
            <Col span={6}>
              <Form.Item name="Duration" label="Duration">
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="uom" label="UOM">
                <Select
                  style={{ width: "100%" }}
                  options={apiData?.UOM?.map((option) => ({
                    value: option.UomId,
                    label: option.FullName,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="DefaultFrequency" label="Default Frequency">
                <Select
                  style={{ width: "100%" }}
                  options={apiData?.DefaultFrequency?.map((option) => ({
                    value: option.LookupID,
                    label: option.LookupDescription,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="Route" label="Route">
                <Select
                  style={{ width: "100%" }}
                  options={apiData?.Route?.map((option) => ({
                    value: option.LookupID,
                    label: option.LookupDescription,
                  }))}
                />
              </Form.Item>
            </Col>
            <Divider style={{ margin: "0" }} orientation="left">
              Applicable Patient Type
            </Divider>
            <Col offset={1} span={5}>
              <Form.Item name="Emergency" label=" ">
                <Checkbox valuePropName="checked">Emergency Patient</Checkbox>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="Patient" label=" ">
                <Checkbox valuePropName="checked">In Patient</Checkbox>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="Ambulatory" label=" ">
                <Checkbox valuePropName="checked">Ambulatory Patient</Checkbox>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="ShortStay" label=" ">
                <Checkbox valuePropName="checked">Short Stay Patient</Checkbox>
              </Form.Item>
            </Col>
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
            borderBottom: "1px solid grey",
          }}
        >
          <Col span={12}>
            <p>
              Product Group : <strong>{record?.ProductGroup}</strong>
            </p>
          </Col>
          <Col span={12}>
            <p>
              Product Classification :{" "}
              <strong>{record?.ProductClassification}</strong>
            </p>
          </Col>
        </Row>
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            console.log("Submit Values", values);
          }}
          style={{ margin: "1rem" }}
        >
          <Row gutter={32}>
            <Col span={16}>
              <Row gutter={32}>
                <Col span={6}>
                  <Form.Item
                    name="HSN"
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
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="shortName"
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
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="long Name"
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
                </Col>
                <Col span={12}>
                  <Form.Item name="Manufacturer" label="Manufacturer">
                    <Select
                      style={{ width: "100%" }}
                      options={apiData?.Manufacturer?.map((option) => ({
                        value: option.VendorId,
                        label: option.LongName,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
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
                </Col>

                <Col span={6}>
                  <Form.Item name="isAtomic" label=" ">
                    <Checkbox
                      valuePropName="checked"
                      checked
                      style={{ width: "100%" }}
                    >
                      is Atomic
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col span={6}>
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
                </Col>
                <Col span={6}>
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
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="Status"
                    label="Status"
                    initialValue="Active"
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
                        { value: "Active", label: "Active" },
                        { value: "Hidden", label: "Hidden" },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <Form.Item name="Remarks" label="Remarks">
                <TextArea style={{ width: "100%" }} rows={4} />
              </Form.Item>
            </Col>
          </Row>
          <Row
            justify={"end"}
            gutter={32}
            style={{ paddingBottom: "1rem", borderBottom: "1px solid grey" }}
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
                Save
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
              className="showCreateEditDefinition"
            />
          </div>
        </Form>
      </div>
    </Spin>
  );
}

export default ShowEditDefinition;
