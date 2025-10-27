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

    const socket = createSocketConnection();
    socket.emit("joinChat", { userId, targetUserId });

    socket.on("messageReceived", ({ fromUser, text }) => {
      let fromMe;
      if (fromUser === userId) {
        fromMe = true;
      }
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          fromMe,
          text,
          ts: new Date().toISOString(),
        },
      ]);
      console.log("messageReceived", { userId, text });
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
      if (err.status === 401) {
        dispatch(removeUser());
        navigate("/login");
      }
      if (err?.response?.status === 404) {
        setError("User not found.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!targetUserId) return;

    fetchTargetUser(targetUserId);
  }, [targetUserId]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const profilePhoto = targetuserData?.photoUrl
    ? targetuserData?.photoUrl
    : targetuserData?.gender === "female"
    ? defaultProfile.female
    : defaultProfile.male;

  // if (!conversation) {
  //   return (
  //     <div className="h-full flex items-center justify-center border border-base-200 rounded-xl p-6">
  //       <div className="text-center">
  //         <div className="text-lg font-semibold">Select a conversation</div>
  //         <div className="text-sm text-base-content/60 mt-2">
  //           Start by selecting a user from the left.
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col h-full border border-base-200 rounded-xl overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between border-b border-base-200">
        <div className="flex items-center gap-3">
          {/* <button
            className="md:hidden btn btn-ghost btn-square btn-sm"
            onClick={onOpenSidebar}
            aria-label="Open conversations"
          >
            ☰
          </button> */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-base-200">
            <img
              src={profilePhoto}
              alt={targetuserData?.firstName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-sm font-medium">
              {targetuserData?.firstName + " " + targetuserData?.lastName}
            </div>
            <div className="text-xs text-base-content/60">Active now</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="btn btn-sm btn-outline btn-primary w-full sm:w-auto"
            onClick={() => navigate(`/profile/${targetUserId}`)}
          >
            View Profile
          </button>
        </div>
      </div>

      <div
        ref={listRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-100"
      >
        {messages.length === 0 && (
          <div className="text-center text-sm text-base-content/60 mt-12">
            No messages yet. Say hi!
          </div>
        )}

        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
      </div>

      <div className="px-4 py-3 border-t border-base-200 bg-base-100">
        <ChatComposer onSend={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatWindow;
