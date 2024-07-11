import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Spin,
} from "antd";
import React, { useEffect, useState } from "react";
import PageHeader from "../../../../components/PageHeader";
import { LeftOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { useNavigate } from "react-router-dom";
import { urlLoadAllDropDownsTemplate } from "../../../../../endpoints";
import customAxios from "../../../../components/customAxios/customAxios";
import CkEditor from "../../../../components/CKEditor/index.jsx";

function ShowAddNewTemplate() {
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [form] = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await customAxios.get(urlLoadAllDropDownsTemplate);

      setApiData(response.data.data);
      console.log("data", response.data.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSubmit = (values) => {
    console.log("Editoor Data", data);
    console.log("Form Values", values);
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          backgroundColor: "white",
          minHeight: "max-content",
          borderRadius: "10px",
          paddingBottom: "1rem",
        }}
      >
        <PageHeader
          title="Add Template"
          buttonLabel="Back to List"
          buttonIcon={<LeftOutlined />}
          onButtonClick={() => navigate("/Templates")}
        />
        <Spin spinning={loading}>
          <Form
            style={{ margin: "1rem 2rem" }}
            layout="vertical"
            form={form}
            onFinish={(values) => {
              handleSubmit(values);
            }}
          >
            <Row gutter={32}>
              <Col span={6}>
                <Form.Item
                  name="Facility"
                  label="Facility"
                  rules={[
                    {
                      required: true,
                      message: "Please select Facility",
                    },
                  ]}
                >
                  <Select style={{ width: "100%" }}>
                    {apiData?.AllFacility?.map((option) => (
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
                <Form.Item
                  name="TemplateGroup"
                  label="Template Group"
                  rules={[
                    {
                      required: true,
                      message: "Please select Template Group",
                    },
                  ]}
                >
                  <Select style={{ width: "100%" }}>
                    {apiData?.TemplateGroups?.map((option) => (
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
              <Col span={5}>
                <Form.Item name="Providers" label="Providers">
                  <Select style={{ width: "100%" }}>
                    {apiData?.Provider?.map((option) => (
                      <Select.Option
                        key={option.ProviderId}
                        value={option.ProviderId}
                      >
                        {option.ProviderName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item
                  name="TemplateName"
                  label="Template Name"
                  rules={[
                    {
                      required: true,
                      message: "Please select Template Name",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item label=" ">
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Divider />
          <CkEditor
            initialData={`<p style="text-align:center;">&nbsp;</p><figure class="table" style="width:1000px;"><table align="center" border="1" cellpadding="1" cellspacing="1" dir="ltr" id="PatientHeader"><tbody><tr><td><span style="font-family:Times New Roman,Times,serif;font-size:16px;"><strong>Name</strong></span></td><td style="width:300px;"><span style="font-family:Times New Roman,Times,serif;font-size:16px;">Mahesh</span></td><td style="width:200px;"><span style="font-family:Times New Roman,Times,serif;font-size:16px;"><strong>Provider</strong></span></td><td style="width:300px;"><span style="font-family:Times New Roman,Times,serif;font-size:16px;">Mahesh Dr.</span></td></tr><tr><td><span style="font-family:Times New Roman,Times,serif;font-size:16px;"><strong>UHID</strong></span></td><td style="width:200px;"><span style="font-family:Times New Roman,Times,serif;font-size:16px;">COH/25</span></td><td style="width:200px;"><span style="font-family:Times New Roman,Times,serif;font-size:16px;"><strong>Age/Sex</strong></span></td><td><span style="font-family:Times New Roman,Times,serif;font-size:16px;">25Y 2M 6D /Male</span></td></tr><tr><td><span style="font-family:Times New Roman,Times,serif;font-size:16px;"><strong>Encounter</strong></span></td><td style="width:200px;"><span style="font-family:Times New Roman,Times,serif;font-size:16px;">COH/OP/01</span></td><td style="width:200px;"><span style="font-family:Times New Roman,Times,serif;font-size:16px;"><strong>Sample Collection Time</strong></span></td><td><span style="font-family:Times New Roman,Times,serif;font-size:16px;">01-02-2023 11:08 AM</span></td></tr><tr><td><span style="font-family:Times New Roman,Times,serif;font-size:16px;"><strong>Lab Number</strong></span></td><td style="width:200px;"><span style="font-family:Times New Roman,Times,serif;font-size:16px;">COH/LAB/25</span></td><td style="width:200px;"><span style="font-family:Times New Roman,Times,serif;font-size:16px;"><strong>Report Date Time</strong></span></td><td><span style="font-family:Times New Roman,Times,serif;font-size:16px;">01-02-2023 11:08 AM</span></td></tr></tbody></table></figure><p>&nbsp;</p>
`}
            printButton={true}
            setData={setData}
          />
        </Spin>
      </div>
    </>
  );
}

export default ShowAddNewTemplate;
