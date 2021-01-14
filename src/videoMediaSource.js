import { BrowserDetect } from './browserDetect.js'

function VideoMediaSource(a) {
    function b() { }

    function c() {
        h()
    }

    function d(a) {
        Q = [], Q.push({
            type: "error",
            "function": q
        }), Q.push({
            type: "updateend",
            "function": n
        }), Q.push({
            type: "update",
            "function": o
        });
        for (var b = 0; b < Q.length; b++) a.addEventListener(Q[b].type, Q[b]["function"])
    }

    function e(a) {
        R = [], R.push({
            type: "durationchange",
            "function": v
        }), R.push({
            type: "playing",
            "function": s
        }), R.push({
            type: "error",
            "function": r
        }), R.push({
            type: "pause",
            "function": t
        }), R.push({
            type: "timeupdate",
            "function": u
        }), R.push({
            type: "resize",
            "function": w
        }), R.push({
            type: "seeked",
            "function": x
        }), R.push({
            type: "waiting",
            "function": y
        }), R.push({
            type: "canplaythrough",
            "function": A
        }), R.push({
            type: "canplay",
            "function": z
        }), R.push({
            type: "loadedmetadata",
            "function": B
        });
        for (var b = 0; b < R.length; b++) a.addEventListener(R[b].type, R[b]["function"])
    }

    function f(a) {
        S = [], S.push({
            type: "sourceopen",
            "function": c
        }), S.push({
            type: "error",
            "function": p
        });
        for (var b = 0; b < S.length; b++) a.addEventListener(S[b].type, S[b]["function"])
    }

    function g() {
        var a = 0;
        if (null !== Q)
            for (a = 0; a < Q.length; a++) ab.removeEventListener(Q[a].type, Q[a]["function"]);
        if (null !== S)
            for (a = 0; a < S.length; a++) _.removeEventListener(S[a].type, S[a]["function"]);
        if (null !== R)
            for (a = 0; a < R.length; a++) $.removeEventListener(R[a].type, R[a]["function"])
    }

    function h() {
        if (null === _ || "ended" === _.readyState) return _ = new MediaSource, f(_), $.src = window.URL.createObjectURL(_);
        if (0 === _.sourceBuffers.length) {
            _.duration = 0;
            var a = 'video/mp4;codecs="avc1.' + E + '"';
            ab = _.addSourceBuffer(a);
            d(ab)
        }
        var b = D();
        return null === b ? void _.endOfStream("network") : (ab.appendBuffer(b))
    }

    function i(a) {
        if (null !== ab && "closed" !== _.readyState && "ended" !== _.readyState) try {
            if (Y.length > 0) return Y.push(a);
            ab.updating ? (Y.push(a)) : ab.appendBuffer(a)
        } catch (b) {
            Y.length = 0;
            W.initVideo(!1)
        }
    }

    function j() {
        try {
            $.paused && (G(), T || $.play())
        } catch (error) {

        }
    }

    function k() {
        $.paused || U || (console.log("pause"), $.pause())
    }

    function l() {
        var a = 60,
            b = 10,
            c = 1 * ab.buffered.start(ab.buffered.length - 1),
            d = 1 * ab.buffered.end(ab.buffered.length - 1);
        d - c > a && ab.remove(c, d - b)
    }

    function m() {
        if (null !== _) try {
            if (ab && ab.buffered.length > 0 && (l(), T || $.duration - $.currentTime > 1.5 && ($.currentTime = ($.duration - 1).toFixed(3)), X)) {
                var a = 1 * ab.buffered.start(ab.buffered.length - 1),
                    b = 1 * ab.buffered.end(ab.buffered.length - 1),
                    c = 0;
                if (c = 0 === $.currentTime ? b - a : b - $.currentTime, c >= Z + .1) {
                    if (ab.updating) return;
                    var d = b - Z;
                    $.currentTime = d.toFixed(3)
                }
            }
        } catch (e) {
            console.log("sourceBuffer has been removed")
        }
    }

    function n() { }

    function o() {
        Y.length > 0 && (ab.updating || (ab.appendBuffer(Y[0]), Y.shift()))
    }

    function p() {
        console.log("videoMediaSource::onSourceError")
    }

    function q() {
        console.log("videoMediaSource::onSourceBufferErrormsg")
    }

    function r() {
        console.log("videoMediaSource::onError"), k()
    }

    function s() {
        T = !0, U = !1, console.log("playing "), db || (db = !0, I("PlayStart"))
    }

    function t() {
        T = !1, U = !0, console.log("暂停播放----------------------------------------------")
    }

    function u() {
        var a = 4,
            b = 4,
            c = parseInt(_.duration, 10),
            d = parseInt($.currentTime, 10),
            e = L.timestamp - K * (c - d + (1 !== K ? 1 : 0)),
            f = {
                timestamp: e,
                timestamp_usec: 0,
                timezone: L.timezone
            };
        0 === d || isNaN(c) || Math.abs(c - d) > b && 1 === K || $.paused || (null === O ? O = f : (O.timestamp <= f.timestamp && K >= 1 || O.timestamp > f.timestamp && 1 > K) && (P && W.timeStamp(f), O = f, V++, V > a && H(f.timestamp, "currentTime")))
    }

    function v() {
        m()
    }

    function w() {
        G()
    }

    function x() {
        j()
    }

    function y() {
        if (X = !1, 0 == cb) bb = Date.now(), cb++;
        else {
            cb++;
            var a = Date.now() - bb;
            cb >= 5 && 6e4 > a && 1.8 >= Z && (Z += .1, cb = 0, bb = 0)
        }
    }

    function z() {

    }

    function A() {
        X = !0
    }

    function B() {

    }

    function C(a, b) {
        for (var c = atob(a.substring("data:image/png;base64,".length)), d = new Uint8Array(c.length), e = 0, f = c.length; f > e; ++e) d[e] = c.charCodeAt(e);
        var g = new Blob([d.buffer], {
            type: "image/png"
        });
        gb(g, b + ".png")
    }
    var D = null,
        E = "",
        F = null,
        G = null,
        H = null,
        I = null,
        J = null,
        K = 1,
        L = {
            timestamp: 0,
            timestamp_usec: 0,
            timezone: 0
        },
        M = !1,
        N = {
            timestamp: 0,
            timestamp_usec: 0,
            timezone: 0
        },
        O = null,
        P = !1,
        Q = null,
        R = null,
        S = null,
        T = !1,
        U = !0,
        V = 0,
        W = a,
        X = !1,
        Y = [],
        Z = .5,
        $ = null,
        _ = null,
        ab = null,
        bb = 0,
        cb = 0,
        db = !1,
        eb = null,
        fb = BrowserDetect();
    b.prototype = {
        init: function (a) {
            J = BrowserDetect();
            $ = a, $.autoplay = "safari" === J ? !1 : !0, $.controls = !1, $.preload = "auto", e($), h()
        },
        setInitSegmentFunc: function (a) {
            D = a
        },
        getVideoElement: function () {
            return $
        },
        setCodecInfo: function (a) {
            E = a
        },
        setMediaSegment: function (a) {
            i(a)
        },
        capture: function (a) {
            eb && clearInterval(eb);
            var b = document.createElement("canvas");
            b.width = $.videoWidth, b.height = $.videoHeight, X || "edge" === fb ? (b.getContext("2d").drawImage($, 0, 0, b.width, b.height), C(b.toDataURL(), a)) : eb = setInterval(function () {
                X && (b.getContext("2d").drawImage($, 0, 0, b.width, b.height), C(b.toDataURL(), a), clearInterval(eb))
            }, 200)
        },
        setInitSegment: function () {
            h()
        },
        setTimeStamp: function (a) {
            F = a
        },
        setVideoSizeCallback: function (a) {
            G = a
        },
        setAudioStartCallback: function (a) {
            H = a
        },
        getPlaybackTimeStamp: function () {
            return F
        },
        setSpeedPlay: function (a) {
            K = a
        },
        setvideoTimeStamp: function (a) {
            var b = 3,
                c = Math.abs(L.timestamp - a.timestamp) > b;
            if (c === !0 && M === !1) {
                M = !0, V = 0, N = a, H(N.timestamp, "init");
                var d = parseInt(_.duration, 10),
                    e = parseInt($.currentTime, 10),
                    f = d - e;
                setTimeout(function () {
                    L = a, M = !1
                }, 1e3 * f)
            } else c === !1 && M === !1 && (L = a)
        },
        pause: function () {
            k()
        },
        play: function () {
            j()
        },
        setPlaybackFlag: function (a) {
            P = a
        },
        setTimeStampInit: function () {
            O = null, N = {
                timestamp: 0,
                timestamp_usec: 0,
                timezone: 0
            }
        },
        close: function () {
            g(), k()
        },
        setBeginDrawCallback: function (a) {
            I = a
        },
        terminate: function () {
            g(), "open" === _.readyState && ab && _.removeSourceBuffer(ab), ab = null, _.endOfStream(), ab = null, _ = null, $ = null, eb && (clearInterval(eb), eb = null)
        },
        getDuration: function () {
            return $.duration - $.currentTime
        },
        getNoWaitFlag: function () {
            return "edge" !== fb ? X : !0
        }
    };
    var gb = function (a) {
        var b = a.document,
            c = function () {
                return a.URL || a.webkitURL || a
            },
            d = b.createElementNS("http://www.w3.org/1999/xhtml", "a"),
            e = "download" in d,
            f = function (a) {
                var b = new MouseEvent("click");
                a.dispatchEvent(b)
            },
            g = /constructor/i.test(a.HTMLElement),
            h = /CriOS\/[\d]+/.test(navigator.userAgent),
            i = function (b) {
                (a.setImmediate || a.setTimeout)(function () {
                    throw b
                }, 0)
            },
            j = "application/octet-stream",
            k = 4e4,
            l = function (a) {
                var b = function () {
                    "string" == typeof a ? c().revokeObjectURL(a) : a.remove()
                };
                setTimeout(b, k)
            },
            m = function (a, b, c) {
                b = [].concat(b);
                for (var d = b.length; d--;) {
                    var e = a["on" + b[d]];
                    if ("function" == typeof e) try {
                        e.call(a, c || a)
                    } catch (f) {
                        i(f)
                    }
                }
            },
            n = function (a) {
                return /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type) ? new Blob([String.fromCharCode(65279), a], {
                    type: a.type
                }) : a
            },
            o = function (b, i, k) {
                k || (b = n(b));
                var o, p = this,
                    q = b.type,
                    r = q === j,
                    s = function () {
                        m(p, "writestart progress write writeend".split(" "))
                    },
                    t = function () {
                        if ((h || r && g) && a.FileReader) {
                            var d = new FileReader;
                            return d.onloadend = function () {
                                var b = h ? d.result : d.result.replace(/^data:[^;]*;/, "data:attachment/file;"),
                                    c = a.open(b, "_blank");
                                c || (a.location.href = b), b = void 0, p.readyState = p.DONE, s()
                            }, d.readAsDataURL(b), void (p.readyState = p.INIT)
                        }
                        if (o || (o = c().createObjectURL(b)), r) a.location.href = o;
                        else {
                            var e = a.open(o, "_blank");
                            e || (a.location.href = o)
                        }
                        p.readyState = p.DONE, s(), l(o)
                    };
                return p.readyState = p.INIT, e ? (o = c().createObjectURL(b), void setTimeout(function () {
                    d.href = o, d.download = i, f(d), s(), l(o), p.readyState = p.DONE
                })) : void t()
            },
            p = o.prototype,
            q = function (a, b, c) {
                return new o(a, b || a.name || "download", c)
            };
        return "undefined" != typeof navigator && navigator.msSaveOrOpenBlob ? function (a, b, c) {
            return b = b || a.name || "download", c || (a = n(a)), navigator.msSaveOrOpenBlob(a, b)
        } : (p.readyState = p.INIT = 0, p.WRITING = 1, p.DONE = 2, p.error = p.onwritestart = p.onprogress = p.onwrite = p.onabort = p.onerror = p.onwriteend = null, q)
    }(window);
    return new b
}


export { VideoMediaSource }