import { authenticate } from "../authenticate";
import { checkPermissions } from "../checkPermissions";
import { getUsers } from "../controllers/users";
import { fastify } from "../server";

fastify.route<{ Params: {}; Body: {} }>({
  method: "GET",
  url: "/users",
  preHandler: [authenticate, checkPermissions],
  handler: getUsers,
});
