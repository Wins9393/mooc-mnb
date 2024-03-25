import { FastifyReply, FastifyRequest } from "fastify";
import { fastify } from "../server";
import { BodyResetQuizById, QuizToDB } from "../types/types";

export async function resetQuizById(
  req: FastifyRequest<{ Body: BodyResetQuizById }>,
  res: FastifyReply
) {
  try {
    const { id_user, id_quiz } = req.body;
    const query = "DELETE FROM user_answers WHERE id_user=$1 AND id_quiz=$2";
    const values = [id_user, id_quiz];
    const results = await fastify.pg.query(query, values);
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

export async function createQuiz(req: FastifyRequest<{ Body: QuizToDB }>, res: FastifyReply) {
  try {
    const { id_module, title } = req.body;
    const query = "INSERT INTO quiz (id_module, title) VALUES ($1, $2) RETURNING id";
    const values = [id_module, title];
    const result = await fastify.pg.query(query, values);

    res.code(200).send(result.rows[0].id);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de la création du quiz",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      res.code(500).send({
        error: "Erreur inconnue lors de la création du quiz",
      });
    }
  }
}
