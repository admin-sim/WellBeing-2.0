import React, { useState } from "react";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Col, Form, Row, Select } from "antd";
import Title from "antd/es/typography/Title.js";
import CustomTable from "../../../../components/customTable/index.jsx";
import CreateEditFacilityDepartmentModal from "./CreateEditFacilityDepartmentModal.jsx";
import { ColWithTwelveSpan } from "../../../../components/customGridColumns/index.jsx";

function FacilityDepartment() {
  const [form] = Form.useForm();
  const [departmentModal, setDepartmentModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const columns = [
    {
      title: "Sl No",
      dataIndex: "SlNo",
      key: "1",
      width: 80,
    },
    {
      title: "Department Name",
      dataIndex: "DepartmentName",
      key: "2",
      width: 250,
    },
    {
      title: "Department Code",
      dataIndex: "DepartmentCode",
      key: "3",
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "4",
      width: 100,
    },
  ];

  const tableData = [
    {
      SlNo: 1,
      DepartmentName: "Accident & Emergency (A&E)",
      DepartmentCode: "AE",
      Status: "Active",
    },
    {
      SlNo: 2,
      DepartmentName: "Accounting & Finance",
      DepartmentCode: "AF",
      Status: "Active",
    },
    {
      SlNo: 3,
      DepartmentName: "Blood Bank",
      DepartmentCode: "BLB",
      Status: "Active",
    },
  ];

  const handleEdit = (record) => {
    setCurrentRecord(record);
    setDepartmentModal(true);
  };

  const handleAddNewDepartment = () => {
    setCurrentRecord(null);
    setDepartmentModal(true);
  };

  const handleDelete = (record) => {
    console.log(record);
  };
  const handleSubmit = (record) => {
    console.log(record);
    setDepartmentModal(false);
  };
  return (
    <>
      <div
        style={{
          width: "100%",
          backgroundColor: "white",
          minHeight: "max-content",
          borderRadius: "10px",
        }}
      >
        <PageHeader title={"Facility Department"} button={false} />
        <Form
          style={{ margin: "1rem" }}
          form={form}
          onFinish={(values) => {
            console.log(values);
          }}
        >
          <Row gutter={16}>
            <ColWithTwelveSpan>
              <Form.Item name="FacilityName" label="Facility Name" required>
                <Select />
              </Form.Item>
            </ColWithTwelveSpan>
          </Row>
        </Form>
        <div style={{ margin: "0 1rem" }}>
          <PageHeader
            title={"Department"}
            buttonLabel="Add New Department"
            buttonIcon={<PlusCircleOutlined />}
            onButtonClick={handleAddNewDepartment}
          />
          <CustomTable
            isFilter={true}
            columns={columns}
            dataSource={tableData}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <CreateEditFacilityDepartmentModal
            open={departmentModal}
            handleClose={() => {
              setDepartmentModal(false);
            }}
            handleSubmit={handleSubmit}
            record={currentRecord}
          />
        </div>
      </div>
    </>
  );
}

export default FacilityDepartment;
