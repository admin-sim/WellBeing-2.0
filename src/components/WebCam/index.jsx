import { UploadOutlined, CameraOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Upload, message, Spin } from "antd";
import React, { useCallback, useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
function WebcamImage({ onImageUpload, initialImage }) {
  const [img, setImg] = useState(initialImage || null); // Set initial value
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

  // ✅ Update state when `initialImage` changes
  useEffect(() => {
    if (initialImage) {
      setImg(initialImage);
    }
  }, [initialImage]);

  const shortenFileName = (name) =>
    name.length > 12 ? name.substring(0, 12) + "..." : name;

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
    <div className="webcam-container">
      {/* Image Display / Webcam */}
      <div className="webcam-preview">
        {loading ? (
          <Spin tip="Loading camera..." />
        ) : img ? (
          <img src={img} alt="Captured" className="preview-image" />
        ) : hasCameraPermission ? (
          <Webcam
            audio={false}
            mirrored={true}
            className="webcam"
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              width: 720,
              height: 720,
              facingMode: "user",
            }}
            onUserMediaError={handleUserMediaError}
          />
        ) : (
          <p>No Camera Access</p>
        )}
      </div>

      {/* Buttons */}
      <div className="button-group">
        {!img ? (
          <>
            <Upload {...props} showUploadList={false}>
              <Button
                size="middle"
                icon={<UploadOutlined />}
                className="button"
              >
                Upload Photo
              </Button>
            </Upload>

            {hasCameraPermission && (
              <Button
                size="middle"
                icon={<CameraOutlined />}
                className="button capture"
                onClick={capture}
              >
                Capture Photo
              </Button>
            )}
          </>
        ) : (
          <>
            <Button
              size="middle"
              icon={<DeleteOutlined />}
              className="button remove"
              onClick={() => {
                setImg(null);
                setFileList([]);
                setFileName("");
                onImageUpload(null);
              }}
            >
              Remove Photo
            </Button>

            {hasCameraPermission && (
              <Button
                size="middle"
                icon={<CameraOutlined />}
                className="button capture"
                onClick={capture}
              >
                Retake Photo
              </Button>
            )}
          </>
        )}
      </div>

      {/* Styles */}
      <style jsx>{`
        .webcam-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 300px;
          width: 100%;
          border: 1px solid lavender;
          border-radius: 1rem;
          padding: 1rem;
          margin: auto;
        }

        .webcam-preview {
          width: 100%;
          max-width: 200px;
          height: 200px;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .webcam,
        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .button-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          width: 100%;
        }

        .button {
          width: 100%;
        }

        .capture {
          border-color: green;
        }

        .remove {
          border-color: red;
        }

        @media (max-width: 400px) {
          .webcam-container {
            max-width: 90%;
            padding: 0.5rem;
          }
          .webcam-preview {
            max-width: 160px;
            height: 160px;
          }
        }
      `}</style>
    </div>
  );
}

export default WebcamImage;
