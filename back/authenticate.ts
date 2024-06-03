import { FastifyReply, FastifyRequest } from "fastify";

export async function authenticate<T>(
  request: FastifyRequest<{ Params: T; Body: T }>,
  reply: FastifyReply
) {
  console.log("AUTHENTICATE: ", request.session.user, request.session.authenticated);
  try {
    if (!request.session.user || !request.session.authenticated) {
      reply.code(401).send("Erreur d'authentification !");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      reply.code(401).send({ message: "Erreur d'authentification !", error: error });
    } else {
      reply.code(401).send({ message: "Erreur d'authentification inconnue !", error: error });
    }
  }
}
