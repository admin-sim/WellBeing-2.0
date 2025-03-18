import React, { useEffect, useState } from "react";
import PageHeader from "../../../../components/PageHeader";
import { Button, Checkbox, Col, Form, Input, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { useLocation, useNavigate } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import {
  ColWithEightSpan,
  ColWithSixSpan,
} from "../../../../components/customGridColumns";
import {urlCreate} from "../../../../../endpoints.js";
function CreateEditWorkFlow() {
  const [form] = useForm();
  const [lists, setLists] = useState({});

  const [facilityOptions, setFacilityOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        debugger
        const response = await customAxios.get(urlCreate);
        if (response.status === 200 && response.data?.data?.Facility) {
          // Extract Facility data and set state
          setFacilityOptions(response.data.data.Facility);
        }
      } catch (error) {
        console.error("Failed to fetch facilities:", error);
      }
    };

    fetchFacilities();
  }, []);

  useEffect(() => {
    setLists({
      list1: [
        { id: "1", content: "Patient Registration" },
        { id: "2", content: "Appointment Search" },
        { id: "3", content: "Encounter" },
        { id: "4", content: "Patient Search" },
        { id: "5", content: "Billing" },
      ],
      list2: [],
    });
  }, []);
  const location = useLocation();
  const navigate = useNavigate();

  const record = location.state;

  function handleSubmit(values) {
    console.log(values);
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
      <Form
        style={{ margin: "1rem" }}
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          <ColWithSixSpan>
            <Form.Item
              name="FacilityName"
              label="Facility Name"
              rules={[{ required: true, message: "Please enter Facility" }]}
            >
              <Select placeholder="Select Facility">
                {facilityOptions.map((option) => (
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
        <DragDropContext onDragEnd={onDragEnd}>
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
                          draggableId={item.id}
                          index={index}
                          key={item.id}
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
                              {item.content}
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
    </div>
  );
}

export default CreateEditWorkFlow;
