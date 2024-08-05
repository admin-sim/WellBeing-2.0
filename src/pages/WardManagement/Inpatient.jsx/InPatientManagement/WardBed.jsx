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
import DischargeInitiationModal from "./DischargeInitiationModal";
import RecordExpectedDischarge from "./RecordExpectedDischargeModal";
import Movement from "./MovementModal";
import Prescription from "./PrescriptionModal";
import OrderEntry from "./OrderEntryModal";
import PatientVitalModal from "./PatientVitalModal";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import { urlGetPatientHeaderDetails, urlShowModal } from "../../../../../endpoints.js";


function WardBed({ bed }) {
  const [blockBedModalOpen, setBlockBedModalOpen] = useState(false);
  const [directTransferModalOpen, setDirectTransferModalOpen] = useState(false);
  const [dischargeInitiationModalOpen, setDischargeInitiationModalOpen] = useState(false);
  const [recordExpectedDischargeModalOpen, setRecordExpectedDischargeModalOpen] = useState(false);
  const [movementModalOpen, setMovementModalOpen] = useState(false);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [orderEntryModalOpen, setOrderEntryModalOpen] = useState(false);
  const [patientVitalModalOpen, setPatientVitalModalOpen] = useState()
  const [patientData, setPatientData] = useState()
  const [dropDown, setDropDown] = useState({
    FacilityDepartment: [],
    FacilityDeptServiceLocation: [],
    WardCategory: [],
    Wards: [],
    // Beds: [],
    ReasonForTransfer: [],
    PatientsCurrentDetails: {},
    DispositionType: [],
    FacilityDepartmentProvider: []
  });

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

  const OpenModel = async (record) => {
    debugger
    try {
      const response = await customAxios.get(
        `${urlGetPatientHeaderDetails}?PatientId=${bed.PatientId}&EncounterId=${bed.EncounterId}`
      );
      if (response.status === 200 && response.data.data != null) {
        const detailsheader = response.data.data.EncounterModel;
        setPatientData(detailsheader);
      } else {
        console.error("Failed to fetch patient details");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    try {
      const response = await customAxios.get(
        `${urlShowModal}?Id=${parseInt(record.key)}&PatientID=${bed.PatientId}&LocationID=${bed.ServiceLocationId}&WardCategoryId=${bed.WardCategoryID}&BedStatus=${null}&EncounterId=${bed.EncounterId}&FromDate=${null}&ToDate=${null}&flag=${1}`
      );
      if (response.status === 200 && response.data.data != null) {
        if (record.key !== '14' && record.key !== '20') {
          setDropDown(response.data.data);
        }
      } else {
        console.error("Failed to fetch patient details");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    if (record.key == '1') {
      setDirectTransferModalOpen(true)
    } else if (record.key == '5') {
      setDischargeInitiationModalOpen(true);
    } else if (record.key == '6') {
      setRecordExpectedDischargeModalOpen(true);
    }
    else if (record.key == '3') {
      setMovementModalOpen(true);
    }
    else if (record.key == '14') {
      setPatientVitalModalOpen(true);
    }
    else if (record.key == '20') {
      setPrescriptionModalOpen(true);
    }
  }

  const occupiedBedItems = [
    {
      label: "Direct Transfer",
      key: "1",
      onClick: (record) => {
        OpenModel(record)
      },
    },
    {
      label: "Discharge Initiation",
      key: "5",
      onClick: (record) => {
        OpenModel(record)
      },
    },
    {
      label: "Record Expected Discharge",
      key: "6",
      onClick: (record) => {
        OpenModel(record)
      },
    },
    {
      label: "Movement",
      key: "3",
      onClick: (record) => {
        OpenModel(record)
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
      key: "20",
      onClick: (record) => {
        OpenModel(record)
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
      key: "14",
      onClick: (record) => {
        OpenModel(record)
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
    <Col key={bed.BedID}>
      <Badge.Ribbon
        text={bed.PatientStatus === "Vacant" ? "Vacant" : "Occupied"}
        color={bed.PatientStatus === "Vacant" ? "green" : "red"}
      >
        <Card
          hoverable
          size="small"
          style={{
            width: "15rem",
            height: "10rem",
            backgroundColor:
              bed.PatientStatus === "Vacant" ? "#C5EBAA" : "#FFBABA",
          }}
          cover={
            <img
              src={bed.PatientStatus === "Vacant" ? vacant : occupied}
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
                bed.PatientStatus === "Vacant" ? vacantBedMenu : occupiedBedMenu
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
            <Text strong>{bed.BedNo}</Text>
            <Tooltip
              placement="rightBottom"
              title={
                <span>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    <li>{bed.PatientName}</li>
                    <li>{bed.UhId}</li>
                    <li>{bed.Age}</li>
                    <li>{bed.Gender}</li>
                    <li>Bed : {bed.BedNo}</li>
                  </ul>
                </span>
              }
            >
              <Text strong style={{ color: "brown" }}>
                {bed.PatientName || "N/A"}
              </Text>
            </Tooltip>
            <Text
              strong
              size="md"
              style={{
                marginTop: "12px",
              }}
            >
              {bed.UhId || "N/A"}
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
        Dropdown={dropDown}
        patient={patientData}
        open={directTransferModalOpen}
        handleClose={() => setDirectTransferModalOpen(false)}
      />
      <DischargeInitiationModal
        bed={bed}
        Dropdown={dropDown}
        patient={patientData}
        open={dischargeInitiationModalOpen}
        handleClose={() => setDischargeInitiationModalOpen(false)}
      />
      <RecordExpectedDischarge
        bed={bed}
        Dropdown={dropDown}
        patient={patientData}
        open={recordExpectedDischargeModalOpen}
        handleClose={() => setRecordExpectedDischargeModalOpen(false)}
      />
      <Movement
        bed={bed}
        Dropdown={dropDown}
        patient={patientData}
        open={movementModalOpen}
        handleClose={() => setMovementModalOpen(false)}
      />
      <Prescription
        bed={bed}
        Dropdown={dropDown}
        patient={patientData}
        open={prescriptionModalOpen}
        handleClose={() => setPrescriptionModalOpen(false)}
      />
      <OrderEntry
        bed={bed}
        Dropdown={dropDown}
        patient={patientData}
        open={orderEntryModalOpen}
        handleClose={() => setOrderEntryModalOpen(false)}
      />
      <PatientVitalModal
        bed={bed}
        Dropdown={dropDown}
        patient={patientData}
        open={patientVitalModalOpen}
        handleClose={() => setPatientVitalModalOpen(false)}
      />
    </Col>
  );
}

export default WardBed;
