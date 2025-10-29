import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddMovieDialog = ({ refetch }: { refetch: () => void }) => {
  const [movie, setMovie] = useState({
    title: "",
    type: "",
    director: "",
    budget: "",
    location: "",
    duration: "",
    releaseYear: "",
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setMovie({ ...movie, type: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...movie,
          budget: parseFloat(movie.budget),
          duration: parseInt(movie.duration),
          releaseYear: parseInt(movie.releaseYear),
        }),
        credentials: "include",
      });

      if (response.ok) {
        refetch();
        alert("✅ Movie added successfully!");
      } else {
        const errorData = await response.json();
        const errors = errorData.errors
          ? errorData.errors.map((err: any) => err.message).join("\n")
          : "";
        alert(
          `❌ Failed to add movie: ${errors || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error(error);
      alert("⚠️ Something went wrong!");
    } finally {
      setMovie({
        title: "",
        type: "",
        director: "",
        budget: "",
        location: "",
        duration: "",
        releaseYear: "",
      });
      setOpen(false);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          Add Movie
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Movie</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new movie to your list.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={movie.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Type (Select Dropdown) */}
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select required onValueChange={handleSelectChange}>
                <SelectTrigger id="type" className="w-full">
                  <SelectValue
                    placeholder="Select movie type"
                    defaultValue={movie.type}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="movie">Movie</SelectItem>
                  <SelectItem value="tvShow">TV Show</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Director */}
            <div className="grid gap-2">
              <Label htmlFor="director">Director</Label>
              <Input
                id="director"
                name="director"
                value={movie.director}
                onChange={handleChange}
                required
              />
            </div>

            {/* Budget */}
            <div className="grid gap-2">
              <Label htmlFor="budget">Budget (in million USD)</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                step="0.01"
                value={movie.budget}
                onChange={handleChange}
                required
              />
            </div>

            {/* Location */}
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={movie.location}
                onChange={handleChange}
                required
              />
            </div>

            {/* Duration */}
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                value={movie.duration}
                onChange={handleChange}
                required
              />
            </div>

            {/* Release Year */}
            <div className="grid gap-2">
              <Label htmlFor="releaseYear">Release Year</Label>
              <Input
                id="releaseYear"
                name="releaseYear"
                type="number"
                value={movie.releaseYear}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button disabled={loading} variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={loading}
              type="submit"
              className="bg-indigo-600
              disabled:bg-gray-500
              disabled:cursor-not-allowed
              hover:bg-indigo-700 text-white"
            >
              {loading ? (
                <>
                  Saving{" "}
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                </>
              ) : (
                "Save Movie"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMovieDialog;
