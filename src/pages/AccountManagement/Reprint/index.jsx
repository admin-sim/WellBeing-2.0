import React from "react";
import PageHeader from "../../../components/PageHeader";
import { Layout } from "antd";

function Reprint() {
  return (
    <Layout
      style={{
        width: "100%",
        backgroundColor: "white",
        minHeight: "max-content",
        borderRadius: "10px",
      }}
    >
      <PageHeader title={"Reprint Management"} button={false} />
    </Layout>
  );
}

export default Reprint;
