import React, { useState } from "react";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import CustomTable from "../../../../components/customTable/index.jsx";
import { useNavigate } from "react-router-dom";
import { PlusCircleOutlined } from "@ant-design/icons";
import CreateWardModal from "../Ward/CreateWardModal.jsx";

function Bed() {
  const [createWardModal, setCreateWardModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const navigate = useNavigate();

  const columns = [
    {
      title: "Sl No",
      dataIndex: "SlNo",
      key: "1",
    },
    {
      title: "Service Location",
      dataIndex: "ServiceLocation",
      key: "2",
    },
    {
      title: "Ward",
      dataIndex: "Ward",
      key: "3",
    },
    {
      title: "Bed",
      dataIndex: "Bed",
      key: "4",
    },
  ];

  const tableData = [
    {
      SlNo: 1,
      ServiceLocation: "First Floor",
      Ward: "Emergency Ward Ground Floor",
      Bed: "EWGF1 ,EWGF2 ,EWGF3 ,EWGF4 ,EWGF5",
    },

    {
      SlNo: 2,
      ServiceLocation: "First Floor",
      Ward: "Female Ward First Floor",
      Bed: "FWFF1 ,FWFF2 ,FWFF3 ,FWFF4",
    },

    {
      SlNo: 3,
      ServiceLocation: "First Floor",
      Ward: "Male Ward First Floor",
      Bed: "MWFF1 ,MWFF2 ,MWFF3 ,MWFF4 ,MWFF5 ,MWFF6 ,MWFF7",
    },
  ];

  const handleEdit = (record) => {
    setCurrentRecord(record);
    navigate("EditBed", { state: record });
  };

  const handleAddNewBed = () => {
    navigate("CreateBed");
    setCurrentRecord(null);
  };

  const handleDelete = (record) => {
    console.log(record);
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
          title={"Bed"}
          buttonLabel="Add New Bed"
          buttonIcon={<PlusCircleOutlined />}
          onButtonClick={handleAddNewBed}
        />
        <CustomTable
          isFilter={true}
          columns={columns}
          dataSource={tableData}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}

export default Bed;
