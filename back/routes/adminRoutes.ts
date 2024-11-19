import { authenticate } from "../authenticate";
import { checkPermissions } from "../checkPermissions";
import { deleteAnswerOption } from "../controllers/answers-options";
import { deleteFormation, updateFormation } from "../controllers/formations";
import { deleteModule } from "../controllers/modules";
import { deletePhotoText } from "../controllers/photos-texts";
import { deleteQuestion } from "../controllers/questions";
import { deleteQuiz } from "../controllers/quiz";
import { deleteText } from "../controllers/texts";
import { getOneUser, getUsers } from "../controllers/users";
import { deleteVideo } from "../controllers/videos";
import { fastify } from "../server";
import {
  Formation,
  IdParams,
  IdParamsPhotoText,
  IdParamsText,
  IdParamsVideo,
} from "../types/types";

/** Users */
fastify.route<{ Params: {}; Body: {} }>({
  method: "GET",
  url: "/api/users",
  preHandler: [authenticate, checkPermissions],
  handler: getUsers,
});

fastify.route<{ Params: IdParams; Body: {} }>({
  method: "GET",
  url: "/api/user/:id",
  preHandler: [authenticate, checkPermissions],
  handler: getOneUser,
});

/** Formations */
fastify.route<{ Params: {}; Body: Formation }>({
  method: "POST",
  url: "/api/formation/update",
  preHandler: [authenticate, checkPermissions],
  handler: updateFormation,
});

fastify.route<{ Params: IdParams; Body: {} }>({
  method: "POST",
  url: "/api/formation/:id/delete",
  preHandler: [authenticate, checkPermissions],
  handler: deleteFormation,
});

/** Modules */
fastify.route<{ Params: IdParams; Body: {} }>({
  method: "POST",
  url: "/api/module/:id/delete",
  preHandler: [authenticate, checkPermissions],
  handler: deleteModule,
});

/** Videos */
fastify.route<{ Params: IdParamsVideo; Body: {} }>({
  method: "POST",
  url: "/api/video/:id_video/delete",
  preHandler: [authenticate, checkPermissions],
  handler: deleteVideo,
});

/** Texts */
fastify.route<{ Params: IdParamsText; Body: {} }>({
  method: "POST",
  url: "/api/text/:id_text/delete",
  preHandler: [authenticate, checkPermissions],
  handler: deleteText,
});

/** Photos + Texts */
fastify.route<{ Params: IdParamsPhotoText; Body: {} }>({
  method: "POST",
  url: "/api/photo_text/:id_photo_text/delete",
  preHandler: [authenticate, checkPermissions],
  handler: deletePhotoText,
});

/** Quiz */
fastify.route<{ Params: IdParams; Body: {} }>({
  method: "POST",
  url: "/api/quiz/:id/delete",
  preHandler: [authenticate, checkPermissions],
  handler: deleteQuiz,
});

/** Questions */
fastify.route<{ Params: IdParams; Body: {} }>({
  method: "POST",
  url: "/api/question/:id/delete",
  preHandler: [authenticate, checkPermissions],
  handler: deleteQuestion,
});

/** AnswerOptions */
fastify.route<{ Params: IdParams; Body: {} }>({
  method: "POST",
  url: "/api/answer_option/:id/delete",
  preHandler: [authenticate, checkPermissions],
  handler: deleteAnswerOption,
});
