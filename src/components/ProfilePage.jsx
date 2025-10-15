import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../utils/api";
import ProfileView from "./ProfileView";
import ProfileEditor from "./ProfileEditor";

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((s) => s.user?.data || s.user);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProfile = async () => {
      // If no id -> own profile. Ensure logged in.
      if (!id) {
        if (!currentUser) {
          navigate("/login", { replace: true });
          return;
        }
        setProfile(currentUser);
        return;
      }

      // If id matches currentUser -> reuse
      if (
        currentUser &&
        (String(currentUser._id) === String(id) ||
          String(currentUser.id) === String(id))
      ) {
        setProfile(currentUser);
        return;
      }

      // Fetch public profile by id
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/profile/${id}`, {
          withCredentials: true,
          signal,
        });
        const data = res?.data?.data || res?.data;
        if (!mountedRef.current) return;
        setProfile(data);
      } catch (err) {
        if (err?.name === "CanceledError" || err?.name === "AbortError") return;
        console.error("Failed to fetch profile:", err);
        if (!mountedRef.current) return;
        if (err?.response?.status === 404) {
          setError("User not found.");
        } else {
          setError("Could not load profile. Try again.");
        }
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    fetchProfile();
    return () => controller.abort();
  }, [id, currentUser, navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" aria-hidden />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center text-error">{error}</div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const isOwner =
    currentUser &&
    (String(currentUser._id) === String(profile._id) ||
      String(currentUser.id) === String(profile._id) ||
      !id);

  return (
    <div className="py-8">
      {isOwner ? (
        <ProfileEditor initialUser={profile} />
      ) : (
        <ProfileView user={profile} />
      )}
    </div>
  );
};

export default ProfilePage;
