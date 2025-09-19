import React, { useEffect, useState } from "react";
import {
  Layout,
  Spin,
  Modal,
  Button,
  Form,
  Row,
  Col,
  Select,
  Checkbox,
  message,
  notification,
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import CustomTable from "../../../../../components/customTable";
import customAxios from "../../../../../components/customAxios/customAxios";
import {
  urlGetTariffData,
  urlGetTariffPlanForFacility,
  urlSaveNewDefaultTariffPlan,
  urlDeleteDefaultTariff,
  urlEditDefaultTariff,
} from "../../../../../../endpoints";
import PageHeader from "../../../../../components/PageHeader";
import SearchableSelect from "../../../../../components/SearchableSelect";

function DefaultTariffPlan() {
  const [loading, setLoading] = useState(false);
  const [columnData, setColumnData] = useState();

  const [isLookUpModalVisible, setIsLookUpModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [indicatorData, setIndicatorData] = useState(null);
  const [indicatorData1, setIndicatorData1] = useState();
  const [IsSubmitClicked, setIsSubmitClicked] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [disable, setDisable] = useState(false);
  const [stateData, setStateData] = useState();
  const [form] = Form.useForm();

  const handleAddLookupShowModal = () => {
    setIsLookUpModalVisible(true);
    setIsEditing(false);
    setIsSubmitClicked(false);
    form.resetFields();
  };

  const handleLookUpModalCancel = () => {
    setIsLookUpModalVisible(false);
    setIsEditing(false);
    setIsSubmitClicked(false);
    form.resetFields();
  };

  useEffect(() => {
    fetchData();
    fetchData2();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await customAxios.get(urlGetTariffData);

      const { Facilities, Payer, PatientType, DefaultTariffPlans } =
        response.data.data;
      // Map each DefaultTariffPlan to a row, using IDs to look up names
      const rows = (DefaultTariffPlans ?? []).map((plan, index) => {
        const facility = (Facilities ?? []).find(
          (f) => f.FacilityId === plan.FacilityId
        );
        const payer = (Payer ?? []).find((p) => p.PayerId === plan.PayerId);
        const patientType = (PatientType ?? []).find(
          (pt) => pt.LookupID === plan.PatientTypeId
        );

        return {
          key: index + 1,
          DefaultTariffId: plan.DefaultTariffId,
          FacilityId: plan.FacilityId,
          PayerId: plan.PayerId,
          PatientTypeId: plan.PatientTypeId,
          PriceTariffId: plan.PriceTariffId,
          Facilities: facility ? facility.FacilityName : "",
          Payer: payer ? payer.PayerName : "",
          PatientType: patientType ? patientType.LookupDescription : "",
          DefaultTariffPlans: plan.PriceTariffName ?? "",

          CashPatient: plan.CashPatient ? 1 : 0,
        };
      });

      setColumnData(rows);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const columns = [
    {
      title: "Sl.No",
      dataIndex: "key",
      key: "key",
      width: "10%",
    },
    {
      title: "Facility",
      dataIndex: "Facilities",
      key: "Facilities",
    },
    {
      title: "Cash Patient",
      dataIndex: "CashPatient",
      key: "CashPatient",
      render: (value) => (value === 1 ? "Yes" : "No"),
    },
    {
      title: "Payer",
      dataIndex: "Payer",
      key: "Payer",
    },
    {
      title: "Patient type",
      dataIndex: "PatientType",
      key: "PatientType",
    },
    {
      title: "Default Price Tariff",
      dataIndex: "DefaultTariffPlans",
      key: "DefaultTariffPlans",
    },
  ];

  const fetchData2 = async () => {
    try {
      const response = await customAxios.get(`${urlGetTariffData}`);
      if (response.status === 200 && response.data != null) {
        const detailsheader = response.data.data;
        setIndicatorData(detailsheader);
      }
    } catch (error) {
      console.error("Error fetching package data:", error);
    }
  };

  const handleStateChange = async (value) => {
    try {
      // Update the options for the second select based on the value of the first select
      if (value != null) {
        const response = await customAxios.get(
          `${urlGetTariffPlanForFacility}?facilityId=${value}`
        );

        if (response.status === 200) {
          const details = response.data.data.BillTariffModels;

          setIndicatorData1(details);
        } else {
          // Handle other response statuses if needed
        }
      }
    } catch (error) {
      // Handle errors (e.g., network issues)
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async () => {
    debugger;
    await form.validateFields();
    const values = form.getFieldsValue();
    setIsSubmitClicked(true);

    if (values.FacilityId !== undefined) {
      const formdata = isEditing
        ? {
            DefaultTariffId: values.DefaultTariffId,
            FacilityId: values.FacilityId,
            CashPatient: values.CashPatient,
            PayerId: values.PayerId,
            PriceTariffId: values.PriceTariffId,
            PatientTypeId: values.PatientTypeId,
          }
        : {
            DefaultTariffId: 0,
            FacilityId: values.FacilityId,
            CashPatient: values.CashPatient,
            PayerId: values.PayerId,
            PriceTariffId: values.PriceTariffId,
            PatientTypeId: values.PatientTypeId,
          };

      try {
        const response = await customAxios.post(
          urlSaveNewDefaultTariffPlan,
          formdata,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data !== null) {
          if (response.data.data === "Already Exists") {
            setIsSubmitClicked(false);
            messageApi.warning({
              content: `Record already exists`,
            });
          } else if (response.data.data !== null) {
            setIsSubmitClicked(false);
            setIsLookUpModalVisible(false);

            isEditing
              ? notification.success({
                  message: " updated Successfully",
                })
              : notification.success({
                  message: " added Successfully",
                });
          } else {
            isEditing
              ? notification.error({
                  message: "edit UnSuccessful",
                })
              : notification.error({
                  message: "Adding UnSuccessful",
                });
          }
        }
        fetchData();
      } catch (error) {
        console.error("Failed to send data to server: ", error);
      }
    } else {
      setIsSubmitClicked(false);
    }
  };

  const handleDelete = async (record) => {
    try {
      const response = await customAxios.post(
        `${urlDeleteDefaultTariff}?DefaultTariffId=${record.DefaultTariffId}`
      );
      if (response.data && response.data.data === "Success") {
        notification.success({
          message: "Deleted Successfully",
        });
        fetchData();
      } else {
        notification.error({
          message: "Deletion Unsuccessful",
        });
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      notification.error({
        message: "Error deleting record",
      });
    }
  };

  const handleEditLookupModal = (record) => {
    debugger;
    setStateData(record);
    setLoading(true);
    setIsEditing(true);
    customAxios
      .get(`${urlEditDefaultTariff}?DefaultTariffId=${record.DefaultTariffId}`)
      .then((response) => {
        if (response.data !== null) {
          const stateData = response.data.data;
          setStateData(stateData);
          setIsLookUpModalVisible(true);
          form.setFieldsValue({
            FacilityId:
              record.FacilityId ||
              indicatorData?.Facilities?.find(
                (f) => f.FacilityName === record.Facilities
              )?.FacilityId,
            CashPatient: record.CashPatient === 1,
            PayerId:
              record.PayerId ||
              indicatorData?.Payer?.find((p) => p.PayerName === record.Payer)
                ?.PayerId,
            PriceTariffId:
              record.PriceTariffId ||
              indicatorData1?.find(
                (pt) => pt.PriceTariffName === record.DefaultTariffPlans
              )?.PriceTariffId,
            PatientTypeId:
              record.PatientTypeId ||
              indicatorData?.PatientType?.find(
                (pt) => pt.LookupDescription === record.PatientType
              )?.LookupID,
            DefaultTariffId: record.DefaultTariffId,
          });
          setLoading(false);
        }
      });
  };

  function CashPatientChange(e) {
    const isChecked = e.target.checked;
    setDisable(isChecked);

    if (isChecked) {
      form.setFieldsValue({ PayerId: undefined });
      form.validateFields(["PayerId"]);
    } else {
      form.validateFields(["PayerId"]);
    }
  }

  return (
    <>
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
            title={"Default Tariff Plan"}
            buttonLabel={"Add New Plan"}
            buttonIcon={<PlusCircleOutlined style={{ fontSize: "20px" }} />}
            onButtonClick={handleAddLookupShowModal}
          />
          <Spin spinning={loading}>
            <CustomTable
              style={{ margin: "20px" }}
              columns={columns}
              dataSource={columnData}
              actionColumn={true}
              isFilter={true}
              onEdit={handleEditLookupModal}
              onDelete={handleDelete}
            />
          </Spin>
        </div>
      </Layout>
      {contextHolder}
      <Modal
        title={
          isEditing ? "Edit Default Tariff Plan " : "Create Default Tariff Plan"
        }
        open={isLookUpModalVisible}
        onCancel={handleLookUpModalCancel}
        maskClosable={false}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={IsSubmitClicked}
            onClick={handleSubmit}
          >
            {/* {IsSubmitClicked ? "Submitting" : "Submit"} */}
            {isEditing ? "Update" : "Submit"}
          </Button>,
          <Button key="back" danger onClick={handleLookUpModalCancel}>
            Cancel
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="FacilityId"
                label="Facility"
                rules={[
                  {
                    required: true,
                    message: "Please select title",
                  },
                ]}
              >
                <SearchableSelect
                  options={indicatorData?.Facilities ?? []}
                  valueKey="FacilityId"
                  labelKey="FacilityName"
                  idKey="FacilityId"
                  onChange={handleStateChange}
                  placeholder="Select Facility"
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="CashPatient"
                label="Cash Patient"
                valuePropName="checked"
              >
                <Checkbox onChange={CashPatientChange}>Yes</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="PayerId"
                label="Payer"
                rules={[
                  {
                    required: !disable,
                    message: "Payer required.",
                  },
                ]}
              >
                <SearchableSelect
                  options={indicatorData?.Payer ?? []}
                  valueKey="PayerId"
                  labelKey="PayerName"
                  idKey="PayerId"
                  placeholder="Select Payer"
                  allowClear
                  disabled={disable}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="PriceTariffId"
                label="Default Price Tariff"
                rules={[
                  {
                    required: true,
                    message: "Please select title",
                  },
                ]}
              >
                <SearchableSelect
                  options={indicatorData?.PriceTariff ?? []}
                  valueKey="PriceTariffId"
                  labelKey="LongPriceDescription"
                  idKey="PriceTariffId"
                  placeholder="Select Price Tariff"
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="PatientTypeId"
                label="Patient Type"
                rules={[
                  {
                    required: true,
                    message: "Please select title",
                  },
                ]}
              >
                <SearchableSelect
                  options={indicatorData?.PatientType ?? []}
                  valueKey="LookupID"
                  labelKey="LookupDescription"
                  idKey="LookupID"
                  placeholder="Select Patient Type"
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="DefaultTariffId" style={{ display: "none" }}>
            <input type="hidden" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default DefaultTariffPlan;
