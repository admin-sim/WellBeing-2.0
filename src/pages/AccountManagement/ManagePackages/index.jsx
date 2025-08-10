import { Layout } from "antd";
import React from "react";
import PageHeader from "../../../components/PageHeader";
import AdvancedPatientSearch from "../../../components/AdvancedPatientSearch";
import { useNavigate } from "react-router-dom";

function ManagePackages() {
  const navigate = useNavigate();

  const handleOnSubmit = (values) => {
    debugger;
    const url = `/CreateManagePackages`;

    navigate(url, {
      state: {
        patientId: values.patientId,
        encounterId: values.Encounter,
      },
    });
  };

  return (
    <Layout
      style={{
        width: "100%",
        backgroundColor: "white",
        minHeight: "max-content",
        borderRadius: "10px",
      }}
    >
      <PageHeader title={"Manage Packages"} button={false} />
      <AdvancedPatientSearch handleOnSubmit={handleOnSubmit} />
    </Layout>
  );
}

export default ManagePackages;
