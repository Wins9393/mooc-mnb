import { FastifyReply, FastifyRequest } from "fastify";
import { fastify } from "../server";
import {
  BodySaveUserAnswer,
  BodyGetUserAnswer,
  UserProgression,
  IdParams,
  UserAnswersByFormationByUser,
  ProgressionByUserByFormation,
  QuizByFormation,
  ScoreAndCompletionByFormation,
  AnswersByMultipleChoiceQuestions,
  QuestionInQuiz,
  CorrectAnswerOption,
  UserAnswer,
} from "../types/types";

export async function saveUserAnswer(
  req: FastifyRequest<{ Body: BodySaveUserAnswer }>,
  res: FastifyReply
) {
  try {
    const { id_user, id_question, id_answer_option, date_answer, id_quiz, correct } = req.body;

    const query =
      "INSERT INTO user_answers (id_user, id_question, id_answer_option, date_answer, id_quiz, correct) VALUES ($1, $2, $3, $4, $5, $6)";
    const values = [id_user, id_question, id_answer_option, date_answer, id_quiz, correct];

    const results = await fastify.pg.query(query, values);
    res.code(200).send("Réponse enregistrée !");
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de l'insertion des résultats de l'utilisateur",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      res.code(500).send({
        error: "Erreur inconnue lors de l'insertion des résultats de l'utilisateur",
      });
    }
  }
}

export async function getUserAnswersByQuizId(
  req: FastifyRequest<{ Body: BodyGetUserAnswer }>,
  res: FastifyReply
) {
  try {
    const { id_user, id_quiz } = req.body;
    const query =
      "SELECT id, id_user, id_question, id_answer_option, date_answer, id_quiz, correct FROM user_answers WHERE id_user=$1 AND id_quiz=$2";
    const values = [id_user, id_quiz];

    const response = await fastify.pg.query(query, values);
    res.code(200).send(response.rows);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de la récupération des résultats de l'utilisateur",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      res.code(500).send({
        error: "Erreur inconnue lors de la récupération des résultats de l'utilisateur",
      });
    }
  }
}

export async function getUserAnswersByFormationByUser(
  req: FastifyRequest<{ Body: UserAnswersByFormationByUser }>,
  res: FastifyReply
) {
  try {
    const { id_user, id_formation } = req.body;
    const response = await fastify.pg.query(
      "SELECT ua.* FROM user_answers ua JOIN questions q ON ua.id_question = q.id JOIN quiz z ON q.id_quiz = z.id JOIN modules m ON z.id_module = m.id JOIN formations f ON m.id_formation = f.id WHERE id_user=$1 AND f.id=$2;",
      [id_user, id_formation]
    );
    res.code(200).send(response.rows);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de la récupération du nombre de contenu par formation",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      res.code(500).send({
        error: "Erreur inconnue lors de la récupération des formations et vidéos",
      });
    }
  }
}

export async function getUserProgressionByUser(
  req: FastifyRequest<{ Body: IdParams }>,
  res: FastifyReply
) {
  try {
    const { id } = req.body;
    const response = await fastify.pg.query(
      "SELECT id, id_user, id_formation, id_module, id_video, id_text, id_photo_text, id_quiz, complete FROM user_progression WHERE id_user = $1",
      [id]
    );
    res.code(200).send(response.rows);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de la récupération de la progression de l'utilisateur",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      res.code(500).send({
        error: "Erreur inconnue lors de la récupération de la progression de l'utilisateur",
      });
    }
  }
}

export async function saveUserProgression(
  req: FastifyRequest<{ Body: UserProgression }>,
  res: FastifyReply
) {
  try {
    const {
      id_user,
      id_formation,
      id_module,
      id_video,
      id_text,
      id_photo_text,
      id_quiz,
      complete,
    } = req.body;
    const response = await fastify.pg.query(
      "INSERT INTO user_progression (id_user, id_formation, id_module, id_video, id_text, id_photo_text, id_quiz, complete) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [id_user, id_formation, id_module, id_video, id_text, id_photo_text, id_quiz, complete]
    );
    res.code(200).send("Progression enregistrée !");
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de la sauvegarde de la progression de l'utilisateur",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      res.code(500).send({
        error: "Erreur inconnue lors de la sauvegarde de la progression de l'utilisateur",
      });
    }
  }
}

function calculateScore(
  questions: QuestionInQuiz[],
  correctOptionsMap: Map<number, number[]>,
  userAnswersMap: Map<number, number[]>
) {
  let totalQuestions = questions.length;
  let correctAnswers = 0;

  questions.forEach((question) => {
    const questionId = question.question_id;
    const isMultipleChoice = question.is_multiple_choice;

    const correctOptionIds = correctOptionsMap.get(questionId) || [];
    const userSelectedOptionIds = userAnswersMap.get(questionId) || [];

    if (isMultipleChoice) {
      // Trier les tableaux pour une comparaison précise
      correctOptionIds.sort();
      userSelectedOptionIds.sort();

      if (arraysEqual(correctOptionIds, userSelectedOptionIds)) {
        correctAnswers++;
      }
    } else {
      if (
        correctOptionIds.length === 1 &&
        userSelectedOptionIds.length === 1 &&
        correctOptionIds[0] === userSelectedOptionIds[0]
      ) {
        correctAnswers++;
      }
    }
  });

  return (correctAnswers / totalQuestions) * 100;
}

// Fonction utilitaire pour comparer deux tableaux
function arraysEqual(a: number[], b: number[]) {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
}

export async function getUserProgressionAndCompletionByFormation(
  request: FastifyRequest<{ Body: ProgressionByUserByFormation }>,
  reply: FastifyReply
) {
  try {
    const { id_user, id_formation } = request.body;

    // Récupérer tous les quiz de la formation
    const quizzesByFormation = await fastify.pg.query(
      "SELECT q.id AS id_quiz FROM quiz q JOIN modules m ON q.id_module = m.id JOIN formations f ON m.id_formation = f.id WHERE f.id = $1;",
      [id_formation]
    );

    // Récupérer la progression de l'utilisateur
    const userProgressionByFormation = await fastify.pg.query(
      "SELECT * FROM user_progression WHERE id_formation = $1 AND id_user = $2 AND id_quiz IS NOT NULL;",
      [id_formation, id_user]
    );

    const result = {
      id_formation: id_formation,
      total_quizzes: quizzesByFormation.rows.length,
      quizzes_completion: [] as { complete: boolean; id_quiz: number; score: number }[],
    };

    for (const quiz of quizzesByFormation.rows) {
      const idQuiz = quiz.id_quiz;

      // Récupérer les questions du quiz
      const questionsInQuiz = await fastify.pg.query(
        "SELECT q.id AS question_id, q.is_multiple_choice FROM questions q WHERE q.id_quiz = $1;",
        [idQuiz]
      );

      const questionIds = questionsInQuiz.rows.map((q: QuestionInQuiz) => q.question_id);

      // Récupérer les options correctes
      const correctOptionsData = await fastify.pg.query(
        "SELECT ao.id AS option_id, ao.id_question FROM answers_options ao WHERE ao.id_question = ANY($1) AND ao.correct = true;",
        [questionIds]
      );

      // Organiser les options correctes par question
      const correctOptionsMap: Map<number, number[]> = new Map<number, number[]>();

      correctOptionsData.rows.forEach((option: CorrectAnswerOption) => {
        if (!correctOptionsMap.has(option.id_question)) {
          correctOptionsMap.set(option.id_question, []);
        }
        correctOptionsMap.get(option.id_question)?.push(option.option_id);
      });

      // Récupérer les réponses de l'utilisateur pour ce quiz
      const userAnswersData = await fastify.pg.query(
        "SELECT id_question, id_answer_option FROM user_answers WHERE id_user = $1 AND id_quiz = $2;",
        [id_user, idQuiz]
      );

      // Organiser les réponses de l'utilisateur par question
      const userAnswersMap: Map<number, number[]> = new Map<number, number[]>();

      userAnswersData.rows.forEach((answer: UserAnswer) => {
        if (!userAnswersMap.has(answer.id_question)) {
          userAnswersMap.set(answer.id_question, []);
        }
        userAnswersMap.get(answer.id_question)?.push(answer.id_answer_option);
      });

      // Calculer le score pour ce quiz
      const score = calculateScore(questionsInQuiz.rows, correctOptionsMap, userAnswersMap);

      // Vérifier si le quiz est complété
      const quizProgression = userProgressionByFormation.rows.find(
        (userProgression: UserProgression) => userProgression.id_quiz === idQuiz
      );

      result.quizzes_completion.push({
        id_quiz: idQuiz,
        complete: quizProgression ? quizProgression.complete : false,
        score: score,
      });
    }

    reply.send(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      reply.code(500).send({
        error: "Erreur lors de la récupération de la progression de l'utilisateur par formation",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      reply.code(500).send({
        error:
          "Erreur inconnue lors de la récupération de la progression de l'utilisateur par formation",
      });
    }
  }
}
