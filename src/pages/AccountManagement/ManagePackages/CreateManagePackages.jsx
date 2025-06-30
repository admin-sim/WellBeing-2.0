import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Button,
  Form,
  Spin,
  Input,
  Select,
  DatePicker,
  Popconfirm,
  message,
  AutoComplete,
} from "antd";
import {
  CloseSquareFilled,
  DeleteOutlined,
  LeftOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import PatientHeader from "../../../components/PatientHeader/index.jsx";
import Title from "antd/es/typography/Title";
import Layout from "antd/es/layout/layout";
import {
  urlDeactivateseletededP,
  urlGetPatientHeaderDetails,
  urlIncludeInPackage,
  urlManagePagkage,
  urlPackageDescriptionService,
  urlPackageDescriptionServiceClassification,
  urlPackageDescriptionServiceGroup,
  urlSearchPatientAccountcharge,
} from "../../../../endpoints.js";
import customAxios from "../../../components/customAxios/customAxios.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs } from "antd";
import CustomTable from "../../../components/customTable/index.jsx";
import moment from "moment";
import PageHeader from "../../../components/PageHeader/index.jsx";
import dayjs from "dayjs";
import { set } from "lodash";

const CreateManagePackages = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const PatientId = location.state?.patientId;
  const EncounterId = location.state?.encounterId;
  const [patientData, setPatientData] = useState(null);
  const [indicatorData, setIndicatorData] = useState(null);
  const { TabPane } = Tabs;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [packageData, setPackageData] = useState([]);
  const [packageData1, setPackageData1] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [url, setUrl] = useState();

  useEffect(() => {
    if (!PatientId || !EncounterId) {
      navigate("/ManagePackages");
    } else {
      fetchDataHeader();
      fetchPackageData();
    }
  }, []);

  const fetchDataHeader = async () => {
    try {
      const response = await customAxios.get(
        `${urlGetPatientHeaderDetails}?PatientId=${PatientId}&EncounterId=${EncounterId}`
      );
      if (response.status === 200 && response.data != null) {
        const detailsheader = response.data.data.EncounterModel;
        setPatientData(detailsheader);
      }
    } catch (error) {}
  };

  const fetchPackageData = async () => {
    setLoading(true);
    try {
      const response = await customAxios.get(
        `${urlManagePagkage}?Patient=${PatientId}&EncounterId=${EncounterId}`
      );
      if (response.status === 200 && response.data?.data) {
        setPackageData(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      setPackageData([]);
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleCreateService = async () => {
    navigate("/ManagePackages");
  };

  const utilizationColumns = [
    {
      title: "Service Names",
      dataIndex: "ServiceName",
      key: "ServiceName",
      width: 80,
      align: "center",
    },
    {
      title: "Date",
      dataIndex: "BillType",
      key: "BillType",
      align: "center",
      width: 100,
    },
    {
      title: "Amount",
      dataIndex: "NetAmount",
      key: "NetAmount",
      align: "center",
      width: 120,
    },
    {
      title: "Package Amount",
      dataIndex: "PackageAmount",
      key: "PackageAmount",
      align: "center",
      width: 120,
    },
    {
      title: "Patient Amount",
      dataIndex: "ChargeAmount",
      key: "ChargeAmount",
      align: "center",
      width: 120,
    },
    {
      title: "Coverage",
      dataIndex: "IsChargeApplicable",
      key: "IsChargeApplicable",
      align: "center",
      width: 120,
    },
    {
      title: "Action",
      key: "actions",
      align: "center",
      width: 100,
      render: (text, record) => {
        const msg = record.IsIncludeInPackage
          ? "Are you sure to Include Service In Package?"
          : "Are you sure to Exclude Service From Package?";
        const icon = !record.IsIncludeInPackage ? (
          <DeleteOutlined />
        ) : (
          <UndoOutlined />
        );

        return (
          <Popconfirm
            title={msg}
            onConfirm={() =>
              handleDelete(
                record.ChargeID,
                record.IsIncludeInPackage ? 0 : 1,
                1
              )
            }
          >
            <Button type="text" icon={icon} size="medium" />
          </Popconfirm>
        );
      },
    },
  ];

  function handleIndicatorChange(value) {
    setDisable(value == 2060 ? true : false);
    switch (value) {
      case 2063:
        setUrl(urlPackageDescriptionService);
        break;
      case 2062:
        setUrl(urlPackageDescriptionServiceGroup);
        break;
      default:
        setUrl(urlPackageDescriptionServiceClassification);
        break;
    }
    setProductOptions([]);
    form.setFieldsValue({ Description: "" });
    form.setFieldsValue({ DescriptionId: 0 });
  }

  async function handleDelete(chargeId, active, UType) {
    const url = UType === 0 ? urlDeactivateseletededP : urlIncludeInPackage;
    try {
      const response = await customAxios.get(
        `${url}?id=${chargeId}&type=${active}`
      );
      if (response.status === 200 && response.data?.data === "Success") {
        message.success("Package Status updated successfully");
        // fetchPackageData();
        UType === 0 ? fetchPackageData() : form.submit();
      }
    } catch (error) {
      setPackageData([]);
    }
  }

  const packageColumns = [
    {
      title: "Package",
      dataIndex: "PakageName",
      key: "PakageName",
      align: "center",
      width: 120,
    },
    {
      title: "Start Date",
      dataIndex: "StartDate",
      key: "StartDate",
      align: "center",
      width: 100,
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    {
      title: "End Date",
      dataIndex: "EndDate",
      key: "EndDate",
      align: "center",
      width: 100,
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    {
      title: "Package Amount",
      dataIndex: "PackageAmount",
      key: "PackageAmount",
      align: "center",
      width: 120,
    },
    {
      title: "Action",
      FontColor: "red",
      key: "actions",
      align: "center",
      width: 100,
      render: (text, record) => {
        const msg = record.Packageactive
          ? "Are you sure to De-Activate Package?"
          : "Are you sure to Activate Package?";
        const icon = record.Packageactive ? (
          <DeleteOutlined />
        ) : (
          <UndoOutlined />
        );

        return (
          <Popconfirm
            title={msg}
            onConfirm={() =>
              handleDelete(record.ChargeId, record.Packageactive ? 0 : 1, 0)
            }
          >
            <Button type="text" icon={icon} size="medium" />
          </Popconfirm>
        );
      },
    },
  ];

  const handleSelect = (value, option) => {
    form.setFieldsValue({ DescriptionId: option.key });
    form.setFieldsValue({ Description: option.value });
  };

  const handleSearch = async (searchText) => {
    if (searchText) {
      const response = await customAxios.get(
        `${url}?Description=${searchText}`
      );
      const apiData =
        url == urlPackageDescriptionService
          ? response.data.data
          : response.data;
      const newOptions = apiData.map((item) => ({
        value: item.Name,
        key: item.Id,
      }));
      setProductOptions(newOptions);
    }
  };

  async function handleFinish(values) {
    debugger;
    if (values.indicator === 2061) {
      values.IndicatorName = "Service Classification";
    }
    values.Orderdate = values.Orderdate
      ? values.Orderdate.format("YYYY-MM-DD")
      : "Null";
    values.Coverage = values.Coverage ? values.Coverage : "Null";
    const response = await customAxios.get(
      `${urlSearchPatientAccountcharge}?PatientId=${PatientId}&EncounterId=${EncounterId}&ServicepackageId=${values.DescriptionId}&IndicatorName=${values.IndicatorName}&IndicatorId=${values.indicator}&ServiceId=${values.DescriptionId}&Servicedate=${values.Orderdate}&Isapplicable=${values.Coverage}`
    );
    if (response.status === 200) {
      setPackageData1(response.data.data.PackageAccountCharge);
    }
  }

  return (
    <Layout style={{ zIndex: "999999999" }}>
      <div
        style={{
          width: "100%",
          backgroundColor: "white",
          minHeight: "max-content",
          borderRadius: "10px",
        }}
      >
        <PageHeader
          title={"Manage Packages"}
          buttonLabel="Back"
          buttonIcon={<LeftOutlined />}
          onButtonClick={handleCreateService}
        />
        <div style={{ margin: "0 2rem 1rem 2rem" }}>
          <PatientHeader patient={patientData} />
        </div>
        <div style={{ margin: "20px" }}>
          <Tabs type="line" defaultActiveKey="1">
            <TabPane tab="Patient Package Detais" key="1">
              <CustomTable
                loading={loading}
                isFilter={true}
                scroll={{ x: 800 }}
                actionColumn={false}
                columns={packageColumns}
                dataSource={packageData.PackageModelList}
              />
            </TabPane>
            <TabPane tab="Utilization Details" key="2">
              <Form layout="vertical" form={form} onFinish={handleFinish}>
                <Row gutter={16} style={{ margin: "1rem" }}>
                  <Col span={4}>
                    <Form.Item
                      name="indicator"
                      label="Indicator"
                      rules={[
                        {
                          required: true,
                          message: "Required.",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select Indicator"
                        allowClear
                        onChange={handleIndicatorChange}
                      >
                        {(packageData?.Indicator ?? [])
                          .filter((i) => i.LookupID !== 12152)
                          .map((response) => (
                            <Select.Option
                              key={response.LookupID}
                              value={response.LookupID}
                            >
                              {response.LookupDescription}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="Description"
                      label="Description"
                      rules={[
                        {
                          required: !disable,
                          message: "Required.",
                        },
                      ]}
                    >
                      <AutoComplete
                        options={productOptions}
                        onSearch={handleSearch}
                        onSelect={(value, option) =>
                          handleSelect(value, option)
                        }
                        onChange={(value) => {
                          if (!value) {
                            setProductOptions([]);
                          }
                        }}
                        allowClear={{
                          clearIcon: <CloseSquareFilled />,
                        }}
                        disabled={disable}
                      />
                    </Form.Item>
                    <Form.Item name="DescriptionId" hidden>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item name="Orderdate" label="Order Date">
                      <DatePicker
                        placeholder="Please Pick Date"
                        format={"DD-MM-YYYY"}
                        style={{ width: "100%" }}
                        disabledDate={(current) =>
                          current && current > dayjs().endOf("day")
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item name="Coverage" label="Coverage">
                      <Select placeholder="Select Value" allowClear>
                        <Select.Option value="1">Covered</Select.Option>
                        <Select.Option value="0">Not Covered</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ marginRight: 8, marginTop: "1.9rem" }}
                    >
                      Select
                    </Button>
                    <Button onClick={handleReset} danger>
                      Reset
                    </Button>
                  </Col>
                </Row>
              </Form>
              <CustomTable
                scroll={{ x: 800 }}
                actionColumn={false}
                columns={utilizationColumns}
                dataSource={packageData1}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default CreateManagePackages;
