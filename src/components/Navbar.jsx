import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { removeUser } from "../redux/userSlice";
import { addUser } from "../redux/userSlice";
import { defaultProfile } from "../utils/environment";

const PUBLIC_PATHS = ["/login", "/signup", "/forgot", "/reset-password"];

const Navbar = () => {
  const user = useSelector((store) => store.user);
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
          // Unauthorized — redirect only if not on a public route
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

  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="flex-1">
        <Link className="btn btn-ghost text-xl" to={"/"}>
          DevLink
        </Link>
      </div>
      {user && (
        <div className="flex gap-2">
          <p className="flex justify-center items-center">
            Hello {user.firstName}
          </p>
          <div className="dropdown dropdown-end mx-5">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="Tailwind CSS Navbar component" src={ProfilePhoto} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link className="justify-between" to={"/profile"}>
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <Link to={"/connections"}>Connections</Link>
              </li>
              <li>
                <Link to={"/requests"}>Connection Requests</Link>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
