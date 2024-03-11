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
exports.getFormationsWithVideos = void 0;
const server_1 = require("../server");
function groupVideosByFormation(results) {
    const formations = {}; // Utilise un objet pour regrouper les formations par id
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
function getFormationsWithVideos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = 'SELECT f.id AS id_formation, f.title AS title_formation, f."desc" AS desc_formation, f.cover_path AS cover_path_formation, v.id AS id_video, v.path AS path_video, v.title AS title_video, v."desc" AS desc_video, v.cover_path AS cover_path_video FROM public.formations f INNER JOIN public.videos v ON v.id_formation = f.id;';
            const response = yield server_1.fastify.pg.query(query);
            // console.log("FORMATIONS ROWS: ", response.rows);
            const formationsWithVideos = groupVideosByFormation(response.rows);
            res.code(200).send(formationsWithVideos);
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
exports.getFormationsWithVideos = getFormationsWithVideos;
