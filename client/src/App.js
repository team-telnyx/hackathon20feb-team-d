import React, { useEffect } from "react";
import { useAlert } from "react-alert";
import logo from "./logo.svg";
// NPM Module used for mobile device type DOM https://github.com/Wolox/react-chat-widget
import {
  Widget,
  addUserMessage,
  addResponseMessage,
  toggleWidget
} from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
// AXIOS used to POST new SMS to Telnyx API
import axios from "axios";
// Socket.io client for React
import io from "socket.io-client";

const socketEndpoint = "http://localhost:8089";

const App = () => {
  const alert = useAlert();

  useEffect(() => {
    // Load a message so we know the ap has loaded
    addResponseMessage("Ready to chat!");
    // Will keep the widget from minimizing to bottom right of screen
    toggleWidget();
  }, []);

  // Send SMS to User from Web - https://developers.telnyx.com/docs/api/v2/messaging/Messages#createMessage
  const sendAPIMessageToUser = (newMessage, to) => {
    console.log(`SMS SENT! ${newMessage}`);
    // Now send the message throught the backend API
    return axios({
      method: "post",
      url: "/messages",
      data: {
        text: newMessage,
        to
      }
    }).then(response => {
      console.log(response);
      return response;
    });
  };

  // Socket IO configuration
  // Connect to backend over websockets port 8089
  const socket = io.connect(socketEndpoint);
  // Listening for events from backend endpoint which recieves webhooks from Telnyx
  socket.on("sms msg", msg => {
    // react-chat-widget method employed to post recieved SMS to DOM
    addUserMessage(`(${msg.msgFrom}): ${msg.msgBody}`);

    console.log(
      `SMS Received: ${msg.msgBody} from: ${msg.msgFrom}. Answer: ${msg.answer}`
    );
    const openAlert = alert.show(
      <div
        style={{
          display: "flex",
          width: "20rem",
          backgroundColor: "#f4f7f9",
          flexDirection: "column",
          padding: "1rem",
          marginRight: "1rem",
          borderRadius: "1rem",
          boxShadow: "0 2px 10px 1px #b5b5b5"
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
          ({msg.msgFrom}) {msg.msgBody}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>{msg.answer}</div>
          <button
            style={{ width: "5rem", marginLeft: "auto" }}
            onClick={() => {
              sendAPIMessageToUser(msg.answer, msg.msgFrom).then(() => {
                addResponseMessage(msg.answer);
              });
              alert.remove(openAlert);
            }}
          >
            send
          </button>
        </div>
      </div>
    );
  });

  return (
    <div className="App">
      <Widget
        handleNewUserMessage={sendAPIMessageToUser}
        profileAvatar={logo}
        title="SMS Preservation Society"
        subtitle="Powered by Telnyx and Azure QandA"
      />
    </div>
  );
};

export default App;
