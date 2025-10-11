"use client";
import { MessageSquare, Trash2, Share2, Save, X } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { useState, memo } from "react";

function ConversationList({ filteredConversations }) {
  const {
    conversations,
    currentConversation,
    selectConversation,
    deleteConversation,
    generateShareLink,
    updateConversationTitle,
  } = useChat();

  const displayConversations = filteredConversations || conversations;
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [error, setError] = useState("");

  const handleEditStart = (conversation) => {
    setEditingId(conversation.id);
    setEditingTitle(conversation.title || "");
    setError("");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingTitle("");
    setError("");
  };

  const handleEditSave = (id) => {
    if (editingTitle.trim() === "") {
      setError("Title cannot be empty!");
      return;
    }
    updateConversationTitle(id, editingTitle.trim());
    setEditingId(null);
    setEditingTitle("");
    setError("");
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    deleteConversation(id);
  };

  const handleShare = (e, id) => {
    e.stopPropagation();
    if (generateShareLink) generateShareLink(id);
  };

  return (
    <div className="py-2 space-y-1">
      <ul className="list-none m-0 p-0" aria-label="Conversation list">
        {displayConversations.map((conversation) => (
          <li
            key={conversation.id}
            className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-800 group ${
              currentConversation?.id === conversation.id ? "bg-gray-800" : ""
            }`}
            onClick={() => selectConversation(conversation.id)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                selectConversation(conversation.id);
              }
            }}
            aria-label={`Conversation: ${conversation.title}`}
          >
            <div className="flex items-center gap-2 truncate max-w-[180px]">
              <MessageSquare size={16} className="shrink-0" aria-hidden="true" />
              {editingId === conversation.id ? (
                <div className="flex items-center w-full gap-1">
                  <input
                    autoFocus
                    className="bg-transparent outline-none text-sm w-full border-b border-gray-700"
                    value={editingTitle}
                    onChange={(e) => {
                      setEditingTitle(e.target.value);
                      setError("");
                    }}
                    aria-label="Edit conversation title"
                  />
                  <button
                    className="text-green-400 hover:text-green-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditSave(conversation.id);
                    }}
                    aria-label="Save title"
                  >
                    <Save size={16} />
                  </button>
                  <button
                    className="text-red-400 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCancel();
                    }}
                    aria-label="Cancel editing"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <span
                  className="truncate text-sm"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    handleEditStart(conversation);
                  }}
                  title="Double-click to rename"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.stopPropagation();
                      handleEditStart(conversation);
                    }
                  }}
                  aria-label={`Conversation title: ${conversation.title}`}
                >
                  {conversation.title}
                </span>
              )}
            </div>

            <div className="flex items-center">
              <button
                onClick={(e) => handleDelete(e, conversation.id)}
                className={`transition-opacity ${
                  currentConversation?.id === conversation.id
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                } hover:text-red-400`}
                aria-label="Delete conversation"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={(e) => handleShare(e, conversation.id)}
                className={`ml-2 transition-opacity ${
                  currentConversation?.id === conversation.id
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                } hover:text-blue-400`}
                title="Share conversation"
                aria-label="Share conversation"
              >
                <Share2 size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editingId && error && (
        <div className="px-3 py-1 text-red-400 text-xs">{error}</div>
      )}

      {displayConversations.length === 0 && (
        <div className="px-3 py-2 text-gray-400 text-sm">
          {filteredConversations
            ? "No conversations match your search"
            : "No conversations yet"}
        </div>
      )}
    </div>
  );
}

export default memo(ConversationList);



// "use client";
// import { MessageSquare, Trash2, Share2 } from "lucide-react";
// import { useChat } from "@/context/ChatContext";
// import { useState } from "react";

// export default function ConversationList({ filteredConversations }) {
//   const {
//     conversations,
//     currentConversation,
//     selectConversation,
//     deleteConversation,
//     generateShareLink,
//     updateConversationTitle,
//   } = useChat();

//   const displayConversations = filteredConversations || conversations;
//   const [editingId, setEditingId] = useState(null);
//   const [editingTitle, setEditingTitle] = useState("");

//   return (
//     <div className="py-2 space-y-1">
//       {displayConversations.map((conversation) => (
//         <div
//           key={conversation.id}
//           className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-800 group ${
//             currentConversation.id === conversation.id ? "bg-gray-800" : ""
//           }`}
//           onClick={() => selectConversation(conversation.id)}
//         >
//           <div className="flex items-center gap-2 truncate max-w-[180px]">
//             <MessageSquare size={16} className="shrink-0" />
//             {editingId === conversation.id ? (
//               <input
//                 autoFocus
//                 className="bg-transparent outline-none text-sm w-full"
//                 value={editingTitle}
//                 onChange={(e) => setEditingTitle(e.target.value)}
//                 onBlur={() => {
//                   setEditingId(null);
//                   if (editingTitle.trim() !== "") {
//                     updateConversationTitle(conversation.id, editingTitle.trim());
//                   }
//                 }}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     e.currentTarget.blur();
//                   } else if (e.key === "Escape") {
//                     setEditingId(null);
//                   }
//                 }}
//               />
//             ) : (
//               <span
//                 className="truncate text-sm"
//                 onDoubleClick={(e) => {
//                   e.stopPropagation();
//                   setEditingId(conversation.id);
//                   setEditingTitle(conversation.title || "");
//                 }}
//                 title="Double-click to rename"
//               >
//                 {conversation.title}
//               </span>
//             )}
//           </div>

//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               deleteConversation(conversation.id);
//             }}
//             className="opacity-0 group-hover:opacity-100 hover:text-red-400"
//           >
//             <Trash2 size={16} />
//           </button>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               if (generateShareLink) generateShareLink(conversation.id);
//             }}
//             className="opacity-0 group-hover:opacity-100 hover:text-blue-400 ml-2"
//             title="Share conversation"
//           >
//             <Share2 size={16} />
//           </button>
//         </div>
//       ))}

//       {displayConversations.length === 0 && (
//         <div className="px-3 py-2 text-gray-400 text-sm">
//           {filteredConversations
//             ? "No conversations match your search"
//             : "No conversations yet"}
//         </div>
//       )}
//     </div>
//   );
// }
