import React from "react";

const MessageBubble = ({ message }) => {
  const { fromMe, text, ts } = message;
  return (
    <div className={`flex ${fromMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[78%] p-3 rounded-lg ${
          fromMe ? "bg-primary text-white" : "bg-base-200 text-base-content"
        }`}
      >
        <div className="text-sm break-words">{text}</div>
        <div
          className={`text-xxs mt-1 ${
            fromMe ? "text-white/80" : "text-base-content/60"
          } text-right`}
        >
          {new Date(ts).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
