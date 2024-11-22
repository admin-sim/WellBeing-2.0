import { Button, Col, Form, Input, Layout, Row, Select } from "antd";
import React, { useState } from "react";
import PageHeader from "../../../components/PageHeader";
import { ColWithSixSpan } from "../../../components/customGridColumns";
import CustomTable from "../../../components/customTable";
import { v4 as uuidv4 } from "uuid";
import UhidSelectComponent from "../../../components/UhidSelectComponent";
import {
  urlGetAllVisitsForPatientId,
  urlRefundAction,
} from "../../../../endpoints";
import customAxios from "../../../components/customAxios/customAxios";
import { useNavigate } from "react-router-dom";
function Refund() {
  // const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [visits, setVisits] = useState([]);
  const [form] = Form.useForm();
  const [selectedUhId, setSelectedUhId] = useState(null);
  const [isEncounterDisabled, setIsEncounterDisabled] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [columns, setColumns] = useState([]);
  const [selectedRowKey, setSelectedRowKey] = useState(null);
  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: (selectedKeys) => {
  //     setSelectedRowKeys(selectedKeys);
  //   },
  // };
  const navigate = useNavigate();
  const rowSelection = {
    type: "radio", // Use radio button for selection
    selectedRowKeys: selectedRowKey ? [selectedRowKey] : [],
    onChange: (selectedKey, row) => {
      debugger;
      setSelectedRowKey(selectedKey[0]);
  
      // Navigate to PatientRefund with row data and formvalues.Source
      if (row && row.length > 0) {
        const formvalues = form.getFieldsValue();
  
        const selectedRow = row[0]; // Get the selected row data
        navigate("/PatientRefund", { 
          state: { 
            selectedRow,
            source: formvalues.Source // Include Source from formvalues
          } 
        });
      }
    },
  };
  

  const handleSelectUHID = (value, option) => {
    debugger;
    setSelectedUhId(value);
    if (value === undefined) {
      form.resetFields();
    } else
      form.setFieldsValue({
        PatientName: option.data.PatientFirstName,
        patientId: option?.data?.PatientId,
        // EncounterID: firstEncounter ? firstEncounter.EncounterId : ''
      });
    getencounters(option?.data?.PatientId);
  };

  const getencounters = async (patientid) => {
    debugger;
    try {
      const visitsResponse = await customAxios.get(
        `${urlGetAllVisitsForPatientId}?PatientId=${patientid}`
      );

      if (
        visitsResponse.data &&
        Array.isArray(visitsResponse.data.data.EncounterModellist)
      ) {
        setVisits(visitsResponse.data.data.EncounterModellist);
        const firstEncounter =
          visitsResponse.data.data.EncounterModellist.length > 0
            ? visitsResponse.data.data.EncounterModellist[0]
            : [];
        if (visitsResponse.data.data.EncounterModellist.length <= 1) {
          setIsEncounterDisabled(true);
        }

        form.setFieldsValue({
          Encounter: firstEncounter ? firstEncounter.EncounterId : "",
        });
      } else {
        setVisits([]);
      }
    } catch (error) {
      console.error("Error fetching visits data:", error);
      setVisits([]);
    }
  };

  const handleSelect = async (values) => {
    debugger;
    // long Patient, long EncounterId, string DocumentType, bool IsDeposit,bool IsPharmacy)
    if (values.Source == "Receipt") {
      const IsDeposit = false;
      const IsPharmacy = false;

      const response = await customAxios.get(
        `${urlRefundAction}?Patient=${values.patientId}&EncounterId=${values.Encounter}&DocumentType=${values.Source}&IsDeposit=${IsDeposit}&IsPharmacy=${IsPharmacy}`
      );
      if (response.status === 200 && response.data != null) {
        const data = response.data.data;
        setDataSource(getTableDataBasedOnDocType(data));
        setColumns(getColumnsBasedOnDocType(data));
        setShowTable(true);
      }
    } else if (values.Source == "Deposit") {
      const IsDeposit = true;
      const IsPharmacy = false;

      const response = await customAxios.get(
        `${urlRefundAction}?Patient=${values.patientId}&EncounterId=${values.Encounter}&DocumentType=${values.Source}&IsDeposit=${IsDeposit}&IsPharmacy=${IsPharmacy}`
      );
      if (response.status === 200 && response.data != null) {
        const data = response.data.data;
        setDataSource(getTableDataBasedOnDocType(data));
        setColumns(getColumnsBasedOnDocType(data));
        setShowTable(true);
      }
    } else if (values.Source == "Pharmacy") {
      const IsDeposit = false;
      const IsPharmacy = true;

      const response = await customAxios.get(
        `${urlRefundAction}?Patient=${values.patientId}&EncounterId=${values.Encounter}&DocumentType=${values.Source}&IsDeposit=${IsDeposit}&IsPharmacy=${IsPharmacy}`
      );
      if (response.status === 200 && response.data != null) {
        const data = response.data.data;
        setDataSource(getTableDataBasedOnDocType(data));
        setColumns(getColumnsBasedOnDocType(data));
        setShowTable(true);
      }
    }
  };

  const getColumnsBasedOnDocType = (data) => {
    switch (data.DocumentType) {
      case "Receipt":
      case "Deposit":
        return [
          {
            title: "Receipt Number",
            dataIndex: "ReceiptNumber",
          },
          {
            title: "Refund Amount",
            dataIndex: "RemainingAmount",
          },
        ];

      case "Pharmacy":
        return [
          {
            title: "Bill Number",
            dataIndex: "BillNumber",
          },
          {
            title: "Refund Amount",
            dataIndex: "BalanceAmount",
          },
        ];
      default:
        return [];
    }
  };

  const getTableDataBasedOnDocType = (data) => {
    let tableData = [];

    switch (data.DocumentType) {
      case "Receipt":
      case "Deposit":
        tableData = data.ReciptNums || [];
        break;
      case "Pharmacy":
        tableData = data.BillNums || [];
        break;
      default:
        tableData = [];
    }

    // Add a unique key to each item
    return tableData.map((item) => ({
      ...item,
      key: uuidv4(),
    }));
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
      <PageHeader title={"Patient Refund"} button={false} />
      <Form layout="vertical" form={form} onFinish={handleSelect}>
        <Row gutter={16} style={{ margin: "1rem" }}>
          <ColWithSixSpan>
            <Form.Item name="uhid" label="UHID">
              <UhidSelectComponent
                selectedUhId={selectedUhId}
                handleSelectUHID={handleSelectUHID}
              />
            </Form.Item>
          </ColWithSixSpan>
          <Form.Item label="Patient Name" name="patientId" hidden>
            <Input />
          </Form.Item>
          <ColWithSixSpan>
            <Form.Item name="PatientName" label="Name">
              <Input disabled />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item
              label="Encounter ID"
              name="Encounter"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                //value={initialFormState.visit}
                disabled={isEncounterDisabled}
              >
                {visits?.map((option) => (
                  <Select.Option
                    key={option.EncounterId}
                    value={option.EncounterId}
                  >
                    {option.GeneratedEncounterId}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Source Document Required.",
                },
              ]}
              name="Source"
              label="Source Document"
            >
              <Select allowClear>
                <Select.Option key="Receipt" value="Receipt">
                  Receipt
                </Select.Option>
                <Select.Option key="Deposit" value="Deposit">
                  Deposit
                </Select.Option>
                <Select.Option key="Pharmacy" value="Pharmacy">
                  Pharmacy
                </Select.Option>
              </Select>
            </Form.Item>
          </ColWithSixSpan>
        </Row>
        <Row gutter={16} justify={"end"} style={{ marginRight: "1rem" }}>
          <Col>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Select
              </Button>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Button danger>Reset</Button>
            </Form.Item>
          </Col>
        </Row>
        <CustomTable
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
          actionColumn={false}
          isFilter={true}
        />
      </Form>
    </Layout>
  );
}

export default Refund;
