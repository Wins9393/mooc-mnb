import { FastifyReply, FastifyRequest } from "fastify";
import { fastify } from "../server";
import { FormationWithVideosFormated, FormationWithVideosFromDB } from "../types/types";

function groupVideosByFormation(results: FormationWithVideosFromDB[]) {
  const formations: Record<number, FormationWithVideosFormated> = {}; // Utilise un objet pour regrouper les formations par id

  results.forEach((row) => {
    if (!formations[row.id_formation]) {
      formations[row.id_formation] = {
        id: row.id_formation,
        title: row.title_formation,
        desc: row.desc_formation,
        cover_path: row.cover_path_formation,
        videos: [],
      };
    }

    // Ajoute la vidéo actuelle à la formation correspondante
    formations[row.id_formation].videos.push({
      id: row.id_video,
      path: row.path_video,
      title: row.title_video,
      desc: row.desc_video,
      cover_path: row.cover_path_video,
    });
  });

  // Convertit l'objet `formations` en un tableau de ses valeurs
  return Object.values(formations);
}

export async function getFormationsWithVideos(req: FastifyRequest, res: FastifyReply) {
  try {
    const query =
      'SELECT f.id AS id_formation, f.title AS title_formation, f."desc" AS desc_formation, f.cover_path AS cover_path_formation, v.id AS id_video, v.path AS path_video, v.title AS title_video, v."desc" AS desc_video, v.cover_path AS cover_path_video FROM public.formations f INNER JOIN public.videos v ON v.id_formation = f.id;';
    const response = await fastify.pg.query(query);

    // console.log("FORMATIONS ROWS: ", response.rows);
    const formationsWithVideos = groupVideosByFormation(response.rows);
    res.code(200).send(formationsWithVideos);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de la récupération des formations et vidéos",
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
