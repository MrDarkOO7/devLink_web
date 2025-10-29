import React, { useState, useRef } from "react";

const ChatComposer = ({ onSend }) => {
  const [text, setText] = useState("");
  const taRef = useRef(null);

  const autoResize = (ta) => {
    if (!ta) return;
    ta.style.height = "auto";
    const next = Math.min(ta.scrollHeight, 180);
    ta.style.height = `${next}px`;
  };

  const submit = (e) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
    if (taRef.current) {
      taRef.current.style.height = "auto";
    }
  };

  return (
    <form onSubmit={submit} className="flex items-end gap-3 ">
      <textarea
        ref={taRef}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          autoResize(e.target);
        }}
        placeholder="Write a message…"
        rows={1}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        className="flex-1 resize-none bg-base-100/70 border border-base-300 rounded-lg px-3 py-2 text-sm leading-5 placeholder:text-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-base-100 transition-all overflow-y-auto max-h-[180px]"
        aria-label="Message input"
      />

      <button
        type="submit"
        className="btn rounded-lg shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-primary/80 to-primary text-white hover:from-primary hover:to-primary-focus border-none"
        aria-label="Send message"
      >
        Send
      </button>
    </form>
  );
};

export default ChatComposer;
