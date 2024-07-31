import React, { useState } from "react";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import CustomTable from "../../../../components/customTable/index.jsx";
import { useNavigate } from "react-router-dom";
import { PlusCircleOutlined } from "@ant-design/icons";

function DischargeClearance() {
  const [currentRecord, setCurrentRecord] = useState(null);

  const navigate = useNavigate();

  const columns = [
    {
      title: "Sl No",
      dataIndex: "SlNo",
      key: "1",
    },
    {
      title: "Short Name",
      dataIndex: "ShortName",
      key: "2",
    },
    {
      title: "Long Name",
      dataIndex: "LongName",
      key: "3",
    },
    {
      title: "Patient Type",
      dataIndex: "PatientType",
      key: "4",
    },
    {
      title: "Clearance Type",
      dataIndex: "ClearanceType",
      key: "5",
    },
    {
      title: "Clearance Sequence",
      dataIndex: "ClearanceSequence",
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
      ShortName: "BL",
      LongName: "Billing",
      PatientType: "Day Care",
      ClearanceType: "Billing",
      ClearanceSequence: "1",
      Status: "Active",
    },
    {
      SlNo: 2,
      ShortName: "NUR",
      LongName: "	Nursing Clearence",
      PatientType: "InPatient",
      ClearanceType: "Nursing",
      ClearanceSequence: "2",
      Status: "Active",
    },
    {
      SlNo: 3,
      ShortName: "NC",
      LongName: "Nursing Clearence",
      PatientType: "Emergency",
      ClearanceType: "Nursing",
      ClearanceSequence: "2",
      Status: "Active",
    },
  ];

  const handleEdit = (record) => {
    setCurrentRecord(record);
    navigate("CreateEditDischargeClearanceSetup", { state: record });
  };

  const handleAddNewBed = () => {
    navigate("CreateEditDischargeClearanceSetup");
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
          title={"Discharge Clearance Setup"}
          buttonLabel="Create"
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

export default DischargeClearance;
