import { PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table
} from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import { FaHistory } from "react-icons/fa";
import {
  ColWithEightSpan,
  ColWithSixSpan,
  ColWithTwelveSpan,
} from "../../../components/customGridColumns";
import TextArea from "antd/es/input/TextArea";
import { urlGetAllHistoryAsync, urlSaveAllergy, urlGetAllergyBasedonRange } from "../../../../endpoints";
import customAxios from "../../../components/customAxios/customAxios";
import dayjs from "dayjs";
import CustomTable from "../../../components/customTable";

function Allergy(Patient) {
  const [allergyFormModal, setAllergyFormModal] = useState(false);
  const [form] = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prevAllergyTable, setPrevAllergyTable] = useState([])
  const [buttonTitle, setButtonTitle] = useState('Save')
  const [dropDown, setDropDown] = useState({
    Allergitype: [],
    Sourceofinfo: [],
    Provider: [],
    drugshis: []
  })

  const columns = [
    {
      title: "Date",
      dataIndex: "CreatedDatetimeString",
      key: "CreatedDatetimeString",
    },
    {
      title: "Allergen Type",
      dataIndex: "CategoryName",
      key: "CategoryName",
    },
  ];

  const showModal = async () => {
    try {
      const response = await customAxios.get(
        `${urlGetAllergyBasedonRange}?PatientId=${Patient.Patient.PatientId}&EncounterId=${Patient.Patient.Encounter}&Range=${dayjs()}`
      );
      if (response.status === 200 && response.data.data != null) {
        const detailsheader = response.data.data.NewAllergyList;
        setPrevAllergyTable(detailsheader);
        setIsModalOpen(true);
      }
    } catch (error) { }
  }

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    try {
      const response = await customAxios.get(
        `${urlGetAllHistoryAsync}?PatientId=${Patient.Patient.PatientId}&EncounterId=${Patient.Patient.Encounter}`
      );
      if (response.status === 200 && response.data.data != null) {
        const detailsheader = response.data.data
        setDropDown(detailsheader)
      }
    } catch (error) { }
  }

  function showAllergyFormModal() {
    setButtonTitle('Save')
    setAllergyFormModal(true);
  }

  const handleOk = () => {
    setAllergyFormModal(false);
  };

  const handleClose = () => {
    setAllergyFormModal(false);
    setButtonTitle('Save')
    form.resetFields()
  };

  const handleSaveAllergyDetails = async (values) => {
    debugger
    const allergy = {
      AllergyId: values.AllergyId ? values.AllergyId : 0,
      CategoryId: values.Category,
      Allergen: values.Allergen,
      ReactionTypeId: values.ReactionType,
      Reaction: values.Reaction,
      ConfirmationId: values.Confirmation,
      Approximately: values.Approximately,
      SinceId: values.since,
      Day: values.Day,
      Month: values.Month,
      Year: values.Year,
      StatusId: values.Status,
      SeverityId: values.Severity,
      DateofOnsetstring: values.onsetDate ? values.onsetDate.format('DD-MM-YYYY') : '',
      SourceOfInfoId: values.source,
      SiteOfReaction: values.reaction,
      RelievingFactor: values.reliving,
      DateOfClosurestring: values.closureDate ? values.closureDate.format('DD-MM-YYYY') : '',
      Remarks: values.remarks,
      EncounterId: Patient.Patient.Encounter,
      PatientId: Patient.Patient.PatientId
    }
    const response = await customAxios.post(urlSaveAllergy, allergy, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      fetch()
      handleClose()
    }
  }

  const handleOkPrev = () => setIsModalOpen(false)

  const columns1 = [
    {
      title: "Date and Time",
      dataIndex: "CreatedDatetimeString",
      key: "1",
      width: 200,
    },
    {
      title: "Category",
      dataIndex: "CategoryName",
      key: "2",
    },
    {
      title: "Allergen",
      dataIndex: "AllergenName",
      key: "3",
    },
    {
      title: "Reaction Type",
      dataIndex: "ReactionType",
      key: "4",
    },
    {
      title: "Reaction",
      dataIndex: "Reaction",
      key: "5",
    },
  ];

  const handleDelete = async (record) => {
    debugger

    // try {
    //   const response = await customAxios.delete(urlDeleteFamily, {
    //     params: {
    //       Id: record.HeaderId,
    //       PatientId: Patient.Patient.PatientId,
    //       EncounterId: Patient.Patient.Encounter
    //     }
    //   });
    //   if (response.status === 200 && response.data.data != null) {
    //     const detailsheader = response.data.data;
    //     GetUpdate(detailsheader)
    //     message.success('Deleted')
    //   }
    // } catch (error) { }
  }

  const handleEdit = async (record) => {
    debugger
    form.setFieldsValue({
      'AllergyId': record.AllergyId,
      'Category': record.CategoryId,
      'Allergen': record.Allergen,
      'ReactionType': record.ReactionTypeId,
      'Reaction': record.Reaction,
      'Confirmation': record.ConfirmationId,
      'Approximately': record.Approximately,
      'since': record.SinceId,
      "Day": record.Day,
      'Month': record.Month,
      'Year': record.Year,
      'Status': record.StatusId,
      'Severity': record.SeverityId,
      'onsetDate': dayjs(record.DateofOnsetstring, 'DD-MM-YYYY'),
      'source': record.SourceOfInfoId,
      'reaction': record.SiteOfReaction,
      'reliving': record.RelievingFactor,
      'closureDate': dayjs(record.DateOfClosurestring, 'DD-MM-YYYY'),
      'remarks': record.Remarks,
    })
    setButtonTitle('Update')
    setAllergyFormModal(true)
    // form.setFieldsValue({ 'FHID': record.HeaderId })
    // form.setFieldsValue({ 'FamilyHistory': record.Description });
  }

  return (
    <>
      <Row gutter={32}>
        <Col span={6}>
          <Button
            className="dfja"
            type="primary"
            size="middle"
            onClick={showAllergyFormModal}
          >
            <PlusCircleOutlined
              className="dfja"
              style={{ fontSize: "1.1rem" }}
            />
            Add Allergy Details
          </Button>
        </Col>
        <Col span={6}>
          <Button size="middle" onClick={showModal}>
            Previous Allergy Details
            <FaHistory style={{ marginLeft: "0.5rem" }} />
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={18}>
          <CustomTable
            // actionColumn={false}
            dataSource={Patient.initialData.NewAllergyList}
            columns={columns1}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </Col>
      </Row>
      <Modal
        centered
        width={"70%"}
        title="Allergy Details"
        open={allergyFormModal}
        onOk={handleOk}
        onCancel={handleClose}
        maskClosable={false}
        footer={[
          <Button
            key="submit"
            size="middle"
            type="primary"
            onClick={() => form.submit()}
          >
            {buttonTitle}
          </Button>,
          <Button danger size="middle" key="back" onClick={handleClose}>
            Cancel
          </Button>,
        ]}
      >
        <p style={{ margin: "0rem 0 1rem 0" }}>
          Add Allergy Related Information of the Patient
        </p>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveAllergyDetails}
          scrollToFirstError={true}
          initialValues={{
            Approximately: false,
            onsetDate: dayjs(),
            closureDate: dayjs()
          }}
        >
          <Row gutter={32}>
            <ColWithSixSpan>
              <Form.Item
                name="Category"
                label="Category"
                // hasFeedback
                rules={[{ required: true, message: "Please select Category" }]}
              >
                <Select
                  placeholder="Select Category"
                  allowClear
                // options={allergyCategoryOptions}  
                >
                  <Select.Option key={1} value={1}>Food</Select.Option>
                  <Select.Option key={2} value={2}>Drug</Select.Option>
                  <Select.Option key={3} value={3}>Environment</Select.Option>
                  <Select.Option key={4} value={4}>No Allergies/Adverse Reactions</Select.Option>
                </Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="Allergen" label="Allergen" rules={[{ required: true, message: "Please select Allergen" }]}>
                <Select placeholder="Select Allergen" allowClear >
                  {dropDown.Allergitype.map((option) => (
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
              <Form.Item name="ReactionType" label="Reaction Type" rules={[{ required: true, message: "Please select ReactionType" }]}>
                <Select
                  placeholder="Select Reaction Type"
                  allowClear
                // options={allergyCategoryOptions}                  
                >
                  {dropDown.drugshis.map((option) => (
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
              <Form.Item name="Reaction" label="Reaction" rules={[{ required: true, message: "Please Enter Reaction" }]}>
                {/* <Select
                  placeholder="Select Reaction"
                  allowClear
                  options={allergyCategoryOptions}
                ></Select> */}
                <Input />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="Confirmation" label="Confirmation">
                <Select
                  placeholder="Select Confirmation"
                  allowClear
                // options={allergyCategoryOptions}                  
                >
                  <Select.Option key={1} value={1}>Sure</Select.Option>
                  <Select.Option key={2} value={2}>Suspected</Select.Option>
                </Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="Approximately" label="Approximately" valuePropName="checked">
                <Checkbox />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="since" label="Since">
                <Select
                  placeholder="Select"
                  allowClear
                // options={allergyCategoryOptions}
                >
                  <Select.Option key={1} value={1}>At Age</Select.Option>
                  <Select.Option key={2} value={2}>Last</Select.Option>
                </Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Row gutter={16}>
                <ColWithEightSpan>
                  <Form.Item name="Day" label="Day">
                    <Input disabled />
                  </Form.Item>
                </ColWithEightSpan>
                <ColWithEightSpan>
                  <Form.Item name="Month" label="Month">
                    <Input disabled />
                  </Form.Item>
                </ColWithEightSpan>
                <ColWithEightSpan>
                  <Form.Item name="Year" label="Year">
                    <Input disabled />
                  </Form.Item>
                </ColWithEightSpan>
              </Row>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="Status" label="Status">
                <Select
                  placeholder="Select Status"
                  allowClear
                // options={allergyCategoryOptions}
                >
                  <Select.Option key={1} value={1}>Active</Select.Option>
                  <Select.Option key={2} value={2}>Resolved</Select.Option>
                </Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="Severity" label="Severity">
                <Select
                  placeholder="Select Severity"
                  allowClear
                // options={allergyCategoryOptions}
                >
                  <Select.Option key={1} value={1}>Mild</Select.Option>
                  <Select.Option key={2} value={2}>Moderate</Select.Option>
                  <Select.Option key={3} value={3}>Severe</Select.Option>
                </Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="onsetDate" label="Date of Onset (Approx.)" rules={[{ required: true, message: "Please Pick Date" }]}>
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD-MM-YYYY"
                  allowClear
                />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan></ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="source" label="Source of Information">
                <Select
                  placeholder="Select Source of Information"
                  allowClear
                // options={allergyCategoryOptions}
                >
                  <Select.Option key={1} value={1}>Patient</Select.Option>
                  <Select.Option key={2} value={2}>Family</Select.Option>
                  <Select.Option key={3} value={3}>Spouse</Select.Option>
                  <Select.Option key={4} value={4}>Colleague</Select.Option>
                </Select>
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="reaction" label="Site of Reaction">
                {/* <Select
                  placeholder="Enter Site of Reaction here"
                  allowClear
                  options={allergyCategoryOptions}
                ></Select> */}
                <Input />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="reliving" label="Reliving Factor">
                {/* <Select
                  placeholder="Enter Reliving Factor here"
                  allowClear
                  options={allergyCategoryOptions}
                ></Select> */}
                <Input />
              </Form.Item>
            </ColWithSixSpan>
            <ColWithSixSpan>
              <Form.Item name="closureDate" label="Date of Closure (Approx.)">
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD-MM-YYYY"
                  allowClear
                />
              </Form.Item>
              <Form.Item name="AllergyId" hidden>
                <Input />
              </Form.Item>
            </ColWithSixSpan>
            <Col span={24}>
              <Form.Item name="remarks" label="Remarks">
                <TextArea rows={2} placeholder="Enter Remarks here" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal
        title="Previous Allergies"
        open={isModalOpen}
        onOk={handleOkPrev}
        onCancel={handleOkPrev}
        maskClosable={false}
        footer={[
          <Button key="ok" type="primary" onClick={handleOkPrev}>
            Close
          </Button>,
        ]}
      >
        <div>
          <span>Previous Deatils : </span>
          <Select
            defaultValue={["lastOneMonth"]}
            placeholder="Select Range"
            style={{
              margin: "0.5rem",
              width: "40%",
            }}
            options={[
              {
                value: "previousAll",
                label: "Previous All",
              },
              {
                value: "lastOneWeek",
                label: "Last One Week",
              },
              {
                value: "last15days",
                label: "Last 15 Days",
              },
              {
                value: "lastOneMonth",
                label: "Last 1 Month",
              },
              {
                value: "lastThreeMonths",
                label: "Last 3 Months",
              },
              {
                value: "lastSixMonths",
                label: "Last 6 Months",
              },
              {
                value: "lastOneYear",
                label: "Last 1 Year",
              },
            ]}
          />
        </div>
        <Table
          size="small"
          columns={columns}
          expandable={{
            expandedRowRender: (record) => (
              <span
                style={{
                  margin: 0,
                }}
              >
                {record.ReactionType + ' -> ' + record.Reaction}
              </span>
            ),
            // rowExpandable: (record) => record.name !== "Not Expandable",
          }}
          dataSource={prevAllergyTable}
        />
      </Modal>
    </>
  );
}

export default Allergy;
