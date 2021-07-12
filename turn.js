const {execSync} = require('child_process');
execSync("export USERS='user=password foo=bar';export REALM=34.101.188.127;export UDP_PORT=3479;./simple-turn-linux-amd64");
//execSync("export USERS='user=password foo=bar';export REALM=104.171.114.162;export UDP_PORT=3479;./simple-turn-linux-amd64");
