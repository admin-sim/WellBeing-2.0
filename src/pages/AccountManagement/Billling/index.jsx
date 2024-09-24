import React from "react";
import AdvancedPatientSearch from "../../../components/AdvancedPatientSearch";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/PageHeader";
import { Layout } from "antd";

function Billing() {
  const navigate = useNavigate();

  const handleOnSubmit = (values) => {
    const url = `/CreateBilling`;
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
      <PageHeader title={"Billing Management System"} button={false} />
      <AdvancedPatientSearch handleOnSubmit={handleOnSubmit} />
    </Layout>
  );
}

export default Billing;
