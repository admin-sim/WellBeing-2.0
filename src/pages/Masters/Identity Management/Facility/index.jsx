import React, { useEffect, useState } from "react";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import CustomTable from "../../../../components/customTable/index.jsx";
import { useNavigate } from "react-router-dom";
import { PlusCircleOutlined } from "@ant-design/icons";
import { urlGetAllFacilities } from "../../../../../endpoints.js";
import customAxios from "../../../../components/customAxios/customAxios.jsx";





function Facility() {

  const [columnData, setColumnData] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await customAxios.get(`${urlGetAllFacilities}`);
      const newColumnData = response.data.data.FacilityModel.map((obj, index) => {
        return { ...obj, key: index + 1 };
      });
      setColumnData(newColumnData);
   
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  const columns = [
    {
      title: "Sl. No.",
      dataIndex: "key",
      key: "key",
      width: 80,
    },
    {
      title: "Facility Name",
      dataIndex: "FacilityName",

      width: 200,
    },
    {
      title: "Facility Code",
      dataIndex: "FacilityCode",
 
      width: 120,
    },
    {
      title: "Address Line 1",
      dataIndex: "AddressLine1",

      width: 150,
    },
    {
      title: "Address Line 2",
      dataIndex: "AddressLine2",
 
      width: 250,
    },
    {
      title: "State",
      dataIndex: "StateName",

      width: 120,
    },

    {
      title: "Place",
      dataIndex: "PlaceName",

      width: 120,
    },

    {
      title: "Area",
      dataIndex: "AreaName",

      width: 180,
    },

    {
      title: "Contact Name",
      dataIndex: "ContactName",

      width: 150,
    },

    {
      title: "Contact Details",

      width: 250,
      render: (text, record) => (
        <div>
          <p>
            <strong>Mobile : </strong> {record?.MobileNumber}
            <br />
            <strong>Phone : </strong>
            {record?.PhoneNumber}
            <br />
            <strong>Email : </strong>
            {record?.ContactEmail}
            <br />
            <strong>Fax : </strong>
            {record?.FaxNumber}
          </p>
        </div>
      ),
    },
  ];

 

  const navigate = useNavigate();

  const handleEdit = (record) => {
    console.log(record);
    navigate("CreateFacility", { state: record });
  };

  const handleAddNewFacility = () => {
    navigate("CreateFacility");
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
          title={"Facility"}
          button={false}
         // buttonLabel="Add New Facility"
          //buttonIcon={<PlusCircleOutlined />}
         // onButtonClick={handleAddNewFacility}
        />
        <CustomTable
          isFilter={true}
          columns={columns}
          dataSource={columnData}
          //onEdit={handleEdit}
        />
      </div>
    </>
  );
}

export default Facility;
