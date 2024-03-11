import argon2 from "argon2";
import { fastify } from "../server.js";
import { FastifyReply, FastifyRequest } from "fastify";

interface LoginBody {
  email: string;
  password: string;
}

interface RegisterBody {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

interface UserSession {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
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
      "SELECT id, firstname, lastname, email, password, role FROM public.users WHERE email=$1";
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
        email: response.rows[0].email,
        role: response.rows[0].role,
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

export async function register(req: FastifyRequest<{ Body: RegisterBody }>, res: FastifyReply) {
  try {
    const { firstname, lastname, email, password } = req.body;

    const hash_password = await argon2.hash(password);

    const query =
      "INSERT INTO public.users(firstname, lastname, email, password, role, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id";

    const values = [firstname, lastname, email, hash_password, "user", new Date().toISOString()];

    const result = await fastify.pg.query(query, values);

    if (result.rowCount === 1) {
      req.session.authenticated = true;
      req.session.user = {
        id: result.rows[0].id,
        firstname,
        lastname,
        email,
        role: "user",
      };
      res.code(200).send(req.session);
    } else {
      res.code(500).send("Une erreur est survenue lors de l'enregistrement de l'utilisateur");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.code(500).send({
        error: "Erreur lors de l'enregistrement de l'utilisateur",
        details: error.message,
      });
    } else {
      res.code(500).send({
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
