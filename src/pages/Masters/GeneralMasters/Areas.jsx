import { PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Select,
  Spin,
  Layout,
  notification,
  message,
} from "antd";
import Input from "antd/es/input/Input";
import Title from "antd/es/typography/Title";
import React, { useState, useEffect } from "react";
import customAxios from "../../../components/customAxios/customAxios";
import {
  urlGetAllAreas,
  urlGetPlacesBasedOnStateId,
  urlGetSelectedAreaDetails,
  urlAddAndUpdateArea,
  urlDeleteSelectedArea,
  urlGetStatesBasedOnCountryId,
} from "../../../../endpoints";
import CustomTable from "../../../components/customTable";
import PageHeader from "../../../components/PageHeader";

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
  const [stateLoader, setStateLoader] = useState(false);
  const [placeLoader, setPlaceLoader] = useState(false);
  const [selectedCountryValue, setSelectedCountryValue] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [IsSubmitClicked, setIsSubmitClicked] = useState(false);

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
    debugger
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
    setIsEditing(false);
    setIsSubmitClicked(false);
    form.resetFields();
  };

  const handleDelete = (record) => {
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
    debugger
    form.validateFields();
    const values = form.getFieldsValue();

    setIsSubmitClicked(true);
    if (
      values.Place !== undefined &&
      // values.State !== undefined &&
      // values.Country !== undefined &&
      values.AreaName !== undefined
    ) {
      const area = isEditing
        ? {
            AreaId: areaData.AreaId,
            PlaceId: areaData.PlaceId,
            AreaName: values.AreaName,
          }
        : {
            AreaId: 0,
            PlaceId: values.Place,
            // StateId: values.State,
            // CountryId: values.Country,
            AreaName: values.AreaName,
          };

      try {
        const response = await customAxios.post(urlAddAndUpdateArea, area, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.data !== null) {
          if (response.data === "Already Exists") {
            // setIsModalOpen(false);
            setIsSubmitClicked(false);
            messageApi.warning({
              // type: "warning",
              content: `Lookup already exists`,
            });
          } else if (response.data.data !== null) {
            setIsSubmitClicked(false);
            setIsModalOpen(false);
            const areaDetails = response.data.data.AreaModel.map(
              (obj, index) => {
                return { ...obj, key: index + 1 };
              }
            );
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
        } else {
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
      } catch (error) {
        console.error("Failed to send data to server: ", error);
      }
    } else {
      setIsSubmitClicked(false);
    }
  };

  const handleCountryChange = async (value) => {
    setSelectedCountryValue(value);

    try {
      // Update the options for the second select based on the value of the first select
      if (value != null) {
        setStateLoader(true);
        const response = await customAxios.get(
          `${urlGetStatesBasedOnCountryId}?CountryId=${value}`
        );

        if (response.status === 200) {
          setStateLoader(false);
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
    try {
      // Update the options for the second select based on the value of the first select
      if (value != null) {
        setPlaceLoader(true);
        const response = await customAxios.get(
          `${urlGetPlacesBasedOnStateId}?StateId=${value}`
        );

        if (response.status === 200) {
          setPlaceLoader(false);
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
      width: 80,
    },
    {
      title: "Area Name",
      dataIndex: "AreaName",
      key: "AreaName",
      width: 150,
    },
    {
      title: "Place",
      dataIndex: "PlaceName",
      key: "PlaceName",
      width: 150,
    },
    {
      title: "State",
      dataIndex: "StateName",
      key: "StateName",
      width: 150,
    },
    {
      title: "Country",
      dataIndex: "CountryName",
      key: "CountryName",
      width: 150,
    },
  ];

  return (
    <>
      <Layout
        style={{
          width: "100%",
          backgroundColor: "white",
          minHeight: "max-content",
          borderRadius: "10px",
        }}
      >
        <PageHeader
          title={"Area Manager"}
          buttonLabel={"Add New Area"}
          buttonIcon={<PlusCircleOutlined />}
          onButtonClick={handleAddAreaShowModal}
        />
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
          title={isEditing ? "Update Area" : "Add New Area"}
          open={isModalOpen}
          maskClosable={false}
          footer={[
            <Button
              key="submit"
              type="primary"
              loading={IsSubmitClicked}
              onClick={handleSubmit}
            >
              {/* {IsSubmitClicked ? "Submitting" : "Submit"} */}
              {isEditing ? "Update" : "Submit"}
            </Button>,
            <Button key="back" danger onClick={handleAreaModalCancel}>
              Cancel
            </Button>,
          ]}
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
                  loading={stateLoader}
                >
                  {States.map((option) => (
                    <Select.Option key={option.StateID} value={option.StateID}>
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
                <Select allowClear loading={placeLoader}>
                  {Dropdown.Places.map((option) => (
                    <Select.Option key={option.PlaceId} value={option.PlaceId}>
                      {option.PlaceName}
                    </Select.Option>
                  ))}
                </Select>
              ) : (
                <Select allowClear loading={placeLoader}>
                  {Places.map((option) => (
                    <Select.Option key={option.PlaceId} value={option.PlaceId}>
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
          </Form>
        </Modal>
      </Layout>
    </>
  );
}

export default Areas;
