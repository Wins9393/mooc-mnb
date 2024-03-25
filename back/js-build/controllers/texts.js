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
exports.createText = void 0;
const server_1 = require("../server");
function createText(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id_module, title, content } = req.body;
            const query = "INSERT INTO texts (id_module, title, content) VALUES ($1, $2, $3) RETURNING id";
            const values = [id_module, title, content];
            const result = yield server_1.fastify.pg.query(query, values);
            res.code(200).send(result.rows[0].id); // Optionnel
        }
        catch (error) {
            if (error instanceof Error) {
                res.code(500).send({
                    error: "Erreur lors de la création du text",
                    details: error.message,
                });
            }
            else {
                // Gestion d'autres types d'erreurs si nécessaire
                res.code(500).send({
                    error: "Erreur inconnue lors de la création du text",
                });
            }
        }
    });
}
exports.createText = createText;
