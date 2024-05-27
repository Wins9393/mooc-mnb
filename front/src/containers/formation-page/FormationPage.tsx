import { useContext, useEffect, useState } from "react";
import { MainContext } from "../../contexts/MainContext";
import { useParams } from "react-router-dom";
import {
  Formation,
  Module,
  ModuleCollapseItem,
  Quiz,
  UserAnswer,
  UserAnswerWithoutCorrect,
  UserProgression,
  FullAnswerOption,
} from "../../types/types";
import { Col, Row } from "antd";
import "./formation-page.css";
import { AuthContext } from "../../contexts/AuthContext";
import { CollapseModule } from "../../components/formationPage-components/CollapseModule";
import { ContentModule } from "../../components/formationPage-components/ContentModule";
import { Statistics } from "../../components/formationPage-components/Statistics";

export function FormationPage() {
  let { id_formation } = useParams();

  const mainContext = useContext(MainContext);
  if (!mainContext) return;
  const {
    formations,
    isLoadingFormations,
    getCorrectAnswer,
    getUserAnswerByQuizId,
    resetQuizById,
    getUserProgressionByUser,
    getContentsByFormationId,
    getUserAnswersByFormationByUserId,
    getQuestionsByFormation,
  } = mainContext ?? {};

  const authContext = useContext(AuthContext);
  if (!authContext) return;
  const { user } = authContext ?? {};

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

  const [isVideoEnded, setIsVideoEnded] = useState<boolean>(false);

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
  }, [idFormation, isLoadingFormations]);

  useEffect(() => {
    if (user && idFormation) {
      getUserAnswersByFormationByUserId(user.id, idFormation);
    }
  }, [idFormation, oldUserAnswers]);

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

  async function getOldUserAnswers(id_user: number, id_quiz: number): Promise<void> {
    const oldUserAnswers = await getUserAnswerByQuizId(id_user, id_quiz);
    setOldUserAnswers(oldUserAnswers);
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

  async function getScoreByQuiz(userAnswers: UserAnswer[] | undefined) {
    let goodAnswers = 0;

    const groupOldAnswersByQuestion = userAnswers?.reduce(
      (acc: { [key: number]: UserAnswer[] }, answer: UserAnswer) => {
        if (!acc[answer.id_question]) {
          acc[answer.id_question] = [];
        }
        acc[answer.id_question].push(answer);
        return acc;
      },
      {}
    );

    if (groupOldAnswersByQuestion) {
      const questionsNumber = Object.keys(groupOldAnswersByQuestion).length;

      for (const [key, answers] of Object.entries(groupOldAnswersByQuestion)) {
        if (answers.length > 1) {
          const answersOptionsIds: number[] = answers.map((answer) => answer?.id_answer_option);
          const correctAnswers = await getCorrectAnswer(parseInt(key), answersOptionsIds);

          const multipleCorrectAnswer = correctAnswers.correctAnswer as FullAnswerOption[];
          const correctAnswersNumber = multipleCorrectAnswer.length;
          const userAnswersNumber = answers.length;
          const userCorrectAnswersNumber = answers.filter((answer) => answer.correct).length;

          if (
            correctAnswersNumber === userAnswersNumber &&
            correctAnswersNumber === userCorrectAnswersNumber
          ) {
            goodAnswers++;
          }
        } else {
          if (answers[0].correct) {
            goodAnswers++;
          }
        }
      }

      if (questionsNumber) {
        const average = (goodAnswers / questionsNumber) * 100;
        setScoreByQuiz(average);
      }
    }
  }

  async function handleResetQuiz(user_id: number, quiz_id: number) {
    if (user_id && quiz_id) {
      await resetQuizById(user_id, quiz_id);
      await getOldUserAnswers(user_id, quiz_id);
      setSelectedUserAnswers([]);
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
          <CollapseModule
            modules={modules}
            currentModule={currentModule}
            setCurrentModule={setCurrentModule}
            currentModuleItem={currentModuleItem}
            setCurrentModuleItem={setCurrentModuleItem}
            setFadeClass={setFadeClass}
            setSelectedItemId={setSelectedItemId}
            selectedItemId={selectedItemId}
            setIsVideoEnded={setIsVideoEnded}
            isProgressionSavedByType={isProgressionSavedByType}
            getOldUserAnswers={getOldUserAnswers}
          />
        </Col>

        <Col xs={24} sm={24} md={24} lg={12} xl={12} className="formationPage__content-container">
          <ContentModule
            currentFormation={currentFormation}
            currentModule={currentModule}
            currentModuleItem={currentModuleItem}
            fadeClass={fadeClass}
            isQuizAnswered={isQuizAnswered}
            oldUserAnswers={oldUserAnswers}
            scoreByQuiz={scoreByQuiz}
            selectedUserAnswers={selectedUserAnswers}
            setSelectedUserAnswers={setSelectedUserAnswers}
            setIsVideoEnded={setIsVideoEnded}
            handleResetQuiz={handleResetQuiz}
            isProgressionSavedByType={isProgressionSavedByType}
            getOldUserAnswers={getOldUserAnswers}
          />
        </Col>
        <Col xs={24} sm={24} md={24} lg={6} xl={6} className="formationPage__scores-container">
          <Statistics idFormation={idFormation} />
        </Col>
      </Row>
    </div>
  );
}
