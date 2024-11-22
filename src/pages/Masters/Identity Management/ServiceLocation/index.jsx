import React, { useEffect, useState } from "react";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import CustomTable from "../../../../components/customTable/index.jsx";

import { PlusCircleOutlined } from "@ant-design/icons";
import CreateEditServiceLocationModal from "./CreateEditServiceLocationModal.jsx";
import { urlDeleteSelectedServiceLocation, urlGetAllServiceLocation, urlSaveNewServiceLocation, urlUpdateServiceLocation } from "../../../../../endpoints.js";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import { message, notification } from "antd";

function ServiceLocation() {
  const [serviceLocationModel, setServiceLocationModel] = useState([]);
  const [locations, setLocations] = useState([]);
  const [currentRecord, setCurrentRecord] = useState(null);

  const [departmentModal, setDepartmentModal] = useState(false);



  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await customAxios.get(
        `${urlGetAllServiceLocation}`
      );

      if (response.data != null) {
     
        setServiceLocationModel(
          response.data.data.ServiceLocationModel.map((obj, index) => {
            return { ...obj, key: index + 1 };
          })
        );
        setLocations(
          response.data.data.ServiceLocations.map((obj, index) => {
            return { ...obj, key: index + 1 };
          })
        );
      }
    } catch (error) {
    
      console.error(error);
    }
  };

  const columns = [
    {
      title: "Sl No",
      dataIndex: "key",
      width: 80,
    },
    {
      title: "Service Location Name",
      dataIndex: "ServiceLocationName",
   
      width: 200,
    },
    {
      title: "Service Location Code",
      dataIndex: "ServiceLocationCode",
      key: "3",
      width: 200,
    },

    {
      title: "Service Location Type",
      dataIndex: "ServiceLocationType",
      width: 200,
    },
  ];



  const handleEdit = (record) => {
    debugger;
    setCurrentRecord(record);
    setDepartmentModal(true);
  };

  const handleAddNewDepartment = () => {
    setCurrentRecord(null);
    setDepartmentModal(true);
  };

  const handleDelete = (record) => {
    debugger;
    console.log(record);
    try {
      customAxios
        .delete(`${urlDeleteSelectedServiceLocation}?ServiceLocationId=${record.ServiceLocationId}`)
        .then((response) => {
          if (response.data.data == true) {
               fetchData();
            notification.success({
              message: "Deleted Successfully",
            });
          }
        });
    } catch (error) {
      notification.error({
        message: "Deleting UnSuccessful",
      });
    }
  };
  const handleSubmit = async(record) => {
    debugger;
    console.log(record);
// Check the value of ActiveFlag and set it to true or false
    record.ActiveFlag = record.ActiveFlag === "Active";
    const apiUrl = record.ServiceLocationId
    ? urlUpdateServiceLocation // Update endpoint if ServiceLocationId exists
    : urlSaveNewServiceLocation; // Save endpoint otherwise

    const response = await customAxios.post(apiUrl, record, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if(response.data.data==true){
      message.success("Saved Successfully");
      setDepartmentModal(false);
      fetchData();
    }else{
      message.warning("Department already exists");
      setDepartmentModal(false);
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
          title={"Service Location Manager"}
          buttonLabel="Add New Service Location"
          buttonIcon={<PlusCircleOutlined />}
          onButtonClick={handleAddNewDepartment}
        />
        <CustomTable
          isFilter={true}
          columns={columns}
          dataSource={serviceLocationModel}
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
          options={locations}
        />
      </div>
    </>
  );
}

export default ServiceLocation;
