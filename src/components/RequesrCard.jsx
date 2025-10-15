import React, { useState } from "react";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const RequestCard = ({ request, onAction }) => {
  const from = request.fromUserId || {};
  const displayName =
    `${from.firstName || ""} ${from.lastName || ""}`.trim() || "Unknown";
  const avatar = from.profilePicture || DEFAULT_AVATAR;

  const [busy, setBusy] = useState(false);

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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-base-200 rounded-2xl shadow-sm w-full">
      <div className="flex items-start sm:items-center gap-4 w-full min-w-0">
        <div className="avatar">
          <div className="w-14 h-14 rounded-full overflow-hidden ring ring-base-300">
            <img
              src={avatar}
              alt={displayName}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1">
            <h4 className="font-semibold text-sm capitalize truncate max-w-[10rem] sm:max-w-full">
              {displayName}
            </h4>
            <span className="text-xs text-base-content/60">
              sent you a request
            </span>
          </div>

          {from.bio && (
            <p className="text-xs text-base-content/60 mt-1 line-clamp-2">
              {from.bio}
            </p>
          )}

          <p className="text-xxs text-base-content/50 mt-1">
            {new Date(request.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex flex-row items-center gap-2 sm:justify-end w-full sm:w-auto">
        <button
          type="button"
          className={`btn btn-outline btn-sm flex-1 sm:flex-none sm:w-auto ${
            busy ? "loading" : ""
          }`}
          onClick={() => handle("rejected")}
          aria-label={`Reject request from ${displayName}`}
          disabled={busy}
        >
          Reject
        </button>

        <button
          type="button"
          className={`btn btn-primary btn-sm flex-1 sm:flex-none sm:w-auto ${
            busy ? "loading" : ""
          }`}
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
