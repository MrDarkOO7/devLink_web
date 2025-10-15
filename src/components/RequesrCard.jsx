import React, { useState } from "react";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const RequestCard = ({ request, onAction }) => {
  const from = request.fromUserId || {};
  const displayName =
    `${from.firstName || ""} ${from.lastName || ""}`.trim() || "Unknown";
  const avatar = from.profilePicture || DEFAULT_AVATAR;

  const [busy, setBusy] = useState(false);

  // onAction(status, requestId) is provided by parent
  const handle = async (status) => {
    if (busy) return;
    setBusy(true);
    try {
      await onAction(status, request._id);
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-base-200 rounded-2xl shadow-sm">
      <div className="flex items-center gap-4 min-w-0">
        <div className="avatar">
          <div className="w-14 h-14 rounded-full overflow-hidden ring ring-base-300">
            <img
              src={avatar}
              alt={displayName}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm capitalize">{displayName}</h4>
            <span className="text-xs text-base-content/60">
              sent you a request
            </span>
          </div>
          {from.bio && (
            <p className="text-xs text-base-content/60 truncate">{from.bio}</p>
          )}
          <div className="text-xs text-base-content/60 mt-1">
            <span className="text-xxs">
              {new Date(request.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className={`btn btn-ghost btn-sm ${busy ? "loading" : ""}`}
          onClick={() => handle("rejected")}
          aria-label={`Reject request from ${displayName}`}
          disabled={busy}
        >
          Reject
        </button>

        <button
          type="button"
          className={`btn btn-primary btn-sm ${busy ? "loading" : ""}`}
          onClick={() => handle("accepted")}
          aria-label={`Accept request from ${displayName}`}
          disabled={busy}
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default RequestCard;
