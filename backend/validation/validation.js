import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginUserSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const movieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.string().min(1, "Type is required"),
  director: z.string().min(1, "Director name is required"),
  budget: z
    .number({ invalid_type_error: "Budget must be a number" })
    .positive("Budget must be positive"),
  location: z.string().min(1, "Location is required"),
  duration: z
    .number({ invalid_type_error: "Duration must be a number" })
    .min(1, "Duration must be at least 1 minute"),
  releaseYear: z
    .number({ invalid_type_error: "Release year must be a number" })
    .gte(1888, "Invalid release year")
    .lte(new Date().getFullYear(), "Release year can't be in the future"),
});
