import { Card, Form, Input, message, Select, Upload, UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { returnFileSizeFormated } from "../../../utils/utils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  ContentByModule,
  ContentType,
  Module,
  PhotoTextToDB,
  Quiz,
  QuizToDB,
  TextToDB,
  VideoToDB,
} from "../../../types/types";

interface AddContentModalInterface {
  content: ContentType | null;
  getContentByModule: (id_module: number) => Promise<ContentByModule | null>;
  setContentByModule: Dispatch<SetStateAction<ContentByModule | null>>;
  getQuizByModule: (id_module: number) => Promise<Quiz | null>;
  setQuizByModule: Dispatch<SetStateAction<Quiz | null>>;
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
  getContentByModule,
  setContentByModule,
  getQuizByModule,
  setQuizByModule,
  setCustomHandleOk,
}: AddContentModalInterface) {
  const [contentType, setContentType] = useState<"video" | "text" | "photo_text" | "quiz">("video");
  const [newVideo, setNewVideo] = useState<VideoToDB | null>(null);
  const [newText, setNewText] = useState<TextToDB | null>(null);
  const [newPhotoText, setNewPhotoText] = useState<PhotoTextToDB | null>(null);
  const [newQuiz, setNewQuiz] = useState<QuizToDB | null>(null);

  const [form] = Form.useForm();
  const maxVideoSize = 1e7;
  const maxPhotoSize = 500000;

  useEffect(() => {
    setCustomHandleOk(() => customHandleOk);
  }, [newVideo, newText, newPhotoText, newQuiz, content]);

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

  function handleContentTypeChange(value: "video" | "text" | "photo_text" | "quiz") {
    // console.log("value: ", value);
    setContentType(value);
  }

  function handleContentChange(
    allValues: VideoToDB | TextToDB | PhotoTextToDB | QuizToDB,
    content: ContentType | null
  ) {
    // console.log("allValues: ", allValues);
    // console.log("content: ", content);
    if (contentType === "video") {
      setNewVideo((prevVideo) => {
        const updatedVideo = {
          ...prevVideo,
          ...allValues,
          type: contentType,
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
          type: contentType,
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
          type: contentType,
          // photo_path: (allValues as PhotoTextToDB)?.photo[0]?.name,
          id_module: (content as Module).id,
        } as PhotoTextToDB;

        return updatedPhotoText;
      });
    }
    if (contentType === "quiz") {
      setNewQuiz((prevQuiz) => {
        const updatedQuiz = {
          ...prevQuiz,
          ...allValues,
          type: contentType,
          id_module: (content as Module).id,
        } as QuizToDB;

        return updatedQuiz;
      });
    }
  }

  async function customHandleOk() {
    if (contentType === "video") {
      if (
        newVideo?.title &&
        newVideo?.id_module &&
        newVideo?.video[0].originFileObj instanceof File
      ) {
        try {
          const formData = new FormData();
          formData.append("selectedVideo", newVideo.video[0].originFileObj, newVideo.video[0].name);

          await fetch(`${import.meta.env.VITE_API_URL}/upload/file`, {
            method: "POST",
            credentials: "include",
            body: formData,
          });

          const response = await fetch(`${import.meta.env.VITE_API_URL}/video/create`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...newVideo, path: newVideo.video[0].name }),
          });

          if (response.ok) {
            setContentByModule(await getContentByModule((content as Module)?.id));
          }
        } catch (error) {
          console.log(error);
          message.error("Un problème est survenu pendant l'ajout de la vidéo");
        }
      } else {
        console.log("Tous les champs obligatoires doivent être rempli");
        message.error("Tous les champs obligatoires doivent être rempli");
      }
    }
    if (contentType === "text") {
      if (newText?.title && newText?.id_module && newText?.content) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/text/create`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newText),
          });

          if (response.ok) {
            setContentByModule(await getContentByModule((content as Module)?.id));
          }
        } catch (error) {
          console.log(error);
          message.error("Un problème est survenu pendant l'ajout du texte");
        }
      } else {
        console.log("Tous les champs obligatoires doivent être rempli");
        message.error("Tous les champs obligatoires doivent être rempli");
      }
    }
    if (contentType === "photo_text") {
      if (
        newPhotoText?.title &&
        newPhotoText?.text_content &&
        newPhotoText?.photo[0].originFileObj instanceof File
      ) {
        try {
          const formData = new FormData();
          formData.append(
            "selectedPhoto",
            newPhotoText.photo[0].originFileObj,
            newPhotoText.photo[0].name
          );

          await fetch(`${import.meta.env.VITE_API_URL}/upload/file`, {
            method: "POST",
            credentials: "include",
            body: formData,
          });

          const response = await fetch(`${import.meta.env.VITE_API_URL}/photo_text/create`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...newPhotoText, photo_path: newPhotoText.photo[0].name }),
          });

          if (response.ok) {
            setContentByModule(await getContentByModule((content as Module)?.id));
          }
        } catch (error) {
          console.log(error);
          message.error("Un problème est survenu pendant l'ajout du photo texte");
        }
      } else {
        console.log("Tous les champs obligatoires doivent être rempli");
        message.error("Tous les champs obligatoires doivent être rempli");
      }
    }
    if (contentType === "quiz") {
      if (newQuiz?.title && newQuiz.id_module) {
        console.log("newQuiz: ", newQuiz);
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/quiz/create`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newQuiz),
          });
          if (response.ok) {
            setQuizByModule(await getQuizByModule((content as Module)?.id));
          } else {
            const badResponse = await response.json();
            console.log(badResponse.error);
          }
        } catch (error) {
          console.log(error);
          message.error("Un problème est survenu pendant l'ajout du quiz");
        }
      } else {
        console.log("Tous les champs obligatoires doivent être rempli");
        message.error("Tous les champs obligatoires doivent être rempli");
      }
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
      onValuesChange={(_, allValues) => handleContentChange(allValues, content)}>
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
                { value: "quiz", label: <span>Quiz</span> },
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
              ) : contentType === "quiz" ? (
                <div
                  style={{
                    borderRadius: 8,
                    border: "solid 1px var(--white-rose)",
                    padding: "16px",
                    marginBottom: 8,
                  }}>
                  <h3 style={{ marginBottom: 8 }}>Nouveau Quiz</h3>
                  <Form.Item
                    label="Titre du quiz"
                    name={["title"]}
                    rules={[
                      {
                        required: true,
                        message: "Le titre du quiz est requis",
                      },
                    ]}>
                    <Input />
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
