### Getting Started

1.  Run `npm install` in both root project directory and /client
2.  You will need to create a `.env` file in the **root** folder for your API key and DIDs you want to use. Just update API Key, Azure Keys and the DIDs you want to test with. Check the [`.env_example`](.env_example) file for reference.

```
// Telnyx API KEY
REACT_APP_TELNYX_API_KEY=apikeygoeshere

// Your Telnyx DID configured to the messaging profile
REACT_APP_TELNYX_SMS_DID=+1234567890

// The Mobile Number you want to send and receive SMS'
REACT_APP_MOBILE_DID=+1234567890

// The Microsoft Azure Q&A Knowledge base ID to pull answers from
AZURE_KB=

// Microsoft Azure endpoint key to be used for auth in request
AZURE_ENDPOINT_KEY=

// Whether you want to run production or development build
NODE_ENV=

// Server port to listen on
PORT=
```

3. Start the app run `npm run dev` - app uses nodemon and will automatically reload when changes are made
4. Publicly host the app, you can use ngrok on your local machine - port 3000

### How it works

Outbound SMS simply POSTed to Telnyx via Node SDK on when state is updated with a new message, using suggestions from a Microsoft Azure Q&A Tool KB.

Inbound SMS webhook for inbound messages setup in Telnyx Mission control and delivered to front end react via websocket on port 8089

### Issues

App uses concurrently so react and express can run on port 3000. Sometimes can be problematic running on localhost. If there are any issues receiving webhooks from telnyx, just expose `3001` for express with ngrok. Front end doesnt need to be publicly accessible to test or mess around with.

If you need guidance on how to configure webhooks and ngrok, please check our [Receiving SMS and MMS Docs](https://developers.telnyx.com/docs/v2/messaging/quickstarts/receiving-sms-and-mms?lang=node) and our [Ngrok guide](https://developers.telnyx.com/docs/v2/development/ngrok)
