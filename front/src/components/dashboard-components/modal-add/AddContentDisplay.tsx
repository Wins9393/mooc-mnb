import { Card, Form, Input, message, Select, Upload, UploadFile, UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { returnFileSizeFormated } from "../../../utils/utils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ContentType, Module, PhotoTextToDB, TextToDB, VideoToDB } from "../../../types/types";

interface AddContentModalInterface {
  content: ContentType | null;
  setIsModifiedContent: Dispatch<SetStateAction<boolean>>;
  setCustomHandleOk: Dispatch<SetStateAction<() => Promise<void>>>;
}

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export function AddContentDisplay({
  content,
  setIsModifiedContent,
  setCustomHandleOk,
}: AddContentModalInterface) {
  const [contentType, setContentType] = useState<"video" | "text" | "photo_text">("video");
  const [newVideo, setNewVideo] = useState<VideoToDB | null>(null);
  const [newText, setNewText] = useState<TextToDB | null>(null);
  const [newPhotoText, setNewPhotoText] = useState<PhotoTextToDB | null>(null);
  const [selectedFile, setSelectedFile] = useState<UploadFile | null>(null);

  const [form] = Form.useForm();
  const maxVideoSize = 1e7;
  const maxPhotoSize = 500000;

  useEffect(() => {
    console.log("newVideo: ", newVideo);
    console.log("newText: ", newText);
    console.log("newPhotoText: ", newPhotoText);
    console.log("content: ", content);
  }, [newVideo, newText, newPhotoText]);

  useEffect(() => {
    setCustomHandleOk(() => customHandleOk);
  }, [newVideo, newText, newPhotoText, content]);

  const uploadVideoProps: UploadProps = {
    beforeUpload: (file) => {
      const isMP4 = file.type === "video/mp4";

      if (!isMP4) {
        message.error(`${file.name} n'est pas un fichier .mp4`);
        return Upload.LIST_IGNORE;
      }

      if (file.size > maxVideoSize) {
        message.error(
          `La taille maximum d'une vidéo ne peut excéder ${returnFileSizeFormated(maxVideoSize)}. ${
            file.name
          } pèse ${returnFileSizeFormated(file.size)} `
        );
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    maxCount: 1,
    listType: "picture-card",
  };

  const uploadPhotosProps: UploadProps = {
    beforeUpload: (file) => {
      const isJPG = file.type === "image/jpeg";

      if (!isJPG) {
        message.error(`${file.name} n'est pas un fichier .jpg`);
        return Upload.LIST_IGNORE;
      }

      if (file.size > maxPhotoSize) {
        message.error(
          `La taille maximum d'une photos ne peut excéder ${returnFileSizeFormated(
            maxPhotoSize
          )}. ${file.name} pèse ${returnFileSizeFormated(file.size)} `
        );
        return Upload.LIST_IGNORE;
      }

      return false;
    },
    maxCount: 1,
    listType: "picture-card",
  };

  function handleContentTypeChange(value: "video" | "text" | "photo_text") {
    console.log("value: ", value);
    setContentType(value);
  }

  function handleContentChange(
    allValues: VideoToDB | TextToDB | PhotoTextToDB,
    content: ContentType | null
  ) {
    console.log("allValues: ", allValues);
    console.log("content: ", content);
    if (contentType === "video") {
      setNewVideo((prevVideo) => {
        const updatedVideo = {
          ...prevVideo,
          ...allValues,
          id_module: (content as Module).id,
        } as VideoToDB;

        return updatedVideo;
      });
    }
    if (contentType === "text") {
      setNewText((prevText) => {
        const updatedText = {
          ...prevText,
          ...allValues,
          id_module: (content as Module).id,
        } as TextToDB;

        return updatedText;
      });
    }
    if (contentType === "photo_text") {
      setNewPhotoText((prevPhotoText) => {
        const updatedPhotoText = {
          ...prevPhotoText,
          ...allValues,
          id_module: (content as Module).id,
        } as PhotoTextToDB;

        return updatedPhotoText;
      });
    }
  }

  async function customHandleOk() {
    try {
      if (contentType === "video" && newVideo !== null) {
      }
    } catch (error) {
      message.error("Erreur");
    }
  }

  return (
    <Form
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      form={form}
      name={"module-content"}
      autoComplete="off"
      layout="vertical"
      onValuesChange={(newValues, allValues) => handleContentChange(allValues, content)}>
      <div style={{ display: "flex", rowGap: 16, flexDirection: "column" }}>
        <Card size="small" title={`Nouveau contenu`} key={(content as Module)?.id}>
          <Form.Item label="Type de contenu" name={["type"]}>
            <Select
              onChange={handleContentTypeChange}
              defaultValue={contentType}
              options={[
                { value: "video", label: <span>Video</span> },
                { value: "text", label: <span>Texte</span> },
                { value: "photo_text", label: <span>Photo + Texte</span> },
              ]}
            />
          </Form.Item>

          <Form.Item shouldUpdate>
            {() => {
              return contentType === "video" ? (
                <div
                  style={{
                    borderRadius: 8,
                    border: "solid 1px var(--white-rose)",
                    padding: "16px",
                    marginBottom: 8,
                  }}>
                  <h3 style={{ marginBottom: 8 }}>Nouvelle Vidéo</h3>
                  <Form.Item
                    label="Titre de la vidéo"
                    name={["title"]}
                    rules={[{ required: true, message: "Le titre de la vidéo est requis" }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Description de la vidéo"
                    name={["description"]}
                    rules={[
                      {
                        required: false,
                        message: "La description de la vidéo est requise",
                      },
                    ]}>
                    <Input.TextArea />
                  </Form.Item>
                  <Form.Item
                    required
                    label={`Fichier vidéo (.mp4 requis | taille max: ${returnFileSizeFormated(
                      maxVideoSize
                    )})`}
                    name={["video"]}
                    valuePropName="fileList"
                    getValueFromEvent={normFile}>
                    <Upload {...uploadVideoProps}>
                      <button style={{ border: 0, background: "none" }} type="button">
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </button>
                    </Upload>
                  </Form.Item>
                </div>
              ) : contentType === "text" ? (
                <div
                  style={{
                    borderRadius: 8,
                    border: "solid 1px var(--white-rose)",
                    padding: "16px",
                    marginBottom: 8,
                  }}>
                  <h3 style={{ marginBottom: 8 }}>Nouveau Texte</h3>
                  <Form.Item
                    label="Titre du cours texte"
                    name={["title"]}
                    rules={[
                      {
                        required: true,
                        message: "Le titre du cours texte est requis",
                      },
                    ]}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Contenu du cours texte"
                    name={["content"]}
                    rules={[
                      {
                        required: true,
                        message: "Le contenu du cours texte est requis",
                      },
                    ]}>
                    <Input.TextArea />
                  </Form.Item>
                </div>
              ) : contentType === "photo_text" ? (
                <div
                  style={{
                    borderRadius: 8,
                    border: "solid 1px var(--white-rose)",
                    padding: "16px",
                    marginBottom: 8,
                  }}>
                  <h3 style={{ marginBottom: 8 }}>Nouveau Photo + Texte</h3>
                  <Form.Item
                    label="Titre du cours photos + texte"
                    name={["title"]}
                    rules={[
                      {
                        required: true,
                        message: "Le titre du cours photos + texte est requis",
                      },
                    ]}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    required
                    label={`Fichier .jpg (taille max: ${returnFileSizeFormated(maxPhotoSize)})`}
                    name={["photo"]}
                    valuePropName="fileList"
                    getValueFromEvent={normFile}>
                    <Upload {...uploadPhotosProps}>
                      <button style={{ border: 0, background: "none" }} type="button">
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </button>
                    </Upload>
                  </Form.Item>
                  <Form.Item
                    label="Contenu texte"
                    name={["text_content"]}
                    rules={[
                      {
                        required: true,
                        message: "Le contenu du cours texte est requis",
                      },
                    ]}>
                    <Input.TextArea />
                  </Form.Item>
                </div>
              ) : (
                ""
              );
            }}
          </Form.Item>
        </Card>
      </div>
    </Form>
  );
}
