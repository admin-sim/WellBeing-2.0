import React, { useState } from "react";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import CustomTable from "../../../../components/customTable/index.jsx";
import { PlusCircleOutlined } from "@ant-design/icons";
import AddNewConfiguration from "./AddNewConfigurationModal.jsx";

function Configuration() {
  const [createWardModal, setCreateWardModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const columns = [
    {
      title: "Sl No",
      dataIndex: "SlNo",
      key: "1",
      width: 80,
    },
    {
      title: "Facility Name",
      dataIndex: "FacilityName",
      key: "2",
      width: 180,
    },
    {
      title: "Prefix",
      dataIndex: "Prefix",
      key: "3",
      width: 80,
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "4",
      width: 120,
    },
    {
      title: "Suffix",
      dataIndex: "Suffix",
      key: "5",
      width: 80,
    },
    {
      title: "Initial Value",
      dataIndex: "InitialValue",
      key: "6",
      width: 120,
    },
    {
      title: "Increment Value",
      dataIndex: "IncrementValue",
      key: "7",
      width: 120,
    },
  ];

  const tableData = [
    {
      SlNo: 1,
      FacilityName: "Smiles Healthcare Inc.",
      Prefix: "COH/OP",
      Description: "Out Patient",
      Suffix: " ",
      InitialValue: "440",
      IncrementValue: "1",
    },
    {
      SlNo: 2,
      FacilityName: "Smiles Healthcare Inc.",
      Prefix: "COH/IP",
      Description: "In Patient",
      Suffix: " ",
      InitialValue: "139",
      IncrementValue: "1",
    },
    {
      SlNo: 3,
      FacilityName: "Smiles Healthcare Inc.",
      Prefix: "COH/AP",
      Description: "Appointment",
      Suffix: " ",
      InitialValue: "86",
      IncrementValue: "1",
    },
  ];

  const handleEdit = (record) => {
    setCurrentRecord(record);
    setCreateWardModal(true);
  };

  const handleAddNewDepartment = () => {
    setCurrentRecord(null);
    setCreateWardModal(true);
  };

  const handleDelete = (record) => {
    console.log(record);
  };
  const handleSubmit = (record) => {
    console.log(record);
    setCreateWardModal(false);
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
        <PageHeader
          title={"Configuration Management"}
          buttonLabel="Add"
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
        <AddNewConfiguration
          open={createWardModal}
          handleClose={() => {
            setCreateWardModal(false);
          }}
          handleSubmit={handleSubmit}
          record={currentRecord}
        />
      </div>
    </>
  );
}

export default Configuration;
