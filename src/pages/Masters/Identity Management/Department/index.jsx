import React, { useState } from "react";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import CustomTable from "../../../../components/customTable/index.jsx";
import { useNavigate } from "react-router-dom";
import { PlusCircleOutlined } from "@ant-design/icons";
import CreateEditDepartmentModal from "./CreateEditDepartmentModal.jsx";

function Department() {
  const [departmentModal, setDepartmentModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const columns = [
    {
      title: "Sl No",
      dataIndex: "SlNo",
      key: "1",
      width: 100,
    },
    {
      title: "Department Name",
      dataIndex: "DepartmentName",
      key: "2",
    },
    {
      title: "Department Code",
      dataIndex: "DepartmentCode",
      key: "3",
    },
  ];

  const tableData = [
    {
      SlNo: 1,
      DepartmentName: "Accident & Emergency (A&E)",
      DepartmentCode: "AE",
    },
    {
      SlNo: 2,
      DepartmentName: "Accounting & Finance",
      DepartmentCode: "AF",
    },
    {
      SlNo: 3,
      DepartmentName: "Blood Bank",
      DepartmentCode: "BLB",
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
        <PageHeader
          title={"Department Manager"}
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
        <CreateEditDepartmentModal
          open={departmentModal}
          handleClose={() => {
            setDepartmentModal(false);
          }}
          handleSubmit={handleSubmit}
          record={currentRecord}
        />
      </div>
    </>
  );
}

export default Department;
