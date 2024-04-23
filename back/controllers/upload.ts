import { FastifyReply, FastifyRequest } from "fastify";
import path from "node:path";
import util from "node:util";
import fs from "node:fs";
import { pipeline } from "node:stream";
const pump = util.promisify(pipeline);

export async function uploadFile(req: FastifyRequest, res: FastifyReply) {
  try {
    const data = await req.file();
    if (data) {
      console.log("file: ", data);

      if (data.file.truncated) {
        throw new Error("Le fichier est trop volumineux et a été tronqué.");
      }

      const filePath = path.join(__dirname, "../../public", data.filename);
      const output = fs.createWriteStream(filePath);

      await pump(data.file, output);
      res.send({ success: true, message: "Fichier uploadé avec succès" });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de l'upload de l'image",
        details: error.message,
      });
    } else {
      // Gestion d'autres types d'erreurs si nécessaire
      res.code(500).send({
        error: "Erreur inconnue lors de l'upload de l'image",
      });
    }
  }
}
