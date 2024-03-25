import { FastifyReply, FastifyRequest } from "fastify";
import { fastify } from "../server";
import { BodySaveUserAnswer, BodyGetUserAnswer } from "../types/types";

export async function saveUserAnswer(
  req: FastifyRequest<{ Body: BodySaveUserAnswer }>,
  res: FastifyReply
) {
  try {
    const { id_user, id_question, id_answer_option, date_answer, id_quiz } = req.body;

    const query =
      "INSERT INTO user_answers (id_user, id_question, id_answer_option, date_answer, id_quiz) VALUES ($1, $2, $3, $4, $5)";
    const values = [id_user, id_question, id_answer_option, date_answer, id_quiz];

    const results = await fastify.pg.query(query, values);
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
      "SELECT id, id_user, id_question, id_answer_option, date_answer, id_quiz FROM user_answers WHERE id_user=$1 AND id_quiz=$2";
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

// export async function resetQuizById(
//   req: FastifyRequest<{ Body: BodyGetUserAnswer }>,
//   res: FastifyReply
// ) {
//   try {
//     const { id_user, id_quiz } = req.body;
//     const query = "DELETE FROM user_answers WHERE id_user=$1 AND id_quiz=$2";
//     const values = [id_user, id_quiz];
//     const results = fastify.pg.query(query, values);
//     res.code(200).send("Réinitialisation réussie !");
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       res.code(500).send({
//         error: "Erreur lors de la suppression des réponses utilisateur",
//         details: error.message,
//       });
//     } else {
//       // Gestion d'autres types d'erreurs si nécessaire
//       res.code(500).send({
//         error: "Erreur inconnue lors de la suppression des réponses utilisateur",
//       });
//     }
//   }
// }
