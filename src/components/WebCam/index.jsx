import { UploadOutlined } from "@ant-design/icons";
import { Button, Col, Row, Upload, message, Spin } from "antd";
import React, { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import Webcam from "react-webcam";

function WebcamImage({ onImageUpload }) {
  const [img, setImg] = useState(null);
  const webcamRef = useRef(null);
  const [up, setUp] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(true); // New state for loader

  const handleUserMediaError = (error) => {
    console.log(error);
    setHasCameraPermission(false);
    setLoading(false); // Stop loader if there's an error
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
      setFileList([]);
      onImageUpload(null);
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        console.log("Uploading file:", file);

        await new Promise((resolve) => setTimeout(resolve, 1000));

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

  useEffect(() => {
    if (hasCameraPermission) {
      setLoading(false); // Stop loader when the webcam is ready
    }
  }, [hasCameraPermission]);

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
      style={{
        display: "flex",
        border: "1px solid lavender",
        width: "100%",
        justifyContent: "center",
        borderRadius: "1rem",
        padding: "0.5rem",
        alignItems: "center",
        flexDirection: "column", // Stack elements vertically
      }}
    >
      {loading ? (
        <Spin tip="Loading camera..." />
      ) : (
        <>
          {/* Display Camera or Captured Image */}
          {img === null ? (
            hasCameraPermission ? (
              <Webcam
                audio={false}
                mirrored={true}
                height={150}
                width={"auto"}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                onUserMediaError={handleUserMediaError}
                onUserMedia={() => setLoading(false)}
              />
            ) : (
              <div
                style={{
                  backgroundColor: "#E5D4FF",
                  textAlign: "center",
                  height: "150px",
                  width: "150px",
                }}
              >
                <p>Camera permission is not given. Please allow access.</p>
                <Button
                  onClick={() =>
                    message.info(
                      "Please go to your browser settings and allow camera access."
                    )
                  }
                >
                  Give Permission
                </Button>
              </div>
            )
          ) : (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img src={img} alt="PatientPhoto" width={150} height={150} />
            </div>
          )}
  
          {/* Capture Photo Button */}
          {img === null && hasCameraPermission && (
            <Button
              size="middle"
              style={{
                width: "6rem",
                borderColor: "green",
                marginTop: "0.5rem",
                textAlign: "center",
                padding: "0.5rem 0",
              }}
              onClick={capture}
            >
              Capture Photo
            </Button>
          )}
  
          {/* Upload Photo & Retake Photo in Same Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "0.5rem",
              marginTop: "0.5rem",
            }}
          >
            {/* Upload Photo (Mandatory) */}
            <Upload
              {...props}
              fileList={fileList}
              onChange={({ fileList }) => {
                setFileList(fileList);
                if (fileList.length > 0) {
                  setImg(fileList[0].thumbUrl || fileList[0].url); // Store uploaded photo as image
                }
              }}
            >
              <Button
                size="middle"
                style={{
                  width: "6rem",
                  borderColor: "brown",
                  fontSize: "0.65rem",
                  padding: "0.5rem 0",
                }}
                icon={<UploadOutlined />}
              >
                Upload (&lt;1MB)
              </Button>
            </Upload>
  
            {/* Retake Photo (Only After Capturing/Uploading) */}
            {img || fileList.length > 0 ? (
              <Button
                size="middle"
                style={{
                  width: "6rem",
                  borderColor: "red",
                }}
                onClick={() => {
                  setImg(null);
                  setFileList([]);
                }}
              >
                Retake Photo
              </Button>
            ) : null}
          </div>
        </>
      )}
    </div>
  );  
}

export default WebcamImage;
