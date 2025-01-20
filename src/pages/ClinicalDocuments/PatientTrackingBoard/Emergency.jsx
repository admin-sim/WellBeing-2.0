import React, { useEffect,useState } from "react";
import CustomTable from "../../../components/customTable";
import { urlSearchInPatientTrackRecords } from "../../../../endpoints";
import customAxios from "../../../components/customAxios/customAxios";
function Emergency() {
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
      dataIndex: "Ward",
      key: "6",
    },
    {
      title: "Bed",
      dataIndex: "Bed",
      key: "7",
    },
    {
      title: "From Date",
      dataIndex: "FromDateString",
      key: "8",
    },
    {
      title: "To Date",
      dataIndex: "ToDateString",
      key: "9",
    },
  ];
  
  useEffect(()=>{
    async function handlePatientTrackingSearch() {
       debugger
       const response= await customAxios.get(`${urlSearchInPatientTrackRecords}?Flag=${3}`)
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

export default Emergency;
