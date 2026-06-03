import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

/**
 * Middleware genérico que valida el body de la petición
 * contra el esquema Zod proporcionado. Reemplaza req.body por
 * los datos ya parseados (descarta propiedades no declaradas).
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Datos inválidos",
        errors: result.error.issues.map((e) => ({
          campo: e.path.join("."),
          mensaje: e.message,
        })),
      });
      return;
    }

    req.body = result.data;
    next();
  };
}
