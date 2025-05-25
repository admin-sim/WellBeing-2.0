import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Layout,
  message,
  Row,
  Select,
} from "antd";
import { useForm } from "antd/es/form/Form";
import Title from "antd/es/typography/Title";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../../components/PageHeader";
import {
  ColWithEightSpan,
  ColWithSixSpan,
} from "../../../../components/customGridColumns";
import { useLocation } from "react-router-dom";
import customAxios from "../../../../components/customAxios/customAxios";
import {
  urlAddOrUpdate,
  urlEditReferral,
  urlReferralCreate,
  urlUpdateReferral,
} from "../../../../../endpoints";

function ReferralCreateEdit() {
  const navigate = useNavigate();
  const [form] = useForm();
  const location = useLocation();
  const id = location.state?.id;
  const [data, setData] = React.useState([]);
  const [buttonTitle, setButtonTitle] = React.useState("Save");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (id && id > 0) {
      setButtonTitle("Update");
      // setLoading(true);
      try {
        const response = await customAxios.get(`${urlEditReferral}?Id=${id}`);
        if (response.status == 200 && response.data.data != null) {
          setData(response.data.data);
          form.setFieldsValue({
            ReferrerType: response.data.data.NewReferralModel.ReferrerTypeID,
            ReferrerTitle: response.data.data.NewReferralModel.ReferrerTitle,
            ReferrerFirstName:
              response.data.data.NewReferralModel.ReferrerFirstName,
            ReferrerMiddleName:
              response.data.data.NewReferralModel.ReferrerMiddleName,
            ReferrerLastName:
              response.data.data.NewReferralModel.ReferrerLastName,
            Area: response.data.data.NewReferralModel.AreaId,
            Gender: response.data.data.NewReferralModel.GenderID,
            Qualification: response.data.data.NewReferralModel.Qualification,
            Address: response.data.data.NewReferralModel.Address1,
            status: response.data.data.NewReferralModel.Status,
            Pin: response.data.data.NewReferralModel.Pin,
            LandlineNumber: response.data.data.NewReferralModel.LandlineNumber,
            email: response.data.data.NewReferralModel.EmailId,
            MobileNumber: response.data.data.NewReferralModel.MobileNumber,
            ReferrerId: response.data.data.NewReferralModel.ReferrerId,
            status: response.data.data.NewReferralModel.ActiveFlag,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      try {
        const response = await customAxios.get(urlReferralCreate);
        if (response.status == 200 && response.data.data != null) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  // const options = [
  //   {
  //     value: "jack",
  //     label: "Jack",
  //   },
  //   {
  //     value: "lucy",
  //     label: "Lucy",
  //   },
  //   {
  //     value: "Yiminghe",
  //     label: "yiminghe",
  //   },
  // ];

  async function handleSubmit(values) {
    debugger;
    const payload = {
      ReferrerId: values.ReferrerId ?? 0,
      ReferrerTypeID: values.ReferrerType,
      ReferrerTitle: values.ReferrerTitle,
      ReferrerFirstName: values.ReferrerFirstName,
      ReferrerMiddleName: values.ReferrerMiddleName,
      ReferrerLastName: values.ReferrerLastName,
      AreaId: values.Area,
      GenderID: values.Gender,
      Qualification: values.Qualification,
      Address1: values.Address,
      EmailId: values.email,
      ActiveFlag: values.status,
      Pin: String(values.Pin),
      MobileNumber: String(values.MobileNumber),
      LandlineNumber: String(values.LandlineNumber),
    };
    const url = payload.ReferrerId > 0 ? urlUpdateReferral : urlAddOrUpdate;
    const response = await customAxios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status == 200) {
      if (response.data === "Referral is Already Exists!") {
        message.success("Referral is Already Exists!");
      } else if (response.data === "Referral Updated Successfully") {
        navigate("/Referral")
        message.success("Referral Updated Successfully");
      } else {
        navigate("/Referral")
        message.success("Referral Created Successfully");
      }
    }
  }

  return (
    <>
      <Layout>
        <div
          style={{
            width: "100%",
            backgroundColor: "white",
            minHeight: "max-content",
            borderRadius: "10px",
          }}
        >
          <PageHeader
            title={"Referral Manager"}
            buttonLabel={"Back To List"}
            buttonIcon={<ArrowLeftOutlined style={{ fontSize: "1.1rem" }} />}
            onButtonClick={() => navigate("/Referral")}
          />
          <Form
            style={{ margin: "1rem" }}
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            initialValues={{
              status: true,
            }}
          >
            <Row gutter={16}>
              <ColWithSixSpan>
                <Form.Item name="ReferrerId" hidden>
                  <Input />
                </Form.Item>
                <Form.Item
                  name="ReferrerType"
                  label="Referrer Type"
                  rules={[
                    {
                      required: true,
                      message: "Please select Referrer Type",
                    },
                  ]}
                >
                  <Select>
                    {data?.ReferrerType?.map((option) => (
                      <Select.Option
                        key={option.LookupID}
                        value={option.LookupID}
                      >
                        {option.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
                  {/* <Select style={{ width: "100%" }} options={options} /> */}
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item
                  name="ReferrerTitle"
                  label="Referrer Title"
                  rules={[
                    {
                      required: true,
                      message: "Please Select Referrer Title",
                    },
                  ]}
                >
                  <Select>
                    {data?.Titles?.map((option) => (
                      <Select.Option
                        key={option.LookupID}
                        value={option.LookupID}
                      >
                        {option.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
                  {/* <Select style={{ width: "100%" }} options={options} /> */}
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item
                  name="ReferrerFirstName"
                  label="Referrer First Name"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Referrer First Name",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item
                  name="ReferrerMiddleName"
                  label="Referrer Middle Name"
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item name="ReferrerLastName" label="Referrer Last Name">
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item
                  name="Gender"
                  label="Gender"
                  rules={[
                    {
                      required: true,
                      message: "Please Select Gender",
                    },
                  ]}
                >
                  <Select>
                    {data?.Gender?.map((option) => (
                      <Select.Option
                        key={option.LookupID}
                        value={option.LookupID}
                      >
                        {option.LookupDescription}
                      </Select.Option>
                    ))}
                  </Select>
                  {/* <Select style={{ width: "100%" }} options={options} /> */}
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item
                  name="Qualification"
                  label="Qualification"
                  rules={[
                    {
                      required: true,
                      message: "Please enter qualification",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item
                  name="Address"
                  label="Address"
                  rules={[
                    {
                      required: true,
                      message: "Please enter address",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item
                  name="Area"
                  label="Area"
                  rules={[
                    {
                      required: true,
                      message: "Please select area",
                    },
                  ]}
                >
                  <Select>
                    {data?.Areas?.map((option) => (
                      <Select.Option key={option.AreaId} value={option.AreaId}>
                        {option.AreaName}
                      </Select.Option>
                    ))}
                  </Select>
                  {/* <Input style={{ width: "100%" }} /> */}
                </Form.Item>
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item
                  name="Pin"
                  label="Pin"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Pin",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </ColWithSixSpan>
            </Row>
            <Divider orientation="left">Contact Details</Divider>
            <Row gutter={16}>
              <ColWithEightSpan>
                <Form.Item
                  name="MobileNumber"
                  label="Mobile Number"
                  rules={[
                    {
                      required: true,
                      message: "Please enter mobile number",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </ColWithEightSpan>
              <ColWithEightSpan>
                <Form.Item name="LandlineNumber" label="Landline Number">
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </ColWithEightSpan>
              <ColWithEightSpan>
                <Form.Item
                  name="email"
                  label="Contact Email"
                  rules={[
                    {
                      type: "email",
                      message: "Please enter valid email",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </ColWithEightSpan>
            </Row>
            <Divider orientation="left">Status Details</Divider>
            <Row gutter={16}>
              <ColWithEightSpan>
                <Form.Item name="status" label="Status">
                  <Select>
                    <Select.Option key={true} value={true}>
                      {"Active"}
                    </Select.Option>
                    <Select.Option key={false} value={false}>
                      {"Hidden"}
                    </Select.Option>
                  </Select>
                  {/* <Select style={{ width: "100%" }} options={options} /> */}
                </Form.Item>
              </ColWithEightSpan>
            </Row>
            <Row justify={"end"}>
              <Col style={{ marginRight: "1rem" }}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    {buttonTitle}
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button
                    type="default"
                    danger
                    onClick={() => navigate("/Referral")}
                  >
                    Cancel
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Layout>
    </>
  );
}

export default ReferralCreateEdit;
