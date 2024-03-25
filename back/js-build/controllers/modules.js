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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModule = exports.getModulesWithContentsByModuleId = exports.getQuizByModuleId = void 0;
const server_1 = require("../server");
function groupQuestionsAndAnswersOptionsByQuiz(resultsFromDB) {
    const quizzes = {};
    resultsFromDB.forEach((row) => {
        if (!quizzes[row.quiz_id]) {
            quizzes[row.quiz_id] = { id: row.quiz_id, title: row.quiz_title, questions: [] };
        }
        const quiz = quizzes[row.quiz_id];
        let question = quiz.questions.find((q) => q.id === row.question_id);
        if (!question) {
            question = {
                id: row.question_id,
                text: row.question_text,
                explanation: row.explanation,
                is_multiple_choice: row.is_multiple_choice,
                answer_options: [],
            };
            quiz.questions.push(question);
        }
        question.answer_options.push({
            id: row.answer_option_id,
            text: row.answer_text,
        });
    });
    return Object.values(quizzes);
}
function getQuizByModuleId(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const query = "SELECT qz.id AS quiz_id, qz.title AS quiz_title, qs.id AS question_id, qs.question_text, qs.explanation, qs.is_multiple_choice, ao.id AS answer_option_id, ao.answer_text, ao.correct FROM quiz qz INNER JOIN questions qs ON qz.id = qs.id_quiz INNER JOIN answers_options ao ON qs.id = ao.id_question WHERE qz.id_module = $1";
            const value = [id];
            const response = yield server_1.fastify.pg.query(query, value);
            const quizzes = groupQuestionsAndAnswersOptionsByQuiz(response.rows);
            const quiz = quizzes.length > 0 ? quizzes[0] : null;
            res.code(200).send(quiz);
        }
        catch (error) {
            if (error instanceof Error) {
                res.code(500).send({
                    error: "Erreur lors de la récupération des quiz",
                    details: error.message,
                });
            }
            else {
                // Gestion d'autres types d'erreurs si nécessaire
                res.code(500).send({
                    error: "Erreur inconnue lors de la récupération des quiz",
                });
            }
        }
    });
}
exports.getQuizByModuleId = getQuizByModuleId;
function getModulesWithContentsByModuleId(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const videosQuery = "SELECT v.id AS id_video, v.path AS path_video, v.title AS title_video, v.description AS description_video, v.cover_path AS cover_path_video FROM videos v WHERE v.id_module = $1";
            const textsQuery = "SELECT t.id AS id_text, t.title AS title_text, t.content AS content_text FROM texts t WHERE t.id_module = $1";
            const value = [id];
            const videosResponse = yield server_1.fastify.pg.query(videosQuery, value);
            const textsResponse = yield server_1.fastify.pg.query(textsQuery, value);
            const result = {
                id: Number(id),
                videos: videosResponse.rows,
                texts: textsResponse.rows,
            };
            res.code(200).send(result);
        }
        catch (error) {
            if (error instanceof Error) {
                res.code(500).send({
                    error: "Erreur lors de la récupération des modules et de leurs contenu",
                    details: error.message,
                });
            }
            else {
                // Gestion d'autres types d'erreurs si nécessaire
                res.code(500).send({
                    error: "Erreur inconnue lors de la récupération des modules et de leurs contenu",
                });
            }
        }
    });
}
exports.getModulesWithContentsByModuleId = getModulesWithContentsByModuleId;
function createModule(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_formation, title, description } = req.body;
            const query = "INSERT INTO modules (title, description, cover_path) VALUES ($1, $2, $3) RETURNING id";
            const values = [id_formation, title, description];
            const result = yield server_1.fastify.pg.query(query, values);
            res.code(200).send(result.rows[0].id);
        }
        catch (error) {
            if (error instanceof Error) {
                res.code(500).send({
                    error: "Erreur lors de la création du module",
                    details: error.message,
                });
            }
            else {
                // Gestion d'autres types d'erreurs si nécessaire
                res.code(500).send({
                    error: "Erreur inconnue lors de la création du module",
                });
            }
        }
    });
}
exports.createModule = createModule;
