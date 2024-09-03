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
  urlGetAllStates,
  urlGetSelectedStateDetails,
  urlAddAndUpdateState,
  urlDeleteSelectedState,
} from "../../../../endpoints";
import CustomTable from "../../../components/customTable";
import PageHeader from "../../../components/PageHeader";

function States() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columnData, setColumnData] = useState();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [stateData, setStateData] = useState();
  const [Dropdown, setDropdown] = useState({
    Countries: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [IsSubmitClicked, setIsSubmitClicked] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await customAxios.get(`${urlGetAllStates}`);
      const newColumnData = response.data.data.StateModel.map((obj, index) => {
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

  const handleAddStateShowModal = () => {
    setIsModalOpen(true);
    setIsEditing(false);
    form.resetFields();
  };

  const handleStateEditModal = (record) => {
    // edit the item in your data here

    setStateData(record);
    setLoading(true);
    setIsEditing(true);
    customAxios
      .get(`${urlGetSelectedStateDetails}?stateId=${record.StateID}`)
      .then((response) => {
        if (response.data !== null) {
          const stateData = response.data.data.NewState;
          setStateData(stateData);
          setIsModalOpen(true);
          form.setFieldsValue({
            Country: stateData.CountryId,
            StateCode: stateData.StateCode,
            StateName: stateData.StateName,
          });
          setLoading(false);
        }
      });
  };

  const handleStateModalCancel = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setIsSubmitClicked(false);
    form.resetFields();
  };

  const handleDelete = (record) => {
    //Deleting an State from the Table
    setStateData(record);
    try {
      customAxios
        .post(`${urlDeleteSelectedState}?StateId=${record.StateID}`)
        .then((response) => {
          if (response.data.data !== null) {
            const States = response.data.data.StateModel.map((obj, index) => {
              return { ...obj, key: index + 1 };
            });
            setColumnData(States);
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
    form.validateFields();
    const values = form.getFieldsValue();
    console.log("state Edit Modal Submit", values);
    setIsSubmitClicked(true);
    if (
      values.StateName !== undefined &&
      values.StateCode !== undefined &&
      values.Country !== undefined
    ) {
      const state = isEditing
        ? {
            StateId: stateData.StateID,
            StateName: values.StateName,
            StateCode: values.StateCode,
            CountryId: stateData.CountryId,
          }
        : {
            StateId: 0,
            StateName: values.StateName,
            StateCode: values.StateCode,
            CountryId: values.Country,
          };

      try {
        // Send a POST request to the server
        const response = await customAxios.post(urlAddAndUpdateState, state, {
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
              content: `State already exists`,
            });
          } else if (response.data.data !== null) {
            setIsSubmitClicked(false);
            setIsModalOpen(false);
            const stateDetails = response.data.data.StateModel.map(
              (obj, index) => {
                return { ...obj, key: index + 1 };
              }
            );
            setColumnData(stateDetails);
            {
              isEditing
                ? notification.success({
                    message: "State details updated Successfully",
                  })
                : notification.success({
                    message: "State details added Successfully",
                  });
            }
          } else {
            {
              isEditing
                ? notification.error({
                    message: "Edited State  details UnSuccessful",
                  })
                : notification.error({
                    message: "Adding State details UnSuccessful",
                  });
            }
          }
        }
      } catch (error) {
        console.error("Failed to send data to server: ", error);
      }
    } else {
      setIsSubmitClicked(false);
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
      title: "State Name",
      dataIndex: "StateName",
      key: "StateName",
      width: 150,
    },
    {
      title: "State Code",
      dataIndex: "StateCode",
      key: "StateCode",
      width: 150,
    },
    {
      title: "Country",
      dataIndex: "CountryName",
      key: "CountryName",
      width: 120,
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
          <PageHeader
            title={"State Manager"}
            buttonLabel={"Add New State"}
            buttonIcon={<PlusCircleOutlined />}
            onButtonClick={handleAddStateShowModal}
          />
          <Spin spinning={loading}>
            <CustomTable
              columns={columns}
              dataSource={columnData}
              actionColumn={true}
              isFilter={true}
              onEdit={handleStateEditModal}
              onDelete={handleDelete}
            />
          </Spin>
          {contextHolder}
          <Modal
            title={isEditing ? "Update State Details" : "Add New State"}
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
              <Button key="back" danger onClick={handleStateModalCancel}>
                Cancel
              </Button>,
            ]}
            onCancel={handleStateModalCancel}
          >
            <Form
              style={{ margin: "1rem 0" }}
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
            >
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
                  disabled={isEditing}
                  allowClear
                  placeholder="Select a type"
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
              <Form.Item
                name="StateCode"
                label="State Code"
                rules={[
                  {
                    required: true,

                    message: "Please enter state code",
                  },
                  {
                    pattern: new RegExp(/^[a-zA-Z]{1,5}$/),
                    message: "Enter valid state code",
                  },
                ]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                name="StateName"
                label="State Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter state name",
                  },
                ]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Layout>
    </>
  );
}

export default States;
