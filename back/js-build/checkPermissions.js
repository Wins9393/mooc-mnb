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
exports.checkPermissions = void 0;
function checkPermissions(request, reply) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (((_a = request.session.user) === null || _a === void 0 ? void 0 : _a.role) !== "sadmin" && ((_b = request.session.user) === null || _b === void 0 ? void 0 : _b.role) !== "admin") {
                reply.code(401).send("Erreur de permissions");
            }
        }
        catch (error) {
            if (error instanceof Error) {
                reply.code(401).send({ message: "Erreur de permissions !", error: error });
            }
            else {
                reply.code(401).send({ message: "Erreur de permissions inconnue !", error: error });
            }
        }
    });
}
exports.checkPermissions = checkPermissions;
