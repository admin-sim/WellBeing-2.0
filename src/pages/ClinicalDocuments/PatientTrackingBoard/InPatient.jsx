import React, { useEffect,useState } from "react";
import CustomTable from "../../../components/customTable";
import { urlSearchInPatientTrackRecords } from "../../../../endpoints";
import customAxios from "../../../components/customAxios/customAxios";
import { Tag } from "antd";
function InPatient() {
    const [tableData, setTableData] = useState([]);
  const [patientTrackRecordTable, setPatientTrackRecordTable] = useState(true);
  const columns = [
    {
      title: "EncounterId",
      dataIndex: "Encounter",
      key: "1",
    },
    {
      title: "Patient Name",
      dataIndex: "PatientName",
      key: "2",
    },
    {
      title: "Encounter Status",
      dataIndex: "EncounterStatus",
      key: "3",
      render: (text) => {
        let color = "";
        let label = "";
    
        if (text === "Discharged") {
          color = "red";
          label = "Discharged";
        } else if (text === "Open") {
          color = "green";
          label = "Open";
        } else if (text === "DischargeInitiated") {
          color = "orange";
          label = "Discharge Initiated";
        }
    
        return (
          <Tag color={color} style={{ borderRadius: "8px", fontWeight: "bold" }}>
            {label}
          </Tag>
        );
      },
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
      dataIndex: "Ward",
      key: "6",
    },
    {
      title: "Bed",
      dataIndex: "Bed",
      key: "7",
    },
    {
      title: "Date of Admission",
      dataIndex: "FromDateString",
      key: "8",
    },
    {
      title: "Date of Discharge",
      dataIndex: "ToDateString",
      key: "9",
      align: "center", // Aligns text to center
      render: (text, record) =>
        record.EncounterStatus === "Discharged" ? (
          text
        ) : (
          <span style={{ color: "red", fontWeight: "bold", fontSize: "14px" }}>-</span>
        ),
    }    
  ];

  useEffect(()=>{
    async function handlePatientTrackingSearch() {
       debugger
       const response= await customAxios.get(`${urlSearchInPatientTrackRecords}?Flag=${1}`)
       if(response.status==200){
         debugger
         setTableData(response.data.data.ClinicalDocumentTypes)
       }
         setPatientTrackRecordTable(true);
     
         console.log(values);
       };
     handlePatientTrackingSearch()
   },[])

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
