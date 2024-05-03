import { Button, Card, Form, Input, Select, Upload, UploadProps, message } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { ModuleToDB, TextToDB, VideoToDB } from "../../types/types";
import { useEffect } from "react";

interface TypeCoursFormProps {
  newModules: ModuleToDB[];
  // newVideos: VideoToDB[];
  setNewVideos: React.Dispatch<React.SetStateAction<VideoToDB[]>>;
  // newTexts: TextToDB[];
  setNewTexts: React.Dispatch<React.SetStateAction<TextToDB[]>>;
  allValuesTypeForm: { [key: string]: (VideoToDB | TextToDB)[] };
  setAllValuesTypeForm: React.Dispatch<
    React.SetStateAction<{ [key: string]: (VideoToDB | TextToDB)[] }>
  >;
}

interface ModuleContents {
  [key: string]: (VideoToDB | TextToDB)[];
}

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export function CreateTypeCoursForm({
  newModules,
  setNewVideos,
  setNewTexts,
  allValuesTypeForm,
  setAllValuesTypeForm,
}: TypeCoursFormProps) {
  const [form] = Form.useForm();
  const maxSize = 1e7;

  useEffect(() => {
    form.setFieldsValue(allValuesTypeForm);
  }, [form]);

  function returnFileSizeFormated(number: number) {
    if (number < 1024) {
      return `${number} bytes`;
    } else if (number >= 1024 && number < 1048576) {
      return `${(number / 1024).toFixed(1)} KB`;
    } else if (number >= 1048576) {
      return `${(number / 1048576).toFixed(1)} MB`;
    }
  }

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const isMP4 = file.type === "video/mp4";

      if (!isMP4) {
        message.error(`${file.name} n'est pas un fichier .mp4`);
        return Upload.LIST_IGNORE;
      }

      if (file.size > maxSize) {
        message.error(
          `La taille maximum d'une vidéo ne peut excéder ${returnFileSizeFormated(maxSize)}. ${
            file.name
          } pèse ${returnFileSizeFormated(file.size)} `
        );
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    onChange: (info) => {
      console.log(info);
    },
    maxCount: 1,
    listType: "picture-card",
  };

  async function handleValuesChange(allValues: ModuleContents): Promise<void> {
    console.log("allValues: ", allValues);
    setAllValuesTypeForm(allValues);
    const allValuesKeys = Object.keys(allValues);

    const updatedVideos = allValuesKeys.flatMap((key: string) => {
      return allValues[key]
        ?.filter((content) => content?.type === "video" && content.title && content.video)
        .map((content) => {
          const videoContent = content as VideoToDB;
          return {
            ...videoContent,
            id_module: null,
            key: key,
            path: videoContent.video?.[0]?.name,
          };
        });
    });

    const updatedTexts = allValuesKeys.flatMap((key: string) => {
      return allValues[key]
        ?.filter((content) => content?.type === "text" && content.title)
        .map((content) => {
          const textContent = content as TextToDB;
          return { ...textContent, id_module: null, key: key };
        });
    });

    setNewVideos(updatedVideos);
    setNewTexts(updatedTexts);
  }

  return (
    <>
      <h2 className="dashboardPage__main-content--h2">
        Choisissez un type de contenu pour chaque module
      </h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, width: "100%" }}>
        {newModules.map((module, moduleIndex) => (
          <div
            key={moduleIndex}
            style={{ display: "flex", flexDirection: "column", flex: "1 1 30%" }}>
            <h3 style={{ fontSize: "1.4rem" }}>{module.title}</h3>
            <Form
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              form={form}
              name={`form-module-${moduleIndex}`}
              // style={{ maxWidth: 600, minWidth: 300 }}
              autoComplete="off"
              layout="vertical"
              onValuesChange={(newValues, allValues) => handleValuesChange(allValues)}>
              <Form.List name={`module-${moduleIndex}`} initialValue={[]}>
                {(fields, { add, remove }) => (
                  <div style={{ display: "flex", rowGap: 16, flexDirection: "column" }}>
                    {fields.map((field) => (
                      <Card
                        size="small"
                        title={`Contenu ${field.name + 1}`}
                        key={field.key}
                        extra={
                          <CloseOutlined
                            onClick={() => {
                              remove(field.name);
                            }}
                          />
                        }>
                        <Form.Item {...field} label="Type de contenu" name={[field.name, "type"]}>
                          <Select
                            options={[
                              { value: "video", label: <span>Video</span> },
                              { value: "text", label: <span>Text</span> },
                            ]}
                          />
                        </Form.Item>

                        <Form.Item shouldUpdate>
                          {() => {
                            return form.getFieldValue([
                              `module-${moduleIndex}`,
                              field.name,
                              "type",
                            ]) === "video" ? (
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
                                  <Input />
                                </Form.Item>
                                <Form.Item
                                  label="Description de la vidéo"
                                  name={[field.name, "description"]}
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
                                    maxSize
                                  )})`}
                                  name={[field.name, "video"]}
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
                            ) : form.getFieldValue([
                                `module-${moduleIndex}`,
                                field.name,
                                "type",
                              ]) === "text" ? (
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
                                    {
                                      required: true,
                                      message: "Le titre du cours texte est requis",
                                    },
                                  ]}>
                                  <Input />
                                </Form.Item>
                                <Form.Item
                                  label="Contenu du cours texte"
                                  name={[field.name, "content"]}
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
                    ))}

                    <Button type="dashed" onClick={() => add()} block>
                      + Ajouter un contenu
                    </Button>
                  </div>
                )}
              </Form.List>

              {/* <Form.Item noStyle shouldUpdate>
                {() => (
                  <Typography>
                    <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
                  </Typography>
                )}
              </Form.Item> */}
            </Form>
          </div>
        ))}
      </div>
    </>
  );
}
