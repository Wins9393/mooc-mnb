import { FastifyReply, FastifyRequest } from "fastify";
import { fastify } from "../server";
import { Formation, FormationToDB, FormationWithModule, IdParams } from "../types/types";
import path from "node:path";
import util from "node:util";
import fs from "node:fs";
import { pipeline } from "node:stream";
const pump = util.promisify(pipeline);

function groupModulesByFormation(results: any[]): FormationWithModule[] {
  const formations: Record<number, FormationWithModule> = {};

  results.forEach((row) => {
    if (!formations[row.id_formation]) {
      formations[row.id_formation] = {
        id: row.id_formation,
        title: row.title_formation,
        description: row.desc_formation,
        cover_path: row.cover_path_formation,
        published: row.published_formation,
        modules: [],
      };
    }

    formations[row.id_formation].modules.push({
      id: row.id_module,
      id_formation: row.id_formation_module,
      title: row.title_module,
      description: row.description_module,
    });
  });

  return Object.values(formations);
}

export async function getFormationsWithModules(req: FastifyRequest, res: FastifyReply) {
  try {
    const query =
      "SELECT f.id AS id_formation, f.title AS title_formation, f.description AS desc_formation, f.cover_path AS cover_path_formation, f.published AS published_formation, m.id AS id_module, m.id_formation AS id_formation_module, m.title AS title_module, m.description AS description_module FROM formations f INNER JOIN modules m ON m.id_formation=f.id;";
    const response = await fastify.pg.query(query);

    const groupedModulesByFormation = groupModulesByFormation(response.rows);
    res.code(200).send(groupedModulesByFormation);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de la récupération des formations et modules",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      res.code(500).send({
        error: "Erreur inconnue lors de la récupération des formations et modules",
      });
    }
  }
}

export async function getContentsNumberByFormation(
  req: FastifyRequest<{ Params: IdParams }>,
  res: FastifyReply
) {
  try {
    const { id } = req.params;
    const response = await fastify.pg.query(
      "SELECT f.id AS formation_id, f.title AS formation_title, CAST (COUNT(DISTINCT v.id) AS INTEGER) AS video_count, CAST (COUNT(DISTINCT t.id) AS INTEGER) AS text_count, CAST (COUNT(DISTINCT pt.id) AS INTEGER) AS photo_text_count, CAST (COUNT(DISTINCT q.id) AS INTEGER) AS quiz_count FROM  formations f LEFT JOIN  modules m ON f.id = m.id_formation LEFT JOIN  videos v ON m.id = v.id_module LEFT JOIN texts t ON m.id = t.id_module LEFT JOIN photo_text pt on m.id =pt.id_module LEFT JOIN quiz q ON m.id = q.id_module WHERE f.id=$1 GROUP BY f.id, f.title;",
      [id]
    );
    res.code(200).send(response.rows[0]);
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

export async function createFormation(
  req: FastifyRequest<{ Body: FormationToDB }>,
  res: FastifyReply
) {
  try {
    console.log("NEW FORMATION: ", req.body);
    const { title, description, cover_path, published } = req.body;
    const query =
      "INSERT INTO formations (title, description, cover_path, published) VALUES ($1, $2, $3, $4) RETURNING id";
    const values = [title, description, cover_path, published];
    const result = await fastify.pg.query(query, values);

    res.code(200).send(result.rows[0].id);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de la création de la formation",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      res.code(500).send({
        error: "Erreur inconnue lors de la création de la formation",
      });
    }
  }
}

export async function updateFormation(
  request: FastifyRequest<{ Body: Formation }>,
  reply: FastifyReply
) {
  try {
    console.log("BODY: ", request.body);
    const { id, title, description, cover_path, published } = request.body;
    const result = await fastify.pg.query(
      "UPDATE formations SET id=$1, title=$2, description=$3, cover_path=$4, published=$5 WHERE id=$1 RETURNING id",
      [id, title, description, cover_path, published]
    );

    reply.code(200).send(result.rows[0].id);
  } catch (error: unknown) {
    if (error instanceof Error) {
      reply.code(500).send({
        error: "Erreur lors de la modification de la formation",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      reply.code(500).send({
        error: "Erreur inconnue lors de la modification de la formation",
      });
    }
  }
}

export async function deleteFormation(
  request: FastifyRequest<{ Params: IdParams }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;

    await fastify.pg.query("DELETE FROM formations WHERE id=$1 RETURNING id", [id]);

    reply.code(200).send(`Formation ${id} successfully deleted`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      reply.code(500).send({
        error: "Erreur lors de la suppression de la formation",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      reply.code(500).send({
        error: "Erreur inconnue lors de la suppression de la formation",
      });
    }
  }
}

interface Fields {
  [key: string]: string;
}

export async function createCompleteFormation(req: FastifyRequest, res: FastifyReply) {
  try {
    return await fastify.pg.transact(async (client) => {
      const parts = req.parts();
      const fields: Fields = {};

      for await (const part of parts) {
        if (part.type === "file") {
          const filePath = path.join(__dirname, "../../public", part.filename);
          const output = fs.createWriteStream(filePath);
          await pump(part.file, output);
        } else {
          // part.type === 'field
          fields[part.fieldname] = (await part.value) as string;
        }
      }
      const { formation, modules, videos, texts, photosTexts, quizQuestionsAndAnswers } = fields;

      // Insert formation
      const parsedFormation = JSON.parse(formation);
      const formationResult = await client.query(
        "INSERT INTO formations (title, description, cover_path, published) VALUES ($1, $2, $3, $4) RETURNING id",
        [
          parsedFormation.title,
          parsedFormation.description,
          parsedFormation.cover_path,
          parsedFormation.published,
        ]
      );
      const formationId = formationResult.rows[0].id;
      if (!formationId) {
        throw new Error("Erreur lors de l'insertion de la formation !");
      }

      // Insert modules
      const modulesIds: number[] = [];
      const parsedModules = JSON.parse(modules);
      for (const module of parsedModules) {
        const resultModules = await client.query(
          "INSERT INTO modules (id_formation, title, description) VALUES ($1, $2, $3) RETURNING id",
          [formationId, module.title, module.description]
        );
        if (!resultModules.rows[0].id) {
          throw new Error("Erreur lors de l'insertion d'un module !");
        }
        modulesIds.push(resultModules.rows[0].id);
      }

      // Insert videos
      const parsedVideos = JSON.parse(videos);
      if (parsedVideos.length > 0) {
        for (const video of parsedVideos) {
          const moduleIndex = video.key ? parseInt(video.key?.split("-")[1]) : -1;
          const resultVideos = await client.query(
            "INSERT INTO videos (id_module, path, title, description, cover_path) VALUES ($1, $2, $3, $4, $5) RETURNING id",
            [modulesIds[moduleIndex], video.path, video.title, video.description, null]
          );
          if (!resultVideos.rows[0].id) {
            throw new Error("Erreur lors de l'insertion d'une vidéo !");
          }
        }
      }

      // Insert texts
      const parsedTexts = JSON.parse(texts);
      if (parsedTexts.length > 0) {
        for (const text of parsedTexts) {
          const moduleIndex = text.key ? parseInt(text.key?.split("-")[1]) : -1;
          const resultTexts = await client.query(
            "INSERT INTO texts (id_module, title, content) VALUES ($1, $2, $3) RETURNING id",
            [modulesIds[moduleIndex], text.title, text.content]
          );
          if (!resultTexts.rows[0].id) {
            throw new Error("Erreur lors de l'insertion d'un texte !");
          }
        }
      }

      // Insert photosTexts
      const parsedPhotosTexts = JSON.parse(photosTexts);
      if (parsedPhotosTexts.length > 0) {
        for (const photoText of parsedPhotosTexts) {
          const moduleIndex = photoText.key ? parseInt(photoText.key.split("-")[1]) : -1;
          const resultPhotoText = await client.query(
            "INSERT INTO photo_text (id_module, title, description, photo_path, text_content) VALUES ($1, $2, $3, $4, $5) RETURNING id",
            [
              modulesIds[moduleIndex],
              photoText.title,
              photoText.description,
              photoText.photo_path,
              photoText.text_content,
            ]
          );
          if (!resultPhotoText.rows[0].id) {
            throw new Error("Erreur lors de l'insertion d'un photo texte !");
          }
        }
      }

      // Insert quiz, questions and answers
      const parsedQuizQuestionsAndAnswers = JSON.parse(quizQuestionsAndAnswers);
      const quizzesKeys = Object.keys(parsedQuizQuestionsAndAnswers);

      for (const key of quizzesKeys) {
        const moduleIndex = parseInt(key?.split("-")[1]);
        if (!modulesIds[moduleIndex]) {
          throw new Error(`Index du module introuvable`);
        }
        const resultQuiz = await client.query(
          "INSERT INTO quiz (id_module, title) VALUES ($1, $2) RETURNING id",
          [modulesIds[moduleIndex], parsedQuizQuestionsAndAnswers[key][0].quiz_title]
        );
        const idQuiz = resultQuiz.rows[0].id;

        if (!idQuiz) {
          throw new Error(`Erreur lors de l'insertion d'un quiz !`);
        }

        for (const q of parsedQuizQuestionsAndAnswers[key][0].questions) {
          const resultQuestion = await client.query(
            "INSERT INTO questions (id_quiz, question_text, explanation, is_multiple_choice) VALUES ($1, $2, $3, $4) RETURNING id",
            [idQuiz, q.question_text, q.explanation, q.is_multiple_choice]
          );
          const idQuestion = resultQuestion.rows[0].id;

          if (!idQuestion) {
            throw new Error(`Erreur lors de l'insertion d'une question !`);
          }

          for (const ao of q.answer_options) {
            await client.query(
              "INSERT INTO answers_options (id_question, answer_text, correct) VALUES ($1, $2, $3) RETURNING id",
              [idQuestion, ao.answer_text, ao.correct]
            );
          }
        }
      }
      res.send({ message: "Formation créée avec succès" });
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de la création de la formation complète !",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      res.code(500).send({
        error: "Erreur inconnue lors de la création de la formation",
      });
    }
  }
}
