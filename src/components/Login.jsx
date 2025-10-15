import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const validate = () => {
    setError(null);
    if (!email) return "Please enter your email.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address.";
    if (!password) return "Please enter your password.";
    if (password.length < 6) return "Password should be at least 6 characters.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await api.post("/auth/login", {
        emailId: email,
        password,
      });

      const respData = response?.data;
      const user = respData?.data;
      const msg = respData?.message || "Logged in";

      setMessage(msg);
      dispatch(addUser(user));
      if (navigate) {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);

      const status = err?.response?.status;
      let friendly;

      if (status === 400) {
        friendly = "Email and password are required.";
      } else if (status === 404) {
        friendly = "User not found.";
      } else if (status === 401) {
        friendly = "Invalid password.";
      } else {
        friendly = "Login failed. Please try again.";
      }

      setError(friendly);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-base-200 px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300"
        aria-busy={loading}
      >
        <div className="card-body space-y-4">
          <h2 className="card-title text-center text-2xl font-semibold mb-2">
            Welcome Back 👋
          </h2>

          <fieldset className="form-control flex flex-col gap-1">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
                setMessage(null);
              }}
              placeholder="Enter your email"
              className="input input-bordered w-full"
              required
            />
          </fieldset>

          <fieldset className="form-control flex flex-col gap-1">
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                  setMessage(null);
                }}
                placeholder="Enter your password"
                className="input input-bordered w-full pr-10"
                required
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/70 hover:text-base-content transition-colors"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.5 12c2.123 3.873 6.177 6.75 10.5 6.75 1.757 0 3.42-.402 4.898-1.115M9.88 9.88a3 3 0 1 0 4.24 4.24"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.228 6.228l11.544 11.544"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a10.477 10.477 0 0 1 19.928 0C19.841 16.195 15.787 19.072 11.464 19.072S3.087 16.195 2.036 12.322z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                    />
                  </svg>
                )}
              </button>
            </div>

            <label className="label mt-2">
              <a href="#" className="label-text-alt link link-hover text-sm">
                Forgot password?
              </a>
            </label>
          </fieldset>

          {error && (
            <div className="text-sm text-error bg-error/10 p-2 rounded">
              {error}
            </div>
          )}
          {message && (
            <div className="text-sm text-success bg-success/10 p-2 rounded">
              {message}
            </div>
          )}

          <div className="card-actions mt-2">
            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </div>

          <p className="text-center text-sm text-base-content/70">
            Don’t have an account?{" "}
            <a href="/signup" className="link link-primary">
              Sign up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
