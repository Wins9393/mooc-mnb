import { FastifyReply, FastifyRequest } from "fastify";
import { fastify } from "../server";
import { AnswerOptionFromDB, BodyGetCorrectAnswer } from "../types/types";

function structureAnswerByQuestion(
  answerOptions: AnswerOptionFromDB[],
  id_answer_option_selected: number
) {
  const correctAnswer = answerOptions.find((answer) => answer.correct);
  if (correctAnswer) {
    const isCorrectAnswerSelected = correctAnswer.id === id_answer_option_selected;

    return {
      isCorrectAnswerSelected,
      idAnswerOptionSelected: id_answer_option_selected,
      correctAnswer,
    };
  }
}

export async function getCorrectAnswerByQuestion(
  req: FastifyRequest<{ Body: BodyGetCorrectAnswer }>,
  res: FastifyReply
) {
  try {
    const { id_question, id_answer_option_selected } = req.body;
    const query =
      "SELECT id, id_question, answer_text, correct FROM answers_options WHERE id_question=$1";
    const value = [id_question];
    const results = await fastify.pg.query(query, value);

    const correctAnswer = structureAnswerByQuestion(results.rows, id_answer_option_selected);
    res.send(correctAnswer);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de la récupération de la bonne réponse",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      res.code(500).send({
        error: "Erreur inconnue lors de la récupération de la bonne réponse",
      });
    }
  }
}
