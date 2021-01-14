# Dahua RTSP stream over WebSocket
Stream RTSP over websocket and use RTSP direclty in web browser. Made possible by new feature in Dahua camera which implements rtspoverwebsocket functionality. This would reduce the need for a server to translate the video stream to HLS or DASH to make RTSP work on web browsers. Kudos to Dahua for this thought.

### Usage

```html
    <video width=400 height=400 id="videoplayer"></video>
```

```js
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
```

NOTE: Audio is currently not supported. This is a working PoC for video stream. Audio Streaming is also possible.

### Notice
This project is made possible by using RTSP over WebSocket functionality implemented by Dahua for their IP Cameras. Code available in this project is extracted from an Dahua IP Camera and made to work standalone. We have no intent to commercialize this project.
