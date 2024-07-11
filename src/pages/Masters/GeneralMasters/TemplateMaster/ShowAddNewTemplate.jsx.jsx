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
import CkEditor from "../../../../components/CKEditor";

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
          <CkEditor initialData={""} printButton={true} setData={setData} />
        </Spin>
      </div>
    </>
  );
}

export default ShowAddNewTemplate;
