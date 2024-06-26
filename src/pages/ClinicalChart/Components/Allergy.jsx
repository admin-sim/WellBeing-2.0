import { PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
} from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState } from "react";
import { FaHistory } from "react-icons/fa";
import {
  ColWithEightSpan,
  ColWithSixSpan,
  ColWithTwelveSpan,
} from "../../../components/customGridColumns";
import TextArea from "antd/es/input/TextArea";

function Allergy() {
  const [allergyFormModal, setAllergyFormModal] = useState(false);
  const [form] = useForm();

  function showAllergyFormModal() {
    setAllergyFormModal(true);
  }

  const handleOk = () => {
    setAllergyFormModal(false);
  };
  const handleClose = () => {
    setAllergyFormModal(false);
  };

  function handleSaveAllergyDetails(values) {
    console.log(values);
  }
  const allergyCategoryOptions = [
    {
      value: "jack",
      label: "Jack",
    },
    {
      value: "lucy",
      label: "Lucy",
    },
    {
      value: "tom",
      label: "Tom",
    },
  ];

  return (
    <>
      <Row gutter={32}>
        <Col span={6}>
          <Button
            className="dfja"
            type="primary"
            size="middle"
            onClick={showAllergyFormModal}
          >
            <PlusCircleOutlined
              className="dfja"
              style={{ fontSize: "1.1rem" }}
            />
            Add Allergy Details
          </Button>
        </Col>
        <Col span={6}>
          <Button size="middle">
            Previous Allergy Details
            <FaHistory style={{ marginLeft: "0.5rem" }} />
          </Button>
        </Col>
      </Row>
      <Modal
        centered
        width={"70%"}
        title="Allergy Details"
        open={allergyFormModal}
        onOk={handleOk}
        onCancel={handleClose}
        maskClosable={false}
        footer={[
          <Button
            key="submit"
            size="middle"
            type="primary"
            onClick={() => form.submit()}
          >
            Save
          </Button>,
          <Button danger size="middle" key="back" onClick={handleClose}>
            Cancel
          </Button>,
        ]}
      >
        <p style={{ margin: "0rem 0 1rem 0" }}>
          Add Allergy Related Information of the Patient
        </p>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveAllergyDetails}
          scrollToFirstError={true}
        >
          <Row gutter={32}>
            <ColWithSixSpan>
              <Form.Item
                name="Category"
                label="Category"
                // hasFeedback
                // rules={[
                //   {
                //     required: true,
                //     message: "Please select title",
                //   },
                // ]}
              >
                <Select
                  placeholder="Select Category"
                  allowClear
                  options={allergyCategoryOptions}
                ></Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="Allergen" label="Allergen">
                <Select
                  placeholder="Select Allergen"
                  allowClear
                  options={allergyCategoryOptions}
                ></Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="ReactionType" label="Reaction Type">
                <Select
                  placeholder="Select Reaction Type"
                  allowClear
                  options={allergyCategoryOptions}
                ></Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="Reaction" label="Reaction">
                <Select
                  placeholder="Select Reaction"
                  allowClear
                  options={allergyCategoryOptions}
                ></Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="Confirmation" label="Confirmation">
                <Select
                  placeholder="Select Confirmation"
                  allowClear
                  options={allergyCategoryOptions}
                ></Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="Confirmation" label="Approximately">
                <Checkbox />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="since" label="Since">
                <Select
                  placeholder="Select"
                  allowClear
                  disabled
                  options={allergyCategoryOptions}
                ></Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Row gutter={16}>
                <ColWithEightSpan>
                  <Form.Item name="Day" label="Day">
                    <Input placeholder="Enter" disabled />
                  </Form.Item>
                </ColWithEightSpan>
                <ColWithEightSpan>
                  <Form.Item name="Month" label="Month">
                    <Input placeholder="Enter" disabled />
                  </Form.Item>
                </ColWithEightSpan>
                <ColWithEightSpan>
                  <Form.Item name="Year" label="Year">
                    <Input placeholder="Enter" disabled />
                  </Form.Item>
                </ColWithEightSpan>
              </Row>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="Status" label="Status">
                <Select
                  placeholder="Select Status"
                  allowClear
                  options={allergyCategoryOptions}
                ></Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="Severity" label="Severity">
                <Select
                  placeholder="Select Severity"
                  allowClear
                  options={allergyCategoryOptions}
                ></Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="onsetDate" label="Date of Onset (Approx.)">
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="DD-MM-YYYY"
                  allowClear
                />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan></ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="source" label="Source of Information">
                <Select
                  placeholder="Select Source of Information"
                  allowClear
                  options={allergyCategoryOptions}
                ></Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="reaction" label="Site of Reaction">
                <Select
                  placeholder="Enter Site of Reaction here"
                  allowClear
                  options={allergyCategoryOptions}
                ></Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="reliving" label="Reliving Factor">
                <Select
                  placeholder="Enter Reliving Factor here"
                  allowClear
                  options={allergyCategoryOptions}
                ></Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="closureDate" label="Date of Closure (Approx.)">
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="DD-MM-YYYY"
                  allowClear
                />
              </Form.Item>
            </ColWithSixSpan>
            <Col span={24}>
              <Form.Item name="remarks" label="Remarks">
                <TextArea rows={2} placeholder="Enter Remarks here"/>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default Allergy;
