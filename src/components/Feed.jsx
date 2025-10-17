import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeUserFromFeed } from "../redux/feedSlice";
import UserCard from "./UserCard";
import { removeUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const Feed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const feedData = useSelector((store) => store.feed);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dontFetchMoreFeed, setDontFetchMoreFeed] = useState(false);
  const limit = 10;

  const getFeed = async () => {
    if (feedData && feedData.length > 1) return;
    if (dontFetchMoreFeed) return;

    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/user/feed");
      const suggestions = res?.data?.suggestions;
      if (suggestions.length < limit) {
        setDontFetchMoreFeed(true);
      }
      dispatch(addFeed(suggestions));
    } catch (err) {
      if (err.status === 401) {
        dispatch(removeUser());
        navigate("/login");
      }
      setError("Could not load suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (status, toUserId) => {
    try {
      const res = await api.post(`/request/send/${status}/${toUserId}`);
      if (res.status === 200) {
        dispatch(removeUserFromFeed(toUserId));

        if (feedData.length < 2) {
          getFeed();
        }
      }
    } catch (err) {
      console.error("Error sending connection request:", err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  return (
    <div className="flex justify-center w-full h-full min-h-[80vh]">
      <div className="w-full h-full max-w-5xl px-4">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Discover developers
        </h1>
        {loading && (
          <div className="flex items-center justify-center py-6">
            <span className="loading loading-spinner loading-lg" />
          </div>
        )}

        {error && <div className="text-sm text-error">{error}</div>}

        {Array.isArray(feedData) && feedData.length === 0 && !error && (
          <div className="py-6 text-muted">No suggestions right now.</div>
        )}

        {Array.isArray(feedData) && feedData.length > 0 && (
          <UserCard user={feedData[0]} onAction={handleAction} />
        )}
      </div>
    </div>
  );
};

export default Feed;
