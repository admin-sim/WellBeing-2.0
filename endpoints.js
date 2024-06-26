import config from "./appSettings.json";
const baseURL = config.baseUrl;
// const baseURL = process.env.REACT_APP_API_URL;
export const urlCancelVisit = `${baseURL}/api/Encounter/CancelEncounter`;
export const urlLogin = `${baseURL}/api/User/Login`;
export const urlGetAllPatients = `${baseURL}/api/Patient`;
export const urlGetAllGeneralLookUp = `${baseURL}/api/Master/GetAllGeneralLookups`;
export const urlGetPatientDetail = `${baseURL}/api/Patient/GetPatientViewModel`;
export const urlAddNewPatient = `${baseURL}/api/Patient/AddNewPatient`;
export const urlAddNewLookup = `${baseURL}/api/Master/AddNewLookup`;
export const urlEditNewLookup = `${baseURL}/api/Master/EditNewLookup`;
export const urlSearchPatientRecord = `${baseURL}/api/Patient/SearchPatientRecord`;
export const urlUhidAutocomplete = `${baseURL}/api/Patient/AutocompleteUhid`;
export const urlEditPatientById = `${baseURL}/api/Patient/EditPatientById`;
export const urlGetAllVisitsToday = `${baseURL}/api/Encounter/GetAllVisitsToday`;
export const urlSearchVisitRecord = `${baseURL}/api/Encounter/SearchVisitRecord`;
export const urlSearchUHID = `${baseURL}/api/Patient/AutocompleteUhid`;
export const urlGetVisitDetailsWithPHeader = `${baseURL}/api/Encounter/GetVisitDetailsWithPHeader`;
export const urlGetDepartmentBasedOnPatitentType = `${baseURL}/api/Encounter/GetDepartmentBasedOnPatitentType`;
export const urlGetServiceLocationBasedonId = `${baseURL}/api/Encounter/GetServiceLocationBasedonId`;
export const urlGetProviderBasedOnDepartment = `${baseURL}/api/Encounter/GetProviderBasedOnDepartment`;
export const urlAddNewVisit = `${baseURL}/api/Encounter/SaveNewEncounter`;
export const urlAddNewVisit1 = `${baseURL}/api/Encounter/SaveNewEncounter1`;
export const urlAddNewService = `${baseURL}/api/Service/AddNewService`;
export const urlCreateNewService = `${baseURL}/api/Service/CreateService`;
export const urlGetAllServiceGroups = `${baseURL}/api/ServiceClassification/ServiceGroups`;
export const urlGetServiceClassificationsForServiceGroup = `${baseURL}/api/Service/GetServiceClassificationsForServiceGroup`;
export const urlGetAllServices = `${baseURL}/api/Service/GetAllServices`;
export const urlGetAllVisitsForPatientId = `${baseURL}/api/Patient/GetAllVisitsForPatientId`;
export const urlGetPatientHeaderWithPatientIAndEncounterId = `${baseURL}/api/Patient/GetPatientHeaderWithPatientIdWithEncounterId`;
export const urlGetPatientDetails = `${baseURL}/api/Patient/GetPatientDetails`;
export const urlServiceAutocomplete = `${baseURL}/api/Patient/AutocompleteService`;
export const urlAddNewCharge = `${baseURL}/api/Billing/AddNewCharge`;
export const urlGetServiceCharge = `${baseURL}/api/Billing/GetServiceCharge`;
export const urlGetPatientAccountChargesWithPatientIdAndEncounterId = `${baseURL}/api/Billing/GetPatientAccountChargesWithPatientIdAndEncounterId`;
export const urlAddNewBill = `${baseURL}/api/Billing/AddNewBill`;
export const urlBillingCreate = `${baseURL}/api/Billing/Create`;
export const urlLoadTestForMapping = `${baseURL}/api/LabTestMaster/SubTestMappingIndex`;
export const urlSaveNewSubTestmap = `${baseURL}/api/LabTestMaster/SaveSubTestmap`;
export const urlLoadSubTestMapGridData = `${baseURL}/api/LabTestMaster/LoadSubTestMapGridData`;
export const urlDeleteSubTest = `${baseURL}/api/LabTestMaster/DeleteSubTest`;
export const urlSaveTestMethod = `${baseURL}/api/LabTestMaster/SaveTestMethod`;
export const urlDeleteTestMethod = `${baseURL}/api/LabTestMaster/DeleteTestMethod`;
export const urlLoadTestMethodGridData = `${baseURL}/api/LabTestMaster/LoadTestMethodGridData`;
export const urlLoadTestReferenceGrid = `${baseURL}/api/LabTestMaster/LoadTestReferenceGrid`;
export const urlSaveTestReference = `${baseURL}/api/LabTestMaster/SaveTestReference`;
export const urlEditTestRef = `${baseURL}/api/LabTestMaster/EditTestRef`;
export const urlTestReferencesIndex = `${baseURL}/api/LabTestMaster/TestReferencesIndex`;
export const urlDeleteTestRef = `${baseURL}/api/LabTestMaster/DeleteTestRef`;
export const urlSearchPatientsForLab = `${baseURL}/api/Laboratory/SearchPatientsForLab`;
export const urlGetLabNumbers = `${baseURL}/api/Laboratory/GetLabNumbers`;
export const urlSampleCollectionIndex = `${baseURL}/api/Laboratory/SampleCollectionIndex`;
export const urlSaveSampleColResult = `${baseURL}/api/Laboratory/SaveSampleColResult`;
export const urlLoadTestReferenceForResEntry = `${baseURL}/api/LabTestMaster/LoadTestReferenceForResEntry`;
export const urlResultEntryIndex = `${baseURL}/api/Laboratory/ResultEntryIndex`;
export const urlGetSelectedTestDataForResEntry = `${baseURL}/api/Laboratory/GetSelectedTestDataForResEntry`;
export const urlSaveTestsResultEntry = `${baseURL}/api/Laboratory/SaveTestsResultEntry`;
export const urlSaveVerification = `${baseURL}/api/Laboratory/SaveTestVerifyStatus`;
export const urlGetSelectedTestDataForResEntered = `${baseURL}/api/Laboratory/GetSelectedTestDataForResEntered`;
export const urlLoadAllDropDownsTemplate = `${baseURL}/api/Template/GetAllDropDownDataForTemplates`;
export const urlSaveNewTemplate = `${baseURL}/api/Template/SaveNewMasterTemplate`;
export const urlGetAllTemplates = `${baseURL}/api/Template/GetAllTemplates`;
export const urlEditTemplate = `${baseURL}/api/Template/EditTemplate`;
export const urlGetAllUsers = `${baseURL}/api/User/GetAllUsers`;
export const urlGetTemplateDataByTemplateId = `${baseURL}/api/Laboratory/GetTemplateDataByTemplateId`;
export const urlGetRoles = `${baseURL}/api/User/Create`;
export const urlAddUser = `${baseURL}/api/User/AddUser`;
export const urlDeleteAppUser = `${baseURL}/api/User/DeleteAppUser`;
export const urlGetGetAppUserbyId = `${baseURL}/api/User/GetAppUserbyId`;
export const urlGetAutocompleteProviders = `${baseURL}/api/User/AutoCompleteProviderNames`;
export const urlGetAllMenusBasedOnRoleId = `${baseURL}/api/User/GetAllMenusBasedOnRoleId`;
export const urlPriceDefinitionIndex = `${baseURL}/api/PriceDefinition/PriceDefinitionIndex`;
export const urlSaveNewServiceClassification = `${baseURL}/api/ServiceClassification/SaveNewServiceClassification`;
export const urlGetServicesForSelectedServiceClassification = `${baseURL}/api/Service/GetServicesForSelectedServiceClassification`;
export const urlFacilityPriceDefinitionIndex = `${baseURL}/api/PriceDefinition/FacilityPriceDefinitionIndex`;
export const urlGetPriceDefinitionsForFacility = `${baseURL}/api/PriceDefinition/GetPriceDefinitionsForFacility`;
export const urlGetAllServicePricesForSelectedServiceClassification = `${baseURL}/api/PriceDefinition/GetAllServicePricesForSelectedServiceClassification`;
export const urlRevisionServicePrices = `${baseURL}/api/PriceDefinition/UpdateFacilityPrices`;
export const urlEditOrDeletePatientVisit = `${baseURL}/api/Encounter/EditOrCancelEncounter`;
export const urlServiceIndex = `${baseURL}/api/Service/ServiceIndex`;
export const urlGetAllQueues = `${baseURL}/api/Queue/GetAllQueues`;
export const urlGetAllQueueProviders = `${baseURL}/api/Queue/GetAllProviders`;
export const urlGetMarkArrival = `${baseURL}/api/Queue/MarkArrival`;
export const urlAssignQueue = `${baseURL}/api/Queue/AssignQueue`;
export const urlGetPatientVitalSigns = `${baseURL}/api/Queue/PatientVitalDetails`;
export const urlRevertCheckIn = `${baseURL}/api/Queue/RevertToCheckIn`;
export const urlPushPatientQueuePosition = `${baseURL}/api/Queue/PushToQueue`;
export const urlAddNewPatientVital = `${baseURL}/api/Queue/AddNewPatientVital`;
export const urlStartConsultation = `${baseURL}/api/Queue/StartConsultation`;
export const urlShowCloseConsultation = `${baseURL}/api/Queue/ShowCloseConsultation`;
export const urlCloseConsultation = `${baseURL}/api/Queue/CloseConsultation`;
export const urlRevertToMarkArrival = `${baseURL}/api/Queue/RevertToMarkArrival`;
export const urlGetPurshaseOrderDetails = `${baseURL}/api/Purchaseorder/Index`;
export const urlSearchPurchaseOrder = `${baseURL}/api/Purchaseorder/SearchPurchaseOrder`;
export const urlCreatePurchaseOrder = `${baseURL}/api/Purchaseorder/CreatePurchaseOrder`;
export const urlAutocompleteProduct = `${baseURL}/api/Purchaseorder/AutocompleteProduct`;
export const urlGetProductDetailsById = `${baseURL}/api/Purchaseorder/GetProductDetailsById`;
export const urlSearchGRN = `${baseURL}/api/Purchaseorder/SearchGRN`;
export const urlSearchPatientIndent = `${baseURL}/api/Purchaseorder/SearchPatientIndent`;
export const urlSearchPatientIssue = `${baseURL}/api/Purchaseorder/SearchPatientIssue`;
export const urlSearchPatientConsumption = `${baseURL}/api/Purchaseorder/SearchPatientConsumption`;
export const urlSearchItemReceipt = `${baseURL}/api/Purchaseorder/SearchItemReceipt`;
export const urlSearchOpeningStock = `${baseURL}/api/Purchaseorder/SearchOpeningStock`;
export const urlSearchVendorReturn = `${baseURL}/api/Purchaseorder/SearchVendorReturn`;
export const urlGetAllEncounterByUhid = `${baseURL}/api/Purchaseorder/GetAllEncounterByUhid`;
export const urlSearchIndent = `${baseURL}/api/Purchaseorder/SearchIndent`;
export const urlSearchIndentIssue = `${baseURL}/api/Purchaseorder/SearchIndentIssue`;
export const urlAddNewPurchaseOrder = `${baseURL}/api/Purchaseorder/AddNewPurchaseOrder`;
export const urlAddNewGRNDirect = `${baseURL}/api/Purchaseorder/AddNewGRNDirect`;
export const urlAddNewIndent = `${baseURL}/api/Purchaseorder/AddNewIndent`;
export const urlEditIndent = `${baseURL}/api/Indent/EditIndent`;
export const urlUpdateIndent = `${baseURL}/api/Indent/UpdateIndent`;
export const urlGetAllEncounterForPatientId = `${baseURL}/api/Encounter/GetAllEncounterForPatientId`;
export const urlShowBatchDetails = `${baseURL}/api/IndentIssue/ShowBatchDetails`;
export const urlEditIndentIssue = `${baseURL}/api/IndentIssue/EditIndentIssue`;
export const urlAddNewIndentIssue = `${baseURL}/api/IndentIssue/AddNewIndentIssue`;
export const urlEditPurchaseOrder = `${baseURL}/api/Purchaseorder/EditPurchaseOrder`;
export const urlUpdatePurchaseOrder = `${baseURL}/api/Purchaseorder/UpdatePurchaseOrder`;
export const urlGetCapturedVitalsDetails = `${baseURL}/api/Queue/getCapturedVitalsDetails`;
export const urlGetAllAutocompleteServicesAsync = `${baseURL}/api/Service/GetAllAutocompleteServicesAsync`;
export const urlGetAllProviders = `${baseURL}/api/Billing/GetAllProviders`;
export const urlGetAllPriceTariffs = `${baseURL}/api/PriceTariff/Index`;
export const urlCreatePriceTariff = `${baseURL}/api/PriceTariff/Create`;
export const urlSaveNewPriceTariff = `${baseURL}/api/PriceTariff/SaveNewPriceTariff`;
export const urlSaveNewPriceTariffChargeParameter = `${baseURL}/api/PriceTariff/SaveNewPriceTariffChargeParameter`;
export const urlGetDropDownsForPricetariif = `${baseURL}/api/PriceTariff/GetDropDowns`;
export const urlEditPriceTariff = `${baseURL}/api/PriceTariff/Edit`;
export const urlEditPriceTariffChargeParameter = `${baseURL}/api/PriceTariff/EditPriceTariffChargeParameter`;
export const urlUpdatePriceTariffChargeParameter = `${baseURL}/api/PriceTariff/UpdatePriceTariffChargeParameter`;
export const urlUpdatePriceTariff = `${baseURL}/api/PriceTariff/UpdatePriceTariff`;
export const urlGetAllAutoChargeAsync = `${baseURL}/api/AutoCharge/GetAllAutoChargeAsync`;
export const urlCreateAutoCharge = `${baseURL}/api/AutoCharge/Create`;
export const urlGetAllDepartmentsForFacility = `${baseURL}/api/AutoCharge/GetAllDepartmentsForFacility`;
export const urlGetChargeProviders = `${baseURL}/api/AutoCharge/GetChargeProviders`;
export const urlGetAllFacilityDepartmentProvider = `${baseURL}/api/AutoCharge/GetAllFacilityDepartmentProvider`;
export const urlGetAllServicesBasedOnFacilityIdAsync = `${baseURL}/api/AutoCharge/GetAllServicesBasedOnFacilityIdAsync`;
export const urlAddNewAutoCharge = `${baseURL}/api/AutoCharge/SaveNewAutoCharge`;
export const urlGetLookupDetails = `${baseURL}/api/Master/GetLookupDetails`;
export const urlAddandUpdateLookup = `${baseURL}/api/Master/AddAndUpdateLookup`;
export const urlGetAllStates = `${baseURL}/api/State/GetAllStates`;
export const urlGetSelectedStateDetails = `${baseURL}/api/State/GetStateDetails`;
export const urlAddAndUpdateState = `${baseURL}/api/State/AddAndUpdateState`;
export const urlDeleteSelectedState = `${baseURL}/api/State/DeleteSelectedState`;
export const urlGetAllPlaces = `${baseURL}/api/Place/GetAllPlaces`;
export const urlGetStatesBasedOnCountryId = `${baseURL}/api/Place/GetStatesBasedOnCountryId`;
export const urlGetSelectedPlaceDetails = `${baseURL}/api/Place/GetPlaceDetails`;
export const urlAddAndUpdatePlace = `${baseURL}/api/Place/AddAndUpdatePlace`;
export const urlDeleteSelectedPlace = `${baseURL}/api/Place/DeleteSelectedPlace`;
export const urlGetAllAreas = `${baseURL}/api/Area/GetAllAreas`;
export const urlGetPlacesBasedOnStateId = `${baseURL}/api/Area/GetPlacesBasedOnStateId`;
export const urlGetSelectedAreaDetails = `${baseURL}/api/Area/GetAreaDetails`;
export const urlAddAndUpdateArea = `${baseURL}/api/Area/AddAndUpdateArea`;
export const urlDeleteSelectedArea = `${baseURL}/api/Area/DeleteSelectedArea`;
export const urlGetAllUOMs = `${baseURL}/api/UOM/GetAllUOMS`;
export const urlGetSelectedUOMDetails = `${baseURL}/api/UOM/GetUOMDetails`;
export const urlAddAndUpdateUOM = `${baseURL}/api/UOM/AddAndUpdateUOMs`;
export const urlDeleteSelectedUOM = `${baseURL}/api/UOM/DeleteSelectedUOM`;
export const urlAddNewAndUpdatePatientIdentity = `${baseURL}/api/Patient/AddNewAndUpdatePatientIdentity`;
export const urlGetPatientIdentificationDetails = `${baseURL}/api/Patient/GetPatientIdentificationDetails`;
export const urlDeletePatientIdentification = `${baseURL}/api/Patient/DeletePatientIdentification`;
export const urlGetProviderDetails = `${baseURL}/api/Provider/GetProviderDetails`;
export const urlGetAreasBasedOnPlaceId = `${baseURL}/api/Area/GetAreasBasedOnPlaceId`;
export const urlAddNewAndUpdateProvider = `${baseURL}/api/Provider/AddNewandUpdateProvider`;
export const urlAddNewAndUpdateProviderIdentification = `${baseURL}/api/Provider/AddNewAndUpdateProviderIdentification`;
export const urlGetProviderIdentificationDetails = `${baseURL}/api/Provider/GetProviderIdentificationDetails`;
export const urlDeleteProviderIdentification = `${baseURL}/api/Provider/DeleteProviderIdentification`;
export const urlAddNewAndUpdateProviderCredential = `${baseURL}/api/Provider/AddNewAndUpdateProviderCredential`;
export const urlGetProviderCredentialDetails = `${baseURL}/api/Provider/GetProviderCredentialDetails`;
export const urlDeleteProviderCredential = `${baseURL}/api/Provider/DeleteProviderCredential`;
export const urlSearchProviderRecords = `${baseURL}/api/Provider/SearchProviderDetails`;
export const urlGetPayerViewModel = `${baseURL}/api/Payer/GetPayerViewModel`;
export const urlSearchPayerRecord = `${baseURL}/api/Payer/SearchPayerRecord`;
export const urlAddNewandUpdatePayer = `${baseURL}/api/Payer/AddNewandUpdatePayer`;
export const urlAddNewAndUpdatePayerIdentity = `${baseURL}/api/Payer/AddNewAndUpdatePayerIdentity`;
export const urlGetPayerIdentificationDetails = `${baseURL}/api/Payer/GetPayerIdentificationDetails`;
export const urlDeletePayerIdentification = `${baseURL}/api/Payer/DeletePayerIdentification`;
export const urlGetAllScheduleTemplates = `${baseURL}/api/ScheduleTemplate/GetAllScheduleTemplates`;
export const urlAddOrUpdateScheduleTemplateSessions = `${baseURL}/api/ScheduleTemplate/AddOrUpdateScheduleTemplateSessions`;
export const urlGetScheduleTemplateDetailsBasedOnId = `${baseURL}/api/ScheduleTemplate/GetScheduleTemplateDetailsBasedOnId`;
export const urlDeleteScheduleTemplate = `${baseURL}/api/ScheduleTemplate/DeleteScheduleTemplate`;
export const urlGetAllProviderSchedules = `${baseURL}/api/ScheduleProvider/GetAllProviderSchedules`;
export const urlGetScheduleTypesBasedOnTypeId = `${baseURL}/api/ScheduleProvider/GetScheduleTypesBasedOnTypeId`;
export const urlGetScheduleCreateDetails = `${baseURL}/api/ScheduleProvider/GetScheduleCreateDetails`;
export const urlAddNewProviderScheduleOfTypeWeek = `${baseURL}/api/ScheduleProvider/AddNewProviderScheduleOfTypeWeek`;
export const urlAddNewProviderScheduleOfTypeDay = `${baseURL}/api/ScheduleProvider/AddNewProviderScheduleOfTypeDay`;
export const urlAddNewProviderScheduleOfTypeWeekDay = `${baseURL}/api/ScheduleProvider/AddNewProviderScheduleOfTypeWeekDay`;
export const urlUpdateProviderWeeklySchedule = `${baseURL}/api/ScheduleProvider/UpdateProviderWeeklySchedule`;
export const urlGetEditDayProviderSchedule = `${baseURL}/api/ScheduleProvider/GetEditDayProviderSchedule`;
export const urlUpdateProviderScheduleOfType = `${baseURL}/api/ScheduleProvider/UpdateProviderScheduleOfType`;
export const urlRemoveProviderScheduleBasedOnProviderId = `${baseURL}/api/ScheduleProvider/RemoveProviderScheduleBasedOnProviderId`;
export const urlDeleteProviderScheduleBasedOnTypeID = `${baseURL}/api/ScheduleProvider/DeleteProviderScheduleBasedOnTypeID`;
export const urlGetAllCalenderPublished = `${baseURL}/api/PublishCalender/GetAllCalenderPublished`;
export const urlAddNewProviderCalender = `${baseURL}/api/PublishCalender/AddNewProviderCalender`;
export const urlGetProviderCalenderDetails = `${baseURL}/api/PublishCalender/GetProviderCalenderDetails`;
export const urlDeleteSelectedProviderCalender = `${baseURL}/api/PublishCalender/DeleteSelectedProviderCalender`;
export const urlGetAllProviderAbsence = `${baseURL}/api/ProviderAbsence/GetAllProviderAbsence`;
export const urlAddProviderAbsence = `${baseURL}/api/ProviderAbsence/AddProviderAbsence`;
export const urlGetProviderAbsenceDetails = `${baseURL}/api/ProviderAbsence/GetProviderAbsenceDetails`;
export const urlUpdateProviderAbsence = `${baseURL}/api/ProviderAbsence/UpdateProviderAbsence`;
export const urlDeleteProviderAbsence = `${baseURL}/api/ProviderAbsence/DeleteProviderAbsence`;
export const urlGetAllSpecialEvents = `${baseURL}/api/SpecialEvents/GetAllSpecialEvents`;
export const urlAddSpecialEvent = `${baseURL}/api/SpecialEvents/AddSpecialEvent`;
export const urlGetSpecialEventsDetails = `${baseURL}/api/SpecialEvents/GetSpecialEventsDetails`;
export const urlUpdateSpecialEvent = `${baseURL}/api/SpecialEvents/UpdateSpecialEvent`;
export const urlDeleteSpecialEvents = `${baseURL}/api/SpecialEvents/DeleteSpecialEvents`;
export const urlGetAllHolidays = `${baseURL}/api/Holiday/GetAllHolidays`;
export const urlAddNewHoliday = `${baseURL}/api/Holiday/AddNewHoliday`;
export const urlGetHolidayDetails = `${baseURL}/api/Holiday/GetHolidayDetails`;
export const urlUpdateHoliday = `${baseURL}/api/Holiday/UpdateHoliday`;
export const urlDeleteHoliday = `${baseURL}/api/Holiday/DeleteHoliday`;
export const urlGetScheduledProviderAppointments = `${baseURL}/api/ScheduleProviderAppointment/GetScheduledProviderAppointments`;
export const urlGetProviderCalenderBasedOnProviderId = `${baseURL}/api/ScheduleProviderAppointment/GetProviderCalenderBasedOnProviderId`;
export const urlEditAutoCharge = `${baseURL}/api/AutoCharge/EditAutoCharge`;
export const urlUpdateAutoCharge = `${baseURL}/api/AutoCharge/UpdateAutoCharge`;
export const urlGetProviderBasedOnDept = `${baseURL}/api/ScheduleProviderAppointment/GetProviderBasedOnDept`;
export const urlAddNewScheduleProviderExisitingAppointment = `${baseURL}/api/ScheduleProviderAppointment/AddNewScheduleProviderExisitingAppointment`;
export const urlPatientAppointmentExist = `${baseURL}/api/ScheduleProviderAppointment/PatientAppointmentExist`;
export const urlGetBedsForWard = `${baseURL}/api/Encounter/GetBedsForWard`;
export const urlGetWardForServiceLocation = `${baseURL}/api/Encounter/GetWardForServiceLocation`;
export const urlGetWardsBasedOnWardCategory = `${baseURL}/api/Encounter/GetWardsBasedOnWardCategory`;
export const urlEditDiscount = `${baseURL}/api/Billing/EditDiscount`;
export const urlUpdateDiscount = `${baseURL}/api/Billing/UpdateDiscount`;
export const urlInvoiceDiscount = `${baseURL}/api/Billing/InvoiceDiscount`;
export const urlUpdateInvoiceDiscount = `${baseURL}/api/Billing/UpdateInvoiceDiscount`;
export const urlGetAllBillAgrements = `${baseURL}/api/BillAgreement/Index`;
export const urlAddNewPatientAppointment = `${baseURL}/api/ScheduleProviderAppointment/AddNewPatientAppointment`;
export const urlSearchAppointRecord = `${baseURL}/api/ScheduleProviderAppointment/SearchAppointRecord`;
export const urlGetSlotCancelDetails = `${baseURL}/api/ScheduleProviderAppointment/GetSlotCancelDetails`;
export const urlCancelSelectedAppointment = `${baseURL}/api/ScheduleProviderAppointment/CancelSelectedAppointment`;
export const urlGetSlotTransferDetails = `${baseURL}/api/ScheduleProviderAppointment/GetSlotTransferDetails`;
export const urlGetFutureAppointmentDateSessions = `${baseURL}/api/ScheduleProviderAppointment/GetFutureAppointmentDateSessions`;
export const urlTransferSelectedAppointment = `${baseURL}/api/ScheduleProviderAppointment/TransferSelectedAppointment`;
export const urlGetEncounterDetails = `${baseURL}/api/Encounter/GetEncounterDetails`;
