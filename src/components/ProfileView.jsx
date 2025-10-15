import React from "react";
import { defaultProfile } from "../utils/environment";

const DEFAULT_M = defaultProfile?.male;
const DEFAULT_F = defaultProfile?.female;

const ProfileView = ({ user }) => {
  const displayAvatar =
    user?.photoUrl ||
    (user?.gender?.toLowerCase() === "female" ? DEFAULT_F : DEFAULT_M);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="card bg-base-100 shadow-md rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 bg-base-200 flex items-center justify-center p-6">
            <div className="w-36 h-36 rounded-full overflow-hidden ring-2">
              <img
                src={displayAvatar}
                alt={`${user.firstName} avatar`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="md:w-2/3 p-6">
            <h2 className="text-2xl font-semibold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-base-content/60 mt-1">{user.emailId}</p>

            {user.bio && (
              <p className="mt-4 text-base text-base-content/80 leading-relaxed">
                {user.bio}
              </p>
            )}

            {Array.isArray(user.skills) && user.skills.length > 0 ? (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-base-content/70 mb-2">
                  Skills
                </h4>

                <div className="flex flex-wrap gap-2">
                  {user.skills.map((s, i) => (
                    <span
                      key={i}
                      className="badge badge-outline text-sm capitalize"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {/* <div className="text-sm text-base-content/60">
                  No skills listed
                </div>
              ) */}
            <div className="mt-4 text-sm text-base-content/60 flex gap-4">
              {user.age ? <div>{user.age} yrs</div> : null}
              {user.gender ? (
                <div className="capitalize">{user.gender}</div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
