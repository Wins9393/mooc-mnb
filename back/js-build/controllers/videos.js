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
exports.getVideosByFormationIdWithCompleteQuiz = void 0;
const server_1 = require("../server");
function groupQuestionsAndQuizzesByVideo(results) {
    const videos = {};
    results.forEach((row) => {
        if (!videos[row.id_video]) {
            videos[row.id_video] = {
                id: row.id_video,
                id_formation: row.id_formation,
                path: row.path,
                title: row.title_video,
                desc: row.desc_video,
                cover_path: row.cover_path,
                quizzes: [],
            };
        }
        let video = videos[row.id_video];
        let quiz = video.quizzes.find((q) => q.id === row.id_quiz);
        if (!quiz) {
            quiz = {
                id: row.id_quiz,
                title_quiz: row.title_quiz,
                questions: [],
            };
            video.quizzes.push(quiz);
        }
        let question = quiz.questions.find((q) => q.id === row.id_question);
        if (!question) {
            question = {
                id: row.id_question,
                question_text: row.question_text,
                explanation: row.explanation,
                answer_options: [],
            };
            quiz.questions.push(question);
        }
        let answer_option = question.answer_options.find((ao) => ao.id === row.id_answer_option);
        if (!answer_option) {
            answer_option = {
                id: row.id_answer_option,
                answer_text: row.answer_text,
            };
            question.answer_options.push(answer_option);
        }
    });
    return Object.values(videos);
}
function getVideosByFormationIdWithCompleteQuiz(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const query = 'SELECT v.id, v.id_formation, v.path, v.title AS title_video, v."desc" AS desc_video, v.cover_path, quiz.id, quiz.id_video, quiz.title AS title_quiz, q.id, q.id_quiz, q.question_text, q.explanation, a.id AS id_answer_option, a.id_question, a.answer_text FROM videos v INNER JOIN quiz quiz ON v.id = quiz.id_video INNER JOIN questions q ON quiz.id = q.id_quiz INNER JOIN answers_options a ON q.id = a.id_question WHERE v.id_formation=$1;';
            const value = [id];
            const response = yield server_1.fastify.pg.query(query, value);
            const structuredDataVideos = groupQuestionsAndQuizzesByVideo(response.rows);
            res.code(200).send(structuredDataVideos);
        }
        catch (error) {
            if (error instanceof Error) {
                res.code(500).send({
                    error: "Erreur lors de la récupération des videos",
                    details: error.message,
                });
            }
            else {
                // Gestion d'autres types d'erreurs si nécessaire
                res.code(500).send({
                    error: "Erreur inconnue lors de la récupération des vidéos",
                });
            }
        }
    });
}
exports.getVideosByFormationIdWithCompleteQuiz = getVideosByFormationIdWithCompleteQuiz;
