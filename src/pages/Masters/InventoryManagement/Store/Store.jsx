import React, { useState, useEffect } from "react";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import { EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import Layout from "antd/es/layout/layout";
import { useNavigate } from "react-router";
import { Popconfirm, Table, ConfigProvider } from "antd";
import { urlStoreIndex } from "../../../../../endpoints.js";
import PageHeader from "../../../../components/PageHeader/index.jsx";

const Store = () => {
  const [dataTable, setDataTable] = useState();

  useEffect(() => {
    try {
      customAxios.get(urlStoreIndex, {}).then((response) => {
        const apiData = response.data.data;
        const menuItems = apiData.StoreDetails.map((item) => ({
          key: item.StoreId,
          ShortName: item.StoreType,
          StoreType: item.ShortName,
          LongName: item.LongName,
          DefaultParentStore: item.DefaultParentStore,
          Status: item.Status,
        }));

        console.log("Data Table", menuItems);

        setDataTable(menuItems);
      });
    } catch (error) {
      console.error("Error fetching purchase order details:", error);
    }
  }, []);

  const handleAdd = () => {
    navigate("/CreateStore");
  };

  const ModelUpdate = (StoreId) => {
    navigate("/CreateStore", { state: { StoreId } });
  };

  const columns = [
    {
      title: "Short Name",
      dataIndex: "ShortName",
      key: "ShortName",
    },
    {
      title: "Long Name",
      dataIndex: "LongName1",
      key: "LongName1",
    },
    {
      title: "Default Parent Store",
      dataIndex: "DefaultParentStore1",
      key: "DefaultParentStore1",
    },
    {
      title: "Status",
      dataIndex: "Status1",
      key: "Status1",
    },
  ];

  const navigate = useNavigate();

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
        title={"Store"}
        buttonIcon={<PlusCircleOutlined />}
        buttonLabel={"Add Store"}
        onButtonClick={handleAdd}
      />
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#E6E6FA",
            },
          },
        }}
      >
        <Table
          style={{ margin: "1rem" }}
          columns={columns}
          bordered
          expandable={{
            expandedRowRender: (record) => (
              <div
                style={{
                  display: "flex",
                  //   justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 1 }}>{record.StoreType}</div>
                <div style={{ flex: 2 }}>{record.LongName}</div>
                <div style={{ flex: 2 }}>{record.DefaultParentStore}</div>
                <div style={{ flex: 1 }}>{record.Status}</div>
                <div style={{ flex: 0 }}>
                  <Popconfirm
                    title="Sure to edit?"
                    onConfirm={() => ModelUpdate(record.key)}
                  >
                    <EditOutlined style={{ marginRight: "4px" }} />
                  </Popconfirm>
                </div>
              </div>
            ),
          }}
          dataSource={dataTable}
        />
      </ConfigProvider>
    </Layout>
  );
};

export default Store;
