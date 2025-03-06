import React, { useEffect, useState } from "react";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import CustomTable from "../../../../components/customTable/index.jsx";
import { PlusCircleOutlined } from "@ant-design/icons";
import AddNewConfiguration from "./AddNewConfigurationModal.jsx";
import { urlAddNewConfiguration, urlGetAllConfiguartions, urlUpdateConfiguration } from "../../../../../endpoints.js";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import { message } from "antd";

function Configuration() {
  const [createWardModal, setCreateWardModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [configurations, setConfigurations] = useState([]);
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    fetchDataHeader();
  }, []);

  const fetchDataHeader = async () => {
    try {
      const response = await customAxios.get(
        `${urlGetAllConfiguartions}`
      );
      if (response.status === 200) {
        const configurations =
          response.data.data.ConfigurationModels.map((obj, index) => {
            return { ...obj, key: index + 1 };
          });

        const facilities = response.data.data.Facilities;
        setConfigurations(configurations);
        setFacilities(facilities);

      } else {
      }
    } catch (error) { }
  };

  const columns = [
    {
      title: "Sl No",
      dataIndex: "key",
      width: 80,
    },
    {
      title: "Facility Name",
      dataIndex: "FacilityName",

      width: 180,
    },
    {
      title: "Prefix",
      dataIndex: "IdPrefix",

      width: 80,
    },
    {
      title: "Description",
      dataIndex: "Description",

      width: 120,
    },
    {
      title: "Suffix",
      dataIndex: "IdSuffix",

      width: 80,
    },
    {
      title: "Initial Value",
      dataIndex: "IdLastNumber",

      width: 120,
    },
    {
      title: "Increment Value",
      dataIndex: "IdIncrement",

      width: 120,
    },
  ];

  const handleEdit = (record) => {
    setCurrentRecord(record);
    setCreateWardModal(true);
  };

  const handleAddNewDepartment = () => {
    setCurrentRecord(null);
    setCreateWardModal(true);
  };

  const handleDelete = (record) => {
    console.log(record);
  };

  const handleSubmit = async (record) => {
    record.Suffix = record.Suffix ? record.Suffix : "";
    record.Prefix = record.Prefix ? record.Prefix : "";
    record.IsSimpleNumber = record.IsSimpleNumber ? "Y" : "N";

    if (record.ConfigurationId > 0) {
      const response = await customAxios.post(urlUpdateConfiguration, record, {
        headers: {
          "Content-Type": "application/json",
          // Add any other required headers here
        },
      });
      if (response.status === 200) {
        var message1 = response.data.data;
        message.success(message1);
      }
      setCreateWardModal(false);
      fetchDataHeader()
    } else {
      const response = await customAxios.post(urlAddNewConfiguration, record, {
        headers: {
          "Content-Type": "application/json",
          // Add any other required headers here
        },
      });
      if (response.status === 200) {
        var message1 = response.data.data;
        message.success(message1);
      }
      setCreateWardModal(false);
      fetchDataHeader()
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
          title={"Configuration Management"}
          buttonLabel="Add"
          buttonIcon={<PlusCircleOutlined />}
          onButtonClick={handleAddNewDepartment}
        />
        <CustomTable
          isFilter={true}
          columns={columns}
          dataSource={configurations}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <AddNewConfiguration
          open={createWardModal}
          handleClose={() => {
            setCreateWardModal(false);
          }}
          handleSubmit={handleSubmit}
          record={currentRecord}
          facilities={facilities}
        />
      </div>
    </>
  );
}

export default Configuration;
