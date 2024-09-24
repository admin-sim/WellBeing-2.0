import React, { useEffect, useState } from "react";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import CustomTable from "../../../../components/customTable/index.jsx";
import { PlusCircleOutlined } from "@ant-design/icons";
import CreateWardModal from "./CreateWardModal.jsx";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import { urlWardIndex, urlCreateWard, urlSaveNewWard, urlUpdateWard, urlEditWard, urlDeleteWardParameter } from "../../../../../endpoints.js";
import { message } from "antd";

function Ward() {
  const [createWardModal, setCreateWardModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [tableData, setTableData] = useState()
  const [loading, setLoading] = useState()
  const [dropDown, setDropDown] = useState({
    Gender: [],
    WardCategory: [],
    FacilityDeptServiceLocation: []
  });

  useEffect(() => {
    setLoading(true)
    try {
      customAxios.get(urlWardIndex, {}).then((response) => {
        const apiData = response.data.data;
        if (response.status === 200 && apiData != null) {
          const newdata = apiData.WardModel.map((item, index) => {
            return {
              ...item,
              key: index + 1,
              Status: item.ActiveFlag === true ? 'Active' : 'Hidden'
            }
          })
          setTableData(newdata);
          setLoading(false)
        }
      });
    } catch (error) {
      console.error("Error fetching purchase order details:", error);
    }
  }, [createWardModal])

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

  const handleEdit = async (record) => {
    debugger
    try {
      const response = await customAxios.get(`${urlEditWard}?Id=${record.WardID}`);
      if (response.status === 200 && response.data.data != null) {
        const apiData = response.data.data.NewWardModel
        setDropDown(response.data.data);
        apiData.Gender = apiData.GenderID
        apiData.WardCategory = apiData.WardCategoryID
        apiData.ServiceLocation = apiData.ServiceLocationID
        apiData.Status = apiData.ActiveFlag
        setCurrentRecord(apiData);
        setCreateWardModal(true);
      } else {
        console.error("Failed to fetch patient details");
      }
    } catch (error) {
      console.error("Error:", error);
    }
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

  const handleDelete = async (record) => {
    debugger
    try {
      const response = await customAxios.get(`${urlDeleteWardParameter}?Id=${record.WardID}`);
      if (response.status === 200 && response.data.data != null) {
        const newdata = response.data.data.map((item, index) => {
          return {
            ...item,
            key: index + 1,
            Status: item.ActiveFlag === true ? 'Active' : 'Hidden'
          }
        })
        setTableData(newdata);
      } else {
        console.error("Failed to fetch Ward details");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (record) => {
    debugger
    const Ward = {
      WardID: record.WardID ? record.WardID : 0,
      WardCode: record.WardCode,
      WardName: record.WardName,
      GenderID: record.Gender,
      WardCategoryID: record.WardCategory,
      ServiceLocationID: record.ServiceLocation,
      FacilityID: 1,
      ActiveFlag: record.Status
    }
    const url = record.WardID ? urlUpdateWard : urlSaveNewWard
    const msg = record.WardID ? 'Ward Updated Success' : 'Ward Created Success'
    const response = await customAxios.post(url, Ward, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200 && response.data.data === "Success") {
      message.success(msg)
      setCreateWardModal(false);
    } else if (response.status === 200 && response.data.data === 'Already Exists') {
      message.warning('Already Exists!')
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
          loading={loading}
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
