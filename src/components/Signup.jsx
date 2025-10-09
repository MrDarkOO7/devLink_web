// src/components/Signup.jsx
import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // simple email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setFieldErrors((s) => ({ ...s, [name]: null }));
    setGeneralError(null);
  };

  const validate = () => {
    const errors = {};
    if (!form.firstName.trim()) errors.firstName = "First name is required.";
    if (!form.lastName.trim()) errors.lastName = "Last name is required.";
    if (!form.emailId.trim()) {
      errors.emailId = "Email is required.";
    } else if (!emailRegex.test(form.emailId)) {
      errors.emailId = "Please enter a valid email address.";
    }
    if (!form.password) {
      errors.password = "Password is required.";
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }
    if (!form.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setGeneralError(null);

    const errors = validate();
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      // signup endpoint: POST /signup
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        emailId: form.emailId.trim(),
        password: form.password,
      };

      const res = await api.post("/signup", payload);

      // server returns { message: "User signed up successfully" }
      const successMsg =
        (res && res.data && res.data.message) || "Signed up successfully.";
      setMessage(successMsg);

      // Optionally clear form
      setForm({
        firstName: "",
        lastName: "",
        emailId: "",
        password: "",
        confirmPassword: "",
      });
      setFieldErrors({});

      // Redirect to login after 1s so user sees message (optional)
      if (navigate) {
        setTimeout(() => navigate("/login"), 1000);
      }
    } catch (err) {
      console.error("Signup error:", err);

      // Prefer server message if present
      const serverMsg =
        typeof err?.response?.data === "string"
          ? err.response.data
          : err?.response?.data?.message ||
            err?.response?.data?.error ||
            (err?.response?.data && JSON.stringify(err.response.data));

      // If validation-like errors are returned as an object (e.g., { field: '...' })
      if (err?.response?.data && typeof err.response.data === "object") {
        // Try to map field errors
        const maybeFieldErrors = {};
        for (const k of ["firstName", "lastName", "emailId", "password"]) {
          if (err.response.data[k]) maybeFieldErrors[k] = err.response.data[k];
        }
        if (Object.keys(maybeFieldErrors).length) {
          setFieldErrors(maybeFieldErrors);
          setGeneralError(null);
        } else {
          setGeneralError(serverMsg || "Signup failed. Please try again.");
        }
      } else {
        setGeneralError(serverMsg || "Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-base-200 px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-lg bg-base-100 shadow-xl border border-base-300"
        aria-busy={loading}
      >
        <div className="card-body space-y-4">
          <h2 className="card-title text-center text-2xl font-semibold mb-2">
            Create account
          </h2>

          {/* first + last name row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text">First name</span>
              </label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className={`input input-bordered w-full ${
                  fieldErrors.firstName ? "input-error" : ""
                }`}
                placeholder=""
                aria-invalid={!!fieldErrors.firstName}
                aria-describedby={
                  fieldErrors.firstName ? "err-firstName" : undefined
                }
              />
              {fieldErrors.firstName && (
                <p id="err-firstName" className="text-error text-sm mt-1">
                  {fieldErrors.firstName}
                </p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Last name</span>
              </label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className={`input input-bordered w-full ${
                  fieldErrors.lastName ? "input-error" : ""
                }`}
                placeholder=""
                aria-invalid={!!fieldErrors.lastName}
                aria-describedby={
                  fieldErrors.lastName ? "err-lastName" : undefined
                }
              />
              {fieldErrors.lastName && (
                <p id="err-lastName" className="text-error text-sm mt-1">
                  {fieldErrors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              name="emailId"
              type="email"
              value={form.emailId}
              onChange={handleChange}
              className={`input input-bordered w-full ${
                fieldErrors.emailId ? "input-error" : ""
              }`}
              placeholder="you@example.com"
              aria-invalid={!!fieldErrors.emailId}
              aria-describedby={fieldErrors.emailId ? "err-emailId" : undefined}
            />
            {fieldErrors.emailId && (
              <p id="err-emailId" className="text-error text-sm mt-1">
                {fieldErrors.emailId}
              </p>
            )}
          </div>

          {/* password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                className={`input input-bordered w-full pr-12 ${
                  fieldErrors.password ? "input-error" : ""
                }`}
                placeholder="Create a password"
                aria-invalid={!!fieldErrors.password}
                aria-describedby={
                  fieldErrors.password ? "err-password" : undefined
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/70 hover:text-base-content transition-colors"
              >
                {showPassword ? (
                  // eye-off
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
                  // eye
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
            {fieldErrors.password && (
              <p id="err-password" className="text-error text-sm mt-1">
                {fieldErrors.password}
              </p>
            )}
            <p className="text-xs text-base-content/60 mt-1">
              Use at least 6 characters.
            </p>
          </div>

          {/* confirm */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Confirm password</span>
            </label>
            <input
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
              className={`input input-bordered w-full ${
                fieldErrors.confirmPassword ? "input-error" : ""
              }`}
              placeholder="Repeat your password"
              aria-invalid={!!fieldErrors.confirmPassword}
              aria-describedby={
                fieldErrors.confirmPassword ? "err-confirmPassword" : undefined
              }
            />
            {fieldErrors.confirmPassword && (
              <p id="err-confirmPassword" className="text-error text-sm mt-1">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* general error / success */}
          {generalError && (
            <div className="text-sm text-error bg-error/10 p-2 rounded">
              {generalError}
            </div>
          )}
          {message && (
            <div className="text-sm text-success bg-success/10 p-2 rounded">
              {message}
            </div>
          )}

          {/* submit */}
          <div className="card-actions">
            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>

          <p className="text-center text-sm text-base-content/70">
            Already have an account?{" "}
            <a
              href="/login"
              onClick={(e) => {
                if (navigate) {
                  e.preventDefault();
                  navigate("/login");
                }
              }}
              className="link link-primary"
            >
              Log in
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
