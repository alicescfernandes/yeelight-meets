# Yeelight ↔ Meets controller
![alt text](meets2.gif "Demo")
TLDR: The light turns red when you are mute, and white when you are not muted.

## How to use this:
1. Clone the repo
2. run `npm install`
3. run `npm start`. This will start a node server that is listening on localhost:3000
   1.  You may need to adjust the IP of the lamp on the code
4. install tampermonkey on your browser
5. install the user script `yeelight.user.js`
6. go to any meets call and mute/unmute yourself. You should now see the light change

## Stack
- Express for server
- Tampermonkey to connect to the Meets UI
- Node-Yeelight to send commands to the lamp