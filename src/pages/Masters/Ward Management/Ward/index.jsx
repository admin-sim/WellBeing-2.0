import React, { useState } from "react";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import CustomTable from "../../../../components/customTable/index.jsx";
import { useNavigate } from "react-router-dom";
import { PlusCircleOutlined } from "@ant-design/icons";
import CreateWardModal from "./CreateWardModal.jsx";

function Ward() {
  const [createWardModal, setCreateWardModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const columns = [
    {
      title: "Sl No",
      dataIndex: "SlNo",
      key: "1",
    },
    {
      title: "Ward Code",
      dataIndex: "WardCode",
      key: "2",
    },
    {
      title: "Ward Name",
      dataIndex: "WardName",
      key: "3",
    },
    {
      title: "Ward Category",
      dataIndex: "WardCategory",
      key: "4",
    },
    {
      title: "Service Location",
      dataIndex: "ServiceLocation",
      key: "5",
    },
    {
      title: "Gender",
      dataIndex: "Gender",
      key: "6",
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "7",
    },
  ];

  const tableData = [
    {
      SlNo: 1,
      WardCode: "EWGF",
      WardName: "Emergency Ward Ground Floor",
      WardCategory: "Emergency Ward",
      ServiceLocation: "Ground Floor",
      Gender: "Both",
      Status: "Active",
    },
    {
      SlNo: 2,
      WardCode: "FSWFF",
      WardName: "Female Surgical Ward First Floor",
      WardCategory: "Surgical Ward",
      ServiceLocation: "First Floor",
      Gender: "Both",
      Status: "Active",
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
          title={"Ward"}
          buttonLabel="Add New Ward"
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
        <CreateWardModal
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

export default Ward;
