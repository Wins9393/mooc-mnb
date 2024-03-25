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
exports.createQuiz = exports.resetQuizById = void 0;
const server_1 = require("../server");
function resetQuizById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_user, id_quiz } = req.body;
            const query = "DELETE FROM user_answers WHERE id_user=$1 AND id_quiz=$2";
            const values = [id_user, id_quiz];
            const results = yield server_1.fastify.pg.query(query, values);
            res.code(200).send("Réinitialisation réussie !");
        }
        catch (error) {
            if (error instanceof Error) {
                res.code(500).send({
                    error: "Erreur lors de la réinitialisation du quiz",
                    details: error.message,
                });
            }
            else {
                // Gestion d'autres types d'erreurs si nécessaire
                res.code(500).send({
                    error: "Erreur inconnue lors de la réinitialisation du quiz",
                });
            }
        }
    });
}
exports.resetQuizById = resetQuizById;
function createQuiz(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_module, title } = req.body;
            const query = "INSERT INTO quiz (id_module, title) VALUES ($1, $2) RETURNING id";
            const values = [id_module, title];
            const result = yield server_1.fastify.pg.query(query, values);
            res.code(200).send(result.rows[0].id);
        }
        catch (error) {
            if (error instanceof Error) {
                res.code(500).send({
                    error: "Erreur lors de la création du quiz",
                    details: error.message,
                });
            }
            else {
                // Gestion d'autres types d'erreurs si nécessaire
                res.code(500).send({
                    error: "Erreur inconnue lors de la création du quiz",
                });
            }
        }
    });
}
exports.createQuiz = createQuiz;
