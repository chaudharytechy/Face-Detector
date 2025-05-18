import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "../socket";
import { viewAllUser } from "../redux/userViewAll";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [whom, setWhom] = useState(null);
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.userView);
  const { user } = useSelector((state) => state.user);

  // Register current user to socket
  useEffect(() => {
    if (user && user._id) {
      socket.emit("add-user", user._id);
    }

    socket.on("message", ({ from, message }) => {
      // Display if currently chatting with sender
      if (from === whom) {
        setMessages((prev) => [...prev, { ...message, sender: "Them" }]);
      } else {
        console.log(`📩 New message from ${from} (not active chat)`);
      }
    });

    return () => {
      socket.off("message");
    };
  }, [user, whom]);

  // Send a message
  const sendMessage = (text) => {
    if (!whom) {
      alert("Please select a user to chat with.");
      return;
    }

    const message = {
      sender: user?.email || "Me",
      text,
      time: new Date().toLocaleTimeString(),
    };

    // Emit to backend
    socket.emit("send_message", { to: whom, message });

    // Append to local messages
    setMessages((prev) => [...prev, { ...message, sender: "Me" }]);
  };

  // Load all users
  useEffect(() => {
    dispatch(viewAllUser());
  }, [dispatch]);

  return (
    <div className="container-fluid">
      <div className="row">
        {/* User List */}
        <button
          className="btn btn-primary"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#staticBackdrop"
          aria-controls="staticBackdrop"
        >
          <span class="fs-6 fs-sm-5 fs-md-4 fs-lg-3">
            Open Frined List !
          </span>
        </button>
        <div
          className="offcanvas offcanvas-start"
          data-bs-backdrop="static"
          tabIndex={-1}
          id="staticBackdrop"
          aria-labelledby="staticBackdropLabel"
        >
          <div className="col-12 bg-light shadow-sm p-3 h-auto">
         <div className="d-flex">
         <h5 id="staticBackdropLabel">Users</h5>
            <button
              type="button"
              className="btn-close px-4 "
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            />
         </div>
            <ul className="list-group">
              {userData?.length > 0 ? (
                userData.map(
                  (u) =>
                    u._id !== user?._id && (
                      <li
                        key={u._id}
                        onClick={() => {
                          setWhom(u._id);
                          setMessages([]); // Reset messages on new chat
                        }}
                        className={`list-group-item list-group-item-action ${
                          whom === u._id ? "active" : ""
                        }`}
                        style={{ cursor: "pointer" }}
                      >
                        <span style={{ letterSpacing: "2px" }} className="py-2">
                          {u.name?.firstName} {u.name?.lastName}
                        </span>
                      </li>
                    )
                )
              ) : (
                <li className="list-group-item">No users found</li>
              )}
            </ul>
          </div>
        </div>
        {/* Chat Area */}
        <div className="col-8 d-flex flex-column">
          {whom ? (
            <>
              <div className="p-2 bg-primary text-white my-3">
                Chatting with:{" "}
                {userData.find((u) => u._id === whom)?.name?.firstName || "Unknown"}
              </div>
              <MessageList messages={messages} />
              <MessageInput sendMessage={sendMessage} />
            </>
          ) : (
            <div className="text-center mt-5">
              <h5>Select a user to start chatting</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
