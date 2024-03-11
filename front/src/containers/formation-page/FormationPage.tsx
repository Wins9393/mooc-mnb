import { ChangeEvent, useContext, useEffect, useState } from "react";
import { MainContext } from "../../contexts/MainContext";
import { useParams } from "react-router-dom";
import { Quiz, UserAnswer, VideoWithCompleteQuiz } from "../../types/types";
import { Col, Row, Collapse, CollapseProps, Divider, Button } from "antd";
import { InfoCircleTwoTone, CloseCircleTwoTone, CheckCircleTwoTone } from "@ant-design/icons";
import "./formation-page.css";
import { AuthContext } from "../../contexts/AuthContext";

export function FormationPage() {
  let { id_formation } = useParams();

  const mainContext = useContext(MainContext);
  if (!mainContext) return;
  const { getVideosWithCompleteQuizByFormation, videosWithCompleteQuiz } = mainContext;

  const authContext = useContext(AuthContext);
  if (!authContext) return;
  const { user } = authContext;

  const [currentVideo, setCurrentVideo] = useState<VideoWithCompleteQuiz | null>(null);
  const [currentQuizzes, setCurrentQuizzes] = useState<Quiz[] | undefined>(undefined);

  const [userAnswersByQuestion, setUserAnswersByQuestion] = useState<UserAnswer[] | null>(null);

  const [fadeClass, setFadeClass] = useState("video--fade-in");

  useEffect(() => {
    if (id_formation) {
      getVideosWithCompleteQuizByFormation(id_formation);
    }
  }, [id_formation]);

  useEffect(() => {
    setCurrentVideo(videosWithCompleteQuiz[0]);
  }, [videosWithCompleteQuiz]);

  useEffect(() => {
    setCurrentQuizzes(currentVideo?.quizzes);
    setUserAnswersByQuestion([]);
  }, [currentVideo]);

  // A supp
  useEffect(() => {
    console.log("current video: ", currentVideo);
  }, [currentVideo]);

  useEffect(() => {
    console.log("userAnswers: ", userAnswersByQuestion);
  }, [userAnswersByQuestion]);
  // A supp

  function onQuizClick(quiz: Quiz) {
    console.log(quiz);
  }

  function onUserAnswerChange(
    e: ChangeEvent<HTMLInputElement>,
    id_question: number,
    id_answer: number
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

    setUserAnswersByQuestion((prevAnswers) => {
      const updatedAnswers = prevAnswers ? [...prevAnswers] : [];

      const existingAnswerIndex = updatedAnswers.findIndex(
        (answer) => answer.id_question === id_question
      );

      if (user) {
        const newAnswer = {
          id_user: user?.id,
          id_question,
          id_answer_option: id_answer,
          date_answer: new Date(),
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

  function onValidateQuiz(userAnswers: UserAnswer[]) {
    userAnswers.forEach((userAnswer) => console.log("user answer: ", userAnswer));
  }

  // Boucle sur les videos présentes dans la formation pour remplir le tableau d'Items pour le Collapse
  function getCollapseItems(videos: VideoWithCompleteQuiz[]) {
    let items: CollapseProps["items"] = [];

    if (!videos) {
      return;
    }

    videos.forEach((video) =>
      items?.push({
        key: video.id,
        label: video.title,
        children: video.quizzes.map((quiz) => (
          <p
            key={quiz.id}
            onClick={() => onQuizClick(quiz)}
            className="formationPage__collapse-item"
            style={{ display: "flex", justifyContent: "space-between" }}>
            {quiz.title_quiz}
            <span>
              <InfoCircleTwoTone />
            </span>
          </p>
        )),
        onClick: () => {
          if (currentVideo?.id !== video.id) {
            setFadeClass("video--fade-out");

            setTimeout(() => {
              setCurrentVideo(video);
              setFadeClass("video--fade-in");
            }, 500);
          }
        },
      })
    );

    return items;
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
          <h2 className="formationPage__title-h2">Les vidéos</h2>
          <Collapse
            className="formationPage__accordion"
            accordion
            size="large"
            items={getCollapseItems(videosWithCompleteQuiz)}></Collapse>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} className="formationPage__video-container">
          <h2 className="formationPage__title-h2">{currentVideo?.title}</h2>
          <div className="formationPage__video-wrapper">
            <video
              controls
              className={`formationPage__video ${fadeClass}`}
              src={`${import.meta.env.VITE_API_URL}/public/video-${currentVideo?.path}`}></video>
          </div>
          <div className="formationPage__quiz-wrapper">
            {currentVideo
              ? currentQuizzes?.map((quiz) =>
                  quiz.questions.map((question) => (
                    <div key={question.id} className="formationPage__questions-answers-bloc">
                      <div className="formationPage__question-bloc">
                        <h3>{question.question_text}</h3>
                      </div>
                      <Divider style={{ margin: "16px" }} />
                      <div>
                        {question.answer_options.map((answer) => (
                          <div className="formationPage__answer-bloc" key={answer.id}>
                            <p>{answer.answer_text}</p>{" "}
                            <input
                              name={`answer_option-question-${question.id}`}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                onUserAnswerChange(e, question.id, answer.id)
                              }
                              type="checkbox"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )
              : ""}
            <Button onClick={() => onValidateQuiz(userAnswersByQuestion as UserAnswer[])}>
              Valider
            </Button>
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={6} xl={6} className="formationPage__scores-container">
          <h2 className="formationPage__title-h2">Mes scores</h2>
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
          <div></div>
        </Col>
      </Row>
    </div>
  );
}
