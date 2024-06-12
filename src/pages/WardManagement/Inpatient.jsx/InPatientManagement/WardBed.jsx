import { MoreOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  Dropdown,
  Menu,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import React, { useState } from "react";
const { Text } = Typography;
import occupied from "../../../../assets/occupied.png";
import vacant from "../../../../assets/vacant.png";
import BlockBedModal from "./BlockBedModal";
import DirectTransferModal from "./DirectTransferModal";
import DischargeInitiation from "./DischargeInitiationModal";
import RecordExpectedDischarge from "./RecordExpectedDischargeModal";
import Movement from "./MovementModal";
import Prescription from "./PrescriptionModal";
import OrderEntry from "./OrderEntryModal";

function WardBed({ bed }) {
  const [blockBedModalOpen, setBlockBedModalOpen] = useState(false);
  const [directTransferModalOpen, setDirectTransferModalOpen] = useState(false);
  const [dischargeInitiationModalOpen, setDischargeInitiationModalOpen] =
    useState(false);
  const [
    recordExpectedDischargeModalOpen,
    setRecordExpectedDischargeModalOpen,
  ] = useState(false);
  const [movementModalOpen, setMovementModalOpen] = useState(false);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [orderEntryModalOpen, setOrderEntryModalOpen] = useState(false);
  const vacantBedItems = [
    {
      label: "Block Bed",
      key: "11",
      onClick: () => {
        setBlockBedModalOpen(true);
      },
    },
  ];

  const vacantBedMenu = (
    <Menu>
      {vacantBedItems.map((item) => (
        <Menu.Item key={item.key} onClick={item.onClick}>
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  const occupiedBedItems = [
    {
      label: "Direct Transfer",
      key: "21",
      onClick: () => {
        setDirectTransferModalOpen(true);
      },
    },
    {
      label: "Discharge Initiation",
      key: "22",
      onClick: () => {
        setDischargeInitiationModalOpen(true);
      },
    },
    {
      label: "Record Expected Discharge",
      key: "23",
      onClick: () => {
        setRecordExpectedDischargeModalOpen(true);
      },
    },
    {
      label: "Movement",
      key: "24",
      onClick: () => {
        setMovementModalOpen(true);
      },
    },
    {
      label: "Patient Indent",
      key: "25",
      onClick: () => {
        setIsBlockBedModalOpen(true);
      },
    },
    {
      label: "Prescription",
      key: "26",
      onClick: () => {
        setPrescriptionModalOpen(true);
      },
    },
    {
      label: "Patient Consumption",
      key: "27",
      onClick: () => {
        setIsBlockBedModalOpen(true);
      },
    },
    {
      label: "Order Entry",
      key: "28",
      onClick: () => {
        setOrderEntryModalOpen(true);
      },
    },
    {
      label: "Patient Vital",
      key: "29",
      onClick: () => {
        setIsBlockBedModalOpen(true);
      },
    },
    {
      label: "Drug Chart",
      key: "30",
      onClick: () => {
        setIsBlockBedModalOpen(true);
      },
    },
    {
      label: "Fluid Chart",
      key: "31",
      onClick: () => {
        setIsBlockBedModalOpen(true);
      },
    },
    {
      label: "Dr Notes",
      key: "32",
      onClick: () => {
        setIsBlockBedModalOpen(true);
      },
    },
    {
      label: "Nurse Notes",
      key: "33",
      onClick: () => {
        setIsBlockBedModalOpen(true);
      },
    },
    {
      label: "Antenatal Vitals",
      key: "34",
      onClick: () => {
        setIsBlockBedModalOpen(true);
      },
    },
  ];

  const occupiedBedMenu = (
    <Menu>
      {occupiedBedItems.map((item) => (
        <Menu.Item key={item.key} onClick={item.onClick} style={{}}>
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Col key={bed.id}>
      <Badge.Ribbon
        text={bed.status === "available" ? "Available" : "Occupied"}
        color={bed.status === "available" ? "green" : "red"}
      >
        <Card
          hoverable
          size="small"
          style={{
            width: "15rem",
            height: "10rem",
            backgroundColor: bed.status === "available" ? "#C5EBAA" : "#FFBABA",
          }}
          cover={
            <img
              src={bed.status === "available" ? vacant : occupied}
              style={{ objectFit: "contain", marginTop: "0.8rem" }}
              height={40}
              width={40}
            />
          }
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Dropdown
              overlay={
                bed.status === "available" ? vacantBedMenu : occupiedBedMenu
              }
              placement="bottom"
              arrow
              trigger={["click"]}
            >
              <Button
                type="text"
                shape="circle"
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                }}
                icon={
                  <MoreOutlined
                    style={{
                      transform: "rotate(90deg)",
                    }}
                  />
                }
              />
            </Dropdown>
            {/* <Tag
              color={bed.status === "available" ? "#0D9276" : "#FF4D4F"}
              style={{
                position: "absolute",
                top: "-50%",
                right: "70%",
                fontSize: "1rem",
              }}
            >
              {bed.status.charAt(0).toUpperCase() + bed.status.slice(1)}
            </Tag> */}
            <Text strong>{bed.name}</Text>
            <Tooltip
              placement="rightBottom"
              title={
                <span>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    <li>{bed.patientName}</li>
                    <li>{bed.uhId}</li>
                    <li>{bed.age}</li>
                    <li>{bed.gender}</li>
                    <li>Bed : {bed.name}</li>
                  </ul>
                </span>
              }
            >
              <Text strong style={{ color: "brown" }}>
                {bed.patientName || "N/A"}
              </Text>
            </Tooltip>
            <Text
              strong
              size="md"
              style={{
                marginTop: "12px",
              }}
            >
              {bed.uhId || "N/A"}
            </Text>
          </div>
        </Card>
      </Badge.Ribbon>
      <BlockBedModal
        bed={bed}
        open={blockBedModalOpen}
        handleClose={() => setBlockBedModalOpen(false)}
      />
      <DirectTransferModal
        bed={bed}
        open={directTransferModalOpen}
        handleClose={() => setDirectTransferModalOpen(false)}
      />
      <DischargeInitiation
        bed={bed}
        open={dischargeInitiationModalOpen}
        handleClose={() => setDischargeInitiationModalOpen(false)}
      />
      <RecordExpectedDischarge
        bed={bed}
        open={recordExpectedDischargeModalOpen}
        handleClose={() => setRecordExpectedDischargeModalOpen(false)}
      />
      <Movement
        bed={bed}
        open={movementModalOpen}
        handleClose={() => setMovementModalOpen(false)}
      />
      <Prescription
        bed={bed}
        open={prescriptionModalOpen}
        handleClose={() => setPrescriptionModalOpen(false)}
      />
      <OrderEntry
        bed={bed}
        open={orderEntryModalOpen}
        handleClose={() => setOrderEntryModalOpen(false)}
      />
    </Col>
  );
}

export default WardBed;
