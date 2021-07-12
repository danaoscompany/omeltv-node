const WebSocket = require('ws');

const ws = new WebSocket('ws://34.101.188.127:1237?user_id=1');

ws.on('open', function open() {
	console.log("SOCKET IS OPENED");
});

ws.on('message', function incoming(data) {
  	console.log(data);
});
