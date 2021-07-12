const WebSocket = require('ws');
const clients = {};

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws, req) {
  console.log("REQUEST URL: "+req.url);
  let url = req.url;
  let params = url.substring(url.indexOf("?")+1, url.length);
  let userID = params.split("&")[0].split("=")[1];
  clients[userID] = ws;
  console.log("USER ID: "+userID);
  ws.on('message', function incoming(message) {
    console.log('received from client: %s', message);
    var data = JSON.parse(message);
    var to = data['to'];
    var content = data['message'];
    console.log("SENDING MESSAGE TO "+to+", content: "+content);
    data['type'] = 'message';
    message = JSON.stringify(data);
    //console.log("ALL CLIENTS:");
    //console.log(clients);
    if (clients[to] != undefined) {
      clients[to].send(message);
    }
  });
  ws.send(JSON.stringify({
  	'type': 'initialization',
  	'user_id': userID
  }));
});
