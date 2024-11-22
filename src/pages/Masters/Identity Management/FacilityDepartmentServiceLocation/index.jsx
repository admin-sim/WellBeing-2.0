import React, { useEffect, useState } from "react";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import { Col, Form, message, Row, Select } from "antd";
import CustomTable from "../../../../components/customTable/index.jsx";
import { PlusCircleOutlined } from "@ant-design/icons";
import ServiceLocationModal from "./ServiceLocationModal.jsx";
import ProviderModal from "./ProviderModal.jsx";
import PatientTypeModal from "./PatientTypeModal.jsx";
import { ColWithEightSpan } from "../../../../components/customGridColumns/index.jsx";
import {
  urlGetAllDepartmentsForFacilities,
  urlGetAllFacilityDepartmentServiceLocation,
  urlGetParticularPatientType,
  urlGetParticularProvider,
  urlGetParticularServiceLocation,
  urlSaveNewFacilityDepartmentPatientType,
  urlSaveNewFacilityDepartmentProvider,
  urlSaveNewFacilityDepartmentServiceLocation,
  urlUpdateFacilityDepartmentPatientType,
  urlUpdateFacilityDepartmentProvider,
  urlUpdateFacilityDepartmentServiceLocation,
} from "../../../../../endpoints.js";
import customAxios from "../../../../components/customAxios/customAxios.jsx";

function FacilityDepartmentServiceLocation() {
  const [form] = Form.useForm();
  const [currentRecord, setCurrentRecord] = useState(null);

  const [serviceLocationModal, setserviceLocationModal] = useState(false);
  const [providerModal, setproviderModal] = useState(false);
  const [patientTypeModal, setpatientTypeModal] = useState(false);
  const [patientTypes, setPatientTypes] = useState([]);
  const [providers, setProviders] = useState([]);
  const [serviceLocations, setServiceLocations] = useState([]);
  const [deptpatientTypes, setDeptPatientTypes] = useState([]);
  const [deptproviders, setDeptProviders] = useState([]);
  const [deptserviceLocations, setDeptServiceLocations] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [facilitydepartments, setfacilityDepts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await customAxios.get(
        `${urlGetAllFacilityDepartmentServiceLocation}`
      );

      if (response.data != null) {
        setFacilities(
          response.data.data.Facilities.map((obj, index) => {
            return { ...obj, key: index + 1 };
          })
        );
        setPatientTypes(
          response.data.data.PatientTypes.map((obj, index) => {
            return { ...obj, key: index + 1 };
          })
        );
        setServiceLocations(
          response.data.data.ServiceLocations.map((obj, index) => {
            return { ...obj, key: index + 1 };
          })
        );
        setProviders(
          response.data.data.Providers.map((obj, index) => {
            return { ...obj, key: index + 1 };
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFacility = async (value) => {
    const response = await customAxios.get(
      `${urlGetAllDepartmentsForFacilities}?id=${value}`
    );
    if (response.data != null) {
      setfacilityDepts(
        response.data.data.FacilityDepartment.map((obj, index) => {
          return { ...obj, key: index + 1 };
        })
      );
    }
  };

  const handleDepartmentChange = async (value) => {
    debugger;
    const response = await customAxios.get(
      `${urlGetParticularProvider}?id=${value}`
    );
    if (response.data != null) {
      setDeptProviders(
        response.data.data?.map((obj, index) => {
          return { ...obj, key: index + 1 };
        })
      );
    }
    const response1 = await customAxios.get(
      `${urlGetParticularPatientType}?id=${value}`
    );
    if (response1.data != null) {
      setDeptPatientTypes(
        response1.data.data?.map((obj, index) => {
          return { ...obj, key: index + 1 };
        })
      );
    }
    const response2 = await customAxios.get(
      `${urlGetParticularServiceLocation}?id=${value}`
    );
    if (response2.data != null) {
      setDeptServiceLocations(
        response2.data.data?.map((obj, index) => {
          return { ...obj, key: index + 1 };
        })
      );
    }
  };

  const columns1 = [
    {
      title: "SL Code",
      dataIndex: "ServiceLocationCode",
    },
    {
      title: "SL Name",
      dataIndex: "ServiceLocationName",
    },
    {
      title: "SLType",
      dataIndex: "ServiceLocationTypeName",
    },
    {
      title: "Status",
      dataIndex: "ActiveFlag",
      render: (text) => (text ? "Active" : "Hidden"),
    },
  ];

  const columns2 = [
    {
      title: "Provider Name",
      dataIndex: "ProviderName",
    },
    {
      title: "Status",
      dataIndex: "ActiveFlag",
      render: (text) => (text ? "Active" : "Hidden"),
    },
  ];

  const columns3 = [
    {
      title: "Patient Type",
      dataIndex: "PatientType",
    },
    {
      title: "Status",
      dataIndex: "ActiveFlag",
      render: (text) => (text ? "Active" : "Hidden"),
    },
  ];

  //Service Location Modal Controls
  const handleServiceLocationEdit = (record) => {
    setCurrentRecord(record);
    setserviceLocationModal(true);
  };

  const handleAddServiceLocation = () => {
    setCurrentRecord(null);
    setserviceLocationModal(true);
  };


  //Provider Modal Controls
  const handleProviderEdit = (record) => {
    setCurrentRecord(record);
    setproviderModal(true);
  };

  const handleAddProvider = () => {
    setCurrentRecord(null);
    setproviderModal(true);
  };

  const handleServiceLocationSubmit =async (record) => {
    debugger;

    const formValues = form.getFieldsValue(); 
    if (!formValues.FacilityDepartmentId) {
      // Show warning message if FacilityDepartmentId is not provided
      message.warning('Please fill  Department Name  ');
      return;  // Stop execution if FacilityDepartmentId is missing
    }

    const apiUrl = record.FacilityDepartmentServiceLocationId
    ? urlUpdateFacilityDepartmentServiceLocation // Update endpoint if ServiceLocationId exists
    : urlSaveNewFacilityDepartmentServiceLocation;

    record.ActiveFlag = record.ActiveFlag === "Active";
    record.FacilityDepartmentId=formValues.FacilityDepartmentId;
    if(record.FacilityDepartmentServiceLocationId){
      record.FacilityDepartmentServiceLocationId=record.FacilityDepartmentServiceLocationId;
    }else{
      record.ServiceLocationId=record.ServiceLocationId;
    }
    const response = await customAxios.post(apiUrl, record, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if(response.data.data==true){
      message.warning("ServiceLocation already exists");
      //setserviceLocationModal(false);
  
    }else{

      setDeptServiceLocations(response.data.data);
      message.success("Saved Successfully");
      setserviceLocationModal(false);
    }
  
  };

  const handleProviderSubmit =async (record) => {
    debugger;
    // console.log(record);

    // const formValues = form.getFieldsValue(); 
    // record.ActiveFlag = record.ActiveFlag === "Active";
    // record.FacilityDepartmentId=formValues.FacilityDepartmentId;
    const formValues = form.getFieldsValue(); 
    if (!formValues.FacilityDepartmentId) {
      // Show warning message if FacilityDepartmentId is not provided
      message.warning('Please fill  Department Name  ');
      return;  // Stop execution if FacilityDepartmentId is missing
    }

    const apiUrl = record.FacilityDepartmentProviderId
    ? urlUpdateFacilityDepartmentProvider // Update endpoint if ServiceLocationId exists
    : urlSaveNewFacilityDepartmentProvider;

    record.ActiveFlag = record.ActiveFlag === "Active";
    record.FacilityDepartmentId=formValues.FacilityDepartmentId;
    if(record.FacilityDepartmentProviderId){
      record.FacilityDepartmentProviderId=record.FacilityDepartmentProviderId;
    }else{
      record.ProviderId=record.ProviderId;
    }

    const response = await customAxios.post(apiUrl, record, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if(response.data.data==true){
      message.warning("Provider already exists");
      setproviderModal(false);
  
    }else{
      setDeptProviders(response.data.data);
      message.success("Saved Successfully");
      setproviderModal(false);
      
    }
  };



  const handlePatientTypeSubmit =async (record) => {
    console.log(record);
  
    // const formValues = form.getFieldsValue(); 
    // record.ActiveFlag = record.ActiveFlag === "Active";
    // record.FacilityDepartmentId=formValues.FacilityDepartmentId;

    const formValues = form.getFieldsValue(); 
    if (!formValues.FacilityDepartmentId) {
      // Show warning message if FacilityDepartmentId is not provided
      message.warning('Please fill  Department Name  ');
      return;  // Stop execution if FacilityDepartmentId is missing
    }

    const apiUrl = record.FacilityDepartmentPatientTypeId
    ? urlUpdateFacilityDepartmentPatientType // Update endpoint if ServiceLocationId exists
    : urlSaveNewFacilityDepartmentPatientType;

    record.ActiveFlag = record.ActiveFlag === "Active";
    record.FacilityDepartmentId=formValues.FacilityDepartmentId;
    if(record.FacilityDepartmentPatientTypeId){
      record.FacilityDepartmentPatientTypeId=record.FacilityDepartmentPatientTypeId;
    }else{
      record.PatientTypeId=record.PatientTypeId;
    }

    const response = await customAxios.post(apiUrl, record, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if(response.data.data==true){
      message.warning("PatientType already exists");
      setpatientTypeModal(false);
  
    }else{
      setDeptPatientTypes(response.data.data);
      message.success("Saved Successfully");
      setpatientTypeModal(false);
      
    }
  };

  //Patient Type Modal Controls
  const handlePatientTypeEdit = (record) => {
    setCurrentRecord(record);
    setpatientTypeModal(true);
  };

  const handleAddPatientType = () => {
    setCurrentRecord(null);
    setpatientTypeModal(true);
  };


  return (
    <>
      <div
        style={{
          width: "100%",
          backgroundColor: "white",
          minHeight: "max-content",
          borderRadius: "10px",
          paddingBottom: "1rem",
        }}
      >
        <PageHeader title={"Facility Department"} button={false} />
        <Form
          layout="vertical"
          style={{ margin: "1rem" }}
          form={form}
          onFinish={(values) => {
            console.log(values);
          }}
        >
          <Row gutter={16}>
            <ColWithEightSpan>
              <Form.Item name="FacilityName" label="Facility Name" required>
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
            </ColWithEightSpan>
            <ColWithEightSpan>
              <Form.Item name="FacilityDepartmentId" label="Department Name" required>
                <Select
                  placeholder="Select ServiceLocationType "
                  allowClear
                  // loading={isloading}
                  onChange={handleDepartmentChange}
                >
                  {facilitydepartments?.map((option) => (
                    <Select.Option
                      key={option.FacilityDepartmentId}
                      value={option.FacilityDepartmentId}
                    >
                      {option.DepartmentName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </ColWithEightSpan>
          </Row>
        </Form>
        <Row gutter={24} style={{ margin: "0 0.5rem" }}>
          <ColWithEightSpan>
            <div
              style={{
                border: "1px solid #D3D3D3",
                borderRadius: "10px 10px 0 0",
                marginBottom: "1rem",
              }}
            >
              <PageHeader
                title={"Service Location (SL)"}
                buttonIcon={<PlusCircleOutlined />}
                onButtonClick={handleAddServiceLocation}
              />
              <CustomTable
                columns={columns1}
                dataSource={deptserviceLocations}
                onEdit={handleServiceLocationEdit}
              />
            </div>
          </ColWithEightSpan>
          <ColWithEightSpan>
            <div
              style={{
                border: "1px solid #D3D3D3",
                borderRadius: "10px 10px 0 0",
                marginBottom: "1rem",
              }}
            >
              <PageHeader
                title={"Provider"}
                buttonIcon={<PlusCircleOutlined />}
                onButtonClick={handleAddProvider}
              />
              <CustomTable
                columns={columns2}
                dataSource={deptproviders}
                onEdit={handleProviderEdit}
              />
            </div>
          </ColWithEightSpan>
          <ColWithEightSpan>
            <div
              style={{
                border: "1px solid #D3D3D3",
                borderRadius: "10px 10px 0 0",
                marginBottom: "1rem",
              }}
            >
              <PageHeader
                title={"Patient Type"}
                buttonIcon={<PlusCircleOutlined />}
                onButtonClick={handleAddPatientType}
              />
              <CustomTable
                columns={columns3}
                dataSource={deptpatientTypes}
                onEdit={handlePatientTypeEdit}
              />
            </div>
          </ColWithEightSpan>
        </Row>
        <ServiceLocationModal
          open={serviceLocationModal}
          handleClose={() => {
            setserviceLocationModal(false);
          }}
          handleSubmit={handleServiceLocationSubmit}
          record={currentRecord}
          serviceLocations={serviceLocations}
        />
        <ProviderModal
          open={providerModal}
          handleClose={() => {
            setproviderModal(false);
          }}
          handleSubmit={handleProviderSubmit}
          record={currentRecord}
          providers={providers}
        />
        <PatientTypeModal
          open={patientTypeModal}
          handleClose={() => {
            setpatientTypeModal(false);
          }}
          handleSubmit={handlePatientTypeSubmit}
          record={currentRecord}
          patietTypes={patientTypes}
        />
      </div>
    </>
  );
}

export default FacilityDepartmentServiceLocation;
