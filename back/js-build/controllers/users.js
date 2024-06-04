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
exports.getUsers = void 0;
const server_1 = require("../server");
function getUsers(request, reply) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentUserId = (_a = request.session.user) === null || _a === void 0 ? void 0 : _a.id;
            if (currentUserId) {
                const query = "SELECT id, firstname, lastname, shop, email, role, created_at FROM public.users WHERE id != $1";
                const response = yield server_1.fastify.pg.query(query, [currentUserId]);
                reply.code(200).send(response.rows);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                reply.code(500).send({
                    error: "Erreur lors de la récupération des users",
                    details: error.message,
                });
            }
            else {
                // Gestion d'autres types d'erreurs si nécessaire
                reply.code(500).send({
                    error: "Erreur inconnue lors de la récupération des users",
                });
            }
        }
    });
}
exports.getUsers = getUsers;
