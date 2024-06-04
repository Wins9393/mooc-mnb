import { FastifyReply, FastifyRequest } from "fastify";

export async function checkPermissions<T>(request: FastifyRequest, reply: FastifyReply) {
  try {
    if (request.session.user?.role !== "sadmin" && request.session.user?.role !== "admin") {
      reply.code(401).send("Erreur de permissions");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      reply.code(401).send({ message: "Erreur de permissions !", error: error });
    } else {
      reply.code(401).send({ message: "Erreur de permissions inconnue !", error: error });
    }
  }
}
