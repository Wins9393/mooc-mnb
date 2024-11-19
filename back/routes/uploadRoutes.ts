import { fastify } from "../server";
import { authenticate } from "../authenticate";
import { uploadFile } from "../controllers/upload";

/** Image */
// fastify.post("/upload/file", { preHandler: authenticate }, uploadFile);

fastify.route<{ Params: {}; Body: {} }>({
  method: "POST",
  url: "/api/upload/file",
  preHandler: [authenticate],
  handler: uploadFile,
});
