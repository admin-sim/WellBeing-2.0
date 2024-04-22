import { Button, Col, Modal, Row, Select, Table } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useState } from "react";
import { FaHistory } from "react-icons/fa";

function FamilyHistory() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "Date",
      key: "Date",
    },
    {
      title: "Medical Officer",
      dataIndex: "MedicalOfficer",
      key: "MedicalOfficer",
    },
  ];

  const data = [
    {
      key: 1,
      Date: "27/09/2023",
      MedicalOfficer: "Dr. Akshat Sinha",
      description: "Father and mother are Diabetic.",
    },
  ];

  return (
    <>
      <Row gutter={32}>
        <Col span={18}>
          <TextArea rows={5} placeholder="Family Medical History" allowClear />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              margin: "1rem 0.5rem",
            }}
          >
            <Button type="primary">Save</Button>
          </div>
        </Col>
        <Col
          span={6}
          style={{
            marginTop: "3rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            size="middle"
            className="d-flex allignCenter"
            onClick={showModal}
          >
            Previous Family History
            <FaHistory style={{ marginLeft: "0.5rem" }} />
          </Button>
        </Col>
      </Row>
      <Modal
        title="Previous Family History"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleOk}
        maskClosable={false}
        footer={[
          <Button key="ok" type="primary" onClick={handleOk}>
            Close
          </Button>,
        ]}
      >
        <div>
          <span>Previous Deatils : </span>
          <Select
            defaultValue={["lastOneMonth"]}
            placeholder="Select Range"
            style={{
              margin: "0.5rem",
              width: "40%",
            }}
            options={[
              {
                value: "previousAll",
                label: "Previous All",
              },
              {
                value: "lastOneWeek",
                label: "Last One Week",
              },
              {
                value: "last15days",
                label: "Last 15 Days",
              },
              {
                value: "lastOneMonth",
                label: "Last 1 Month",
              },
              {
                value: "lastThreeMonths",
                label: "Last 3 Months",
              },
              {
                value: "lastSixMonths",
                label: "Last 6 Months",
              },
              {
                value: "lastOneYear",
                label: "Last 1 Year",
              },
            ]}
          />
        </div>
        <Table
          size="small"
          columns={columns}
          expandable={{
            expandedRowRender: (record) => (
              <span
                style={{
                  margin: 0,
                }}
              >
                {record.description}
              </span>
            ),
            // rowExpandable: (record) => record.name !== "Not Expandable",
          }}
          dataSource={data}
        />
      </Modal>
    </>
  );
}

export default FamilyHistory;
