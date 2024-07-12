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
exports.saveUserProgression = exports.getUserProgressionByUser = exports.getUserAnswersByFormationByUser = exports.getUserAnswersByQuizId = exports.saveUserAnswer = void 0;
const server_1 = require("../server");
function saveUserAnswer(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_user, id_question, id_answer_option, date_answer, id_quiz, correct } = req.body;
            const query = "INSERT INTO user_answers (id_user, id_question, id_answer_option, date_answer, id_quiz, correct) VALUES ($1, $2, $3, $4, $5, $6)";
            const values = [id_user, id_question, id_answer_option, date_answer, id_quiz, correct];
            const results = yield server_1.fastify.pg.query(query, values);
            res.code(200).send("Réponse enregistrée !");
        }
        catch (error) {
            if (error instanceof Error) {
                res.code(500).send({
                    error: "Erreur lors de l'insertion des résultats de l'utilisateur",
                    details: error.message,
                });
            }
            else {
                // Gestion d'autres types d'erreurs si nécessaire
                res.code(500).send({
                    error: "Erreur inconnue lors de l'insertion des résultats de l'utilisateur",
                });
            }
        }
    });
}
exports.saveUserAnswer = saveUserAnswer;
function getUserAnswersByQuizId(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_user, id_quiz } = req.body;
            const query = "SELECT id, id_user, id_question, id_answer_option, date_answer, id_quiz, correct FROM user_answers WHERE id_user=$1 AND id_quiz=$2";
            const values = [id_user, id_quiz];
            const response = yield server_1.fastify.pg.query(query, values);
            res.code(200).send(response.rows);
        }
        catch (error) {
            if (error instanceof Error) {
                res.code(500).send({
                    error: "Erreur lors de la récupération des résultats de l'utilisateur",
                    details: error.message,
                });
            }
            else {
                // Gestion d'autres types d'erreurs si nécessaire
                res.code(500).send({
                    error: "Erreur inconnue lors de la récupération des résultats de l'utilisateur",
                });
            }
        }
    });
}
exports.getUserAnswersByQuizId = getUserAnswersByQuizId;
function getUserAnswersByFormationByUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_user, id_formation } = req.body;
            const response = yield server_1.fastify.pg.query("SELECT ua.* FROM user_answers ua JOIN questions q ON ua.id_question = q.id JOIN quiz z ON q.id_quiz = z.id JOIN modules m ON z.id_module = m.id JOIN formations f ON m.id_formation = f.id WHERE id_user=$1 AND f.id=$2;", [id_user, id_formation]);
            res.code(200).send(response.rows);
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
exports.getUserAnswersByFormationByUser = getUserAnswersByFormationByUser;
function getUserProgressionByUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.body;
            const response = yield server_1.fastify.pg.query("SELECT id, id_user, id_formation, id_module, id_video, id_text, id_photo_text, id_quiz, complete FROM user_progression WHERE id_user = $1", [id]);
            res.code(200).send(response.rows);
        }
        catch (error) {
            if (error instanceof Error) {
                res.code(500).send({
                    error: "Erreur lors de la récupération de la progression de l'utilisateur",
                    details: error.message,
                });
            }
            else {
                // Gestion d'autres types d'erreurs si nécessaire
                res.code(500).send({
                    error: "Erreur inconnue lors de la récupération de la progression de l'utilisateur",
                });
            }
        }
    });
}
exports.getUserProgressionByUser = getUserProgressionByUser;
function saveUserProgression(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_user, id_formation, id_module, id_video, id_text, id_photo_text, id_quiz, complete, } = req.body;
            const response = yield server_1.fastify.pg.query("INSERT INTO user_progression (id_user, id_formation, id_module, id_video, id_text, id_photo_text, id_quiz, complete) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [id_user, id_formation, id_module, id_video, id_text, id_photo_text, id_quiz, complete]);
            res.code(200).send("Progression enregistrée !");
        }
        catch (error) {
            if (error instanceof Error) {
                res.code(500).send({
                    error: "Erreur lors de la sauvegarde de la progression de l'utilisateur",
                    details: error.message,
                });
            }
            else {
                // Gestion d'autres types d'erreurs si nécessaire
                res.code(500).send({
                    error: "Erreur inconnue lors de la sauvegarde de la progression de l'utilisateur",
                });
            }
        }
    });
}
exports.saveUserProgression = saveUserProgression;
