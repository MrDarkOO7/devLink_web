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
      <div className="card-body flex flex-row items-center gap-4">
        <div className="avatar">
          <div className="w-14 h-14 rounded-full overflow-hidden ring-1 ring-base-200">
            <img
              src={photoUrl || DEFAULT_AVATAR}
              alt={`${displayName} avatar`}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold capitalize">{displayName}</h4>
          {bio && (
            <p className="text-xs text-base-content/60 mt-1">
              {bio || "No headline "}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline btn-primary"
            onClick={() => navigate(`/profile/${_id}`)}
          >
            View Profile
          </button>
          <button className="btn btn-sm btn-outline btn-secondary ">
            Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionCard;
