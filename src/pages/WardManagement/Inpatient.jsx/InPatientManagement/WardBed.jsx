import { MoreOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  Dropdown,
  Menu,
  message,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
const { Text } = Typography;
import occupied from "../../../../assets/occupied.png";
import vacant from "../../../../assets/vacant.png";
import BlockBedModal from "./BlockBedModal";
import DirectTransferModal from "./DirectTransferModal";
import DischargeInitiationModal from "./DischargeInitiationModal";
import RecordExpectedDischarge from "./RecordExpectedDischargeModal";
import Movement from "./MovementModal";
import DischargeModal from "./DischargeModal.jsx";
import Prescription from "./PrescriptionModal";
import OrderEntry from "./OrderEntryModal";
import AmendDischargeInitiationModal from "./AmendDischargeInitiationModal.jsx";
import CancelDischargeInitiationModal from "./CancelDischargeInitiationModal.jsx";
import PatientVitalModal from "./PatientVitalModal";
import DrNoteModal from "./DrNoteModal";
import NrNoteModal from "./NrNoteModal";
import ArrivalModal from "./ArrivalModal";
import DrugChartModal from "./DrugChartModal";
import FluidChartModal from "./FluidChartModal";
import customAxios from "../../../../components/customAxios/customAxios.jsx";
import {
  urlGetPatientHeaderDetails,
  urlShowModal,
  urlSavePatientMovement,
  urlRecordExpectedDischargeDate,
  urlShowConfirmUnblock,
  urlGetWards,
  urlGetBeds,
  urlGetWardCategory,
  urlGetServiceLocation,
  urlBillingCreate
} from "../../../../../endpoints.js";
import { values } from "lodash";

function WardBed({ bed, ReLoad }) {
  const [blockBedModalOpen, setBlockBedModalOpen] = useState(false);
  const [dischargeBedModalOpen, setDischargeBedModalOpen] = useState(false);
  const [amendDischargeBedModalOpen, setAmendDischargeBedModalOpen] =
    useState(false);
  const [cancelDischargeBedModalOpen, setCancelDischargeBedModalOpen] =
    useState(false);
  const [directTransferModalOpen, setDirectTransferModalOpen] = useState(false);
  const [dischargeInitiationModalOpen, setDischargeInitiationModalOpen] =
    useState(false);
  const [
    recordExpectedDischargeModalOpen,
    setRecordExpectedDischargeModalOpen,
  ] = useState(false);
  const [movementModalOpen, setMovementModalOpen] = useState(false);
  const [drugChartModalOpen, setDrugChartModalOpen] = useState(false);
  const [fluidChartModalOpen, setFluidChartModalOpen] = useState(false);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [orderEntryModalOpen, setOrderEntryModalOpen] = useState(false);
  const [drNoteModalOpen, setDrNoteModalOpen] = useState(false);
  const [nrNoteModalOpen, setNrNoteModalOpen] = useState(false);
  const [arrivalModalOpen, setArrivalModalOpen] = useState(false)
  const [patientVitalModalOpen, setPatientVitalModalOpen] = useState()
  const [patientData, setPatientData] = useState()
  const [locaton, setLocation] = useState(0)
  const [orderEntry, setOrderEntry] = useState({
    DocumentType: [],
    PatientAccountCharges: [],
    // OrderModel: []
  })
  const [dropDown, setDropDown] = useState({
    FacilityDepartment: [],
    FacilityDeptServiceLocation: [],
    WardCategory: [],
    Wards: [],
    Beds: [],
    ReasonForTransfer: [],
    PatientsCurrentDetails: {},
    DispositionType: [],
    FacilityDepartmentProvider: [],
    MovementDetails: {},
  });

  useEffect(() => {
    const fetchDataHeader = async () => {
      try {
        const response = await customAxios.get(
          `${urlGetPatientHeaderDetails}?PatientId=${PatientId}&EncounterId=${EncounterId}`
        );
        if (response.status === 200 && response.data != null) {
          const detailsheader = response.data.data.EncounterModel;
          setPatientData(detailsheader);
        } else {
        }
      } catch (error) {}
    };
    fetchDataHeader();
  }, []);

  const Close = () => {
    setDirectTransferModalOpen(false);
    setBlockBedModalOpen(false);
    setDischargeInitiationModalOpen(false);
    setRecordExpectedDischargeModalOpen(false);
    setMovementModalOpen(false);
    setArrivalModalOpen(false);
    setDischargeBedModalOpen(false);
    setCancelDischargeBedModalOpen(false);
    setAmendDischargeBedModalOpen(false);
    ReLoad(bed.ServiceLocationId);
  };

  const [dropDown1, setDropDown1] = useState({
    StoreModel: [],
    ReasonForBlock: [],
    NewWardModel: {},
  });

  const vacantBedItems = [
    bed.PatientStatus === "Blocked"
      ? {
        label: "Unblock Bed",
        key: "12",
        onClick: (record) => {
          ShowConfirmUnblock(record);
        },
      }
      : {
        label: "Block Bed",
        key: "11",
        onClick: (record) => {
          ShowConfirmUnblock(record);
        },
      },
  ];

  const ShowConfirmUnblock = async (record) => {
    debugger;
    const block = {
      Type: record.key === "11" ? "Block" : "Unblock",
    };
    const response = await customAxios.get(
      `${urlShowConfirmUnblock}?BedId=${bed.BedID}&LocationID=${bed.ServiceLocationId}&Type=${block.Type}`
    );
    if (response.status === 200 && response.data.data != null) {
      setDropDown1(response.data.data);
      setBlockBedModalOpen(true);
    }
  };

  const MovementBedItems = [
    {
      label: "Arival",
      key: "9",
      onClick: (record) => {
        OpenModel(record);
      },
    },
  ];

  const DischargeBedItems = [
    {
      label: "Discharge",
      key: "10",
      onClick: (record) => {
        OpenModel(record);
      },
    },
    {
      label: "Cancel Discharge Initiation",
      key: "11",
      onClick: (record) => {
        OpenModel(record);
      },
    },
    {
      label: "Amend Discharge Initiation",
      key: "12",
      onClick: (record) => {
        OpenModel(record);
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

  const DischargeBedMenu = (
    <Menu>
      {DischargeBedItems.map((item) => (
        <Menu.Item key={item.key} onClick={item.onClick}>
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  const MovementBedMenu = (
    <Menu>
      {MovementBedItems.map((item) => (
        <Menu.Item key={item.key} onClick={item.onClick}>
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  const OpenModel = async (record) => {
    debugger;
    GetPatientData()
    try {
      const response = await customAxios.get(
        `${urlShowModal}?Id=${parseInt(record.key)}&PatientID=${bed.PatientId
        }&LocationID=${bed.ServiceLocationId}&WardCategoryId=${bed.WardCategoryID
        }&BedStatus=${null}&EncounterId=${bed.EncounterId
        }&FromDate=${null}&ToDate=${null}&flag=${1}`
      );
      if (response.status === 200 && response.data.data != null) {
        if (
          record.key !== "14" &&
          record.key !== "20" &&
          record.key !== "18" &&
          record.key !== "19" &&
          record.key !== "15" &&
          record.key !== "17"
        ) {
          setDropDown(response.data.data);
        } else {
          setDropDown1(response.data.data);
        }
      } else {
        console.error("Failed to fetch patient details");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    if (record.key == "1") {
      setDirectTransferModalOpen(true);
    } else if (record.key == "5") {
      setDischargeInitiationModalOpen(true);
    } else if (record.key == "6") {
      setRecordExpectedDischargeModalOpen(true);
    } else if (record.key == "3") {
      setMovementModalOpen(true);
    } else if (record.key == "14") {
      setPatientVitalModalOpen(true);
    } else if (record.key == "20") {
      setPrescriptionModalOpen(true);
    } else if (record.key == "10") {
      setDischargeBedModalOpen(true);
    } else if (record.key == "11") {
      setCancelDischargeBedModalOpen(true);
    } else if (record.key == "12") {
      setAmendDischargeBedModalOpen(true);
    } else if (record.key == "18") {
      setDrNoteModalOpen(true);
    } else if (record.key == "9") {
      setArrivalModalOpen(true);
    } else if (record.key === "15") {
      setDrugChartModalOpen(true);
    } else if (record.key === "17") {
      setFluidChartModalOpen(true);
    } else if (record.key == "19") {
      setNrNoteModalOpen(true);
    }
  };

  const GetPatientData = async () => {
    try {
      const response = await customAxios.get(
        `${urlGetPatientHeaderDetails}?PatientId=${bed.PatientId}&EncounterId=${bed.EncounterId}`
      );
      if (response.status === 200 && response.data.data != null) {
        const detailsheader = response.data.data.EncounterModel;
        setPatientData(detailsheader)
      } else {
        console.error("Failed to fetch patient details");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const OpenOrderEntry = async (record) => {
    debugger
    GetPatientData()
    const response = await customAxios.get(
      `${urlBillingCreate}?PatientId=${bed.PatientId}&EncounterId=${bed.EncounterId}`
    );
    if (response.status == 200) {
      setOrderEntry(response.data)
      setOrderEntryModalOpen(true);
    }
  }

  const occupiedBedItems = [
    {
      label: "Direct Transfer",
      key: "1",
      onClick: (record) => {
        OpenModel(record);
      },
    },
    {
      label: "Discharge Initiation",
      key: "5",
      onClick: (record) => {
        OpenModel(record);
      },
    },
    {
      label: "Record Expected Discharge",
      key: "6",
      onClick: (record) => {
        OpenModel(record);
      },
    },
    {
      label: "Movement",
      key: "3",
      onClick: (record) => {
        OpenModel(record);
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
        OpenModel(record);
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
      key: "13",
      // onClick: () => {
      //   setOrderEntryModalOpen(true);
      // },
      onClick: (record) => {
        OpenOrderEntry(record);
      }
    },
    {
      label: "Patient Vital",
      key: "14",
      onClick: (record) => {
        OpenModel(record);
      },
    },
    {
      label: "Drug Chart",
      key: "15",
      onClick: (record) => {
        OpenModel(record);
      },
    },
    {
      label: "Fluid Chart",
      key: "17",
      onClick: (record) => {
        OpenModel(record);
      },
    },
    {
      label: "Dr Notes",
      key: "18",
      onClick: (record) => {
        OpenModel(record);
      },
    },
    {
      label: "Nurse Notes",
      key: "19",
      onClick: (record) => {
        OpenModel(record);
      },
    },
    {
      label: "Antenatal Vitals",
      key: "34",
      onClick: (record) => {
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

  const handleSubmit = async (values) => {
    debugger;
    const movement = {
      MovementId: values.MovementId ? values.MovementId : 0,
      Department: values.Department,
      ServiceLocationId: values.ServiceLocation,
      BedID: values.BedId,
      PatientID: values.PatientId,
      MovementReason: values.MovementReason,
      timeMovement: values.ExpectedReturnTime
        ? values.ExpectedReturnTime.format("HH:mm:ss")
        : "0",
      Actualtime: values.ActualTime ? values.ActualTime.format("HH:mm:ss") : 0,
      ReasonforDelay: values.ReasonforDelay ? values.ReasonforDelay : 0,
      Status: values.MovementId ? 2 : 1,
    };
    try {
      const response = await customAxios.get(
        `${urlSavePatientMovement}?MovementId=${parseInt(
          movement.MovementId
        )}&Department=${movement.Department}&ServiceLocationId=${movement.ServiceLocationId
        }&BedID=${movement.BedID}&BedStatus=${null}&PatientID=${movement.PatientID
        }&MovementReason=${movement.MovementReason}&timeMovement=${movement.timeMovement
        }&Actualtime=${movement.Actualtime}&ReasonforDelay=${movement.ReasonforDelay
        }&Status=${movement.Status}`
      );
      if (response.status === 200 && response.data === "Success") {
        message.success(response.data);
        setMovementModalOpen(false);
        setArrivalModalOpen(false);
      } else {
        console.error("Failed to fetch patient details");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFinish = async (values) => {
    debugger;
    const RecordEDD = {
      dateDischarge: values.DateTimeDischarge
        ? values.DateTimeDischarge.format("DD-MM-YYYY")
        : "",
      timeDischarge: values.DateTimeDischarge
        ? values.DateTimeDischarge.format("HH:mm:ss")
        : "",
      PatientID: values.PatientId,
      BedID: values.Bed,
      EncounterId: values.EncounterId,
    };
    try {
      const response = await customAxios.get(
        `${urlRecordExpectedDischargeDate}?dateDischarge=${RecordEDD.dateDischarge}&timeDischarge=${RecordEDD.timeDischarge}&PatientID=${RecordEDD.PatientID}&BedID=${RecordEDD.BedID}&EncounterId=${RecordEDD.EncounterId}`
      );
      if (response.status === 200 && response.data === "Success") {
        message.success(response.data);
        setRecordExpectedDischargeModalOpen(false);
      } else {
        console.error("Failed to fetch Record EDD");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "Vacant":
        return {
          text: "Vacant",
          color: "green",
          backgroundColor: "#C5EBAA",
          menu: vacantBedMenu,
        };
      case "Occupied":
        return {
          text: "Occupied",
          color: "red",
          backgroundColor: "#FFBABA",
          menu: occupiedBedMenu,
        };
      case "Movement":
        return {
          text: "Movement",
          color: "#674188",
          backgroundColor: "#C8A1E0",
          menu: MovementBedMenu,
        };
      case "Blocked":
        return {
          text: "Blocked",
          color: "#F54D42",
          backgroundColor: "#FF8356",
          menu: vacantBedMenu,
        };
      default:
        return {
          text: "Discharge Init",
          color: "#55679C",
          backgroundColor: "#7C93C3",
          menu: DischargeBedMenu,
        };
    }
  };

  const handleDropdown = async (value, SLId, Id, PId) => {
    debugger;
    if (Id === 1) {
      const response = await customAxios.get(
        `${urlGetServiceLocation}?FacilityDepartmentId=${value}`
      );
      if (response.status === 200) {
        setDropDown((prevDropdown) => {
          const updatedDropdown = {
            ...prevDropdown,
            FacilityDeptServiceLocation:
              response.data.data.FacilityDeptServiceLocation,
            PatientsCurrentDetails: {
              ...prevDropdown.PatientsCurrentDetails,
              ServiceLocationId: undefined,
              WardCategoryID: "",
              WardID: "",
              BedID: "",
            },
            WardCategory: [],
            Wards: [],
            Beds: [],
          };
          return updatedDropdown;
        });
      }
    } else if (Id === 2) {
      const response = await customAxios.get(
        `${urlGetWardCategory}?ServiceLocationId=${value}&ID=${1}`
      );
      if (response.status === 200) {
        setDropDown((prevDropdown) => {
          const updatedDropdown = {
            ...prevDropdown,
            WardCategory: response.data.data.masters,
            Wards: [],
            Beds: [],
          };
          return updatedDropdown;
        });
      }
    } else if (Id === 3) {
      const response = await customAxios.get(
        `${urlGetWards}?ServiceLocationId=${SLId}&WardCategoryID=${value}&ID=${1}&PatientID=${PId}`
      );
      if (response.status === 200) {
        setDropDown((prevDropdown) => {
          const updatedDropdown = {
            ...prevDropdown,
            Wards: response.data.data.Wards,
            Beds: [],
          };
          return updatedDropdown;
        });
      }
    } else {
      const response = await customAxios.get(
        `${urlGetBeds}?WardId=${value}&ID=${1}`
      );
      if (response.status === 200) {
        setDropDown((prevDropdown) => {
          const updatedDropdown = {
            ...prevDropdown,
            Beds: response.data.data.Beds,
          };
          return updatedDropdown;
        });
      }
    }
  };

  const handleOrderEntry = (value) => {
    // setOrderEntry(value)
    debugger
    setOrderEntry((prevDropdown) => {
      const updatedDropdown = {
        ...prevDropdown,
        PatientAccountCharges: value,
      };
      return updatedDropdown;
    });
  }

  const handleFinishOrder = async (values) => {
    debugger
    const search = {
      Id: 0,
      LocationId: 0,
      WardCategoryId: 0,
      BedStatus: "",
      PatientId: bed.PatientId,
      EncounterID: bed.EncounterId,
      FromDate: values.FromDate ? values.FromDate.format('DD-MM-YYYY') : '',
      ToDate: values.ToDate ? values.ToDate.format('DD-MM-YYYY') : '',
      // IndicatorDescriptionId: values.Description,
      Indicator: values.Indicator
    }
    const response = await customAxios.get(
      `${urlShowModal}?Id=${search.Id}&PatientID=${bed.PatientId
      }&LocationID=${bed.ServiceLocationId}&WardCategoryId=${bed.WardCategoryID
      }&BedStatus=${null}&EncounterId=${bed.EncounterId
      }&FromDate=${search.FromDate}&ToDate=${search.ToDate}&flag=${2}&Indicator=${search.Indicator}`
    );
    if (response.status === 200 && response.data.data != null) {
      setOrderEntry((prevDropdown) => {
        const data = {
          ...prevDropdown,
          OrderModel: response.data.data.OrderModel
        }
        return data
      })
    }
  }

  return (
    <Col key={bed.BedID}>
      <Badge.Ribbon
        text={getStatusInfo(bed.PatientStatus).text}
        // text={bed.PatientStatus === "Vacant" ? "Vacant" :
        //   bed.PatientStatus === "Occupied" ? 'Occupied' :
        //     bed.PatientStatus === "Movement" ? 'Movement' :
        //       'Discharge Init'}
        color={getStatusInfo(bed.PatientStatus).color}
      // color={bed.PatientStatus === "Vacant" ? "green" :
      //   bed.PatientStatus === "Occupied" ? "red" :
      //     bed.PatientStatus = "Movement" ? '#C8A1E0' :
      //       '#B5CFB7'}
      // color={bedColor}
      >
        <Card
          hoverable
          size="small"
          style={{
            width: "15rem",
            height: "10rem",
            backgroundColor: getStatusInfo(bed.PatientStatus).backgroundColor,
            // bed.PatientStatus === "Vacant" ? "#C5EBAA" :
            //   bed.PatientStatus === 'Occupied' ? "#FFBABA" :
            //     bed.PatientStatus === 'Movement' ? '#C8A1E0' :
            //       '#CADABF',
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
                getStatusInfo(bed.PatientStatus).menu
                // bed.PatientStatus === "Vacant" ? vacantBedMenu :
                //   bed.PatientStatus === 'Occupied' ? occupiedBedMenu :
                //     bed.PatientStatus === "Movement" ? MovementBedMenu :
                //       DischargeBedMenu
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
        Dropdown={dropDown1}
        open={blockBedModalOpen}
        // handleClose={() => setBlockBedModalOpen(false)}
        handleClose={Close}
      />
      <DirectTransferModal
        bed={bed}
        Dropdown={dropDown}
        handleDropdown={handleDropdown}
        patient={patientData}
        open={directTransferModalOpen}
        // handleClose={() => setDirectTransferModalOpen(false)}
        handleClose={Close}
      />
      <DischargeInitiationModal
        bed={bed}
        Dropdown={dropDown}
        patient={patientData}
        open={dischargeInitiationModalOpen}
        // handleClose={() => setDischargeInitiationModalOpen(false)}
        handleClose={Close}
      />
      <RecordExpectedDischarge
        bed={bed}
        Dropdown={dropDown}
        patient={patientData}
        handleFinish={handleFinish}
        open={recordExpectedDischargeModalOpen}
        // handleClose={() => setRecordExpectedDischargeModalOpen(false)}
        handleClose={Close}
      />
      <Movement
        bed={bed}
        Dropdown={dropDown}
        patient={patientData}
        handleDropdown={handleDropdown}
        handleSubmit={handleSubmit}
        open={movementModalOpen}
        // handleClose={() => setMovementModalOpen(false)}
        handleClose={Close}
      />
      <ArrivalModal
        bed={bed}
        Dropdown={dropDown}
        patient={patientData}
        handleSubmit={handleSubmit}
        open={arrivalModalOpen}
        // handleClose={() => setArrivalModalOpen(false)}
        handleClose={Close}
      />
      <Prescription
        bed={bed}
        Dropdown={dropDown1}
        patient={patientData}
        open={prescriptionModalOpen}
        handleClose={() => setPrescriptionModalOpen(false)}
      />
      <OrderEntry
        bed={bed}
        Dropdown={orderEntry}
        handleOrderEntry={handleOrderEntry}
        patient={patientData}
        handleFinish={handleFinishOrder}
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
      <DischargeModal
        bed={bed}
        Dropdown={dropDown}
        patient={patientData}
        open={dischargeBedModalOpen}
        // handleClose={() => setDischargeBedModalOpen(false)}
        handleClose={Close}
      />
      <CancelDischargeInitiationModal
        bed={bed}
        Dropdown={dropDown}
        patient={patientData}
        open={cancelDischargeBedModalOpen}
        // handleClose={() => setCancelDischargeBedModalOpen(false)}
        handleClose={Close}
      />
      <AmendDischargeInitiationModal
        bed={bed}
        Dropdown={dropDown}
        patient={patientData}
        open={amendDischargeBedModalOpen}
        // handleClose={() => setAmendDischargeBedModalOpen(false)}
        handleClose={Close}
      />
      <DrNoteModal
        bed={bed}
        Dropdown={dropDown1}
        patient={patientData}
        open={drNoteModalOpen}
        handleClose={() => setDrNoteModalOpen(false)}
      />
      <NrNoteModal
        bed={bed}
        Dropdown={dropDown1}
        patient={patientData}
        open={nrNoteModalOpen}
        handleClose={() => setNrNoteModalOpen(false)}
      />
      <DrugChartModal
        bed={bed}
        Dropdown={dropDown1}
        patient={patientData}
        open={drugChartModalOpen}
        handleClose={() => setDrugChartModalOpen(false)}
      />
      <FluidChartModal
        bed={bed}
        Dropdown={dropDown1}
        patient={patientData}
        open={fluidChartModalOpen}
        handleClose={() => setFluidChartModalOpen(false)}
      />
    </Col>
  );
}

export default WardBed;
