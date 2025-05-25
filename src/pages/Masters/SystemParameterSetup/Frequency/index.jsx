import React, { useEffect,useState } from "react";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import CustomTable from "../../../../components/customTable/index.jsx";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import { Table, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import AddEditFrequencyModal from "./AddEditFrequencyModal.jsx";
import {urlAddNewFrequency,urlDeleteSelectedFrequency,urlGetAllFrequency} from "../../../../../endpoints";
function Frequency() {
  const [addEditFrequencyModal, setAddEditFrequencyModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Sl No",
      dataIndex: "key",
      key: "1",
      width: 80,
    },
    {
      title: "Frequency",
      dataIndex: "FrequencyName",
      key: "2",
      width: 120,
    },
    {
      title: "Count",
      dataIndex: "CountId",
      key: "3",
      width: 80,
    },
    {
      title: "Local Language",
      dataIndex: "LocalLang",
      key: "4",
      width: 150,
    },
  ];


  useEffect(() => {
    fetchFrequencies();
  }, []);
  
  const fetchFrequencies = async () => {
    setLoading(true);
    try {
      const response = await customAxios.get(`${urlGetAllFrequency}`);

      if (response?.status === 200 && response?.data?.data?.Frequency) {
        const tableData = response.data.data.Frequency.map((item, index) => ({
          key: index + 1,
          ...item,
        }));
        setData(tableData);
      } else {
        message.error("Failed to load frequency data");
      }
    } catch (error) {
      console.error("Error fetching frequency data:", error);
      message.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setCurrentRecord(record);
    setAddEditFrequencyModal(true);
  };

  const handleAddNewFrequency = () => {
    setCurrentRecord(null);
    setAddEditFrequencyModal(true);
  };

  const handleDelete = async (record) => {
    try {
      console.log("Deleting record:", currentRecord);
     debugger
     const status = record.Frequencystatus ? 1 : 0;
     const id = `${record.FrequencyId}&${status}`;

      const response = await customAxios.post(`${urlDeleteSelectedFrequency}`, null, {
        params: { id },
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 200 && response.data) {
        message.success("Frequency deleted successfully");
      
        fetchFrequencies();
      } else {
        message.error("Failed to delete frequency");
      }
    } catch (error) {
      console.error("Error deleting frequency:", error);
      message.error("Failed to delete frequency");
    }
  };
  
  
 
  const handleSubmit = async (record) => {
    try {
      const Frequency = {
        ...record,
        FrequencyId: currentRecord?.FrequencyId || 0,
      };

      const response = await customAxios.post(`${urlAddNewFrequency}`, Frequency, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 200) {
        if (response.data) {
          message.success("Frequency saved successfully");
          setAddEditFrequencyModal(false);
          fetchFrequencies(); // Refresh the data after adding/updating
        } else {
          message.error("Failed to save frequency");
        }
      }
    } catch (error) {
      console.error("Failed to submit frequency:", error);
      message.error("Failed to save frequency");
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
          title={"Frequency Master"}
          buttonLabel="Add"
          buttonIcon={<PlusCircleOutlined />}
          onButtonClick={handleAddNewFrequency}
        />
        <CustomTable
          isFilter={true}
          columns={columns}
          dataSource={data}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <AddEditFrequencyModal
          open={addEditFrequencyModal}
          handleClose={() => {
            setAddEditFrequencyModal(false);
          }}
          handleSubmit={handleSubmit}
          record={currentRecord}
        />
      </div>
    </>
  );
}

export default Frequency;
