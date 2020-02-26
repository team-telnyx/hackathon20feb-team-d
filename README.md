### Getting Started

1.  Run `npm install` in both root project directory and /client
2.  You will need to create a .env file in the client folder for your API key and DIDs you want to use. Just update API Key and the DIDs you want to test with.

```
// Telnyx API KEY
REACT_APP_TELNYX_API_KEY=apikeygoeshere

// Your Telnyx DID configured to the messaging profile
REACT_APP_TELNYX_SMS_DID=+1234567890

// The Mobile Number you want to send and receive SMS'
REACT_APP_MOBILE_DID=+1234567890

```

3. Start the app run `npm run dev` - app uses nodemon and will automatically reload when changes are made
4. Publicly host the app, you can use ngrok on your local machine - port 3000

### How it works

Outbound SMS simply POSTed to Telnyx via Axios on when state is updated with a new message.

Inbound SMS webhook for inbound messages setup in Telnyx Mission control and delivered to front end react via websocket on port 8089

### Issues

App uses concurrently so react and express can run on port 3000. Sometimes can be problematic running on localhost. If there are any issues receiving webhooks from telnyx, just expose `3001` for express with ngrok. Front end doesnt need to be publicly accessible to test or mess around with
