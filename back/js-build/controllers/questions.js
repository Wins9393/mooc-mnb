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
exports.createQuestion = exports.getQuestionsByFormation = exports.getCorrectAnswerByQuestion = void 0;
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
function getQuestionsByFormation(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_formation } = req.body;
            const response = yield server_1.fastify.pg.query("SELECT q.id, q.id_quiz, q.question_text, q.explanation, q.is_multiple_choice FROM formations f JOIN modules m ON f.id = m.id_formation JOIN quiz qz ON m.id = qz.id_module JOIN questions q ON qz.id = q.id_quiz WHERE f.id=$1", [id_formation]);
            res.code(200).send(response.rows);
        }
        catch (error) {
            if (error instanceof Error) {
                res.code(500).send({
                    error: "Erreur lors de la récupération des questions",
                    details: error.message,
                });
            }
            else {
                // Gestion d'autres types d'erreurs si nécessaire
                res.code(500).send({
                    error: "Erreur inconnue lors de la récupération des questions",
                });
            }
        }
    });
}
exports.getQuestionsByFormation = getQuestionsByFormation;
function createQuestion(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_quiz, question_text, explanation, is_multiple_choice } = req.body;
            const query = "INSERT INTO questions (id_quiz, question_text, explanation, is_multiple_choice) VALUES ($1, $2, $3, $4) RETURNING id";
            const values = [id_quiz, question_text, explanation, is_multiple_choice];
            const result = yield server_1.fastify.pg.query(query, values);
            res.code(200).send(result.rows[0].id);
        }
        catch (error) {
            if (error instanceof Error) {
                res.code(500).send({
                    error: "Erreur lors de la création de la question",
                    details: error.message,
                });
            }
            else {
                // Gestion d'autres types d'erreurs si nécessaire
                res.code(500).send({
                    error: "Erreur inconnue lors de la création de la question",
                });
            }
        }
    });
}
exports.createQuestion = createQuestion;
