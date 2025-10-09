import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/api";
import { addUser } from "../redux/userSlice";

const Body = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((store) => store.user);

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
        }
      } catch (error) {
        if (error && error.status === 401) {
          navigate("/login");
        }
        console.error("profile check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!userData) {
      checkAuth();
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Body;
