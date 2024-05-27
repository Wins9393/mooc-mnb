import { FastifyReply, FastifyRequest } from "fastify";
import { fastify } from "../server";
import {
  AnswerOptionFromDB,
  BodyGetCorrectAnswer,
  QuestionToDB,
  QuestionsByFormationBody,
} from "../types/types";

function structureAnswerByQuestion(
  isMultipleChoice: boolean,
  answerOptions: AnswerOptionFromDB[],
  id_answer_option_selected: number[] | number
) {
  // Ajouter param multiple_choice puis check ce param
  if (isMultipleChoice) {
    const correctAnswers = answerOptions.filter((answer) => answer.correct);

    if (Array.isArray(id_answer_option_selected)) {
      const allSelectedAreCorrect = id_answer_option_selected.every((id) =>
        correctAnswers.some((answer) => answer.id === id)
      );
      const sameLength = id_answer_option_selected.length === correctAnswers.length;

      return {
        isCorrectAnswerSelected: allSelectedAreCorrect && sameLength,
        idAnswerOptionSelected: id_answer_option_selected,
        correctAnswer: correctAnswers,
      };
    }
    return {
      isCorrectAnswerSelected: false,
      idAnswerOptionSelected: id_answer_option_selected,
      correctAnswer: correctAnswers,
    };
  } else {
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
}

export async function getCorrectAnswerByQuestion(
  req: FastifyRequest<{ Body: BodyGetCorrectAnswer }>,
  res: FastifyReply
) {
  try {
    const { id_question, id_answer_option_selected } = req.body;

    const question = await fastify.pg.query(
      "SELECT id, id_quiz, question_text, explanation, is_multiple_choice FROM questions WHERE id=$1;",
      [id_question]
    );
    const answerOption = await fastify.pg.query(
      "SELECT id, id_question, answer_text, correct FROM answers_options WHERE id_question=$1",
      [id_question]
    );

    const correctAnswer = structureAnswerByQuestion(
      question.rows[0].is_multiple_choice,
      answerOption.rows,
      id_answer_option_selected
    );

    res.send(correctAnswer);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de la récupération de la bonne réponse",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      res.code(500).send({
        error: "Erreur inconnue lors de la récupération de la bonne réponse",
      });
    }
  }
}

export async function getQuestionsByFormation(
  req: FastifyRequest<{ Body: QuestionsByFormationBody }>,
  res: FastifyReply
) {
  try {
    const { id_formation } = req.body;
    const response = await fastify.pg.query(
      "SELECT q.id, q.id_quiz, q.question_text, q.explanation, q.is_multiple_choice FROM formations f JOIN modules m ON f.id = m.id_formation JOIN quiz qz ON m.id = qz.id_module JOIN questions q ON qz.id = q.id_quiz WHERE f.id=$1",
      [id_formation]
    );
    res.code(200).send(response.rows);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de la récupération des questions",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      res.code(500).send({
        error: "Erreur inconnue lors de la récupération des questions",
      });
    }
  }
}

export async function createQuestion(
  req: FastifyRequest<{ Body: QuestionToDB }>,
  res: FastifyReply
) {
  try {
    const { id_quiz, question_text, explanation, is_multiple_choice } = req.body;
    const query =
      "INSERT INTO questions (id_quiz, question_text, explanation, is_multiple_choice) VALUES ($1, $2, $3, $4) RETURNING id";
    const values = [id_quiz, question_text, explanation, is_multiple_choice];
    const result = await fastify.pg.query(query, values);

    res.code(200).send(result.rows[0].id);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de la création de la question",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      res.code(500).send({
        error: "Erreur inconnue lors de la création de la question",
      });
    }
  }
}
