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
export const urlAddNewService = `${baseURL}/api/Service/AddNewService`;
export const urlCreateNewService = `${baseURL}/api/Service/CreateService`;
export const urlGetAllServiceGroups = `${baseURL}/api/ServiceClassification/ServiceGroups`;
export const urlGetServiceClassificationsForServiceGroup = `${baseURL}/api/Service/GetServiceClassificationsForServiceGroup`;
export const urlGetAllServices = `${baseURL}/api/Service/GetAllServices`;
export const urlGetAllVisitsForPatientId = `${baseURL}/api/Patient/GetAllVisitsForPatientId`;
export const urlGetPatientHeaderWithPatientIAndEncounterId = `${baseURL}/api/Patient/GetPatientHeaderWithPatientIdWithEncounterId`;
export const urlServiceAutocomplete = `${baseURL}/api/Patient/AutocompleteService`;
export const urlAddNewCharge = `${baseURL}/api/Billing/AddNewCharge`;
export const urlGetPatientAccountChargesWithPatientIdAndEncounterId = `${baseURL}/api/Billing/GetPatientAccountChargesWithPatientIdAndEncounterId`;
export const urlAddNewBill = `${baseURL}/api/Billing/AddNewBill`;
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
export const urlGetPurshaseOrderDetails = `${baseURL}/api/Purchaseorder/GetAllPurshaseOrderDetails`;
export const urlSaveNewServiceClassification = `${baseURL}/api/ServiceClassification/SaveNewServiceClassification`;
export const urlGetServicesForSelectedServiceClassification = `${baseURL}/api/Service/GetServicesForSelectedServiceClassification`;
export const urlFacilityPriceDefinitionIndex = `${baseURL}/api/PriceDefinition/FacilityPriceDefinitionIndex`;
export const urlGetPriceDefinitionsForFacility = `${baseURL}/api/PriceDefinition/GetPriceDefinitionsForFacility`;
export const urlGetAllServicePricesForSelectedServiceClassification = `${baseURL}/api/PriceDefinition/GetAllServicePricesForSelectedServiceClassification`;
export const urlRevisionServicePrices = `${baseURL}/api/PriceDefinition/RevisionServicePrices`;



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
export const urlEditOrDeletePatientVisit = `${baseURL}/api/Encounter/EditOrCancelEncounter`;
export const urlAddNewService = `${baseURL}/api/Service/AddNewService`;
export const urlCreateNewService = `${baseURL}/api/Service/CreateService`;
export const urlServiceIndex = `${baseURL}/api/Service/ServiceIndex`;
export const urlGetServicesForSelectedServiceClassification = `${baseURL}/api/Service/GetServicesForSelectedServiceClassification`;
export const urlGetServiceClassificationsForServiceGroup = `${baseURL}/api/Service/GetServiceClassificationsForServiceGroup`;
export const urlGetAllServices = `${baseURL}/api/Service/GetAllServices`;
export const urlGetAllVisitsForPatientId = `${baseURL}/api/Patient/GetAllVisitsForPatientId`;
export const urlGetPatientHeaderWithPatientIAndEncounterId = `${baseURL}/api/Patient/GetPatientHeaderWithPatientIdWithEncounterId`;
export const urlServiceAutocomplete = `${baseURL}/api/Patient/AutocompleteService`;
export const urlAddNewCharge = `${baseURL}/api/Billing/AddNewCharge`;
export const urlGetPatientAccountChargesWithPatientIdAndEncounterId = `${baseURL}/api/Billing/GetPatientAccountChargesWithPatientIdAndEncounterId`;
export const urlAddNewBill = `${baseURL}/api/Billing/AddNewBill`;
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
export const urlGetAllQueues = `${baseURL}/api/Queue/GetAllQueues`;
export const urlGetAllProviders = `${baseURL}/api/Queue/GetAllProviders`;
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
