import React, { useState } from "react";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import { Col, Form, Row, Select } from "antd";
import CustomTable from "../../../../components/customTable/index.jsx";
import { PlusCircleOutlined } from "@ant-design/icons";
import ServiceLocationModal from "./ServiceLocationModal.jsx";
import ProviderModal from "./ProviderModal.jsx";
import PatientTypeModal from "./PatientTypeModal.jsx";
import { ColWithEightSpan } from "../../../../components/customGridColumns/index.jsx";

function FacilityDepartmentServiceLocation() {
  const [form] = Form.useForm();
  const [currentRecord, setCurrentRecord] = useState(null);

  const [serviceLocationModal, setserviceLocationModal] = useState(false);
  const [providerModal, setproviderModal] = useState(false);
  const [patientTypeModal, setpatientTypeModal] = useState(false);

  const columns1 = [
    {
      title: "SL Code",
      dataIndex: "SlCode",
      key: "1",
    },
    {
      title: "SL Name",
      dataIndex: "SlName",
      key: "2",
    },
    {
      title: "SL Type",
      dataIndex: "SlType",
      key: "3",
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "4",
    },
  ];
  const tableData1 = [
    {
      SlCode: "GF",
      SlName: "Ground Floor",
      SlType: "Ward",
      Status: "Active",
    },
    {
      SlCode: "Emr",
      SlName: "Emergency",
      SlType: "Clinic",
      Status: "Hidden",
    },
  ];

  const columns2 = [
    {
      title: "Provider Name",
      dataIndex: "ProviderName",
      key: "1",
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "2",
    },
  ];
  const tableData2 = [
    {
      ProviderName: "OVENSERI IYEKEORETIN",
      Status: "Active",
    },
    {
      ProviderName: "CLEMENT IYAMU",
      Status: "Active",
    },
    {
      ProviderName: "OFURE OKHIALU",
      Status: "Active",
    },
  ];

  const columns3 = [
    {
      title: "Patient Type",
      dataIndex: "PatientType",
      key: "1",
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "2",
    },
  ];
  const tableData3 = [
    {
      PatientType: "Ambulatory Patient",
      Status: "Active",
    },
    {
      PatientType: "InPatient",
      Status: "Active",
    },
    {
      PatientType: "Day Care",
      Status: "Active",
    },
    {
      PatientType: "Emergency",
      Status: "Active",
    },
  ];

  //Service Location Modal Controls
  const handleServiceLocationEdit = (record) => {
    setCurrentRecord(record);
    setserviceLocationModal(true);
  };

  const handleAddServiceLocation = () => {
    setCurrentRecord(null);
    setserviceLocationModal(true);
  };
  const handleServiceLocationSubmit = (record) => {
    console.log(record);
    setserviceLocationModal(false);
  };

  //Provider Modal Controls
  const handleProviderEdit = (record) => {
    setCurrentRecord(record);
    setproviderModal(true);
  };

  const handleAddProvider = () => {
    setCurrentRecord(null);
    setproviderModal(true);
  };
  const handleProviderSubmit = (record) => {
    console.log(record);
    setproviderModal(false);
  };

  //Patient Type Modal Controls
  const handlePatientTypeEdit = (record) => {
    setCurrentRecord(record);
    setpatientTypeModal(true);
  };

  const handleAddPatientType = () => {
    setCurrentRecord(null);
    setpatientTypeModal(true);
  };
  const handlePatientTypeSubmit = (record) => {
    console.log(record);
    setpatientTypeModal(false);
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          backgroundColor: "white",
          minHeight: "max-content",
          borderRadius: "10px",
          paddingBottom: "1rem",
        }}
      >
        <PageHeader title={"Facility Department"} button={false} />
        <Form
          layout="vertical"
          style={{ margin: "1rem" }}
          form={form}
          onFinish={(values) => {
            console.log(values);
          }}
        >
          <Row gutter={16}>
            <ColWithEightSpan>
              <Form.Item name="FacilityName" label="Facility Name" required>
                <Select />
              </Form.Item>
            </ColWithEightSpan>
            <ColWithEightSpan>
              <Form.Item name="DepartmentName" label="Department Name" required>
                <Select />
              </Form.Item>
            </ColWithEightSpan>
          </Row>
        </Form>
        <Row gutter={24} style={{ margin: "0 0.5rem" }}>
          <ColWithEightSpan>
            <div
              style={{
                border: "1px solid #D3D3D3",
                borderRadius: "10px 10px 0 0",
                marginBottom: "1rem",
              }}
            >
              <PageHeader
                title={"Service Location (SL)"}
                buttonIcon={<PlusCircleOutlined />}
                onButtonClick={handleAddServiceLocation}
              />
              <CustomTable
                columns={columns1}
                dataSource={tableData1}
                onEdit={handleServiceLocationEdit}
              />
            </div>
          </ColWithEightSpan>
          <ColWithEightSpan>
            <div
              style={{
                border: "1px solid #D3D3D3",
                borderRadius: "10px 10px 0 0",
                marginBottom: "1rem",
              }}
            >
              <PageHeader
                title={"Provider"}
                buttonIcon={<PlusCircleOutlined />}
                onButtonClick={handleAddProvider}
              />
              <CustomTable
                columns={columns2}
                dataSource={tableData2}
                onEdit={handleProviderEdit}
              />
            </div>
          </ColWithEightSpan>
          <ColWithEightSpan>
            <div
              style={{
                border: "1px solid #D3D3D3",
                borderRadius: "10px 10px 0 0",
                marginBottom: "1rem",
              }}
            >
              <PageHeader
                title={"Patient Type"}
                buttonIcon={<PlusCircleOutlined />}
                onButtonClick={handleAddPatientType}
              />
              <CustomTable
                columns={columns3}
                dataSource={tableData3}
                onEdit={handlePatientTypeEdit}
              />
            </div>
          </ColWithEightSpan>
        </Row>
        <ServiceLocationModal
          open={serviceLocationModal}
          handleClose={() => {
            setserviceLocationModal(false);
          }}
          handleSubmit={handleServiceLocationSubmit}
          record={currentRecord}
        />
        <ProviderModal
          open={providerModal}
          handleClose={() => {
            setproviderModal(false);
          }}
          handleSubmit={handleProviderSubmit}
          record={currentRecord}
        />
        <PatientTypeModal
          open={patientTypeModal}
          handleClose={() => {
            setpatientTypeModal(false);
          }}
          handleSubmit={handlePatientTypeSubmit}
          record={currentRecord}
        />
      </div>
    </>
  );
}

export default FacilityDepartmentServiceLocation;
