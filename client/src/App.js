import React, { Component } from "react";
import logo from "./logo.svg";
// NPM Module used for mobile device type DOM https://github.com/Wolox/react-chat-widget
import { Widget, addResponseMessage, toggleWidget } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
// AXIOS used to POST new SMS to Telnyx API
import axios from "axios";
// Socket.io client for React
import io from "socket.io-client";

// Your Telnyx API V2 Key
const apiKey = process.env.REACT_APP_TELNYX_API_KEY;
// Your Telnyx DID configured to the messaging profile
const fromDID = process.env.REACT_APP_TELNYX_SMS_DID;
// The Mobile Number you want to send and receive SMS'
const toDID = process.env.REACT_APP_MOBILE_DID;

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
		addResponseMessage("Received sms");
		// Will keep the widget from minimizing to bottom right of screen
		toggleWidget();
		
	}
	// Send SMS to User from Web - Details found in Telnyx API Documentation
	handleNewUserMessage = newMessage => {
		console.log(`SMS SENT! ${newMessage}`);
		// Now send the message throught the backend API
		axios({
			method: "post",
			url: "https://api.telnyx.com/v2/messages",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			data: {
				from: fromDID,
				to: toDID,
				text: newMessage
				// subject: "+19842990505 ProspectA",
				// media_urls: [
				// 	{"image/jpeg":"https://www.dropbox.com/s/vlv7kr51nssqily/logo192.png"}
				// ]
			}
		}).then(res => console.log(res));
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
