import React, { useState, useEffect } from "react";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import CustomTable from "../../../../components/customTable/index.jsx";
import { useNavigate } from "react-router-dom";
import { PlusCircleOutlined } from "@ant-design/icons";
import CreateWardModal from "../Ward/CreateWardModal.jsx";
import customAxios from '../../../../components/customAxios/customAxios.jsx'
import { urlBedIndex, urlDeleteSelectedBed } from "../../../../../endpoints.js";
import { message } from "antd";

function Bed() {
  const [currentRecord, setCurrentRecord] = useState(null);
  const [tableData, setTableData] = useState();
  const [loading, setLoading] = useState()

  const navigate = useNavigate();

  useEffect(() => {
    debugger
    setLoading(true)
    try {
      customAxios.get(urlBedIndex, {}).then((response) => {
        const apiData = response.data.data;
        if (response.status === 200 && apiData != null) {
          const groupedData = [];
          // ServiceLocationID
          apiData.BedModel.forEach((item) => {
            const existingWard = groupedData.find(
              (ward) => ward.WardID === item.WardID
            );

            if (existingWard) {
              existingWard.BedNo.push(item.BedNo);
            } else {
              groupedData.push({
                ...item,
                BedNo: [item.BedNo],
                ServiceLocationID: item.ServiceLocationID,
                ServiceLocation: item.ServiceLocation
              });
            }
          });

          const newData = groupedData.map((ward, index) => ({
            ...ward,
            key: index + 1,
            BedNo: ward.BedNo.join(', '),
          }));
          setTableData(newData);
          setLoading(false)
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

  const handleEdit = (record) => {
    setCurrentRecord(record);
    navigate("EditBed", { state: record });
  };

  const handleAddNewBed = () => {
    navigate("CreateBed");
    setCurrentRecord(null);
  };

  const handleDelete = (record) => {
    debugger
    try {
      customAxios.get(`${urlDeleteSelectedBed}?WardId=${record.WardID}`).then((response) => {
        const apiData = response.data.data;
        if (response.status === 200) {
          message.success(`Deleted ${response.data}`)
        }
      });
    } catch (error) {
      console.error("Error fetching details:", error);
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
          title={"Bed"}
          buttonLabel="Add New Bed"
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

export default Bed;
