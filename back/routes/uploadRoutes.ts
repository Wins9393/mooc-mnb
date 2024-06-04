import { fastify } from "../server";
import { authenticate } from "../authenticate";
import { uploadFile } from "../controllers/upload";

/** Image */
fastify.post("/upload/file", { preHandler: authenticate }, uploadFile);
