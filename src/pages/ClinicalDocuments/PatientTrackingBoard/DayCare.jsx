import React, { useEffect,useState } from "react";
import CustomTable from "../../../components/customTable";
import { urlSearchInPatientTrackRecords } from "../../../../endpoints";
import { Tag } from "antd";
import {
    urlGetPatientDetail,
    urlSearchPatientRecord,
    urlGetPatientHeaderDetails,
    urlSearchUHID,
    urlSearchPatientTrackRecords,
  } from "../../../../endpoints";
import customAxios from "../../../components/customAxios/customAxios";
function DayCare() {
    const [tableData, setTableData] = useState([]);
  const [patientTrackRecordTable, setPatientTrackRecordTable] = useState(true);
  const columns = [
    {
      title: "Encounter",
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
      render: (text, record) => {
        let color = "";
        let label = "";
    
        // Check EncounterStatus and ToDischargeDateStr conditions
        if (text === "Open") {
          color = "green";
          label = "Open";
        } else if (text === "Discharged") {
          if (record.ToDischargeDateStr) {
            color = "red";
            label = "Discharged";
          } else {
            color = "orange";
            label = "Discharge Initiated";
          }
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
      title: "Date of Discharge ",
      dataIndex: "ToDischargeDateStr",
      key: "9",
      align: "center",
      render: (text, record) => {
        if (record.EncounterStatus === "Discharged") {
          if (text) {
            // return text;
            return (
              <Tag
                color="red"
                style={{ borderRadius: "8px", fontWeight: "bold" }}
              >
                {text}
              </Tag>
            );
          } else {
            return (
              <Tag
                color="green"
                style={{ borderRadius: "8px", fontWeight: "bold" }}
              >
                Active
              </Tag>
            );
          }
        } else {
          return (
            <span
              style={{ color: "red", fontWeight: "bold", fontSize: "14px" }}
            >
              -
            </span>
          );
        }
      },
    },
  ];

 

  // useEffect(() => {
  //   async function handlePatientTrackingSearch() {
  //     const response = await customAxios.get(`${urlSearchInPatientTrackRecords}?Flag=${2}`);
  //     if (response.status === 200) {
  //       const data = response.data.data.ClinicalDocumentTypes;
  //       const uniqueData = removeDuplicates(data); // Apply deduplication
  //       setTableData(uniqueData);
  //     }
  //     setPatientTrackRecordTable(true);
  //   }
  
  //   handlePatientTrackingSearch();
  // }, []);
  
  // // Function to remove duplicates based on EncounterId
  // const removeDuplicates = (data) => {
  //   const uniqueEncounters = new Map();
  //   data.forEach((item) => {
  //     if (!uniqueEncounters.has(item.Encounter)) {
  //       uniqueEncounters.set(item.Encounter, item);
  //     }
  //   });
  //   return Array.from(uniqueEncounters.values());
  // };
  
   useEffect(() => {
    async function handlePatientTrackingSearch() {
      try {
        const response = await customAxios.get(`${urlSearchInPatientTrackRecords}?Flag=${2}`);
        if (response.status === 200) {
          const data = response.data.data.ClinicalDocumentTypes;
          const latestData = getLatestRecords(data); 
          setTableData(latestData);
        }
        setPatientTrackRecordTable(true);
      } catch (error) {
        console.error("Error fetching patient tracking data:", error);
      }
    }
  
    handlePatientTrackingSearch();
  }, []);
  
 
  const getLatestRecords = (data) => {
    const map = new Map();
  
    data.forEach((item) => {
      const encounter = item.Encounter ? item.Encounter.toString().trim() : null;
  
      if (encounter) {
     
        map.set(encounter, item);
      }
    });
  
    return Array.from(map.values());
  };
   
  

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

export default DayCare;
