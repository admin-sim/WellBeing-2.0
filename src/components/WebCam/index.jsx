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

  const handleUserMediaError = (error) => {
    console.log(error);
    setHasCameraPermission(false);
  };
  const props = {
    name: "file",
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    headers: {
      authorization: "authorization-text",
    },
    maxCount: 1,
    onRemove() {
      setImg(null);
      onImageUpload(null);
      setUp([]);
    },
    onChange(info) {
      setUp(info.fileList);
      if (info.fileList.length === 0) {
        setImg(null);
        onImageUpload(null);
      } else if (info.file.status !== "uploading") {
        let reader = new FileReader();
        reader.readAsDataURL(info.file.originFileObj);
        reader.onloadend = function () {
          let base64data = reader.result;
          setImg(base64data);
          onImageUpload(base64data);
        };
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
    <div className="Container">
      {img === null ? (
        <>
          {hasCameraPermission ? (
            <Webcam
              audio={false}
              mirrored={true}
              height={300}
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
          <Row gutter={0} style={{ display: "flex", justifyContent: "center" }}>
            {hasCameraPermission && (
              <Col span={12}>
                <Button size="small" onClick={capture}>
                  Capture photo
                </Button>
              </Col>
            )}
            <Col span={12}>
              <Upload {...props}>
                <Button size="small" icon={<UploadOutlined />}>
                  Click to Upload
                </Button>
              </Upload>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <img src={img} alt="PatientPhoto" width={"auto"} height={300} />
          <Row className="py-1">
            <Col span={12}>
              <Button size="small" onClick={() => setImg(null)}>
                Retake Photo
              </Button>
            </Col>
            <Col span={12}>
              <Upload {...props}>
                <Button size="small" icon={<UploadOutlined />}>
                  Click to Upload
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
