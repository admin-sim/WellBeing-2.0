import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Spin,
} from "antd";
import React, { useEffect, useState, useCallback } from "react";
import customAxios from "../../../components/customAxios/customAxios";
import {
  urlPackageDescriptionServiceForInsurance,
  urlPackageDescriptionServiceGroup,
  urlPackageDescriptionServiceClassification,
} from "../../../../endpoints";
import { debounce } from "lodash";

function AddAllocationModal({
  open,
  handleClose,
  onSubmit,
  options,
  receiptAmount,
}) {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [value, setValue] = useState(undefined);
  const [fetching, setFetching] = useState(false);
  const [descriptionDisabled, setDescriptionDisabled] = useState(true);
  const [url, setUrl] = useState();
  const [indicatorDescription, setIndicatorDescription] = useState("");
  const [patientTypeDescription, setPatientTypeDescription] = useState("");
  const [selectedDescriptionName, setSelectedDescriptionName] = useState(""); // State for selected name
  const handleCancel = () => {
    form.resetFields();
    setData([]);
    setUrl(undefined);
    handleClose();
  };
  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        AllocationAmount: receiptAmount,
        PatientTypeId: options?.LastEncounter?.PatientType,
        Balance: 0,
        Utilized: 0,
      });

      // Set the PatientTypeDescription if it's available
      if (options?.LastEncounter?.PatientType) {
        const patientType = options.PatientType.find(
          (opt) => opt.LookupID === options.LastEncounter.PatientType
        );
        setPatientTypeDescription(patientType?.LookupDescription || "");
      }
    }
  }, [open, receiptAmount, options]);

  const IndicatorOnchange = (value, option) => {
    console.log("Selected value:", value);
    console.log("Selected option:", option);
    form.setFieldsValue({ IndicatorDescriptionId: undefined });
    setData([]);
    setIndicatorDescription(option.children);
    form.resetFields(["IndicatorDescriptionId"]); // Corrected to use an array
    // Update the URL based on the selected option
    if (option.children !== "All") {
      setDescriptionDisabled(false);
      switch (option.children) {
        case "Service Group":
          setUrl(urlPackageDescriptionServiceGroup);
          break;
        case "Service Classification":
          setUrl(urlPackageDescriptionServiceClassification);
          break;
        default:
          setUrl(urlPackageDescriptionServiceForInsurance);
          break;
      }
    } else {
      setDescriptionDisabled(true);
    }
  };
  const fetchOptions = async (value) => {
    debugger;
    if (!url || !value) {
      setData([]);
      //message.warning('Please Select Indicator First..')
      return;
    }
    setFetching(true);
    if (value) {
      try {
        const response = await customAxios.get(`${url}?Description=${value}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      setData([]);
    }
    setFetching(false);
  };

  const debounceFetchOptions = useCallback(debounce(fetchOptions, 800), [url]);

  const handleFinish = (values) => {
    const payload = {
      ...values,
      IndicatorDescriptionName: indicatorDescription,
      PatientTypeDescription: patientTypeDescription,
      IndicatorDescription: selectedDescriptionName,
    };
    onSubmit(payload);
    handleClose();
  };
  // Update state on selection
  const handleDescriptionChange = (newValue) => {
    setValue(newValue);

    // Find the selected option in data to get the name
    const selectedItem = data.find((item) => item.Id === newValue);
    setSelectedDescriptionName(selectedItem ? selectedItem.Name : "");
  };
  return (
    <div>
      <Modal
        title="Add Allocation Details"
        open={open}
        maskClosable={false}
        footer={null}
        onCancel={handleCancel}
        width="40rem"
      >
        <Form
          style={{ margin: "1rem 0" }}
          layout="vertical"
          form={form}
          onFinish={handleFinish}
          onCancel={handleCancel}
        >
          <Row gutter={16}>
            <Col className="gutter-row" span={8}>
              <Form.Item
                name="IndicatorId"
                label="Indicator"
                rules={[{ required: true, message: "Please select Indicator" }]}
              >
                <Select onChange={IndicatorOnchange}>
                  {options?.Indicator?.map((option) => (
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
            <Col className="gutter-row" span={8}>
              <Form.Item name="IndicatorDescriptionId" label="Description">
                {/* <Input style={{ width: "100%" }} /> */}
                <Select
                  showSearch
                  value={value}
                  allowClear
                  placeholder="Select an option"
                  notFoundContent={fetching ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={debounceFetchOptions}
                  onChange={handleDescriptionChange} // Use updated handler
                  disabled={descriptionDisabled}
                  style={{ width: "100%" }}
                >
                  {data.map((item) => (
                    <Option key={item.Id} value={item.Id}>
                      {item.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="PatientTypeId"
                label="Patient Type"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select disabled>
                  {options?.PatientType?.map((option) => (
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
            <Col span={12}>
              <Form.Item
                name="Encounter"
                label="Encounter Id"
                initialValue={options?.LastEncounter?.GeneratedEncounterId}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="AllocationPercentage"
                label="Percentage"
                rules={[{ required: true }]}
                initialValue={100}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="AllocationAmount" label="Amount">
                <Input disabled />
              </Form.Item>
              <span style={{ color: "green" }}>
                (*Note: Amount should be less than or equal to Receipt Amount)
              </span>
            </Col>
            <Col span={12}>
              <Form.Item name="Utilized" label="Utilized">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="Balance" label="Balance">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} justify="end" style={{ margin: "0 0 -2rem 0" }}>
            <Col>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button danger onClick={handleCancel}>
                  Close
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

export default AddAllocationModal;
