import React from "react";

const MessageList = ({ messages }) => {
  return (
    <div className="flex-grow-1 p-3 border" style={{ overflowY: "hidden", height: "auto" }}>
      {messages.map((msg, index) => (
        <div key={index} className="mb-2">
          <strong>{msg.sender}:</strong> {msg.text}
          <br />
          <small className="text-muted">{msg.time}</small>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
