import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { addUser, removeUser } from "../redux/userSlice";
import { removeFeed } from "../redux/feedSlice";
import { defaultProfile } from "../utils/environment";
import {
  FaSignOutAlt,
  FaUserFriends,
  FaHandshake,
  FaUser,
} from "react-icons/fa";
import { clearConnections } from "../redux/connectionsSlice";

const PUBLIC_PATHS = ["/login", "/signup", "/forgot", "/reset-password"];

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const feed = useSelector((store) => store.feed);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const userData = useSelector((store) => store.user);
  const ProfilePhoto = userData?.photoUrl
    ? userData?.photoUrl
    : userData?.gender === "female"
    ? defaultProfile.female
    : defaultProfile.male;
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      const logout = await api.post("/auth/logout");
      console.log(logout);
      if (logout.status === 200) {
        dispatch(removeUser());
        dispatch(removeFeed());
        dispatch(clearConnections());
        navigate("/login");
      }
    } catch (err) {
      console.error("error during logout", err);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/profile/view", {
          withCredentials: true,
        });
        const data = response.data?.data;

        console.log(response, data);
        if (data) {
          dispatch(addUser(data));
          const currentPath = location.pathname;
          if (PUBLIC_PATHS.includes(currentPath)) {
            navigate("/");
          }
        }
      } catch (error) {
        const status = error?.status;
        if (status === 401 || status === 403) {
          const currentPath = location.pathname;
          if (!PUBLIC_PATHS.includes(currentPath)) {
            navigate("/login", { replace: true });
          }
        }
        console.error("profile check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!userData) {
      checkAuth();
    }
  }, [location.pathname, navigate]);

  console.log("FEEED", feed);

  return (
    <div className="navbar bg-base-100 shadow-md px-4 sticky top-0 z-50 mb-6">
      <div className="flex-1">
        <Link
          to="/"
          className="text-2xl font-bold text-primary hover:text-secondary transition-colors"
        >
          DevLink
        </Link>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <p className="hidden md:block text-sm text-base-content/80">
            Hello, <span className="font-semibold">{user.firstName}</span>
          </p>

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar hover:scale-105 transition-transform"
            >
              <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                <img
                  src={ProfilePhoto}
                  alt="User Avatar"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-200 rounded-box w-56"
            >
              <li>
                <Link to="/profile" className="flex items-center gap-2">
                  <FaUser /> Profile
                </Link>
              </li>
              <li>
                <Link to="/connections" className="flex items-center gap-2">
                  <FaUserFriends /> Connections
                </Link>
              </li>
              <li>
                <Link to="/requests" className="flex items-center gap-2">
                  <FaHandshake /> Connection Requests
                </Link>
              </li>
              <li>
                <a
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-error"
                >
                  <FaSignOutAlt /> Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
