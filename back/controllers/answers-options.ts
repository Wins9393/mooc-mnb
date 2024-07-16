import { FastifyReply, FastifyRequest } from "fastify";
import { fastify } from "../server";
import { AnswerOptionToDB, IdParams } from "../types/types";

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

export async function deleteAnswerOption(
  request: FastifyRequest<{ Params: IdParams }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;

    await fastify.pg.query("DELETE FROM answers_options WHERE id=$1 RETURNING id", [id]);

    reply.code(200).send(`Answer Option ${id} successfully deleted`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      reply.code(500).send({
        error: "Erreur lors de la suppression de la reponse",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      reply.code(500).send({
        error: "Erreur inconnue lors de la suppression de la reponse",
      });
    }
  }
}
