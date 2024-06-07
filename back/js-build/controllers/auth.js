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
exports.getCurrentUser = exports.logout = exports.register = exports.login = void 0;
const argon2_1 = __importDefault(require("argon2"));
const server_js_1 = require("../server.js");
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const query = "SELECT id, firstname, lastname, shop, email, password, role, created_at FROM public.users WHERE email=$1";
            const values = [email];
            const response = yield server_js_1.fastify.pg.query(query, values);
            console.log("LOGIN RESPONSE: ", response.rows);
            if (response.rowCount === 0) {
                return res.code(404).send("Email ou mot de passe incorrect !");
            }
            if (yield argon2_1.default.verify(response.rows[0].password, password)) {
                req.session.authenticated = true;
                req.session.user = {
                    id: response.rows[0].id,
                    firstname: response.rows[0].firstname,
                    lastname: response.rows[0].lastname,
                    shop: response.rows[0].shop,
                    email: response.rows[0].email,
                    role: response.rows[0].role,
                    createdAt: response.rows[0].created_at,
                };
                res.code(200).send(req.session);
            }
            else {
                req.session.authenticated = false;
                res.code(404).send("Email ou mot de passe incorrect !");
            }
        }
        catch (error) {
            if (error instanceof Error) {
                res.code(500).send({
                    error: "Erreur lors de la connexion de l'utilisateur",
                    details: error.message,
                });
            }
            else {
                res.code(500).send({
                    error: "Erreur inconnu lors de la connexion de l'utilisateur",
                });
            }
        }
    });
}
exports.login = login;
function register(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { firstname, lastname, shop, email, password } = request.body;
            const hash_password = yield argon2_1.default.hash(password);
            const dateNow = new Date().toISOString();
            const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
            if (!emailRegex.test(email)) {
                return reply.code(400).send("Email invalide");
            }
            const query = "INSERT INTO public.users(firstname, lastname, shop, email, password, role, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id";
            const values = [firstname, lastname, shop, email, hash_password, "user", dateNow];
            const result = yield server_js_1.fastify.pg.query(query, values);
            if (result.rowCount === 1) {
                request.session.authenticated = true;
                request.session.user = {
                    id: result.rows[0].id,
                    firstname,
                    lastname,
                    shop,
                    email,
                    role: "user",
                    createdAt: dateNow,
                };
                return reply.code(200).send(request.session);
            }
            else {
                return reply
                    .code(500)
                    .send("Une erreur est survenue lors de l'enregistrement de l'utilisateur");
            }
        }
        catch (error) {
            if (error instanceof Error) {
                reply.code(500).send({
                    error: "Erreur lors de l'enregistrement de l'utilisateur",
                    details: error.message,
                });
            }
            else {
                reply.code(500).send({
                    error: "Erreur inconnu lors de l'enregistrement de l'utilisateur",
                });
            }
        }
    });
}
exports.register = register;
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.session.authenticated) {
            req.session.destroy((err) => {
                if (err) {
                    res.code(500).send("Erreur interne");
                }
                else {
                    res.code(200).redirect("/");
                }
            });
        }
        else {
            res.code(401).send("Pas de sessions !");
        }
    });
}
exports.logout = logout;
function getCurrentUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log("ME RESPONSE: ", req.session);
        if (req.session.authenticated && req.session.user) {
            res.code(200).send(req.session);
        }
        else {
            res.code(401).send({ message: "Non authentifié" });
        }
    });
}
exports.getCurrentUser = getCurrentUser;
