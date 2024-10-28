import React, { useEffect, useState } from "react";
import {
  Button,
  Carousel,
  Col,
  Modal,
  AutoComplete,
  Card,
  Dropdown,
  Layout,
  Table,
  Row,
  Segmented,
  Space,
  Form,
  message,
  Badge,
  Spin,
  Select,
  DatePicker,
  Input,
  Checkbox,
} from "antd";
import PageHeader from "../../../components/PageHeader";
import CustomTable from "../../../components/customTable";
import { useNavigate } from "react-router";
import {
  urlGetDischargeDetails,
  urlShowSearchDischargeClearance,
  urlSearchUHID,
} from "../../../../endpoints.js";
import customAxios from "../../../components/customAxios/customAxios";
import dayjs from "dayjs";
import {
  AppstoreOutlined,
  BarsOutlined,
  TabletOutlined,
  PieChartOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { forEach } from "lodash";
import { render } from "react-dom";

function DischargeClearance() {
  const [tableData, setTableData] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm();
  const [modalDD, setModalDD] = useState({
    FacilityDepartment: [],
    FacilityDepartmentServiceLocation: [],
    PatientType: []
  })
  const navigate = useNavigate();
  const handleEdit = (record) => {
    record.statusDots = []
    navigate("/EditDischargeClearance", { state: { record } });
  };
  const [autoCompleteOptions, setAutoCompleteOptions] = useState()
  const [loading, setLoading] = useState(true);
  const [tableData1, setTableData1] = useState([])

  useEffect(() => {
    customAxios.get(urlGetDischargeDetails).then((response) => {
      const disc = response.data.data.DischargeDetails.map((item, idx1) => {
        const statusDots = response.data.data.DischargeClearanceDetails.map((rowItem, idx) => {
          if (rowItem.PatientID === item.PatientID) {
            return (
              <Badge
                key={idx + 1}
                status={rowItem.ClearanceStatusString === 'Done' ? 'success' : 'error'}
                style={{ marginRight: 5 }}
              />
            );
          }
          return null;
        }).filter(rowItem => rowItem != null);
        return {
          ...item,
          key: idx1 + 1,
          statusDots: statusDots
        };
      });
      setTableData1(disc)
      setLoading(false)
    });
  }, [])

  const columns = [
    {
      title: "SL No",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Status",
      dataIndex: "statusDots",
      key: "statusDots",
    },
    {
      title: "UHID",
      dataIndex: "UHID",
      key: "UHID",
    },
    {
      title: "Patient Name",
      dataIndex: "PatientName",
      key: "PatientName",
    },
    {
      title: "Gender",
      dataIndex: "Gender",
      key: "Gender",
    },
    {
      title: "DOB",
      dataIndex: "DOB",
      key: "DOB",
      render: (_, record) => {
        return record.DOBString + ' (' + record.Age + ')'
      }
    },
    {
      title: "Encounter",
      dataIndex: "IDEncounter",
      key: "IDEncounter",
    },
    {
      title: "Department",
      dataIndex: "Department",
      key: "Department",
    },
    {
      title: "Service Location",
      dataIndex: "ServiceLocation",
      key: "ServiceLocation",
    },
    {
      title: "Provider",
      dataIndex: "Provider",
      key: "Provider",
    },
    {
      title: "Ward",
      dataIndex: "Ward",
      key: "Ward",
    },
    {
      title: "Bed",
      dataIndex: "Bed",
      key: "Bed",
    },
    {
      title: "Admission Date & Time",
      dataIndex: "ClearanceDateString",
      key: "ClearanceDateString",
    },
  ];

  const handleSearch = async () => {
    debugger
    customAxios.get(urlShowSearchDischargeClearance).then((response) => {
      setModalDD(response.data.data)
      setIsModalVisible(true)
    })
  }

  const GetUHID = (value) => {
    if (value !== "") {
      customAxios.get(`${urlSearchUHID}?Uhid=${value}`).then((response) => {
        const apiData = response.data.data;
        const newOptions = apiData.map((item) => ({
          value: item.UhId,
          key: item.UhId,
          PatientId: item.PatientId,
          PatientName: item.PatientFirstName + " " + item.PatientLastName,
        }));
        setAutoCompleteOptions(newOptions);
      });
    } else {

    }
  };

  const handleSelect = (value, option) => {
    debugger;
    form.setFieldsValue({ Name: option.PatientName });
    form.setFieldsValue({ PatientId: option.PatientId });
  };

  const onSearch = () => {
    debugger
    const value = form.getFieldsValue()
    // const search = {
    //   PatientUhid = $("#PatientUhid").val();
    //   PatientName = $("#Name").val();
    //   DischargeFrom :ExpectedDischargeFrom,
    //   DischargeTo :ExpectedDischargeFrom,
    //   DepartmentID: Department,
    //   ServiceLocationID: 0,
    //   ClearanceStatus = $("#ClearanceStatus").val();
    //   PatientType = $("#PatientType").val();
    // }
  }

  // const GetPatientHearder = async () => {
  //   try {
  //     const response = await customAxios.get(
  //       `${urlGetPatientHeaderDetails}?PatientId=${PatientId}&EncounterId=${EncounterId}`
  //     );
  //     if (response.status === 200 && response.data != null) {
  //       const detailsheader = response.data.data.EncounterModel;
  //       setPatientData(detailsheader);
  //     } else {
  //     }
  //   } catch (error) { }
  // }

  return (
    <>
      <Layout
        style={{
          backgroundColor: "white",
          height: "max-content",
          borderRadius: "10px",
          width: "100%",
        }}
      >
        <PageHeader title={"Discharge Clearance"} buttonIcon={<PieChartOutlined />} onButtonClick={handleSearch} />
        <Spin spinning={loading}>
          <CustomTable
            columns={columns}
            dataSource={tableData1}
            onEdit={handleEdit}
          />
        </Spin>
        <Modal
          width={"75%"}
          title="Search Discharge Clearance"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          // onOk={details.handleOk}
          // // okButtonProps={{ disabled: IsVisitCreated }}
          // //confirmLoading={ModalLoader}
          // okText="Submit"
          maskClosable={false}
          footer={[
            <Button
              key="submit"
              type="primary"
              // loading={details.submitLoader}
              onClick={onSearch}
            // disabled={details.IsVisitCreated}
            >
              Search
            </Button>,
            <Button key="Close" onClick={() => form.resetFields()}>
              Reset
            </Button>,
          ]}
        >
          <Card>
            <Form
              style={{ marginTop: "1rem" }}
              layout="vertical"
              form={form}
              // onFinish={handleSubmit}
              initialValues={{
                ExpectedDischargeFrom: dayjs().subtract(1, 'day'),
                ExpectedDischargeTo: dayjs(),
                ClearanceStatus: 'ALL'
              }}
            >
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={6}>
                  <Form.Item name="UHID" label='UHID'>
                    <AutoComplete
                      style={{ width: "100%" }}
                      options={autoCompleteOptions}
                      onSearch={(value) => GetUHID(value)}
                      onSelect={(value, option) => handleSelect(value, option)}
                      allowClear
                    />
                  </Form.Item>
                  <Form.Item name="PatientId" label='PatientId' hidden>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="Name" label='Name'>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="ExpectedDischargeFrom" label='Expected Discharge From'>
                    <DatePicker style={{ width: '100%' }} format='DD-MM-YYYY' />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="ExpectedDischargeTo" label='Expected Discharge To'>
                    <DatePicker style={{ width: '100%' }} format='DD-MM-YYYY' />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="Department" label='Department'>
                    <Select>
                      {modalDD.FacilityDepartment.map((option) => (
                        <Select.Option
                          key={option.DepartmentId}
                          value={option.DepartmentId}
                        >
                          {option.DepartmentName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="ServiceLocation" label='Service Location'>
                    <Select>
                      {modalDD.FacilityDepartmentServiceLocation.map((option) => (
                        <Select.Option
                          key={option.FacilityId}
                          value={option.FacilityId}
                        >
                          {option.FacilityName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="PatientType" label='Patient Type'>
                    <Select>
                      {modalDD.PatientType.map((option) => (
                        <Select.Option
                          key={option.LookupID}
                          value={option.LookupID}
                        >
                          {option.LookupDescription}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="ClearanceStatus" label='Clearance Status'>
                    <Select>
                      <Select.Option key='ALL' value='ALL'>ALL</Select.Option>
                      <Select.Option key='Pending' value='Pending'>Pending</Select.Option>
                      <Select.Option key='Done' value='Done'>Done</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="IncludeDischarged" label='Include Discharged' valuePropName="checked">
                    <Checkbox />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="IsPatientSpecific" label='Is Patient Specific' valuePropName="checked">
                    <Checkbox />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Modal>
      </Layout>
    </>
  );
}

export default DischargeClearance;
