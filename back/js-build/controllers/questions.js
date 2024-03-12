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
exports.getCorrectAnswerByQuestion = void 0;
const server_1 = require("../server");
function structureAnswerByQuestion(answerOptions, id_answer_option_selected) {
    const correctAnswer = answerOptions.find((answer) => answer.correct);
    if (correctAnswer) {
        const isCorrectAnswerSelected = correctAnswer.id === id_answer_option_selected;
        return {
            isCorrectAnswerSelected,
            idAnswerOptionSelected: id_answer_option_selected,
            correctAnswer,
        };
    }
}
function getCorrectAnswerByQuestion(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_question, id_answer_option_selected } = req.body;
            const query = "SELECT id, id_question, answer_text, correct FROM answers_options WHERE id_question=$1";
            const value = [id_question];
            const results = yield server_1.fastify.pg.query(query, value);
            const correctAnswer = structureAnswerByQuestion(results.rows, id_answer_option_selected);
            res.send(correctAnswer);
        }
        catch (error) {
            if (error instanceof Error) {
                res.code(500).send({
                    error: "Erreur lors de la récupération de la bonne réponse",
                    details: error.message,
                });
            }
            else {
                // Gestion d'autres types d'erreurs si nécessaire
                res.code(500).send({
                    error: "Erreur inconnue lors de la récupération de la bonne réponse",
                });
            }
        }
    });
}
exports.getCorrectAnswerByQuestion = getCorrectAnswerByQuestion;
