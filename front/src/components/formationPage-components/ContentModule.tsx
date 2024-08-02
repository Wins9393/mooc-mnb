import { Button, Divider, message } from "antd";
import {
  Formation,
  FullAnswerOption,
  Module,
  ModuleCollapseItem,
  PhotoText,
  QuestionFromDB,
  Quiz,
  Text,
  UserAnswer,
  UserAnswerWithoutCorrect,
  UserProgression,
  Video,
} from "../../types/types";
import { CloseCircleTwoTone, CheckCircleTwoTone } from "@ant-design/icons";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import DOMPurify from "dompurify";
import { AuthContext } from "../../contexts/AuthContext";
import { MainContext } from "../../contexts/MainContext";
import { ModalNextContent } from "./ModalNextContent";

interface ContentModuleInterface {
  currentFormation: Formation | null;
  currentModule: Module | null;
  currentModuleItem: ModuleCollapseItem | null;
  fadeClass: string;
  isQuizAnswered: boolean;
  oldUserAnswers: UserAnswer[] | undefined;
  scoreByQuiz: number;
  selectedUserAnswers: UserAnswerWithoutCorrect[] | null;
  setSelectedUserAnswers: Dispatch<SetStateAction<UserAnswerWithoutCorrect[] | null>>;
  setIsVideoEnded: Dispatch<SetStateAction<boolean>>;
  handleResetQuiz(user_id: number, quiz_id: number): Promise<void>;
  isProgressionSavedByType(
    userProgression: UserProgression[] | null,
    id_content: number,
    type: string
  ): boolean;
  getOldUserAnswers(id_user: number, id_quiz: number): Promise<void>;
}

export function ContentModule({
  currentFormation,
  currentModule,
  currentModuleItem,
  fadeClass,
  isQuizAnswered,
  oldUserAnswers,
  scoreByQuiz,
  selectedUserAnswers,
  setSelectedUserAnswers,
  setIsVideoEnded,
  handleResetQuiz,
  isProgressionSavedByType,
  getOldUserAnswers,
}: ContentModuleInterface) {
  const questionRefs = useRef<Map<number, HTMLInputElement[]>>(new Map());

  const authContext = useContext(AuthContext);
  if (!authContext) return;

  const mainContext = useContext(MainContext);
  if (!mainContext) return;

  const { user } = authContext ?? {};

  const {
    getCorrectAnswer,
    saveUserStats,
    saveUserProgression,
    userProgression,
    // Affiche Modal Fin de Formation
    // totalQuestionsByFormation,
    // totalUserAnswersByFormation,
  } = mainContext ?? {};

  const [isNextContentOpen, setIsNextContentOpen] = useState<boolean>(false);

  // Affiche Modal Fin de Formation
  // useEffect(() => {
  //   setIsNextContentOpen(
  //     isFormationComplete(totalQuestionsByFormation, totalUserAnswersByFormation)
  //   );
  // }, [totalUserAnswersByFormation]);

  function onVideoEnded(video: Video) {
    if (
      user &&
      currentModule &&
      !isProgressionSavedByType(userProgression, video.id_video, "video")
    ) {
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

  async function onValidateQuiz(userAnswers: UserAnswer[], quizItem: Quiz) {
    const groupAnswersByQuestion = userAnswers.reduce(
      (acc: { [key: number]: UserAnswer[] }, answer: UserAnswer) => {
        if (!acc[answer.id_question]) {
          acc[answer.id_question] = [];
        }
        acc[answer.id_question].push(answer);
        return acc;
      },
      {}
    );

    if (Object.keys(groupAnswersByQuestion).length < quizItem.questions.length) {
      message.error("Veuillez choisir une réponse pour chaque question !");
      return;
    }

    for (const [key, answers] of Object.entries(groupAnswersByQuestion)) {
      if (answers.length > 1) {
        const answersOptionsIds: number[] = answers.map((answer) => answer?.id_answer_option);

        const correctAnswers = await getCorrectAnswer(parseInt(key), answersOptionsIds);

        const multipleCorrectAnswer = correctAnswers.correctAnswer as FullAnswerOption[];

        const userAnswersStat = answers.map((userAnswer) => {
          const isCorrect = multipleCorrectAnswer.some(
            (correctAnswer) => correctAnswer.id === userAnswer.id_answer_option
          );
          return {
            ...userAnswer,
            correct: isCorrect,
          };
        });

        userAnswersStat.forEach((userAnswer) => saveUserStats(userAnswer));
      } else {
        const correctAnswer = await getCorrectAnswer(
          answers[0].id_question,
          answers[0].id_answer_option
        );

        const oneCorrectAnswer = correctAnswer.correctAnswer as FullAnswerOption;

        const userAnswerStat = {
          ...answers[0],
          correct: oneCorrectAnswer.id === answers[0].id_answer_option,
        };

        saveUserStats(userAnswerStat);
      }
    }

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

  function onUserAnswerChange(
    e: ChangeEvent<HTMLInputElement>,
    id_question: number,
    id_answer: number,
    id_quiz: number,
    is_multiple_choice: boolean
  ) {
    const inputs = questionRefs.current.get(id_question) || [];

    if (!is_multiple_choice) {
      inputs.forEach((input) => {
        if (input !== e.target) {
          input.checked = false;
        }
      });

      setSelectedUserAnswers((prevAnswers) => {
        let updatedAnswers = prevAnswers ? [...prevAnswers] : [];

        const existingQuestionIndex = updatedAnswers.findIndex(
          (answer) => answer.id_question === id_question
        );

        const existingAnswerIndex = updatedAnswers.findIndex(
          (answer) => answer.id_answer_option === id_answer
        );

        if (user) {
          if (existingAnswerIndex > -1 && !e.target.checked) {
            updatedAnswers = updatedAnswers.filter(
              (answer) => answer.id_answer_option !== id_answer
            );
          } else {
            const newAnswer = {
              id_user: user?.id,
              id_question,
              id_answer_option: id_answer,
              id_quiz,
              date_answer: new Date().toISOString(),
            };

            if (existingQuestionIndex > -1) {
              updatedAnswers[existingQuestionIndex] = newAnswer;
              return updatedAnswers;
            }
            updatedAnswers.push(newAnswer);
          }
        }
        return updatedAnswers;
      });
    } else {
      setSelectedUserAnswers((prevAnswers) => {
        const updatedAnswers = prevAnswers ? [...prevAnswers] : [];

        const existingAnswerIndex = updatedAnswers.findIndex(
          (answer) => answer.id_answer_option === id_answer
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
            const filteredAnswers = updatedAnswers.filter((answer) => {
              return answer.id_answer_option !== newAnswer.id_answer_option;
            });
            return filteredAnswers;
          } else {
            updatedAnswers.push(newAnswer);
          }
        }

        return updatedAnswers;
      });
    }
  }

  function displayQuizResult(dateString: string, id_quiz: number) {
    const dateValidation = new Date(dateString);
    return (
      (
        <div>
          <div
            className={`formationPage__quiz-valide--container ${
              scoreByQuiz < 100 ? "quiz-echec" : "quiz-reussi"
            }`}>
            <p>{`Quiz soumis le ${dateValidation.getDate()}/${(dateValidation.getMonth() + 1)
              .toString()
              .padStart(
                2,
                "0"
              )}/${dateValidation.getFullYear()} à ${dateValidation.getHours()}H${dateValidation.getMinutes()}`}</p>
            {scoreByQuiz < 100 ? (
              <p>
                <span style={{ fontWeight: "bold" }}>Echec </span>
                avec un score de:{" "}
                <span style={{ fontWeight: "bold" }}>{scoreByQuiz.toFixed(2)}%</span>
              </p>
            ) : (
              <p>
                <span style={{ fontWeight: "bold" }}>Réussite </span>
                avec un score de:{" "}
                <span style={{ fontWeight: "bold" }}>{scoreByQuiz.toFixed(2)}%</span>
              </p>
            )}
          </div>
          {scoreByQuiz < 100 ? (
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

  function renderModuleItem(item: Video | Text | PhotoText | Quiz | null, itemType: string) {
    if (!item) {
      return null;
    }

    switch (itemType) {
      case "video":
        const videoItem = item as Video;
        return (
          <>
            <video
              onEnded={() => onVideoEnded(videoItem)}
              controls
              className={`formationPage__video ${fadeClass}`}
              src={`${import.meta.env.VITE_API_URL}/public/${videoItem.path_video}`}></video>
          </>
        );
      case "photo_text":
        const photoTextItem = item as PhotoText;
        return (
          <div className="formationPage__photo-text-container">
            <img
              className={`formationPage__photo-text-photo ${fadeClass}`}
              src={`${import.meta.env.VITE_API_URL}/public/${
                photoTextItem.photo_path_photo_text
              }`}></img>
            <div
              className="formationPage__photo-text-text"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(photoTextItem.text_content_photo_text),
              }}></div>
          </div>
        );
      case "text":
        const textItem = item as Text;
        return (
          <>
            <p className={`${fadeClass}`}>{textItem.content_text}</p>;
          </>
        );
      case "quiz":
        const quizItem = item as Quiz;

        return (
          <div className={`formationPage__quiz-wrapper ${fadeClass}`}>
            {isQuizAnswered && oldUserAnswers?.length
              ? displayQuizResult(oldUserAnswers?.[0].date_answer, quizItem.id)
              : ""}
            {quizItem?.questions.map((question) => {
              const userAnswer = oldUserAnswers?.filter((a) => a.id_question === question.id);
              const questionRef = questionRefs.current.get(question.id) || [];
              return (
                <div
                  key={`question-${question.id}`}
                  className="formationPage__questions-answers-bloc">
                  <div className="formationPage__question-bloc">
                    <h3>
                      {question.question_text}{" "}
                      {question.is_multiple_choice ? (
                        <span style={{ fontSize: ".8rem", fontWeight: "light" }}>
                          (plusieurs réponses possibles)
                        </span>
                      ) : (
                        ""
                      )}
                    </h3>
                  </div>
                  <Divider style={{ margin: "16px" }} />
                  <div>
                    {question.answer_options.map((answer) => {
                      return (
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
                                checked={userAnswer?.some(
                                  (uAnswer) => uAnswer.id_answer_option === answer.id
                                )}
                                disabled={true}
                                name={`answer_option-question-${question.id}`}
                                type="checkbox"
                              />
                            ) : (
                              <input
                                disabled={false}
                                key={answer.id}
                                name={`answer_option-question-${question.id}`}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                  onUserAnswerChange(
                                    e,
                                    question.id,
                                    answer.id,
                                    quizItem.id,
                                    question.is_multiple_choice
                                  )
                                }
                                ref={(el) => {
                                  if (el && !questionRef.includes(el)) {
                                    questionRefs.current.set(question.id, [...questionRef, el]);
                                  }
                                }}
                                type="checkbox"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
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

  // Affiche Modal Fin de Formation
  // function isFormationComplete(
  //   totalQuestionsByFormation: QuestionFromDB[] | null,
  //   totalUserAnswersByFormation: UserAnswer[] | null
  // ): boolean {
  //   if (!totalQuestionsByFormation || !totalUserAnswersByFormation) {
  //     return false;
  //   }

  //   if (totalUserAnswersByFormation.length < totalQuestionsByFormation.length) {
  //     return false;
  //   }

  //   console.log("answers: ", totalUserAnswersByFormation, "question: ", totalQuestionsByFormation);

  //   const multipleQuestions = totalQuestionsByFormation.filter((question) => {
  //     return question.is_multiple_choice === true;
  //   });

  //   if (multipleQuestions.length) {
  //     console.log("multipleQuestions: ", multipleQuestions);
  //   }
  //   return true;
  // }

  return (
    <>
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
        {currentModuleItem && currentModuleItem?.item !== null && currentModuleItem.type !== null
          ? renderModuleItem(currentModuleItem.item, currentModuleItem.type)
          : ""}
      </div>
      {/*
      // Affiche Modal Fin de Formation 
      <ModalNextContent
        isNextContentOpen={isNextContentOpen}
        setIsNextContentOpen={setIsNextContentOpen}
      /> */}
    </>
  );
}
