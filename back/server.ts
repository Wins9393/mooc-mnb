import Fastify from "fastify";
import fastifyPostgres from "@fastify/postgres";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import fastifyStatic from "@fastify/static";
import fastifyMultipart from "@fastify/multipart";
import * as dotenv from "dotenv";
import cors from "@fastify/cors";
import path from "node:path";
import { authenticate } from "./authenticate";

import { getUsers } from "./controllers/users";
import { getCurrentUser, login, logout, register } from "./controllers/auth";
import {
  createCompleteFormation,
  createFormation,
  getContentsNumberByFormation,
  getFormationsWithModules,
} from "./controllers/formations";
import {
  createQuestion,
  getCorrectAnswerByQuestion,
  getQuestionsByFormation,
} from "./controllers/questions";
import {
  getUserAnswersByFormationByUser,
  getUserAnswersByQuizId,
  getUserProgressionByUser,
  saveUserAnswer,
  saveUserProgression,
} from "./controllers/user-stats";
import {
  createModule,
  getModulesWithContentsByModuleId,
  getQuizByModuleId,
} from "./controllers/modules";
import { createVideo } from "./controllers/videos";
import { createText } from "./controllers/texts";
import { createQuiz, resetQuizById } from "./controllers/quiz";
import { createAnswerOption } from "./controllers/answers-options";
import { uploadFile } from "./controllers/upload";
import {
  AnswerOptionToDB,
  BodyGetCorrectAnswer,
  BodyGetUserAnswer,
  BodyResetQuizById,
  BodySaveUserAnswer,
  FormationToDB,
  IdParams,
  ModuleToDB,
  QuestionToDB,
  QuestionsByFormationBody,
  QuizToDB,
  TextToDB,
  UserAnswersByFormationByUser,
  UserProgression,
  VideoToDB,
} from "./types/types";

dotenv.config({ path: "./.env.local" });

export const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyPostgres, {
  connectionString: `postgres://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/moocmnb`,
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

fastify.register(fastifyMultipart, {
  limits: {
    fileSize: 1e8,
  },
});

/** Auth */
fastify.post("/login", login);
fastify.post("/register", register);
fastify.post("/logout", logout);
fastify.post("/me", getCurrentUser);

/** Users */
fastify.get("/users", { preHandler: authenticate }, getUsers);

/** Formations with Modules */
fastify.get("/formations", { preHandler: authenticate }, getFormationsWithModules);
fastify.get(
  "/formations/:id/contents",
  { preHandler: authenticate<IdParams> },
  getContentsNumberByFormation
);
fastify.post("/formations/create", { preHandler: authenticate<FormationToDB> }, createFormation);

/** Modules */
fastify.get(
  "/module/:id/content",
  { preHandler: authenticate<IdParams> },
  getModulesWithContentsByModuleId
);
fastify.get("/module/:id/quiz", { preHandler: authenticate<IdParams> }, getQuizByModuleId);
fastify.post("/module/create", { preHandler: authenticate<ModuleToDB> }, createModule);

/** Videos */
fastify.post("/video/create", { preHandler: authenticate<VideoToDB> }, createVideo);

/** Texts */
fastify.post("/text/create", { preHandler: authenticate<TextToDB> }, createText);

/** Quiz */
fastify.post("/quiz/create", { preHandler: authenticate<QuizToDB> }, createQuiz);

/** Questions */
fastify.post(
  "/answer/question",
  { preHandler: authenticate<BodyGetCorrectAnswer> },
  getCorrectAnswerByQuestion
);
fastify.post(
  "/questions/formation",
  { preHandler: authenticate<QuestionsByFormationBody> },
  getQuestionsByFormation
);
fastify.post("/question/create", { preHandler: authenticate<QuestionToDB> }, createQuestion);

/** User Stats */
fastify.post("/stats/save", { preHandler: authenticate<BodySaveUserAnswer> }, saveUserAnswer);
fastify.post(
  "/stats/useranswers",
  { preHandler: authenticate<BodyGetUserAnswer> },
  getUserAnswersByQuizId
);
fastify.post(
  "/stats/useranswers/user/formation",
  { preHandler: authenticate<UserAnswersByFormationByUser> },
  getUserAnswersByFormationByUser
);
fastify.post(
  "/stats/useranswers/delete",
  { preHandler: authenticate<BodyResetQuizById> },
  resetQuizById
);
fastify.post("/progression/user", { preHandler: authenticate<IdParams> }, getUserProgressionByUser);
fastify.post(
  "/progression/save",
  { preHandler: authenticate<UserProgression> },
  saveUserProgression
);

/** Answers Options */
fastify.post(
  "/answersoptions/create",
  { preHandler: authenticate<AnswerOptionToDB> },
  createAnswerOption
);

/** Image */
fastify.post("/upload/file", { preHandler: authenticate }, uploadFile);

/** Complete Formation */
fastify.post("/complete-formation/create", { preHandler: authenticate }, createCompleteFormation);

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
