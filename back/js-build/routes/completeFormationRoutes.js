"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authenticate_1 = require("../authenticate");
const checkPermissions_1 = require("../checkPermissions");
const answers_options_1 = require("../controllers/answers-options");
const formations_1 = require("../controllers/formations");
const modules_1 = require("../controllers/modules");
const questions_1 = require("../controllers/questions");
const quiz_1 = require("../controllers/quiz");
const texts_1 = require("../controllers/texts");
const videos_1 = require("../controllers/videos");
const server_1 = require("../server");
/** Formations with Modules */
server_1.fastify.route({
    method: "GET",
    url: "/formations",
    preHandler: [authenticate_1.authenticate],
    handler: formations_1.getFormationsWithModules,
});
server_1.fastify.route({
    method: "GET",
    url: "/formations/:id/contents",
    preHandler: [authenticate_1.authenticate],
    handler: formations_1.getContentsNumberByFormation,
});
/** Modules */
server_1.fastify.route({
    method: "GET",
    url: "/module/:id/content",
    preHandler: [authenticate_1.authenticate],
    handler: modules_1.getModulesWithContentsByModuleId,
});
server_1.fastify.route({
    method: "GET",
    url: "/module/:id/quiz",
    preHandler: [authenticate_1.authenticate],
    handler: modules_1.getQuizByModuleId,
});
/** Questions */
server_1.fastify.route({
    method: "POST",
    url: "/answer/question",
    preHandler: [authenticate_1.authenticate],
    handler: questions_1.getCorrectAnswerByQuestion,
});
server_1.fastify.route({
    method: "POST",
    url: "/questions/formation",
    preHandler: [authenticate_1.authenticate],
    handler: questions_1.getQuestionsByFormation,
});
/** Complete Formation */
server_1.fastify.route({
    method: "POST",
    url: "/complete-formation/create",
    preHandler: [authenticate_1.authenticate, checkPermissions_1.checkPermissions],
    handler: formations_1.createCompleteFormation,
});
/** Create Inutilisés */
/** Answers Options */
server_1.fastify.route({
    method: "POST",
    url: "/answersoptions/create",
    preHandler: [authenticate_1.authenticate, checkPermissions_1.checkPermissions],
    handler: answers_options_1.createAnswerOption,
});
/** Questions */
server_1.fastify.route({
    method: "POST",
    url: "/question/create",
    preHandler: [authenticate_1.authenticate, checkPermissions_1.checkPermissions],
    handler: questions_1.createQuestion,
});
/** Quiz */
server_1.fastify.route({
    method: "POST",
    url: "/quiz/create",
    preHandler: [authenticate_1.authenticate, checkPermissions_1.checkPermissions],
    handler: quiz_1.createQuiz,
});
/** Texts */
server_1.fastify.route({
    method: "POST",
    url: "/text/create",
    preHandler: [authenticate_1.authenticate, checkPermissions_1.checkPermissions],
    handler: texts_1.createText,
});
/** Videos */
server_1.fastify.route({
    method: "POST",
    url: "/video/create",
    preHandler: [authenticate_1.authenticate, checkPermissions_1.checkPermissions],
    handler: videos_1.createVideo,
});
/** Modules */
server_1.fastify.route({
    method: "POST",
    url: "/module/create",
    preHandler: [authenticate_1.authenticate, checkPermissions_1.checkPermissions],
    handler: modules_1.createModule,
});
/** Formations */
server_1.fastify.route({
    method: "POST",
    url: "/formations/create",
    preHandler: [authenticate_1.authenticate, checkPermissions_1.checkPermissions],
    handler: formations_1.createFormation,
});
