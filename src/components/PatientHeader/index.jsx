import React from "react";
import {
  Avatar,
  Badge,
  Button,
  Col,
  ConfigProvider,
  Divider,
  Row,
  Tooltip,
} from "antd";
import { FcDocument, FcInfo } from "react-icons/fc";
import { DollarTwoTone, FolderOpenTwoTone } from "@ant-design/icons";
import male from "../../assets/m.png";
import { isMobile } from "react-device-detect";

function PatientHeader({ encounterId }) {
  const patient = {
    PatientName: "Nitish Arali",
    UhId: "COH-001",
    PatientGender: "Male",
    GeneratedEncounterId: "EID-501",
    Age: "28Y",
    DateOfBirthstring: "01-01-1995",
  };
  const displayEncounterId = patient?.GeneratedEncounterId || encounterId;
  return isMobile ? (
    <>
      <Row
        style={{
          padding: "0.2rem 0.5rem",
          borderRadius: "0.5rem",
          margin: "1.5rem 0 0rem 0",
          boxShadow: "0px 0px 2px 2px rgba(86,144,199,1)",
        }}
      >
        <Col span={20}>
          <Row gutter={16}>
            <Col
              span={6}
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
              }}
            >
              <Avatar
                shape="square"
                size={50}
                src={<img src={male} alt="avatar" />}
              />
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
                  {/* <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                  VisitId&nbsp;:
                </span>
                <span>{patient?.GeneratedEncounterId}</span> */}

                  <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                    {/* {displayEncounterId ? "Encounter" : ""}&nbsp;: */}
                    Encounter&nbsp;:
                  </span>
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
                <Button
                  type="link"
                  icon={<FolderOpenTwoTone style={{ fontSize: "1.8rem" }} />}
                />
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
                <Badge count={0} showZero color="#FA7070">
                  <Button
                    type="link"
                    icon={<DollarTwoTone style={{ fontSize: "1.6rem" }} />}
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
      }}
    >
      <Col span={18}>
        <Row gutter={16}>
          <Col span={3}>
            <Avatar
              shape="square"
              size={50}
              src={<img src={male} alt="avatar" />}
            />
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
                <span style={{ fontWeight: "bold" }}>Gender&nbsp;:&nbsp;</span>
                <span>{patient?.PatientGender}</span>
              </Col>
              <Col span={24}>
                {/* <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                  VisitId&nbsp;:
                </span>
                <span>{patient?.GeneratedEncounterId}</span> */}

                <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                  {/* {displayEncounterId ? "Encounter" : ""}&nbsp;: */}
                  Encounter&nbsp;:{" "}
                </span>
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
              <Button
                type="link"
                icon={<FolderOpenTwoTone style={{ fontSize: "1.8rem" }} />}
              />
            </Tooltip>
          </Col>
          <Col offset={2} span={3}>
            <Tooltip title="Assigned plan">
              <Button
                type="link"
                icon={<FcDocument style={{ fontSize: "1.8rem" }} />}
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
              <Badge count={0} showZero color="#FA7070">
                <Button
                  type="link"
                  icon={<DollarTwoTone style={{ fontSize: "1.6rem" }} />}
                />
              </Badge>
            </Tooltip>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default PatientHeader;
