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
exports.getFormationsWithModules = void 0;
const server_1 = require("../server");
function groupModulesByFormation(results) {
    const formations = {};
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
function getFormationsWithModules(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = "SELECT f.id AS id_formation, f.title AS title_formation, f.description AS desc_formation, f.cover_path AS cover_path_formation, m.id AS id_module, m.id_formation AS id_formation_module, m.title AS title_module, m.description AS description_module FROM formations f INNER JOIN modules m ON m.id_formation=f.id;";
            const response = yield server_1.fastify.pg.query(query);
            const groupedModulesByFormation = groupModulesByFormation(response.rows);
            res.code(200).send(groupedModulesByFormation);
        }
        catch (error) {
            if (error instanceof Error) {
                res.code(500).send({
                    error: "Erreur lors de la récupération des formations et vidéos",
                    details: error.message,
                });
            }
            else {
                // Gestion d'autres types d'erreurs si nécessaire
                res.code(500).send({
                    error: "Erreur inconnue lors de la récupération des formations et vidéos",
                });
            }
        }
    });
}
exports.getFormationsWithModules = getFormationsWithModules;
