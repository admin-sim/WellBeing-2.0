import React from "react";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import CustomTable from "../../../../components/customTable/index.jsx";
import { useNavigate } from "react-router-dom";
import { PlusCircleOutlined } from "@ant-design/icons";

function Facility() {
  const columns = [
    {
      title: "Sl No",
      dataIndex: "SlNo",
      key: "10",
      width: 130,
    },
    {
      title: "Facility Name",
      dataIndex: "FacilityName",
      key: "1",
      width: 300,
    },
    {
      title: "Facility Code",
      dataIndex: "FacilityCode",
      key: "11",
      width: 300,
    },
    {
      title: "Address Line 1",
      dataIndex: "AddressLine1",
      key: "2",
      width: 290,
    },
    {
      title: "Address Line 2",
      dataIndex: "AddressLine2",
      key: "3",
      width: 300,
    },
    {
      title: "State",
      dataIndex: "State",
      key: "4",
      width: 150,
    },

    {
      title: "Place",
      dataIndex: "Place",
      key: "5",
      width: 150,
    },

    {
      title: "Area",
      dataIndex: "Area",
      key: "6",
      width: 250,
    },

    {
      title: "Contact Name",
      dataIndex: "ContactName",
      key: "7",
      width: 330,
    },

    {
      title: "Contact Details",
      key: "8",
      width: 320,
      render: (text, record) => (
        <div>
          <p>
            <strong>Mobile : </strong> {record?.ContactDetails?.MobileNo}
            <br />
            <strong>Phone : </strong>
            {record?.ContactDetails?.Phone}
            <br />
            <strong>Email : </strong>
            {record?.ContactDetails?.EmailId}
            <br />
            <strong>Fax : </strong>
            {record?.ContactDetails?.Fax}
          </p>
        </div>
      ),
    },
  ];

  const tableData = [
    {
      SlNo: 1,
      FacilityName: "Smiles Health Care Inc.",
      FacilityCode: "DE",
      AddressLine1: "R K Tower",
      AddressLine2: "Near GT Party Hall, Basaveshwar Nagar, Bengaluru",
      State: "Karnataka",
      Place: "Bengaluru",
      Area: "Basaveshwar Nagar",
      ContactName: "Admin",
      ContactDetails: {
        MobileNo: 9876543210,
        Phone: "123456",
        EmailId: "admin@smilesinmilez.com",
        Fax: "0000000000",
      },
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
          buttonLabel="Add New Facility"
          buttonIcon={<PlusCircleOutlined />}
          onButtonClick={handleAddNewFacility}
        />
        <CustomTable
          isFilter={true}
          columns={columns}
          dataSource={tableData}
          onEdit={handleEdit}
        />
      </div>
    </>
  );
}

export default Facility;
