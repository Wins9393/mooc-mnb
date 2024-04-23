import { Button, Steps, message } from "antd";
import { CreateFormationForm } from "../../components/dashboard-components/CreateFormationForm";
import { useEffect, useState } from "react";
import {
  FormationToDB,
  ModuleToDB,
  // Question,
  QuizQuestionsAndAnswersContent,
  // QuizToDB,
  TextToDB,
  VideoToDB,
} from "../../types/types";
import type { GetProp, UploadFile, UploadProps } from "antd";
import "./dashboard.css";
import { CreateModuleForm } from "../../components/dashboard-components/CreateModuleForm";
import { CreateQuestionAndQuizForm } from "../../components/dashboard-components/CreateQuestionAndQuizForm";
import { CreateTypeCoursForm2 } from "../../components/dashboard-components/CreateTypeCoursForm2";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
type ContentType = "formation" | "module" | "video" | "text" | "quiz" | "question" | "answeroption"; // Ajoutez d'autres types au besoin

interface Content {
  type: ContentType;
}

const apiUrlMap: { [key in ContentType]: string } = {
  formation: `${import.meta.env.VITE_API_URL}/formations/create`,
  module: `${import.meta.env.VITE_API_URL}/module/create`,
  video: `${import.meta.env.VITE_API_URL}/video/create`,
  text: `${import.meta.env.VITE_API_URL}/text/create`,
  quiz: `${import.meta.env.VITE_API_URL}/quiz/create`,
  question: `${import.meta.env.VITE_API_URL}/question/create`,
  answeroption: `${import.meta.env.VITE_API_URL}/answersoptions/create`,
  // Ajoutez d'autres mappings ici selon le besoin
};

export function Dashboard() {
  const [current, setCurrent] = useState<number>(0);
  // States utilisés dans le composant CreateFormationForm
  const [newFormation, setNewFormation] = useState<FormationToDB>({
    type: "formation",
    title: "",
    description: undefined,
    cover_path: "",
  });
  const [selectedFile, setSelectedFile] = useState<UploadFile | null>(null);
  // States utilisés dans le composant CreateModuleForm
  const [newModules, setNewModules] = useState<ModuleToDB[]>([]);
  const [newVideos, setNewVideos] = useState<VideoToDB[]>([]);
  const [newTexts, setNewTexts] = useState<TextToDB[]>([]);
  const [allValuesTypeForm, setAllValuesTypeForm] = useState<{
    [key: string]: (VideoToDB | TextToDB)[];
  }>({});
  // const [newQuiz, setNewQuiz] = useState<QuizToDB>({
  //   type: "quiz",
  //   id_module: null,
  //   title: "",
  // });
  // const [newQuestions, setNewQuestions] = useState<Question[]>([]);
  const [quizQuestionsAndAnswers, setQuizQuestionsAndAnswers] =
    useState<QuizQuestionsAndAnswersContent>({});

  // Debugg
  useEffect(() => {
    console.log("newFormation: ", newFormation);
  }, [newFormation]);

  useEffect(() => {
    console.log("selectedFile: ", selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    console.log("newModules: ", newModules);
  }, [newModules]);

  useEffect(() => {
    console.log("newVideos: ", newVideos);
  }, [newVideos]);

  useEffect(() => {
    console.log("newTexts: ", newTexts);
  }, [newTexts]);

  useEffect(() => {
    console.log("allValuesTypeForm: ", allValuesTypeForm);
  }, [allValuesTypeForm]);

  useEffect(() => {
    console.log("quizQuestionsAndAnswers: ", quizQuestionsAndAnswers);
  }, [quizQuestionsAndAnswers]);

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
        <CreateTypeCoursForm2
          newModules={newModules}
          setNewVideos={setNewVideos}
          setNewTexts={setNewTexts}
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
          // newQuiz={newQuiz}
          // setNewQuiz={setNewQuiz}
          // newQuestions={newQuestions}
          // setNewQuestions={setNewQuestions}
        />
      ),
    },
  ];

  async function uploadFile(file: UploadFile) {
    const formData = new FormData();
    formData.append("file", file as FileType);

    console.log("formData: ", formData);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload/file`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Échec de l'envoi du fichier");
      }

      // Traiter la réponse du serveur ici
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error(error);
    }
  }

  async function sendContentToAPI(content: Content | Content[]): Promise<number[] | undefined> {
    const sendRequest = async (cont: Content) => {
      const apiUrl = apiUrlMap[cont.type];
      if (!apiUrl) {
        console.error("Type de contenu non pris en charge");
        return;
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cont),
      });

      if (!response.ok) {
        throw new Error(`Failed to send content to API for type ${cont.type}`);
      }

      console.log("response send content: ", response);

      return response.json();
    };

    if (Array.isArray(content)) {
      // Envoi de chaque élément du tableau séparément et attente de tous les résultats
      const promises = content.map((cont) => sendRequest(cont));
      return Promise.all(promises);
    } else {
      // Envoi d'un seul élément
      return sendRequest(content).then((id) => [id]);
    }
  }

  async function handleValidateStep(
    formation: FormationToDB,
    selectedFile: UploadFile,
    modules: ModuleToDB[],
    videos: VideoToDB[],
    texts: TextToDB[],
    quizQuestionsAndAnswers: QuizQuestionsAndAnswersContent
  ) {
    try {
      // mettre des blocs if negatifs ex: si pas de formation => return etc...
      // Boucler sur chaque tableau et return si pas de données required
      if (
        formation.title &&
        selectedFile &&
        modules[0].title &&
        quizQuestionsAndAnswers["module-0"].length > 0 &&
        quizQuestionsAndAnswers["module-0"][0].questions.length > 0 &&
        quizQuestionsAndAnswers["module-0"][0].questions[0].answer_options.length > 0
      ) {
        const idFormationTab = await sendContentToAPI(formation);
        if (idFormationTab) {
          const idFormation = idFormationTab[0];
          uploadFile(selectedFile);
          console.log("formation: ", formation);
          console.log("idFormation: ", idFormation);

          const moduleWithFormationId = modules.map((module) => ({
            ...module,
            id_formation: idFormation,
          }));
          const idModuleTmp = await sendContentToAPI(moduleWithFormationId);
          console.log("idModuleTmp: ", idModuleTmp);
          console.log("moduleWithFormationId: ", moduleWithFormationId);
          console.log("videos: ", videos);
          console.log("texts: ", texts);
          console.log("quizQuestionsAndAnswers: ", quizQuestionsAndAnswers);
          console.log("selectedFile: ", selectedFile);

          if (idModuleTmp) {
            const videosWithModuleId = videos.map((video) => {
              const moduleIndex = video.key ? parseInt(video.key?.split("-")[1]) : -1;
              if (idModuleTmp && moduleIndex !== -1) {
                video.video[0].originFileObj ? uploadFile(video.video[0].originFileObj) : "";
                return {
                  type: video.type,
                  id_module: idModuleTmp[moduleIndex],
                  title: video.title,
                  description: video.description,
                  path: video.path,
                };
              } else {
                throw new Error("Une erreur est survenue ! VIDEO");
              }
            });

            const textsWithModuleId = texts.map((text) => {
              const moduleIndex = text.key ? parseInt(text.key?.split("-")[1]) : -1;
              if (idModuleTmp && moduleIndex !== -1) {
                return {
                  type: text.type,
                  id_module: idModuleTmp[moduleIndex],
                  title: text.title,
                  content: text.content,
                };
              } else {
                throw new Error("Une erreur est survenue ! TEXT");
              }
            });

            console.log("videosWithModuleId: ", videosWithModuleId);
            console.log("textsWithModuleId: ", textsWithModuleId);
            if (videosWithModuleId.length > 0) await sendContentToAPI(videosWithModuleId);
            if (textsWithModuleId.length > 0) await sendContentToAPI(textsWithModuleId);
          } else {
            console.log("pas de module id");
          }

          const quizzesKeys = Object.keys(quizQuestionsAndAnswers);

          quizzesKeys.map(async (key) => {
            const moduleIndex = parseInt(key?.split("-")[1]);
            if (idModuleTmp) {
              const quiz = {
                type: quizQuestionsAndAnswers[key][0].type,
                id_module: idModuleTmp[moduleIndex],
                title: quizQuestionsAndAnswers[key][0].quiz_title,
              };
              const idQuiz = await sendContentToAPI(quiz);
              console.log("idQuiz: ", idQuiz);

              quizQuestionsAndAnswers[key][0].questions.map(async (q) => {
                if (idQuiz) {
                  const question = {
                    type: q.type,
                    id_quiz: idQuiz[0],
                    is_multiple_choice: q.is_multiple_choice,
                    question_text: q.question_text,
                    explanation: q.explanation,
                  };
                  const idQuestions = await sendContentToAPI(question);
                  console.log("idQuestions: ", idQuestions);

                  q.answer_options.map(async (ao) => {
                    if (idQuestions) {
                      const answer_option = {
                        type: ao.type,
                        id_question: idQuestions[0],
                        answer_text: ao.answer_text,
                        correct: ao.correct,
                      };

                      const idAnswerOptions = sendContentToAPI(answer_option);
                      console.log("idAnswerOptions: ", idAnswerOptions);
                    }
                  });
                }
              });
            }
          });

          // stand by
          // const quizzesWithModulesId = quizzesKeys.map((key) => {
          //   const moduleIndex = parseInt(key?.split("-")[1]);
          //   if (idModuleTmp && moduleIndex !== -1) {
          //     return {
          //       type: quizQuestionsAndAnswers[key][0].type,
          //       id_module: idModuleTmp[moduleIndex],
          //       title: quizQuestionsAndAnswers[key][0].quiz_title,
          //     };
          //   } else {
          //     throw new Error("Une erreur est survenue ! QUIZ");
          //   }
          // });

          // console.log("quizzes: ", quizzesWithModulesId);

          // if (quizzesWithModulesId.length > 0) {
          //   const idQuizzes = await sendContentToAPI(quizzesWithModulesId);
          //   console.log("idQuizzes: ", idQuizzes);

          //   const questionsWithQuizId = quizzesKeys.flatMap((key) => {
          //     const moduleIndex = parseInt(key?.split("-")[1]);
          //     if (idModuleTmp && moduleIndex !== -1) {
          //       return quizQuestionsAndAnswers[key][0].questions.map((question) => {
          //         if (idQuizzes) {
          //           return {
          //             type: question.type,
          //             id_quiz: idQuizzes[moduleIndex],
          //             is_multiple_choice: question.is_multiple_choice,
          //             question_text: question.question_text,
          //             explanation: question.explanation,
          //           };
          //         } else {
          //           throw new Error("Une erreur est survenue ! QUESTIONS");
          //         }
          //       });
          //     } else {
          //       throw new Error("Une erreur est survenue !");
          //     }
          //   });

          //   console.log("questionsWithQuizId: ", questionsWithQuizId);
          //   const idQuestions = await sendContentToAPI(questionsWithQuizId);

          //   console.log("idQuestions: ", idQuestions);

          //   if (idQuestions) {
          //     const answersWithQuestionId = quizzesKeys.flatMap((key) => {
          //       return quizQuestionsAndAnswers[key][0].questions.flatMap((question) => {
          //         return question.answer_options.flatMap((ao) => {
          //           return {
          // type: ao.type,
          // id_question: ao.key,
          // answer_text: ao.answer_text,
          // correct: ao.correct,
          //           };
          //         });
          //       });
          //     });
          //     console.log("answersWithQuestionId: ", answersWithQuestionId);
          //   }
          // }
          // stand by

          // rajouter les étapes avant reset

          // setNewFormation({
          //   type: "formation",
          //   title: "",
          //   description: undefined,
          //   cover_path: "",
          // });
          // setNewModules([]);
          // setSelectedFile(null);
          // setAllValuesTypeForm({});
          // setNewVideos([]);
          // setNewTexts([]);
          // setQuizQuestionsAndAnswers({});
          // setCurrent(0);
          message.success("Nouvelle formation créée avec succès !");
        }
      }
    } catch (error) {
      message.error(`Erreur lors de la création de la formation: ${error}`);
      console.log("Erreur création formation: ", error);
    }
  }

  const next = () => {
    console.log(
      "current: ",
      current,
      "newFormation: ",
      newFormation,
      "selectedFile",
      selectedFile,
      "newModule: ",
      newModules
    );
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
        console.log("contents: ", contents);
        return contents.some((content) => {
          if (content?.type === "video") {
            return content.title && content.video.length !== 0;
          } else if (content?.type === "text") {
            return content.title && content.content;
          }
          return false;
        });
      });
      console.log("isAllModuleFilled: ", isAllModuleFilled);

      if (isAllModuleFilled && newVideos.length + newTexts.length >= newModules.length)
        setCurrent(current + 1);
      else message.error("Il faut au moins un contenu par module !");
    }
  };

  const prev = () => {
    console.log("current: ", current);
    if (current === 2) {
      // setNewVideos([]);
      // setNewTexts([]);
      setCurrent(current - 1);
    } else {
      setCurrent(current - 1);
    }
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  return (
    <div className="dashboardPage__main-container">
      <Steps current={current} items={items} />
      <div className="dashboardPage__main-content">{steps[current].content}</div>
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
