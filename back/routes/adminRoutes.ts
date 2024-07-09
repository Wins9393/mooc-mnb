import { authenticate } from "../authenticate";
import { checkPermissions } from "../checkPermissions";
import { updateFormation } from "../controllers/formations";
import { getOneUser, getUsers } from "../controllers/users";
import { fastify } from "../server";
import { Formation, IdParams } from "../types/types";

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

fastify.route<{ Params: {}; Body: Formation }>({
  method: "POST",
  url: "/formation/update",
  preHandler: [authenticate, checkPermissions],
  handler: updateFormation,
});
