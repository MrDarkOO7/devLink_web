import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../utils/api";
import { addUser, removeUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { defaultProfile } from "../utils/environment";

const DEFAULT_AVATAR_MALE =
  defaultProfile?.male ||
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";
const DEFAULT_AVATAR_FEMALE =
  defaultProfile?.female ||
  "https://cdn-icons-png.flaticon.com/512/4140/4140048.png";

const ProfileEditor = ({ initialUser }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    bio: "",
    skills: [],
    photoUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (initialUser) {
      setForm({
        firstName: initialUser.firstName || "",
        lastName: initialUser.lastName || "",
        age: initialUser.age ?? "",
        gender: initialUser.gender || "",
        bio: initialUser.bio || "",
        skills: Array.isArray(initialUser.skills)
          ? initialUser.skills
          : initialUser.skills
          ? initialUser.skills.split(",").map((s) => s.trim())
          : [],
        photoUrl: initialUser.photoUrl || "",
      });
    }
  }, [initialUser]);

  const displayAvatar =
    form.photoUrl ||
    (form.gender?.toLowerCase() === "female"
      ? DEFAULT_AVATAR_FEMALE
      : DEFAULT_AVATAR_MALE);

  const validate = (values) => {
    const errs = {};
    const { firstName, lastName, age, photoUrl, bio, skills } = values;

    if (firstName && (firstName.length < 3 || firstName.length > 30)) {
      errs.firstName = "First name must be 3-30 characters long";
    }
    if (lastName && (lastName.length < 3 || lastName.length > 30)) {
      errs.lastName = "Last name must be 3-30 characters long";
    }
    if (age) {
      const ageNum = Number(age);
      if (Number.isNaN(ageNum) || ageNum < 18) {
        errs.age = "Age must be a number and at least 18";
      }
    }
    if (photoUrl) {
      try {
        new URL(photoUrl);
      } catch {
        errs.photoUrl = "Photo URL is invalid";
      }
    }
    if (bio && bio.length > 250) {
      errs.bio = "Bio cannot exceed 250 characters";
    }
    if (skills && skills.length > 10) {
      errs.skills = "Skills cannot be more than 10";
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setFieldErrors((s) => ({ ...s, [name]: undefined }));
    setMessage(null);
    setError(null);
  };

  const handleSkillKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = e.target.value.trim().replace(/,$/, "");
      if (!val) return;
      if (form.skills.includes(val)) {
        e.target.value = "";
        return;
      }
      if (form.skills.length >= 10) {
        setFieldErrors((s) => ({
          ...s,
          skills: "Skills cannot be more than 10",
        }));
        e.target.value = "";
        return;
      }
      setForm((s) => ({ ...s, skills: [...s.skills, val] }));
      e.target.value = "";
    }
  };

  const removeSkill = (skill) => {
    setForm((s) => ({ ...s, skills: s.skills.filter((sk) => sk !== skill) }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setMessage(null);
    setError(null);

    const errs = validate(form);
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }

    const payload = {};
    const allowed = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "bio",
      "skills",
      "photoUrl",
    ];
    allowed.forEach((k) => {
      const newVal = form[k];
      const origVal = initialUser
        ? Array.isArray(initialUser[k])
          ? initialUser[k]
          : initialUser[k]
        : undefined;
      const normalizedNew = typeof newVal === "string" ? newVal.trim() : newVal;
      const changed =
        (Array.isArray(normalizedNew) &&
          JSON.stringify(normalizedNew) !== JSON.stringify(origVal)) ||
        (!Array.isArray(normalizedNew) &&
          String(normalizedNew) !== String(origVal));
      if (normalizedNew !== "" && changed) {
        payload[k] = normalizedNew;
      }
    });

    if (Object.keys(payload).length === 0) {
      setMessage("No changes to save.");
      setIsEditing(false);
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setLoading(true);
    try {
      const res = await api.patch("/profile/edit", payload, {
        withCredentials: true,
      });
      const updatedUser = res?.data?.userData || res?.data;
      setMessage(res?.data?.message || "Profile updated");
      setTimeout(() => setMessage(null), 4000);

      dispatch(addUser(updatedUser));

      setForm((s) => ({
        ...s,
        ...Object.fromEntries(Object.entries(payload)),
      }));
      setIsEditing(false);
    } catch (err) {
      if (err?.response?.status === 401) {
        dispatch(removeUser());
        navigate("/login");
      }
      console.error("Error updating profile:", err);
      const serverMsg =
        typeof err?.response?.data === "string"
          ? err.response.data
          : err?.response?.data?.message || err?.response?.data?.error;
      setError(serverMsg || "Failed to update profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="card bg-base-100 shadow-lg rounded-xl overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 bg-base-200 flex items-center justify-center p-6">
            <div className="w-36 h-36 rounded-full overflow-hidden ring-2">
              <img
                src={displayAvatar}
                alt={`${form.firstName || "User"} avatar`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="md:w-2/3 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {initialUser?.firstName} {initialUser?.lastName}
                </h2>
                <p className="text-sm text-base-content/60 mt-1">
                  {initialUser?.emailId}
                </p>
              </div>

              <div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setIsEditing((s) => !s);
                    setMessage(null);
                    setError(null);
                    setFieldErrors({});
                  }}
                >
                  {isEditing ? "Cancel" : "Edit"}
                </button>
              </div>
            </div>

            {!isEditing ? (
              <>
                <div className="mt-4 text-base text-base-content/80 leading-relaxed">
                  {initialUser?.bio ? (
                    initialUser.bio
                  ) : (
                    <span className="text-sm text-base-content/60">
                      No bio added.
                    </span>
                  )}
                </div>

                {Array.isArray(initialUser?.skills) &&
                initialUser.skills.length > 0 ? (
                  <div className="mt-5">
                    <h4 className="text-sm font-medium text-base-content/70 mb-2">
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {initialUser.skills.map((s, i) => (
                        <span
                          key={i}
                          className="badge badge-outline text-sm capitalize"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-4 text-sm text-base-content/60 flex gap-4">
                  {initialUser?.age ? <div>{initialUser.age} yrs</div> : null}
                  {initialUser?.gender ? (
                    <div className="capitalize">{initialUser.gender}</div>
                  ) : null}
                </div>

                {message && (
                  <div className="mt-4 text-sm text-success">{message}</div>
                )}
                {error && (
                  <div className="mt-4 text-sm text-error">{error}</div>
                )}
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
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
                    />
                    {fieldErrors.firstName && (
                      <p className="text-xs text-error mt-1">
                        {fieldErrors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
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
                    />
                    {fieldErrors.lastName && (
                      <p className="text-xs text-error mt-1">
                        {fieldErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="label">
                      <span className="label-text">Age</span>
                    </label>
                    <input
                      name="age"
                      type="number"
                      min="18"
                      value={form.age}
                      onChange={handleChange}
                      className={`input input-bordered w-full ${
                        fieldErrors.age ? "input-error" : ""
                      }`}
                    />
                    {fieldErrors.age && (
                      <p className="text-xs text-error mt-1">
                        {fieldErrors.age}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Gender</span>
                    </label>
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="select select-bordered w-full"
                    >
                      <option value="">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Photo URL</span>
                  </label>
                  <input
                    name="photoUrl"
                    value={form.photoUrl}
                    onChange={handleChange}
                    className={`input input-bordered w-full ${
                      fieldErrors.photoUrl ? "input-error" : ""
                    }`}
                  />
                  {fieldErrors.photoUrl && (
                    <p className="text-xs text-error mt-1">
                      {fieldErrors.photoUrl}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2">
                      <img
                        src={form.photoUrl || displayAvatar}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-sm text-base-content/60">Preview</div>
                  </div>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Bio</span>
                  </label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows={4}
                    className={`textarea textarea-bordered w-full ${
                      fieldErrors.bio ? "input-error" : ""
                    }`}
                  />
                  <div className="flex justify-between items-center mt-1 text-xs text-base-content/60">
                    <div>{form.bio.length}/250</div>
                    {fieldErrors.bio && (
                      <div className="text-xs text-error">
                        {fieldErrors.bio}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Skills</span>
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      placeholder="Type a skill and press Enter or comma"
                      className={`input input-bordered flex-1 ${
                        fieldErrors.skills ? "input-error" : ""
                      }`}
                      onKeyDown={handleSkillKey}
                    />
                    <div className="text-sm text-base-content/60">
                      Press Enter
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {form.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="badge badge-outline flex items-center gap-2"
                      >
                        <span className="capitalize">{s}</span>
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs"
                          onClick={() => removeSkill(s)}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>

                  {fieldErrors.skills && (
                    <p className="text-xs text-error mt-1">
                      {fieldErrors.skills}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 justify-end mt-3">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setIsEditing(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`btn btn-primary ${loading ? "loading" : ""}`}
                    disabled={loading}
                  >
                    Save changes
                  </button>
                </div>

                {message && (
                  <div className="mt-3 text-sm text-success">{message}</div>
                )}
                {error && (
                  <div className="mt-3 text-sm text-error">{error}</div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;
