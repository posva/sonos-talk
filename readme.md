Sonos Talk
===

Make your Sonos talk.


Simple api to make your Sonos play the text you send to it. It uses GTT (Google Text to Speech service) service to generate mp3 speeches files and send them to your Sonos device.
This server is meant to be run in the same network as your Sonos. It'll find it and connect to it at startup. It runs nicely on a Raspberry Pi.

## Running

You can start the server with `npm start`
You can then test it on your browser on the following address
[http://localhost:8080/api/speak/en/Hello%20there](http://localhost:8080/api/speak/en/Hello%20there)
If you don't have a Sonos connected you can still listen to the generated mp3. The response will include a link for it.

## Dev

```
npm run dev
```
