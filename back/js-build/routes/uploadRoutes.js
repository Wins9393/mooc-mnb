"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server");
const authenticate_1 = require("../authenticate");
const upload_1 = require("../controllers/upload");
/** Image */
server_1.fastify.post("/upload/file", { preHandler: authenticate_1.authenticate }, upload_1.uploadFile);
