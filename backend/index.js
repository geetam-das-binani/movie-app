import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config({ path: "./.env" });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 8001;
const app = express();
app.use(
  cors({
    origin: [process.env.APP_HOST],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
