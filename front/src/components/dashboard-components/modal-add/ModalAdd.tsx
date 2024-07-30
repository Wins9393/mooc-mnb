import { Button, message, Modal } from "antd";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ContentByModule, ContentType, Quiz } from "../../../types/types";
import { isFormation, isModule, isQuestion, isQuiz } from "../../../typesGuards/typesGuard";
import { AddModuleDisplay } from "./AddModuleDisplay";
import { AddContentDisplay } from "./AddContentDisplay";
import { AddQuestionDisplay } from "./AddQuestionDisplay";
import { AddAnswerOptionDisplay } from "./AddAnswerOptionDisplay";

export interface ModalProps {
  currentModuleId: number | null;
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
  currentModuleId,
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

  const handleOk = async () => {
    setLoading(true);
    setIsModifiedContent(false);

    try {
      await customHandleOk();
    } catch (error) {
      message.error("Une erreur s'est produite pendant l'ajout");
    }
    // Gérer les erreurs avant de fermer la modal
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
          <AddModuleDisplay
            content={content}
            setIsModifiedContent={setIsModifiedContent}
            setCustomHandleOk={setCustomHandleOk}
          />
        );
      } else if (isModule(content)) {
        return (
          <AddContentDisplay
            content={content}
            getContentByModule={getContentByModule}
            setContentByModule={setContentByModule}
            getQuizByModule={getQuizByModule}
            setQuizByModule={setQuizByModule}
            setCustomHandleOk={setCustomHandleOk}
          />
        );
      } else if (isQuiz(content)) {
        return (
          <AddQuestionDisplay
            currentModuleId={currentModuleId}
            content={content}
            getQuizByModule={getQuizByModule}
            setQuizByModule={setQuizByModule}
            setCustomHandleOk={setCustomHandleOk}
          />
        );
      } else if (isQuestion(content)) {
        return (
          <AddAnswerOptionDisplay
            currentModuleId={currentModuleId}
            content={content}
            getQuizByModule={getQuizByModule}
            setQuizByModule={setQuizByModule}
            setCustomHandleOk={setCustomHandleOk}
          />
        );
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
