import { authenticate } from "../authenticate";
import { checkPermissions } from "../checkPermissions";
import { createAnswerOption } from "../controllers/answers-options";
import {
  createCompleteFormation,
  createFormation,
  getContentsNumberByFormation,
  getFormationsWithModules,
} from "../controllers/formations";
import { createModule, getModulesWithContentsByModuleId } from "../controllers/modules";
import { createPhotoText } from "../controllers/photos-texts";
import {
  createQuestion,
  getCorrectAnswerByQuestion,
  getQuestionsByFormation,
} from "../controllers/questions";
import { createQuiz, getQuizByModuleId } from "../controllers/quiz";
import { createText } from "../controllers/texts";
import { createVideo } from "../controllers/videos";
import { fastify } from "../server";
import {
  AnswerOptionToDB,
  BodyGetCorrectAnswer,
  FormationToDB,
  IdParams,
  ModuleToDB,
  PhotoTextToDB,
  QuestionToDB,
  QuestionsByFormationBody,
  QuizToDB,
  TextToDB,
  VideoToDB,
} from "../types/types";

/** Formations with Modules */
fastify.route<{ Params: {}; Body: {} }>({
  method: "GET",
  url: "/api/formations",
  preHandler: [authenticate],
  handler: getFormationsWithModules,
});

fastify.route<{ Params: IdParams; Body: {} }>({
  method: "GET",
  url: "/api/formations/:id/contents",
  preHandler: [authenticate],
  handler: getContentsNumberByFormation,
});

/** Modules */
fastify.route<{ Params: {}; Body: ModuleToDB }>({
  method: "POST",
  url: "/api/module/create",
  preHandler: [authenticate, checkPermissions],
  handler: createModule,
});

fastify.route<{ Params: IdParams; Body: {} }>({
  method: "GET",
  url: "/api/module/:id/content",
  preHandler: [authenticate],
  handler: getModulesWithContentsByModuleId,
});

fastify.route<{ Params: IdParams; Body: {} }>({
  method: "GET",
  url: "/api/module/:id/quiz",
  preHandler: [authenticate],
  handler: getQuizByModuleId,
});

/** Questions */
fastify.route<{ Params: {}; Body: QuestionToDB }>({
  method: "POST",
  url: "/api/question/create",
  preHandler: [authenticate, checkPermissions],
  handler: createQuestion,
});

fastify.route<{ Params: {}; Body: BodyGetCorrectAnswer }>({
  method: "POST",
  url: "/api/answer/question",
  preHandler: [authenticate],
  handler: getCorrectAnswerByQuestion,
});

fastify.route<{ Params: {}; Body: QuestionsByFormationBody }>({
  method: "POST",
  url: "/api/questions/formation",
  preHandler: [authenticate],
  handler: getQuestionsByFormation,
});

/** Complete Formation */
fastify.route<{ Params: {}; Body: {} }>({
  method: "POST",
  url: "/api/complete-formation/create",
  preHandler: [authenticate, checkPermissions],
  handler: createCompleteFormation,
});

fastify.route<{ Params: {}; Body: FormationToDB }>({
  method: "POST",
  url: "/api/formations/create",
  preHandler: [authenticate, checkPermissions],
  handler: createFormation,
});

/** Videos */
fastify.route<{ Params: {}; Body: VideoToDB }>({
  method: "POST",
  url: "/api/video/create",
  preHandler: [authenticate, checkPermissions],
  handler: createVideo,
});

/** Texts */
fastify.route<{ Params: {}; Body: TextToDB }>({
  method: "POST",
  url: "/api/text/create",
  preHandler: [authenticate, checkPermissions],
  handler: createText,
});

/** Photos Texts */
fastify.route<{ Params: {}; Body: PhotoTextToDB }>({
  method: "POST",
  url: "/api/photo_text/create",
  preHandler: [authenticate, checkPermissions],
  handler: createPhotoText,
});

/** Quiz */
fastify.route<{ Params: {}; Body: QuizToDB }>({
  method: "POST",
  url: "/api/quiz/create",
  preHandler: [authenticate, checkPermissions],
  handler: createQuiz,
});

/** Answers Options */
fastify.route<{ Params: {}; Body: AnswerOptionToDB }>({
  method: "POST",
  url: "/api/answer_option/create",
  preHandler: [authenticate, checkPermissions],
  handler: createAnswerOption,
});
