import { ZodError } from "zod";

export function validate(schema) {
  return (req, res, next) => {
    try {
      const data = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      });
      req.validated = data;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: "ValidationError",
          issues: err.issues
        });
      }
      next(err);
    }
  };
}
