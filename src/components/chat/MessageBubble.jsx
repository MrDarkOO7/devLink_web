import React from "react";

const MessageBubble = ({ message }) => {
  const { fromMe, text, ts, avatar } = message;

  if (fromMe) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[78%] p-3 rounded-2xl rounded-br-none bg-primary text-white shadow-md">
          <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {text}
          </div>
          <div className="text-[10px] mt-1 text-white/80 text-right">
            {new Date(ts).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-3">
      <div className="w-8 h-8 rounded-full overflow-hidden bg-base-200 flex-shrink-0">
        <img
          src={
            avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="sender"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-[78%] p-3 rounded-2xl rounded-bl-none bg-base-200/80 text-base-content shadow-sm">
        <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
          {text}
        </div>
        <div className="text-[10px] mt-1 text-base-content/60 text-right">
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
