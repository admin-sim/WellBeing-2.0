import { DeleteOutlined, PlusCircleOutlined, CloseSquareFilled } from "@ant-design/icons";
import {
  Badge,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Row,
  Select, message,
  Space, AutoComplete,
  Table,
  Tabs,
} from "antd";
import { debounce } from "lodash";
import { useForm } from "antd/es/form/Form";
import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import CustomTable from "../../../components/customTable/index";
import { render } from "react-dom";
import customAxios from "../../../components/customAxios/customAxios";
import { urlPackageDescriptionServiceforclincal, urlGetServiceCharge, urlClinicalAddNewCharge, urlShowClinicalModal, urlSendTestsFOrLabModule } from "../../../../endpoints";
import dayjs from "dayjs";
import { PiDeviceMobileBold } from "react-icons/pi";

function Investigation(Patient) {
  const [dropDown, setDropDown] = useState({
    PatientAccountCharges: []
  })
  const [loading, setLoading] = useState(true)

  const UpdateDropDown = (value) => {
    debugger
    setDropDown((prevDropdown) => ({
      ...prevDropdown,
      PatientAccountCharges: value
    }));
  }

  const handleLoading = (status) => {
    setLoading(status)
  }

  const items = [
    {
      key: "1",
      label: "Order Details",
      children: <OrderDetails Patient={Patient} dropDown={dropDown} loading={loading} UpdateDropDown={UpdateDropDown} handleLoading={handleLoading} />,
    },
    {
      key: "2",
      label: "Previous Order Details",
      children: <PreviousOrderDetails Patient={Patient} loading={loading} />,
    },
    {
      key: "3",
      label: "Lab Reports",
      children: <LabReports Patient={Patient} />,
    },
  ];

  useEffect(() => {
    debugger
    async function fetch(params) {
      const response = await customAxios(`${urlShowClinicalModal}?Id=${0}&PatientID=${Patient.Patient.PatientId}&EncounterId=${Patient.Patient.Encounter}&FromDate=${dayjs()}&ToDate=${dayjs()}&flag=${1}&returnType=${2}`)
      if (response.status == 200) {
        setDropDown(response.data.data)
        setLoading(false)
      }
    }
    fetch()
  }, [dropDown])

  return (
    <>
      <div style={{ margin: "1rem 0" }}>
        <span style={{ fontSize: "1.1rem", fontWeight: 600 }}>
          Investigation
        </span>
      </div>
      <Tabs defaultActiveKey="1" items={items} />
    </>
  );
}

const OrderDetails = (Patient) => {
  const [form1] = useForm();
  const [loading, setLoading] = useState(false);
  const [serviceDetails, setServiceDetails] = useState();
  const [services, setServices] = useState([]);

  const handleAutoCompleteChangeDia = async (value) => {
    setLoading(true);
    try {
      if (!value.trim()) {
        setServices(null);
        setLoading(false);
        return;
      }
      const response = await customAxios.get(
        `${urlPackageDescriptionServiceforclincal}?Description=${value}`
      );
      const responseData = response.data.data || [];
      if (
        Array.isArray(responseData) &&
        responseData.length > 0 &&
        responseData[0].Id !== undefined
      ) {
        const newOptions = responseData
          .map((option) => ({
            value: option.Name,
            label: option.Name,
            key: option.Id,
          }))
        setServices(newOptions)
      } else {
        setServices(null);
        form1.setFieldValue("Services", "");
      }
    } catch (error) {
      setServices(null);
    }
    setLoading(false);
  };

  const debouncedHandleAutoCompleteChangeServiceDia = debounce(
    handleAutoCompleteChangeDia,
    300
  );

  const handleSelectDia = async (value, option) => {
    setLoading(true);
    if (option.key) {
      try {
        const newData = await fetchDataForSelectedService(option.key);
        setServiceDetails(newData)
        if (newData.servicePrice) {
          form1.setFieldsValue({
            Provider: newData.servicePrice.ProviderName,
            Amount: newData.servicePrice.ChargeAmount,
          });
        }
      } catch (error) {
        setLoading(false);
      }
    }
    setLoading(false);
  };

  const handleDeleteRow = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const columns = [
    {
      title: "Service Name",
      dataIndex: "ServiceName",
      width: 300,
    },
    {
      title: "Date",
      dataIndex: "StrServiceDate",
      width: 100,
    },
    {
      title: "Provider",
      dataIndex: "ProviderName",
      width: 180,
    },
    {
      title: "Charge Amount",
      dataIndex: "Rate", //ChargeAmount
      width: 150,
    },
    {
      title: "Action",
      width: 70,
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDeleteRow(record.key)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
    {
      title: "Lab Number",
      dataIndex: "LabNumber",
      width: 120,
    },
    {
      title: "Status",
      width: 120,
      render: (_, record) => (
        <Space>
          <Badge status={record.IsProfileTest ? "success" : 'error'} />
          <Badge status={record.IsSamplCollected ? "success" : 'error'} />
          <Badge status={record.IsResultEntryDone ? "success" : 'error'} />
          <Badge status={record.IsVerificationDone ? "success" : 'error'} />
          {/* <Badge status="error" />
          <Badge status="default" />
          <Badge status="processing" />
          <Badge status="warning" /> */}
        </Space>
      ),
    },
  ];

  const fetchDataForSelectedService = async (ServiceId) => {
    try {
      const response = await customAxios.get(
        `${urlGetServiceCharge}?ServiceId=${ServiceId}&PatientId=${Patient.Patient.Patient.PatientId}&EncounterId=${Patient.Patient.Patient.Encounter}`
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  };

  async function handleSendtoLab() {
    debugger
    Patient.handleLoading(true)
    const investigations = Patient.dropDown.PatientAccountCharges.filter(f => f.ServiceGroupID == 1042)
    const listnotsentToLab = investigations.filter(f => f.SamplColHeaderId == null || f.SamplColHeaderId == 0);
    if (listnotsentToLab.length > 0 && Patient.dropDown.LastEncounter.PatientType != 22) {
      const BillViewModel = {
        PatientId: Patient.Patient.Patient.PatientId,
        EncounterId: Patient.Patient.Patient.Encounter,
        IsAdvance: form1.getFieldValue('stat'),
        PFlag: 1,
        PatientAccountCharges: listnotsentToLab
      }
      const response = await customAxios.post(urlSendTestsFOrLabModule, BillViewModel, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status == 200) {
        Patient.UpdateDropDown(response.data.data.PatientAccountCharges)
        form1.resetFields()
        message.success("Investigations Has Been Sent Successfully.");
        Patient.handleLoading(false)
      }
      else {
        message.error('Failed To Send Investigations.')
        Patient.handleLoading(false)
      }
    }
    else {
      if (Patient.dropDown.LastEncounter.PatientType == 22) {
        message.success("For Out Patient Investigations Will Be Sent After Billing");
      } else {
        message.error("Please Add Some Investigations To Send.")
      }
      Patient.handleLoading(false)
    }
  }

  return (
    <>
      <span style={{ fontSize: "1rem", fontWeight: 600 }}>Order Entry</span>
      <Form
        layout="vertical"
        form={form1}
        onFinish={async (values) => {
          debugger
          setLoading(true)
          const service = {
            StrServiceDate: values.Date ? values.Date.format('DD-MM-YYYY') : '',
            PatientId: Patient.Patient.Patient.PatientId,
            ProviderID: serviceDetails.servicePrice.ProviderID,
            EncounterId: Patient.Patient.Patient.Encounter,
            ServiceId: serviceDetails.servicePrice.ServiceId,
            Rate: serviceDetails.servicePrice.ChargeAmount,
            ChargeAmount: serviceDetails.servicePrice.ChargeAmount,
            NetAmount: serviceDetails.servicePrice.ChargeAmount,
            PatientChargeAmount: serviceDetails.servicePrice.PatientChargeAmount,
            PatientTypeID: 22,
            OrderEntry: 1
          }
          const response = await customAxios.post(urlClinicalAddNewCharge, service, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.status == 200 && response.data != null) {
            Patient.UpdateDropDown(response.data.data.PatientAccountCharges)
            form1.resetFields()
            setLoading(false)
            message.success("Charge Added Successfully");
          }
        }}
        initialValues={{
          stat: false,
          Date: dayjs()
        }}
      >
        <Row gutter={32}>
          <Col span={6}>
            <Form.Item name="Service" label="Service">
              <AutoComplete
                options={services}
                //onSearch={handleAutoCompleteChange}
                onSearch={debouncedHandleAutoCompleteChangeServiceDia}
                onSelect={handleSelectDia}
                onChange={(value) => {

                }}
                allowClear={{
                  clearIcon: <CloseSquareFilled />,
                }}
                loading={loading}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="Date" label="Date">
              <DatePicker
                style={{ width: "100%" }}
                disabled
                defaultValue={moment()}
                format="DD-MM-YYYY"
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="Provider" label="Provider">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="Amount" label="Amount">
              <Input style={{ width: "100%" }} disabled />
            </Form.Item>
          </Col>
          <Col span={3} style={{ display: "flex", alignItems: "center" }}>
            <Button size="large" type="link" icon={<PlusCircleOutlined />} htmlType="submit" />
          </Col>
        </Row>
        <Row gutter={32}>
          <Col>
            <Button type="primary" size="middle" onClick={handleSendtoLab} loading={Patient.loading}>
              Send To Lab
            </Button>
          </Col>
          <Col>
            <Form.Item name="stat" valuePropName="checked">
              <Checkbox>STAT</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table loading={Patient.loading}
        columns={columns}
        dataSource={Patient.dropDown.PatientAccountCharges.filter((item) => item.ServiceGroupID == 1042)}
        title={() => <strong>Charge Details</strong>}
      />
    </>
  );
};

const PreviousOrderDetails = (Patient) => {
  const [form1] = useForm();

  useEffect(() => {
    debugger
    async function fetch() {
      const response = await customAxios(`${urlShowClinicalModal}?Id=${0}&PatientID=${Patient.Patient.PatientId}&EncounterId=${Patient.Patient.Encounter}&FromDate=${dayjs()}&ToDate=${dayjs()}&flag=${2}&returnType=${2}`)
      if (response.status == 200) {
        setDropDown(response.data.data)
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const [dataSource, setDataSource] = useState([
    {
      Encounter: "COH/IP107",
      ServiceName: "ANKLE JOINT[BOTH] X-RAY",
      ServiceDate: "6/7/2023 10:36:22 AM",
      OrderBy: "OCHUWA KANOBA",
    },
    {
      Encounter: "COH/IP107",
      ServiceName: "FULL BLOOD COUNT/[FBC]",
      ServiceDate: "6/7/2023 4:38:36 PM",
      OrderBy: "OCHUWA KANOBA",
    },
  ]);

  const columns = [
    {
      title: "Encounter",
      dataIndex: "Encounter",
    },
    {
      title: "Service Name",
      dataIndex: "ServiceName",
    },
    {
      title: "Service Date",
      dataIndex: "ServiceDate",
    },
    {
      title: "Order By",
      dataIndex: "OrderBy",
    },
  ];

  return (
    <>
      <Form
        layout="vertical"
        form={form1}
        onFinish={(values) => {
          console.log(values);
        }}
        style={{ marginBottom: "-2rem" }}
      >
        <Row gutter={32}>
          <Col span={6}>
            <Form.Item name="FromDate" label="From Date">
              <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="ToDate" label="To Date">
              <DatePicker
                style={{ width: "100%" }}
                defaultValue={moment()}
                format="DD-MM-YYYY"
              />
            </Form.Item>
          </Col>
          <Form.Item label=" ">
            <Col>
              <Button type="primary" style={{ width: "100%" }}>
                Select
              </Button>
            </Col>
          </Form.Item>
        </Row>
      </Form>
      <CustomTable
        columns={columns}
        dataSource={dataSource}
        actionColumn={false}
        isFilter={true}
      />
    </>
  );
};

const LabReports = () => {
  const [dataSource, setDataSource] = useState([
    {
      key: "1",
      TestName: "ANKLE JOINT[BOTH] X-RAY",
      LabNumber: "COH/LAB/240",
    },
    { key: "2", TestName: "FULL BLOOD COUNT/[FBC]", LabNumber: "COH/LAB/245" },
    { key: "3", TestName: "UREA", LabNumber: "COH/LAB/248" },
  ]);

  const columns = [
    {
      title: "Test Name",
      dataIndex: "TestName",
    },
    {
      title: "Lab Number",
      dataIndex: "LabNumber",
    },
  ];

  return (
    <>
      <span style={{ fontSize: "1rem", fontWeight: 600 }}>Lab Reports</span>
      <CustomTable
        rowSelection={{
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(
              `selectedRowKeys: ${selectedRowKeys}`,
              "selectedRows: ",
              selectedRows
            );
          },
          getCheckboxProps: (record) => ({
            // Column configuration not to be checked
            name: record.name,
          }),
        }}
        columns={columns}
        dataSource={dataSource}
        actionColumn={false}
      />
      <Row justify={"end"} style={{ margin: "-0.5rem 1rem" }}>
        <Col>
          <Button type="primary" size="middle">
            View Report
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default Investigation;
