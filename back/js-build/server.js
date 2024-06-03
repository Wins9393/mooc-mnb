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
const multipart_1 = __importDefault(require("@fastify/multipart"));
const dotenv = __importStar(require("dotenv"));
const cors_1 = __importDefault(require("@fastify/cors"));
const node_path_1 = __importDefault(require("node:path"));
const authenticate_1 = require("./authenticate");
const users_1 = require("./controllers/users");
const auth_1 = require("./controllers/auth");
const formations_1 = require("./controllers/formations");
const questions_1 = require("./controllers/questions");
const user_stats_1 = require("./controllers/user-stats");
const modules_1 = require("./controllers/modules");
const videos_1 = require("./controllers/videos");
const texts_1 = require("./controllers/texts");
const quiz_1 = require("./controllers/quiz");
const answers_options_1 = require("./controllers/answers-options");
const upload_1 = require("./controllers/upload");
dotenv.config({ path: "./.env.local" });
exports.fastify = (0, fastify_1.default)({
    logger: true,
});
exports.fastify.register(postgres_1.default, {
    connectionString: `postgres://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/moocmnbwithmodules`,
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
exports.fastify.register(multipart_1.default, {
    limits: {
        fileSize: 1e8,
    },
});
/** Auth */
exports.fastify.post("/login", auth_1.login);
exports.fastify.post("/register", auth_1.register);
exports.fastify.post("/logout", auth_1.logout);
exports.fastify.post("/me", auth_1.getCurrentUser);
/** Users */
exports.fastify.get("/users", { preHandler: authenticate_1.authenticate }, users_1.getUsers);
/** Formations with Modules */
exports.fastify.get("/formations", { preHandler: authenticate_1.authenticate }, formations_1.getFormationsWithModules);
exports.fastify.get("/formations/:id/contents", { preHandler: (authenticate_1.authenticate) }, formations_1.getContentsNumberByFormation);
exports.fastify.post("/formations/create", { preHandler: (authenticate_1.authenticate) }, formations_1.createFormation);
/** Modules */
exports.fastify.get("/module/:id/content", { preHandler: (authenticate_1.authenticate) }, modules_1.getModulesWithContentsByModuleId);
exports.fastify.get("/module/:id/quiz", { preHandler: (authenticate_1.authenticate) }, modules_1.getQuizByModuleId);
exports.fastify.post("/module/create", { preHandler: (authenticate_1.authenticate) }, modules_1.createModule);
/** Videos */
exports.fastify.post("/video/create", { preHandler: (authenticate_1.authenticate) }, videos_1.createVideo);
/** Texts */
exports.fastify.post("/text/create", { preHandler: (authenticate_1.authenticate) }, texts_1.createText);
/** Quiz */
exports.fastify.post("/quiz/create", { preHandler: (authenticate_1.authenticate) }, quiz_1.createQuiz);
/** Questions */
exports.fastify.post("/answer/question", { preHandler: (authenticate_1.authenticate) }, questions_1.getCorrectAnswerByQuestion);
exports.fastify.post("/questions/formation", { preHandler: (authenticate_1.authenticate) }, questions_1.getQuestionsByFormation);
exports.fastify.post("/question/create", { preHandler: (authenticate_1.authenticate) }, questions_1.createQuestion);
/** User Stats */
exports.fastify.post("/stats/save", { preHandler: (authenticate_1.authenticate) }, user_stats_1.saveUserAnswer);
exports.fastify.post("/stats/useranswers", { preHandler: (authenticate_1.authenticate) }, user_stats_1.getUserAnswersByQuizId);
exports.fastify.post("/stats/useranswers/user/formation", { preHandler: (authenticate_1.authenticate) }, user_stats_1.getUserAnswersByFormationByUser);
exports.fastify.post("/stats/useranswers/delete", { preHandler: (authenticate_1.authenticate) }, quiz_1.resetQuizById);
exports.fastify.post("/progression/user", { preHandler: (authenticate_1.authenticate) }, user_stats_1.getUserProgressionByUser);
exports.fastify.post("/progression/save", { preHandler: (authenticate_1.authenticate) }, user_stats_1.saveUserProgression);
/** Answers Options */
exports.fastify.post("/answersoptions/create", { preHandler: (authenticate_1.authenticate) }, answers_options_1.createAnswerOption);
/** Image */
exports.fastify.post("/upload/file", { preHandler: authenticate_1.authenticate }, upload_1.uploadFile);
/** Complete Formation */
exports.fastify.post("/complete-formation/create", { preHandler: authenticate_1.authenticate }, formations_1.createCompleteFormation);
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
