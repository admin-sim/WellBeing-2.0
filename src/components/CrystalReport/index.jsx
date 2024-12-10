import { useState } from "react";

async function fetchReport(request) {
  const response = await fetch('https://192.168.29.254:808/api/ReportsApi/GetAdmissionRpt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
console.log('respo',response);

  if (!response.ok) {
    throw new Error('Failed to fetch report');
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  return { url, blob };
}

const ReportViewer = ({ request }) => {
  const [reportUrl, setReportUrl] = useState(null);
  const [error, setError] = useState(null);
  const [blobData, setBlobData] = useState(null);

  const loadReport = async () => {
    debugger;
    try {
      const { url, blob } = await fetchReport(request);
      setReportUrl(url);
      setBlobData(blob);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDownload = () => {
    if (blobData) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blobData);
      link.download = `AdmissionRpt.${request.FileType === 'excel' ? 'xls' : 'pdf'}`;
      link.click();
    }
  };

  return (
    <div>
      <button onClick={loadReport}>Load Report</button>
      {error && <div>Error: {error}</div>}
      {reportUrl && (
        <div>
          <iframe
            src={reportUrl}
            style={{ width: '100%', height: '500px' }}
            title="Report"
          />
          <button onClick={handleDownload}>Download Report</button>
        </div>
      )}
    </div>
  );
};

const VendorReturn = () => {
  const request = {
    FacilityId: 1,
    DeptId: 0,
    ServLocId: 0,
    PatientTypeId: 23,
    FromDate: '2020-01-01',
    ToDate: '2024-12-31',
    ProviderId: 0,
    FileType: 'pdf', // or 'excel'
  };

  return (
    <div>
      <h1>Admission Report</h1>
      <ReportViewer request={request} />
    </div>
  );
};

export default VendorReturn;









// import { useState } from "react";

// async function fetchReport(request) {
//   const response = await fetch('http://localhost:43705/api/ReportsApi/BillReport', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(request),
//   });
// console.log('respo',response);

//   if (!response.ok) {
//     throw new Error('Failed to fetch report');
//   }

//   const blob = await response.blob();
//   const url = URL.createObjectURL(blob);
//   return { url, blob };
// }

// const ReportViewer = ({ request }) => {
//   const [reportUrl, setReportUrl] = useState(null);
//   const [error, setError] = useState(null);
//   const [blobData, setBlobData] = useState(null);

//   const loadReport = async () => {
//     debugger;
//     try {
//       const { url, blob } = await fetchReport(request);
//       setReportUrl(url);
//       setBlobData(blob);
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   const handleDownload = () => {
//     if (blobData) {
//       const link = document.createElement('a');
//       link.href = URL.createObjectURL(blobData);
//       link.download = `AdmissionRpt.${request.FileType === 'excel' ? 'xls' : 'pdf'}`;
//       link.click();
//     }
//   };

//   return (
//     <div>
//       <button onClick={loadReport}>Load Report</button>
//       {error && <div>Error: {error}</div>}
//       {reportUrl && (
//         <div>
//           <iframe
//             src={reportUrl}
//             style={{ width: '100%', height: '500px' }}
//             title="Report"
//           />
//           <button onClick={handleDownload}>Download Report</button>
//         </div>
//       )}
//     </div>
//   );
// };

// const CreateIndent = () => {
//   // const request = {
//   //   FacilityId: 1,
//   //   DeptId: 0,
//   //   ServLocId: 0,
//   //   PatientTypeId: 23,
//   //   FromDate: '2020-01-01',
//   //   ToDate: '2024-12-31',
//   //   ProviderId: 0,
//   //   FileType: 'pdf', // or 'excel'
//   // };
//   const request = {
//     EncounterId: 1,
//     BillingId: "COH/BILL2",
//     FileType: 'pdf', // or 'excel'
//   };

//   return (
//     <div>
//       <h1>Admission Report</h1>
//       <ReportViewer request={request} />
//     </div>
//   );
// };

// export default CreateIndent;