import { UploadOutlined } from "@ant-design/icons";
import { Button, Col, Row, Upload, message } from "antd";
import React, { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import Webcam from "react-webcam";

function WebcamImage({ onImageUpload }) {
  const [img, setImg] = useState(null);
  const webcamRef = useRef(null);
  const [up, setUp] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  const [fileList, setFileList] = useState([]);

  const handleUserMediaError = (error) => {
    console.log(error);
    setHasCameraPermission(false);
  };

  const props = {
    name: "patient",
    headers: {
      authorization: "authorization-text",
    },
    maxCount: 1,
    accept: "image/*",
    fileList: fileList,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
      }
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        message.error("Image must be smaller than 1MB!");
      }
      return isImage && isLt1M;
    },
    onRemove: () => {
      setImg(null);
      onImageUpload(null);
      setFileList([]);
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        // Here, you would normally send the file to your server
        // For now, we'll simulate a server response
        console.log("Uploading file:", file);

        // Simulate an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Simulate a successful upload
        onSuccess("ok");
        message.success(`${file.name} file uploaded successfully.`);

        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
          let base64data = reader.result;
          setImg(base64data);
          onImageUpload(base64data);
        };

        setFileList([file]);
      } catch (error) {
        console.error("Upload error:", error);
        onError(error);
        message.error(`${file.name} file upload failed.`);
        setFileList([]);
      }
    },
    onChange: (info) => {
      console.log("onChange", info.file.status);
      const { status } = info.file;

      if (status === "uploading") {
        console.log("Uploading...");
      } else if (status === "done") {
        console.log("Upload completed");
      } else if (status === "error") {
        console.log("Upload failed");
        if (info.file.response && info.file.response.errorMessage) {
          message.error(`Error: ${info.file.response.errorMessage}`);
        } else {
          message.error(
            "An unknown error occurred during upload. Please try again."
          );
        }
        setFileList([]);
      }
    },
  };
  useEffect(() => {
    if (up?.length <= 0) {
      setImg(null);
    }
  }, [up]);

  const videoConstraints = {
    width: 720,
    height: 720,
    facingMode: "user",
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImg(imageSrc);
  }, [webcamRef]);

  return (
    <div
      className="Container"
      style={{ display: "flex", flexDirection: "column" }}
    >
      {img === null ? (
        <>
          {hasCameraPermission ? (
            <Webcam
              audio={false}
              mirrored={true}
              height={200}
              width={"auto"}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              onUserMediaError={handleUserMediaError}
            />
          ) : (
            <div
              style={{
                backgroundColor: "#E5D4FF",
                textAlign: "center",
                height: "210px",
                width: "auto",
              }}
            >
              <p>
                Camera permission is not given. Please give permission to access
                the camera.
              </p>
              <Button
                onClick={() =>
                  message.info(
                    "Please go to your browser settings and allow camera access for this site."
                  )
                }
              >
                Give Permission
              </Button>
            </div>
          )}
          <Row
            gutter={0}
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "0.5rem",
            }}
          >
            {hasCameraPermission && (
              <Col>
                <Button size="small" onClick={capture}>
                  Capture photo
                </Button>
              </Col>
            )}
            <Col>
              <Upload {...props}>
                <Button size="small" icon={<UploadOutlined />}>
                  Upload &nbsp;(&lt;1MB)
                </Button>
              </Upload>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img src={img} alt="PatientPhoto" width={200} height={200} />
          </div>
          <Row className="py-1">
            <Col span={12}>
              <Button
                size="small"
                onClick={() => {
                  setImg(null);
                  setFileList([]);
                }}
              >
                Retake Photo
              </Button>
            </Col>
            <Col span={12}>
              <Upload {...props} fileList={fileList}>
                <Button size="small" icon={<UploadOutlined />}>
                  Upload &nbsp;(&lt;1MB)
                </Button>
              </Upload>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}

export default WebcamImage;
