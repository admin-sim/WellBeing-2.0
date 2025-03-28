import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import { urlGetExistingPrescription, urlGetPrescriptionHedderIdPhar } from "../../../../endpoints";
import CustomTable from "../../../components/customTable";
import customAxios from "../../../components/customAxios/customAxios";

function PrescriptionListModal({
  open,
  handleClose,
  handleSubmit,
  prescriptionlist,
  ShowPrescriptions,
  prescriptionlistPharmacy
}) {
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    handleClose();
  };
  const onFormSubmit = async (values) => {
    // Call handleSubmit passed as prop to process the form data
    await handleSubmit(values);

    // After submitting the form, reset the form and close the modal
    form.resetFields();
    handleClose(); // Close the modal
  };

    const ShowPrescriptions1=(record)=>{
      ShowPrescriptions(record);
    }

  const columns = [
    {
      title: "Sl No",
      dataIndex: "key",
      width: 80,
    },
    {
      title: "Order ID",
      dataIndex: "PrescriptionId",
      render: (text, record) => (
        <a onClick={() => ShowPrescriptions1(record)} style={{ color: "blue" }}>
          {text}
        </a>
      ),
    },
    {
      title: "Indent Number",
      dataIndex: "IndentNumber",
    },
    {
      title: "Indent Status",
      dataIndex: "IndentStatus",
    },
    {
      title: "Order Date",
      dataIndex: "PresDateString",
    },
    {
      title: "Encounter",
      dataIndex: "Encounter",
    },
    {
      title: "Patient Type",
      dataIndex: "PatientType",
    },
    {
      title: "Department",
      dataIndex: "DeptName",
    },
    {
      title: "Ordering Physician",
      dataIndex: "ProviderName",
    },
  ];


  const prescolumns = [
    {
      title: "Sl No",
      dataIndex: "key",
      width: 80,
    },
    {
      title: "Drug",
      dataIndex: "DrugName",

    },
    {
      title: "Route",
      dataIndex: "Route",
    },
    {
      title: "Frequency",
      dataIndex: "FrequencyName",
    },
    {
      title: "Interval in Days",
      dataIndex: "Interval",
    },
    {
      title: "Stock",
      dataIndex: "BalanceQty",
    },
    {
      title: "TQty",
      dataIndex: "TotalQty",
    },
    {
      title: "Instruction",
      dataIndex: "Instruction",
    },
  ];

  

  return (
    <div>
      <Modal
        title={"Prescription List"}
        open={open}
        maskClosable={false}
        footer={null}
        onCancel={handleCancel}
        width={1000}
      >
        <Form
          style={{ margin: "1rem 0" }}
          layout="vertical"
          form={form}
          onFinish={onFormSubmit}
          initialValues={
            {
              //ActiveFlag: "Active", // Default value for the "ActiveFlag" field
            }
          }
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="FromDate" label="From Date">
                <DatePicker
                  placeholder="DD-MM-YYYY"
                  format={"DD-MM-YYYY"}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="ToDate" label="To Date">
                <DatePicker
                  placeholder="DD-MM-YYYY"
                  format={"DD-MM-YYYY"}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="OrderingPhysician" label="Ordering Physician">
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={32} justify="end" style={{ marginBottom: "-2rem" }}>
            <Col>
              <Form.Item>
                <Button
                  size="middle"
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: "1rem" }}
                >
                  Search
                </Button>
                <Button
                  size="middle"
                  type="default"
                  danger
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Form.Item>
            </Col>
          </Row>

          <CustomTable
            isFilter={true}
            columns={columns}
            dataSource={prescriptionlist}
            actionColumn={false}
            // onEdit={handleEdit}
            //onDelete={handleDelete}
          />
           {prescriptionlistPharmacy?.length>0 && (
          <CustomTable
            isFilter={true}
            columns={prescolumns}
            dataSource={prescriptionlistPharmacy}
            actionColumn={false}
            // onEdit={handleEdit}
            //onDelete={handleDelete}
          />
           )}
       
        </Form>
      </Modal>
    </div>
  );
}

export default PrescriptionListModal;
