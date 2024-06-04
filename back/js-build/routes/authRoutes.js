"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authenticate_1 = require("../authenticate");
const auth_1 = require("../controllers/auth");
const server_1 = require("../server");
server_1.fastify.route({
    method: "POST",
    url: "/login",
    handler: auth_1.login,
});
server_1.fastify.route({
    method: "POST",
    url: "/register",
    handler: auth_1.register,
});
server_1.fastify.route({
    method: "POST",
    url: "/logout",
    handler: auth_1.logout,
});
server_1.fastify.route({
    method: "POST",
    url: "/me",
    preHandler: [authenticate_1.authenticate],
    handler: auth_1.getCurrentUser,
});
