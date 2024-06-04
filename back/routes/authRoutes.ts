import { authenticate } from "../authenticate";
import { getCurrentUser, login, logout, register } from "../controllers/auth";
import { fastify } from "../server";

fastify.route({
  method: "POST",
  url: "/login",
  handler: login,
});

fastify.route({
  method: "POST",
  url: "/register",
  handler: register,
});

fastify.route({
  method: "POST",
  url: "/logout",
  handler: logout,
});

fastify.route<{ Params: {}; Body: {} }>({
  method: "POST",
  url: "/me",
  preHandler: [authenticate],
  handler: getCurrentUser,
});
