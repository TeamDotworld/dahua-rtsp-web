function BrowserDetect() {
  var a = navigator.userAgent.toLowerCase(),
    b = navigator.appName,
    c = null;
  return (
    "Microsoft Internet Explorer" === b ||
    a.indexOf("trident") > -1 ||
    a.indexOf("edge/") > -1
      ? ((c = "ie"),
        "Microsoft Internet Explorer" === b
          ? ((a = /msie ([0-9]{1,}[\.0-9]{0,})/.exec(a)), (c += parseInt(a[1])))
          : a.indexOf("trident") > -1
          ? (c += 11)
          : a.indexOf("edge/") > -1 && (c = "edge"))
      : a.indexOf("safari") > -1
      ? (c = a.indexOf("chrome") > -1 ? "chrome" : "safari")
      : a.indexOf("firefox") > -1 && (c = "firefox"),
    c
  );
}

var Script = (function () {
    function a() {}
    return (
      (a.createFromElementId = function (b) {
        for (var c = document.getElementById(b), d = "", e = c.firstChild; e; )
          3 === e.nodeType && (d += e.textContent), (e = e.nextSibling);
        var f = new a();
        return (f.type = c.type), (f.source = d), f;
      }),
      (a.createFromSource = function (b, c) {
        var d = new a();
        return (d.type = b), (d.source = c), d;
      }),
      a
    );
  })(),
  Shader = (function () {
    function a(a, b) {
      if ("x-shader/x-fragment" === b.type)
        this.shader = a.createShader(a.FRAGMENT_SHADER);
      else {
        if ("x-shader/x-vertex" !== b.type)
          return void error("Unknown shader type: " + b.type);
        this.shader = a.createShader(a.VERTEX_SHADER);
      }
      return (
        a.shaderSource(this.shader, b.source),
        a.compileShader(this.shader),
        a.getShaderParameter(this.shader, a.COMPILE_STATUS)
          ? void 0
          : void error(
              "An error occurred compiling the shaders: " +
                a.getShaderInfoLog(this.shader)
            )
      );
    }
    return a;
  })(),
  Program = (function () {
    function a(a) {
      (this.gl = a), (this.program = this.gl.createProgram());
    }
    return (
      (a.prototype = {
        attach: function (a) {
          this.gl.attachShader(this.program, a.shader);
        },
        link: function () {
          this.gl.linkProgram(this.program);
        },
        use: function () {
          this.gl.useProgram(this.program);
        },
        getAttributeLocation: function (a) {
          return this.gl.getAttribLocation(this.program, a);
        },
        setMatrixUniform: function (a, b) {
          var c = this.gl.getUniformLocation(this.program, a);
          this.gl.uniformMatrix4fv(c, !1, b);
        },
      }),
      a
    );
  })(),
  Texture = (function () {
    function a(a, b, c) {
      (this.gl = a),
        (this.size = b),
        (this.texture = a.createTexture()),
        a.bindTexture(a.TEXTURE_2D, this.texture),
        (this.format = c ? c : a.LUMINANCE),
        a.texImage2D(
          a.TEXTURE_2D,
          0,
          this.format,
          b.w,
          b.h,
          0,
          this.format,
          a.UNSIGNED_BYTE,
          null
        ),
        a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAG_FILTER, a.NEAREST),
        a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.NEAREST),
        a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_S, a.CLAMP_TO_EDGE),
        a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_T, a.CLAMP_TO_EDGE);
    }
    var b = null;
    return (
      (a.prototype = {
        fill: function (a, b) {
          var c = this.gl;
          c.bindTexture(c.TEXTURE_2D, this.texture),
            b
              ? c.texSubImage2D(
                  c.TEXTURE_2D,
                  0,
                  0,
                  0,
                  this.size.w,
                  this.size.h,
                  this.format,
                  c.UNSIGNED_BYTE,
                  a
                )
              : c.texImage2D(
                  c.TEXTURE_2D,
                  0,
                  this.format,
                  this.size.w,
                  this.size.h,
                  0,
                  this.format,
                  c.UNSIGNED_BYTE,
                  a
                );
        },
        bind: function (a, c, d) {
          var e = this.gl;
          b || (b = [e.TEXTURE0, e.TEXTURE1, e.TEXTURE2]),
            e.activeTexture(b[a]),
            e.bindTexture(e.TEXTURE_2D, this.texture),
            e.uniform1i(e.getUniformLocation(c.program, d), a);
        },
      }),
      a
    );
  })(),
  base64ArrayBuffer = function (a) {
    for (
      var b = "",
        c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        d = new Uint8Array(a),
        e = d.byteLength,
        f = e % 3,
        g = e - f,
        h = 0,
        i = 0,
        j = 0,
        k = 0,
        l = 0,
        m = 0;
      g > m;
      m += 3
    )
      (l = (d[m] << 16) | (d[m + 1] << 8) | d[m + 2]),
        (h = (16515072 & l) >> 18),
        (i = (258048 & l) >> 12),
        (j = (4032 & l) >> 6),
        (k = 63 & l),
        (b += c[h] + c[i] + c[j] + c[k]);
    return (
      1 === f
        ? ((l = d[g]),
          (h = (252 & l) >> 2),
          (i = (3 & l) << 4),
          (b += c[h] + c[i] + "=="))
        : 2 === f &&
          ((l = (d[g] << 8) | d[g + 1]),
          (h = (64512 & l) >> 10),
          (i = (1008 & l) >> 4),
          (j = (15 & l) << 2),
          (b += c[h] + c[i] + c[j] + "=")),
      b
    );
  };

export { Script, Program, Shader, Texture, base64ArrayBuffer };
