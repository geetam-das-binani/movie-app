import { prisma } from "../db/prismaClient.js";
const createMovie = async (req, res) => {
  try {
    const { title, director, releaseYear, type, budget, location, duration } =
      req.body;
    // const userId = req.user.userId; // from middleware

    const movie = await prisma.movie.create({
      data: {
        title,
        releaseYear,
        type,
        director,
        budget,
        location,
        duration,
      },
    });

    res.status(201).json({ message: "Movie created successfully", movie });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Fetch paginated movies
    const movies = await prisma.movie.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });

    const totalCount = await prisma.movie.count();

    res.status(200).json({
      movies,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.body);

    const updatedMovie = await prisma.movie.update({
      where: { id: parseInt(id) },
      data: req.body,
    });

    res.status(200).json({ message: "Movie updated", updatedMovie });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.movie.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: "Movie deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createMovie, getMovies, updateMovie, deleteMovie };
