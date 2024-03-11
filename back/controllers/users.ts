import { FastifyReply, FastifyRequest } from "fastify";
import { fastify } from "../server";

export async function getUsers(req: FastifyRequest, res: FastifyReply) {
  try {
    const currentUserId = req?.session?.user?.id;
    if (currentUserId) {
      const query = "SELECT id, firstname, lastname, email, role FROM public.users WHERE id != $1";
      const response = await fastify.pg.query(query, [currentUserId]);
      res.code(200).send(response.rows);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de la récupération des users",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      res.code(500).send({
        error: "Erreur inconnue lors de la récupération des users",
      });
    }
  }
}
