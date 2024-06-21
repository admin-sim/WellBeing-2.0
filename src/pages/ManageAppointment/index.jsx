import {
  Button,
  Col,
  DatePicker,
  Form,
  Layout,
  Row,
  Select,
  Spin,
  Table,
} from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import {
  urlGetAllProviders,
  urlGetAllQueueProviders,
  urlSearchAppointRecord,
} from "../../../endpoints";
import customAxios from "../../components/customAxios/customAxios";
import moment from "moment";
import CancelAppointmentModal from "./CancelAppointmentModal";
import dayjs from "dayjs";
import TransferAppointmentModal from "./TransferAppointmentModal";

function ManageAppointment() {
  const [form] = Form.useForm();
  const [providersData, setProvidersData] = useState(null);
  const [providerLoading, setProviderLoading] = useState(false);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentsData, setAppointmentsData] = useState(null);
  const [appointmentCancelDetails, setAppointmentCancelDetails] =
    useState(null);
  const [appointmentTransferDetails, setAppointmentTransferDetails] =
    useState(null);
  const [cancelAppointmentModal, setCancelAppointmentModal] = useState(false);
  const [transferAppointmentModal, setTransferAppointmentModal] =
    useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setProviderLoading(true);
    try {
      const response = await customAxios.get(`${urlGetAllQueueProviders}`);
      if (response.data != null) {
        console.log(response.data);
        setProvidersData(response.data.data.Providers);
      } else {
        setProvidersData(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setProviderLoading(false);
    }
  };

  const appointmentColumns = [
    {
      title: "Sl. No.",
      dataIndex: "SlNo",
      key: "SlNo",
      width: 80,
      align: "center",
    },
    {
      title: "Action Type",
      key: "actions",
      align: "center",
      render: (_, row) => (
        <span style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button
            size="small"
            type="link"
            onClick={() => handleCancelAppointment(row)}
          >
            Cancel
          </Button>
          /
          <Button
            size="small"
            type="link"
            onClick={() => handleTransferAppointment(row)}
          >
            Transfer
          </Button>
        </span>
      ),
    },
    {
      title: "Appointment Date",
      dataIndex: "AppointmentDate",
      key: "AppointmentDate",
      align: "center",
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    {
      title: "Appointment Start Time",
      dataIndex: "FromTime",
      key: "FromTime",
      align: "center",
      render: (text) => moment(text, "HH:mm:ss").format("hh:mm A"),
    },
    {
      title: "Appointment End Time",
      dataIndex: "ToTime",
      key: "ToTime",
      align: "center",
      render: (text) => moment(text, "HH:mm:ss").format("hh:mm A"),
    },
    {
      title: "UHID",
      dataIndex: "PatientUHID",
      key: "PatientUHID",
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "PatientName",
      key: "PatientName",
      align: "center",
    },
    {
      title: "Remarks",
      dataIndex: "Remarks",
      key: "Remarks",
      align: "center",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Status",
      dataIndex: "PatientStatus",
      key: "PatientStatus",
      align: "center",
      render: (text) => `${text}`,
    },
  ];

  const handleCancelAppointment = (values) => {
    console.log("RowValues", values);
    setAppointmentCancelDetails(values);
  };

  useEffect(() => {
    if (appointmentCancelDetails) {
      setCancelAppointmentModal(true);
    }
    if (appointmentTransferDetails) {
      setTransferAppointmentModal(true);
    }
  }, [appointmentCancelDetails, appointmentTransferDetails]);

  const handleTransferAppointment = (values) => {
    setAppointmentTransferDetails(values);
    setTransferAppointmentModal(false);
  };

  return (
    <>
      <Layout>
        <Spin spinning={appointmentsLoading}>
          <div
            style={{
              width: "100%",
              backgroundColor: "white",
              minHeight: "max-content",
              borderRadius: "10px",
            }}
          >
            <Row
              style={{
                padding: "0.5rem 2rem 0.5rem 2rem",
                backgroundColor: "#40A2E3",
                borderRadius: "10px 10px 0px 0px ",
              }}
            >
              <Col span={23}>
                <Title
                  level={4}
                  style={{
                    color: "white",
                    fontWeight: 500,
                    margin: 0,
                    paddingTop: 0,
                  }}
                >
                  Manage Appointment
                </Title>
              </Col>
            </Row>
            <Form
              style={{ margin: "0.5rem 0 0 0" }}
              form={form}
              layout="vertical"
              size="small"
              onFinish={async (values) => {
                try {
                  setAppointmentsLoading(true);
                  const formattedDate = values?.Date
                    ? dayjs(values?.Date).format("DD-MM-YYYY")
                    : '""';
                  console.log("fomra", formattedDate);
                  const response = await customAxios.get(
                    `${urlSearchAppointRecord}?ProviderId=${values.ProviderId}&Date=${formattedDate}`
                  );
                  if (response.data != null) {
                    console.log(
                      "response",
                      response.data.data.ScheduleProviderAppointments
                    );
                    setAppointmentsData(
                      response.data.data.ScheduleProviderAppointments.map(
                        (appointment, index) => ({
                          ...appointment,
                          SlNo: index + 1,
                          key: index,
                        })
                      )
                    );
                  } else {
                    setAppointmentsData(null);
                  }
                } catch (error) {
                  console.error(error);
                } finally {
                  setAppointmentsLoading(false);
                }
              }}
            >
              <Row style={{ margin: "0 0rem" }} gutter={32}>
                <Col span={6}>
                  <Form.Item
                    name="ProviderId"
                    label="Provider"
                    rules={[
                      {
                        required: true,
                        message: "Provider is Required.",
                      },
                    ]}
                  >
                    <Select
                      loading={providerLoading}
                      showSearch
                      placeholder="Select the provider"
                      style={{ width: "100%" }}
                      onChange={(value) => console.log(value)}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.children
                          .toLowerCase()
                          .localeCompare(optionB.children.toLowerCase())
                      }
                    >
                      {providersData?.map((response) => (
                        <Select.Option
                          key={response.ProviderId}
                          value={response.ProviderId}
                        >
                          {response.ProviderName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="Date" label="Date">
                    <DatePicker
                      placeholder="DD-MM-YYYY"
                      format={"DD-MM-YYYY"}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col offset={2} span={3}>
                  <Form.Item label=" ">
                    <Button
                      style={{ width: "100%" }}
                      type="primary"
                      htmlType="submit"
                    >
                      Search
                    </Button>
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item label=" ">
                    <Button
                      style={{ width: "100%" }}
                      danger
                      type="default"
                      onClick={() => form.resetFields()}
                    >
                      Reset
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Table
              style={{ padding: "1rem" }}
              size="small"
              bordered
              columns={appointmentColumns}
              dataSource={appointmentsData}
            />
          </div>
          {cancelAppointmentModal && (
            <CancelAppointmentModal
              open={cancelAppointmentModal}
              onCancel={() => {
                setCancelAppointmentModal(false);
                setAppointmentCancelDetails(null);
              }}
              appointmentDetails={appointmentCancelDetails}
              setAppointmentsData={setAppointmentsData}
            />
          )}
          {transferAppointmentModal && (
            <TransferAppointmentModal
              open={transferAppointmentModal}
              onCancel={() => {
                setTransferAppointmentModal(false);
                setAppointmentTransferDetails(null);
              }}
              appointmentDetails={appointmentTransferDetails}
              setAppointmentsData={setAppointmentsData}
            />
          )}
        </Spin>
      </Layout>
    </>
  );
}

export default ManageAppointment;
