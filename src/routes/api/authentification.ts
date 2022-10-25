import { Router } from "express";
import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";

import {
  compare,
  generateAccessToken,
  hashPassword,
} from "../../middlewares/auth";

const api = Router();

api.post("/login", async ({ prisma, body }, res) => {
    try {
      if (!body.username || !body.password) {
        return res.status(400).end();
      }

      const user = await prisma.user.findUnique({
        where: {
          username: body.username,
        },
      });

      if (!user) {
        return res.status(401).json({ error: "invalid username" });
      }
      const { password } = user;

      if (!(await compare(body.password, password))) {
        return res.status(401).json({ error: "wrong password" });
      }
      
      const token = generateAccessToken(
        body.username,
        user.id
      );
      
      res.status(200).json({
        token,
      });
    } catch (error) {
      console.log(error);
    }
  });

  api.post("/register", async ({ prisma, body }, res) => {
    try {

      const { username, password } = body;

      if (!username || !password) {
        return res.status(400).end();
      }

      const hashed = await hashPassword(password);

      await prisma.user.create({
        data: {
          username,
          password: hashed,
        },
      });
      
      res.status(200).end();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == "P2002") {
          res.status(401).json({ error: "username or email already used" });
        }
      }
      res.status(500).end();
    }
  });

  api.get("/auth", (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
      return res.status(401).end();
    }

    jwt.verify(
      token,
      process.env.TOKEN_SECRET as string,
      (err: any, user: any) => {
        console.log(err);

        if (err) return res.status(403).end();
        res.status(200).json(true);
      }
    );
  });

export default api