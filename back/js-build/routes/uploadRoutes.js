"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server");
const authenticate_1 = require("../authenticate");
const upload_1 = require("../controllers/upload");
/** Image */
// fastify.post("/upload/file", { preHandler: authenticate }, uploadFile);
server_1.fastify.route({
    method: "POST",
    url: "/upload/file",
    preHandler: [authenticate_1.authenticate],
    handler: upload_1.uploadFile,
});
