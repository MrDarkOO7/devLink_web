import React, { useEffect, useState } from "react";
import api from "../utils/api";
import ConnectionCard from "./ConnectionCard";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../redux/userSlice";

const Connections = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConnections = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get("/user/connections");
        const formatted = res?.data?.formattedConnections || [];
        setConnections(formatted);
      } catch (err) {
        if (err.status === 401) {
          dispatch(removeUser());
          navigate("/login");
        }
        console.error("Failed to fetch connections:", err);
        setError("Could not load connections. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  return (
    <div className="flex flex-col justify-center w-full max-w-4xl mx-auto py-8 px-4">
      <h2 className="flex justify-center text-xl font-semibold mb-8">
        Connections
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <span className="loading loading-spinner loading-lg" aria-hidden />
        </div>
      ) : error ? (
        <div className="text-sm text-error bg-error/10 p-3 rounded">
          {error}
        </div>
      ) : connections.length === 0 ? (
        <div className="text-sm text-base-content/60 py-8 text-center">
          You have no connections yet.
        </div>
      ) : (
        <div className="flex flex-col w-full max-w-2xl justify-center space-y-4 mx-auto">
          {connections.map((c) => (
            <ConnectionCard key={c._id} user={c} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Connections;
