// Dependencies
const express = require("express");
const app = express();
const path = require("path");
const axios = require("axios");
// For integration with Express and Sockets
const server = require("http").Server(app);
// WebSockets communicating over port 8089
const io = require("socket.io")(8089);

require("dotenv").config();

// Your Telnyx API V2 Key
const apiKey = process.env.TELNYX_API_KEY;
// Your Telnyx DID configured to the messaging profile
const fromDID = process.env.TELNYX_SMS_DID;
// The Mobile Number you want to send and receive SMS'
const toDID = process.env.MOBILE_DID;

const azureEndpointKey = process.env.AZURE_ENDPOINT_KEY;
const azureURL = `https://wooly-bully.azurewebsites.net/qnamaker/knowledgebases/${process.env.AZURE_KB}/generateAnswer`;

const telnyx = require("telnyx")(apiKey);

// Init Middleware
app.use(express.json({ extended: false }));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
	// Set Static folder
	app.use(express.static("client/build"));

	app.get("/", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

const PORT = process.env.PORT || 8080;

// Init Socket.IO
io.on("connection", socket => {
	// Console log if there is a successful connection
	console.log("connected to front end");
});

// Simple Get Route so we know API backend is Live
app.get("/api-test", (req, res) => {
	res.send(`<h1>SMS Chat API UP</h1>`);
});

app.post("/messages", (req, res) => {
	// Now send the message throught the backend API
	telnyx.messages
		.create({
			from: fromDID,
			to: req.body.to || toDID,
			text: req.body.text
		})
		.then(response => {
			res.send(response);
		});
});

// Recieve Webhooks from Telnyx
app.post("/sms-gateway", async (req, res) => {
	// console.log(req.body.data);
	try {
		// Text of SMS Message
		smsReceive = {
			msgBody: req.body.data.payload.text,
			msgFrom: req.body.data.payload.from.phone_number
		};
		// We only want to submit SMS through socket sent to this MSG Profile from the PSTN.
		// Ignore notification hooks for SMS sent FROM this MSG profile to Telnyx
		if (req.body.data.payload.direction === "inbound") {
			const response = await axios({
				method: "POST",
				url: azureURL,
				headers: {
					"Content-type": "application/json",
					Authorization: `EndpointKey ${azureEndpointKey}`
				},
				data: {
					question: smsReceive.msgBody.toString().trim()
				}
			});

			smsReceive.answer = response.data.answers[0].answer;
			// Send SMS body through socket to Front end when new SMS received
			io.emit("sms msg", smsReceive);
			// Notify Telnyx hook was received, alleviate duplicatees
			res.end();

			telnyx.messages
				.create({
					from: process.env.TELNYX_SMS_DID,
					to: smsReceive.msgFrom,
					text: smsReceive.answer
				})
				.then(response => {
					res.send(response);
				});
		}

		res.end();
	} catch (error) {
		// Log any Errors
		console.error(error);
	}
});

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
