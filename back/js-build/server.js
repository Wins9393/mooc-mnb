"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastify = void 0;
const fastify_1 = __importDefault(require("fastify"));
const postgres_1 = __importDefault(require("@fastify/postgres"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const session_1 = __importDefault(require("@fastify/session"));
const static_1 = __importDefault(require("@fastify/static"));
const dotenv = __importStar(require("dotenv"));
const cors_1 = __importDefault(require("@fastify/cors"));
const node_path_1 = __importDefault(require("node:path"));
const users_1 = require("./controllers/users");
const auth_1 = require("./controllers/auth");
const formations_1 = require("./controllers/formations");
const videos_1 = require("./controllers/videos");
dotenv.config();
exports.fastify = (0, fastify_1.default)({
    logger: true,
});
exports.fastify.register(postgres_1.default, {
    connectionString: `postgres://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/mooc-mnb`,
});
exports.fastify.register(cors_1.default, {
    // ajouter des options plus tard
    origin: [`${process.env.FRONT_URL}`],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: true,
    credentials: true,
});
exports.fastify.register(cookie_1.default);
exports.fastify.register(session_1.default, {
    cookieName: "sessionId",
    secret: "a secret with minimum length of 32 characters",
    cookie: { secure: "auto", maxAge: 7 * 24 * 60 * 60 * 1000 },
});
// console.log("PATH: ", path.join(__dirname, "public_videos"));
exports.fastify.register(static_1.default, {
    root: node_path_1.default.join(__dirname, "../public"),
    prefix: "/public/",
    // constraints: { host: process.env.FRONT_URL },
});
/** Auth */
exports.fastify.post("/login", auth_1.login);
exports.fastify.post("/register", auth_1.register);
exports.fastify.post("/logout", auth_1.logout);
exports.fastify.post("/me", auth_1.getCurrentUser);
/** Users */
exports.fastify.get("/users", users_1.getUsers);
/** Formations with Vidéos */
exports.fastify.get("/formations", formations_1.getFormationsWithVideos);
exports.fastify.get("/formation/:id", videos_1.getVideosByFormationIdWithCompleteQuiz);
exports.fastify.listen({ port: 4000 }, (error) => {
    const address = exports.fastify.server.address();
    if (error) {
        throw error;
    }
    if (typeof address === "object" && address !== null) {
        console.log(`Server listening on port ${address.port}`);
    }
    else {
        console.log(`Server is listening on ${address}`);
    }
});
