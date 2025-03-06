import React, { useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Col,
  ConfigProvider,
  Divider,
  Modal,
  Row,
  Tooltip,
  Upload,
  message,
} from "antd";
import { FcDocument, FcInfo } from "react-icons/fc";
import { DollarTwoTone, FolderOpenTwoTone } from "@ant-design/icons";
import male from "../../assets/m.png";
import female from "../../assets/f.png";
import defaultPic from "../../assets/defaultPic.png";
import { isMobile } from "react-device-detect";
import CustomTable from "../customTable/index";
import { urlShowAllPendingBills } from "../../../endpoints";
import customAxios from "../customAxios/customAxios";
import { useNavigate } from "react-router-dom";
const { Dragger } = Upload;

function PatientHeader({ patient, encounterId, style }) {
  const [billModalOpen, setBillModalOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const displayEncounterId = patient?.GeneratedEncounterId || encounterId;
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const handleBillClick = async () => {
    const response = await customAxios.get(
      `${urlShowAllPendingBills}?PatientId=${patient.PatientId}`
    );
    if (response.status === 200 && response.data != null) {
      const { UhId, PatientName, GeneratedEncounterId } = patient;
      const updatedReceiptAllocations = response.data.ReceiptAllocations.map((item) => ({
        ...item,
        UhId,
        PatientName,
        GeneratedEncounterId,
      }));
      setData(updatedReceiptAllocations);
      setBillModalOpen(true);
    }
  };

  const handleUpload = async (options) => {
    const { file, onSuccess, onError } = options;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await customAxios.post("/upload-endpoint", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        message.success(`${file.name} file uploaded successfully`);
        onSuccess(response.data, file);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      message.error(`${file.name} file upload failed.`);
      onError(error);
    } finally {
      setUploading(false);
    }
  };
  
  const handleNavigate = () => {
    debugger; // Optional: for debugging
    navigate("/CreateAssignedPlan", {
      state: {
        patientId: patient?.PatientId,
        encounterId: patient?.EncounterId,
      },
    });
  };
  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false; // Prevent automatic upload
    },
    fileList,
    customRequest: handleUpload,
  };

  const columns = [
    {
      title: "UHID",
      dataIndex: "UhId",
      key: "UhId",
    },
    {
      title: "Encounter",
      dataIndex: "Encounter",
      key: "Encounter",
    },
    {
      title: "PatientName",
      dataIndex: "PatientName",
      key: "PatientName",
    },
    {
      title: "BillNumber",
      dataIndex: "BillNumber",
      key: "BillNumber",
    },
    {
      title: "BillDate",
      dataIndex: "BillDate",
      key: "BillDate",
    },
    {
      title: "BillAmount",
      dataIndex: "BillAmount",
      key: "BillAmount",
    },
    {
      title: "BillSettledAmount",
      dataIndex: "AssocitedBillAmount",
      key: "AssocitedBillAmount",
    },
    {
      title: "OutStandingAmount",
      dataIndex: "OutStandingAmount",
      key: "OutStandingAmount",
      render: (text) => <span style={{ color: "red" }}>{text}</span>,
    },
  ];

  function showGenderPic(Gender) {
    if (Gender === 7) return male;
    if (Gender === 8) return female;
    return defaultPic;
  }

  return (
    <div>
      {isMobile ? (
        <>
          <Row
            style={{
              padding: "0.2rem 0.5rem",
              borderRadius: "0.5rem",
              marginTop: "1.5rem 0 0rem 0",
              boxShadow: "0px 0px 2px 2px rgba(86,144,199,1)",
            }}
          >
            <Col span={20}>
              <Row gutter={16}>
                <Col
                  span={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {patient?.PhotoUrl &&
                  patient?.PhotoUrl.startsWith("data:image/") ? (
                    <img
                      src={patient?.PhotoUrl}
                      alt="Patient"
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        border: "2px solid #ccc",
                      }}
                    />
                  ) : (
                    <Avatar
                      src={showGenderPic(patient?.Gender)}
                      size="large"
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        border: "2px solid #ccc",
                      }}
                    />
                  )}
                </Col>

                <Col span={18}>
                  <Row>
                    <Col span={24}>
                      <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                        UHID&nbsp;:
                      </span>
                      <span>{patient?.UhId}</span>
                    </Col>
                    <Col span={24}>
                      <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                        Name&nbsp;:
                      </span>
                      <span>{patient?.PatientName}</span>
                    </Col>
                    <Col span={24}>
                      <span style={{ fontWeight: "bold" }}>
                        Gender&nbsp;:&nbsp;
                      </span>
                      <span>{patient?.PatientGender}</span>
                    </Col>
                    <Col span={24}>
                      <span style={{ fontWeight: "bold" }}>
                        Encounter&nbsp;:
                      </span>
                      {displayEncounterId && (
                        <span
                          style={{
                            backgroundColor:
                              encounterId && !patient?.GeneratedEncounterId
                                ? "green"
                                : "inherit",
                            color:
                              encounterId && !patient?.GeneratedEncounterId
                                ? "White"
                                : "inherit",
                          }}
                        >
                          {displayEncounterId}
                        </span>
                      )}
                    </Col>
                    <Col span={24}>
                      <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                        Age&nbsp;:
                      </span>
                      <span>{patient?.Age}</span>
                    </Col>
                    <Col span={24}>
                      <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                        Dob&nbsp;:
                      </span>
                      <span>{patient?.DateOfBirthstring}</span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>

            <Col span={4}>
              <Row
                style={{
                  padding: "0.5rem",
                  borderLeft: "1px solid black",
                }}
                className="dfja"
              >
                <Col
                  offset={6}
                  span={18}
                  className="dfja"
                  style={{ marginBottom: "0.5rem" }}
                >
                  <Tooltip title="Browse Files">
                    <Upload {...uploadProps}>
                      <Button
                        type="link"
                        icon={
                          <FolderOpenTwoTone style={{ fontSize: "1.8rem" }} />
                        }
                      />
                    </Upload>
                  </Tooltip>
                </Col>
                <Col
                  offset={6}
                  span={18}
                  className="dfja"
                  style={{ marginBottom: "0.5rem" }}
                >
                  <Tooltip title="Assigned plan">
                    <Button
                      type="link"
                      icon={<FcDocument style={{ fontSize: "1.8rem" }} />}
                      onClick={handleNavigate} // Navigate to the page
                    />
                  </Tooltip>
                </Col>
                <Col
                  offset={6}
                  span={18}
                  className="dfja"
                  style={{ marginBottom: "0.5rem" }}
                >
                  <Tooltip title="Detail Info">
                    <Button
                      type="link"
                      icon={<FcInfo style={{ fontSize: "1.8rem" }} />}
                    />
                  </Tooltip>
                </Col>
                <Col offset={6} span={18} className="dfja">
                  <Tooltip title="Bills">
                    <Badge
                      count={patient?.PendingBillsCount}
                      showZero
                      color="#FA7070"
                    >
                      <Button
                        type="link"
                        icon={<DollarTwoTone style={{ fontSize: "1.6rem" }} />}
                        onClick={handleBillClick}
                      />
                    </Badge>
                  </Tooltip>
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      ) : (
        <Row
          style={{
            padding: "0.2rem 1.8rem",
            borderRadius: "0.5rem",
            margin: "1.5rem 0 0rem 0",
            boxShadow: "0px 0px 2px 2px rgba(86,144,199,1)",
            ...style,
          }}
        >
          <Col span={18}>
            <Row gutter={16}>
              <Col
                span={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {patient?.PhotoUrl &&
                patient?.PhotoUrl.startsWith("data:image/") ? (
                  <img
                    src={patient?.PhotoUrl}
                    alt="Patient"
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      border: "2px solid #ccc",
                    }}
                  />
                ) : (
                  <Avatar
                    src={showGenderPic(patient?.Gender)}
                    size="large"
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      border: "2px solid #ccc",
                    }}
                  />
                )}
              </Col>
              <Col span={9}>
                <Row>
                  <Col span={24}>
                    <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                      UHID&nbsp;:
                    </span>
                    <span>{patient?.UhId}</span>
                  </Col>
                  <Col span={24}>
                    <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                      Name&nbsp;:
                    </span>
                    <span>{patient?.PatientName}</span>
                  </Col>
                </Row>
              </Col>
              <Col span={6}>
                <Row>
                  <Col span={24}>
                    <span style={{ fontWeight: "bold" }}>
                      Gender&nbsp;:&nbsp;
                    </span>
                    <span>{patient?.PatientGender}</span>
                  </Col>
                  <Col span={24}>
                    <span style={{ fontWeight: "bold" }}>Encounter&nbsp;:</span>
                    {displayEncounterId && (
                      <span
                        style={{
                          backgroundColor:
                            encounterId && !patient?.GeneratedEncounterId
                              ? "green"
                              : "inherit",
                          padding: "0 4px",
                          color:
                            encounterId && !patient?.GeneratedEncounterId
                              ? "White"
                              : "inherit",
                        }}
                      >
                        {displayEncounterId}
                      </span>
                    )}
                  </Col>
                </Row>
              </Col>
              <Col span={6}>
                <Row>
                  <Col span={24}>
                    <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                      Age&nbsp;:
                    </span>
                    <span>{patient?.Age}</span>
                  </Col>
                  <Col span={24}>
                    <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                      Dob&nbsp;:
                    </span>
                    <span>{patient?.DateOfBirthstring}</span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row gutter={16} style={{ display: "flex", alignItems: "center" }}>
              <Col span={1}>
                <ConfigProvider
                  theme={{
                    token: { fontSize: "3.6rem", colorSplit: "black" },
                  }}
                >
                  <Divider type="vertical" style={{ fontWeight: 900 }} />
                </ConfigProvider>
              </Col>
              <Col offset={2} span={3}>
                <Tooltip title="Browse Files">
                  <Upload {...uploadProps}>
                    <Button
                      type="link"
                      icon={
                        <FolderOpenTwoTone style={{ fontSize: "1.8rem" }} />
                      }
                    />
                  </Upload>
                </Tooltip>
              </Col>
              <Col offset={2} span={3}>
                <Tooltip title="Assigned plan">
                  <Button
                    type="link"
                    icon={<FcDocument style={{ fontSize: "1.8rem" }} />}
                    onClick={handleNavigate} 
                  />
                </Tooltip>
              </Col>
              <Col offset={2} span={3}>
                <Tooltip title="Detail Info">
                  <Button
                    type="link"
                    icon={<FcInfo style={{ fontSize: "1.8rem" }} />}
                  />
                </Tooltip>
              </Col>
              <Col offset={2} span={3}>
                <Tooltip title="Bills">
                  <Badge
                    count={patient?.PendingBillsCount}
                    showZero
                    color="#FA7070"
                  >
                    <Button
                      type="link"
                      icon={<DollarTwoTone style={{ fontSize: "1.6rem" }} />}
                      onClick={handleBillClick}
                    />
                  </Badge>
                </Tooltip>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
      <Modal
        title="Outstanding Bills"
        open={billModalOpen}
        maskClosable={false}
        width={1000}
        onCancel={() => setBillModalOpen(false)}
        footer={[
          <Button danger onClick={() => setBillModalOpen(false)}>
            Cancel
          </Button>,
        ]}
      >
        <CustomTable
          dataSource={data}
          columns={columns}
          actionColumn={false}
          isFilter={true}
        />
      </Modal>
    </div>
  );
}

export default PatientHeader;