import { useEffect, useState, useRef, useCallback } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import AddMovieDialog from "./AddMovieDialog";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import ProfileMenu from "./ProfileMenu";
import type { MovieType } from "@/types/schema";
import { BACKEND_URL } from "@/url";

export default function Movies({ user }: { user: any }) {
  const [movies, setMovies] = useState<Array<MovieType>>([]);
  const [filteredMovies, setFilteredMovies] = useState<Array<MovieType>>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<keyof MovieType>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Fetch movies from API
  const fetchMovies = async (pageNum = 1, append = false) => {
    try {
      if (append) setFetchingMore(true);
      else setLoading(true);

      const response = await fetch(
        `${BACKEND_URL}/api/movies?page=${pageNum}`,
        { credentials: "include" }
      );
      const data = await response.json();

      if (append) {
        setMovies((prev) => [...prev, ...data.movies]);
      } else {
        setMovies(data.movies);
      }

      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchMovies(1, false);
  }, []);

  const refetch = useCallback(() => {
    setMovies([]);
    setFilteredMovies([]);
    setPage(1);
    fetchMovies(1, false);
  }, []);

  // Infinite scroll
  const handleScroll = useCallback(() => {
    const container = tableContainerRef.current;
    if (!container || fetchingMore || page >= totalPages) return;

    const isBottom =
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 20;

    if (isBottom) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovies(nextPage, true);
    }
  }, [fetchingMore, page, totalPages]);

  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    let result = [...movies];

    // Filter
    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      const isNumeric = !isNaN(Number(lowerSearch));
      result = result.filter((movie) => {
        if (isNumeric) {
          return (
            movie.budget?.toString().includes(lowerSearch) ||
            movie.releaseYear?.toString().includes(lowerSearch) ||
            movie.duration?.toString().includes(lowerSearch)
          );
        } else
          return (
            movie.title?.toLowerCase().includes(lowerSearch) ||
            movie.type?.toLowerCase().includes(lowerSearch) ||
            movie.director?.toLowerCase().includes(lowerSearch) ||
            movie.location?.toLowerCase().includes(lowerSearch)
          );
      });
    }

    result.sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];

      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortOrder === "asc"
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }

      const numA = Number(fieldA);
      const numB = Number(fieldB);
      if (isNaN(numA) || isNaN(numB)) return 0;

      return sortOrder === "asc" ? numA - numB : numB - numA;
    });

    setFilteredMovies(result);
  }, [movies, search, sortField, sortOrder]);

  // Sorting handler
  const handleSort = (field: keyof MovieType) => {
    if (field === sortField) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Icon renderer
  const renderSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1" />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wide flex items-center gap-2">
            🎥 Movie Dashboard
          </h1>

          <div className="flex items-center gap-3">
            <AddMovieDialog refetch={refetch} />

            {user && (
              <div className="bg-white rounded-lg shadow-sm">
                <ProfileMenu
                  user={user}
                  onLogout={async () => {
                    await fetch(`${BACKEND_URL}/api/auth/logout`, {
                      method: "POST",
                      credentials: "include",
                    });
                    window.location.href = "/login";
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Search */}
          <div className="p-4 border-b flex justify-between items-center">
            <input
              type="text"
              placeholder="🔍 Search by title, director, type, location, year, duration or budget..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* Table */}
          <div
            ref={tableContainerRef}
            className="overflow-y-scroll max-h-[90vh] border-t"
          >
            {loading && !fetchingMore ? (
              <div className="text-center py-8 text-gray-500">
                Loading movies...
              </div>
            ) : filteredMovies.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No movies found.
              </div>
            ) : (
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-indigo-100 text-indigo-700 uppercase text-xs font-semibold sticky top-0">
                  <tr>
                    {[
                      "title",
                      "type",
                      "director",
                      "budget",
                      "location",
                      "duration",
                      "releaseYear",
                      "imageUrl",
                    ].map((col) => (
                      <th
                        key={col}
                        className="px-6 py-3 text-left cursor-pointer select-none hover:bg-indigo-200 transition"
                        onClick={() => handleSort(col as keyof MovieType)}
                      >
                        <div className="flex items-center">
                          {col === "releaseYear"
                            ? "Year"
                            : col.charAt(0).toUpperCase() + col.slice(1)}
                          {renderSortIcon(col)}
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMovies.map((movie: MovieType) => (
                    <tr
                      key={movie.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-3">{movie.title}</td>
                      <td className="px-6 py-3">{movie.type}</td>
                      <td className="px-6 py-3">{movie.director}</td>
                      <td className="px-6 py-3">${movie.budget}</td>
                      <td className="px-6 py-3">{movie.location}</td>
                      <td className="px-6 py-3">{movie.duration}</td>
                      <td className="px-6 py-3">{movie.releaseYear}</td>
                      <td className="px-6 py-3">
                        {movie.imageUrl ? (
                          <img
                            src={movie.imageUrl}
                            alt={movie.title}
                            className="w-16 h-16 object-cover rounded-lg border shadow-sm mx-auto sm:w-18 sm:h-18 md:w-20 md:h-20"
                          />
                        ) : (
                          <span className="text-gray-400">No Image</span>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <EditModal movie={movie} refetch={refetch} />
                          <DeleteModal
                            movieId={movie.id as number}
                            movieTitle={movie.title}
                            refetch={refetch}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {fetchingMore && (
              <div className="text-center py-4 text-indigo-600 font-medium">
                Loading more movies...
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
