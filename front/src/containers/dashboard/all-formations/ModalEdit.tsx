import { Button, Form, Input, Modal, Switch, Upload, UploadFile, UploadProps, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import {
  AnswerOption,
  ContentType,
  Formation,
  Module,
  QuestionFromDB,
  Quiz,
  Text,
  Video,
} from "../../../types/types";
import { returnFileSizeFormated } from "../../../utils/utils";
import { MainContext } from "../../../contexts/MainContext";

const { TextArea } = Input;

export interface ModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  content: ContentType | null;
  setIsModifiedContent: Dispatch<SetStateAction<boolean>>;
}

// TypeGuard for Content
function isFormation(content: ContentType): content is Formation {
  return (content as Formation).cover_path !== undefined;
}

function isModule(content: ContentType): content is Module {
  return (content as Module).id_formation !== undefined;
}

function isVideo(content: ContentType): content is Video {
  return (content as Video).title_video !== undefined;
}

function isText(content: ContentType): content is Text {
  return (content as Text).title_text !== undefined;
}

function isQuiz(content: ContentType): content is Quiz {
  return (content as Quiz).questions !== undefined;
}

function isQuestion(content: ContentType): content is QuestionFromDB {
  return (content as QuestionFromDB).question_text !== undefined;
}

function isAnswerOption(content: ContentType): content is AnswerOption {
  return (content as AnswerOption).text !== undefined;
}

export function ModalEdit({ open, setOpen, content, setIsModifiedContent }: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<UploadFile | null>(null);
  const [newFormation, setNewFormation] = useState<Formation | null>(null);

  const maxSize = 500000;

  const mainContext = useContext(MainContext);
  if (!mainContext) return null;

  const { updateFormation } = mainContext;

  useEffect(() => {
    console.log("selectedFile: ", selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    console.log("NEW FORMATION: ", newFormation);
  }, [newFormation]);

  useEffect(() => {
    if (content && isFormation(content)) {
      setNewFormation(content);
    }
  }, [content]);

  function handleOnTitleFormationChange(e: ChangeEvent<HTMLInputElement>) {
    setNewFormation((prev) => (prev ? { ...prev, title: e.target.value } : null));
  }

  function handleOnDescriptionFormationChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setNewFormation((prev) => (prev ? { ...prev, description: e.target.value } : null));
  }

  function handleOnPublishedFormationChange(checked: boolean) {
    setNewFormation((prev) => (prev ? { ...prev, published: checked } : null));
  }

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const isJPG = file.type === "image/jpeg";

      if (!isJPG) {
        message.error(`${file.name} n'est pas un fichier .jpg`);
        return Upload.LIST_IGNORE;
      }

      if (file.size > maxSize) {
        message.error(
          `La taille maximum d'une photos ne peut excéder ${returnFileSizeFormated(maxSize)}. ${
            file.name
          } pèse ${returnFileSizeFormated(file.size)} `
        );
        return Upload.LIST_IGNORE;
      }

      return false;
    },
    onChange: (info) => {
      console.log(info);
      if (info.file.status === "removed") {
        setSelectedFile(null);
      } else {
        setSelectedFile(info.file);
      }
    },
    maxCount: 1,
    listType: "picture-card",
  };

  function displayModalContent(content: ContentType | null) {
    if (content !== null) {
      if (isFormation(content)) {
        console.log("content is Formation", content);

        return (
          <div className="modal__body--formation">
            <Form>
              <Form.Item>
                <Upload
                  {...uploadProps}
                  defaultFileList={[
                    {
                      uid: String(content?.id),
                      name: content.title,
                      status: "done",
                      url: `${import.meta.env.VITE_API_URL}/public/${content.cover_path}`,
                    },
                  ]}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
              <Form.Item>
                <label>Titre</label>
                <Input
                  defaultValue={content?.title}
                  onChange={(e) => handleOnTitleFormationChange(e)}></Input>
              </Form.Item>
              <Form.Item>
                <label>Description</label>
                <TextArea
                  defaultValue={content?.description}
                  onChange={(e) => handleOnDescriptionFormationChange(e)}></TextArea>
              </Form.Item>
              <Form.Item>
                <Switch
                  defaultChecked={content?.published}
                  onChange={(e) => handleOnPublishedFormationChange(e)}
                />
              </Form.Item>
            </Form>
          </div>
        );
      } else if (isModule(content)) {
        console.log("content is Module", content);
        // Afficher les données spécifiques à Module
        return <div>Module Content: {content.id_formation}</div>;
      } else if (isVideo(content)) {
        console.log("content is Video", content);
        // Afficher les données spécifiques à Video
        return <div>Video Content: {content.title_video}</div>;
      } else if (isText(content)) {
        console.log("content is Text", content);
        // Afficher les données spécifiques à Text
        return <div>Text Content: {content.title_text}</div>;
      } else if (isQuiz(content)) {
        console.log("content is Quiz", content);
        // Afficher les données spécifiques à Quiz
        return <div>Quiz Content: {content.questions.length} questions</div>;
      } else if (isQuestion(content)) {
        console.log("content is Question", content);
        // Afficher les données spécifiques à Question
        return <div>Question Content: {content.question_text}</div>;
      } else if (isAnswerOption(content)) {
        console.log("content is AnswerOption", content);
        // Afficher les données spécifiques à AnswerOption
        return <div>AnswerOption Content: {content.text}</div>;
      } else {
        console.log("Unknown content type", content);
        return <div>Unknown content type</div>;
      }
    }
    return <div>No content available</div>;
  }

  const handleOk = async () => {
    try {
      setLoading(true);
      setIsModifiedContent(false);

      const response = await updateFormation(newFormation);

      if (response) {
        message.success("Formation modifiée");
        setIsModifiedContent(true);
      }
    } catch (error) {
      message.error("Une erreur s'est produite pendant la modification");
    }
    setLoading(false);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        className="modal"
        key={JSON.stringify(content)}
        open={open}
        title={``}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button className="button" key="back" onClick={handleCancel}>
            Retour
          </Button>,
          <Button
            className="button validate"
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleOk}>
            Confirmer
          </Button>,
        ]}>
        <div className="modal__body">{displayModalContent(content)}</div>
      </Modal>
    </>
  );
}
