import React, { Component } from "react";
import logo from "./logo.svg";
// NPM Module used for mobile device type DOM https://github.com/Wolox/react-chat-widget
import { Widget, addResponseMessage, toggleWidget } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
// AXIOS used to POST new SMS to Telnyx API
import axios from "axios";
// Socket.io client for React
import io from "socket.io-client";

class App extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: "http://localhost:8089",
      recMessage: ""
    };
  }

  componentDidMount() {
    // Load a message so we know the ap has loaded
    addResponseMessage("Ready to chat!");
    // Will keep the widget from minimizing to bottom right of screen
    toggleWidget();
  }
  // Send SMS to User from Web - https://developers.telnyx.com/docs/api/v2/messaging/Messages#createMessage
  handleNewUserMessage = newMessage => {
    console.log(`SMS SENT! ${newMessage}`);
    // Now send the message throught the backend API
    axios({
      method: "post",
      url: "/messages",
      data: {
        text: newMessage
      }
    }).then(response => console.log(response));
  };

  render() {
    // Socket IO configuration
    // Connect to backend over websockets port 8089
    const socket = io.connect(this.state.endpoint);
    // Listening for events from backend endpoint which recieves webhooks from Telnyx
    socket.on("sms msg", msg => {
      // react-chat-widget method employed to post recieved SMS to DOM
      addResponseMessage(msg.msgBody);
      console.log(`SMS Received: ${msg.msgBody} from: ${msg.msgFrom}`);
    });

    return (
      <div className="App">
        <Widget
          handleNewUserMessage={this.handleNewUserMessage}
          profileAvatar={logo}
          title="Telnyx SMS P2P Demo"
          subtitle="Let's Chat"
        />
      </div>
    );
  }
}

export default App;
