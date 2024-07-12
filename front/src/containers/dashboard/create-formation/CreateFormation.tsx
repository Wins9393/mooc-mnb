import { Button, Steps, message } from "antd";
import { CreateFormationForm } from "../../../components/dashboard-components/CreateFormationForm";
import { useEffect, useState } from "react";
import {
  FormationToDB,
  ModuleToDB,
  PhotoTextToDB,
  QuizQuestionsAndAnswersContent,
  TextToDB,
  VideoToDB,
} from "../../../types/types";
import type { UploadFile } from "antd";
import "./create-formation.css";
import "../dashboard.css";
import { CreateModuleForm } from "../../../components/dashboard-components/CreateModuleForm";
import { CreateQuestionAndQuizForm } from "../../../components/dashboard-components/CreateQuestionAndQuizForm";
import { CreateTypeCoursForm } from "../../../components/dashboard-components/CreateTypeCoursForm";

export function CreateFormation() {
  const [current, setCurrent] = useState<number>(0);
  const [newFormation, setNewFormation] = useState<FormationToDB>({
    type: "formation",
    title: "",
    description: undefined,
    cover_path: "",
    published: false,
  });
  const [selectedFile, setSelectedFile] = useState<UploadFile | null>(null);
  const [newModules, setNewModules] = useState<ModuleToDB[]>([]);
  const [newVideos, setNewVideos] = useState<VideoToDB[]>([]);
  const [newTexts, setNewTexts] = useState<TextToDB[]>([]);
  const [newPhotosTexts, setNewPhotosTexts] = useState<PhotoTextToDB[]>([]);
  const [allValuesTypeForm, setAllValuesTypeForm] = useState<{
    [key: string]: (VideoToDB | TextToDB | PhotoTextToDB)[];
  }>({});
  const [quizQuestionsAndAnswers, setQuizQuestionsAndAnswers] =
    useState<QuizQuestionsAndAnswersContent>({});

  useEffect(() => {
    console.log("newPhotosTexts: ", newPhotosTexts);
  }, [newPhotosTexts]);

  useEffect(() => {
    console.log("newVideos: ", newVideos);
  }, [newVideos]);

  const steps = [
    {
      title: "Formation",
      content: (
        <CreateFormationForm
          newFormation={newFormation}
          setNewFormation={setNewFormation}
          setSelectedFile={setSelectedFile}
        />
      ),
    },
    {
      title: "Modules",
      content: <CreateModuleForm newModules={newModules} setNewModules={setNewModules} />,
    },
    {
      title: "Type de Cours",
      content: (
        <CreateTypeCoursForm
          newModules={newModules}
          setNewVideos={setNewVideos}
          setNewTexts={setNewTexts}
          setNewPhotosTexts={setNewPhotosTexts}
          allValuesTypeForm={allValuesTypeForm}
          setAllValuesTypeForm={setAllValuesTypeForm}
        />
      ),
    },
    {
      title: "Questions & Réponses",
      content: (
        <CreateQuestionAndQuizForm
          newModules={newModules}
          quizQuestionsAndAnswers={quizQuestionsAndAnswers}
          setQuizQuestionsAndAnswers={setQuizQuestionsAndAnswers}
        />
      ),
    },
  ];

  async function handleValidateStep(
    formation: FormationToDB,
    selectedFile: UploadFile,
    modules: ModuleToDB[],
    videos: VideoToDB[],
    texts: TextToDB[],
    photosTexts: PhotoTextToDB[],
    quizQuestionsAndAnswers: QuizQuestionsAndAnswersContent
  ) {
    try {
      const modulesKeys = Object.keys(quizQuestionsAndAnswers);

      if (!formation || !formation.title) {
        message.error("La formation n'existe pas !");
        return;
      }
      if (!selectedFile) {
        message.error("Le fichier n'existe pas !");
        return;
      }
      modules.forEach((module) => {
        if (!module.title) {
          message.error("Des informations sont manquantes sur un ou plusieurs modules !");
          return;
        }
      });
      modulesKeys.forEach((key) => {
        quizQuestionsAndAnswers[key].map((quiz) => {
          if (!quiz.quiz_title) {
            throw new Error("Le titre d'un ou plusieurs quiz n'est pas renseigné !");
          }
          if (quiz.questions.length < 1) {
            throw new Error("Un ou plusieurs quiz ne comporte pas de questions !");
          }
          quiz.questions.forEach((question) => {
            if (question === undefined) {
              throw new Error("Une ou plusieurs questions n'ont pas été correctement rempli !");
            }
            if (!question.question_text) {
              throw new Error("L'intitulé d'une ou plusieurs questions est manquant !");
            }
            if (question.is_multiple_choice === null || question.is_multiple_choice === undefined) {
              throw new Error(
                "L'option 'choix multiple' d'une ou plusieurs questions est manquant !"
              );
            }
            if (!question.answer_options) {
              throw new Error("Les réponses d'une ou plusieurs questions sont manquantes !");
            }
            if (question.answer_options.length < 2) {
              throw new Error("Une ou plusieurs questions comporte moins de deux réponses !");
            }
            question.answer_options.forEach((ao) => {
              if (ao === undefined) {
                throw new Error("Une ou plusieurs réponses n'ont pas été correctement rempli !");
              }
              if (!ao.answer_text) {
                throw new Error("L'intitulé d'une ou plusieurs réponses est manquant !");
              }
              if (ao.correct === null || ao.correct === undefined) {
                throw new Error("La bonne réponse pour une ou plusieurs réponses est manquante !");
              }
            });
            if (!question.answer_options.some((ao) => ao.correct === true)) {
              throw new Error("Une ou plusieurs questions ne contient pas de bonne réponse !");
            }
          });
        });
      });

      const formData = new FormData();
      formData.append("formation", JSON.stringify(formation));
      if (selectedFile instanceof File) {
        formData.append("selectedFile", selectedFile, selectedFile.name);
      } else {
        throw new Error("Le fichier sélectionné n'est pas valide");
      }
      formData.append("modules", JSON.stringify(modules));

      videos.map((video, index) => {
        if (video.video && video.video.length > 0 && video.video[0].originFileObj instanceof File) {
          formData.append(
            `videoFile${index}`,
            video.video[0].originFileObj,
            video.video[0].originFileObj.name
          );
        }
      });

      formData.append("videos", JSON.stringify(videos));

      photosTexts.map((photo, index) => {
        if (photo.photo && photo.photo.length > 0 && photo.photo[0].originFileObj instanceof File) {
          formData.append(
            `photoFile${index}`,
            photo.photo[0].originFileObj,
            photo.photo[0].originFileObj.name
          );
        }
      });

      formData.append("photosTexts", JSON.stringify(photosTexts));
      formData.append("texts", JSON.stringify(texts));
      formData.append("quizQuestionsAndAnswers", JSON.stringify(quizQuestionsAndAnswers));

      const completeFormationResults = await fetch(
        `${import.meta.env.VITE_API_URL}/complete-formation/create`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      setNewFormation({
        type: "formation",
        title: "",
        description: undefined,
        cover_path: "",
        published: false,
      });
      setNewModules([]);
      setSelectedFile(null);
      setAllValuesTypeForm({});
      setNewVideos([]);
      setNewTexts([]);
      setNewPhotosTexts([]);
      setQuizQuestionsAndAnswers({});
      setCurrent(0);
      console.log("completeFormationResult: ", completeFormationResults);
      if (completeFormationResults.ok) {
        message.success("Nouvelle formation créée avec succès !");
      } else {
        message.error(`${completeFormationResults.statusText}`);
      }
    } catch (error) {
      message.error(`${error}`);
      console.log("Erreur création formation: ", error);
      return;
    }
  }

  const next = () => {
    if (current === 0) {
      if (newFormation.title && selectedFile) setCurrent(current + 1);
      else message.error("Des informations sont manquantes !");
    } else if (current === 1) {
      if (newModules.length && newModules[0].title) setCurrent(current + 1);
      else message.error("Des informations sont manquantes !");
    } else if (current === 2) {
      const modulesKeys = Object.keys(allValuesTypeForm);

      const isAllModuleFilled = modulesKeys.some((key) => {
        const contents = allValuesTypeForm[key];

        return contents.some((content) => {
          if (content?.type === "video") {
            return content.title && content.video.length !== 0;
          } else if (content?.type === "text") {
            return content.title && content.content;
          } else if (content?.type === "photo_text") {
            console.log("content: ", content);
            return content.title && content.text_content && content.photo.length !== 0;
          }
          return false;
        });
      });
      console.log("isAllModuleFilled", isAllModuleFilled);

      if (
        isAllModuleFilled &&
        newVideos.length + newTexts.length + newPhotosTexts.length >= newModules.length
      )
        setCurrent(current + 1);
      else message.error("Il faut au moins un contenu par module !");
    }
  };

  const prev = () => {
    if (current === 2) {
      setCurrent(current - 1);
    } else {
      setCurrent(current - 1);
    }
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  return (
    <div className="createFormationPage__main-container">
      <Steps current={current} items={items} />
      <div className="createFormationPage__main-content">{steps[current].content}</div>
      <div style={{ marginTop: 24, textAlign: "center" }}>
        {current > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            Retour
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Valider
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={() =>
              selectedFile
                ? handleValidateStep(
                    newFormation,
                    selectedFile,
                    newModules,
                    newVideos,
                    newTexts,
                    newPhotosTexts,
                    quizQuestionsAndAnswers
                  )
                : ""
            }>
            Terminer
          </Button>
        )}
      </div>
    </div>
  );
}
