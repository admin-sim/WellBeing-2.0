import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Layout,
  Row,
  Select,
  Table,
  Tabs,
} from "antd";
import React, { useState } from "react";
import PageHeader from "../../../components/PageHeader";
import PatientHeader from "../../../components/PatientHeader";
import { useForm } from "antd/es/form/Form";
import {
  ColWithEightSpan,
  ColWithSixSpan,
  ColWithSixteenSpan,
} from "../../../components/customGridColumns";
import TextArea from "antd/es/input/TextArea";
import { EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import CustomTable from "../../../components/customTable";
import AddAllocationModal from "./AddAllocationModal";
import { FaAnglesLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function CreateReceipt() {
  const [form] = useForm();
  const [addAllocationModalOpen, setAddAllocationModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isDepositChecked, setIsDepositChecked] = useState(false);
  const [recievedFromField, setRecievedFromField] = useState(true);

  const [dataSource1, setDataSource1] = useState([
    {
      key: uuidv4(), // Ensure each row has a unique key
      PaymentType: "",
      Amount: "",
      Bank: "",
      Branch: "",
      IFSCCode: "",
      AuthorizationRefNo: "",
      CardChequeNumber: "",
      Date: "",
      ExpiryDate: "",
      Remarks: "",
    },
  ]);

  const navigate = useNavigate();

  function handleAddAllocationModalOpen() {
    setAddAllocationModalOpen(true);
  }

  function handleAddAllocationModalSubmit(values) {
    console.log("Values from Add Allocation Modal ", values);
  }

  const handleCheckboxChange = (e) => {
    setIsDepositChecked(e.target.checked);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  const columns1 = [
    {
      title: "Payment Type",
      dataIndex: "PaymentType",
      key: uuidv4(),
      render: (text, record, key) => <Select style={{ width: "100%" }} />,
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      key: uuidv4(),
      render: (text, record, key) => <Input />,
    },
    {
      title: "Bank",
      dataIndex: "Bank",
      key: uuidv4(),
      render: (text, record, key) => <Select style={{ width: "100%" }} />,
    },
    {
      title: "Branch",
      dataIndex: "Branch",
      key: uuidv4(),
      render: (text, record, key) => <Input />,
    },
    {
      title: "IFSC Code",
      dataIndex: "IFSCCode",
      key: uuidv4(),
      render: (text, record, key) => <Input />,
    },
    {
      title: "Authorization Ref No.",
      dataIndex: "AuthorizationRefNo",
      key: uuidv4(),
      render: (text, record, key) => <Input />,
    },
    {
      title: "Card/Cheque Number",
      dataIndex: "CardChequeNumber",
      key: uuidv4(),
      render: (text, record, key) => <Input />,
    },
    {
      title: "Date",
      dataIndex: "Date",
      key: uuidv4(),
      render: (text, record, key) => <Input />,
    },
    {
      title: "Expiry Date",
      dataIndex: "ExpiryDate",
      key: uuidv4(),
      render: (text, record, key) => <Input />,
    },
    {
      title: "Remarks",
      dataIndex: "Remarks",
      key: uuidv4(),
      render: (text, record, key) => <Input />,
    },
  ];

  const columns2 = [
    {
      title: "Indicator",
      dataIndex: "Indicator",
      key: uuidv4(),
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: uuidv4(),
    },
    {
      title: "Patient Type",
      dataIndex: "PatientType",
      key: uuidv4(),
    },
    {
      title: "Encounter Id",
      dataIndex: "EncounterId",
      key: uuidv4(),
    },
    {
      title: "Percentage",
      dataIndex: "Percentage",
      key: uuidv4(),
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      key: uuidv4(),
    },
    {
      title: "Utilized",
      dataIndex: "Utilized",
      key: uuidv4(),
    },
    {
      title: "Balance",
      dataIndex: "Balance",
      key: uuidv4(),
    },
  ];

  const dataSource2 = [{}];
  const columns3 = [
    {
      title: "Bill Number",
      dataIndex: "BillNumber",
      key: uuidv4(),
    },
    {
      title: "Bill Date",
      dataIndex: "BillDate",
      key: uuidv4(),
    },
    {
      title: "Document Type",
      dataIndex: "DocumentType",
      key: uuidv4(),
      render: (text, record, key) => (
        <span style={{ color: "#272EFD", fontWeight: "600" }}>{text}</span>
      ),
    },
    {
      title: "Encounter Id",
      dataIndex: "EncounterId",
      key: uuidv4(),
    },
    {
      title: "Bill Amount",
      dataIndex: "BillAmount",
      key: uuidv4(),
    },
    {
      title: "OutStanding Amount",
      dataIndex: "OutStandingAmount",
      key: uuidv4(),
    },
    {
      title: "Receipt Amount",
      key: uuidv4(),
      render: (text, record, key) => (
        <Input disabled={!selectedRowKeys.includes(record.key)} />
      ),
    },
  ];

  const dataSource3 = [
    {
      key: "1",
      BillNumber: "Bill1",
      BillDate: "2020-01-01",
      DocumentType: "Document1",
      EncounterId: "Encounter1",
      BillAmount: "100.00",
      OutStandingAmount: "50.00",
    },
  ];

  const items = [
    {
      key: 1,
      label: "Receipt Details",
      children: (
        <>
          <Row gutter={32}>
            <ColWithSixteenSpan>
              <Row gutter={16}>
                <ColWithSixSpan>
                  <Form.Item
                    name="RecievedFrom"
                    label={
                      <div>
                        <span>Recieved From</span>
                        <Button
                          type="link"
                          icon={<EditOutlined />}
                          style={{ marginLeft: "1rem" }}
                          onClick={() =>
                            setRecievedFromField(!recievedFromField)
                          }
                        />
                      </div>
                    }
                  >
                    <Input disabled={recievedFromField} />
                  </Form.Item>
                </ColWithSixSpan>
                <ColWithSixSpan>
                  <Form.Item name="Receipt Date" label="Receipt Date">
                    <Input />
                  </Form.Item>
                </ColWithSixSpan>
                <ColWithSixSpan
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Form.Item name="Deposit" label=" ">
                    <Checkbox
                      checked={isDepositChecked}
                      onChange={handleCheckboxChange}
                    >
                      Deposit
                    </Checkbox>
                  </Form.Item>
                </ColWithSixSpan>
                <ColWithSixSpan>
                  <Form.Item
                    hidden={isDepositChecked}
                    name="DocumentType"
                    label="Document Type"
                  >
                  <Select  >
                    <Select.Option key="Regular" value="Regular"></Select.Option>
                    <Select.Option
                      key="Pharmacy"
                      value="Pharmacy"
                    ></Select.Option>
                  </Select>
                  </Form.Item>
                </ColWithSixSpan>
                <ColWithEightSpan>
                  <Form.Item name="DepositType" label="Deposit Type">
                  <Select  >
                    <Select.Option key="Pre payment" value="Pre payment"></Select.Option>
                    <Select.Option
                      key="Security Deposit"
                      value="Security Deposit"
                    ></Select.Option>
                  </Select>
                  </Form.Item>
                </ColWithEightSpan>
                <ColWithEightSpan>
                  <Form.Item name="ReceiptAmount" label="Receipt Amount">
                    <Input />
                  </Form.Item>
                </ColWithEightSpan>
                <ColWithEightSpan>
                  <Form.Item
                    hidden={isDepositChecked}
                    name="Outstanding"
                    label="Total Bill Outstanding Amount"
                  >
                    <Input />
                  </Form.Item>
                </ColWithEightSpan>
              </Row>
            </ColWithSixteenSpan>
            <ColWithEightSpan>
              <Form.Item label="Remarks" name="Remarks">
                <TextArea
                  autoSize={{
                    minRows: 3,
                    maxRows: 5,
                  }}
                  allowClear
                />
              </Form.Item>
            </ColWithEightSpan>
          </Row>
        </>
      ),
    },
    {
      key: 2,
      label: "Allocation Details",
      children: (
        <div
          style={{ border: "1px solid #ddd", borderRadius: "10px 10px 0 0" }}
        >
          <PageHeader
            title={"Allocation"}
            buttonIcon={<PlusCircleOutlined />}
            buttonLabel={"Add"}
            onButtonClick={handleAddAllocationModalOpen}
          />
          <CustomTable
            columns={columns2}
            dataSource={dataSource2}
            isFilter={false}
          />
        </div>
      ),
    },
    {
      key: 3,
      label: "Associate Bills   ",
      children: (
        <div style={{ border: "1px solid #ddd" }}>
          <Table
            rowSelection={rowSelection}
            columns={columns3}
            dataSource={dataSource3}
          />
        </div>
      ),
    },
  ];

  const visibleItems = isDepositChecked
    ? [items[0], items[1]]
    : [items[0], items[2]];

  const handleAddRow = () => {
    const newRow = {
      key: uuidv4(),
      PaymentType: "",
      Amount: "",
      Bank: "",
      Branch: "",
      IFSCCode: "",
      AuthorizationRefNo: "",
      CardChequeNumber: "",
      Date: "",
      ExpiryDate: "",
      Remarks: "",
    };
    setDataSource1([...dataSource1, newRow]);
  };

  const handleDeleteRow = (key) => {
    setDataSource1(dataSource1.filter((row) => row.key !== key));
  };

  return (
    <Layout
      style={{
        width: "100%",
        backgroundColor: "white",
        minHeight: "max-content",
        borderRadius: "10px",
      }}
    >
      <PageHeader
        title={"Receipt Create"}
        buttonIcon={<FaAnglesLeft style={{ fontSize: "1rem" }} />}
        buttonLabel={"Back"}
        onButtonClick={() => navigate("/Receipt")}
      />
      <div style={{ margin: "0 1rem 1rem 1rem" }}>
        <PatientHeader style={{ marginBottom: "1rem" }} />
        <Form
          form={form}
          onFinish={(values) => console.log(values)}
          layout="vertical"
        >
          <Tabs type="card" defaultActiveKey="1" items={visibleItems} />
          <Divider style={{ marginTop: "0" }} />
          <CustomTable
            actionColumnName={
              <Button
                type="link"
                onClick={handleAddRow}
                icon={<PlusCircleOutlined style={{ fontSize: "1.5rem" }} />}
              />
            }
            onDelete={handleDeleteRow}
            columns={columns1}
            dataSource={dataSource1}
          />
          <Row justify={"end"} gutter={16}>
            <Col>
              <Form.Item>
                <Button htmlType="submit" type="primary">
                  Save
                </Button>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button danger onClick={() => alert("Cancel Clicked")}>
                  Cancel
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
      <AddAllocationModal
        open={addAllocationModalOpen}
        handleClose={() => setAddAllocationModalOpen(false)}
        onSubmit={handleAddAllocationModalSubmit}
      />
    </Layout>
  );
}

export default CreateReceipt;
