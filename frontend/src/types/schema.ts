// src/schemas.ts
import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password too long"),
});

export type RegisterType = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginType = z.infer<typeof loginSchema>;

// ✅ Movie Schema
export const movieSchema = z.object({
    id: z.number().optional(), 
  title: z.string().min(1, "Title is required"),
  type: z.enum(["movie", "tvShow"], { message: "Type is required" }).optional(),
  director: z.string().min(1, "Director is required"),
  budget: z
    .string()
    .min(1, "Budget is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Budget must be a valid positive number",
    }),
  location: z.string().min(1, "Location is required"),
  duration: z
    .string()
    .min(1, "Duration is required")
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
      message: "Duration must be a valid number",
    }),
  releaseYear: z
    .string()
    .min(4, "Enter a valid year")
    .refine(
      (val) =>
        !isNaN(parseInt(val)) &&
        parseInt(val) >= 1900 &&
        parseInt(val) <= new Date().getFullYear() + 1,
      {
        message: "Release year must be between 1900 and next year",
      }
    ),
});

export type MovieType = z.infer<typeof movieSchema>;
