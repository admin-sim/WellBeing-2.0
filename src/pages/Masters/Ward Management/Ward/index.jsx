import React, { useEffect, useState } from "react";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import CustomTable from "../../../../components/customTable/index.jsx";
import { PlusCircleOutlined } from "@ant-design/icons";
import CreateWardModal from "./CreateWardModal.jsx";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import { urlWardIndex, urlCreateWard, urlSaveNewWard } from "../../../../../endpoints.js";
import { message } from "antd";

function Ward() {
  const [createWardModal, setCreateWardModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [tableData, setTableData] = useState()
  const [dropDown, setDropDown] = useState({
    Gender: [],
    WardCategory: [],
    FacilityDeptServiceLocation: []
  });

  useEffect(() => {
    try {
      customAxios.get(urlWardIndex, {}).then((response) => {
        const apiData = response.data.data;
        if (response.status === 200 && apiData != null) {
          const newdata = apiData.WardModel.map((item, index) => {
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
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: "Ward Code",
      dataIndex: "WardCode",
      key: "WardCode",
    },
    {
      title: "Ward Name",
      dataIndex: "WardName",
      key: "WardName",
    },
    {
      title: "Ward Category",
      dataIndex: "WardCategory",
      key: "WardCategory",
    },
    {
      title: "Service Location",
      dataIndex: "ServiceLocation",
      key: "ServiceLocation",
    },
    {
      title: "Gender",
      dataIndex: "Gender",
      key: "Gender",
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
    },
  ];  

  const handleEdit = (record) => {
    debugger
    setCurrentRecord(record);
    setCreateWardModal(true);
  };

  const handleAddNewDepartment = async () => {
    debugger
    setCurrentRecord(null);
    try {
      const response = await customAxios.get(urlCreateWard);
      if (response.status === 200 && response.data.data != null) {
        setDropDown(response.data.data);
      } else {
        console.error("Failed to fetch patient details");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setCreateWardModal(true);
  };

  const handleDelete = (record) => {
    console.log(record);
  };

  const handleSubmit = async (record) => {
    debugger
    const response = await customAxios.get(
      `${urlSaveNewWard}?WardCode=${record.WardCode}&WardName=${record.WardName}&WardCategoryID=${record.WardCategory}&GenderID=${record.Gender}&ServiceLocationID=${record.ServiceLocation}&Status=${record.Status}`
    );
    if (response.status === 200 && response.data === "Success") {
      message.success('Ward Created Success')
      setCreateWardModal(false);
    } else {
      console.error("Failed to Create");
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
          title={"Ward"}
          buttonLabel="Add New Ward"
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
        <CreateWardModal
          open={createWardModal}
          handleClose={() => {
            setCreateWardModal(false);
          }}
          handleSubmit={handleSubmit}
          record={currentRecord}
          Dropdown={dropDown}
        />
      </div>
    </>
  );
}

export default Ward;
