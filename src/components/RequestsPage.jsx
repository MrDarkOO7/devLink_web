import React, { useEffect, useState } from "react";
import api from "../utils/api"; // must have withCredentials: true
import RequestCard from "./RequesrCard";

/**
 * RequestsPage
 * - GET /requests/received -> connectionRequests (array)
 * - POST /review/:status/:requestId -> accept/reject
 *
 * Behavior:
 * - Fetch list on mount (abortable)
 * - On accept/reject: optimistic remove, call API, show toast/error fallback
 * - Shows loading / error / empty states
 */

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/user/requests/received");
        const list = res?.data?.connectionRequests || [];
        setRequests(list);
      } catch (err) {
        console.err(err);
        setError("Failed to load requests. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // onAction called from RequestCard; returns a promise
  const handleAction = async (status, requestId) => {
    // optimistic UI: remove the request immediately
    const prev = requests;
    const updated = prev.filter((r) => String(r._id) !== String(requestId));
    setRequests(updated);

    try {
      const res = await api.post(`/request/review/${status}/${requestId}`, {});
      return res.data;
    } catch (err) {
      setRequests(prev);
      console.error("Action failed:", err);
      const serverMsg =
        typeof err?.response?.data === "string"
          ? err.response.data
          : err?.response?.data?.message || "Action failed";
      throw new Error(serverMsg);
    }
  };

  return (
    <div className="flex flex-col justify-center w-full max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-xl font-semibold mb-6 text-center">
        Connection Requests
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <span className="loading loading-spinner loading-lg" aria-hidden />
        </div>
      ) : error ? (
        <div className="text-sm text-error bg-error/10 p-3 rounded mb-4">
          {error}
        </div>
      ) : requests.length === 0 ? (
        <div className="text-sm text-base-content/60 py-8 text-center">
          No pending requests.
        </div>
      ) : (
        <div className="flex flex-col w-full max-w-2xl mx-auto space-y-4">
          {requests.map((r) => (
            <RequestCard
              key={r._id}
              request={r}
              onAction={async (status, requestId) => {
                try {
                  await handleAction(status, requestId);
                  // Optionally show a short success message (toast)
                } catch (err) {
                  // show inline error (simple alert for now)
                  alert(err.message || "Action failed");
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestsPage;
