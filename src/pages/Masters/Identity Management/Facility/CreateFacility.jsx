import React, { useEffect } from "react";
import PageHeader from "../../../../components/PageHeader";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Select,
  Upload,
} from "antd";
import { useForm } from "antd/es/form/Form";
import {
  ColWithSixSpan,
  ColWithTwelveSpan,
} from "../../../../components/customGridColumns";
import { useLocation, useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import {
  urlEditFacility,
  urlFacilityAddOrUpdate,
  urlFacilityCreate,
  urlGetArea,
  urlGetPlace,
  urlGetStates,
  urlUpdateFacility,
} from "../../../../../endpoints";
import customAxios from "../../../../components/customAxios/customAxios";

function CreateFacility() {
  const [form] = useForm();
  const navigate = useNavigate();
  const [data, setData] = React.useState([]);
  const location = useLocation();
  const record = location.state;
  const [fileList, setFileList] = React.useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (record && record.FacilityId > 0) {
        try {
          const response = await customAxios.get(
            `${urlEditFacility}?id=${record.FacilityId}`
          );
          setData(response.data.data);
          const Facility = response.data.data.Facility;
          if (Facility.FacilityPath) {
            setFileList([
              {
                uid: "-1",
                name: "logo.png",
                status: "done",
                url: Facility.FacilityPath,
              },
            ]);
          }

          form.setFieldsValue({
            FacilityCode: Facility.FacilityCode,
            FacilityId: Facility.FacilityId,
            FacilityName: Facility.FacilityName,
            AddressLine1: Facility.AddressLine1,
            AddressLine2: Facility.AddressLine2,
            Country: Facility.CountryId,
            State: Facility.StateId,
            City: Facility.PlaceId,
            Area: Facility.AreaId,
            ContactName: Facility.ContactName,
            EnterpriseId: Facility.EnterpriseId,
            Email: Facility.ContactEmail,
            Mobile: Facility.MobileNumber,
            Phone: Facility.PhoneNumber,
            Pin: Facility.PinCode,
            Fax: Facility.FaxNumber,
            DateFormat: Facility.DateFormat,
            TimeFormat: Facility.TimeFormat,
            Status: Facility.ActiveFlag,
            // UploadLogo: Facility.FacilityPath,
          });
        } catch (error) {
          console.error(error);
        }
      } else {
        try {
          const response = await customAxios.get(urlFacilityCreate);
          setData(response.data.data);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchData();
  }, []);

  async function handleCChange(value) {
    form.setFieldsValue({ State: undefined });
    form.setFieldsValue({ City: undefined });
    form.setFieldsValue({ Area: undefined });
    if (!value) {
      setData((prevData) => ({
        ...prevData,
        States: [],
        Places: [],
        Areas: [],
      }));
    } else {
      const response = await customAxios.get(
        `${urlGetStates}?CountryId=${value}`
      );
      setData((prevData) => ({
        ...prevData,
        States: response.data.data,
        CountryId: value,
      }));
    }
  }

  async function handleSChange(value) {
    form.setFieldsValue({ City: undefined });
    form.setFieldsValue({ Area: undefined });
    if (!value) {
      setData((prevData) => ({
        ...prevData,
        Places: [],
        Areas: [],
      }));
    } else {
      const response = await customAxios.get(`${urlGetPlace}?StateId=${value}`);
      setData((prevData) => ({
        ...prevData,
        Places: response.data.data,
      }));
    }
  }

  async function handlePChange(value) {
    form.setFieldsValue({ Area: undefined });
    if (!value) {
      setData((prevData) => ({
        ...prevData,
        Areas: [],
      }));
    } else {
      const response = await customAxios.get(`${urlGetArea}?PlaceId=${value}`);
      setData((prevData) => ({
        ...prevData,
        Areas: response.data.data,
      }));
    }
  }

  async function handleSubmit(values) {
    debugger;
    const postData = {
      FacilityId: values.FacilityId ?? 0,
      FacilityName: values.FacilityName,
      FacilityCode: values.FacilityCode,
      AddressLine1: values.AddressLine1,
      AddressLine2: values.AddressLine2,
      CountryId: values.Country,
      StateId: values.State,
      PlaceId: values.City,
      AreaId: values.Area,
      PinCode: values.Pin,
      ContactName: values.ContactName,
      PhoneNumber: values.Phone,
      MobileNumber: values.Mobile,
      ContactEmail: values.Email,
      FaxNumber: values.Fax,
      EnterpriseId: values.EnterpriseId ?? 0,
      DateFormat: values.DateFormat,
      TimeFormat: values.TimeFormat,
      FacilityPath: fileList[0]?.url ? fileList[0]?.url : fileList[0]?.thumbUrl,
      ActiveFlag: values.Status,
    };
    const url = record ? urlUpdateFacility : urlFacilityAddOrUpdate;
    const response = await customAxios.post(url, postData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      message.success(
        record
          ? "Facility updated successfully"
          : "Facility created successfully"
      );
      navigate("/Facility");
    }
  }

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "white",
        minHeight: "max-content",
        borderRadius: "10px",
      }}
    >
      <PageHeader title={"Facility Manager"} button={false} />
      <Form
        style={{ margin: "1rem" }}
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          <ColWithSixSpan>
            <Form.Item
              name="FacilityCode"
              label="Facility Code"
              rules={[
                {
                  required: true,
                  message: "Please input!",
                },
              ]}
            >
              <Input allowClear />
            </Form.Item>
            <Form.Item name="FacilityId" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="EnterpriseId" hidden>
              <Input />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item
              name="FacilityName"
              label="Facility Name"
              rules={[
                {
                  required: true,
                  message: "Please input!",
                },
              ]}
            >
              <Input allowClear />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item
              name="DateFormat"
              label="Date Format"
              rules={[
                {
                  required: true,
                  message: "Please input!",
                },
              ]}
            >
              <Input allowClear />
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item
              name="TimeFormat"
              label="Time Format"
              rules={[
                {
                  required: true,
                  message: "Please input!",
                },
              ]}
            >
              <Input allowClear />
            </Form.Item>
          </ColWithSixSpan>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Divider style={{ marginTop: 0 }} orientation="left">
              Address Details
            </Divider>
            <Row gutter={16} style={{ marginTop: "0.5rem" }}>
              <ColWithTwelveSpan>
                <Form.Item
                  name="AddressLine1"
                  label="Address Line 1"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Input allowClear />
                </Form.Item>
              </ColWithTwelveSpan>
              <ColWithTwelveSpan>
                <Form.Item
                  name="AddressLine2"
                  label="Address Line 2"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Input allowClear />
                </Form.Item>
              </ColWithTwelveSpan>
              <ColWithTwelveSpan>
                <Form.Item
                  name="Country"
                  label="Country"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select Value"
                    allowClear
                    onChange={handleCChange}
                  >
                    {(data?.Countries || []).map((option) => (
                      <Select.Option
                        key={option.LookupID}
                        value={option.LookupID}
                      >
                        {option.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </ColWithTwelveSpan>
              <ColWithTwelveSpan>
                <Form.Item
                  name="State"
                  label="State"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Select allowClear onChange={handleSChange}>
                    {(data?.States || [])
                      .filter((i) => i.CountryId === data.CountryId)
                      .map((option) => (
                        <Select.Option
                          key={option.StateID}
                          value={option.StateID}
                        >
                          {option.StateName}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </ColWithTwelveSpan>
              <ColWithTwelveSpan>
                <Form.Item
                  name="City"
                  label="City"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Select allowClear onChange={handlePChange}>
                    {(data?.Places || []).map((option) => (
                      <Select.Option
                        key={option.PlaceId}
                        value={option.PlaceId}
                      >
                        {option.PlaceName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </ColWithTwelveSpan>
              <ColWithTwelveSpan>
                <Form.Item
                  name="Area"
                  label="Area"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Select allowClear>
                    {(data?.Areas || []).map((option) => (
                      <Select.Option key={option.AreaId} value={option.AreaId}>
                        {option.AreaName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </ColWithTwelveSpan>
            </Row>
          </Col>
          <Col span={12}>
            <Divider style={{ marginTop: 0 }} orientation="left">
              Contact Details
            </Divider>
            <Row gutter={32} style={{ marginTop: "0.5rem" }}>
              <ColWithTwelveSpan>
                <Form.Item
                  name="ContactName"
                  label="Contact Name"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Input allowClear />
                </Form.Item>
              </ColWithTwelveSpan>
              <ColWithTwelveSpan>
                <Form.Item
                  name="Email"
                  label="Email"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Input allowClear />
                </Form.Item>
              </ColWithTwelveSpan>
              <ColWithTwelveSpan>
                <Form.Item
                  name="Mobile"
                  label="Mobile"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Input allowClear />
                </Form.Item>
              </ColWithTwelveSpan>
              <ColWithTwelveSpan>
                <Form.Item
                  name="Phone"
                  label="Landline"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Input allowClear />
                </Form.Item>
              </ColWithTwelveSpan>
              <ColWithTwelveSpan>
                <Form.Item
                  name="Pin"
                  label="Pin"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Input allowClear />
                </Form.Item>
              </ColWithTwelveSpan>
              <ColWithTwelveSpan>
                <Form.Item
                  name="Fax"
                  label="Fax"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                >
                  <Input allowClear />
                </Form.Item>
              </ColWithTwelveSpan>
            </Row>
          </Col>
        </Row>
        <Row gutter={32}>
          <Divider style={{ marginTop: 0 }} orientation="left">
            Status Details
          </Divider>
          <ColWithSixSpan>
            <Form.Item name="Status" label="Status">
              <Select allowClear placeholder="Select Status">
                <Select.Option value={true}>Active</Select.Option>
                <Select.Option value={false}>Hide</Select.Option>
              </Select>
            </Form.Item>
          </ColWithSixSpan>
          <ColWithSixSpan>
            <Form.Item name="UploadLogo" label="Upload Logo">
              <Upload
                accept="image/*"
                listType="picture"
                maxCount={1}
                fileList={fileList}
                onChange={handleChange}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
            {/* <Form.Item name="UploadLogo" label="Upload Logo">
              <Upload
                accept="image/*"
                listType="picture"
                maxCount={1}
                fileList={fileList}
                onChange={handleChange}
                beforeUpload={() => false}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item> */}
          </ColWithSixSpan>
        </Row>
        <Row justify="end">
          <Col style={{ marginRight: "10px" }}>
            <Form.Item>
              <Button type="primary" htmlType="submit" size="middle">
                {record ? "Update" : "Save"}
              </Button>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Button
                type="default"
                danger
                size="middle"
                onClick={() => {
                  navigate("/Facility");
                }}
              >
                Cancel
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default CreateFacility;
