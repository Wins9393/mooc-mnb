import { FastifyReply, FastifyRequest } from "fastify";
import { fastify } from "../server";
import {
  BodySaveUserAnswer,
  BodyGetUserAnswer,
  UserProgression,
  IdParams,
  UserAnswersByFormationByUser,
  ProgressionByUserByFormation,
  QuizByFormation,
  JoindedQuestion,
  ScoreAndCompletionByFormation,
  AnswersByMultipleChoiceQuestions,
} from "../types/types";

export async function saveUserAnswer(req: FastifyRequest<{ Body: BodySaveUserAnswer }>, res: FastifyReply) {
  try {
    const { id_user, id_question, id_answer_option, date_answer, id_quiz, correct } = req.body;

    const query = "INSERT INTO user_answers (id_user, id_question, id_answer_option, date_answer, id_quiz, correct) VALUES ($1, $2, $3, $4, $5, $6)";
    const values = [id_user, id_question, id_answer_option, date_answer, id_quiz, correct];

    const results = await fastify.pg.query(query, values);
    res.code(200).send("Réponse enregistrée !");
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de l'insertion des résultats de l'utilisateur",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      res.code(500).send({
        error: "Erreur inconnue lors de l'insertion des résultats de l'utilisateur",
      });
    }
  }
}

export async function getUserAnswersByQuizId(req: FastifyRequest<{ Body: BodyGetUserAnswer }>, res: FastifyReply) {
  try {
    const { id_user, id_quiz } = req.body;
    const query = "SELECT id, id_user, id_question, id_answer_option, date_answer, id_quiz, correct FROM user_answers WHERE id_user=$1 AND id_quiz=$2";
    const values = [id_user, id_quiz];

    const response = await fastify.pg.query(query, values);
    res.code(200).send(response.rows);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de la récupération des résultats de l'utilisateur",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      res.code(500).send({
        error: "Erreur inconnue lors de la récupération des résultats de l'utilisateur",
      });
    }
  }
}

export async function getUserAnswersByFormationByUser(req: FastifyRequest<{ Body: UserAnswersByFormationByUser }>, res: FastifyReply) {
  try {
    const { id_user, id_formation } = req.body;
    const response = await fastify.pg.query(
      "SELECT ua.* FROM user_answers ua JOIN questions q ON ua.id_question = q.id JOIN quiz z ON q.id_quiz = z.id JOIN modules m ON z.id_module = m.id JOIN formations f ON m.id_formation = f.id WHERE id_user=$1 AND f.id=$2;",
      [id_user, id_formation]
    );
    res.code(200).send(response.rows);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de la récupération du nombre de contenu par formation",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      res.code(500).send({
        error: "Erreur inconnue lors de la récupération des formations et vidéos",
      });
    }
  }
}

export async function getUserProgressionByUser(req: FastifyRequest<{ Body: IdParams }>, res: FastifyReply) {
  try {
    const { id } = req.body;
    const response = await fastify.pg.query(
      "SELECT id, id_user, id_formation, id_module, id_video, id_text, id_photo_text, id_quiz, complete FROM user_progression WHERE id_user = $1",
      [id]
    );
    res.code(200).send(response.rows);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de la récupération de la progression de l'utilisateur",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      res.code(500).send({
        error: "Erreur inconnue lors de la récupération de la progression de l'utilisateur",
      });
    }
  }
}

export async function saveUserProgression(req: FastifyRequest<{ Body: UserProgression }>, res: FastifyReply) {
  try {
    const { id_user, id_formation, id_module, id_video, id_text, id_photo_text, id_quiz, complete } = req.body;
    const response = await fastify.pg.query(
      "INSERT INTO user_progression (id_user, id_formation, id_module, id_video, id_text, id_photo_text, id_quiz, complete) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [id_user, id_formation, id_module, id_video, id_text, id_photo_text, id_quiz, complete]
    );
    res.code(200).send("Progression enregistrée !");
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de la sauvegarde de la progression de l'utilisateur",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      res.code(500).send({
        error: "Erreur inconnue lors de la sauvegarde de la progression de l'utilisateur",
      });
    }
  }
}

export async function getUserProgressionAndCompletionByFormation(request: FastifyRequest<{ Body: ProgressionByUserByFormation }>, reply: FastifyReply) {
  try {
    const { id_user, id_formation } = request.body;

    const quizzesByFormation = await fastify.pg.query(
      "SELECT q.id AS id_quiz, m.id AS id_module, f.id AS id_formation FROM quiz q JOIN modules m ON q.id_module = m.id JOIN formations f ON m.id_formation = f.id WHERE f.id=$1;",
      [id_formation]
    );

    const ids_quizzes = quizzesByFormation.rows.map((quiz: QuizByFormation) => quiz.id_quiz);

    const userProgressionByFormation = await fastify.pg.query("SELECT * FROM user_progression WHERE id_formation=$1 AND id_user=$2 AND id_quiz IS NOT NULL;", [
      id_formation,
      id_user,
    ]);

    const resultsByQuiz = await fastify.pg.query("SELECT id_user, id_quiz, id_question, id_answer_option, correct FROM user_answers WHERE id_quiz=ANY($1);", [ids_quizzes]);
    const ids_questions = resultsByQuiz.rows.map((joinedQuestion: JoindedQuestion) => joinedQuestion.id_question);

    const answersByMultipleChoiceQuestions = await fastify.pg.query(
      "SELECT q.id, q.id_quiz, q.is_multiple_choice, ao.correct FROM questions q JOIN answers_options ao ON ao.id_question = q.id WHERE q.id=ANY($1) AND q.is_multiple_choice = true;",
      [ids_questions]
    );

    function calculateScore(resultsByQuiz: JoindedQuestion[], answersByMultipleChoiceQuestions: AnswersByMultipleChoiceQuestions[]) {
      let totalQuestions = 0;
      let correctAnswers = 0;

      if (answersByMultipleChoiceQuestions.length > 0) {
        const simpleChoiceQuestions = resultsByQuiz.filter((joinedQuestion: JoindedQuestion) => {
          const isMultipleChoice = answersByMultipleChoiceQuestions.some(
            (multipleChoiceQuestion: AnswersByMultipleChoiceQuestions) => joinedQuestion.id_question === multipleChoiceQuestion.id
          );
          return !isMultipleChoice;
        });

        answersByMultipleChoiceQuestions.forEach((multipleChoiceQuestion: AnswersByMultipleChoiceQuestions) => {
          const userAnswers = resultsByQuiz.filter((result) => result.id_question === multipleChoiceQuestion.id);
          const correctOptions = userAnswers.filter((answer) => answer.correct);

          const allCorrectSelected = correctOptions.length === userAnswers.length && correctOptions.every((opt) => opt.correct);
          if (allCorrectSelected) {
            correctAnswers++;
          }
          totalQuestions++;
        });

        simpleChoiceQuestions.forEach((simpleQuestion) => {
          const isCorrect = simpleQuestion.correct;
          if (isCorrect) correctAnswers++;
          totalQuestions++;
        });
      } else {
        resultsByQuiz.forEach((result) => {
          if (result.correct) correctAnswers++;
          totalQuestions++;
        });
      }
      return (correctAnswers / totalQuestions) * 100;
    }

    const result = {
      id_formation: id_formation,
      total_quizzes: quizzesByFormation.rows.length,
      quizzes_completion: [] as { complete: boolean; id_quiz: number; score: number }[],
    };

    console.log("quizzesByFormation", quizzesByFormation);

    quizzesByFormation.rows.forEach((quiz: QuizByFormation) => {
      // const idFormation = quiz.id_formation;
      const idQuiz = quiz.id_quiz;

      const quizProgression = userProgressionByFormation.rows.find((userProgression: UserProgression) => userProgression.id_quiz === idQuiz);
      const resultsForQuiz = resultsByQuiz.rows.filter((result: JoindedQuestion) => result.id_quiz === idQuiz);
      const multipleChoiceQuestionsForQuiz = answersByMultipleChoiceQuestions.rows.filter((question: AnswersByMultipleChoiceQuestions) => question.id_quiz === idQuiz);

      const score = calculateScore(resultsForQuiz, multipleChoiceQuestionsForQuiz);

      result.quizzes_completion.push({
        id_quiz: idQuiz,
        complete: quizProgression ? quizProgression.complete : false,
        score: score ? score : 0,
      });
    });

    reply.send(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      reply.code(500).send({
        error: "Erreur lors de la récupération de la progression de l'utilisateur par formation",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      reply.code(500).send({
        error: "Erreur inconnue lors de la récupération de la progression de l'utilisateur par formation",
      });
    }
  }
}
