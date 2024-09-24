import React, { useState, useEffect } from "react";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import CustomTable from "../../../../components/customTable/index.jsx";
import { useNavigate } from "react-router-dom";
import { PlusCircleOutlined } from "@ant-design/icons";
import customAxios from '../../../../components/customAxios/customAxios.jsx'
import { urlDischargeClearanceSetupIndex, urlPostDeleteDischargeClearanceSetup } from "../../../../../endpoints.js";
import { message } from "antd";
import { render } from "react-dom";

function DischargeClearance() {
  const [currentRecord, setCurrentRecord] = useState(null);
  const [tableData, setTableData] = useState();
  const [loading, setLoading] = useState()
  const [refreshKey, setRefreshKey] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true)
    try {
      customAxios.get(urlDischargeClearanceSetupIndex, {}).then((response) => {
        const apiData = response.data.data;
        if (response.status === 200 && apiData != null) {
          const newData = apiData.DischargeClearanceSetupDetails.map((item, index) => {
            return {
              ...item,
              key: index + 1,
            }
          })
          setTableData(newData)
          setLoading(false)
        }
      });
    } catch (error) {
      console.error("Error fetching purchase order details:", error);
    }
  }, [refreshKey])

  const columns = [
    {
      title: "Sl No",
      dataIndex: "key",
      key: "1",
      width: 80,
    },
    {
      title: "Short Name",
      dataIndex: "ShortName",
      key: "2",
      width: 120,
    },
    {
      title: "Long Name",
      dataIndex: "LongName",
      key: "3",
      width: 120,
    },
    {
      title: "Patient Type",
      dataIndex: "PatientType",
      key: "4",
      width: 120,
    },
    {
      title: "Clearance Type",
      dataIndex: "ClearanceType",
      key: "5",
      width: 130,
    },
    {
      title: "Clearance Sequence",
      dataIndex: "ClearanceSequence",
      key: "6",
      width: 160,
    },
    {
      title: "Status",
      dataIndex: "ActiveFlag",
      key: "7",
      width: 80,
      render: (text, record) => {
        return text === true ? 'Active' : 'Hidden'
      },
    }
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
    debugger
    try {
      customAxios.get(`${urlPostDeleteDischargeClearanceSetup}?DischargeClearanceSetupId=${record.DischargeClearanceSetupId}`).then((response) => {
        const apiData = response.data.data;
        if (response.status === 200 && apiData != null) {
          message.success('Deleted')
          setRefreshKey((prevKey) => prevKey + 1);
        }
      });
    } catch (error) {
      console.error("Error fetching purchase order details:", error);
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
          title={"Discharge Clearance Setup"}
          buttonLabel="Create"
          buttonIcon={<PlusCircleOutlined />}
          onButtonClick={handleAddNewBed}
        />
        <CustomTable
          loading={loading}
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
