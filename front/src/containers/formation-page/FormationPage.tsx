import { ChangeEvent, useContext, useEffect, useState } from "react";
import { MainContext } from "../../contexts/MainContext";
import { useParams } from "react-router-dom";
import {
  Formation,
  Module,
  ModuleCollapseItem,
  Quiz,
  UserAnswer,
  Video,
  Text,
  UserAnswerWithoutCorrect,
  UserProgression,
  QuestionFromDB,
} from "../../types/types";
import { Col, Row, Collapse, CollapseProps, Divider, Button, message } from "antd";
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
    saveUserProgression,
    getUserProgressionByUser,
    userProgression,
    getContentsByFormationId,
    contentsByFormation,
    getUserAnswersByFormationByUserId,
    totalUserAnswersByFormation,
    getQuestionsByFormation,
    totalQuestionsByFormation,
  } = mainContext;

  const authContext = useContext(AuthContext);
  if (!authContext) return;
  const { user } = authContext;

  const [idFormation, setIdFormation] = useState<number | null>(null);
  const [currentFormation, setCurrentFormation] = useState<Formation | null>(null);
  const [modules, setModules] = useState<Module[] | null>(null);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [currentModuleItem, setCurrentModuleItem] = useState<ModuleCollapseItem | null>(null);

  const [selectedUserAnswers, setSelectedUserAnswers] = useState<UserAnswerWithoutCorrect[] | null>(
    null
  );
  const [oldUserAnswers, setOldUserAnswers] = useState<UserAnswer[] | undefined>(undefined);
  const [isQuizAnswered, setIsQuizAnswered] = useState<boolean>(false);
  const [scoreByQuiz, setScoreByQuiz] = useState<number>(0);

  const [fadeClass, setFadeClass] = useState("content--fade-in");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const [scorePercentage, setScorePercentage] = useState<number>(0);
  const [progressionPercentage, setProgressionPercentage] = useState<number>(0);

  const [isVideoEnded, setIsVideoEnded] = useState<boolean>(false);

  // Debug
  // useEffect(() => {
  //   console.log("currentFormation: ", currentFormation);
  //   console.log("currentModule: ", currentModule);
  //   console.log("currentModuleItem: ", currentModuleItem);
  // }, [currentModule, currentModuleItem, currentFormation]);

  // useEffect(() => {
  //   console.log("progressionPercentage: ", parseFloat(progressionPercentage.toFixed(1)));
  // }, [progressionPercentage]);

  // useEffect(() => {
  //   console.log("scoreByQuiz: ", scoreByQuiz);
  // }, [scoreByQuiz]);

  // useEffect(() => {
  //   console.log("moduleContent: ", moduleContent);
  // }, [moduleContent]);

  // useEffect(() => {
  //   console.log("formations: ", formations);
  // }, [formations]);

  // useEffect(() => {
  //   console.log("modules: ", modules);
  // }, [modules]);

  // useEffect(() => {
  //   console.log("currentModuleItem: ", currentModuleItem);
  // }, [currentModuleItem]);

  // useEffect(() => {
  //   console.log("selectedUserAnswers: ", selectedUserAnswers);
  // }, [selectedUserAnswers]);

  // useEffect(() => {
  //   console.log("oldUserAnswers: ", oldUserAnswers);
  // }, [oldUserAnswers]);

  // useEffect(() => {
  //   console.log("contentsByFormation: ", contentsByFormation);
  // }, [contentsByFormation]);

  // useEffect(() => {
  //   console.log("Total Questions: ", totalQuestionsByFormation);
  // }, [totalQuestionsByFormation]);

  // useEffect(() => {
  //   console.log("Total UA: ", totalUserAnswersByFormation);
  // }, [totalUserAnswersByFormation]);

  // useEffect(() => {
  //   console.log("isVideoEnded: ", isVideoEnded);
  // }, [isVideoEnded]);
  // Fin Debug

  useEffect(() => {
    if (id_formation) {
      setIdFormation(parseInt(id_formation));
    }
  }, [id_formation]);

  useEffect(() => {
    if (idFormation) {
      getCurrentFormation(idFormation);
      getModulesByFormationId(idFormation);
      getContentsByFormationId(idFormation);
      getQuestionsByFormation(idFormation);
    }
  }, [idFormation]);

  useEffect(() => {
    if (user && idFormation) {
      getUserAnswersByFormationByUserId(user.id, idFormation);
    }
  }, [idFormation, oldUserAnswers]);

  useEffect(() => {
    if (userProgression) {
      getProgressionPercentageByFormation(userProgression);
    }
  }, [userProgression, contentsByFormation]);

  useEffect(() => {
    if (totalUserAnswersByFormation && totalQuestionsByFormation) {
      getScorePercentageByFormation(totalUserAnswersByFormation, totalQuestionsByFormation);
    }
  }, [totalQuestionsByFormation, totalUserAnswersByFormation]);

  useEffect(() => {
    getScoreByQuiz(oldUserAnswers);
  }, [isQuizAnswered, oldUserAnswers]);

  useEffect(() => {
    if (currentModuleItem) {
      const quizAnswered = oldUserAnswers?.some(
        (oldAnswer) => oldAnswer.id_quiz === (currentModuleItem?.item as Quiz).id
      );
      setIsQuizAnswered(quizAnswered === true);
    }
  }, [oldUserAnswers, currentModuleItem]);

  useEffect(() => {
    setSelectedUserAnswers([]);
  }, [currentModuleItem]);

  useEffect(() => {
    if (user) getUserProgressionByUser(user.id);
  }, [currentModuleItem, oldUserAnswers, isVideoEnded]);

  function onVideoEnded(video: Video) {
    if (
      user &&
      currentModule &&
      !isProgressionSavedByType(userProgression, video.id_video, "video")
    ) {
      console.log("video: ", video);
      saveUserProgression({
        id_user: user?.id,
        id_formation: currentModule?.id_formation,
        id_module: currentModule.id,
        id_video: video.id_video,
        complete: true,
      });
      setTimeout(() => {
        setIsVideoEnded(true);
      }, 200);
    }
  }

  function getCurrentFormation(id_formation: number) {
    const formation: Formation | undefined = formations.find(
      (formation) => formation.id === id_formation
    );
    if (formation) setCurrentFormation(formation);
  }

  function getModulesByFormationId(id_formation: number) {
    const modules: Module[] | null =
      formations.find((f) => f.id === id_formation)?.modules.sort((a, b) => a.id - b.id) ?? null;
    setModules(modules);
  }

  function isProgressionSavedByType(
    userProgression: UserProgression[] | null,
    id_content: number,
    type: string
  ): boolean {
    if (userProgression && userProgression.length > 0) {
      if (type === "video") {
        return userProgression.some((progress) => progress.id_video === id_content);
      }
      if (type === "text") {
        return userProgression.some((progress) => progress.id_text === id_content);
      }
      if (type === "quiz") {
        return userProgression.some((progress) => progress.id_quiz === id_content);
      }
    }

    return false;
  }

  function onItemModuleClick(moduleItem: ModuleCollapseItem) {
    if (moduleItem.id !== currentModuleItem?.id) {
      setFadeClass("content--fade-out");
      setSelectedItemId(moduleItem.id);
      setIsVideoEnded(false);

      if (
        user &&
        currentModule &&
        moduleItem.type === "text" &&
        !isProgressionSavedByType(userProgression, (moduleItem.item as Text).id_text, "text")
      ) {
        saveUserProgression({
          id_user: user?.id,
          id_formation: currentModule?.id_formation,
          id_module: currentModule.id,
          id_text: (moduleItem.item as Text).id_text,
          complete: true,
        });
      }

      setTimeout(() => {
        setCurrentModuleItem(moduleItem);
        setFadeClass("content--fade-in");
      }, 400);
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

  async function getScoreByQuiz(userAnswers: UserAnswer[] | undefined) {
    const questionsNumber = userAnswers?.length;
    let goodAnswers = 0;

    userAnswers?.forEach((answer) => {
      if (answer.correct) goodAnswers++;
    });

    if (questionsNumber) {
      const average = (goodAnswers / questionsNumber) * 100;
      setScoreByQuiz(average);
    }
  }

  async function getProgressionPercentageByFormation(
    userProgression: UserProgression[]
  ): Promise<void> {
    const progressionByFormationTab = userProgression.filter(
      (progress) => progress.id_formation === idFormation
    );

    if (contentsByFormation) {
      const contentsCount =
        contentsByFormation.video_count +
        contentsByFormation.text_count +
        contentsByFormation.quiz_count;

      let progressPercentage = parseFloat(
        ((progressionByFormationTab.length / contentsCount) * 100).toFixed(1)
      );

      setProgressionPercentage(progressPercentage);
    }
  }

  async function getScorePercentageByFormation(
    userAnswers: UserAnswer[],
    questions: QuestionFromDB[]
  ): Promise<void> {
    const correctAnswersCount = userAnswers.filter((ua) => ua.correct).length;

    const scorePercentage = parseFloat(((correctAnswersCount / questions.length) * 100).toFixed(1));

    setScorePercentage(scorePercentage);
  }

  async function onValidateQuiz(userAnswers: UserAnswer[], quizItem: Quiz) {
    if (userAnswers.length < quizItem.questions.length) {
      message.error("Veuillez choisir une réponse pour chaque question !");
      return;
    }

    const promises = userAnswers.map((userAnswer) => {
      return getCorrectAnswer(userAnswer.id_question, userAnswer.id_answer_option);
    });

    const promisesResolved = await Promise.all(promises);

    const validatedAnswer = userAnswers.flatMap((answer) =>
      promisesResolved
        .map((correctAnswers) => {
          if (answer.id_answer_option === correctAnswers.idAnswerOptionSelected) {
            return { ...answer, correct: correctAnswers.isCorrectAnswerSelected };
          }
        })
        .filter((answer) => answer !== undefined)
    );

    validatedAnswer.forEach((answer) => {
      if (answer !== undefined) saveUserStats(answer);
    });

    if (
      user &&
      currentModule &&
      quizItem &&
      !isProgressionSavedByType(userProgression, quizItem.id, "quiz")
    ) {
      saveUserProgression({
        id_user: user?.id,
        id_formation: currentModule?.id_formation,
        id_module: currentModule.id,
        id_quiz: quizItem.id,
        complete: true,
      });
    }

    if (user) {
      setTimeout(() => {
        getOldUserAnswers(user?.id, quizItem.id);
      }, 400);
    }
    window.scrollTo(0, 0);
  }

  async function handleResetQuiz(user_id: number, quiz_id: number) {
    if (user_id && quiz_id) {
      await resetQuizById(user_id, quiz_id);
      await getOldUserAnswers(user_id, quiz_id);
      setSelectedUserAnswers([]);
    }
  }

  function changeCollapseBGColor(userProgression: UserProgression[], content: ModuleCollapseItem) {
    const result = userProgression?.some((progress) => {
      if (content.type === "video") {
        return (content?.item as Video).id_video === progress.id_video;
      }
      if (content.type === "text") {
        return (content?.item as Text).id_text === progress.id_text;
      }
      if (content.type === "quiz") {
        return (content?.item as Quiz).id === progress.id_quiz;
      }
    });

    if (result) {
      return { backgroundColor: "#dad2d8" };
    }
    return {};
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
        <div
          className="formationPage__collapse-item-box"
          style={
            userProgression && content.item ? changeCollapseBGColor(userProgression, content) : {}
          }
          key={content.id}
          onClick={() => onItemModuleClick(content)}>
          <span className={content.id === selectedItemId ? "selected-item" : ""}></span>
          <p className="formationPage__collapse-item">{content.title}</p>
          {content.type === "video" && <PlayCircleOutlined />}
          {content.type === "text" && <FileTextOutlined />}
          {content.type === "quiz" && <QuestionCircleOutlined />}
        </div>
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
            onEnded={() => onVideoEnded(videoItem)}
            controls
            className={`formationPage__video ${fadeClass}`}
            src={`${import.meta.env.VITE_API_URL}/public/${videoItem.path_video}`}></video>
        );
      case "text":
        const textItem = item as Text;
        return <p className={`${fadeClass}`}>{textItem.content_text}</p>;
      case "quiz":
        const quizItem = item as Quiz;

        return (
          <div className={`formationPage__quiz-wrapper ${fadeClass}`}>
            {isQuizAnswered && oldUserAnswers?.length
              ? displayQuizResult(oldUserAnswers?.[0].date_answer, quizItem.id)
              : ""}
            {quizItem?.questions.map((question) => {
              const userAnswer = oldUserAnswers?.find((a) => a.id_question === question.id);
              return (
                <div
                  key={`question-${question.id}`}
                  className="formationPage__questions-answers-bloc">
                  <div className="formationPage__question-bloc">
                    <h3>{question.question_text}</h3>
                  </div>
                  <Divider style={{ margin: "16px" }} />
                  <div>
                    {question.answer_options.map((answer) => (
                      <div style={{ display: "flex" }} key={`answer-${answer.id}`}>
                        {oldUserAnswers?.map((item) =>
                          item.id_answer_option === answer.id ? (
                            item.correct ? (
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
            <h2 className="title-h2">Statistiques</h2>
          </div>
          <div className="formationPage__score-wrapper">
            <div className="score-wrapper__progression-container">
              <p>Progression:</p>
              <div className="score-wrapper__progress-bar-progression">
                <p style={{ width: `${progressionPercentage}%` }}>{progressionPercentage}%</p>
              </div>
            </div>
            <div className="score-wrapper__score-container">
              <p>Score:</p>
              <div className="score-wrapper__progress-bar-score">
                <p style={{ width: `${scorePercentage}%` }}>{scorePercentage}%</p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
