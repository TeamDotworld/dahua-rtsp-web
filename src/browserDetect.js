function BrowserDetect() {
    var a = navigator.userAgent.toLowerCase(),
        b = navigator.appName,
        c = null;
    return "Microsoft Internet Explorer" === b || a.indexOf("trident") > -1 || a.indexOf("edge/") > -1 ? (c = "ie", "Microsoft Internet Explorer" === b ? (a = /msie ([0-9]{1,}[\.0-9]{0,})/.exec(a), c += parseInt(a[1])) : a.indexOf("trident") > -1 ? c += 11 : a.indexOf("edge/") > -1 && (c = "edge")) : a.indexOf("safari") > -1 ? c = a.indexOf("chrome") > -1 ? "chrome" : "safari" : a.indexOf("firefox") > -1 && (c = "firefox"), c
}


export { BrowserDetect }