import Fastify from "fastify";
import fastifyPostgres from "@fastify/postgres";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import fastifyStatic from "@fastify/static";
import * as dotenv from "dotenv";
import cors from "@fastify/cors";
import path from "node:path";

import { getUsers } from "./controllers/users";
import { getCurrentUser, login, logout, register } from "./controllers/auth";
import { getFormationsWithModules } from "./controllers/formations";
import { getCorrectAnswerByQuestion } from "./controllers/questions";
import { getUserAnswersByQuizId, saveUserAnswer } from "./controllers/user-stats";
import {
  getModulesWithContentsByModuleId,
  getQuizByModuleId,
  resetQuizById,
} from "./controllers/modules";

dotenv.config({ path: "./.env.local" });

export const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyPostgres, {
  connectionString: `postgres://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/moocmnbwithmodules`,
});

fastify.register(cors, {
  // ajouter des options plus tard
  origin: [`${process.env.FRONT_URL}`],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: true,
  credentials: true,
});

fastify.register(fastifyCookie);
fastify.register(fastifySession, {
  cookieName: "sessionId",
  secret: "a secret with minimum length of 32 characters",
  cookie: { secure: "auto", maxAge: 7 * 24 * 60 * 60 * 1000 },
});
// console.log("PATH: ", path.join(__dirname, "public_videos"));
fastify.register(fastifyStatic, {
  root: path.join(__dirname, "../public"),
  prefix: "/public/",
  // constraints: { host: process.env.FRONT_URL },
});

/** Auth */
fastify.post("/login", login);
fastify.post("/register", register);
fastify.post("/logout", logout);
fastify.post("/me", getCurrentUser);

/** Users */
fastify.get("/users", getUsers);

/** Formations with Modules */
fastify.get("/formations", getFormationsWithModules);

/** Modules */
fastify.get("/module/:id/content", getModulesWithContentsByModuleId);
fastify.get("/module/:id/quiz", getQuizByModuleId);

/** Questions */
fastify.post("/answer/question", getCorrectAnswerByQuestion);

/** User Stats */
fastify.post("/stats/save", saveUserAnswer);
fastify.post("/stats/useranswers", getUserAnswersByQuizId);
fastify.post("/stats/useranswers/delete", resetQuizById);

fastify.listen({ port: 4000 }, (error: unknown) => {
  const address = fastify.server.address();
  if (error) {
    throw error;
  }
  if (typeof address === "object" && address !== null) {
    console.log(`Server listening on port ${address.port}`);
  } else {
    console.log(`Server is listening on ${address}`);
  }
});
