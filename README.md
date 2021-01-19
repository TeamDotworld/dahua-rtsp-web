# Dahua - Stream video in browser

**Try the url before using the code below. This will play substream video without much overkill. If this is not working then proceed to next**
```
http://host:port/cgi-bin/mjpg/video.cgi?channel=1&subtype=1
```

### RTSP over WS
Stream RTSP over websocket and use RTSP direclty in web browser. Made possible by new feature in Dahua camera which implements rtspoverwebsocket functionality. This would reduce the need for a server to translate the video stream to HLS or DASH to make RTSP work on web browsers. Kudos to Dahua for this thought.

NOTE: Need support for /rtspoverwebsocket support for using this feature
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

### Snapshots

Try this url to take snapshots

```
http://username:password@host:port/cgi-bin/snapshot.cgi?0
```


### Notice
This project is made possible by using RTSP over WebSocket functionality implemented by Dahua for their IP Cameras. Code available in this project is extracted from an Dahua IP Camera and made to work standalone. We have no intent to commercialize this project.
