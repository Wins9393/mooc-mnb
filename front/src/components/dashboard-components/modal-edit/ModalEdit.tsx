import { Button, Modal, message } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import { ContentByModule, ContentType } from "../../../types/types";
import {
  isAnswerOption,
  isFormation,
  isModule,
  isPhotoText,
  isQuestion,
  isQuiz,
  isText,
  isVideo,
} from "../../../typesGuards/typesGuard";
import { EditFormationDisplay } from "./EditFormationDisplay";

export interface ModalProps {
  openEdit: boolean;
  setOpenEdit: Dispatch<SetStateAction<boolean>>;
  content: ContentType | null;
  setIsModifiedContent: Dispatch<SetStateAction<boolean>>;
  getContentByModule: (id_module: number) => Promise<ContentByModule | null>;
}

export function ModalEdit({ openEdit, setOpenEdit, content, setIsModifiedContent }: ModalProps) {
  const [customHandleOk, setCustomHandleOk] = useState<() => Promise<void>>(() =>
    Promise.resolve()
  );
  const [loading, setLoading] = useState(false);

  function displayModalContent(content: ContentType | null) {
    if (content !== null) {
      if (isFormation(content)) {
        console.log("content is Formation", content);
        return (
          <EditFormationDisplay
            content={content}
            setIsModifiedContent={setIsModifiedContent}
            setCustomHandleOk={setCustomHandleOk}
          />
        );
      } else if (isModule(content)) {
        // console.log("content is Module", content);
        // Afficher les données spécifiques à Module
        return <div>Module Content: {content.id_formation}</div>;
      } else if (isVideo(content)) {
        // console.log("content is Video", content);
        // Afficher les données spécifiques à Video
        return <div>Video Content: {content.title_video}</div>;
      } else if (isText(content)) {
        // console.log("content is Text", content);
        // Afficher les données spécifiques à Text
        return <div>Text Content: {content.title_text}</div>;
      } else if (isPhotoText(content)) {
        // console.log("content is PhotoText", content);
        // Afficher les données spécifiques à Text
        return <div>Photo Text Content: {content.title_photo_text}</div>;
      } else if (isQuiz(content)) {
        // console.log("content is Quiz", content);
        // Afficher les données spécifiques à Quiz
        return <div>Quiz Content: {content.questions.length} questions</div>;
      } else if (isQuestion(content)) {
        // console.log("content is Question", content);
        // Afficher les données spécifiques à Question
        return <div>Question Content: {content.question_text}</div>;
      } else if (isAnswerOption(content)) {
        // console.log("content is AnswerOption", content);
        // Afficher les données spécifiques à AnswerOption
        return <div>AnswerOption Content: {content.text}</div>;
      } else {
        // console.log("Unknown content type", content);
        return <div>Unknown content type</div>;
      }
    }
    return <div>No content available</div>;
  }

  const handleOk = async () => {
    try {
      setLoading(true);
      setIsModifiedContent(false);

      if (customHandleOk) {
        await customHandleOk();
      } else {
        console.log("problème !");
      }
    } catch (error) {
      message.error("Une erreur s'est produite pendant la modification");
    }
    setLoading(false);
    setOpenEdit(false);
  };

  const handleCancel = () => {
    setOpenEdit(false);
  };

  return (
    <>
      <Modal
        className="modal"
        key={JSON.stringify(content)}
        open={openEdit}
        title={``}
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
