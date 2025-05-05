import React, { useEffect, useState } from "react";
import PageHeader from "../../../../components/PageHeader";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Popconfirm,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useLocation, useNavigate } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import {
  ColWithEightSpan,
  ColWithSixSpan,
} from "../../../../components/customGridColumns";
import {
  urlCreate,
  urlDeleteSelectedWorkFlowScreen,
  urlEditWorkFlow,
  urlSaveWorkFlow,
  urlUpdateWorkFlow,
} from "../../../../../endpoints.js";
import FormItem from "antd/es/form/FormItem/index.js";
import { DeleteOutlined } from "@ant-design/icons";
function CreateEditWorkFlow() {
  const [form] = useForm();
  const [form1] = useForm();
  const [lists, setLists] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const record = location.state;
  const [facilityOptions, setFacilityOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [screen, setScreen] = useState();

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    setLoading(true);
    if (record ?? false) {
      try {
        const response = await customAxios.get(
          `${urlEditWorkFlow}?WorkFlowId=${record.WorkFlowId}`
        );
        if (response.status === 200 && response.data?.data) {
          const Model = response.data.data;
          setFacilityOptions(Model);
          form.setFieldsValue({
            FacilityId: Model.NewWorkFlowModel.FacilityId,
          });
          form.setFieldsValue({
            WorkFlowName: Model.NewWorkFlowModel.WorkFlowName,
          });
          form.setFieldsValue({
            WorkFlowId: Model.NewWorkFlowModel.WorkFlowId,
          });
          form.setFieldsValue({
            WorkFlowDescription: Model.NewWorkFlowModel.WorkFlowDescription,
          });
          form.setFieldsValue({
            IsWalkInPatient: Model.NewWorkFlowModel.IsWalkInPatient,
          });
        }
      } catch (error) {
        console.error("Failed to fetch:", error);
      }
      setLoading(false);
    } else {
      try {
        const response = await customAxios.get(urlCreate);
        if (response.status === 200 && response.data?.data) {
          const Model = response.data.data;
          setFacilityOptions(Model);
        }
      } catch (error) {
        console.error("Failed to fetch:", error);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (facilityOptions?.Screen) {
      const newScreen = facilityOptions?.Screen?.filter(
        (item) =>
          !facilityOptions?.WorkFlowScreens?.some(
            (item1) => item.ScreenId === item1.ScreenId
          )
      );
      setLists({
        list1: newScreen ?? [],
        list2: facilityOptions.WorkFlowScreens ?? [],
      });
    }
  }, [facilityOptions]);

  async function handleSubmit(values) {
    setLoading(true);
    const PostData = {
      NewWorkFlowModel: values,
      WorkFlowModel: lists.list1,
      WorkFlowModel1: lists.list2,
    };
    const url =
      values.WorkFlowId === undefined ? urlSaveWorkFlow : urlUpdateWorkFlow;
    const response = await customAxios.post(url, PostData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status == 200) {
      if (response.data === "Exists") {
        message.warning("WorkFlow Already Exists");
      } else {
        message.success(
          `WorkFlow ${
            values.WorkFlowId === undefined ? "Created" : "Updated"
          } Successfully`
        );
        setLoading(false);
        navigate("/Workflow");
      }
    }
  }

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === "list2" && destination.droppableId !== "list2") {
      return;
    }

    if (source.droppableId === "list1" && destination.droppableId === "list2") {
      const sourceList = [...lists[source.droppableId]];
      const destList = [...lists[destination.droppableId]];

      const [movedItem] = sourceList.splice(source.index, 1);
      destList.splice(destination.index, 0, movedItem);

      setLists({
        list1: sourceList,
        list2: destList,
      });
    }
  };

  // const onDragEnd = (result) => {
  //   const { source, destination } = result;
  //   if (!destination) return;

  //   const newLists = { ...lists };
  //   const [reorderedItem] = newLists[source.droppableId].splice(
  //     source.index,
  //     1
  //   );
  //   newLists[destination.droppableId].splice(
  //     destination.index,
  //     0,
  //     reorderedItem
  //   );
  //   setLists(newLists);
  // };

  function handlePlusClick(item) {
    form1.resetFields();
    {
      (item.Parameters || []).forEach((it) => {
        form1.setFieldsValue({ [it.ParameterName]: it.ActiveFlag });
      });
    }
    setIsModalOpen(true);
    setScreen(item);
  }

  async function handleDeleteClick(record, item) {
    debugger;
    if (item.WorkFlowScreenId === 0) {
      const [movedItem] = lists.list2.splice(0, 1);
      lists.list1.splice(1, 0, movedItem);

      setLists({
        list1: lists.list1,
        list2: lists.list2,
      });
    } else {
      try {
        const response = await customAxios.get(
          `${urlDeleteSelectedWorkFlowScreen}?WorkFlowId=${record.WorkFlowId}&WorkFlowScreenId=${item.WorkFlowScreenId}`
        );
        if (response.status === 200 && response.data?.data) {
          const Model = response.data.data;
        }
      } catch (error) {
        console.error("Failed to fetch:", error);
      }
    }
    fetchFacilities();
  }

  function onFinishmodal(value) {
    const filteredScreens = lists.list2.find(
      (i) =>
        screen?.ScreenId === i.ScreenId &&
        screen?.WorkFlowScreenId === i.WorkFlowScreenId
    );

    if (!filteredScreens) {
      console.error("Screen not found in list2. Cannot update parameters.");
      return;
    }

    const parameterMapping = {
      PatientId: 1,
      AppointmentId: 2,
      PatientType: 3,
      EncounterId: 4,
    };

    const selectedIds = [];
    const newParameters = Object.keys(parameterMapping).map((key) => {
      const isChecked = value[key];

      const existingParam = filteredScreens.Parameters?.find(
        (p) => p.ParameterName === key
      );

      if (isChecked) {
        selectedIds.push(parameterMapping[key]);
        return {
          ParameterName: key,
          ParameterId: parameterMapping[key],
          ActiveFlag: true,
        };
      } else if (existingParam) {
        return {
          // ...item,
          // ParameterId: parameterMapping[item.ParameterName] || 0,
          ParameterId: existingParam.ParameterId || 0,
        };
      } else {
        return null;
      }
    });

    const finalParams = newParameters.filter(Boolean);

    const formattedString =
      selectedIds.length > 0 ? `${selectedIds.join(",")},` : "0";

    console.log("Formatted Parameter String:", formattedString);

    setLists((prev) => ({
      ...prev,
      list2: prev.list2.map((item) => {
        if (
          item.ScreenId === filteredScreens.ScreenId &&
          item.WorkFlowScreenId === filteredScreens.WorkFlowScreenId
        ) {
          return {
            ...item,
            ParameterList: formattedString,
            Parameters: finalParams,
          };
        }
        return item;
      }),
    }));

    setScreen(null);
    setIsModalOpen(false);
  }

  function onCancelmodal() {
    setIsModalOpen(false);
  }

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "white",
        minHeight: "max-content",
        borderRadius: "10px",
      }}
    >
      <PageHeader title={"Create WorkFlow"} button={false} />
      <Spin spinning={loading} tip="loading...">
        <Form
          style={{ margin: "1rem" }}
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <ColWithSixSpan>
              <Form.Item
                name="FacilityId"
                label="Facility Name"
                rules={[{ required: true, message: "Please enter Facility" }]}
              >
                <Select placeholder="Select Facility">
                  {facilityOptions?.Facility?.map((option) => (
                    <Select.Option
                      key={option.FacilityId}
                      value={option.FacilityId}
                    >
                      {option.FacilityName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item
                name="WorkFlowName"
                label="WorkFlow Name"
                rules={[{ required: true, message: "Please enter Facility" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item hidden name="WorkFlowId">
                <Input />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item
                name="WorkFlowDescription"
                label="WorkFlow Description"
                rules={[{ required: true, message: "Please enter Facility" }]}
              >
                <Input />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="IsWalkInPatient" label=" ">
                <Checkbox>Is Walk-In Patient</Checkbox>
              </Form.Item>
            </ColWithSixSpan>
          </Row>
          <DragDropContext onDragEnd={onDragEnd} loading={loading}>
            <Row
              style={{
                height: "fit-content",
                padding: "1rem 0",
                border: "1px solid #ccc",
                borderRadius: "1rem",
                display: "flex",
                justifyContent: "space-evenly",
              }}
            >
              {Object.entries(lists)?.map(([listId, items]) => (
                <Droppable droppableId={listId} key={listId}>
                  {(provided, snapshot) => (
                    <Col span={8}>
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{
                          minHeight: "200px",
                          background: snapshot.isDraggingOver
                            ? "lightblue"
                            : "white",
                          border: "1px solid lightgrey",
                          borderRadius: "4px",
                          padding: "10px",
                        }}
                      >
                        {items?.map((item, index) => (
                          <Draggable
                            draggableId={item.ScreenId.toString()}
                            index={index}
                            key={item.ScreenId.toString()}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  userSelect: "none",
                                  padding: "0.5rem 1rem",
                                  margin: "0 0 0.5rem 0",
                                  backgroundColor: snapshot.isDragging
                                    ? "lightgreen"
                                    : "lavender",
                                  color: "black",
                                  border: "1px solid lightgrey",
                                  borderRadius: "4px",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  ...provided.dragHandleProps.style,
                                }}
                              >
                                <span>{item.ScreenName}</span>
                                {listId === "list2" && (
                                  <div style={{ display: "flex", gap: "5px" }}>
                                    <Button
                                      size="small"
                                      onClick={() => handlePlusClick(item)}
                                      style={{
                                        background: "#40A2E3",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                      }}
                                    >
                                      +
                                    </Button>
                                    <Popconfirm
                                      title="Are you sure to delete this item?"
                                      onConfirm={() =>
                                        handleDeleteClick(record, item)
                                      }
                                      okText="Yes"
                                      cancelText="No"
                                    >
                                      <Button
                                        size="small"
                                        danger
                                        icon={
                                          <DeleteOutlined
                                            style={{ fontSize: "0.9rem" }}
                                          />
                                        }
                                      ></Button>
                                    </Popconfirm>
                                    {/* <Button size="small"
                                      onClick={() => handleDeleteClick(item)}
                                      style={{
                                        background: "#40A2E3",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <DeleteOutlined />
                                    </Button> */}
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </Col>
                  )}
                </Droppable>
              ))}
            </Row>
          </DragDropContext>
          <Row gutter={16} justify="end" style={{ marginTop: "2rem" }}>
            <Col>
              <Form.Item>
                <Button
                  size="middle"
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: "1rem" }}
                >
                  {record ? "Update" : "Save"}
                </Button>
                <Button
                  size="middle"
                  type="default"
                  danger
                  onClick={() => {
                    navigate("/Workflow");
                  }}
                >
                  Cancel
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
      <Modal
        title="Parameter"
        onOk={() => form1.submit()}
        onCancel={onCancelmodal}
        width={500}
        open={isModalOpen}
        okText="Save"
        cancelText="Close"
      >
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            width: "100%",
          }}
          initialValues={{
            remember: true,
          }}
          // layout='vertical'
          onFinish={onFinishmodal}
          autoComplete="off"
          form={form1}
        >
          <Space direction="vertical" size="middle" style={{ display: "flex" }}>
            <Card title={screen?.Action} size="small">
              {(facilityOptions?.Parameter || []).map((item) => (
                <FormItem
                  initialValue={false}
                  valuePropName="checked"
                  name={item.ParameterName} // <- Use a consistent internal key
                  key={item.ParameterId}
                >
                  <Checkbox>{item.ParameterDescription}</Checkbox>
                </FormItem>
              ))}
            </Card>
          </Space>
        </Form>
      </Modal>
    </div>
  );
}

export default CreateEditWorkFlow;
