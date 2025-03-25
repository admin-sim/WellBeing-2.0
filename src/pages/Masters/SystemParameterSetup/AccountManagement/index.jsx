import React, { useEffect, useState } from "react";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import CustomTable from "../../../../components/customTable/index.jsx";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import { Button, Select, Input, Form, Row, Col, message, Spin } from "antd";
import {
  urlGetAllParameter,
  urlGetParameterSetupForFacility,
  urlUpdateParameterSetup,
  urlGetParameterSetupBasedOnId,
} from "../../../../../endpoints";
import EditParameterSetupModal from "./EditParameterSetupModal.jsx";
const { Option } = Select;

function AccountManagement() {
  const [editParameterSetupModal, setEditParameterSetupModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [facilities2, setFacilities2] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const response = await customAxios.get(
        `${urlGetAllParameter}?ParameterValueid=${142}`
      );
      setFacilities(response.data.data.Facilities);
      setFacilities2(response.data.data.ParameterValueid);
    } catch (error) {
      message.error("Failed to fetch facilities.");
    }
  };

  const handleFacilityChange = async (value) => {
    setSelectedFacility(value);
    setLoading(true);

    try {
      debugger;
      const response = await customAxios.get(
        `${urlGetParameterSetupForFacility}?FacilityId=${value}&ParameterValueid=${142}`
      );
      if (response.data) {
        const tableData = response.data.data.SystemSetupModel.map(
          (item, index) => ({
            key: index + 1,
            ...item,
          })
        );

        setTableData(tableData);
      }
    } catch (error) {
      console.error("Error fetching clinical setup:", error);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "SL. No",
      dataIndex: "key",
      key: "slNo",
      width: 80,
      sorter: (a, b) => a.slNo - b.slNo,
    },
    {
      title: "Parameter Name",
      dataIndex: "ParameterName",
      key: "parameterName",
      sorter: (a, b) => a.parameterName.localeCompare(b.parameterName),
    },
    {
      title: "Parameter Value",
      dataIndex: "ParameterValueName",
      key: "parameterValue",
    },
  ];

  const handleEdit = async (record) => {
    try {
      const response = await customAxios.get(
        `${urlGetParameterSetupBasedOnId}?ParameterId=${
          record.ParameterId || 0
        }`
      );
      if (response?.data) {
        setCurrentRecord(response.data.data.NewSystemSetupModel);
        setEditParameterSetupModal(true);
      } else {
        message.error("Failed to fetch parameter details.");
      }
    } catch (error) {
      console.error("Error fetching parameter details:", error);
      message.error("An error occurred while fetching the data.");
    }
  };

  const handleSubmit = async (record) => {
    try {
      debugger;
      const request = {
        ParameterId: record.ParameterId,
        FacilityId: record.FacilityId,
        ParameterName: record.ParameterName,
        ParameterValueId: record.ParameterValueId,
        ParameterValueName: record.ParameterValue,
      };

      const response = await customAxios.post(
        `${urlUpdateParameterSetup}`,
        request,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        if (response.data) {
          message.success(response.data.message);
          setEditParameterSetupModal(false);

          handleFacilityChange(response.data.data[0].facilityId);
        } else {
          message.error("Failed to save frequency");
          setEditParameterSetupModal(false);
          setTableData([]);
        }
      }
    } catch (error) {
      console.error("Failed to submit frequency:", error);
      message.error("Failed to save frequency");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "white",
        minHeight: "max-content",
        borderRadius: "10px",
        padding: "16px",
      }}
    >
      <PageHeader title="Parameter Setup" button={false} />

      <Row gutter={[16, 16]} style={{ marginBottom: "4px" , marginTop: "16px" }}>
        <Col span={24}>
          <label style={{ fontWeight: "bold" }}>Facility</label>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
        <Col span={8}>
          <Form.Item>
            <Select
              placeholder="Select Facility"
              onChange={handleFacilityChange}
              style={{ width: "100%" }}
            >
              {facilities.length > 0 ? (
                facilities.map((facility) => (
                  <Select.Option
                    key={facility.FacilityId}
                    value={facility.FacilityId}
                  >
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

      {selectedFacility ? (
        loading ? (
          <Spin
            size="large"
            style={{ display: "block", textAlign: "center", marginTop: "20px" }}
          />
        ) : (
          <CustomTable
            dataSource={tableData}
            columns={columns}
            rowKey="ParameterId"
            loading={loading}
            pagination={false}
            isFilter={true}
            onEdit={handleEdit}
          />
        )
      ) : (
        <p style={{ textAlign: "center", color: "#888" }}>
          {/* Please select a facility to view parameters. */}
        </p>
      )}
      <EditParameterSetupModal
        open={editParameterSetupModal}
        handleClose={() => {
          setEditParameterSetupModal(false);
        }}
        handleSubmit={handleSubmit}
        record={currentRecord}
      />
    </div>
  );
}

export default AccountManagement;
