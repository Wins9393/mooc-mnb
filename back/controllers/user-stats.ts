import { FastifyReply, FastifyRequest } from "fastify";
import { fastify } from "../server";
import { BodySaveUserAnswer } from "../types/types";

export async function saveUserAnswer(
  req: FastifyRequest<{ Body: BodySaveUserAnswer }>,
  res: FastifyReply
) {
  try {
    const { id_user, id_question, id_answer_option, date_answer } = req.body;

    const query =
      "INSERT INTO user_answers (id_user, id_question, id_answer_option, date_answer) VALUES ($1, $2, $3, $4)";
    const values = [id_user, id_question, id_answer_option, date_answer];

    const results = await fastify.pg.query(query, values);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de la récupération des formations et vidéos",
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
