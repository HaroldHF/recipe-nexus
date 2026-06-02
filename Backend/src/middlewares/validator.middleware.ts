import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

/**
 * Middleware genérico que valida el body de la petición
 * contra el esquema Zod proporcionado.
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(422).json({ errors: result.error.flatten().fieldErrors });
      return;
    }

    req.body = result.data;
    next();
  };
}
