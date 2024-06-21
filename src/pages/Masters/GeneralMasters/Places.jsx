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
import { useForm } from "antd/es/form/Form";
import Input from "antd/es/input/Input";
import Title from "antd/es/typography/Title";
import React, { useState, useEffect } from "react";
import customAxios from "../../../components/customAxios/customAxios";

import {
  urlGetAllPlaces,
  urlGetStatesBasedOnCountryId,
  urlGetSelectedPlaceDetails,
  urlAddAndUpdatePlace,
  urlDeleteSelectedPlace,
} from "../../../../endpoints";
import CustomTable from "../../../components/customTable";

function Places() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columnData, setColumnData] = useState();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [placeData, setPlaceData] = useState();
  const [Dropdown, setDropdown] = useState({
    Countries: [],
    States: [],
  });
  const [States, setStates] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCountryValue, setSelectedCountryValue] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    debugger;
    setLoading(true);
    try {
      const response = await customAxios.get(`${urlGetAllPlaces}`);
      const newColumnData = response.data.data.PlaceModels.map((obj, index) => {
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

  const handleAddPlaceShowModal = () => {
    setIsModalOpen(true);
    setIsEditing(false);
    form.resetFields();
  };

  const handlePlaceEditModal = (record) => {
    debugger;
    setPlaceData(record);
    setLoading(true);
    setIsEditing(true);
    customAxios
      .get(`${urlGetSelectedPlaceDetails}?placeId=${record.PlaceId}`)
      .then((response) => {
        if (response.data !== null) {
          const placeData = response.data.data.NewPlaceModel;
          setPlaceData(placeData);
          setIsModalOpen(true);
          form.setFieldsValue({
            // Country: placeData.CountryId,
            State: placeData.StateId,
            PlaceName: placeData.PlaceName,
          });
          setLoading(false);
        }
      });
  };

  const handlePlaceModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDelete = (record) => {
    debugger;
    //Deleting an State from the Table
    setPlaceData(record);
    try {
      customAxios
        .post(`${urlDeleteSelectedPlace}?PlaceId=${record.PlaceId}`)
        .then((response) => {
          if (response.data.data !== null) {
            const Places = response.data.data.PlaceModels.map((obj, index) => {
              return { ...obj, key: index + 1 };
            });
            setColumnData(Places);
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

    const place = isEditing
      ? {
          PlaceId: placeData.PlaceId,
          StateId: placeData.StateID,
          PlaceName: values.PlaceName,
        }
      : {
          PlaceId: 0,
          StateId: values.State,
          CountryId: values.Country,
          PlaceName: values.PlaceName,
        };

    try {
      // Send a POST request to the server
      const response = await customAxios.post(urlAddAndUpdatePlace, place, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.data !== null) {
        setIsModalOpen(false);
        const placeDetails = response.data.data.PlaceModels.map(
          (obj, index) => {
            return { ...obj, key: index + 1 };
          }
        );
        setColumnData(placeDetails);
        form.resetFields();
        {
          isEditing
            ? notification.success({
                message: "Place details updated Successfully",
              })
            : notification.success({
                message: "Place details added Successfully",
              });
        }
      }
    } catch (error) {
      console.error("Failed to send data to server: ", error);

      {
        isEditing
          ? notification.error({
              message: "Edited Place  details UnSuccessful",
            })
          : notification.error({
              message: "Adding Place details UnSuccessful",
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
          // const states = response.data.data.States.map((option) => (
          //   <Select.Option key={option.StateID} value={option.StateID}>
          //     {option.StateName}
          //   </Select.Option>
          // ));
          setStates(states);
        } else {
          // Handle other response statuses if needed
        }
      } else {
        // setStates([]);
        // setProviders([]);
        // setServiceLocations([]);
        // form1.resetFields();
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
                Place Manager
              </Title>
            </Col>
            <Col offset={5} span={3}>
              <Button
                icon={<PlusCircleOutlined />}
                onClick={handleAddPlaceShowModal}
              >
                Add New Place
              </Button>
            </Col>
          </Row>

          <Spin spinning={loading}>
            <CustomTable
              columns={columns}
              dataSource={columnData}
              actionColumn={true}
              isFilter={true}
              onEdit={handlePlaceEditModal}
              onDelete={handleDelete}
            />
          </Spin>
          <Modal
            title="Add New Place"
            open={isModalOpen}
            maskClosable={false}
            footer={null}
            onCancel={handlePlaceModalCancel}
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

              <Form.Item
                name="State"
                label="State"
                rules={[
                  {
                    required: true,
                    message: "Please select state",
                  },
                ]}
              >
                {isEditing ? (
                  <Select disabled allowClear>
                    {Dropdown.States.map((option) => (
                      <Select.Option
                        key={option.StateID}
                        value={option.StateID}
                      >
                        {option.StateName}
                      </Select.Option>
                    ))}
                  </Select>
                ) : (
                  <Select allowClear>
                    {States.map((option) => (
                      <Select.Option
                        key={option.StateID}
                        value={option.StateID}
                      >
                        {option.StateName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item
                name="PlaceName"
                label="Place Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter place name",
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
                    <Button type="default" onClick={handlePlaceModalCancel}>
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

export default Places;
