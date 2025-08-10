import { useLocation, useNavigate } from "react-router-dom";
import CkEditor from "../../../components/CKEditor";
import { useEffect, useState } from "react";
import { Button, Col, message, Row } from "antd";
import {
  urlGetTemplateDataByProviderId,
  urlSaveClinicalTemplate,
} from "../../../../endpoints";
import customAxios from "../../../components/customAxios/customAxios";

function ClinicalTemplate(Patient) {
  const location = useLocation();
  const navigate = useNavigate();
  const [editorKey, setEditorKey] = useState(0);
  const [templateEditorData, setTemplateEditorData] = useState("");
  const [tdata, setTdata] = useState("");

  useEffect(() => {
    async function fetchTemplateData() {
      try {
        const response = await customAxios.get(`
          ${urlGetTemplateDataByProviderId}?PatientId=${Patient.Patient.PatientId}&EncounterId=${Patient.Patient.Encounter}&ProviderId=${Patient.Patient.ProviderId}`);
        const data = await response.data.data;
        setTdata(data);
        setTemplateEditorData(data.TempData || data.ObservedValues);
        setEditorKey((prevKey) => prevKey + 1);
      } catch (error) {
        console.error("Error fetching template data:", error);
      }
    }

    fetchTemplateData();
  }, []);

  async function handleSaveTemplate() {
    debugger;
    if (templateEditorData !== (tdata?.TempData || "")) {
      const postData = {
        CTId: tdata?.CTId ?? 0,
        PatientId: Patient.Patient.PatientId,
        EncounterId: Patient.Patient.Encounter,
        ProviderId: Patient.Patient.ProviderId,
        ObservedValues: templateEditorData,
        TempGrpId: tdata?.TempGroupID ?? 0,
        TempName: tdata?.TempName,
        FacilityId: 1,
      };
      const response = await customAxios.post(
        urlSaveClinicalTemplate,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data.data === "Success") {
        message.success("Template saved successfully");
      }
    } else {
      message.warning("No changes made to the template.");
      return;
    }
  }

  return (
    <div>
      <CkEditor
        key={editorKey}
        initialData={templateEditorData}
        printButton={true}
        onChange={(event, editor) => {
          const data = editor.getData();
          setTemplateEditorData(data);
        }}
      />
      <Row justify={"end"} style={{ marginTop: "20px", marginRight: "20px" }}>
        <Col>
          <Button type="primary" onClick={handleSaveTemplate}>
            Save
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default ClinicalTemplate;
