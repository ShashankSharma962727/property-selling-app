import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../API/api";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (formData.username.trim().length < 3) {
      setError("Username must contain at least 3 characters.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/api/v1/auth/register", formData);

      if (res.data.success) {
        setSuccess(true);

        setFormData({
          username: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream-100 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-md">
        {/* Brand */}
        <Link
          to="/"
          className="block text-center font-serif text-3xl text-navy-950"
        >
          Haven
        </Link>

        <p className="mt-2 text-center text-sm text-ink-700">
          Find your place. Begin your story.
        </p>

        {/* Registration Card */}
        <div className="mt-8 rounded-2xl border border-cream-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="font-serif text-2xl text-navy-950">
            Create your account
          </h1>

          <p className="mt-2 text-sm leading-6 text-ink-700">
            Join Haven to discover your next home.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-ink-700"
              >
                Username
              </label>

              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                minLength={3}
                maxLength={30}
                required
                className="w-full rounded-lg border border-cream-200 bg-white px-4 py-3 text-sm text-navy-950 outline-none transition placeholder:text-ink-500 focus:border-navy-700 focus:ring-2 focus:ring-navy-100"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-ink-700"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-cream-200 bg-white px-4 py-3 text-sm text-navy-950 outline-none transition placeholder:text-ink-500 focus:border-navy-700 focus:ring-2 focus:ring-navy-100"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-ink-700"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                required
                className="w-full rounded-lg border border-cream-200 bg-white px-4 py-3 text-sm text-navy-950 outline-none transition placeholder:text-ink-500 focus:border-navy-700 focus:ring-2 focus:ring-navy-100"
              />

              <p className="mt-2 text-xs text-ink-500">
                Use at least 8 characters.
              </p>
            </div>

            {/* Feedback */}
            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            {success && (
              <p className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
                Account created successfully!
              </p>
            )}
            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-navy-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-700 focus:ring-offset-2"
            >
              {loading ? "Loading..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-700">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-navy-950 underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-ink-500">
          © {new Date().getFullYear()} Haven Estates. All rights reserved.
        </p>
      </div>
    </main>
  );
};

export default Register;
