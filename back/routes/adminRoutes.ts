import { authenticate } from "../authenticate";
import { checkPermissions } from "../checkPermissions";
import { getOneUser, getUsers } from "../controllers/users";
import { fastify } from "../server";
import { IdParams } from "../types/types";

fastify.route<{ Params: {}; Body: {} }>({
  method: "GET",
  url: "/users",
  preHandler: [authenticate, checkPermissions],
  handler: getUsers,
});

fastify.route<{ Params: IdParams; Body: {} }>({
  method: "GET",
  url: "/user/:id",
  preHandler: [authenticate, checkPermissions],
  handler: getOneUser,
});
