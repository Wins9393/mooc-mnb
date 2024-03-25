import { FastifyReply, FastifyRequest } from "fastify";
import { fastify } from "../server";
import { FormationToDB, FormationWithModule } from "../types/types";

function groupModulesByFormation(results: any[]): FormationWithModule[] {
  const formations: Record<number, FormationWithModule> = {};

  results.forEach((row) => {
    // Si la formation n'existe pas déjà dans l'objet formations, créez-la
    if (!formations[row.id_formation]) {
      formations[row.id_formation] = {
        id: row.id_formation,
        title: row.title_formation,
        description: row.desc_formation,
        cover_path: row.cover_path_formation,
        modules: [],
      };
    }

    // Ajoutez le module à la formation correspondante
    formations[row.id_formation].modules.push({
      id: row.id_module,
      id_formation: row.id_formation_module,
      title: row.title_module,
      description: row.description_module,
    });
  });

  // Convertissez l'objet formations en un tableau de ses valeurs
  return Object.values(formations);
}

export async function getFormationsWithModules(req: FastifyRequest, res: FastifyReply) {
  try {
    const query =
      "SELECT f.id AS id_formation, f.title AS title_formation, f.description AS desc_formation, f.cover_path AS cover_path_formation, m.id AS id_module, m.id_formation AS id_formation_module, m.title AS title_module, m.description AS description_module FROM formations f INNER JOIN modules m ON m.id_formation=f.id;";
    const response = await fastify.pg.query(query);

    const groupedModulesByFormation = groupModulesByFormation(response.rows);
    res.code(200).send(groupedModulesByFormation);
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

export async function createFormation(
  req: FastifyRequest<{ Body: FormationToDB }>,
  res: FastifyReply
) {
  try {
    const { title, description, cover_path } = req.body;
    const query =
      "INSERT INTO formations (title, description, cover_path) VALUES ($1, $2, $3) RETURNING id";
    const values = [title, description, cover_path];
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
