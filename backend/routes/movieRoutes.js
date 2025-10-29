import express from "express";
const router = express.Router();
import {
  createMovie,
  deleteMovie,
  getMovies,
  updateMovie,
} from "../controllers/movieController.js"
// const authMiddleware = require('../middleware/authMiddleware');

router.post("/", createMovie);
router.get("/", getMovies);
router.put("/:id", updateMovie);
router.delete("/:id", deleteMovie);


export default router;
