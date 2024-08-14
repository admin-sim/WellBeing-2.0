import React from "react";
import CustomTable from "../../../components/customTable";

function InPatient() {
  const columns = [
    {
      title: "EncounterId",
      dataIndex: "EncounterId",
      key: "1",
    },
    {
      title: "Patient Name",
      dataIndex: "PatientName",
      key: "2",
    },
    {
      title: "EncounterStatus",
      dataIndex: "EncounterStatus",
      key: "3",
    },
    {
      title: "ServiceLocation",
      dataIndex: "ServiceLocation",
      key: "4",
    },
    {
      title: "Provider",
      dataIndex: "Provider",
      key: "5",
    },
    {
      title: "Room",
      dataIndex: "Room",
      key: "6",
    },
    {
      title: "Bed",
      dataIndex: "Bed",
      key: "7",
    },
    {
      title: "From Date",
      dataIndex: "FromDate",
      key: "8",
    },
    {
      title: "To Date",
      dataIndex: "ToDate",
      key: "9",
    },
  ];

  const tableData = [
    {
      EncounterId: "COH / IP90",
      PatientName: "Ravi D",
      EncounterStatus: "Discharged",
      ServiceLocation: "First Floor",
      Provider: "CLEMENT IYAMU",
      Room: "Emergency Ward Ground Floor",
      Bed: "EWGF4",
      FromDate: "23-05-2023 12:37:16",
      ToDate: "01-01-0001 12:00:00",
    },
  ];

  return (
    <div>
      <CustomTable
        columns={columns}
        dataSource={tableData}
        isFilter={true}
        actionColumn={false}
      />
    </div>
  );
}

export default InPatient;
