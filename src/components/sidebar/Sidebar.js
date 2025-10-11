"use client";
import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import ConversationList from "./ConversationList";
import ConversationSearch from "./ConversationSearch";
import SettingsMenu from "./SettingsMenu";
import { useChat } from "@/context/ChatContext";

export default function Sidebar() {
  const { addConversation, conversations } = useChat();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter conversations based on search term
  const filteredConversations = useMemo(() => {
    if (!searchTerm.trim()) {
      return null; // Show all conversations
    }

    const lowercaseSearch = searchTerm.toLowerCase();
    return conversations.filter((conversation) => {
      // Search in conversation title
      if (conversation.title.toLowerCase().includes(lowercaseSearch)) {
        return true;
      }

      // Search in message content
      return conversation.messages.some((message) =>
        message.content.toLowerCase().includes(lowercaseSearch)
      );
    });
  }, [conversations, searchTerm]);

  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  return (
    <aside
      className="flex flex-col h-full w-64 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white shadow-xl border-r border-gray-800"
      style={{
        minWidth: 260,
        boxShadow: "0 0 32px 0 rgba(0,0,0,0.24)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div className="p-3 border-b border-gray-700 bg-gray-950/80 flex items-center justify-between">
        <button
          onClick={addConversation}
          className="flex items-center justify-center gap-2 w-full rounded-lg py-2 px-3 border border-gray-600 hover:bg-gray-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          style={{
            fontWeight: 500,
            letterSpacing: "0.01em",
            fontSize: "1rem",
            background: "linear-gradient(90deg, #222 70%, #222c 120%)",
          }}
        >
          <Plus size={16} className="text-green-400" />
          <span className="drop-shadow">New chat</span>
        </button>
      </div>

      <div className="px-3 py-2">
        <ConversationSearch
          onSearchChange={handleSearchChange}
          searchResults={filteredConversations}
        />
      </div>


      <div className="flex-grow overflow-y-auto px-1 py-1 custom-scrollbar">
        <ConversationList filteredConversations={filteredConversations} />
      </div>

      <div className="px-3 py-2">
        <a
          href="/export"
          className="block w-full text-center py-2 px-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors mt-2"
        >
          Export Chats
        </a>
        <a
          href="/theme-customizer"
          className="block w-full text-center py-2 px-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors mt-2"
        >
          Theme Customizer
        </a>
      </div>

      <div className="p-3 border-t border-gray-700 bg-gray-950/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 cursor-pointer flex-1 transition-all duration-150">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-green-500 to-green-300 shadow-md flex items-center justify-center text-sm font-bold border-2 border-green-200">
              PT
            </div>
            <span className="text-sm truncate font-medium text-gray-100">
              Pranav Titambe
            </span>
          </div>
          <div className="ml-2">
            <SettingsMenu />
          </div>
        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 7px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #23272f;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </aside>
  );
}



// "use client";
// import { useState, useMemo } from "react";
// import { Plus } from "lucide-react";
// import ConversationList from "./ConversationList";
// import ConversationSearch from "./ConversationSearch";
// import SettingsMenu from "./SettingsMenu";
// import { useChat } from "@/context/ChatContext";

// export default function Sidebar() {
//   const { addConversation, conversations } = useChat();
//   const [searchTerm, setSearchTerm] = useState("");

//   // Filter conversations based on search term
//   const filteredConversations = useMemo(() => {
//     if (!searchTerm.trim()) {
//       return null; // Show all conversations
//     }

//     const lowercaseSearch = searchTerm.toLowerCase();
//     return conversations.filter((conversation) => {
//       // Search in conversation title
//       if (conversation.title.toLowerCase().includes(lowercaseSearch)) {
//         return true;
//       }

//       // Search in message content
//       return conversation.messages.some((message) =>
//         message.content.toLowerCase().includes(lowercaseSearch)
//       );
//     });
//   }, [conversations, searchTerm]);

//   const handleSearchChange = (newSearchTerm) => {
//     setSearchTerm(newSearchTerm);
//   };

//   return (
//     <aside className="flex flex-col h-full w-64 bg-gray-900 text-white">
//       <div className="p-3 border-b border-gray-700">
//         <button
//           onClick={addConversation}
//           className="flex items-center justify-center gap-2 w-full rounded-md py-2 px-3 border border-gray-600 hover:bg-gray-700 transition-colors"
//         >
//           <Plus size={16} />
//           <span>New chat</span>
//         </button>
//       </div>

//       <ConversationSearch
//         onSearchChange={handleSearchChange}
//         searchResults={filteredConversations}
//       />

//       <div className="flex-grow overflow-y-auto">
//         <ConversationList filteredConversations={filteredConversations} />
//       </div>

//       <div className="p-3 border-t border-gray-700">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 cursor-pointer flex-1">
//             <div className="h-7 w-7 rounded-full bg-green-500 flex items-center justify-center text-sm font-medium">
//               PT
//             </div>
//             <span className="text-sm truncate">Pranav Titambe</span>
//           </div>
//           <SettingsMenu />
//         </div>
//       </div>
//     </aside>
//   );
// }
