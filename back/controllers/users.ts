import { FastifyReply, FastifyRequest } from "fastify";
import { fastify } from "../server";

export async function getUsers(request: FastifyRequest, reply: FastifyReply) {
  try {
    const currentUserId = request.session.user?.id;
    if (currentUserId) {
      const query =
        "SELECT id, firstname, lastname, shop, email, role, created_at FROM public.users WHERE id != $1";
      const response = await fastify.pg.query(query, [currentUserId]);
      reply.code(200).send(response.rows);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      reply.code(500).send({
        error: "Erreur lors de la récupération des users",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      reply.code(500).send({
        error: "Erreur inconnue lors de la récupération des users",
      });
    }
  }
}
