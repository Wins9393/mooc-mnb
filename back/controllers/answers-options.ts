import { FastifyReply, FastifyRequest } from "fastify";
import { fastify } from "../server";
import { AnswerOptionToDB } from "../types/types";

export async function createAnswerOption(
  req: FastifyRequest<{ Body: AnswerOptionToDB }>,
  res: FastifyReply
) {
  try {
    const { id_question, answer_text, correct } = req.body;
    const query =
      "INSERT INTO answers_options (id_question, answer_text, correct) VALUES ($1, $2, $3) RETURNING id";
    const values = [id_question, answer_text, correct];
    const result = await fastify.pg.query(query, values);

    res.code(200).send(result.rows[0].id); // Optionnel
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de la création de la réponse",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      res.code(500).send({
        error: "Erreur inconnue lors de la création de la réponse",
      });
    }
  }
}
