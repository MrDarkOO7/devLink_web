import React, { useState } from "react";

const ChatComposer = ({ onSend }) => {
  const [text, setText] = useState("");

  const submit = (e) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a message… (Shift+Enter for new line)"
        rows={1}
        onInput={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
        className="flex-1 resize-none rounded-sm border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all min-h-[40px] max-h-[100px] overflow-y-auto"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
      />
      <button type="submit" className="btn btn-primary">
        Send
      </button>
    </form>
  );
};

export default ChatComposer;
