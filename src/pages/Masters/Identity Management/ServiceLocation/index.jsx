import React, { useState } from "react";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import CustomTable from "../../../../components/customTable/index.jsx";

import { PlusCircleOutlined } from "@ant-design/icons";
import CreateEditServiceLocationModal from "./CreateEditServiceLocationModal.jsx";

function ServiceLocation() {
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
      title: "Service Location Name",
      dataIndex: "ServiceLocationName",
      key: "2",
    },
    {
      title: "Service Location Code",
      dataIndex: "ServiceLocationCode",
      key: "3",
    },

    {
      title: "Service Location Type",
      dataIndex: "ServiceLocationType",
      key: "4",
    },
  ];

  const tableData = [
    {
      SlNo: 1,
      ServiceLocationName: "X-Ray",
      ServiceLocationCode: "X-Ray",
      ServiceLocationType: "Clinic",
    },
    {
      SlNo: 2,
      ServiceLocationName: "Radiology & Ultrasound Scan",
      ServiceLocationCode: "RAD&U",
      ServiceLocationType: "Ward",
    },
    {
      SlNo: 3,
      ServiceLocationName: "Laboratory",
      ServiceLocationCode: "LAB",
      ServiceLocationType: "Clinic",
    },
    {
      SlNo: 4,
      ServiceLocationName: "Antenatal Clinic(ANC)",
      ServiceLocationCode: "ANC",
      ServiceLocationType: "Clinic",
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
          title={"Service Location Manager"}
          buttonLabel="Add New Service Location"
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
        <CreateEditServiceLocationModal
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

export default ServiceLocation;
