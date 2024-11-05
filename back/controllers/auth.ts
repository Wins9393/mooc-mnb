import argon2 from "argon2";
import { fastify } from "../server.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { UserSession } from "../types/types.js";

interface LoginBody {
  email: string;
  password: string;
}

interface RegisterBody {
  id: number;
  firstname: string;
  lastname: string;
  shop: string;
  city: string;
  email: string;
  password: string;
}

declare module "fastify" {
  interface Session {
    authenticated?: boolean;
    user?: UserSession;
  }
}

export async function login(req: FastifyRequest<{ Body: LoginBody }>, res: FastifyReply) {
  try {
    const { email, password } = req.body;

    const query =
      "SELECT id, firstname, lastname, shop, city, email, password, role, created_at FROM public.users WHERE email=$1";
    const values = [email];

    const response = await fastify.pg.query(query, values);
    console.log("LOGIN RESPONSE: ", response.rows);

    if (response.rowCount === 0) {
      return res.code(404).send("Email ou mot de passe incorrect !");
    }

    if (await argon2.verify(response.rows[0].password, password)) {
      req.session.authenticated = true;
      req.session.user = {
        id: response.rows[0].id,
        firstname: response.rows[0].firstname,
        lastname: response.rows[0].lastname,
        shop: response.rows[0].shop,
        city: response.rows[0].city,
        email: response.rows[0].email,
        role: response.rows[0].role,
        createdAt: response.rows[0].created_at,
      };
      res.code(200).send(req.session);
    } else {
      req.session.authenticated = false;
      res.code(404).send("Email ou mot de passe incorrect !");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de la connexion de l'utilisateur",
        details: error.message,
      });
    } else {
      res.code(500).send({
        error: "Erreur inconnu lors de la connexion de l'utilisateur",
      });
    }
  }
}

export async function register(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  try {
    const { firstname, lastname, shop, city, email, password } = request.body;

    const hash_password = await argon2.hash(password);
    const dateNow = new Date().toISOString();

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!emailRegex.test(email)) {
      return reply.code(400).send("Email invalide");
    }

    const query =
      "INSERT INTO public.users(firstname, lastname, shop, city, email, password, role, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id";

    const values = [firstname, lastname, shop, city, email, hash_password, "user", dateNow];

    const result = await fastify.pg.query(query, values);

    if (result.rowCount === 1) {
      request.session.authenticated = true;
      request.session.user = {
        id: result.rows[0].id,
        firstname,
        lastname,
        shop,
        city,
        email,
        role: "user",
        createdAt: dateNow,
      };
      return reply.code(200).send(request.session);
    } else {
      return reply
        .code(500)
        .send("Une erreur est survenue lors de l'enregistrement de l'utilisateur");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      reply.code(500).send({
        error: "Erreur lors de l'enregistrement de l'utilisateur",
        details: error.message,
      });
    } else {
      reply.code(500).send({
        error: "Erreur inconnu lors de l'enregistrement de l'utilisateur",
      });
    }
  }
}

export async function logout(req: FastifyRequest, res: FastifyReply) {
  if (req.session.authenticated) {
    req.session.destroy((err) => {
      if (err) {
        res.code(500).send("Erreur interne");
      } else {
        res.code(200).redirect("/");
      }
    });
  } else {
    res.code(401).send("Pas de sessions !");
  }
}

export async function getCurrentUser(req: FastifyRequest, res: FastifyReply) {
  // console.log("ME RESPONSE: ", req.session);
  if (req.session.authenticated && req.session.user) {
    res.code(200).send(req.session);
  } else {
    res.code(401).send({ message: "Non authentifié" });
  }
}
