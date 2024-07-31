import React, { useState } from "react";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import CustomTable from "../../../../components/customTable/index.jsx";
import { useNavigate } from "react-router-dom";
import { PlusCircleOutlined } from "@ant-design/icons";

function WorkflowManager() {
  const [currentRecord, setCurrentRecord] = useState(null);
  const navigate = useNavigate();

  const columns = [
    {
      title: "Sl No",
      dataIndex: "SlNo",
      key: "1",
    },
    {
      title: "Facility Name",
      dataIndex: "FacilityName",
      key: "2",
    },
    {
      title: "WorkFlow Name",
      dataIndex: "WorkFlowName",
      key: "3",
    },
    {
      title: "WorkFlow Description",
      dataIndex: "WorkFlowDescription",
      key: "4",
    },
  ];

  const tableData = [
    {
      SlNo: 1,
      FacilityName: "Smiles Healthcare Inc.",
      WorkFlowName: "Patient Revisit",
      WorkFlowDescription: "Patient Revisit",
    },
    {
      SlNo: 2,
      FacilityName: "Smiles Healthcare Inc.",
      WorkFlowName: "New Patient",
      WorkFlowDescription: "New Patient",
    },
  ];

  const handleEdit = (record) => {
    setCurrentRecord(record);
    navigate("CreateEditWorkFlow", { state: record });
  };

  const handleAddNewWorkflow = () => {
    setCurrentRecord(null);
    navigate("CreateEditWorkFlow");
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
          title={"Workflow Manager"}
          buttonLabel="Create Workflow"
          buttonIcon={<PlusCircleOutlined />}
          onButtonClick={handleAddNewWorkflow}
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

export default WorkflowManager;
