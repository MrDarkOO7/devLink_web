import React from "react";
import { useNavigate } from "react-router-dom";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const ConnectionCard = ({ user }) => {
  const navigate = useNavigate();
  const { _id, firstName, lastName, profilePicture, headline } = user || {};

  const displayName =
    `${firstName || ""} ${lastName || ""}`.trim() || "Unnamed";

  return (
    <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow rounded-lg w-full">
      <div className="card-body flex items-start gap-4">
        <div className="avatar">
          <div className="w-14 h-14 rounded-full overflow-hidden ring-1 ring-base-200">
            <img
              src={profilePicture || DEFAULT_AVATAR}
              alt={`${displayName} avatar`}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold capitalize">{displayName}</h4>
          <p className="text-xs text-base-content/60 truncate">
            {headline || "No headline"}
          </p>
        </div>

        <div className="flex items-center">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => navigate(`/profile/${_id}`)}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionCard;
