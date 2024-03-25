import { FastifyReply, FastifyRequest } from "fastify";
import { fastify } from "../server";
import { TextToDB } from "../types/types";

export async function createText(req: FastifyRequest<{ Body: TextToDB }>, res: FastifyReply) {
  try {
    const { id_module, title, content } = req.body;
    const query = "INSERT INTO texts (id_module, title, content) VALUES ($1, $2, $3) RETURNING id";
    const values = [id_module, title, content];
    const result = await fastify.pg.query(query, values);

    res.code(200).send(result.rows[0].id); // Optionnel
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de la création du text",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      res.code(500).send({
        error: "Erreur inconnue lors de la création du text",
      });
    }
  }
}
