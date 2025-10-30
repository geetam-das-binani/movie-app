import { useEffect, useState } from "react";
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
import { Edit } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { movieSchema, type MovieType } from "@/types/schema";
import { toast } from "react-toastify";
import { BACKEND_URL } from "@/url";

const EditModal = ({
  movie,
  refetch,
}: {
  movie: MovieType;
  refetch: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<MovieType>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      title: "",
      type: undefined,
      director: "",
      budget: "",
      location: "",
      duration: "",
      releaseYear: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (movie) {
      reset({
        title: movie.title || "",
        type: movie.type || undefined,
        director: movie.director || "",
        budget: movie.budget?.toString() || "",
        location: movie.location || "",
        duration: movie.duration?.toString() || "",
        releaseYear: movie.releaseYear?.toString() || "",
        imageUrl: movie.imageUrl || "",
      });
    }
  }, [movie, reset]);

  const watchType = watch("type");
  const onSubmit = async (data: MovieType) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/movies/${movie.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            budget: parseFloat(data.budget),
            duration: parseInt(data.duration),
            releaseYear: parseInt(data.releaseYear),
          }),
          credentials: "include",
        }
      );

      if (response.ok) {
        refetch();
        toast.success("Movie updated successfully!");
      } else {
        toast.error("Failed to update movie.");
      }
    } catch (error) {
      toast.error("An error occurred while updating the movie.");
    } finally {
      reset();
      setOpen(false);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Edit />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Movie</DialogTitle>
            <DialogDescription>
              Modify the fields below to update movie details.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            {/* Type */}
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={watchType}
                onValueChange={(value: string) =>
                  setValue("type", value as MovieType["type"])
                }
              >
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Select movie type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="movie">Movie</SelectItem>
                  <SelectItem value="tvShow">TV Show</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-red-500 text-sm">{errors.type.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Image URL (Optional)</Label>
              <Input id="imageUrl" {...register("imageUrl")} />
      
            </div>

            {/* Director */}
            <div className="grid gap-2">
              <Label htmlFor="director">Director</Label>
              <Input id="director" {...register("director")} />
              {errors.director && (
                <p className="text-red-500 text-sm">
                  {errors.director.message}
                </p>
              )}
            </div>

            {/* Budget */}
            <div className="grid gap-2">
              <Label htmlFor="budget">Budget (in million USD)</Label>
              <Input
                id="budget"
                type="number"
                step="0.01"
                {...register("budget")}
              />
              {errors.budget && (
                <p className="text-red-500 text-sm">{errors.budget.message}</p>
              )}
            </div>

            {/* Location */}
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...register("location")} />
              {errors.location && (
                <p className="text-red-500 text-sm">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Duration */}
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input id="duration" type="number" {...register("duration")} />
              {errors.duration && (
                <p className="text-red-500 text-sm">
                  {errors.duration.message}
                </p>
              )}
            </div>

            {/* Release Year */}
            <div className="grid gap-2">
              <Label htmlFor="releaseYear">Release Year</Label>
              <Input
                id="releaseYear"
                type="number"
                {...register("releaseYear")}
              />
              {errors.releaseYear && (
                <p className="text-red-500 text-sm">
                  {errors.releaseYear.message}
                </p>
              )}
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  Saving{" "}
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
