import {
  Button,
  Form,
  FormListFieldData,
  Input,
  Select,
  Upload,
  UploadFile,
  UploadProps,
  message,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { ModuleToDB, TextToDB, VideoToDB } from "../../types/types";
import { ChangeEvent, useEffect, useState } from "react";

interface TypeCoursFormProps {
  newModules: ModuleToDB[];
  newVideos: VideoToDB[];
  setNewVideos: React.Dispatch<React.SetStateAction<VideoToDB[]>>;
  newTexts: TextToDB[];
  setNewTexts: React.Dispatch<React.SetStateAction<TextToDB[]>>;
  setSelectedVideoFile: React.Dispatch<React.SetStateAction<UploadFile | null>>;
}

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export function CreateTypeCoursForm({
  newModules,
  newVideos,
  setNewVideos,
  newTexts,
  setNewTexts,
  setSelectedVideoFile,
}: TypeCoursFormProps) {
  const [form] = Form.useForm();
  const [contentTypeSelections, setContentTypeSelections] = useState<{ [key: string]: string }>({});
  const [formValues, setFormValues] = useState<{ [key: string]: any[] }>({});

  // useEffect(() => {
  //   console.log("contentTypeSelections", contentTypeSelections);
  // }, [contentTypeSelections]);

  // useEffect(() => {
  //   const fields = form.getFieldsValue();
  //   setFormValues(fields);
  // }, [form]);

  useEffect(() => {
    let newFormValues: { [key: string]: any[] } = {};

    newModules.forEach((module, moduleIndex) => {
      const contentItems = [];
      // Construisez la clé pour les vidéos et les textes de ce module
      // const keyForModule = `types_cours_module-${moduleIndex}`;

      const videosForThisModule = newVideos.filter((video) => {
        const videoKey = video?.key ? parseInt(video?.key?.split("-")[1]) : null;
        if (video.key) {
          const videoKeyAsString = String(video.key);
          setContentTypeSelections((prev) => ({ ...prev, [videoKeyAsString]: "video" }));
        }
        return videoKey === moduleIndex;
      });

      const textsForThisModule = newTexts.filter((text) => {
        const textKey = text?.key ? parseInt(text?.key?.split("-")[1]) : null;
        if (text.key) {
          const textKeyAsString = String(text.key);
          setContentTypeSelections((prev) => ({ ...prev, [textKeyAsString]: "text" }));
        }
        return textKey === moduleIndex;
      });

      contentItems.push(...videosForThisModule, ...textsForThisModule);
      newFormValues[moduleIndex] = contentItems;
    });

    setFormValues(newFormValues);
  }, [newVideos, newTexts, form]);

  useEffect(() => {
    form.setFieldsValue(formValues);
    console.log("formValues: ", formValues);
    console.log("newVideos: ", newVideos);
    console.log("newTexts: ", newTexts);
  }, [formValues, form]);

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const isMP4 = file.type === "video/mp4";
      if (!isMP4) {
        message.error(`${file.name} n'est pas un fichier .mp4`);
      }
      return false;
    },
    onChange: (info) => {
      console.log(info);
      if (info.file.status === "removed") {
        setSelectedVideoFile(null);
      } else {
        setSelectedVideoFile(info.file);
        // setNewVideos((prevVideo: VideoToDB) => ({
        //   ...prevVideo,
        //   cover_path: info.file.name,
        // }));
      }
    },
    maxCount: 1,
    listType: "picture-card",
  };

  const handleContentTypeChange = (key: string, value: string) => {
    console.log(key, value);
    setContentTypeSelections((prev) => ({ ...prev, [key]: value }));
  };

  const onVideosChange = (
    field: "title" | "description",
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    key: string
  ) => {
    const videoIndex = newVideos.findIndex((video) => video.key === key);

    if (videoIndex !== -1) {
      // Mise à jour de l'élément existant
      const updatedVideos = [...newVideos];
      updatedVideos[videoIndex] = { ...updatedVideos[videoIndex], [field]: e.target.value };
      setNewVideos(updatedVideos);
    } else {
      // Ajout d'un nouvel élément si non trouvé
      setNewVideos([
        ...newVideos,
        {
          key,
          title: field === "title" ? e.target.value : "",
          description: field === "description" ? e.target.value : "",
          type: "video",
          id_module: null,
          path: "",
        },
      ]);
    }
  };

  const onTextsChange = (
    field: "title" | "content",
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    key: string
  ) => {
    const textIndex = newTexts.findIndex((text) => text.key === key);

    if (textIndex !== -1) {
      // Mise à jour de l'élément existant
      const updatedTexts = [...newTexts];
      updatedTexts[textIndex] = { ...updatedTexts[textIndex], [field]: e.target.value };
      setNewTexts(updatedTexts);
    } else {
      // Ajout d'un nouvel élément si non trouvé
      setNewTexts([
        ...newTexts,
        {
          key,
          title: field === "title" ? e.target.value : "",
          content: field === "content" ? e.target.value : "",
          type: "text",
          id_module: null,
        },
      ]);
    }
  };

  function onRemoveTypeCours(field: FormListFieldData, removeFunction: (index: number) => void) {
    removeFunction(field.name);
    const fields = form.getFieldsValue();
    console.log("fields: ", fields);
  }

  return (
    <>
      <h2 className="dashboardPage__main-content--h2">
        Choisissez un type de contenu pour chaque module
      </h2>
      <div style={{ display: "flex", gap: "16px" }}>
        {newModules.map((module, moduleIndex) => (
          <div key={moduleIndex} style={{ display: "flex", flexDirection: "column" }}>
            <h3 style={{ fontSize: "1.4rem" }}>{module.title}</h3>
            <Form
              form={form}
              name={`dynamic_type_cours_form-${moduleIndex}`}
              layout="vertical"
              style={{ maxWidth: 600 }}
              initialValues={{ module: [{}] }}>
              <Form.List name={moduleIndex}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, fieldIndex) => {
                      const key = `module-${moduleIndex}-field-${fieldIndex}`;

                      return (
                        <div key={field.key}>
                          <Form.Item
                            name={[field.name, "type"]}
                            label="Choisissez un type de contenu">
                            <Select
                              defaultValue={contentTypeSelections[key]}
                              onChange={(value) => handleContentTypeChange(key, value)}
                              options={[
                                { value: "video", label: <span>Video</span> },
                                { value: "text", label: <span>Text</span> },
                              ]}
                            />
                          </Form.Item>
                          {contentTypeSelections[key] === "video" && (
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
                                name={[field.name, "title"]}
                                rules={[
                                  { required: true, message: "Le titre de la vidéo est requis" },
                                ]}>
                                <Input onChange={(e) => onVideosChange("title", e, key)} />
                              </Form.Item>
                              <Form.Item
                                label="Description de la vidéo"
                                name={[field.name, "description"]}
                                rules={[
                                  {
                                    required: false,
                                    message: "La description de la vidéo est requis",
                                  },
                                ]}>
                                <Input.TextArea
                                  onChange={(e) => onVideosChange("description", e, key)}
                                />
                              </Form.Item>
                              <Form.Item
                                required
                                label="Fichier vidéo (.mp4 requis)"
                                valuePropName="fileList"
                                getValueFromEvent={normFile}>
                                <Upload {...uploadProps}>
                                  <button style={{ border: 0, background: "none" }} type="button">
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                  </button>
                                </Upload>
                              </Form.Item>
                            </div>
                          )}
                          {contentTypeSelections[key] === "text" && (
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
                                name={[field.name, "title"]}
                                rules={[
                                  { required: true, message: "Le titre du cours texte est requis" },
                                ]}>
                                <Input onChange={(e) => onTextsChange("title", e, key)} />
                              </Form.Item>
                              <Form.Item
                                label="Contenu du cours texte"
                                name={[field.name, "content"]}
                                rules={[
                                  {
                                    required: false,
                                    message: "Le contenu du cours texte est requis",
                                  },
                                ]}>
                                <Input.TextArea
                                  onChange={(e) => onTextsChange("content", e, key)}
                                />
                              </Form.Item>
                            </div>
                          )}
                          <MinusCircleOutlined onClick={() => onRemoveTypeCours(field, remove)} />
                        </div>
                      );
                    })}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Ajouter un contenu
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form>
          </div>
        ))}
      </div>
    </>
  );
}
