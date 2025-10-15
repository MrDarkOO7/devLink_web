import React from "react";
import { defaultProfile } from "../utils/environment";

const UserCard = ({ user, onAction }) => {
  if (!user) {
    return null;
  }

  const { firstName, lastName, age, gender, skills, emailId, bio, photoUrl } =
    user;

  const displayName =
    `${firstName || ""} ${lastName || ""}`.trim() || emailId || "Unnamed";
  const displayAvatar =
    photoUrl ||
    (gender?.toLowerCase() === "female"
      ? defaultProfile.female
      : defaultProfile.male);

  return (
    <div className="card mx-auto bg-base-200 shadow-xl max-w-md h-[600px] rounded-xl overflow-hidden">
      <figure className="h-[60%] w-full">
        <img
          src={displayAvatar}
          alt={`${displayName} avatar`}
          className="w-full h-full object-cover"
        />
      </figure>

      <div className="p-5 h-[40%] flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-base-content">{displayName}</h3>
          <p className="text-sm text-base-content/60 mt-1">
            {age && gender && `${age}, ${gender}`}
          </p>

          {bio && (
            <p className="text-sm text-base-content/80 mt-3 line-clamp-3 leading-relaxed">
              {bio}
            </p>
          )}

          {skills?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="badge badge-outline text-xs capitalize px-3 py-1"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-5">
          <button
            type="button"
            className="btn btn-outline btn-error btn-sm flex-1"
            onClick={() => onAction("ignored", user._id)}
          >
            Ignore
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm flex-1"
            onClick={() => onAction("interested", user._id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
