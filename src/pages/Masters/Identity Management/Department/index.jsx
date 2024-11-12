import React, { useEffect, useState } from "react";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import CustomTable from "../../../../components/customTable/index.jsx";
import { useNavigate } from "react-router-dom";
import { PlusCircleOutlined } from "@ant-design/icons";
import CreateEditDepartmentModal from "./CreateEditDepartmentModal.jsx";
import { urlAddOrUpdateNewDepartment, urlDeleteDepartment, urlGetAllDepartments } from "../../../../../endpoints.js";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import { message, notification, Spin } from "antd";

function Department() {
  const [departmentModal, setDepartmentModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const [columnData, setColumnData] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await customAxios.get(`${urlGetAllDepartments}`);
      const newColumnData = response.data.data.DepartmentModel.map(
        (obj, index) => {
          return { ...obj, key: index + 1 };
        }
      );
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
      title: "Department Name",
      dataIndex: "DepartmentName",
    },
    {
      title: "Department Code",
      dataIndex: "DepartmentCode",
    },
  ];

  const handleEdit = (record) => {
    debugger;
    setCurrentRecord(record);
    setDepartmentModal(true);
  };

  const handleAddNewDepartment = () => {
    setCurrentRecord(null);
    setDepartmentModal(true);
  };

  const handleDelete = (record) => {
    debugger;
    console.log(record);
    try {
      customAxios
        .delete(`${urlDeleteDepartment}?DepartmentId=${record.DepartmentId}`)
        .then((response) => {
          if (response.data.data == true) {
               fetchData();
            notification.success({
              message: "Deleted Successfully",
            });
          }
        });
    } catch (error) {
      notification.error({
        message: "Deleting UnSuccessful",
      });
    }
  };
  const handleSubmit = async(record) => {
    debugger;
    console.log(record);
// Check the value of ActiveFlag and set it to true or false
record.ActiveFlag = record.ActiveFlag === "Active";

    const response = await customAxios.post(urlAddOrUpdateNewDepartment, record, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if(response.data.data==true){
      setDepartmentModal(false);
      fetchData();
    }else{
      message.warning("Department already exists");
      setDepartmentModal(false);
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
          title={"Department Manager"}
          buttonLabel="Add New Department"
          buttonIcon={<PlusCircleOutlined />}
          onButtonClick={handleAddNewDepartment}
        />
        <Spin spinning={loading}>
          <CustomTable
            isFilter={true}
            columns={columns}
            dataSource={columnData}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Spin>
        <CreateEditDepartmentModal
          open={departmentModal}
          handleClose={() => {
            setDepartmentModal(false);
          }}
          handleSubmit={handleSubmit}
          record={currentRecord}
        />
      </div>
    </>
  );
}

export default Department;
