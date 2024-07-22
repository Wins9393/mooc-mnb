import { FastifyReply, FastifyRequest } from "fastify";
import { fastify } from "../server";
import { IdParamsVideo, VideoToDB } from "../types/types";

export async function createVideo(
  request: FastifyRequest<{ Body: VideoToDB }>,
  reply: FastifyReply
) {
  try {
    const { id_module, path, title, description, cover_path } = request.body;
    const query =
      "INSERT INTO videos (id_module, path, title, description, cover_path) VALUES ($1, $2, $3, $4, $5) RETURNING id";
    const values = [id_module, path, title, description, cover_path];
    const result = await fastify.pg.query(query, values);

    reply.code(200).send(result.rows[0].id); // Optionnel
  } catch (error: unknown) {
    if (error instanceof Error) {
      reply.code(500).send({
        error: "Erreur lors de la création de la video",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      reply.code(500).send({
        error: "Erreur inconnue lors de la création de la video",
      });
    }
  }
}

export async function deleteVideo(
  request: FastifyRequest<{ Params: IdParamsVideo }>,
  reply: FastifyReply
) {
  try {
    const { id_video } = request.params;

    await fastify.pg.query("DELETE FROM videos WHERE id=$1 RETURNING id", [id_video]);

    reply.code(200).send(`Video ${id_video} successfully deleted`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      reply.code(500).send({
        error: "Erreur lors de la suppression de la vidéo",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      reply.code(500).send({
        error: "Erreur inconnue lors de la suppression de la vidéo",
      });
    }
  }
}
