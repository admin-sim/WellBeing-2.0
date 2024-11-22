import React, { useEffect, useState } from "react";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Col, Form, message, Row, Select } from "antd";
import Title from "antd/es/typography/Title.js";
import CustomTable from "../../../../components/customTable/index.jsx";
import CreateEditFacilityDepartmentModal from "./CreateEditFacilityDepartmentModal.jsx";
import { ColWithTwelveSpan } from "../../../../components/customGridColumns/index.jsx";
import { urlGetAllDepartmentsForFacilities, urlGetAllFacilities, urlSaveNewFacilityDepartment } from "../../../../../endpoints.js";
import customAxios from "../../../../components/customAxios/customAxios.jsx";

function FacilityDepartment() {
  const [form] = Form.useForm();
  const [departmentModal, setDepartmentModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [facilities, setfacilities] = useState([]);
  const [facilityDept, setfacilityDept] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await customAxios.get(
        `${urlGetAllFacilities}`
      );

      if (response.data != null) {
     
     
        setfacilities(
          response.data.data.FacilityModel.map((obj, index) => {
            return { ...obj, key: index + 1 };
          })
        );
      }
    } catch (error) {
    
      console.error(error);
    }
  };

  const handleFacility =async(value)=>{

    const response = await customAxios.get(
      `${urlGetAllDepartmentsForFacilities}?id=${value}`
    );

    if (response.data != null) {
   
   
      setfacilityDept(
        response.data.data.FacilityDepartment.map((obj, index) => {
          return { ...obj, key: index + 1 };
        })
      );
      setDepartments(
        response.data.data.Departments.map((obj, index) => {
          return { ...obj, key: index + 1 };
        })
      );
    }

  }

  const columns = [
    {
      title: "Sl No",
      dataIndex: "key",
      width: 80,
    },
    {
      title: "Department Name",
      dataIndex: "DepartmentName",
      width: 250,
    },
    {
      title: "Department Code",
      dataIndex: "DepartmentCode",
      key: "3",
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "ActiveFlag",
      width: 100,
      render: (text) => text ? "Active" : "Hidden"
    }
    
  ];

 

  const handleEdit = (record) => {
    setCurrentRecord(record);
    setDepartmentModal(true);
  };

  const handleAddNewDepartment = () => {
    setCurrentRecord(null);
    setDepartmentModal(true);
  };

  const handleDelete = (record) => {
    console.log(record);
  };
  const handleSubmit = async(record) => {
    debugger;
    console.log(record);
// Check the value of ActiveFlag and set it to true or false
const formValues = form.getFieldsValue(); // Get all the field values from the form

    record.FacilityId = formValues.ServiceLocationTypeId;
    record.ActiveFlag = record.ActiveFlag === "Active";

    const response = await customAxios.post(urlSaveNewFacilityDepartment, record, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if(response.data.data==true){
      message.warning("Department already exists");
      setDepartmentModal(false);
  
    }else{
      message.success("Saved Successfully");
      setDepartmentModal(false);
      fetchData();
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
        <PageHeader title={"Facility Department"} button={false} />
        <Form
          style={{ margin: "1rem" }}
          form={form}
          onFinish={(values) => {
            console.log(values);
          }}
        >
          <Row gutter={16}>
          <ColWithTwelveSpan>
              <Form.Item
                style={{ marginBottom: "0.5rem" }}
                name="ServiceLocationTypeId"
                label="Service Location Type"
                rules={[
                  { required: true, message: "Please enter ServiceLocationType " },
                ]}
              >
                <Select
                  placeholder="Select ServiceLocationType "
                  allowClear
                  onChange={handleFacility}
                 // loading={isloading}
                >
                  {facilities?.map((option) => (
                    <Select.Option
                      key={option.FacilityId}
                      value={option.FacilityId}
                    >
                      {option.FacilityName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </ColWithTwelveSpan>
          </Row>
        </Form>
        <div style={{ margin: "0 1rem" }}>
          <PageHeader
            title={"Department"}
            buttonLabel="Add New Department"
            buttonIcon={<PlusCircleOutlined />}
            onButtonClick={handleAddNewDepartment}
          />
          <CustomTable
            isFilter={true}
            columns={columns}
            dataSource={facilityDept}
            actionColumn={false}
           // onEdit={handleEdit}
            //onDelete={handleDelete}
          />
          <CreateEditFacilityDepartmentModal
            open={departmentModal}
            handleClose={() => {
              setDepartmentModal(false);
            }}
            handleSubmit={handleSubmit}
            record={currentRecord}
            options={departments}
          />
        </div>
      </div>
    </>
  );
}

export default FacilityDepartment;
