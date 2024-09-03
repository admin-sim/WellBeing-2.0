import React, { useState, useEffect } from "react";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import CustomTable from "../../../../components/customTable/index.jsx";
import { useNavigate } from "react-router-dom";
import { PlusCircleOutlined } from "@ant-design/icons";
import CreateWardModal from "../Ward/CreateWardModal.jsx";
import customAxios from '../../../../components/customAxios/customAxios.jsx'
import { urlBedIndex } from "../../../../../endpoints.js";

function Bed() {
  const [currentRecord, setCurrentRecord] = useState(null);
  const [tableData, setTableData] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    try {
      customAxios.get(urlBedIndex, {}).then((response) => {
        const apiData = response.data.data;
        if (response.status === 200 && apiData != null) {
          const newdata = apiData.BedModel.map((item, index) => {
            return {
              ...item,
              key: index + 1
            }
          })
          setTableData(newdata);
        }
      });
    } catch (error) {
      console.error("Error fetching purchase order details:", error);
    }
  }, [])

  const columns = [
    {
      title: "Sl No",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Service Location",
      dataIndex: "ServiceLocation",
      key: "ServiceLocation",
    },
    {
      title: "Ward",
      dataIndex: "WardName",
      key: "WardName",
    },
    {
      title: "Bed",
      dataIndex: "BedNo",
      key: "BedNo",
    },
  ];

  // const tableData = [
  //   {
  //     SlNo: 1,
  //     ServiceLocation: "First Floor",
  //     Ward: "Emergency Ward Ground Floor",
  //     Bed: "EWGF1 ,EWGF2 ,EWGF3 ,EWGF4 ,EWGF5",
  //   },

  //   {
  //     SlNo: 2,
  //     ServiceLocation: "First Floor",
  //     Ward: "Female Ward First Floor",
  //     Bed: "FWFF1 ,FWFF2 ,FWFF3 ,FWFF4",
  //   },

  //   {
  //     SlNo: 3,
  //     ServiceLocation: "First Floor",
  //     Ward: "Male Ward First Floor",
  //     Bed: "MWFF1 ,MWFF2 ,MWFF3 ,MWFF4 ,MWFF5 ,MWFF6 ,MWFF7",
  //   },
  // ];

  const handleEdit = (record) => {
    setCurrentRecord(record);
    navigate("EditBed", { state: record });
  };

  const handleAddNewBed = () => {
    navigate("CreateBed");
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
          title={"Bed"}
          buttonLabel="Add New Bed"
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

export default Bed;
