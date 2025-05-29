import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";

export default function Chatbox() {
  const [isChatShow, setIsChatShow] = useState(false);
  function toggleChat() {
    setIsChatShow((state) => !state);
  }

  return (
    <div className="absolute bottom-4 right-4 flex flex-col-reverse gap-2">
      <div
        onClick={toggleChat}
        className="h-12 w-12 cursor-pointer rounded-full self-end text-white bg-red-800 hover:bg-red-900 duration-100 flex justify-center items-center"
      >
        <SupportAgentIcon />
      </div>
      {isChatShow && (
        <div className="h-96 w-72 bg-white rounded-sm flex flex-col overflow-clip shadow-md">
          <div className="h-8 w-full bg-red-900 flex items-center pl-4 text-white">
            AI Assistant
          </div>
          <div className="flex-1">content</div>
          <div className="flex flex-row">
            <input
              className="bg-gray-200 flex-1 outline-none px-4 py-2 text-sm"
              type="text"
            />
            <div className="bg-red-800 px-2 cursor-pointer hover:bg-red-900 duration-200 flex items-center justify-center text-white">
              <SendIcon />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
