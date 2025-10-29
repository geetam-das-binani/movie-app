import { registerUserSchema, loginUserSchema } from "./validation.js";
import { z } from "zod";

export const validateAuthRegister = (req, res, next) => {
  try {
    req.body = registerUserSchema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const formattedErrors = err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Registration validation failed",
        errors: formattedErrors,
      });
    }

    console.error("Unexpected registration validation error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during registration validation",
    });
  }
};

export const validateAuthLogin = (req, res, next) => {
  try {
    req.body = loginUserSchema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const formattedErrors = err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Login validation failed",
        errors: formattedErrors,
      });
    }

    console.error("Unexpected login validation error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during login validation",
    });
  }
};
