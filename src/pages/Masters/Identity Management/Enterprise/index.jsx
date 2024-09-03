import React from "react";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import CustomTable from "../../../../components/customTable/index.jsx";
import { useNavigate } from "react-router-dom";

function Enterprise() {
  const columns = [
    {
      title: "Enterprise Name",
      dataIndex: "EnterpriseName",
      key: "1",
      width: 200,
    },
    {
      title: "Address Line 1",
      dataIndex: "AddressLine1",
      key: "2",
      width: 150,
    },
    {
      title: "Address Line 2",
      dataIndex: "AddressLine2",
      key: "3",
      width: 150,
    },
    {
      title: "State",
      dataIndex: "State",
      key: "4",
      width: 100,
    },

    {
      title: "Place",
      dataIndex: "Place",
      key: "5",
      width: 100,
    },

    {
      title: "Area",
      dataIndex: "Area",
      key: "6",
      width: 150,
    },

    {
      title: "Contact Name",
      dataIndex: "ContactName",
      key: "7",
      width: 150,
    },

    {
      title: "Contact Details",
      key: "8",
      width: 250,
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
      EnterpriseName: "Smiles Health Care Inc.",
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
    navigate("EditEnterprise", { state: record });
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
        <PageHeader title={"Enterprise"} button={false} />
        <CustomTable
          columns={columns}
          dataSource={tableData}
          onEdit={handleEdit}
        />
      </div>
    </>
  );
}

export default Enterprise;
