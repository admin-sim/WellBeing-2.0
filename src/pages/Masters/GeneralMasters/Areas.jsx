import {
  EditOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Spin,
  Layout,
  notification,
} from "antd";

import Input from "antd/es/input/Input";
import Title from "antd/es/typography/Title";
import React, { useState, useEffect } from "react";
import customAxios from "../../../components/customAxios/customAxios";

import {
  urlGetAllGeneralLookUp,
  urlGetAllAreas,
  urlGetPlacesBasedOnStateId,
  urlGetSelectedAreaDetails,
  urlAddAndUpdateArea,
  urlDeleteSelectedArea,
  urlGetStatesBasedOnCountryId,
} from "../../../../endpoints";
import CustomTable from "../../../components/customTable";

function Areas() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columnData, setColumnData] = useState();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [areaData, setAreaData] = useState();
  const [Dropdown, setDropdown] = useState({
    Countries: [],
    States: [],
    Places: [],
  });
  const [States, setStates] = useState([]);
  const [Places, setPlaces] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCountryValue, setSelectedCountryValue] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await customAxios.get(`${urlGetAllAreas}`);
      const newColumnData = response.data.data.AreaModel.map((obj, index) => {
        return { ...obj, key: index + 1 };
      });
      setColumnData(newColumnData);
      setDropdown(response.data.data);
      console.log("data", newColumnData);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleAddAreaShowModal = () => {
    setIsModalOpen(true);
    setIsEditing(false);
    form.resetFields();
  };

  const handleAreaEditModal = (record) => {
    debugger;
    setAreaData(record);
    setLoading(true);
    setIsEditing(true);
    customAxios
      .get(`${urlGetSelectedAreaDetails}?areaId=${record.AreaId}`)
      .then((response) => {
        if (response.data !== null) {
          const areaData = response.data.data.NewAreaModel;
          setAreaData(areaData);
          setIsModalOpen(true);
          form.setFieldsValue({
            Place: areaData.PlaceId,
            AreaName: areaData.AreaName,
          });
          setLoading(false);
        }
      });
  };

  const handleAreaModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDelete = (record) => {
    debugger;
    //Deleting an State from the Table
    setAreaData(record);
    try {
      customAxios
        .post(`${urlDeleteSelectedArea}?AreaId=${record.AreaId}`)
        .then((response) => {
          if (response.data.data !== null) {
            const Areas = response.data.data.AreaModel.map((obj, index) => {
              return { ...obj, key: index + 1 };
            });
            setColumnData(Areas);
            setDropdown(response.data.data);
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

  const handleSubmit = async () => {
    debugger;
    form.validateFields();
    const values = form.getFieldsValue();
    console.log("state Edit Modal Submit", values);
    // UpdateState(int StateId, string Name, string StateCode, int CountryId)
    // SaveNewState(int CountryId, string StateCode, string StateName)

    const area = isEditing
      ? {
          AreaId: areaData.AreaId,
          PlaceId: areaData.PlaceId,
          AreaName: values.AreaName,
        }
      : {
          AreaId: 0,
          PlaceId: values.Place,
          StateId: values.State,
          CountryId: values.Country,
          AreaName: values.AreaName,
        };

    try {
      // Send a POST request to the server
      const response = await customAxios.post(urlAddAndUpdateArea, area, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.data !== null) {
        setIsModalOpen(false);
        const areaDetails = response.data.data.AreaModel.map((obj, index) => {
          return { ...obj, key: index + 1 };
        });
        setColumnData(areaDetails);
        form.resetFields();
        {
          isEditing
            ? notification.success({
                message: "Area details updated Successfully",
              })
            : notification.success({
                message: "Area details added Successfully",
              });
        }
      }
    } catch (error) {
      console.error("Failed to send data to server: ", error);

      {
        isEditing
          ? notification.error({
              message: "Edited area  details UnSuccessful",
            })
          : notification.error({
              message: "Adding area details UnSuccessful",
            });
      }
    }
  };

  const handleCountryChange = async (value) => {
    setSelectedCountryValue(value);
    debugger;
    try {
      // Update the options for the second select based on the value of the first select
      if (value != null) {
        const response = await customAxios.get(
          `${urlGetStatesBasedOnCountryId}?CountryId=${value}`
        );

        if (response.status === 200) {
          const states = response.data.data.States;

          setStates(states);
        } else {
          // Handle other response statuses if needed
        }
      } 
    } catch (error) {
      // Handle errors (e.g., network issues)
      console.error("Error fetching data:", error);
    }
  };

  const handleStateChange = async (value) => {
    debugger;
    
    try {
      // Update the options for the second select based on the value of the first select
      if (value != null) {
        const response = await customAxios.get(
          `${urlGetPlacesBasedOnStateId}?StateId=${value}`
        );

        if (response.status === 200) {
          const places = response.data.data.Places;

          setPlaces(places);
        } else {
          // Handle other response statuses if needed
        }
      } 
    } catch (error) {
      // Handle errors (e.g., network issues)
      console.error("Error fetching data:", error);
    }
  };

  const columns = [
    {
      title: "Sl. No.",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Area Name",
      dataIndex: "AreaName",
      key: "AreaName",
    },
    {
      title: "Place",
      dataIndex: "PlaceName",
      key: "PlaceName",
    },
    {
      title: "State",
      dataIndex: "StateName",
      key: "StateName",
    },
    {
      title: "Country",
      dataIndex: "CountryName",
      key: "CountryName",
    },
  ];

  return (
    <>
      <Layout>
        <div
          style={{
            width: "100%",
            backgroundColor: "white",
            minHeight: "max-content",
            borderRadius: "10px",
          }}
        >
          <Row
            style={{
              padding: "0.5rem 2rem 0.5rem 2rem",
              backgroundColor: "#40A2E3",
              borderRadius: "10px 10px 0px 0px ",
            }}
          >
            <Col span={16}>
              <Title
                level={4}
                style={{
                  color: "white",
                  fontWeight: 500,
                  margin: 0,
                  paddingTop: 0,
                }}
              >
                Area Manager
              </Title>
            </Col>
            <Col offset={5} span={3}>
              <Button
                icon={<PlusCircleOutlined />}
                onClick={handleAddAreaShowModal}
              >
                Add New Area
              </Button>
            </Col>
          </Row>

          <Spin spinning={loading}>
            <CustomTable
              columns={columns}
              dataSource={columnData}
              actionColumn={true}
              isFilter={true}
              onEdit={handleAreaEditModal}
              onDelete={handleDelete}
            />
          </Spin>
          <Modal
            title="Add New Place"
            open={isModalOpen}
            maskClosable={false}
            footer={null}
            onCancel={handleAreaModalCancel}
          >
            <Form
              style={{ margin: "1rem 0" }}
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
            >
              {isEditing ? null : (
                <Form.Item
                  name="Country"
                  label="Country"
                  rules={[
                    {
                      required: true,
                      message: "Please select Country",
                    },
                  ]}
                >
                  <Select
                    // disabled={isEditing}
                    allowClear
                    placeholder="Select a type"
                    onChange={handleCountryChange}
                  >
                    {Dropdown.Countries.map((option) => (
                      <Select.Option
                        key={option.LookupID}
                        value={option.LookupID}
                      >
                        {option.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
              {isEditing ? null : (
                <Form.Item
                  name="State"
                  label="State"
                  rules={[
                    {
                      required: true,
                      message: "Please select State",
                    },
                  ]}
                >
                  <Select
                    allowClear
                    placeholder="Select a type"
                    onChange={handleStateChange}
                  >
                    {States.map((option) => (
                      <Select.Option
                        key={option.StateID}
                        value={option.StateID}
                      >
                        {option.StateName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}

              <Form.Item
                name="Place"
                label="Place"
                rules={[
                  {
                    required: true,
                    message: "Please select place name",
                  },
                ]}
              >
                {isEditing ? (
                  <Select allowClear>
                    {Dropdown.Places.map((option) => (
                      <Select.Option
                        key={option.PlaceId}
                        value={option.PlaceId}
                      >
                        {option.PlaceName}
                      </Select.Option>
                    ))}
                  </Select>
                ) : (
                  <Select allowClear>
                    {Places.map((option) => (
                      <Select.Option
                        key={option.PlaceId}
                        value={option.PlaceId}
                      >
                        {option.PlaceName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item
                name="AreaName"
                label="Area Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter area name",
                  },
                ]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
              <Row gutter={32} style={{ height: "1.8rem" }}>
                <Col offset={12} span={6}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item>
                    <Button type="default" onClick={handleAreaModalCancel}>
                      Cancel
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        </div>
      </Layout>
    </>
  );
}

export default Areas;
