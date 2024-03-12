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
exports.saveUserAnswer = void 0;
const server_1 = require("../server");
function saveUserAnswer(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_user, id_question, id_answer_option } = req.body;
            const currentTimestamp = Date.now();
            const query = "INSERT INTO user_answers (id_user, id_question, id_answer_option, date_answer) VALUES ($1, $2, $3, $4)";
            const values = [id_user, id_question, id_answer_option, currentTimestamp];
            const results = yield server_1.fastify.pg.query(query, values);
        }
        catch (error) {
            if (error instanceof Error) {
                res.code(500).send({
                    error: "Erreur lors de la récupération des formations et vidéos",
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
exports.saveUserAnswer = saveUserAnswer;
