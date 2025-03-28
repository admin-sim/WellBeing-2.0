import React, { useEffect, useState } from "react";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import CustomTable from "../../../../components/customTable/index.jsx";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import { Button, Select, Input, Form, Row, Col, Checkbox, message } from "antd";
import { urlGetAllFrequency, urlGetClinicalSetupForFacility, urlSavePath } from "../../../../../endpoints";

const ClinicalSetup = () => {
  const [loading, setLoading] = useState(false);
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [clinicalSetupData, setClinicalSetupData] = useState([]);
  const [storeModel, setStoreModel] = useState([]); // Store list
  const [form] = Form.useForm();

  useEffect(() => {
    fetchFacilities();
  }, []);

  // Fetch all facilities
  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const response = await customAxios.get(urlGetAllFrequency);
      if (response.data && Array.isArray(response.data.data.Facilities)) {
        setFacilities(response.data.data.Facilities);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching facilities:", error);
      setLoading(false);
    }
  };

  const handleFacilityChange = async (value) => {
    setSelectedFacility(value);
    setLoading(true);
    try {
      debugger;
      const response = await customAxios.get(`${urlGetClinicalSetupForFacility}?FacilityId=${value}`);
      if (response.data) {
        const tableData = response.data.data.ClinicalSetupModel.map((item, index) => ({
          key: index + 1,
          ...item,
        }));

        const filteredStoreModel = (response.data.data.StoreModel || [])
          .filter((store) => store.StoreId === 2)
          .map((store) => ({
            StoreId: store.StoreId,
            LongName: store.LongName,
          }));
        form.setFieldsValue({ 'StoreId': 2 })
        setClinicalSetupData(tableData);
        setStoreModel(filteredStoreModel);

        setClinicalSetupData(tableData);
        setStoreModel(filteredStoreModel);
      }
    } catch (error) {
      console.error("Error fetching clinical setup:", error);
      setClinicalSetupData([]);
    } finally {
      setLoading(false);
    }
  };


  const handleSave = async (record) => {
    debugger
    const requestData = {
      FacilityId: record.FacilityId,
      ParameterId: record.ParameterId,
      ParameterName: record.ParameterName,
      ScannedFilePath: record.ScannedFilePath || "",
      FromList: record.FromList || false,
    };

    try {
      const response = await customAxios.post(`${urlSavePath}`, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data) {
        message.success("Save successful");
      }
    } catch (error) {
      console.error("Error saving clinical setup:", error);
      message.error("Failed to save");
    }
  };

  const handleCheckboxChange = (checked, recordKey) => {
    setClinicalSetupData((prevData) =>
      prevData.map((item) =>
        item.key === recordKey ? { ...item, FromList: checked } : item
      )
    );
  };

  const handleDropdownChange = (value, recordKey) => {
    setClinicalSetupData((prevData) =>
      prevData.map((item) =>
        item.key === recordKey ? { ...item, ScannedFilePath: value } : item
      )
    );
  };

  const columns = [
    {
      title: "Sl. No",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Parameter Value",
      dataIndex: "ParameterName",
      key: "ParameterName",
    },
    {
      title: "Parameter Value",
      key: "ParameterValue",
      render: (text, record) => (
        <div className="d-flex flex-column">
          {record.ParameterName === "Default Pharmacy" ? (
            <>
              <Select
                className="w-100 mb-2"
                value={
                  storeModel.some(
                    (store) => store.StoreId === record.ScannedFilePath
                  )
                    ? record.ScannedFilePath
                    : ""
                } // Ensure the value is a valid StoreId
                onChange={(value) => handleDropdownChange(value, record.key)}
              >
               
                {storeModel.map((store) => (
                  <Select.Option key={store.StoreId} value={store.StoreId}>
                    {store.LongName}
                  </Select.Option>
                ))}
              </Select>

              <Checkbox
                checked={record.FromList === true} // Ensure only true values are checked
                onChange={(e) =>
                  handleCheckboxChange(e.target.checked, record.key)
                }
              >
                List all items from Product Definition
              </Checkbox>
            </>
          ) : record.ParameterName === "Dual Screen" ? (
            <Checkbox
              checked={record.FromList === true} // Ensure only true values are checked
              onChange={(e) =>
                handleCheckboxChange(e.target.checked, record.key)
              }
            >
              Disable Pharmacy/Billing
            </Checkbox>
          ) : (
            <Input
              placeholder="Exp=> D:\my-folder\"
              defaultValue={record.ScannedFilePath}
            />
          )}
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      align: "center",
      render: (text, record) => (
        <Button type="primary" onClick={() => handleSave(record)}>
          Save
        </Button>
      ),
    },
  ];


  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "white",
        minHeight: "max-content",
        borderRadius: "10px",
      }}
    >
      <PageHeader title="Clinical Setup" button={false} />
      <Form layout="vertical" form={form}>
        <Row gutter={16} style={{ marginTop: "10px" }}>
          <Col span={8}>
            <Form.Item label="Facility " style={{ marginLeft: "20px", fontWeight: "bold" }}>
              <Select
                placeholder="Select Facility"
                onChange={handleFacilityChange}
                className="w-100"
              >
                {facilities.length > 0 ? (
                  facilities.map((facility) => (
                    <Select.Option key={facility.FacilityId} value={facility.FacilityId}>
                      {facility.FacilityName}
                    </Select.Option>
                  ))
                ) : (
                  <Select.Option disabled>No Facilities Available</Select.Option>
                )}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        {clinicalSetupData.length > 0 && (
          <CustomTable
            dataSource={clinicalSetupData}
            columns={columns}
            rowKey="ParameterId"
            loading={loading}
            pagination={false}
            actionColumn={false}
            isFilter={true}
          />
        )}
      </Form>
    </div>
  );

};

export default ClinicalSetup;
