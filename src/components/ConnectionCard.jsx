import React from "react";
import { useNavigate } from "react-router-dom";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const ConnectionCard = ({ user }) => {
  const navigate = useNavigate();
  const { _id, firstName, lastName, photoUrl, bio } = user || {};

  const displayName =
    `${firstName || ""} ${lastName || ""}`.trim() || "Unnamed";

  return (
    <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow rounded-lg w-full">
      <div className="card-body flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full">
          <div className="flex justify-center sm:justify-start">
            <div className="avatar">
              <div className="w-16 h-16 rounded-full overflow-hidden ring-1 ring-base-200">
                <img
                  src={photoUrl || DEFAULT_AVATAR}
                  alt={`${displayName} avatar`}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>

          <div className="mt-2 sm:mt-0 sm:flex-1 min-w-0 text-center sm:text-left">
            <h4 className="text-sm font-semibold capitalize truncate max-w-full">
              {displayName}
            </h4>
            {bio && (
              <p className="text-xs text-base-content/60 mt-1 line-clamp-2">
                {bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            className="btn btn-sm btn-outline btn-primary w-full sm:w-auto"
            onClick={() => navigate(`/profile/${_id}`)}
          >
            View Profile
          </button>

          <button className="btn btn-sm btn-outline btn-secondary w-full sm:w-auto">
            Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionCard;
