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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const node_path_1 = __importDefault(require("node:path"));
const node_util_1 = __importDefault(require("node:util"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_stream_1 = require("node:stream");
const pump = node_util_1.default.promisify(node_stream_1.pipeline);
function uploadFile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield req.file();
            if (data) {
                console.log("file: ", data);
                if (data.file.truncated) {
                    throw new Error("Le fichier est trop volumineux et a été tronqué.");
                }
                const filePath = node_path_1.default.join(__dirname, "../../public", data.filename);
                const output = node_fs_1.default.createWriteStream(filePath);
                yield pump(data.file, output);
                res.send({ success: true, message: "Fichier uploadé avec succès" });
            }
        }
        catch (error) {
            if (error instanceof Error) {
                res.code(500).send({
                    error: "Erreur lors de l'upload de l'image",
                    details: error.message,
                });
            }
            else {
                // Gestion d'autres types d'erreurs si nécessaire
                res.code(500).send({
                    error: "Erreur inconnue lors de l'upload de l'image",
                });
            }
        }
    });
}
exports.uploadFile = uploadFile;
