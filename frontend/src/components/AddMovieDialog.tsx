import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

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
import { movieSchema, type MovieType } from "@/types/schema";
import { toast } from "react-toastify";

const AddMovieDialog = ({ refetch }: { refetch: () => void }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MovieType>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      title: "",
      type: "movie",
      director: "",
      budget: "",
      location: "",
      duration: "",
      releaseYear: "",
    },
  });

  const watchType = watch("type");
  const onSubmit = async (formData: MovieType) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          budget: parseFloat(formData.budget),
          duration: parseInt(formData.duration),
          releaseYear: parseInt(formData.releaseYear),
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        refetch();
        toast.success("Movie added successfully!");
        reset();
        setOpen(false);
      } else {
        const errors = data.errors
          ? data.errors.map((err: any) => err.message).join("\n")
          : data.message || "Unknown error";
        toast.error(`Failed to add movie: ${errors}`);
      }
    } catch (error) {
      
      toast.error(" Something went wrong!");
    } finally {
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
        <form onSubmit={handleSubmit(onSubmit)}>
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
              <Input id="title" {...register("title")} />
              {errors.title && (
                <p className="text-red-500 text-xs">{errors.title.message}</p>
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
                <SelectTrigger className="w-full" id="type">
                  <SelectValue placeholder="Select movie type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="movie">Movie</SelectItem>
                  <SelectItem value="tvShow">TV Show</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-red-500 text-xs">{errors.type.message}</p>
              )}
            </div>

            {/* Director */}
            <div className="grid gap-2">
              <Label htmlFor="director">Director</Label>
              <Input
                id="director"
                {...register("director", {
                  required: "Director is required",
                  validate: (value) => {
                    if (!isNaN(Number(value))) {
                      return "Director name cannot be a number";
                    }
                    return true;
                  },
                })}
              />

              {errors.director && (
                <p className="text-red-500 text-xs">
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
                <p className="text-red-500 text-xs">{errors.budget.message}</p>
              )}
            </div>

            {/* Location */}
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...register("location")} />
              {errors.location && (
                <p className="text-red-500 text-xs">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Duration */}
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input id="duration" type="number" {...register("duration")} />
              {errors.duration && (
                <p className="text-red-500 text-xs">
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
                <p className="text-red-500 text-xs">
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
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white ml-2" />
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
