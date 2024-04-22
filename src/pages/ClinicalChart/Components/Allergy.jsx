import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Modal, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState } from "react";
import { FaHistory } from "react-icons/fa";

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
          <Button>
            Previous Allergy Details
            <FaHistory style={{ marginLeft: "0.5rem" }} />
          </Button>
        </Col>
      </Row>
      <Modal
        title="Allergy Details"
        open={allergyFormModal}
        onOk={handleOk}
        onCancel={handleClose}
        maskClosable={false}
      >
        <div>
          <span>Add Allergy Related Information of the Patient</span>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveAllergyDetails}
          scrollToFirstError={true}
        >
          <Row gutter={16}>
            <Col span={3}>
              <Form.Item
                name="PatientTitle"
                label="Title"
                // hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please select title",
                  },
                ]}
              >
                <Select
                  placeholder="Select Category"
                  allowClear
                  options={allergyCategoryOptions}
                ></Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default Allergy;
