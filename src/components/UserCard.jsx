import React from "react";

/**
 * Pure presentational UserCard.
 * Expects a single `user` object. No APIs inside.
 *
 * user sample shape:
 * {
 *   _id, firstName, lastName, username, emailId,
 *   bio, avatar, mutualCount
 * }
 */

const UserCard = ({ user }) => {
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
      ? "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
      : "https://cdn-icons-png.flaticon.com/512/149/149071.png");

  return (
    user && (
      <div className="card mx-auto bg-base-300 shadow-xl">
        <figure className="h-70 w-full overflow-hidden bg-base-200">
          <img
            src={displayAvatar}
            alt={`${displayName} avatar`}
            className="object-cover w-full h-full"
          />
        </figure>

        <div className="card-body">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">{displayName}</h3>
              <p className="text-xs text-base-content/60">
                {age && gender && `${age}, ${gender}`}
              </p>
            </div>
          </div>

          <p className="text-sm text-base-content/80 mt-3">
            {bio || "This user hasn't added a bio yet."}
          </p>

          {skills?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="badge badge-outline text-xs capitalize px-2 py-1"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          <div className="card-actions justify-end mt-3">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                // placeholder click — swap to router navigation if needed
                // e.g., navigate(`/profile/${user._id}`);
              }}
            >
              Ignore
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                // placeholder click — swap to router navigation if needed
                // e.g., navigate(`/profile/${user._id}`);
              }}
            >
              Interested
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default UserCard;
