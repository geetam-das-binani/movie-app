import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginType } from "@/types/schema";



export default function Login({ setUser }: { setUser: (user: any) => void }) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (formData: LoginType) => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok && data?.user) {
        toast.success("Login successful!");
        setUser(data.user);
        navigate("/");
      } else {
        const errorMsg =
          data?.errors?.map((err: any) => err.message).join("\n") ||
          data?.message ||
          "Login failed!";
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-100 to-indigo-200">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-indigo-700">
            🎬 Welcome Back
          </CardTitle>
          <p className="text-gray-500 text-sm mt-1">
            Login to manage your movie dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                className="mt-1"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter your password"
                className="mt-1"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "Login"
              )}
            </Button>

            <p className="text-sm text-center text-gray-500">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 hover:underline font-medium"
              >
                Register
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
