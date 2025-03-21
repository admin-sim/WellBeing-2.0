import React, { useEffect, useState } from "react";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import CustomTable from "../../../../components/customTable/index.jsx";
import { useNavigate } from "react-router-dom";
import { PlusCircleOutlined } from "@ant-design/icons";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import { urlDeleteSelectedWorkFlow, urlWorkFlowIndex } from "../../../../../endpoints.js";
import { message } from "antd";

function WorkflowManager() {
  const [currentRecord, setCurrentRecord] = useState(null);
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch();
  }, [])

  async function fetch() {
    setLoading(true)
    try {
      const response = await customAxios.get(urlWorkFlowIndex)
      const data = response.data.data.WorkFlowModel.map((i, index) => {
        return {
          ...i,
          key: index + 1
        }
      })
      setTableData(data)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch:", error);
    }
  }

  const columns = [
    {
      title: "Sl No",
      dataIndex: "key",
      key: "1",
      width: 80,
    },
    {
      title: "Facility Name",
      dataIndex: "FacilityName",
      key: "2",
      width: 200,
    },
    {
      title: "WorkFlow Name",
      dataIndex: "WorkFlowName",
      key: "3",
      width: 150,
    },
    {
      title: "WorkFlow Description",
      dataIndex: "WorkFlowDescription",
      key: "4",
      width: 200,
    },
  ];

  // const tableData = [
  //   {
  //     SlNo: 1,
  //     FacilityName: "Smiles Healthcare Inc.",
  //     WorkFlowName: "Patient Revisit",
  //     WorkFlowDescription: "Patient Revisit",
  //   },
  //   {
  //     SlNo: 2,
  //     FacilityName: "Smiles Healthcare Inc.",
  //     WorkFlowName: "New Patient",
  //     WorkFlowDescription: "New Patient",
  //   },
  // ];

  const handleEdit = (record) => {
    setCurrentRecord(record);
    navigate("CreateEditWorkFlow", { state: record });
  };

  const handleAddNewWorkflow = () => {
    setCurrentRecord(null);
    navigate("CreateEditWorkFlow");
  };

  const handleDelete = async (record) => {
    debugger
    setLoading(true)
    try {
      const response = await customAxios.get(`${urlDeleteSelectedWorkFlow}?WorkFlowId=${record.WorkFlowId}`)
      if (response.status === 200) {
        if (response.data.data === 'Success') {
          message.success('Deleted Successfully')
        } else {
          message.error('Delete Failure')
        }
      }
      fetch()
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch:", error);
      setLoading(false)
    }
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
        <CustomTable loading={loading}
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
