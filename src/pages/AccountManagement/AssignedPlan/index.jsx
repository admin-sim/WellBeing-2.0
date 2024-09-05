import React from "react";
import PageHeader from "../../../components/PageHeader";
import AdvancedPatientSearch from "../../../components/AdvancedPatientSearch";
import { useNavigate } from "react-router-dom";
import { FaAnglesLeft } from "react-icons/fa6";
import { Layout } from "antd";

function AssignedPlan() {
  const navigate = useNavigate();

  const handleOnSubmit = (values) => {
    const url = `/CreateAssignedPlan`;
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
      <PageHeader
        title={"Assigned Plan"}
        buttonIcon={<FaAnglesLeft style={{ fontSize: "1.1rem" }} />}
        buttonLabel={"Back"}
        onButtonClick={() => navigate("/AssignedPlan")}
      />
      <AdvancedPatientSearch handleOnSubmit={handleOnSubmit} />
    </Layout>
  );
}

export default AssignedPlan;
