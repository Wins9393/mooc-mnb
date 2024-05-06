import { FastifyReply, FastifyRequest } from "fastify";
import { fastify } from "../server";
import { BodySaveUserAnswer, BodyGetUserAnswer, UserProgression, IdParams } from "../types/types";

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

export async function getUserProgressionByUser(
  req: FastifyRequest<{ Body: IdParams }>,
  res: FastifyReply
) {
  try {
    const { id } = req.body;
    const response = await fastify.pg.query(
      "SELECT id, id_user, id_formation, id_module, id_video, id_text, id_quiz, complete FROM user_progression WHERE id_user = $1",
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
    const { id_user, id_formation, id_module, id_video, id_text, id_quiz, complete } = req.body;
    const response = await fastify.pg.query(
      "INSERT INTO user_progression (id_user, id_formation, id_module, id_video, id_text, id_quiz, complete) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [id_user, id_formation, id_module, id_video, id_text, id_quiz, complete]
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
