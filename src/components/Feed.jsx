import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../redux/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feedData = useSelector((store) => store.feed);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getFeed = async () => {
    if (feedData && feedData.length > 1) return;

    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/user/feed");
      console.log(res?.data?.suggestions);
      dispatch(addFeed(res?.data?.suggestions));
    } catch (err) {
      console.error("Failed to load feed:", err);
      setError("Could not load suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  return (
    <div className="flex justify-center items-center w-full h-full min-h-[80vh]">
      <div className="w-full max-w-5xl px-4">
        {loading && (
          <div className="flex items-center justify-center py-6">
            <span className="loading loading-spinner loading-lg" aria-hidden />
          </div>
        )}

        {error && (
          <div className="mb-4 text-sm text-error bg-error/10 p-3 rounded">
            {error}
          </div>
        )}

        {!loading && Array.isArray(feedData) && feedData.length === 0 && (
          <div className="text-sm text-muted py-6">
            No suggestions right now.
          </div>
        )}

        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full justify-items-center"> */}
        <div className="w-full justify-items-center">
          {Array.isArray(feedData) && <UserCard user={feedData[0]} />}
          {/* feedData.map((user) => (
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default Feed;
