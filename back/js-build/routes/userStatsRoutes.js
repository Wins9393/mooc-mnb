"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authenticate_1 = require("../authenticate");
const quiz_1 = require("../controllers/quiz");
const user_stats_1 = require("../controllers/user-stats");
const server_1 = require("../server");
/** User Stats */
server_1.fastify.route({
    method: "POST",
    url: "/stats/save",
    preHandler: [authenticate_1.authenticate],
    handler: user_stats_1.saveUserAnswer,
});
server_1.fastify.route({
    method: "POST",
    url: "/stats/useranswers",
    preHandler: [authenticate_1.authenticate],
    handler: user_stats_1.getUserAnswersByQuizId,
});
server_1.fastify.route({
    method: "POST",
    url: "/stats/useranswers/user/formation",
    preHandler: [authenticate_1.authenticate],
    handler: user_stats_1.getUserAnswersByFormationByUser,
});
server_1.fastify.route({
    method: "POST",
    url: "/stats/useranswers/delete",
    preHandler: [authenticate_1.authenticate],
    handler: quiz_1.resetQuizById,
});
server_1.fastify.route({
    method: "POST",
    url: "/progression/user",
    preHandler: [authenticate_1.authenticate],
    handler: user_stats_1.getUserProgressionByUser,
});
server_1.fastify.route({
    method: "POST",
    url: "/progression/save",
    preHandler: [authenticate_1.authenticate],
    handler: user_stats_1.saveUserProgression,
});
