import { Button, Col, Form, Modal, Row, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import { FaHistory } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

const options = [
  { value: "A00 - Cholera" },
  { value: "A01 - Typhoid and paratyphoid fevers" },
  { value: "A05 - Other bacterial foodborne intoxications" },
];

const dataForPreviousMedicalHistory = [
  {
    key: 1,
    SlNo: 1,
    Date: "27/09/2023",
    IcdCode: "A00",
    Description: "Cholera",
  },
  {
    key: 2,
    SlNo: 2,
    Date: "28/09/2023",
    IcdCode: "A09",
    Description: "Infectious gastroenteritis and colitis, unspecified",
  },
];

const columnsForPreviousMedicalHistory = [
  {
    title: "Sl. No.",
    dataIndex: "SlNo",
    key: "SlNo",
    width: 70,
  },

  {
    title: "Date",
    dataIndex: "Date",
    key: "Date",
    width: 100,
  },

  {
    title: "ICD Code",
    dataIndex: "IcdCode",
    key: "IcdCode",
    width: 100,
  },

  {
    title: "Description",
    dataIndex: "Description",
    key: "Description",
  },
];

function MedicalHistory() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedicalHistoryDetails, setSelectedMedicalHistoryDetails] =
    useState([]);
  const [form] = Form.useForm();

  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);

  const handleSelect = (value) => {
    setSelectedMedicalHistoryDetails([...selectedMedicalHistoryDetails, value]);
    form.resetFields();
  };

  const handleDelete = (record) => {
    setSelectedMedicalHistoryDetails(
      selectedMedicalHistoryDetails.filter((item) => item !== record.name)
    );
  };

  const data = selectedMedicalHistoryDetails.map((value, index) => ({
    key: `${index + 1}`,
    name: value,
    SlNo: index + 1,
  }));

  const columns = [
    { title: "Sl. No.", dataIndex: "SlNo", key: "SlNo",width:100 },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Action",
      key: "action",
      width:180,
      render: (_, record) => (
        <Button type="ghost" size="middle" onClick={() => handleDelete(record)}>
          <RiDeleteBin6Line />
        </Button>
      ),
    },
  ];
  useEffect(() => {
    console.log("selectedMedicalHistoryDetails", selectedMedicalHistoryDetails);
  }, [selectedMedicalHistoryDetails]);
  return (
    <>
      <Row>
        <Col span={18}>
          <div style={{ marginBottom: "1rem" }}>
            <Form form={form}>
              <Form.Item
                name="MedicalHistorySelect"
                label="Type at least 2 characters"
              >
                <Select
                  showSearch
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Search and Add"
                  onSelect={handleSelect}
                  options={options} // options should be defined
                />
              </Form.Item>
            </Form>
          </div>
        </Col>
        <Col span={6} className="d-flex justifyCenter">
          <Button
            size="middle"
            className="d-flex allignCenter"
            onClick={showModal}
          >
            Previous Medical History
            <FaHistory style={{ marginLeft: "0.5rem" }} />
          </Button>
        </Col>
      </Row>
      <Table size="small" columns={columns} dataSource={data} />
      <Modal
        title="Previous Medical History"
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
          <span>Previous Details : </span>
          <Select
            defaultValue={["lastOneMonth"]}
            placeholder="Select Range"
            style={{ margin: "0.5rem", width: "40%" }}
            options={[
              { value: "previousAll", label: "Previous All" },
              { value: "lastOneWeek", label: "Last One Week" },
              { value: "last15days", label: "Last 15 Days" },
              { value: "lastOneMonth", label: "Last 1 Month" },
              { value: "lastThreeMonths", label: "Last 3 Months" },
              { value: "lastSixMonths", label: "Last 6 Months" },
              { value: "lastOneYear", label: "Last 1 Year" },
            ]}
          />
        </div>
        <Table
          size="small"
          columns={columnsForPreviousMedicalHistory}
          dataSource={dataForPreviousMedicalHistory}
        />
      </Modal>
    </>
  );
}

export default MedicalHistory;
