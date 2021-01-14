import { VideoMediaSource } from './videoMediaSource.js'
import { BrowserDetect } from './browserDetect.js'
import mp4Remux from './mp4remux.js'

var WorkerManager = function () {
    function a() {
        N = !0,
            o = this
    }
    function b() {
        return W
    }
    function c() {
        null !== z && z(!1)
    }
    function onVideoMessage(b) {
        var c = b.data;
        switch (c.type) {
            case "WorkerReady":
                xb && xb();
                break;
            case "canvasRender":
                k(0, "currentTime"),
                    i(c.data),
                    tb++,
                    0 === sb && (sb = performance.now());
                break;
            case "initSegment":
                W = c.data,
                    j();
                break;
            case "mediaSample":
                null === Y.samples && (Y.samples = new Array(ib)),
                    null === c.data.frame_time_stamp && (c.data.frameDuration = Math.round(ob / K)),
                    1 !== hb && (c.data.frameDuration = ob / Math.abs(hb)),
                    Y.samples[Z++] = c.data,
                    mb += c.data.frameDuration,
                    nb += c.data.frameDuration,
                    ib = Y.samples[0].frameDuration > 500 && Y.samples[0].frameDuration <= 3e3 ? 1 : 1 === hb ? gb : Math.abs(hb),
                    jb !== ib && h(1 !== hb),
                    jb = ib;
                break;
            case "videoRender":
                var d = new Uint8Array(c.data.length + $);
                if (0 !== $ && d.set(_),
                    d.set(c.data, $),
                    _ = d,
                    $ = _.length,
                    Z % ib === 0 && 0 !== Z) {
                    if (null !== Y.samples[0].frameDuration ? (Y.baseMediaDecodeTime = 1 === ab ? 0 : lb,
                        lb = mb) : Y.baseMediaDecodeTime = Math.round(ob / K) * ib * (ab - 1),
                        "chrome" == H && 1 === hb)
                        for (var e = Y.samples.length, f = nb / ib, g = 0; e > g; g++)
                            Y.samples[g].frameDuration = f;
                    nb = 0,
                        X = mp4Remux.mediaSegment(ab, Y, _, Y.baseMediaDecodeTime),
                        ab++,
                        Z = 0,
                        _ = null,
                        $ = 0,
                        null !== V ? V.setMediaSegment(X) : kb === !1 && j(),
                        null !== streamDrawer && streamDrawer.stopRendering()
                }
                break;
            case "mediasegmentData":
                V.setMediaSegment(c.data)
                kb === !1 && j();
                break;
            case "videoInfo":
                I = c.data;
                break;
            case "time":
                break;
            case "videoTimeStamp":
                db = c.data,
                    null !== V && null !== db && V.setvideoTimeStamp(db);
                var m = new Gb(videoElement)
                    , n = navigator.userAgent.indexOf("Chrome") > -1 && 8 || 2;
                m.bindTimeUpdate(videoElement),
                    m.getTime() >= n && (m.clearTimer(),
                        null !== A && A({
                            errorCode: 101
                        }));
                break;
            case "firstFrame":
                streamDrawer.startRendering(),
                    "undefined" != typeof streamDrawer.setFPS && streamDrawer.setFPS(K);
                break;
            case "drop":
                break;
            case "codecInfo":
                bb = c.data,
                    null !== V && V.setCodecInfo(bb);
                break;
            case "stepPlay":
                switch (c.data) {
                    case "needBuffering":
                        Q = !0,
                            w("request", S);
                        break;
                    case "BufferFull":
                        if (Q = !1,
                            w("complete"),
                            Ab) {
                            var o = {
                                type: "stepPlay",
                                data: "findIFrame"
                            };
                            l.postMessage(o),
                                streamDrawer.startRendering(),
                                Ab = !1
                        }
                }
                break;
            case "setVideoTagMode":
                a.prototype.setLiveMode(c.data);
                break;
            case "playbackFlag":
                zb.type = c.data === !0 ? "playback" : "live",
                    null !== V && V.setPlaybackFlag(c.data);
                break;
            case "error":
                null !== A && A(c.data);
                break;
            case "MSEResolutionChanged":
                E(c.data);
                break;
            case "DecodeStart":
                B(c.data);
                break;
            case "ivsDraw":
                G(c.data);
                break;
            default:
                console.log("workerManager::videoWorker unknown data = " + c.data)
        }
    }
    function e(a) {
        var b = a.data;
        switch (b.type) {
            case "render":
                if (U === !0)
                    break;
                pb !== b.codec && (null !== q && (qb = q.getVolume(),
                    rb = q.getInitVideoTimeStamp(),
                    q.terminate()),
                    "AAC" === b.codec ? "edge" === H || "firefox" === H ? (q = null,
                        null !== A && A({
                            errorCode: 201
                        })) : q = new AudioPlayerAAC : (q = new AudioPlayerGxx,
                            q.setSamplingRate(b.samplingRate)),
                    null !== q && (q.setInitVideoTimeStamp(rb),
                        q.audioInit(qb) || (q = null)),
                    pb = b.codec),
                    null !== q && (null === I || "undefined" == typeof I ? q.bufferAudio(b.data, b.rtpTimeStamp, null) : q.bufferAudio(b.data, b.rtpTimeStamp, I.codecType))
        }
    }
    function f(a) {
        var b = a.data;
        switch (b.type) {
            case "rtpData":
                v(b.data)
        }
    }
    function g(a) {
        var b = {
            type: "getRtpData",
            data: a
        };
        n.postMessage(b)
    }
    function h(a) {
        null !== V && (V.close(),
            V = null),
            ib = a === !1 ? gb : Math.abs(hb),
            Y.samples = new Array(ib),
            kb = !1,
            ab = 1,
            X = null,
            Z = 0,
            _ = null,
            $ = 0
    }
    function i(a) {
        null !== a && null !== streamDrawer && ("mjpeg" === I.codecType ? streamDrawer.drawMJPEG(a, I.width, I.height, I.codecType, I.frameType, I.timeStamp) : streamDrawer.draw(a, I.width, I.height, I.codecType, I.frameType, I.timeStamp))
    }
    function j() {
        kb = !0,
            null === V ? (V = VideoMediaSource(o),
                V.setCodecInfo(bb),
                V.setInitSegmentFunc(b),
                V.setVideoSizeCallback(c),
                V.setBeginDrawCallback(t),
                V.init(videoElement),
                V.setSpeedPlay(hb)) : (V.getVideoElement(),
                    V.setInitSegment()),
            V.setAudioStartCallback(k)
    }
    function k(a, b) {
        null !== q && q.setBufferingFlag(a, b)
    }
    var l = null
        , audioWorker = null
        , n = null
        , o = null
        , streamDrawer = null
        , q = null
        , r = null
        , s = null
        , t = null
        , u = null
        , v = null
        , w = null
        , x = null
        , y = null
        , z = null
        , A = null
        , B = null
        , C = null
        , D = null
        , E = null
        , F = null
        , G = null
        , H = BrowserDetect()
        , I = null
        , J = null
        , K = 0
        , L = null
        , M = !1
        , N = !0
        , O = "canvas"
        , P = !0
        , Q = !1
        , canvasElement = null
        , S = null
        , T = null
        , U = !1
        , V = null
        , W = null
        , X = null
        , Y = {
            id: 1,
            samples: null,
            baseMediaDecodeTime: 0
        }
        , Z = 0
        , $ = 0
        , _ = null
        , ab = 1
        , bb = ""
        , videoElement = null
        , db = null
        , eb = 4
        , fb = 4
        , gb = "chrome" !== H ? fb : eb
        , hb = 1
        , ib = gb
        , jb = ib
        , kb = !1
        , lb = 0
        , mb = 0
        , nb = 0
        , ob = 1e3
        , pb = null
        , qb = 0
        , rb = 0
        , sb = 0
        , tb = 0
        , ub = 1e3
        , vb = null
        , wb = null
        , xb = null
        , yb = 0
        , zb = {
            type: "live",
            codec: "",
            width: 0,
            height: 0,
            isLimitSpeed: null
        }
        , Ab = !1
        , Bb = null
        , Cb = null
        , Db = null
        , Eb = {
            5: "MJPEG",
            8: "H264",
            12: "H265"
        }
        , Fb = {
            1: 4e3,
            2: 8e3,
            3: 11025,
            4: 16e3,
            5: 2e4,
            6: 22050,
            7: 32e3,
            8: 44100,
            9: 48e3,
            10: 96e3,
            11: 128e3,
            12: 192e3,
            13: 64e3
        }
        , Gb = function () {
            function a() {
                void function () {
                    d = setInterval(function () {
                        c++
                    }, 1e3)
                }(),
                    this.getTime = function () {
                        return c
                    }
                    ,
                    this.clearTimer = function () {
                        c = 0,
                            clearInterval(d)
                    }
                    ,
                    this.getState = function () {
                        return state
                    }
                    ,
                    this.bindTimeUpdate = function (a) {
                        var b = this;
                        if (!e && a) {
                            a.addEventListener("timeupdate", () => {
                                a.removeEventListener("timeupdate", () => { }, true)
                                b.clearTimer()
                            }, true)
                            /*  jQuery(a).on("timeupdate", function() {
                                 jQuery(a).off("timeupdate");
                                 b.clearTimer()
                             }) */
                        }
                        e = !0
                    }
            }
            var b = null
                , c = 0
                , d = null
                , e = !1;
            return function () {
                return b ? b : b = new a
            }
        }();
    a.prototype = {
        init: function (b) {
            yb = 0,
                //canvasElement = a,
                videoElement = b;
            l = new Worker("module/videoWorker.js");
            //audioWorker = new Worker("module/audioWorker.js"),
            l.onmessage = onVideoMessage;
            //audioWorker.onmessage = e,
            //streamDrawer = new StreamDrawer(yb,this,canvasElement),
            //streamDrawer.setResizeCallback(s),
        },
        sendSdpInfo: function (a, b, c) {
            var d = {
                type: "sdpInfo",
                data: {
                    sdpInfo: a,
                    aacCodecInfo: b,
                    decodeMode: O,
                    govLength: L,
                    checkDelay: P
                }
            };
            if (M = c,
                l.postMessage(d),
                M)
                try {
                    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext,
                        n = new Worker("./media/ump/Workers/audioTalkWorker.js"),
                        n.onmessage = f,
                        null === r && (r = new Talk,
                            r.init(),
                            r.setSendAudioTalkBufferCallback(g));
                    var e = r.initAudioOut();
                    n.postMessage(d),
                        d = {
                            type: "sampleRate",
                            data: e
                        },
                        n.postMessage(d)
                } catch (h) {
                    return M = !1,
                        void debug.error("Web Audio API is not supported in this web browser! : " + h)
                }
            pb = null,
                kb = !1,
                J = a
        },
        parseRTPData: function (a, b) {
            function c() {
                for (var a = b[22] + 24, c = 24; a > c;)
                    if (g == b[c]) {
                        if (c + 4 > a)
                            return console.log("i: " + c),
                                -1;
                        M.width = b[c + 2] << 3,
                            M.height = b[c + 3] << 3,
                            c += 4
                    } else if (h == b[c]) {
                        if (c + 4 > b.length)
                            return console.log("i: " + c),
                                -1;
                        M.I_frame_interval = b[c + 1],
                            M.encode_type = b[c + 2],
                            M.frame_rate = b[c + 3],
                            c += 4
                    } else if (i == b[c])
                        M.width = (b[c + 5] << 8) + b[c + 4],
                            M.height = (b[c + 7] << 8) + b[c + 6],
                            c += 8;
                    else if (j == b[c])
                        c += 4;
                    else if (o == b[c])
                        c += 8;
                    else if (k == b[c]) {
                        if (c + 4 > a)
                            return console.log("i: " + c),
                                -1;
                        var d = (b[c + 2] << 8) + b[c + 3];
                        c += d
                    } else if (x == b[c])
                        M.h264_svc_flag = !0,
                            M.svc = b[c + 2],
                            c += 4;
                    else if (q == b[c])
                        c += 8;
                    else if (u == b[c])
                        c += 8;
                    else if (C == b[c]) {
                        var e = b[c + 1]
                            , f = b[c + 2];
                        c += 8,
                            c += e * f * 16
                    } else if (E == b[c])
                        c += 8;
                    else if (G == b[c])
                        c += 8;
                    else if (v == b[c])
                        c += 8;
                    else if (w == b[c])
                        c += 8;
                    else if (y == b[c])
                        c += 8;
                    else if (I <= b[c] && b[c] < J)
                        M.timeStampmsw = (b[c + 3] << 8) + b[c + 2],
                            c += 4;
                    else if (J <= b[c] && b[c] < K)
                        c += b[c + 1];
                    else if (n == b[c])
                        c += 4;
                    else if (p == b[c])
                        c += 4;
                    else if (r == b[c])
                        c += 4;
                    else if (t == b[c])
                        c += 8;
                    else if (A == b[c]) {
                        var e = b[c + 1];
                        c += 8,
                            c += 16 * e
                    } else if (B == b[c])
                        c += 4;
                    else {
                        if (H != b[c])
                            return console.log("parseVideoInfo error ext_type:0x" + b[c]),
                                console.log("i: " + c),
                                -1;
                        var a = (b[c + 5] << 8) + b[c + 4];
                        c += 8,
                            c += a
                    }
            }
            function d() {
                M.ChannelCount = 0;
                for (var a = b[22] + 24, c = 24; a > c;)
                    if (g == b[c])
                        c += 4;
                    else if (h == b[c])
                        c += 4;
                    else if (i == b[c])
                        c += 8;
                    else if (j == b[c])
                        c += 4;
                    else if (s == b[c])
                        c += b[c + 1];
                    else if (o == b[c])
                        c += 8;
                    else if (k == b[c]) {
                        var d = b[c + 2] << 8 + b[c + 3];
                        c += d
                    } else if (z == b[c])
                        M.ChannelCount = b[c + 1],
                            M.channel = b[c + 2],
                            c += 4;
                    else if (y == b[c])
                        c += 8;
                    else {
                        if (I != b[c])
                            return console.log("parseAudioInfo error ext_type:0x" + b[c]),
                                console.log("i: " + c),
                                -1;
                        M.timeStampmsw = (b[c + 3] << 8) + b[c + 2],
                            c += 4
                    }
                0 == M.ChannelCount && (M.ChannelCount = 1,
                    M.channel = 0);
                for (var a = b[22] + 24, c = 24; a > c;)
                    if (b[c] == g)
                        c += 4;
                    else if (b[c] == h)
                        c += 4;
                    else if (b[c] == i)
                        c += 8;
                    else if (b[c] == j)
                        M.audio_type = b[c + 2],
                            M.samplingRate = Fb[b[c + 3]],
                            c += 4;
                    else if (b[c] == s)
                        c += b[c + 1];
                    else if (b[c] == o)
                        c += 8;
                    else if (b[c] == k) {
                        var d = b[c + 2] << 8 + b[c + 3];
                        c += d
                    } else if (b[c] == z)
                        c += 4;
                    else if (b[c] == y)
                        c += 8;
                    else {
                        if (I != b[c])
                            return console.log("parseAudioInfo error ext_type:0x" + b[c]),
                                console.log("i: " + c),
                                -1;
                        c += 4
                    }
            }
            function e() {
                for (var a = b[22] + 24, c = 24; a > c;)
                    if (I <= b[c] && b[c] < J)
                        M.timeStampmsw = (b[c + 3] << 8) + b[c + 2],
                            c += 4;
                    else if (k == b[c]) {
                        if (c + 4 > a)
                            return console.log("i: " + c),
                                -1;
                        var d = (b[c + 2] << 8) + b[c + 3];
                        c += d
                    } else
                        c++
            }
            var f = b[4]
                , g = 128
                , h = 129
                , i = 130
                , j = 131
                , k = 132
                , n = 133
                , o = 136
                , p = 137
                , q = 138
                , r = 139
                , s = 140
                , t = 144
                , u = 145
                , v = 146
                , w = 147
                , x = 148
                , y = 149
                , z = 150
                , A = 151
                , B = 152
                , C = 153
                , E = 154
                , G = 155
                , H = 156
                , I = 160
                , J = 176
                , K = 255
                , L = {
                    type: "MediaData",
                    data: {
                        rtspInterleave: a,
                        payload: b
                    },
                    info: null
                }
                , M = {};
            if (253 == f || 254 == f || 252 == f || 251 == f) {
                if (c(),
                    null != Bb) {
                    if (Bb != M.encode_type)
                        return Bb = M.encode_type,
                            void D(Eb[M.encode_type])
                } else
                    Bb = M.encode_type;
                switch (M.encode_type + "") {
                    case "5":
                    case "8":
                    case "12":
                        l && (L.info = M,
                            l.postMessage(L));
                        break;
                    default:
                        console.log("encode_type: " + encode_type)
                }
            } else if (240 == f) {
                if (d(),
                    null != Db) {
                    if (Db != M.audio_type)
                        return Db = M.audio_type,
                            void F("audioType")
                } else
                    Db = M.audio_type;
                if (null != Cb) {
                    if (Cb != M.samplingRate)
                        return Cb = M.samplingRate,
                            void F("samplingRate")
                } else
                    Cb = M.samplingRate;
                switch (M.audio_type + "") {
                    case "10":
                    case "14":
                    case "26":
                    case "27":
                    case "28":
                    case "29":
                    case "30":
                        audioWorker && (L.info = M,
                            audioWorker.postMessage(L))
                }
            } else
                241 == f ? (e(),
                    l && (L.info = M,
                        l.postMessage(L))) : console.log("mediaType:   " + f)
        },
        setCallback: function (a, b) {
            switch (a) {
                case "timeStamp":
                    u = b;
                    break;
                case "ResolutionChanged":
                    s = b,
                        null !== streamDrawer && streamDrawer.setResizeCallback(s);
                    break;
                case "audioTalk":
                    v = b;
                    break;
                case "stepRequest":
                    w = b;
                    break;
                case "metaEvent":
                    x = b;
                    break;
                case "videoMode":
                    y = b;
                    break;
                case "loadingBar":
                    z = b;
                    break;
                case "Error":
                    A = b;
                    break;
                case "PlayStart":
                    t = b,
                        null !== streamDrawer && streamDrawer.setBeginDrawCallback(t);
                    break;
                case "DecodeStart":
                    B = b;
                    break;
                case "UpdateCanvas":
                    C = b,
                        null !== streamDrawer && streamDrawer.setupdateCanvasCallback(C);
                    break;
                case "FrameTypeChange":
                    D = b;
                    break;
                case "MSEResolutionChanged":
                    E = b;
                    break;
                case "audioChange":
                    F = b;
                    break;
                case "ivs":
                    G = b;
                    break;
                case "WorkerReady":
                    xb = b;
                    break;
                default:
                    console.log(a),
                        console.log("workerManager::setCallback() : type is unknown")
            }
        },
        capture: function (a) {
            "canvas" === O ? streamDrawer.capture(a) : V.capture(a)
        },
        setDeviceInfo: function (a) {
            T = a.mode
        },
        setFPS: function (a) {
            var b = 30;
            K = 0 === a ? b : a,
                h(1 !== hb)
        },
        setGovLength: function (a) {
            L = a
        },
        setLiveMode: function (a) {
            null !== y && y(a),
                O = null === a ? "canvas" : a,
                "video" === O ? null !== streamDrawer && streamDrawer.renewCanvas() : "canvas" === O && h(!1)
        },
        controlAudio: function (a, b) {
            switch (console.log(a + " " + b),
            a) {
                case "audioPlay":
                    "start" === b ? null !== q && q.play() : (qb = 0,
                        null !== q && q.stop());
                    break;
                case "volumn":
                    qb = b,
                        null !== q && q.controlVolumn(b);
                    break;
                case "audioSamplingRate":
                    null !== q && q.setSamplingRate(b)
            }
        },
        controlAudioTalk: function (a, b) {
            if (null !== r)
                switch (a) {
                    case "onOff":
                        "on" === b || r.stopAudioOut();
                        break;
                    case "volumn":
                        r.controlVolumnOut(b)
                }
        },
        reassignCanvas: function () {
            null !== streamDrawer && streamDrawer.reassignCanvas()
        },
        digitalZoom: function (a) {
            null !== streamDrawer && streamDrawer.digitalZoom(a)
        },
        playbackSpeed: function (a) {
            hb = a,
                streamDrawer.setFrameInterval(hb)
        },
        timeStamp: function () { },
        initVideo: function (a) {
            h(a)
        },
        setFpsFrame: function (a) {
            ub = a,
                tb = 0,
                sb = 0
        },
        setCheckDelay: function (a) {
            P = a
        },
        initStartTime: function () {
            var a = {
                type: "initStartTime"
            };
            l.postMessage(a),
                streamDrawer.stopRendering(),
                streamDrawer.startRendering()
        },
        terminate: function () {
            "backup" !== T && (l && (l.terminate(),
                l = null),
                audioWorker && (audioWorker.terminate(),
                    audioWorker = null)),
                n && n.terminate(),
                r && (r.terminate(),
                    r = null),
                streamDrawer && streamDrawer.terminate(),
                q && q.terminate(),
                V && V.terminate(),
                xb && (xb = null),
                streamDrawer = null,
                N = !0
        }
    };
    return new a
};



export default WorkerManager;