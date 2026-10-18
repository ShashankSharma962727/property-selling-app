import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
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

          {/* Login Card */}
          <div className="mt-8 rounded-2xl border border-cream-200 bg-white p-6 shadow-sm sm:p-8">
            <h1 className="font-serif text-2xl text-navy-950">Welcome back</h1>

            <p className="mt-2 text-sm leading-6 text-ink-700">
              login your account
            </p>

            <form className="mt-7 space-y-5">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="enter your password"
                  minLength={8}
                  required
                  className="w-full rounded-lg border border-cream-200 bg-white px-4 py-3 text-sm text-navy-950 outline-none transition placeholder:text-ink-500 focus:border-navy-700 focus:ring-2 focus:ring-navy-100"
                />

                <p className="mt-2 text-xs text-ink-500">
                  Use at least 8 characters.
                </p>
              </div>
              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-lg bg-navy-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-700 focus:ring-offset-2"
              >
                login
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-ink-700">
              Don't have an account?{" "}
              <Link
                to="/register"
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
    </>
  );
};

export default Login;
