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
exports.getUserAnswersByQuizId = exports.saveUserAnswer = void 0;
const server_1 = require("../server");
function saveUserAnswer(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_user, id_question, id_answer_option, date_answer, id_quiz } = req.body;
            const query = "INSERT INTO user_answers (id_user, id_question, id_answer_option, date_answer, id_quiz) VALUES ($1, $2, $3, $4, $5)";
            const values = [id_user, id_question, id_answer_option, date_answer, id_quiz];
            const results = yield server_1.fastify.pg.query(query, values);
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
            const query = "SELECT id, id_user, id_question, id_answer_option, date_answer, id_quiz FROM user_answers WHERE id_user=$1 AND id_quiz=$2";
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
// export async function resetQuizById(
//   req: FastifyRequest<{ Body: BodyGetUserAnswer }>,
//   res: FastifyReply
// ) {
//   try {
//     const { id_user, id_quiz } = req.body;
//     const query = "DELETE FROM user_answers WHERE id_user=$1 AND id_quiz=$2";
//     const values = [id_user, id_quiz];
//     const results = fastify.pg.query(query, values);
//     res.code(200).send("Réinitialisation réussie !");
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       res.code(500).send({
//         error: "Erreur lors de la suppression des réponses utilisateur",
//         details: error.message,
//       });
//     } else {
//       // Gestion d'autres types d'erreurs si nécessaire
//       res.code(500).send({
//         error: "Erreur inconnue lors de la suppression des réponses utilisateur",
//       });
//     }
//   }
// }
