"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompleteFormation = exports.updateFormation = exports.createFormation = exports.getContentsNumberByFormation = exports.getFormationsWithModules = void 0;
const server_1 = require("../server");
const node_path_1 = __importDefault(require("node:path"));
const node_util_1 = __importDefault(require("node:util"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_stream_1 = require("node:stream");
const pump = node_util_1.default.promisify(node_stream_1.pipeline);
function groupModulesByFormation(results) {
    const formations = {};
    results.forEach((row) => {
        if (!formations[row.id_formation]) {
            formations[row.id_formation] = {
                id: row.id_formation,
                title: row.title_formation,
                description: row.desc_formation,
                cover_path: row.cover_path_formation,
                published: row.published_formation,
                modules: [],
            };
        }
        formations[row.id_formation].modules.push({
            id: row.id_module,
            id_formation: row.id_formation_module,
            title: row.title_module,
            description: row.description_module,
        });
    });
    return Object.values(formations);
}
function getFormationsWithModules(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = "SELECT f.id AS id_formation, f.title AS title_formation, f.description AS desc_formation, f.cover_path AS cover_path_formation, f.published AS published_formation, m.id AS id_module, m.id_formation AS id_formation_module, m.title AS title_module, m.description AS description_module FROM formations f INNER JOIN modules m ON m.id_formation=f.id;";
            const response = yield server_1.fastify.pg.query(query);
            const groupedModulesByFormation = groupModulesByFormation(response.rows);
            res.code(200).send(groupedModulesByFormation);
        }
        catch (error) {
            if (error instanceof Error) {
                res.code(500).send({
                    error: "Erreur lors de la récupération des formations et modules",
                    details: error.message,
                });
            }
            else {
                // Gestion d'autres types d'erreurs si nécessaire
                res.code(500).send({
                    error: "Erreur inconnue lors de la récupération des formations et modules",
                });
            }
        }
    });
}
exports.getFormationsWithModules = getFormationsWithModules;
function getContentsNumberByFormation(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const response = yield server_1.fastify.pg.query("SELECT f.id AS formation_id, f.title AS formation_title, CAST (COUNT(DISTINCT v.id) AS INTEGER) AS video_count, CAST (COUNT(DISTINCT t.id) AS INTEGER) AS text_count, CAST (COUNT(DISTINCT pt.id) AS INTEGER) AS photo_text_count, CAST (COUNT(DISTINCT q.id) AS INTEGER) AS quiz_count FROM  formations f LEFT JOIN  modules m ON f.id = m.id_formation LEFT JOIN  videos v ON m.id = v.id_module LEFT JOIN texts t ON m.id = t.id_module LEFT JOIN photo_text pt on m.id =pt.id_module LEFT JOIN quiz q ON m.id = q.id_module WHERE f.id=$1 GROUP BY f.id, f.title;", [id]);
            res.code(200).send(response.rows[0]);
        }
        catch (error) {
            if (error instanceof Error) {
                res.code(500).send({
                    error: "Erreur lors de la récupération du nombre de contenu par formation",
                    details: error.message,
                });
            }
            else {
                // Gestion d'autres types d'erreurs si nécessaire
                res.code(500).send({
                    error: "Erreur inconnue lors de la récupération des formations et vidéos",
                });
            }
        }
    });
}
exports.getContentsNumberByFormation = getContentsNumberByFormation;
function createFormation(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("NEW FORMATION: ", req.body);
            const { title, description, cover_path, published } = req.body;
            const query = "INSERT INTO formations (title, description, cover_path, published) VALUES ($1, $2, $3, $4) RETURNING id";
            const values = [title, description, cover_path, published];
            const result = yield server_1.fastify.pg.query(query, values);
            res.code(200).send(result.rows[0].id);
        }
        catch (error) {
            if (error instanceof Error) {
                res.code(500).send({
                    error: "Erreur lors de la création de la formation",
                    details: error.message,
                });
            }
            else {
                // Gestion d'autres types d'erreurs si nécessaire
                res.code(500).send({
                    error: "Erreur inconnue lors de la création de la formation",
                });
            }
        }
    });
}
exports.createFormation = createFormation;
function updateFormation(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("BODY: ", request.body);
            const { id, title, description, cover_path, published } = request.body;
            const result = yield server_1.fastify.pg.query("UPDATE formations SET id=$1, title=$2, description=$3, cover_path=$4, published=$5 WHERE id=$1 RETURNING id", [id, title, description, cover_path, published]);
            reply.code(200).send(result.rows[0].id);
        }
        catch (error) {
            if (error instanceof Error) {
                reply.code(500).send({
                    error: "Erreur lors de la modification de la formation",
                    details: error.message,
                });
            }
            else {
                // Gestion d'autres types d'erreurs si nécessaire
                reply.code(500).send({
                    error: "Erreur inconnue lors de la modification de la formation",
                });
            }
        }
    });
}
exports.updateFormation = updateFormation;
function createCompleteFormation(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield server_1.fastify.pg.transact((client) => __awaiter(this, void 0, void 0, function* () {
                var _a, e_1, _b, _c;
                var _d, _e;
                const parts = req.parts();
                const fields = {};
                try {
                    for (var _f = true, parts_1 = __asyncValues(parts), parts_1_1; parts_1_1 = yield parts_1.next(), _a = parts_1_1.done, !_a; _f = true) {
                        _c = parts_1_1.value;
                        _f = false;
                        const part = _c;
                        if (part.type === "file") {
                            const filePath = node_path_1.default.join(__dirname, "../../public", part.filename);
                            const output = node_fs_1.default.createWriteStream(filePath);
                            yield pump(part.file, output);
                        }
                        else {
                            // part.type === 'field
                            fields[part.fieldname] = (yield part.value);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_f && !_a && (_b = parts_1.return)) yield _b.call(parts_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                const { formation, modules, videos, texts, photosTexts, quizQuestionsAndAnswers } = fields;
                // Insert formation
                const parsedFormation = JSON.parse(formation);
                const formationResult = yield client.query("INSERT INTO formations (title, description, cover_path, published) VALUES ($1, $2, $3, $4) RETURNING id", [
                    parsedFormation.title,
                    parsedFormation.description,
                    parsedFormation.cover_path,
                    parsedFormation.published,
                ]);
                const formationId = formationResult.rows[0].id;
                if (!formationId) {
                    throw new Error("Erreur lors de l'insertion de la formation !");
                }
                // Insert modules
                const modulesIds = [];
                const parsedModules = JSON.parse(modules);
                for (const module of parsedModules) {
                    const resultModules = yield client.query("INSERT INTO modules (id_formation, title, description) VALUES ($1, $2, $3) RETURNING id", [formationId, module.title, module.description]);
                    if (!resultModules.rows[0].id) {
                        throw new Error("Erreur lors de l'insertion d'un module !");
                    }
                    modulesIds.push(resultModules.rows[0].id);
                }
                // Insert videos
                const parsedVideos = JSON.parse(videos);
                if (parsedVideos.length > 0) {
                    for (const video of parsedVideos) {
                        const moduleIndex = video.key ? parseInt((_d = video.key) === null || _d === void 0 ? void 0 : _d.split("-")[1]) : -1;
                        const resultVideos = yield client.query("INSERT INTO videos (id_module, path, title, description, cover_path) VALUES ($1, $2, $3, $4, $5) RETURNING id", [modulesIds[moduleIndex], video.path, video.title, video.description, null]);
                        if (!resultVideos.rows[0].id) {
                            throw new Error("Erreur lors de l'insertion d'une vidéo !");
                        }
                    }
                }
                // Insert texts
                const parsedTexts = JSON.parse(texts);
                if (parsedTexts.length > 0) {
                    for (const text of parsedTexts) {
                        const moduleIndex = text.key ? parseInt((_e = text.key) === null || _e === void 0 ? void 0 : _e.split("-")[1]) : -1;
                        const resultTexts = yield client.query("INSERT INTO texts (id_module, title, content) VALUES ($1, $2, $3) RETURNING id", [modulesIds[moduleIndex], text.title, text.content]);
                        if (!resultTexts.rows[0].id) {
                            throw new Error("Erreur lors de l'insertion d'un texte !");
                        }
                    }
                }
                // Insert photosTexts
                const parsedPhotosTexts = JSON.parse(photosTexts);
                if (parsedPhotosTexts.length > 0) {
                    for (const photoText of parsedPhotosTexts) {
                        const moduleIndex = photoText.key ? parseInt(photoText.key.split("-")[1]) : -1;
                        const resultPhotoText = yield client.query("INSERT INTO photo_text (id_module, title, description, photo_path, text_content) VALUES ($1, $2, $3, $4, $5) RETURNING id", [
                            modulesIds[moduleIndex],
                            photoText.title,
                            photoText.description,
                            photoText.photo_path,
                            photoText.text_content,
                        ]);
                        if (!resultPhotoText.rows[0].id) {
                            throw new Error("Erreur lors de l'insertion d'un photo texte !");
                        }
                    }
                }
                // Insert quiz, questions and answers
                const parsedQuizQuestionsAndAnswers = JSON.parse(quizQuestionsAndAnswers);
                const quizzesKeys = Object.keys(parsedQuizQuestionsAndAnswers);
                for (const key of quizzesKeys) {
                    const moduleIndex = parseInt(key === null || key === void 0 ? void 0 : key.split("-")[1]);
                    if (!modulesIds[moduleIndex]) {
                        throw new Error(`Index du module introuvable`);
                    }
                    const resultQuiz = yield client.query("INSERT INTO quiz (id_module, title) VALUES ($1, $2) RETURNING id", [modulesIds[moduleIndex], parsedQuizQuestionsAndAnswers[key][0].quiz_title]);
                    const idQuiz = resultQuiz.rows[0].id;
                    if (!idQuiz) {
                        throw new Error(`Erreur lors de l'insertion d'un quiz !`);
                    }
                    for (const q of parsedQuizQuestionsAndAnswers[key][0].questions) {
                        const resultQuestion = yield client.query("INSERT INTO questions (id_quiz, question_text, explanation, is_multiple_choice) VALUES ($1, $2, $3, $4) RETURNING id", [idQuiz, q.question_text, q.explanation, q.is_multiple_choice]);
                        const idQuestion = resultQuestion.rows[0].id;
                        if (!idQuestion) {
                            throw new Error(`Erreur lors de l'insertion d'une question !`);
                        }
                        for (const ao of q.answer_options) {
                            yield client.query("INSERT INTO answers_options (id_question, answer_text, correct) VALUES ($1, $2, $3) RETURNING id", [idQuestion, ao.answer_text, ao.correct]);
                        }
                    }
                }
                res.send({ message: "Formation créée avec succès" });
            }));
        }
        catch (error) {
            if (error instanceof Error) {
                res.code(500).send({
                    error: "Erreur lors de la création de la formation complète !",
                    details: error.message,
                });
            }
            else {
                // Gestion d'autres types d'erreurs si nécessaire
                res.code(500).send({
                    error: "Erreur inconnue lors de la création de la formation",
                });
            }
        }
    });
}
exports.createCompleteFormation = createCompleteFormation;
