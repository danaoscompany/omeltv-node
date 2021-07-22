const WebSocket = require('ws');
const clients = {};
const rooms = [];

const wss = new WebSocket.Server({ port: 8080 });

function createRoom(userID1, userID2) {
  let room = null;
  for (let i=0; i<rooms.length; i++) {
    if ((rooms[i]['user_id_1'] == userID1 && rooms[i]['user_id_2'] == userID2)
    	|| (rooms[i]['user_id_1'] == userID2 && rooms[i]['user_id_2'] == userID1)) {
      room = rooms[i];
      break;
    }
  }
  if (room == null) {
  	room = {
  	  'user_id_1': userID1,
  	  'user_id_2': userID2,
  	  'total_users': 0
  	};
  	rooms.push(room);
  }
  return room;
}

function fillRoom(userID1, userID2) {
  for (let i=0; i<rooms.length; i++) {
    if ((rooms[i]['user_id_1'] == userID1 && rooms[i]['user_id_2'] == userID2)
    	|| (rooms[i]['user_id_1'] == userID2 && rooms[i]['user_id_2'] == userID1)) {
      rooms[i]['total_users'] = rooms[i]['total_users']+1;
      break;
    }
  }
}

function clearRoom(userID) {
  for (let i=0; i<rooms.length; i++) {
    if (rooms[i]['user_id_1'] == userID || rooms[i]['user_id_2'] == userID) {
      rooms.splice(i, 1);
      break;
    }
  }
}

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
    var from = data['from'];
    var to = data['to'];
    var content = data['message'];
    var messageType = data['message_type'];
    if (messageType == "get_room") {
      let userID1 = parseInt(data['user_id_1']);
      let userID2 = parseInt(data['user_id_2']);
      let room = createRoom(userID1, userID2);
      data['message_type'] = "room";
      data['room'] = room;
      message = JSON.stringify(data);
      if (clients[from] != undefined) {
        clients[from].send(message);
      }
    } else if (messageType == "fill_room") {
      let userID1 = parseInt(data['user_id_1']);
      let userID2 = parseInt(data['user_id_2']);
      let room = createRoom(userID1, userID2);
      fillRoom(userID1, userID2);
    } else if (messageType == "clear_room") {
      let userID = parseInt(data['user_id']);
      clearRoom(userID);
    } else if (messageType == "connect") {
      let userID = parseInt(data['user_id']);
      clients[userID]['connect_pressed'] = 1;
    } else if (messageType == "is_connect_pressed") {
      let userID = data['user_id'];
      let connectPressed = 0;
      if (clients[userID] != undefined && clients[userID] != null && clients[userID]['connect_pressed'] != undefined
      	&& clients[userID]['connect_pressed'] != null) {
        connectPressed = parseInt(clients[userID]['connect_pressed']);
      }
      data['connect_pressed'] = connectPressed;
      message = JSON.stringify(data);
      if (clients[userID] != undefined) {
        clients[userID].send(message);
      }
    } else {
      console.log("SENDING MESSAGE TO "+to+", content: "+content);
      data['type'] = 'message';
      message = JSON.stringify(data);
      //console.log("ALL CLIENTS:");
      //console.log(clients);
      if (clients[to] != undefined) {
        clients[to].send(message);
      }
    }
  });
  ws.send(JSON.stringify({
  	'type': 'initialization',
  	'user_id': userID
  }));
});
