import { FastifyReply, FastifyRequest } from "fastify";
import { fastify } from "../server";
import { VideoToDB } from "../types/types";

export async function createVideo(req: FastifyRequest<{ Body: VideoToDB }>, res: FastifyReply) {
  try {
    const { id_module, path, title, description, cover_path } = req.body;
    const query =
      "INSERT INTO videos (id_module, path, title, description, cover_path) VALUES ($1, $2, $3, $4, $5) RETURNING id";
    const values = [id_module, path, title, description, cover_path];
    const result = await fastify.pg.query(query, values);

    res.code(200).send(result.rows[0].id); // Optionnel
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de la création de la video",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      res.code(500).send({
        error: "Erreur inconnue lors de la création de la video",
      });
    }
  }
}

// function groupQuestionsAndQuizzesByVideo(results: ResponseFromDB[]) {
//   const videos: Record<number, StructuredVideo> = {};

//   results.forEach((row) => {
//     if (!videos[row.id_video]) {
//       videos[row.id_video] = {
//         id: row.id_video,
//         id_formation: row.id_formation,
//         path: row.path,
//         title: row.title_video,
//         desc: row.desc_video,
//         cover_path: row.cover_path,
//         quizzes: [],
//       };
//     }

//     let video = videos[row.id_video];
//     let quiz = video.quizzes.find((q) => q.id === row.id_quiz);

//     if (!quiz) {
//       quiz = {
//         id: row.id_quiz,
//         title: row.title_quiz,
//         questions: [],
//       };
//       video.quizzes.push(quiz);
//     }

//     let question = quiz.questions.find((q) => q.id === row.id_question);

//     if (!question) {
//       question = {
//         id: row.id_question,
//         text: row.question_text,
//         explanation: row.explanation,
//         is_multiple_choice: row.is_multiple_choice,
//         answer_options: [],
//       };
//       quiz.questions.push(question);
//     }

//     let answer_option = question.answer_options.find((ao) => ao.id === row.id_answer_option);

//     if (!answer_option) {
//       answer_option = {
//         id: row.id_answer_option,
//         text: row.answer_text,
//       };
//       question.answer_options.push(answer_option);
//     }
//   });

//   return Object.values(videos);
// }

// // Old version => deprecated
// export async function getVideosByFormationIdWithCompleteQuiz(
//   req: FastifyRequest<{ Params: ParamsId }>,
//   res: FastifyReply
// ) {
//   try {
//     const { id } = req.params;
//     const query =
//       'SELECT v.id, v.id_formation, v.path, v.title AS title_video, v."desc" AS desc_video, v.cover_path, quiz.id, quiz.id_video, quiz.title AS title_quiz, q.id, q.id_quiz, q.question_text, q.explanation, a.id AS id_answer_option, a.id_question, a.answer_text FROM videos v INNER JOIN quiz quiz ON v.id = quiz.id_video INNER JOIN questions q ON quiz.id = q.id_quiz INNER JOIN answers_options a ON q.id = a.id_question WHERE v.id_formation=$1;';
//     const value = [id];
//     const response = await fastify.pg.query(query, value);

//     const structuredDataVideos = groupQuestionsAndQuizzesByVideo(response.rows);
//     res.code(200).send(structuredDataVideos);
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       res.code(500).send({
//         error: "Erreur lors de la récupération des videos",
//         details: error.message,
//       });
//     } else {
//       // Gestion d'autres types d'erreurs si nécessaire
//       res.code(500).send({
//         error: "Erreur inconnue lors de la récupération des vidéos",
//       });
//     }
//   }
// }
