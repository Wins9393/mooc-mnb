import { FastifyReply, FastifyRequest } from "fastify";
import { fastify } from "../server";
import { ModuleToDB, IdParams } from "../types/types";

export async function getModulesWithContentsByModuleId(
  request: FastifyRequest<{ Params: IdParams }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const videosQuery =
      "SELECT v.id AS id_video, v.path AS path_video, v.title AS title_video, v.description AS description_video, v.cover_path AS cover_path_video FROM videos v WHERE v.id_module=$1";
    const textsQuery =
      "SELECT t.id AS id_text, t.title AS title_text, t.content AS content_text FROM texts t WHERE t.id_module=$1";
    const value = [id];
    const photosTextsQuery =
      "SELECT pt.id AS id_photo_text, pt.title AS title_photo_text, pt.description AS description_photo_text, pt.photo_path AS photo_path_photo_text, pt.text_content AS text_content_photo_text FROM photo_text pt WHERE id_module=$1";

    const videosResponse = await fastify.pg.query(videosQuery, value);
    const textsResponse = await fastify.pg.query(textsQuery, value);
    const photosTextsResponse = await fastify.pg.query(photosTextsQuery, value);

    const result = {
      id: Number(id),
      videos: videosResponse.rows,
      texts: textsResponse.rows,
      photos_texts: photosTextsResponse.rows,
    };

    reply.code(200).send(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      reply.code(500).send({
        error: "Erreur lors de la récupération des modules et de leurs contenu",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      reply.code(500).send({
        error: "Erreur inconnue lors de la récupération des modules et de leurs contenu",
      });
    }
  }
}

export async function createModule(
  request: FastifyRequest<{ Body: ModuleToDB }>,
  reply: FastifyReply
) {
  try {
    const { id_formation, title, description } = request.body;
    const query =
      "INSERT INTO modules (id_formation, title, description) VALUES ($1, $2, $3) RETURNING id";
    const values = [id_formation, title, description];
    const result = await fastify.pg.query(query, values);

    reply.code(200).send(result.rows[0].id);
  } catch (error: unknown) {
    if (error instanceof Error) {
      reply.code(500).send({
        error: "Erreur lors de la création du module",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      reply.code(500).send({
        error: "Erreur inconnue lors de la création du module",
      });
    }
  }
}

export async function deleteModule(
  request: FastifyRequest<{ Params: IdParams }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;

    await fastify.pg.query("DELETE FROM modules WHERE id=$1 RETURNING id", [id]);

    reply.code(200).send(`Module ${id} successfully deleted`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      reply.code(500).send({
        error: "Erreur lors de la suppression du module",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      reply.code(500).send({
        error: "Erreur inconnue lors de la suppression du module",
      });
    }
  }
}
