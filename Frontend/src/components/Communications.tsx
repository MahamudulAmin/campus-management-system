import React, { useState } from "react";

export interface Message {
  id?: string;
  sender?: string;
  recipient?: string;
  text?: string;
  timestamp?: string;
  isSelf?: boolean;
}

interface CommunicationsProps {
  messagesList?: Message[];
  onSendMessage?: (office: string, text: string) => Promise<void> | void;
}

export const Communications: React.FC<CommunicationsProps> = ({
  messagesList = [],
  onSendMessage,
}) => {
  const [internalMessages, setInternalMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "Office Staff",
      recipient: "Faculty",
      text: "Hello! Your request for lab equipment maintenance has been approved.",
      timestamp: "10:15 AM",
      isSelf: false,
    },
    {
      id: "2",
      sender: "You",
      recipient: "Office Staff",
      text: "Thank you! When can I expect the maintenance team to visit Lab 3B?",
      timestamp: "10:18 AM",
      isSelf: true,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [selectedOffice, setSelectedOffice] = useState("General Office");

  const displayMessages = messagesList.length > 0 ? messagesList : internalMessages;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const currentText = inputText;
    setInputText("");

    if (onSendMessage) {
      await onSendMessage(selectedOffice, currentText);
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "You",
      recipient: selectedOffice,
      text: currentText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSelf: true,
    };

    setInternalMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[600px]">
        {/* Chat Header */}
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-sm">Direct Office Channel</h2>
            <p className="text-xs text-slate-400">Teacher & Office Messaging</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Online
          </span>
        </div>

        {/* Message List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
          {displayMessages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className={`flex flex-col ${msg.isSelf ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                  msg.isSelf
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm"
                }`}
              >
                <p>{msg.text}</p>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {msg.sender || "User"} • {msg.timestamp || "Just now"}
              </span>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex gap-2">
          <select
            value={selectedOffice}
            onChange={(e) => setSelectedOffice(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2 bg-slate-50 text-slate-700"
          >
            <option value="General Office">General Office</option>
            <option value="IT Support">IT Support</option>
            <option value="Academic Affairs">Academic Affairs</option>
          </select>
          <input
            type="text"
            placeholder="Write a message to the Office Staff..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};