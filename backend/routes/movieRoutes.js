import express from "express";
const router = express.Router();
import {
  createMovie,
  deleteMovie,
  getMovies,
  updateMovie,
} from "../controllers/movieController.js";
import { validateMovie } from "../validation/movieValidation.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

router.post("/", authMiddleware, validateMovie, createMovie);
router.get("/", authMiddleware, getMovies);
router.put("/:id", authMiddleware, validateMovie, updateMovie);
router.delete("/:id", authMiddleware, deleteMovie);

export default router;
