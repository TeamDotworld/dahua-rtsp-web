import PlayerControl from './src/index.js';

var options = {
    wsURL: "ws://host:port/rtspoverwebsocket",
    rtspURL: "rtsp://host:port/cam/realmonitor?channel=1&subtype=0",
    username: "",
    password: ""
}

let player = new PlayerControl(options)
player.on("Error", (j) => { if (j) console.log(j.errorCode) })
player.init(document.querySelector("#videoplayer"))
player.connect()