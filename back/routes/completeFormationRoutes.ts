import { authenticate } from "../authenticate";
import { checkPermissions } from "../checkPermissions";
import { createAnswerOption } from "../controllers/answers-options";
import {
  createCompleteFormation,
  createFormation,
  getContentsNumberByFormation,
  getFormationsWithModules,
} from "../controllers/formations";
import {
  createModule,
  getModulesWithContentsByModuleId,
  getQuizByModuleId,
} from "../controllers/modules";
import {
  createQuestion,
  getCorrectAnswerByQuestion,
  getQuestionsByFormation,
} from "../controllers/questions";
import { createQuiz } from "../controllers/quiz";
import { createText } from "../controllers/texts";
import { createVideo } from "../controllers/videos";
import { fastify } from "../server";
import {
  AnswerOptionToDB,
  BodyGetCorrectAnswer,
  FormationToDB,
  IdParams,
  ModuleToDB,
  QuestionToDB,
  QuestionsByFormationBody,
  QuizToDB,
  TextToDB,
  VideoToDB,
} from "../types/types";

/** Formations with Modules */
fastify.route<{ Params: {}; Body: {} }>({
  method: "GET",
  url: "/formations",
  preHandler: [authenticate],
  handler: getFormationsWithModules,
});

fastify.route<{ Params: IdParams; Body: {} }>({
  method: "GET",
  url: "/formations/:id/contents",
  preHandler: [authenticate],
  handler: getContentsNumberByFormation,
});

/** Modules */
fastify.route<{ Params: IdParams; Body: {} }>({
  method: "GET",
  url: "/module/:id/content",
  preHandler: [authenticate],
  handler: getModulesWithContentsByModuleId,
});

fastify.route<{ Params: IdParams; Body: {} }>({
  method: "GET",
  url: "/module/:id/quiz",
  preHandler: [authenticate],
  handler: getQuizByModuleId,
});

/** Questions */
fastify.route<{ Params: {}; Body: BodyGetCorrectAnswer }>({
  method: "POST",
  url: "/answer/question",
  preHandler: [authenticate],
  handler: getCorrectAnswerByQuestion,
});

fastify.route<{ Params: {}; Body: QuestionsByFormationBody }>({
  method: "POST",
  url: "/questions/formation",
  preHandler: [authenticate],
  handler: getQuestionsByFormation,
});

/** Complete Formation */
fastify.route<{ Params: {}; Body: {} }>({
  method: "POST",
  url: "/complete-formation/create",
  preHandler: [authenticate, checkPermissions],
  handler: createCompleteFormation,
});

/** Create Inutilisés */

/** Answers Options */
fastify.route<{ Params: {}; Body: AnswerOptionToDB }>({
  method: "POST",
  url: "/answersoptions/create",
  preHandler: [authenticate, checkPermissions],
  handler: createAnswerOption,
});

/** Questions */
fastify.route<{ Params: {}; Body: QuestionToDB }>({
  method: "POST",
  url: "/question/create",
  preHandler: [authenticate, checkPermissions],
  handler: createQuestion,
});

/** Quiz */
fastify.route<{ Params: {}; Body: QuizToDB }>({
  method: "POST",
  url: "/quiz/create",
  preHandler: [authenticate, checkPermissions],
  handler: createQuiz,
});

/** Texts */
fastify.route<{ Params: {}; Body: TextToDB }>({
  method: "POST",
  url: "/text/create",
  preHandler: [authenticate, checkPermissions],
  handler: createText,
});

/** Videos */
fastify.route<{ Params: {}; Body: VideoToDB }>({
  method: "POST",
  url: "/video/create",
  preHandler: [authenticate, checkPermissions],
  handler: createVideo,
});

/** Modules */
fastify.route<{ Params: {}; Body: ModuleToDB }>({
  method: "POST",
  url: "/module/create",
  preHandler: [authenticate, checkPermissions],
  handler: createModule,
});

/** Formations */
fastify.route<{ Params: {}; Body: FormationToDB }>({
  method: "POST",
  url: "/formations/create",
  preHandler: [authenticate, checkPermissions],
  handler: createFormation,
});
