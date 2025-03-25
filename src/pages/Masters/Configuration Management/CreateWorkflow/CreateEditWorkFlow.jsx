import React, { useEffect, useState } from "react";
import PageHeader from "../../../../components/PageHeader";
import { Button, Checkbox, Col, Form, Input, message, Row, Select, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import { useLocation, useNavigate } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import {
  ColWithEightSpan,
  ColWithSixSpan,
} from "../../../../components/customGridColumns";
import { urlCreate, urlEditWorkFlow, urlSaveWorkFlow, urlUpdateWorkFlow } from "../../../../../endpoints.js";
function CreateEditWorkFlow() {
  const [form] = useForm();
  const [lists, setLists] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const record = location.state;
  const [facilityOptions, setFacilityOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFacilities = async () => {
      setLoading(true)
      if (record ?? false) {
        try {
          const response = await customAxios.get(`${urlEditWorkFlow}?WorkFlowId=${record.WorkFlowId}`);
          if (response.status === 200 && response.data?.data) {
            const Model = response.data.data
            setFacilityOptions(Model);
            form.setFieldsValue({ 'FacilityId': Model.NewWorkFlowModel.FacilityId })
            form.setFieldsValue({ 'WorkFlowName': Model.NewWorkFlowModel.WorkFlowName })
            form.setFieldsValue({ 'WorkFlowId': Model.NewWorkFlowModel.WorkFlowId })
            form.setFieldsValue({ 'WorkFlowDescription': Model.NewWorkFlowModel.WorkFlowDescription })
            form.setFieldsValue({ 'IsWalkInPatient': Model.NewWorkFlowModel.IsWalkInPatient })
          }
        } catch (error) {
          console.error("Failed to fetch:", error);
        }
        setLoading(false)
      } else {
        try {
          const response = await customAxios.get(urlCreate);
          if (response.status === 200 && response.data?.data) {
            const Model = response.data.data
            setFacilityOptions(Model);
          }
        } catch (error) {
          console.error("Failed to fetch:", error);
        }
        setLoading(false)
      }
    };
    fetchFacilities();
  }, []);

  // useEffect(() => {
  //   setLists({
  //     list1: [
  //       { id: "1", content: "Patient Registration" },
  //       { id: "2", content: "Appointment Search" },
  //       { id: "3", content: "Encounter" },
  //       { id: "4", content: "Patient Search" },
  //       { id: "5", content: "Billing" },
  //     ],
  //     list2: [],
  //   });
  // }, []);

  useEffect(() => {
    if (facilityOptions?.Screen) {
      const newScreen = facilityOptions?.Screen?.filter(
        (item) =>
          !facilityOptions?.WorkFlowScreens?.some((item1) => item.ScreenId === item1.ScreenId)
      );
      setLists({
        list1: newScreen ?? [],
        list2: facilityOptions.WorkFlowScreens ?? [],
      });
    }
  }, [facilityOptions]);


  async function handleSubmit(values) {
    debugger
    setLoading(true);
    const PostData = {
      NewWorkFlowModel: values,
      WorkFlowModel: lists.list1,
      WorkFlowModel1: lists.list2
    }
    const url = values.WorkFlowId === undefined ? urlSaveWorkFlow : urlUpdateWorkFlow;
    const response = await customAxios.post(url, PostData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status == 200) {
      if (response.data === 'Exists') {
        message.warning('WorkFlow Already Exists')
      } else {
        message.success(`WorkFlow ${values.WorkFlowId === undefined ? "Created" : "Updated"} Successfully`);
        setLoading(false);
        navigate("/Workflow");
      }
    }
  }

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const newLists = { ...lists };
    const [reorderedItem] = newLists[source.droppableId].splice(
      source.index,
      1
    );
    newLists[destination.droppableId].splice(
      destination.index,
      0,
      reorderedItem
    );
    setLists(newLists);
  };

  // if (loading) {
  //   return (
  //     <div style={{
  //       display: 'flex',
  //       justifyContent: 'center',
  //       alignItems: 'center',
  //       height: '100vh',
  //       backgroundColor: '#f0f2f5'
  //     }}>
  //       <Spin size="large" />
  //     </div>
  //   );
  // }

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
      <Spin spinning={loading} tip='loading...'>
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
                                  alignItems: "center",
                                  ...provided.dragHandleProps.style,
                                }}
                              >
                                {item.ScreenName}
                                {/* {item.content} */}
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
    </div>
  );
}

export default CreateEditWorkFlow;
