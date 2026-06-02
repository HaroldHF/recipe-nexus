import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Token no proporcionado" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Token no proporcionado" });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET as string;
    const payload = jwt.verify(token, secret);
    req.usuario = payload as JwtPayload & { id: string; email: string };
    next();
  } catch {
    res.status(403).json({ message: "Token inválido o expirado" });
  }
}
