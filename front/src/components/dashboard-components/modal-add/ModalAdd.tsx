import { Button, message, Modal } from "antd";

import { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from "react";
import { ContentByModule, ContentType, Quiz } from "../../../types/types";
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
import { AddFormationDisplay } from "./AddFormationDisplay";
import { AddContentDisplay } from "./AddContentDisplay";

export interface ModalProps {
  openAdd: boolean;
  setOpenAdd: Dispatch<SetStateAction<boolean>>;
  content: ContentType | null;
  setIsModifiedContent: Dispatch<SetStateAction<boolean>>;
  getContentByModule: (id_module: number) => Promise<ContentByModule | null>;
  setContentByModule: Dispatch<SetStateAction<ContentByModule | null>>;
  getQuizByModule: (id_module: number) => Promise<Quiz | null>;
  setQuizByModule: Dispatch<SetStateAction<Quiz | null>>;
}

export function ModalAdd({
  openAdd,
  setOpenAdd,
  content,
  setIsModifiedContent,
  getContentByModule,
  setContentByModule,
  getQuizByModule,
  setQuizByModule,
}: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState<string | null>(null);

  const [customHandleOk, setCustomHandleOk] = useState<() => Promise<void>>(() =>
    Promise.resolve()
  );

  useEffect(() => {
    if (content !== null) {
      if (isFormation(content)) {
        setTitle(`Ajouter un module à la formation: ${content.title}`);
      } else if (isModule(content)) {
        setTitle("Ajouter un contenu");
      } else if (isQuiz(content)) {
        setTitle("Ajouter une question");
      } else if (isQuestion(content)) {
        setTitle("Ajouter une réponse");
      }
    }
  }, [content]);

  const handleOk = async (e: MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    setIsModifiedContent(false);

    try {
      await customHandleOk();
    } catch (error) {
      message.error("Une erreur s'est produite pendant l'ajout");
    }

    setLoading(false);
    setOpenAdd(false);
  };

  const handleCancel = () => {
    setOpenAdd(false);
  };

  function displayModalContent(content: ContentType | null) {
    if (content !== null) {
      if (isFormation(content)) {
        return (
          <AddFormationDisplay
            content={content}
            setIsModifiedContent={setIsModifiedContent}
            setCustomHandleOk={setCustomHandleOk}
          />
        );
      } else if (isModule(content)) {
        return (
          <AddContentDisplay
            content={content}
            setIsModifiedContent={setIsModifiedContent}
            setCustomHandleOk={setCustomHandleOk}
          />
        );
      } else if (isVideo(content)) {
        // Afficher les données spécifiques à Video
        return <div>Video Content: {content.title_video}</div>;
      } else if (isText(content)) {
        // Afficher les données spécifiques à Text
        return <div>Text Content: {content.title_text}</div>;
      } else if (isPhotoText(content)) {
        // Afficher les données spécifiques à Text
        return <div>Photo Text Content: {content.title_photo_text}</div>;
      } else if (isQuiz(content)) {
        // Afficher les données spécifiques à Quiz
        return <div>Quiz Content: {content.questions.length} questions</div>;
      } else if (isQuestion(content)) {
        // Afficher les données spécifiques à Question
        return <div>Question Content: {content.question_text}</div>;
      } else if (isAnswerOption(content)) {
        // Afficher les données spécifiques à AnswerOption
        return <div>AnswerOption Content: {content.text}</div>;
      } else {
        return <div>Unknown content type</div>;
      }
    }
    return <div>No content available</div>;
  }

  return (
    <>
      <Modal
        className="modal"
        open={openAdd}
        onCancel={handleCancel}
        title={title}
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
        <div>{displayModalContent(content)}</div>
      </Modal>
    </>
  );
}
