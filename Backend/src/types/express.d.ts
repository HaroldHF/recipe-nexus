import type { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      usuario?: JwtPayload & { id: string; email: string };
    }
  }
}

export {};
