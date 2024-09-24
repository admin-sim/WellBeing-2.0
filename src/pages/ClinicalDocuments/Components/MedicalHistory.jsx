import { Button, AutoComplete, Col, Form, Modal, message, Row, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import { FaHistory } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { urlGetAllIcd, urlSaveIcd, urlGetMHBasedonRange, urlDeleteMedical } from "../../../../endpoints";
import customAxios from "../../../components/customAxios/customAxios";
import dayjs from "dayjs";
import CustomTable from "../../../components/customTable";

const columnsForPreviousMedicalHistory = [
  {
    title: "Sl. No.",
    dataIndex: "SlNo",
    key: "SlNo",
    width: 70,
  },
  {
    title: "Date",
    dataIndex: "DateString",
    key: "DateString",
    width: 100,
  },
  {
    title: "ICD Code",
    dataIndex: "Code",
    key: "Code",
    width: 100,
  },
  {
    title: "Description",
    dataIndex: "Description",
    key: "Description",
  },
];

function MedicalHistory(Patient) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedicalHistoryDetails, setSelectedMedicalHistoryDetails] = useState([]);
  const [form] = Form.useForm();
  const [previousHistory, setPreviousHistory] = useState([])
  const [productOptions, setProductOptions] = useState([]);
  // const [mHTable, setMHTable] = useState(initialData.MedicalHistory)

  const showModal = async () => {
    debugger
    const response = await customAxios.get(`${urlGetMHBasedonRange}?PatientId=${Patient.Patient.PatientId}&EncounterId=${Patient.Patient.EncounterId}&Range=${dayjs()}`);
    const apiData = response.data.data.MedicalHistoryList.map((item, index) => {
      return {
        ...item,
        SlNo: index + 1,
      }
    })
    setPreviousHistory(apiData)
    setIsModalOpen(true)
  }
  const handleOk = () => setIsModalOpen(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await customAxios.get(
  //         `${urlGetMHBasedonRange}?PatientId=${Patient.Patient.PatientId}&EncounterId=${Patient.Patient.EncounterId}&Range=${dayjs()}`
  //       );
  //       if (response.status === 200 && response.data.data != null) {
  //         const detailsheader = response.data.data.ChiefList;
  //         setMHTable(detailsheader);
  //       }
  //     } catch (error) { }
  //   }
  //   fetchData()
  // }, [Patient, initialData])

  // const handleSelect = (value) => {
  //   setSelectedMedicalHistoryDetails([...selectedMedicalHistoryDetails, value]);
  //   form.resetFields();
  // };

  const handleSearch = async (searchText) => {
    if (searchText) {
      const response = await customAxios.get(`${urlGetAllIcd}?Product=${searchText}`);
      const apiData = response.data.data;
      const newOptions = apiData.map((item) => ({
        value: item.IcdCode + '-' + item.IcdDescription,
        key: item.IcdCode,
        Description: item.IcdDescription
      }));
      setProductOptions(newOptions);
    }
  }

  const handleDelete = (record) => {
    setSelectedMedicalHistoryDetails(
      selectedMedicalHistoryDetails.filter((item) => item.Description !== record.name)
    );
  };

  const handleSelect = (value, option, column) => {
    const icd = {
      IcdCode: option.key,
      Description: option.Description
    }
    setSelectedMedicalHistoryDetails((prevDetails) => {
      return [...prevDetails, icd];
    });
    form.resetFields()
  };

  const data = selectedMedicalHistoryDetails.map((value, index) => ({
    key: `${index + 1}`,
    name: value.Description,
    code: value.IcdCode,
    SlNo: index + 1,
  }));

  const columns = [
    { title: "Sl. No.", dataIndex: "SlNo", key: "SlNo", width: 100 },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Action",
      key: "action",
      width: 180,
      render: (_, record) => (
        <Button type="ghost" size="middle" onClick={() => handleDelete(record)}>
          <RiDeleteBin6Line />
        </Button>
      ),
    },
  ];

  const handleToSave = async () => {
    const Icd = data.map((item) => {
      return {
        PatientId: Patient.Patient.PatientId,
        EncounterId: Patient.Patient.EncounterId,
        IcdCode: item.code,
        IcdDescription: item.name
      }
    })

    const response = await customAxios.post(urlSaveIcd, Icd, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status == 200) {
      setSelectedMedicalHistoryDetails([])
      message.success('Saved')
      GetUpdate(response.data.data)
    }
  }

  const GetUpdate = (value) => {
    debugger
    Patient.handleUpdate(value);
  }

  const columns1 = [
    {
      title: "Date and Time",
      dataIndex: "DateString",
      key: "1",
      width: 200,
    },
    {
      title: "Medical History",
      dataIndex: "Description",
      key: "2",
    },
  ];

  const handleDeleteRecord = async (record) => {
    debugger
    try {
      const response = await customAxios.delete(urlDeleteMedical, {
        params: {
          Id: record.HeaderId,
          PatientId: Patient.Patient.PatientId,
          EncounterId: Patient.Patient.EncounterId
        }
      });
      if (response.status === 200 && response.data.data != null) {
        const detailsheader = response.data.data;
        GetUpdate(detailsheader)
        message.success('Deleted')
      }
    } catch (error) { }
  }

  return (
    <>
      <Row>
        <Col span={18}>
          <div style={{ marginBottom: "1rem" }}>
            <Form form={form}>
              <Form.Item
                name="MedicalHistorySelect"
                label="Type at least 2 characters"
              >
                <AutoComplete allowClear
                  options={productOptions}
                  onSearch={handleSearch}
                  onSelect={(value, option) =>
                    handleSelect(value, option, "MedicalHistorySelect")
                  }
                  onChange={(value) => {
                    if (!value) {
                      setProductOptions([]);
                    }
                  }}
                // allowClear={{
                //   clearIcon: <CloseSquareFilled />,
                // }}
                // disabled={!!record.PoLineId}
                />
              </Form.Item>
            </Form>
          </div>
        </Col>
        <Col span={6} className="d-flex justifyCenter">
          <Button
            size="middle"
            className="d-flex allignCenter"
            onClick={showModal}
          >
            Previous Medical History
            <FaHistory style={{ marginLeft: "0.5rem" }} />
          </Button>
        </Col>
      </Row>
      <Table size="small" columns={columns} dataSource={data} />
      <Col span={20}>
        <Button onClick={handleToSave} style={{ float: 'right', marginTop: '10px' }} type="primary">Save</Button>
      </Col>
      <Row>
        <Col span={18}>
          <CustomTable
            // actionColumn={false}
            dataSource={Patient.initialData.MedicalHistoryList}
            columns={columns1}
            onDelete={handleDeleteRecord}
          />
        </Col>
      </Row>
      <Modal
        title="Previous Medical History"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleOk}
        maskClosable={false}
        footer={[
          <Button key="ok" type="primary" onClick={handleOk}>
            Close
          </Button>,
        ]}
      >
        <div>
          <span>Previous Details : </span>
          <Select
            defaultValue={["lastOneMonth"]}
            placeholder="Select Range"
            style={{ margin: "0.5rem", width: "40%" }}
            options={[
              { value: "previousAll", label: "Previous All" },
              { value: "lastOneWeek", label: "Last One Week" },
              { value: "last15days", label: "Last 15 Days" },
              { value: "lastOneMonth", label: "Last 1 Month" },
              { value: "lastThreeMonths", label: "Last 3 Months" },
              { value: "lastSixMonths", label: "Last 6 Months" },
              { value: "lastOneYear", label: "Last 1 Year" },
            ]}
          />
        </div>
        <Table
          size="small"
          columns={columnsForPreviousMedicalHistory}
          dataSource={previousHistory}
        />
      </Modal>
    </>
  );
}

export default MedicalHistory;
