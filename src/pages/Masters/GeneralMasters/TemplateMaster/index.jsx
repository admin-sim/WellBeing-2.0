import React, { useEffect, useState } from "react";
import PageHeader from "../../../../components/PageHeader";
import { PlusCircleOutlined } from "@ant-design/icons";
import CustomTable from "../../../../components/customTable/index.jsx";
import { urlGetAllTemplates } from "../../../../../endpoints";
import { Spin } from "antd";
import customAxios from "../../../../components/customAxios/customAxios";
import { useNavigate } from "react-router-dom";

function Templates() {
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await customAxios.get(urlGetAllTemplates);
      const newColumnData = response.data.data.templateListModel.map(
        (obj, index) => {
          return { ...obj, key: index + 1 };
        }
      );
      setApiData(newColumnData);
      console.log("data", response.data.data.templateListModel);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  function handleAddNewTemplate() {
    navigate("ShowAddNewTemplate");
  }

  const columns = [
    {
      title: "Sl No.",
      dataIndex: "key",
      key: "1",
    },
    {
      title: "Template Name",
      dataIndex: "TempName",
      key: "2",
    },
    {
      title: "Template Group",
      dataIndex: "TempGroupName",
      key: "3",
    },
    {
      title: "Provider",
      dataIndex: "ProviderName",
      key: "4",
    },
  ];

  function handleEdit() {}
  function handleDelete() {}

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
          title="Templates Management"
          buttonLabel="Add New Template"
          buttonIcon={<PlusCircleOutlined />}
          onButtonClick={handleAddNewTemplate}
        />
        <Spin spinning={loading}>
          <CustomTable
            columns={columns}
            dataSource={apiData}
            isFilter={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Spin>
      </div>
    </>
  );
}

export default Templates;
