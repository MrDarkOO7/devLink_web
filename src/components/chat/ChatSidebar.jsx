import React from "react";

const ChatSidebar = ({
  conversations = [],
  selectedId,
  onSelect,
  onToggleMobile,
}) => {
  return (
    <aside className="bg-base-100 border border-base-200 rounded-xl p-3 h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Messages</h3>
        {/* mobile open/close */}
        <button
          className="btn btn-ghost btn-sm md:hidden"
          onClick={onToggleMobile}
          aria-label="Toggle conversations"
        >
          ☰
        </button>
      </div>

      <div className="space-y-2 overflow-y-auto max-h-[70vh] pr-2">
        {conversations.length === 0 && (
          <div className="text-sm text-base-content/60">
            No conversations yet.
          </div>
        )}

        {conversations.map((c) => {
          const active = c.id === selectedId;
          return (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`w-full text-left p-2 rounded-lg flex items-start gap-3 transition ${
                active
                  ? "bg-primary/10 border border-primary"
                  : "hover:bg-base-200"
              }`}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-base-200">
                <img
                  src={
                    c.avatar ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt={c.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-medium truncate">{c.name}</div>
                  <div className="text-xxs text-base-content/60">
                    {new Date(c.lastAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-xs text-base-content/60 truncate mt-1">
                  {c.snippet}
                </div>
                {c.unread > 0 && (
                  <div className="badge badge-sm mt-2">{c.unread}</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default ChatSidebar;
