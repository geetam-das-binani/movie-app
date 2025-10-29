import { movieSchema } from "./validation.js";
import { z } from "zod";

export const validateMovie = (req, res, next) => {
  try {
    req.body = movieSchema.parse(req.body);
    next();
  } catch (err) {
    // ✅ Check for ZodError safely
    if (err instanceof z.ZodError) {
      // Zod stores details in `err.issues`
      const formattedErrors = err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formattedErrors,
      });
    }

    // Unexpected errors
    console.error("Unexpected validation error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during validation",
    });
  }
};
