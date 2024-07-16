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

export interface ModalProps {
  openSupp: boolean;
  setOpenSupp: Dispatch<SetStateAction<boolean>>;
  content: ContentType | null;
  setIsModifiedContent: Dispatch<SetStateAction<boolean>>;
  getContentByModule: (id_module: number) => Promise<ContentByModule | null>;
  setContentByModule: Dispatch<SetStateAction<ContentByModule | null>>;
  getQuizByModule: (id_module: number) => Promise<Quiz | null>;
  setQuizByModule: Dispatch<SetStateAction<Quiz | null>>;
}

export function ModalSupp({
  openSupp,
  setOpenSupp,
  content,
  setIsModifiedContent,
  getContentByModule,
  setContentByModule,
  getQuizByModule,
  setQuizByModule,
}: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<string | null>(null);

  useEffect(() => {
    if (content !== null) {
      if (isFormation(content)) {
        setType("formation");
      } else if (isModule(content)) {
        setType("module");
      } else if (isVideo(content)) {
        setType("vidéo");
      } else if (isText(content)) {
        setType("texte");
      } else if (isPhotoText(content)) {
        setType("photo + texte");
      } else if (isQuiz(content)) {
        setType("quiz");
      } else if (isQuestion(content)) {
        setType("question");
      } else if (isAnswerOption(content)) {
        setType("réponse");
      }
    }
  }, [content]);

  const handleOk = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      setLoading(true);
      setIsModifiedContent(false);

      if (content !== null) {
        if (isFormation(content)) {
          await fetch(`${import.meta.env.VITE_API_URL}/formation/${content.id}/delete`, {
            method: "POST",
            credentials: "include",
          });
        } else if (isModule(content)) {
          await fetch(`${import.meta.env.VITE_API_URL}/module/${content.id}/delete`, {
            method: "POST",
            credentials: "include",
          });
        } else if (isVideo(content)) {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/video/${content.id_video}/delete`,
            {
              method: "POST",
              credentials: "include",
            }
          );

          if (response.ok) {
            setContentByModule(await getContentByModule(content.id_video));
          }
        } else if (isText(content)) {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/text/${content.id_text}/delete`,
            {
              method: "POST",
              credentials: "include",
            }
          );

          if (response.ok) {
            setContentByModule(await getContentByModule(content.id_text));
          }
        } else if (isPhotoText(content)) {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/photo_text/${content.id_photo_text}/delete`,
            {
              method: "POST",
              credentials: "include",
            }
          );

          if (response.ok) {
            setContentByModule(await getContentByModule(content.id_photo_text));
          }
        } else if (isQuiz(content)) {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/quiz/${content.id}/delete`,
            {
              method: "POST",
              credentials: "include",
            }
          );

          if (response.ok) {
            setQuizByModule(await getQuizByModule(content.id));
          }
        } else if (isQuestion(content)) {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/question/${content.id}/delete`,
            {
              method: "POST",
              credentials: "include",
            }
          );

          if (response.ok) {
            setQuizByModule(await getQuizByModule(content.id));
          }
        } else if (isAnswerOption(content)) {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/answer_option/${content.id}/delete`,
            {
              method: "POST",
              credentials: "include",
            }
          );

          if (response.ok) {
            setQuizByModule(await getQuizByModule(content.id));
          }
        }
        message.success(`${type} supprimée !`);
        setIsModifiedContent(true);
      }
    } catch (error) {
      message.error("Une erreur s'est produite pendant la modification");
    }
    setLoading(false);
    setOpenSupp(false);
  };

  const handleCancel = () => {
    setOpenSupp(false);
  };

  return (
    <>
      <Modal
        className="modal"
        open={openSupp}
        onCancel={handleCancel}
        title={`Supprimer ${type} ?`}
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
        <div>Etes-vous sûr ?</div>
      </Modal>
    </>
  );
}
