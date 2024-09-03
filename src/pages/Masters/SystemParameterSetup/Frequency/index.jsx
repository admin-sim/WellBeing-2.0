import React, { useState } from "react";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import CustomTable from "../../../../components/customTable/index.jsx";
import { PlusCircleOutlined } from "@ant-design/icons";
import AddEditFrequencyModal from "./AddEditFrequencyModal.jsx";

function Frequency() {
  const [addEditFrequencyModal, setAddEditFrequencyModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const columns = [
    {
      title: "Sl No",
      dataIndex: "SlNo",
      key: "1",
      width: 80,
    },
    {
      title: "Frequency",
      dataIndex: "Frequency",
      key: "2",
      width: 120,
    },
    {
      title: "Count",
      dataIndex: "Count",
      key: "3",
      width: 80,
    },
    {
      title: "Local Language",
      dataIndex: "LocalLanguage",
      key: "4",
      width: 150,
    },
  ];

  const tableData = [
    {
      SlNo: 1,
      Frequency: "1-0-1",
      Count: "2",
      LocalLanguage: "Morning and Night",
    },
    {
      SlNo: 2,
      Frequency: "1-0-0",
      Count: "1",
      LocalLanguage: "Morning",
    },
  ];

  const handleEdit = (record) => {
    setCurrentRecord(record);
    setAddEditFrequencyModal(true);
  };

  const handleAddNewFrequency = () => {
    setCurrentRecord(null);
    setAddEditFrequencyModal(true);
  };

  const handleDelete = (record) => {
    console.log(record);
  };
  const handleSubmit = (record) => {
    console.log(record);
    setAddEditFrequencyModal(false);
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
          title={"Frequency Master"}
          buttonLabel="Add"
          buttonIcon={<PlusCircleOutlined />}
          onButtonClick={handleAddNewFrequency}
        />
        <CustomTable
          isFilter={true}
          columns={columns}
          dataSource={tableData}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <AddEditFrequencyModal
          open={addEditFrequencyModal}
          handleClose={() => {
            setAddEditFrequencyModal(false);
          }}
          handleSubmit={handleSubmit}
          record={currentRecord}
        />
      </div>
    </>
  );
}

export default Frequency;
