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
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import PageHeader from "../../../../components/PageHeader/index.jsx";
import { LeftOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { useLocation, useNavigate } from "react-router-dom";
import {
  urlEditTemplate,
  urlLoadAllDropDownsTemplate,
  urlSaveNewTemplate,
} from "../../../../../endpoints.js";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import CkEditor from "../../../../components/CKEditor/index.jsx";
import { template } from "lodash";
import { ColWithSixSpan } from "../../../../components/customGridColumns/index.jsx";

function ShowAddNewTemplate() {
  const [apiData, setApiData] = useState([]);
  const [templateData, setTemplateData] = useState(null);
  const [templateEditorData, setTemplateEditorData] = useState("");
  const [loading, setLoading] = useState(false);
  // const [data, setData] = useState('');
  const navigate = useNavigate();
  const [form] = useForm();
  const location = useLocation();

  const templateRecord = location?.state?.record;

  useEffect(() => {
    fetchData();
    fetchTemplateData();
  }, []);

  useEffect(() => {}, [setTemplateEditorData]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await customAxios.get(urlLoadAllDropDownsTemplate);

      setApiData(response.data.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const fetchTemplateData = async () => {
    if (templateRecord) {
      setLoading(true);
      try {
        const response = await customAxios.get(
          `${urlEditTemplate}?Tid=${templateRecord.TID}`
        );
        setTemplateData(response.data.data.templatemodel);
        form.setFieldsValue({
          facilityID: response.data.data.templatemodel?.FacilityID,
          tempGroupID: response.data.data.templatemodel?.TempGroupID,
          providerID: response.data.data.templatemodel?.ProviderID,
          tempName: response.data.data.templatemodel?.TempName,
        });
        setTemplateEditorData(response?.data.data.templatemodel?.TempData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    if (!templateRecord) {
      values = { ...values, tempData: templateEditorData };
      try {
        const response = await customAxios.post(urlSaveNewTemplate, values);
        if (response.status === 200) {
          message.success("Template saved successfully");
        }
        setLoading(false);
        navigate("/Templates");
      } catch (error) {
        message.error("Failed to save Template");
        console.error(error);
        setLoading(false);
      }
    } else {
      values = {
        ...values,
        tempData: templateEditorData,
        tid: templateRecord?.TID,
      };
      try {
        const response = await customAxios.post(urlSaveNewTemplate, values);
        if (response.status === 200) {
          message.success("Template updated successfully");
        }
        setLoading(false);
        navigate("/Templates");
      } catch (error) {
        message.error("Failed to update Template");
        console.error(error);
        setLoading(false);
      }
    }
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
            style={{ margin: "1rem" }}
            layout="vertical"
            form={form}
            onFinish={(values) => {
              handleSubmit(values);
            }}
          >
            <Row gutter={16}>
              <ColWithSixSpan>
                <Form.Item
                  name="facilityID"
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
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item
                  name="tempGroupID"
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
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item name="providerID" label="Providers">
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
              </ColWithSixSpan>
              <ColWithSixSpan>
                <Form.Item
                  name="tempName"
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
              </ColWithSixSpan>
            </Row>
            <Row justify={"end"}>
              <Col>
                <Button type="primary" htmlType="submit">
                  {templateRecord ? "Update" : "Save"}
                </Button>
              </Col>
            </Row>
          </Form>
          <Divider />
          {(templateEditorData || !templateRecord) && (
            <CkEditor
              // initialData={`<p style="text-align:center;">&nbsp;</p><figure class="table" style="width:1000px;"><table align="center" border="1" cellpadding="1" cellspacing="1" dir="ltr" id="PatientHeader"><tbody><tr><td><span style="font-family:Times New Roman,Times,serif;font-size:16px;"><strong>Name</strong></span></td><td style="width:300px;"><span style="font-family:Times New Roman,Times,serif;font-size:16px;">Mahesh</span></td><td style="width:200px;"><span style="font-family:Times New Roman,Times,serif;font-size:16px;"><strong>Provider</strong></span></td><td style="width:300px;"><span style="font-family:Times New Roman,Times,serif;font-size:16px;">Mahesh Dr.</span></td></tr><tr><td><span style="font-family:Times New Roman,Times,serif;font-size:16px;"><strong>UHID</strong></span></td><td style="width:200px;"><span style="font-family:Times New Roman,Times,serif;font-size:16px;">COH/25</span></td><td style="width:200px;"><span style="font-family:Times New Roman,Times,serif;font-size:16px;"><strong>Age/Sex</strong></span></td><td><span style="font-family:Times New Roman,Times,serif;font-size:16px;">25Y 2M 6D /Male</span></td></tr><tr><td><span style="font-family:Times New Roman,Times,serif;font-size:16px;"><strong>Encounter</strong></span></td><td style="width:200px;"><span style="font-family:Times New Roman,Times,serif;font-size:16px;">COH/OP/01</span></td><td style="width:200px;"><span style="font-family:Times New Roman,Times,serif;font-size:16px;"><strong>Sample Collection Time</strong></span></td><td><span style="font-family:Times New Roman,Times,serif;font-size:16px;">01-02-2023 11:08 AM</span></td></tr><tr><td><span style="font-family:Times New Roman,Times,serif;font-size:16px;"><strong>Lab Number</strong></span></td><td style="width:200px;"><span style="font-family:Times New Roman,Times,serif;font-size:16px;">COH/LAB/25</span></td><td style="width:200px;"><span style="font-family:Times New Roman,Times,serif;font-size:16px;"><strong>Report Date Time</strong></span></td><td><span style="font-family:Times New Roman,Times,serif;font-size:16px;">01-02-2023 11:08 AM</span></td></tr></tbody></table></figure><p>&nbsp;</p>`}
              initialData={templateEditorData}
              printButton={true}
              setData={setTemplateEditorData}
            />
          )}
        </Spin>
      </div>
    </>
  );
}

export default ShowAddNewTemplate;
