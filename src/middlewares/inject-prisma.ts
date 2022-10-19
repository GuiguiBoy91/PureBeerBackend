import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

export function injectPrisma() {
  const prisma = new PrismaClient();
  const user = {};

  return (request: Request, response: Response, next: NextFunction) => {
    request.prisma = prisma;
    request.user = user;
    next();
  };
}
