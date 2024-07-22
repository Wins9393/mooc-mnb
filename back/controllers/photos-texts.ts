import { FastifyReply, FastifyRequest } from "fastify";
import { fastify } from "../server";
import { IdParamsPhotoText, PhotoTextToDB } from "../types/types";

export async function createPhotoText(
  request: FastifyRequest<{ Body: PhotoTextToDB }>,
  reply: FastifyReply
) {
  try {
    const { id_module, title, description, photo_path, text_content } = request.body;

    const result = await fastify.pg.query(
      "INSERT INTO photo_text(id_module, title, description, photo_path, text_content) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [id_module, title, description, photo_path, text_content]
    );

    reply.code(200).send(result.rows[0].id);
  } catch (error: unknown) {
    if (error instanceof Error) {
      reply.code(500).send({
        error: "Erreur lors de la création du photo text",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      reply.code(500).send({
        error: "Erreur inconnue lors de la création du photo text",
      });
    }
  }
}

export async function deletePhotoText(
  request: FastifyRequest<{ Params: IdParamsPhotoText }>,
  reply: FastifyReply
) {
  try {
    const { id_photo_text } = request.params;

    await fastify.pg.query("DELETE FROM photo_text WHERE id=$1 RETURNING id", [id_photo_text]);

    reply.code(200).send(`Photo + Text ${id_photo_text} successfully deleted`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      reply.code(500).send({
        error: "Erreur lors de la suppression du photo text",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      reply.code(500).send({
        error: "Erreur inconnue lors de la suppression du photo text",
      });
    }
  }
}
