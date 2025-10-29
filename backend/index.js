import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";

dotenv.config({ path: "./.env" });

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

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
