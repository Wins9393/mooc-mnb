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
exports.authenticate = void 0;
function authenticate(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("AUTHENTICATE: ", request.session.user, request.session.authenticated);
        try {
            if (!request.session.user || !request.session.authenticated) {
                reply.code(401).send("Erreur d'authentification !");
            }
        }
        catch (error) {
            if (error instanceof Error) {
                reply.code(401).send({ message: "Erreur d'authentification !", error: error });
            }
            else {
                reply.code(401).send({ message: "Erreur d'authentification inconnue !", error: error });
            }
        }
    });
}
exports.authenticate = authenticate;
