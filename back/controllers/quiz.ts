import { FastifyReply, FastifyRequest } from "fastify";
import { fastify } from "../server";
import { BodyResetQuizById, IdParams, Quiz, QuizFromDB, QuizToDB } from "../types/types";

function groupQuestionsAndAnswersOptionsByQuiz(resultsFromDB: QuizFromDB[]): Quiz[] {
  const quizzes: Record<number, Quiz> = {};

  resultsFromDB.forEach((row) => {
    if (!quizzes[row.quiz_id]) {
      quizzes[row.quiz_id] = {
        id: row.quiz_id,
        title: row.quiz_title,
        questions: [],
      };
    }
    const quiz = quizzes[row.quiz_id];

    let question = quiz.questions.find((q) => q.id === row.question_id);
    if (!question) {
      question = {
        id: row.question_id,
        question_text: row.question_text,
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
  request: FastifyRequest<{ Params: IdParams }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const query =
      "SELECT qz.id AS quiz_id, qz.title AS quiz_title, qs.id AS question_id, qs.question_text, qs.explanation, qs.is_multiple_choice, ao.id AS answer_option_id, ao.answer_text, ao.correct FROM quiz qz LEFT JOIN questions qs ON qz.id = qs.id_quiz LEFT JOIN answers_options ao ON qs.id = ao.id_question WHERE qz.id_module = $1";
    const value = [id];

    const response = await fastify.pg.query(query, value);
    const quizzes = groupQuestionsAndAnswersOptionsByQuiz(response.rows);
    const quiz = quizzes.length > 0 ? quizzes[0] : null;

    reply.code(200).send(quiz);
  } catch (error: unknown) {
    if (error instanceof Error) {
      reply.code(500).send({
        error: "Erreur lors de la récupération des quiz",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      reply.code(500).send({
        error: "Erreur inconnue lors de la récupération des quiz",
      });
    }
  }
}

export async function resetQuizById(
  req: FastifyRequest<{ Body: BodyResetQuizById }>,
  res: FastifyReply
) {
  try {
    const { id_user, id_quiz } = req.body;
    await fastify.pg.transact(async (client) => {
      await client.query("DELETE FROM user_answers WHERE id_user=$1 AND id_quiz=$2", [
        id_user,
        id_quiz,
      ]);
      await client.query("DELETE FROM user_progression WHERE id_user=$1 AND id_quiz=$2", [
        id_user,
        id_quiz,
      ]);
    });
    res.code(200).send("Réinitialisation réussie !");
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de la réinitialisation du quiz",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      res.code(500).send({
        error: "Erreur inconnue lors de la réinitialisation du quiz",
      });
    }
  }
}

export async function createQuiz(request: FastifyRequest<{ Body: QuizToDB }>, reply: FastifyReply) {
  try {
    const { id_module, title } = request.body;

    if (await moduleAlreadyHasQuiz(id_module)) {
      return reply.code(409).send({ error: "Le module a déjà un quiz" });
    }

    const query = "INSERT INTO quiz (id_module, title) VALUES ($1, $2) RETURNING id";
    const values = [id_module, title];
    const result = await fastify.pg.query(query, values);

    reply.code(200).send(result.rows[0].id);
  } catch (error: unknown) {
    if (error instanceof Error) {
      reply.code(500).send({
        error: "Erreur lors de la création du quiz",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      reply.code(500).send({
        error: "Erreur inconnue lors de la création du quiz",
      });
    }
  }
}

export async function moduleAlreadyHasQuiz(id_module: number) {
  try {
    const result = await fastify.pg.query(
      "SELECT id, id_module, title FROM quiz WHERE id_module=$1",
      [id_module]
    );
    console.log("RESULT: ", result.rows[0]);

    if (result.rows[0]) return true;
    return false;
  } catch (error: unknown) {
    throw new Error("Erreur lors de la vérification des quiz du module");
  }
}

export async function deleteQuiz(
  request: FastifyRequest<{ Params: IdParams }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;

    await fastify.pg.query("DELETE FROM quiz WHERE id=$1 RETURNING id", [id]);

    reply.code(200).send(`Quiz ${id} successfully deleted`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      reply.code(500).send({
        error: "Erreur lors de la suppression du quiz",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      reply.code(500).send({
        error: "Erreur inconnue lors de la suppression du quiz",
      });
    }
  }
}
