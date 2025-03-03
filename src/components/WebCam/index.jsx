import { UploadOutlined, CameraOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Upload, message, Spin } from "antd";
import React, { useCallback, useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";

function WebcamImage({ onImageUpload }) {
  const [img, setImg] = useState(null);
  const webcamRef = useRef(null);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  const [fileName, setFileName] = useState("");

  const handleUserMediaError = (error) => {
    console.error(error);
    setHasCameraPermission(false);
    setLoading(false);
  };

  useEffect(() => {
    if (hasCameraPermission) {
      setLoading(false);
    }
  }, [hasCameraPermission]);

  // Truncate File Name
  const shortenFileName = (name) => (name.length > 12 ? name.substring(0, 12) + "..." : name);

  // Capture Image
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImg(imageSrc);
    setFileList([]);
    setFileName("");
    onImageUpload(imageSrc);
  }, [webcamRef]);

  const props = {
    name: "patient",
    maxCount: 1,
    accept: "image/*",
    fileList,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isImage) message.error("Only image files are allowed!");
      if (!isLt1M) message.error("Image must be smaller than 1MB!");
      return isImage && isLt1M;
    },
    onRemove: () => {
      setImg(null);
      setFileList([]);
      setFileName("");
      onImageUpload(null);
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
          let base64data = reader.result;
          setImg(base64data);
          onImageUpload(base64data);
        };

        const shortName = shortenFileName(file.name);
        setFileName(shortName);
        setFileList([file]);

        await new Promise((resolve) => setTimeout(resolve, 1000));
        onSuccess("ok");
        message.success(`${shortName} uploaded successfully.`);
      } catch (error) {
        console.error("Upload error:", error);
        onError(error);
        message.error("File upload failed.");
        setFileList([]);
        setFileName("");
      }
    },
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "250px",
        minHeight: "250px",
        border: "1px solid lavender",
        borderRadius: "1rem",
        padding: "1rem",
      }}
    >
      {/* Image Display / Webcam */}
      <div
        style={{
          width: "160px",
          height: "160px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "1px solid #ddd",
          borderRadius: "8px",
          overflow: "hidden",
          marginBottom: "1rem",
        }}
      >
        {loading ? (
          <Spin tip="Loading camera..." />
        ) : img ? (
          <img
            src={img}
            alt="Captured"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : hasCameraPermission ? (
          <Webcam
            audio={false}
            mirrored={true}
            height={160}
            width={160}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ width: 720, height: 720, facingMode: "user" }}
            onUserMediaError={handleUserMediaError}
          />
        ) : (
          <p>No Camera Access</p>
        )}
      </div>

      {/* ✅ FIXED: Correct Filename Display (No Attachment Icon) */}
      {/* {fileName && (
        <div
          style={{
            maxWidth: "180px",
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: "0.85rem",
            color: "gray",
            textAlign: "center",
            marginBottom: "0.5rem",
            borderBottom: "1px solid #ddd", // Light separator
            paddingBottom: "5px",
          }}
          title={fileName} // Full name on hover
        >
          {fileName}
        </div>
      )} */}

      {/* Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <Upload {...props} showUploadList={false}> {/* ✅ Hides the unwanted attachment icon */}
          <Button size="middle" icon={<UploadOutlined />} style={{ width: "100%" }}>
            Upload Photo
          </Button>
        </Upload>

        {hasCameraPermission && (
          <Button
            size="middle"
            icon={<CameraOutlined />}
            style={{ width: "100%", borderColor: "green" }}
            onClick={capture}
          >
            Capture Photo
          </Button>
        )}

        {img && (
          <Button
            size="middle"
            icon={<DeleteOutlined />}
            style={{ width: "100%", borderColor: "red" }}
            onClick={() => {
              setImg(null);
              setFileList([]);
              setFileName("");
              onImageUpload(null);
            }}
          >
            Remove Photo
          </Button>
        )}
      </div>
    </div>
  );
}

export default WebcamImage;
