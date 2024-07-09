"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authenticate_1 = require("../authenticate");
const checkPermissions_1 = require("../checkPermissions");
const formations_1 = require("../controllers/formations");
const users_1 = require("../controllers/users");
const server_1 = require("../server");
server_1.fastify.route({
    method: "GET",
    url: "/users",
    preHandler: [authenticate_1.authenticate, checkPermissions_1.checkPermissions],
    handler: users_1.getUsers,
});
server_1.fastify.route({
    method: "GET",
    url: "/user/:id",
    preHandler: [authenticate_1.authenticate, checkPermissions_1.checkPermissions],
    handler: users_1.getOneUser,
});
server_1.fastify.route({
    method: "POST",
    url: "/formation/update",
    preHandler: [authenticate_1.authenticate, checkPermissions_1.checkPermissions],
    handler: formations_1.updateFormation,
});
