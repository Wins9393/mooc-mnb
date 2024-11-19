import { authenticate } from "../authenticate";
import { getCurrentUser, login, logout, register } from "../controllers/auth";
import { fastify } from "../server";

fastify.route({
  method: "POST",
  url: "/api/login",
  handler: login,
});

fastify.route({
  method: "POST",
  url: "/api/register",
  handler: register,
});

fastify.route({
  method: "POST",
  url: "/api/logout",
  handler: logout,
});

fastify.route<{ Params: {}; Body: {} }>({
  method: "POST",
  url: "/api/me",
  preHandler: [authenticate],
  handler: getCurrentUser,
});
