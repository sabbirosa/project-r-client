import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);
    
    if (result.success) {
      // Redirect to dashboard or home based on user role
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-950/30 shadow-lg">
            <FaUser className="h-7 w-7 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
            Sign in to your blood donor account
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <Input
                label="Email Address"
                type="email"
                required
                placeholder="Enter your email"
                error={errors.email?.message}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
              />

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  Password <span className="text-red-600 dark:text-red-400 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    {...register("password", {
                      required: "Password is required"
                    })}
                    type={showPassword ? "text" : "password"}
                    className="flex h-10 w-full rounded-md border px-3 py-2 text-sm font-medium bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500 focus:border-red-600 dark:focus:border-red-500 hover:border-gray-400 dark:hover:border-gray-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-all duration-200 ease-in-out pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-4 w-4" />
                    ) : (
                      <FaEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm font-medium text-red-600 dark:text-red-400 mt-1">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full"
                size="lg"
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>

              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
                  >
                    Register here
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Login; 