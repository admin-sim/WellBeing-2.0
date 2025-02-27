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
        flexDirection: "column",
        alignItems: "center",
        width: "200px", // Set a fixed width
        minHeight: "220px", // Set a minimum height to prevent shifting
        border: "1px solid lavender",
        borderRadius: "1rem",
        padding: "1rem",
      }}
    >
      {/* Image Placeholder */}
      <div
        style={{
          width: "150px",
          height: "150px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "1px solid #ddd",
          borderRadius: "8px",
          overflow: "hidden",
          marginBottom: "1rem",
        }}
      >
        {img ? (
          <img
            src={img}
            alt="Patient Photo"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : hasCameraPermission ? (
          <Webcam
            audio={false}
            mirrored={true}
            height={150}
            width={150}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            onUserMediaError={handleUserMediaError}
          />
        ) : (
          <p>No Camera Access</p>
        )}
      </div>

      {/* Upload & Retake Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <Upload
          {...props}
          fileList={fileList}
          onChange={({ fileList }) => {
            setFileList(fileList);
            if (fileList.length > 0) {
              setImg(fileList[0].thumbUrl || fileList[0].url);
            }
          }}
        >
          <Button
            size="middle"
            style={{
              width: "100%",
              borderColor: "brown",
              fontSize: "0.85rem",
              padding: "0.5rem 0",
            }}
            icon={<UploadOutlined />}
          >
            Upload Photo
          </Button>
        </Upload>

        {img || fileList.length > 0 ? (
          <Button
            size="middle"
            style={{ width: "100%", borderColor: "red" }}
            onClick={() => {
              setImg(null);
              setFileList([]);
            }}
          >
            Retake Photo
          </Button>
        ) : null}
      </div>
    </div>
  );  
}

export default WebcamImage;
