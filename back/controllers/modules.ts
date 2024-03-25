import { FastifyReply, FastifyRequest } from "fastify";
import { fastify } from "../server";
import { ModuleToDB, Quiz, IdParams, QuizFromDB } from "../types/types";

function groupQuestionsAndAnswersOptionsByQuiz(resultsFromDB: QuizFromDB[]): Quiz[] {
  const quizzes: Record<number, Quiz> = {};

  resultsFromDB.forEach((row) => {
    if (!quizzes[row.quiz_id]) {
      quizzes[row.quiz_id] = { id: row.quiz_id, title: row.quiz_title, questions: [] };
    }
    const quiz = quizzes[row.quiz_id];

    let question = quiz.questions.find((q) => q.id === row.question_id);
    if (!question) {
      question = {
        id: row.question_id,
        text: row.question_text,
        explanation: row.explanation,
        is_multiple_choice: row.is_multiple_choice,
        answer_options: [],
      };
      quiz.questions.push(question);
    }

    question.answer_options.push({
      id: row.answer_option_id,
      text: row.answer_text,
    });
  });
  return Object.values(quizzes);
}

export async function getQuizByModuleId(
  req: FastifyRequest<{ Params: IdParams }>,
  res: FastifyReply
) {
  try {
    const { id } = req.params;
    const query =
      "SELECT qz.id AS quiz_id, qz.title AS quiz_title, qs.id AS question_id, qs.question_text, qs.explanation, qs.is_multiple_choice, ao.id AS answer_option_id, ao.answer_text, ao.correct FROM quiz qz INNER JOIN questions qs ON qz.id = qs.id_quiz INNER JOIN answers_options ao ON qs.id = ao.id_question WHERE qz.id_module = $1";
    const value = [id];

    const response = await fastify.pg.query(query, value);
    const quizzes = groupQuestionsAndAnswersOptionsByQuiz(response.rows);
    const quiz = quizzes.length > 0 ? quizzes[0] : null;

    res.code(200).send(quiz);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de la récupération des quiz",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      res.code(500).send({
        error: "Erreur inconnue lors de la récupération des quiz",
      });
    }
  }
}

export async function getModulesWithContentsByModuleId(
  req: FastifyRequest<{ Params: IdParams }>,
  res: FastifyReply
) {
  try {
    const { id } = req.params;
    const videosQuery =
      "SELECT v.id AS id_video, v.path AS path_video, v.title AS title_video, v.description AS description_video, v.cover_path AS cover_path_video FROM videos v WHERE v.id_module = $1";
    const textsQuery =
      "SELECT t.id AS id_text, t.title AS title_text, t.content AS content_text FROM texts t WHERE t.id_module = $1";
    const value = [id];

    const videosResponse = await fastify.pg.query(videosQuery, value);
    const textsResponse = await fastify.pg.query(textsQuery, value);

    const result = {
      id: Number(id),
      videos: videosResponse.rows,
      texts: textsResponse.rows,
    };

    res.code(200).send(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de la récupération des modules et de leurs contenu",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      res.code(500).send({
        error: "Erreur inconnue lors de la récupération des modules et de leurs contenu",
      });
    }
  }
}

export async function createModule(req: FastifyRequest<{ Body: ModuleToDB }>, res: FastifyReply) {
  try {
    const { id_formation, title, description } = req.body;
    const query =
      "INSERT INTO modules (title, description, cover_path) VALUES ($1, $2, $3) RETURNING id";
    const values = [id_formation, title, description];
    const result = await fastify.pg.query(query, values);

    res.code(200).send(result.rows[0].id);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de la création du module",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      res.code(500).send({
        error: "Erreur inconnue lors de la création du module",
      });
    }
  }
}
