import "./App.css";
import { useEffect, useState } from "react";
import { getChatResponse } from "./API";

import gptLogo from "./assets/chatgpt.svg";
import addBtn from "./assets/add-30.png";
import msgIcon from "./assets/message.svg";
import sendBtn from "./assets/send.svg";
import userIcon from "./assets/user-icon.png";
import gptImgLogo from "./assets/chatgptLogo.svg";

function App() {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [allChats, setAllChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("chatHistory")) || [];
    setAllChats(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(allChats));
  }, [allChats]);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const userMsg = { role: "user", content: userInput };
    const updatedChat = [...chatHistory, userMsg];
    setChatHistory(updatedChat);
    setUserInput("");
    setIsLoading(true);

    const reply = await getChatResponse(userInput);
    const botMsg = { role: "bot", content: reply };
    const finalChat = [...updatedChat, botMsg];
    setChatHistory(finalChat);
    setIsLoading(false);

    if (currentChatId !== null) {
      const updated = allChats.map((chat) =>
        chat.id === currentChatId ? { ...chat, messages: finalChat } : chat
      );
      setAllChats(updated);
    } else {
      const newChat = {
        id: Date.now(),
        title: userInput.slice(0, 20) || "New Chat",
        messages: finalChat,
      };
      setAllChats([newChat, ...allChats]);
      setCurrentChatId(newChat.id);
    }
  };

  const handleNewChat = () => {
    setChatHistory([]);
    setCurrentChatId(null);
    setUserInput("");
  };

  const handleLoadChat = (chat) => {
    setCurrentChatId(chat.id);
    setChatHistory(chat.messages);
    setUserInput("");
  };

  const handleRenameChat = (chatId) => {
    const newTitle = prompt("Enter new chat title:");
    if (newTitle) {
      const renamed = allChats.map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      );
      setAllChats(renamed);
    }
  };

  const handleDeleteChat = (chatId) => {
    if (window.confirm("Are you sure you want to delete this chat?")) {
      const filtered = allChats.filter((chat) => chat.id !== chatId);
      setAllChats(filtered);
      if (chatId === currentChatId) {
        setCurrentChatId(null);
        setChatHistory([]);
      }
    }
  };

  return (
    <div className="App">
      <div className="sideBar">
        <div className="upperSideTop fixedTop">
          <img src={gptLogo} alt="Logo" className="logo" />
          <span className="brand">ChatGPT</span>
        </div>

        <div className="scrollableSide">
          <button className="midBtn" onClick={handleNewChat}>
            <img src={addBtn} alt="" className="addBtn" />
            New Chat
          </button>

          <div className="upperSideBottom">
            {allChats.map((chat) => (
              <div key={chat.id} className="query chat-row">
                <img src={msgIcon} alt="Chat" />
                <span onClick={() => handleLoadChat(chat)}>{chat.title}</span>
                <svg
                  className="icon edit"
                  viewBox="0 0 24 24"
                  onClick={() => handleRenameChat(chat.id)}
                >
                  <path
                    d="M15.232 5.232l3.536 3.536L7.5 20.036H4v-3.536L15.232 5.232zM17.414 3.05a2 2 0 0 1 2.828 2.828l-1.414 1.414-2.828-2.828 1.414-1.414z"
                    fill="currentColor"
                  />
                </svg>
                <svg
                  className="icon delete"
                  viewBox="0 0 24 24"
                  onClick={() => handleDeleteChat(chat.id)}
                >
                  <path
                    d="M6 7h12m-9 4v6m6-6v6m2 4H5a2 2 0 0 1-2-2V7h18v12a2 2 0 0 1-2 2zM9 7V4h6v3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="main">
        <div className="chats">
          {chatHistory.length === 0 ? (
            <div className="welcomeScreen">
              <h1>Start a new conversation</h1>
              <p>ChatGPT is ready to help you. Ask anything!</p>
            </div>
          ) : (
            chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`chat ${msg.role === "bot" ? "bot" : ""}`}
              >
                <img
                  className="chatImg"
                  src={msg.role === "bot" ? gptImgLogo : userIcon}
                  alt=""
                />
                <p className="txt">{msg.content}</p>
              </div>
            ))
          )}

          {isLoading && (
            <div className="chat bot">
              <img className="chatImg" src={gptImgLogo} alt="" />
              <div className="loader">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>
          )}
        </div>

        <div className="chatFooter">
          <div className="inp">
            <input
              type="text"
              placeholder="Send a message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isLoading}
            />
            <button className="send" onClick={handleSend} disabled={isLoading}>
              <img src={sendBtn} alt="Send" />
            </button>
          </div>
          <p>
            <p>
              Powered by OpenRouter.ai | Mistral-7B Model | Chats saved locally
            </p>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
