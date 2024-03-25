import { ChangeEvent, useContext, useEffect, useState } from "react";
import { MainContext } from "../../contexts/MainContext";
import { useParams } from "react-router-dom";
import {
  Formation,
  IsCorrectAnswer,
  Module,
  ModuleCollapseItem,
  Quiz,
  UserAnswer,
  Video,
  Text,
} from "../../types/types";
import { Col, Row, Collapse, CollapseProps, Divider, Button } from "antd";
import {
  CloseCircleTwoTone,
  CheckCircleTwoTone,
  PlayCircleOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import "./formation-page.css";
import { AuthContext } from "../../contexts/AuthContext";

export function FormationPage() {
  let { id_formation } = useParams();

  const mainContext = useContext(MainContext);
  if (!mainContext) return;
  const {
    formations,
    getContentByModule,
    moduleContent,
    getQuizByModule,
    moduleQuiz,
    getCorrectAnswer,
    saveUserStats,
    getUserAnswerByQuizId,
    resetQuizById,
  } = mainContext;

  const authContext = useContext(AuthContext);
  if (!authContext) return;
  const { user } = authContext;

  const [currentFormation, setCurrentFormation] = useState<Formation | null>(null);
  const [modules, setModules] = useState<Module[] | null>(null);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [currentModuleItem, setCurrentModuleItem] = useState<ModuleCollapseItem | null>(null);

  const [selectedUserAnswers, setSelectedUserAnswers] = useState<UserAnswer[] | null>(null);
  const [oldUserAnswers, setOldUserAnswers] = useState<UserAnswer[] | undefined>(undefined);
  const [correctAnswers, setCorrectAnswers] = useState<IsCorrectAnswer[] | undefined>(undefined);
  const [isQuizAnswered, setIsQuizAnswered] = useState<boolean>(false);
  const [scoreByQuiz, setScoreByQuiz] = useState<number>(0);

  const [fadeClass, setFadeClass] = useState("content--fade-in");

  // Debug
  // useEffect(() => {
  //   console.log("currentFormation: ", currentFormation);
  // }, [currentFormation]);

  // useEffect(() => {
  //   console.log("moduleContent: ", moduleContent);
  // }, [moduleContent]);

  useEffect(() => {
    console.log("currentModuleItem: ", currentModuleItem);
  }, [currentModuleItem]);

  // useEffect(() => {
  //   console.log("correctAnswers: ", correctAnswers);
  // }, [correctAnswers]);

  // useEffect(() => {
  //   console.log("selectedUserAnswers: ", selectedUserAnswers);
  // }, [selectedUserAnswers]);

  useEffect(() => {
    console.log("oldUserAnswers: ", oldUserAnswers);
  }, [oldUserAnswers]);
  // Fin Debug

  useEffect(() => {
    // console.log("isQuizAnswered: ", isQuizAnswered);
    if (oldUserAnswers) {
      getCorrectAnswersTab(oldUserAnswers);
    }
  }, [isQuizAnswered, currentModuleItem]);

  useEffect(() => {
    getScoreByQuiz(correctAnswers);
  }, [correctAnswers]);

  useEffect(() => {
    if (currentModuleItem) {
      const quizAnswered = oldUserAnswers?.some(
        (oldAnswer) => oldAnswer.id_quiz === (currentModuleItem?.item as Quiz).id
      );
      if (quizAnswered === true) setIsQuizAnswered(true);
      else setIsQuizAnswered(false);
    }
  }, [oldUserAnswers, currentModuleItem]);

  useEffect(() => {
    if (id_formation) {
      getCurrentFormation(id_formation);
      getModulesByFormationId(id_formation);
    }
  }, [id_formation]);

  useEffect(() => {
    setSelectedUserAnswers([]);
    setCorrectAnswers([]);
  }, [currentModuleItem]);

  function getCurrentFormation(id_formation: string) {
    const id_formation_number = Number(id_formation);
    const formation: Formation | undefined = formations.find(
      (formation) => formation.id === id_formation_number
    );
    if (formation) setCurrentFormation(formation);
  }

  function getModulesByFormationId(id_formation: string) {
    const modules: Module[] | null =
      formations.find((f) => f.id === Number(id_formation))?.modules ?? null;
    // console.log("modules: ", modules);
    setModules(modules);
  }

  function onItemModuleClick(moduleItem: ModuleCollapseItem) {
    // console.log("MODULE ITEM:", moduleItem);

    if (moduleItem.id !== currentModuleItem?.id) {
      setFadeClass("content--fade-out");

      setTimeout(() => {
        setCurrentModuleItem(moduleItem);
        setFadeClass("content--fade-in");
      }, 500);
    }

    if (moduleItem && moduleItem.type === "quiz" && user) {
      getOldUserAnswers(user.id, (moduleItem.item as Quiz).id);
    }
    window.scrollTo(0, 0);
  }

  async function getOldUserAnswers(id_user: number, id_quiz: number) {
    const oldUserAnswers = await getUserAnswerByQuizId(id_user, id_quiz);
    setOldUserAnswers(oldUserAnswers);
  }

  function onUserAnswerChange(
    e: ChangeEvent<HTMLInputElement>,
    id_question: number,
    id_answer: number,
    id_quiz: number
  ) {
    const inputsAnswersOptions = document.querySelectorAll<HTMLInputElement>(
      `input[name='answer_option-question-${id_question}']`
    );
    // Si une seule réponse possible => enlever le check des autres inputs
    // if(question.multiple_choice === false){
    inputsAnswersOptions.forEach((inputAO) => {
      const input = inputAO as HTMLInputElement;
      if (input !== e.target) {
        input.checked = false;
      }
    });

    setSelectedUserAnswers((prevAnswers) => {
      const updatedAnswers = prevAnswers ? [...prevAnswers] : [];

      const existingAnswerIndex = updatedAnswers.findIndex(
        (answer) => answer.id_question === id_question
      );

      if (user) {
        const newAnswer = {
          id_user: user?.id,
          id_question,
          id_answer_option: id_answer,
          id_quiz,
          date_answer: new Date().toISOString(),
        };

        if (existingAnswerIndex > -1) {
          updatedAnswers[existingAnswerIndex] = newAnswer;
        } else {
          updatedAnswers.push(newAnswer);
        }
      }

      return updatedAnswers;
    });
    // }else{
    // Permettre plusieurs choix de réponse
    // }
  }

  async function getScoreByQuiz(correctAnswersTab: IsCorrectAnswer[] | undefined) {
    const questionsNumber = correctAnswersTab?.length;
    let goodAnswers = 0;

    correctAnswersTab?.forEach((answer) => {
      if (answer.isCorrectAnswerSelected) goodAnswers++;
    });

    if (questionsNumber) {
      const average = (goodAnswers / questionsNumber) * 100;
      setScoreByQuiz(average);
    }
  }

  async function getCorrectAnswersTab(answersTab: UserAnswer[]) {
    if (answersTab) {
      const promises = answersTab.map((userAnswer) => {
        return getCorrectAnswer(userAnswer.id_question, userAnswer.id_answer_option);
      });

      const promisesResolved = await Promise.all(promises);
      setCorrectAnswers(promisesResolved);
    }
  }

  async function onValidateQuiz(userAnswers: UserAnswer[], quizItem: Quiz) {
    if (userAnswers.length < quizItem.questions.length) {
      console.log("Veuillez choisir une réponse pour chaque question !");
      return;
    }

    const promises = userAnswers.map((userAnswer) => {
      return getCorrectAnswer(userAnswer.id_question, userAnswer.id_answer_option);
    });

    const promisesResolved = await Promise.all(promises);
    setCorrectAnswers(promisesResolved);

    userAnswers.forEach((answer) => {
      saveUserStats(answer);
    });

    if (user) getOldUserAnswers(user?.id, quizItem.id);
    window.scrollTo(0, 0);
  }

  async function handleResetQuiz(user_id: number, quiz_id: number) {
    if (user_id && quiz_id) {
      await resetQuizById(user_id, quiz_id);
      await getOldUserAnswers(user_id, quiz_id);
    }
  }

  // Boucle sur les modules présents dans la formation pour remplir le tableau d'Items pour le Collapse
  function getCollapseItems(modules: Module[]) {
    let items: CollapseProps["items"] = [];

    if (!modules) {
      return;
    }

    modules.forEach((module) => {
      const combinedContent = [
        ...(moduleContent?.videos?.map((video) => ({
          type: "video",
          id: `video-${video.id_video}`,
          title: video.title_video,
          item: video,
        })) || []),
        ...(moduleContent?.texts?.map((text) => ({
          type: "text",
          id: `text-${text.id_text}`,
          title: text.title_text,
          item: text,
        })) || []),
        moduleQuiz
          ? { type: "quiz", id: `quiz-${moduleQuiz.id}`, title: moduleQuiz.title, item: moduleQuiz }
          : { type: "quiz", id: "", title: "", item: null },
      ];

      const contentItems = combinedContent.map((content) => (
        <p
          key={content.id}
          onClick={() => onItemModuleClick(content)}
          className="formationPage__collapse-item"
          style={{ display: "flex", justifyContent: "space-between" }}>
          {content.title}
          {content.type === "video" && <PlayCircleOutlined />}
          {content.type === "text" && <FileTextOutlined />}
          {content.type === "quiz" && <QuestionCircleOutlined />}
        </p>
      ));

      items?.push({
        key: module.id,
        label: module.title,
        children: contentItems,
        onClick: () => {
          if (currentModule?.id !== module.id) {
            setCurrentModule(module);
            getContentByModule(module.id);
            getQuizByModule(module.id);
          }
        },
      });
    });

    return items;
  }

  function displayQuizResult(dateString: string, id_quiz: number) {
    const dateValidation = new Date(dateString);
    return (
      (
        <div>
          <div
            className={`formationPage__quiz-valide--container ${
              scoreByQuiz < 70 ? "quiz-echec" : "quiz-reussi"
            }`}>
            <p>{`Quiz soumis le ${dateValidation.getDate()}/${(dateValidation.getMonth() + 1)
              .toString()
              .padStart(
                2,
                "0"
              )}/${dateValidation.getFullYear()} à ${dateValidation.getHours()}H${dateValidation.getMinutes()}`}</p>
            {scoreByQuiz < 70 ? (
              <p>
                <span style={{ fontWeight: "bold" }}>Echec </span>
                avec un score de: <span style={{ fontWeight: "bold" }}>{scoreByQuiz}%</span>
              </p>
            ) : (
              <p>
                <span style={{ fontWeight: "bold" }}>Réussite </span>
                avec un score de: <span style={{ fontWeight: "bold" }}>{scoreByQuiz}%</span>
              </p>
            )}
          </div>
          {scoreByQuiz < 70 ? (
            <Button
              style={{ marginTop: "8px" }}
              onClick={() => (user ? handleResetQuiz(user?.id, id_quiz) : "")}>
              Rééssayer
            </Button>
          ) : (
            ""
          )}
        </div>
      ) || undefined
    );
  }

  function renderModuleItem(item: Video | Text | Quiz | null, itemType: string) {
    if (!item) {
      return null;
    }

    switch (itemType) {
      case "video":
        const videoItem = item as Video;
        return (
          <video
            controls
            className={`formationPage__video ${fadeClass}`}
            src={`${import.meta.env.VITE_API_URL}/public/video-${videoItem.path_video}`}></video>
        );
      case "text":
        const textItem = item as Text;
        return <p className={`${fadeClass}`}>{textItem.content_text}</p>;
      case "quiz":
        const quizItem = item as Quiz;

        return (
          <div className={`formationPage__quiz-wrapper ${fadeClass}`}>
            {isQuizAnswered && oldUserAnswers && oldUserAnswers.length > 0
              ? displayQuizResult(oldUserAnswers?.[0].date_answer, quizItem.id)
              : ""}
            {quizItem?.questions.map((question) => {
              const userAnswer = oldUserAnswers?.find((a) => a.id_question === question.id);
              return (
                <div
                  key={`question-${question.id}`}
                  className="formationPage__questions-answers-bloc">
                  <div className="formationPage__question-bloc">
                    <h3>{question.text}</h3>
                  </div>
                  <Divider style={{ margin: "16px" }} />
                  <div>
                    {question.answer_options.map((answer) => (
                      <div style={{ display: "flex" }} key={`answer-${answer.id}`}>
                        {correctAnswers?.map((item) =>
                          item.idAnswerOptionSelected === answer.id ? (
                            item.isCorrectAnswerSelected ? (
                              <CheckCircleTwoTone
                                key={`answer-${answer.id}`}
                                twoToneColor="#52c41a"
                              />
                            ) : (
                              <CloseCircleTwoTone
                                key={`answer-${answer.id}`}
                                twoToneColor="#A30015"
                              />
                            )
                          ) : (
                            ""
                          )
                        )}
                        <div className="formationPage__answer-bloc" key={answer.id}>
                          <p>{answer.text}</p>{" "}
                          {isQuizAnswered ? (
                            <input
                              checked={userAnswer?.id_answer_option === answer.id}
                              disabled={true}
                              name={`answer_option-question-${question.id}`}
                              type="checkbox"
                            />
                          ) : (
                            <input
                              disabled={false}
                              name={`answer_option-question-${question.id}`}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                onUserAnswerChange(e, question.id, answer.id, quizItem.id)
                              }
                              type="checkbox"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {isQuizAnswered ? (
              ""
            ) : (
              <Button onClick={() => onValidateQuiz(selectedUserAnswers as UserAnswer[], quizItem)}>
                Valider
              </Button>
            )}
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div className="formationPage__main-container">
      <Row className="formationPage__wrapper" gutter={[16, 32]}>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={6}
          xl={6}
          className="formationPage__questions-collapse-container">
          <div className="formationPage__title">
            <h2 className="title-h2">Les modules</h2>
          </div>
          <Collapse
            className="formationPage__accordion"
            accordion
            size="large"
            items={modules ? getCollapseItems(modules) : []}></Collapse>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} className="formationPage__content-container">
          {currentModuleItem && currentModuleItem.item !== null ? (
            <div className="formationPage__title">
              <h2 className="title-h2">{currentModule?.title}</h2>
              <h5 className="title-h5">{currentModuleItem?.title}</h5>
            </div>
          ) : currentModule ? (
            <>
              <div className="formationPage__title">
                <h2 className="title-h2">{currentModule?.title}</h2>
              </div>
              <p>{currentModule.description}</p>
            </>
          ) : currentFormation ? (
            <>
              <div className="formationPage__title">
                <h2 className="title-h2">{currentFormation?.title}</h2>
              </div>
              <p>{currentFormation.description}</p>
            </>
          ) : (
            ""
          )}

          <div className="formationPage__content-wrapper">
            {currentModuleItem &&
            currentModuleItem?.item !== null &&
            currentModuleItem.type !== null
              ? renderModuleItem(currentModuleItem.item, currentModuleItem.type)
              : ""}
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={6} xl={6} className="formationPage__scores-container">
          <div className="formationPage__title">
            <h2 className="title-h2">Mes scores</h2>
          </div>
          <div className="formationPage__score-wrapper">
            <div className="score-wrapper__progression-container">
              <p>Progression:</p>
              <div className="score-wrapper__progress-bar-progression"></div>
              <p>83%</p>
            </div>
            <div className="score-wrapper__score-container">
              <p>Score:</p>
              <div className="score-wrapper__progress-bar-score"></div>
              <p>83%</p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
