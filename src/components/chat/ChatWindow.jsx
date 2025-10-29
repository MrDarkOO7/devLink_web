import React, { useRef, useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";
import ChatComposer from "./ChatComposer";
import { createSocketConnection } from "../../utils/socket";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";
import { removeUser } from "../../redux/userSlice";
import { defaultProfile } from "../../utils/environment";

const ChatWindow = () => {
  const { id: targetUserId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const listRef = useRef(null);

  const [targetuserData, setTargetUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendMessage = (text) => {
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      userId,
      targetUserId,
      text,
    });
  };

  useEffect(() => {
    if (!userId || !targetUserId) return;

    fetchChat(targetUserId);

    const socket = createSocketConnection();
    socket.emit("joinChat", { userId, targetUserId });

    socket.on("messageReceived", ({ fromUser, text }) => {
      const fromMe = fromUser === userId;
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}`, fromMe, text, ts: new Date().toISOString() },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const fetchTargetUser = async (targetUserId) => {
    setLoading(true);
    try {
      const res = await api.get(`/profile/${targetUserId}`, {
        withCredentials: true,
      });
      const data = res?.data?.data || res?.data;
      setTargetUserData(data);
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401) {
        dispatch(removeUser());
        navigate("/login");
      } else if (err?.response?.status === 404) {
        setError("User not found.");
      } else {
        setError("Failed to load profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchChat = async (targetUserId) => {
    setLoading(true);
    try {
      const res = await api.get(`/chat/${targetUserId}`, {
        withCredentials: true,
      });
      const msgs = res?.data?.data?.messages || [];
      const formatted = msgs.map((msg) => ({
        id: msg._id?.toString(),
        fromMe: msg.senderId === userId,
        text: msg.text,
        ts: msg.createdAt,
      }));
      setMessages(formatted);
    } catch (err) {
      console.error("error fetching chat: ", err);
      setError("Failed to load conversation.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!targetUserId) return;
    fetchTargetUser(targetUserId);
  }, [targetUserId]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
  }, [messages, targetUserId]);

  const profilePhoto =
    targetuserData?.photoUrl ||
    (targetuserData?.gender === "female"
      ? defaultProfile.female
      : defaultProfile.male);

  return (
    <div className="flex flex-col h-[80vh] max-h-[80vh] bg-base-100 rounded-xl shadow-md border border-base-200 overflow-hidden">
      <header className="flex items-center justify-between gap-4 px-4 py-3 bg-base-200/70 border-b border-base-300 backdrop-blur-sm">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-base-200 flex-shrink-0">
            <img
              src={
                profilePhoto ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt={targetuserData?.firstName || "User"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">
              {targetuserData
                ? `${targetuserData.firstName || ""} ${
                    targetuserData.lastName || ""
                  }`
                : "Loading..."}
            </div>
            <div className="text-xs text-success font-medium">● Active now</div>
          </div>
        </div>

        <button
          className="btn btn-xs sm:btn-sm btn-outline"
          onClick={() => navigate(`/profile/${targetUserId}`)}
        >
          View Profile
        </button>
      </header>

      <main
        ref={listRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-base-100 scroll-smooth"
        role="log"
        aria-live="polite"
      >
        {loading ? (
          <div className="text-center text-sm text-base-content/60 mt-12">
            Loading conversation...
          </div>
        ) : error ? (
          <div className="text-center text-sm text-error mt-6">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-sm text-base-content/60 mt-12">
            No messages yet. Say hi!
          </div>
        ) : (
          messages.map((m) => (
            <MessageBubble key={m.id} message={{ ...m, avatar: profilePhoto }} />
          ))
        )}
      </main>

      <footer className="bg-base-200/80  rounded-b-xl px-4 py-3 shadow-inner backdrop-blur-sm">
        <ChatComposer onSend={handleSendMessage} />
      </footer>
    </div>
  );
};

export default ChatWindow;
