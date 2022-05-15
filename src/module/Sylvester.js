function Vector() {}
function Matrix() {}
function Line() {}
function Plane() {}
var Sylvester = {
    version: "0.1.3",
    precision: 1e-6
};
Vector.prototype = {
    e: function(a) {
        return 1 > a || a > this.elements.length ? null : this.elements[a - 1]
    },
    dimensions: function() {
        return this.elements.length
    },
    modulus: function() {
        return Math.sqrt(this.dot(this))
    },
    eql: function(a) {
        var b = this.elements.length
          , c = a.elements || a;
        if (b != c.length)
            return !1;
        do
            if (Math.abs(this.elements[b - 1] - c[b - 1]) > Sylvester.precision)
                return !1;
        while (--b);
        return !0
    },
    dup: function() {
        return Vector.create(this.elements)
    },
    map: function(a) {
        var b = [];
        return this.each(function(c, d) {
            b.push(a(c, d))
        }),
        Vector.create(b)
    },
    each: function(a) {
        var b, c = this.elements.length, d = c;
        do
            b = d - c,
            a(this.elements[b], b + 1);
        while (--c)
    },
    toUnitVector: function() {
        var a = this.modulus();
        return 0 === a ? this.dup() : this.map(function(b) {
            return b / a
        })
    },
    angleFrom: function(a) {
        var b = a.elements || a
          , c = this.elements.length;
        if (c != b.length)
            return null;
        var d = 0
          , e = 0
          , f = 0;
        if (this.each(function(a, c) {
            d += a * b[c - 1],
            e += a * a,
            f += b[c - 1] * b[c - 1]
        }),
        e = Math.sqrt(e),
        f = Math.sqrt(f),
        e * f === 0)
            return null;
        var g = d / (e * f);
        return -1 > g && (g = -1),
        g > 1 && (g = 1),
        Math.acos(g)
    },
    isParallelTo: function(a) {
        var b = this.angleFrom(a);
        return null === b ? null : b <= Sylvester.precision
    },
    isAntiparallelTo: function(a) {
        var b = this.angleFrom(a);
        return null === b ? null : Math.abs(b - Math.PI) <= Sylvester.precision
    },
    isPerpendicularTo: function(a) {
        var b = this.dot(a);
        return null === b ? null : Math.abs(b) <= Sylvester.precision
    },
    add: function(a) {
        var b = a.elements || a;
        return this.elements.length != b.length ? null : this.map(function(a, c) {
            return a + b[c - 1]
        })
    },
    subtract: function(a) {
        var b = a.elements || a;
        return this.elements.length != b.length ? null : this.map(function(a, c) {
            return a - b[c - 1]
        })
    },
    multiply: function(a) {
        return this.map(function(b) {
            return b * a
        })
    },
    x: function(a) {
        return this.multiply(a)
    },
    dot: function(a) {
        var b = a.elements || a
          , c = 0
          , d = this.elements.length;
        if (d != b.length)
            return null;
        do
            c += this.elements[d - 1] * b[d - 1];
        while (--d);
        return c
    },
    cross: function(a) {
        var b = a.elements || a;
        if (3 != this.elements.length || 3 != b.length)
            return null;
        var c = this.elements;
        return Vector.create([c[1] * b[2] - c[2] * b[1], c[2] * b[0] - c[0] * b[2], c[0] * b[1] - c[1] * b[0]])
    },
    max: function() {
        var a, b = 0, c = this.elements.length, d = c;
        do
            a = d - c,
            Math.abs(this.elements[a]) > Math.abs(b) && (b = this.elements[a]);
        while (--c);
        return b
    },
    indexOf: function(a) {
        var b, c = null, d = this.elements.length, e = d;
        do
            b = e - d,
            null === c && this.elements[b] == a && (c = b + 1);
        while (--d);
        return c
    },
    toDiagonalMatrix: function() {
        return Matrix.Diagonal(this.elements)
    },
    round: function() {
        return this.map(function(a) {
            return Math.round(a)
        })
    },
    snapTo: function(a) {
        return this.map(function(b) {
            return Math.abs(b - a) <= Sylvester.precision ? a : b
        })
    },
    distanceFrom: function(a) {
        if (a.anchor)
            return a.distanceFrom(this);
        var b = a.elements || a;
        if (b.length != this.elements.length)
            return null;
        var c, d = 0;
        return this.each(function(a, e) {
            c = a - b[e - 1],
            d += c * c
        }),
        Math.sqrt(d)
    },
    liesOn: function(a) {
        return a.contains(this)
    },
    liesIn: function(a) {
        return a.contains(this)
    },
    rotate: function(a, b) {
        var c, d, e, f, g;
        switch (this.elements.length) {
        case 2:
            return c = b.elements || b,
            2 != c.length ? null : (d = Matrix.Rotation(a).elements,
            e = this.elements[0] - c[0],
            f = this.elements[1] - c[1],
            Vector.create([c[0] + d[0][0] * e + d[0][1] * f, c[1] + d[1][0] * e + d[1][1] * f]));
        case 3:
            if (!b.direction)
                return null;
            var h = b.pointClosestTo(this).elements;
            return d = Matrix.Rotation(a, b.direction).elements,
            e = this.elements[0] - h[0],
            f = this.elements[1] - h[1],
            g = this.elements[2] - h[2],
            Vector.create([h[0] + d[0][0] * e + d[0][1] * f + d[0][2] * g, h[1] + d[1][0] * e + d[1][1] * f + d[1][2] * g, h[2] + d[2][0] * e + d[2][1] * f + d[2][2] * g]);
        default:
            return null
        }
    },
    reflectionIn: function(a) {
        if (a.anchor) {
            var b = this.elements.slice()
              , c = a.pointClosestTo(b).elements;
            return Vector.create([c[0] + (c[0] - b[0]), c[1] + (c[1] - b[1]), c[2] + (c[2] - (b[2] || 0))])
        }
        var d = a.elements || a;
        return this.elements.length != d.length ? null : this.map(function(a, b) {
            return d[b - 1] + (d[b - 1] - a)
        })
    },
    to3D: function() {
        var a = this.dup();
        switch (a.elements.length) {
        case 3:
            break;
        case 2:
            a.elements.push(0);
            break;
        default:
            return null
        }
        return a
    },
    inspect: function() {
        return "[" + this.elements.join(", ") + "]"
    },
    setElements: function(a) {
        return this.elements = (a.elements || a).slice(),
        this
    }
},
Vector.create = function(a) {
    var b = new Vector;
    return b.setElements(a)
}
,
Vector.i = Vector.create([1, 0, 0]),
Vector.j = Vector.create([0, 1, 0]),
Vector.k = Vector.create([0, 0, 1]),
Vector.Random = function(a) {
    var b = [];
    do
        b.push(Math.random());
    while (--a);
    return Vector.create(b)
}
,
Vector.Zero = function(a) {
    var b = [];
    do
        b.push(0);
    while (--a);
    return Vector.create(b)
}
,
Matrix.prototype = {
    e: function(a, b) {
        return 1 > a || a > this.elements.length || 1 > b || b > this.elements[0].length ? null : this.elements[a - 1][b - 1]
    },
    row: function(a) {
        return a > this.elements.length ? null : Vector.create(this.elements[a - 1])
    },
    col: function(a) {
        if (a > this.elements[0].length)
            return null;
        var b, c = [], d = this.elements.length, e = d;
        do
            b = e - d,
            c.push(this.elements[b][a - 1]);
        while (--d);
        return Vector.create(c)
    },
    dimensions: function() {
        return {
            rows: this.elements.length,
            cols: this.elements[0].length
        }
    },
    rows: function() {
        return this.elements.length
    },
    cols: function() {
        return this.elements[0].length
    },
    eql: function(a) {
        var b = a.elements || a;
        if ("undefined" == typeof b[0][0] && (b = Matrix.create(b).elements),
        this.elements.length != b.length || this.elements[0].length != b[0].length)
            return !1;
        var c, d, e, f = this.elements.length, g = f, h = this.elements[0].length;
        do {
            c = g - f,
            d = h;
            do
                if (e = h - d,
                Math.abs(this.elements[c][e] - b[c][e]) > Sylvester.precision)
                    return !1;
            while (--d)
        } while (--f);
        return !0
    },
    dup: function() {
        return Matrix.create(this.elements)
    },
    map: function(a) {
        var b, c, d, e = [], f = this.elements.length, g = f, h = this.elements[0].length;
        do {
            b = g - f,
            c = h,
            e[b] = [];
            do
                d = h - c,
                e[b][d] = a(this.elements[b][d], b + 1, d + 1);
            while (--c)
        } while (--f);
        return Matrix.create(e)
    },
    isSameSizeAs: function(a) {
        var b = a.elements || a;
        return "undefined" == typeof b[0][0] && (b = Matrix.create(b).elements),
        this.elements.length == b.length && this.elements[0].length == b[0].length
    },
    add: function(a) {
        var b = a.elements || a;
        return "undefined" == typeof b[0][0] && (b = Matrix.create(b).elements),
        this.isSameSizeAs(b) ? this.map(function(a, c, d) {
            return a + b[c - 1][d - 1]
        }) : null
    },
    subtract: function(a) {
        var b = a.elements || a;
        return "undefined" == typeof b[0][0] && (b = Matrix.create(b).elements),
        this.isSameSizeAs(b) ? this.map(function(a, c, d) {
            return a - b[c - 1][d - 1]
        }) : null
    },
    canMultiplyFromLeft: function(a) {
        var b = a.elements || a;
        return "undefined" == typeof b[0][0] && (b = Matrix.create(b).elements),
        this.elements[0].length == b.length
    },
    multiply: function(a) {
        if (!a.elements)
            return this.map(function(b) {
                return b * a
            });
        var b = a.modulus ? !0 : !1
          , c = a.elements || a;
        if ("undefined" == typeof c[0][0] && (c = Matrix.create(c).elements),
        !this.canMultiplyFromLeft(c))
            return null;
        var d, e, f, g, h, i, j = this.elements.length, k = j, l = c[0].length, m = this.elements[0].length, n = [];
        do {
            d = k - j,
            n[d] = [],
            e = l;
            do {
                f = l - e,
                g = 0,
                h = m;
                do
                    i = m - h,
                    g += this.elements[d][i] * c[i][f];
                while (--h);
                n[d][f] = g
            } while (--e)
        } while (--j);
        var c = Matrix.create(n);
        return b ? c.col(1) : c
    },
    x: function(a) {
        return this.multiply(a)
    },
    minor: function(a, b, c, d) {
        var e, f, g, h = [], i = c, j = this.elements.length, k = this.elements[0].length;
        do {
            e = c - i,
            h[e] = [],
            f = d;
            do
                g = d - f,
                h[e][g] = this.elements[(a + e - 1) % j][(b + g - 1) % k];
            while (--f)
        } while (--i);
        return Matrix.create(h)
    },
    transpose: function() {
        var a, b, c, d = this.elements.length, e = this.elements[0].length, f = [], g = e;
        do {
            a = e - g,
            f[a] = [],
            b = d;
            do
                c = d - b,
                f[a][c] = this.elements[c][a];
            while (--b)
        } while (--g);
        return Matrix.create(f)
    },
    isSquare: function() {
        return this.elements.length == this.elements[0].length
    },
    max: function() {
        var a, b, c, d = 0, e = this.elements.length, f = e, g = this.elements[0].length;
        do {
            a = f - e,
            b = g;
            do
                c = g - b,
                Math.abs(this.elements[a][c]) > Math.abs(d) && (d = this.elements[a][c]);
            while (--b)
        } while (--e);
        return d
    },
    indexOf: function(a) {
        var b, c, d, e = this.elements.length, f = e, g = this.elements[0].length;
        do {
            b = f - e,
            c = g;
            do
                if (d = g - c,
                this.elements[b][d] == a)
                    return {
                        i: b + 1,
                        j: d + 1
                    };
            while (--c)
        } while (--e);
        return null
    },
    diagonal: function() {
        if (!this.isSquare)
            return null;
        var a, b = [], c = this.elements.length, d = c;
        do
            a = d - c,
            b.push(this.elements[a][a]);
        while (--c);
        return Vector.create(b)
    },
    toRightTriangular: function() {
        var a, b, c, d, e = this.dup(), f = this.elements.length, g = f, h = this.elements[0].length;
        do {
            if (b = g - f,
            0 == e.elements[b][b])
                for (j = b + 1; j < g; j++)
                    if (0 != e.elements[j][b]) {
                        a = [],
                        c = h;
                        do
                            d = h - c,
                            a.push(e.elements[b][d] + e.elements[j][d]);
                        while (--c);
                        e.elements[b] = a;
                        break
                    }
            if (0 != e.elements[b][b])
                for (j = b + 1; j < g; j++) {
                    var i = e.elements[j][b] / e.elements[b][b];
                    a = [],
                    c = h;
                    do
                        d = h - c,
                        a.push(b >= d ? 0 : e.elements[j][d] - e.elements[b][d] * i);
                    while (--c);
                    e.elements[j] = a
                }
        } while (--f);
        return e
    },
    toUpperTriangular: function() {
        return this.toRightTriangular()
    },
    determinant: function() {
        if (!this.isSquare())
            return null;
        var a, b = this.toRightTriangular(), c = b.elements[0][0], d = b.elements.length - 1, e = d;
        do
            a = e - d + 1,
            c *= b.elements[a][a];
        while (--d);
        return c
    },
    det: function() {
        return this.determinant()
    },
    isSingular: function() {
        return this.isSquare() && 0 === this.determinant()
    },
    trace: function() {
        if (!this.isSquare())
            return null;
        var a, b = this.elements[0][0], c = this.elements.length - 1, d = c;
        do
            a = d - c + 1,
            b += this.elements[a][a];
        while (--c);
        return b
    },
    tr: function() {
        return this.trace()
    },
    rank: function() {
        var a, b, c, d = this.toRightTriangular(), e = 0, f = this.elements.length, g = f, h = this.elements[0].length;
        do {
            a = g - f,
            b = h;
            do
                if (c = h - b,
                Math.abs(d.elements[a][c]) > Sylvester.precision) {
                    e++;
                    break
                }
            while (--b)
        } while (--f);
        return e
    },
    rk: function() {
        return this.rank()
    },
    augment: function(a) {
        var b = a.elements || a;
        "undefined" == typeof b[0][0] && (b = Matrix.create(b).elements);
        var c, d, e, f = this.dup(), g = f.elements[0].length, h = f.elements.length, i = h, j = b[0].length;
        if (h != b.length)
            return null;
        do {
            c = i - h,
            d = j;
            do
                e = j - d,
                f.elements[c][g + e] = b[c][e];
            while (--d)
        } while (--h);
        return f
    },
    inverse: function() {
        if (!this.isSquare() || this.isSingular())
            return null;
        var a, b, c, d, e, f, g, h = this.elements.length, i = h, j = this.augment(Matrix.I(h)).toRightTriangular(), k = j.elements[0].length, l = [];
        do {
            a = h - 1,
            e = [],
            c = k,
            l[a] = [],
            f = j.elements[a][a];
            do
                d = k - c,
                g = j.elements[a][d] / f,
                e.push(g),
                d >= i && l[a].push(g);
            while (--c);
            for (j.elements[a] = e,
            b = 0; a > b; b++) {
                e = [],
                c = k;
                do
                    d = k - c,
                    e.push(j.elements[b][d] - j.elements[a][d] * j.elements[b][a]);
                while (--c);
                j.elements[b] = e
            }
        } while (--h);
        return Matrix.create(l)
    },
    inv: function() {
        return this.inverse()
    },
    round: function() {
        return this.map(function(a) {
            return Math.round(a)
        })
    },
    snapTo: function(a) {
        return this.map(function(b) {
            return Math.abs(b - a) <= Sylvester.precision ? a : b
        })
    },
    inspect: function() {
        var a, b = [], c = this.elements.length, d = c;
        do
            a = d - c,
            b.push(Vector.create(this.elements[a]).inspect());
        while (--c);
        return b.join("\n")
    },
    setElements: function(a) {
        var b, c = a.elements || a;
        if ("undefined" != typeof c[0][0]) {
            var d, e, f, g = c.length, h = g;
            this.elements = [];
            do {
                b = h - g,
                d = c[b].length,
                e = d,
                this.elements[b] = [];
                do
                    f = e - d,
                    this.elements[b][f] = c[b][f];
                while (--d)
            } while (--g);
            return this
        }
        var i = c.length
          , j = i;
        this.elements = [];
        do
            b = j - i,
            this.elements.push([c[b]]);
        while (--i);
        return this
    }
},
Matrix.create = function(a) {
    var b = new Matrix;
    return b.setElements(a)
}
,
Matrix.I = function(a) {
    var b, c, d, e = [], f = a;
    do {
        b = f - a,
        e[b] = [],
        c = f;
        do
            d = f - c,
            e[b][d] = b == d ? 1 : 0;
        while (--c)
    } while (--a);
    return Matrix.create(e)
}
,
Matrix.Diagonal = function(a) {
    var b, c = a.length, d = c, e = Matrix.I(c);
    do
        b = d - c,
        e.elements[b][b] = a[b];
    while (--c);
    return e
}
,
Matrix.Rotation = function(a, b) {
    if (!b)
        return Matrix.create([[Math.cos(a), -Math.sin(a)], [Math.sin(a), Math.cos(a)]]);
    var c = b.dup();
    if (3 != c.elements.length)
        return null;
    var d = c.modulus()
      , e = c.elements[0] / d
      , f = c.elements[1] / d
      , g = c.elements[2] / d
      , h = Math.sin(a)
      , i = Math.cos(a)
      , j = 1 - i;
    return Matrix.create([[j * e * e + i, j * e * f - h * g, j * e * g + h * f], [j * e * f + h * g, j * f * f + i, j * f * g - h * e], [j * e * g - h * f, j * f * g + h * e, j * g * g + i]])
}
,
Matrix.RotationX = function(a) {
    var b = Math.cos(a)
      , c = Math.sin(a);
    return Matrix.create([[1, 0, 0], [0, b, -c], [0, c, b]])
}
,
Matrix.RotationY = function(a) {
    var b = Math.cos(a)
      , c = Math.sin(a);
    return Matrix.create([[b, 0, c], [0, 1, 0], [-c, 0, b]])
}
,
Matrix.RotationZ = function(a) {
    var b = Math.cos(a)
      , c = Math.sin(a);
    return Matrix.create([[b, -c, 0], [c, b, 0], [0, 0, 1]])
}
,
Matrix.Random = function(a, b) {
    return Matrix.Zero(a, b).map(function() {
        return Math.random()
    })
}
,
Matrix.Zero = function(a, b) {
    var c, d, e, f = [], g = a;
    do {
        c = a - g,
        f[c] = [],
        d = b;
        do
            e = b - d,
            f[c][e] = 0;
        while (--d)
    } while (--g);
    return Matrix.create(f)
}
,
Line.prototype = {
    eql: function(a) {
        return this.isParallelTo(a) && this.contains(a.anchor)
    },
    dup: function() {
        return Line.create(this.anchor, this.direction)
    },
    translate: function(a) {
        var b = a.elements || a;
        return Line.create([this.anchor.elements[0] + b[0], this.anchor.elements[1] + b[1], this.anchor.elements[2] + (b[2] || 0)], this.direction)
    },
    isParallelTo: function(a) {
        if (a.normal)
            return a.isParallelTo(this);
        var b = this.direction.angleFrom(a.direction);
        return Math.abs(b) <= Sylvester.precision || Math.abs(b - Math.PI) <= Sylvester.precision
    },
    distanceFrom: function(a) {
        if (a.normal)
            return a.distanceFrom(this);
        if (a.direction) {
            if (this.isParallelTo(a))
                return this.distanceFrom(a.anchor);
            var b = this.direction.cross(a.direction).toUnitVector().elements
              , c = this.anchor.elements
              , d = a.anchor.elements;
            return Math.abs((c[0] - d[0]) * b[0] + (c[1] - d[1]) * b[1] + (c[2] - d[2]) * b[2])
        }
        var e = a.elements || a
          , c = this.anchor.elements
          , f = this.direction.elements
          , g = e[0] - c[0]
          , h = e[1] - c[1]
          , i = (e[2] || 0) - c[2]
          , j = Math.sqrt(g * g + h * h + i * i);
        if (0 === j)
            return 0;
        var k = (g * f[0] + h * f[1] + i * f[2]) / j
          , l = 1 - k * k;
        return Math.abs(j * Math.sqrt(0 > l ? 0 : l))
    },
    contains: function(a) {
        var b = this.distanceFrom(a);
        return null !== b && b <= Sylvester.precision
    },
    liesIn: function(a) {
        return a.contains(this)
    },
    intersects: function(a) {
        return a.normal ? a.intersects(this) : !this.isParallelTo(a) && this.distanceFrom(a) <= Sylvester.precision
    },
    intersectionWith: function(a) {
        if (a.normal)
            return a.intersectionWith(this);
        if (!this.intersects(a))
            return null;
        var b = this.anchor.elements
          , c = this.direction.elements
          , d = a.anchor.elements
          , e = a.direction.elements
          , f = c[0]
          , g = c[1]
          , h = c[2]
          , i = e[0]
          , j = e[1]
          , k = e[2]
          , l = b[0] - d[0]
          , m = b[1] - d[1]
          , n = b[2] - d[2]
          , o = -f * l - g * m - h * n
          , p = i * l + j * m + k * n
          , q = f * f + g * g + h * h
          , r = i * i + j * j + k * k
          , s = f * i + g * j + h * k
          , t = (o * r / q + s * p) / (r - s * s);
        return Vector.create([b[0] + t * f, b[1] + t * g, b[2] + t * h])
    },
    pointClosestTo: function(a) {
        if (a.direction) {
            if (this.intersects(a))
                return this.intersectionWith(a);
            if (this.isParallelTo(a))
                return null;
            var b = this.direction.elements
              , c = a.direction.elements
              , d = b[0]
              , e = b[1]
              , f = b[2]
              , g = c[0]
              , h = c[1]
              , i = c[2]
              , j = f * g - d * i
              , k = d * h - e * g
              , l = e * i - f * h
              , m = Vector.create([j * i - k * h, k * g - l * i, l * h - j * g])
              , n = Plane.create(a.anchor, m);
            return n.intersectionWith(this)
        }
        var n = a.elements || a;
        if (this.contains(n))
            return Vector.create(n);
        var o = this.anchor.elements
          , b = this.direction.elements
          , d = b[0]
          , e = b[1]
          , f = b[2]
          , p = o[0]
          , q = o[1]
          , r = o[2]
          , j = d * (n[1] - q) - e * (n[0] - p)
          , k = e * ((n[2] || 0) - r) - f * (n[1] - q)
          , l = f * (n[0] - p) - d * ((n[2] || 0) - r)
          , s = Vector.create([e * j - f * l, f * k - d * j, d * l - e * k])
          , t = this.distanceFrom(n) / s.modulus();
        return Vector.create([n[0] + s.elements[0] * t, n[1] + s.elements[1] * t, (n[2] || 0) + s.elements[2] * t])
    },
    rotate: function(a, b) {
        "undefined" == typeof b.direction && (b = Line.create(b.to3D(), Vector.k));
        var c = Matrix.Rotation(a, b.direction).elements
          , d = b.pointClosestTo(this.anchor).elements
          , e = this.anchor.elements
          , f = this.direction.elements
          , g = d[0]
          , h = d[1]
          , i = d[2]
          , j = e[0]
          , k = e[1]
          , l = e[2]
          , m = j - g
          , n = k - h
          , o = l - i;
        return Line.create([g + c[0][0] * m + c[0][1] * n + c[0][2] * o, h + c[1][0] * m + c[1][1] * n + c[1][2] * o, i + c[2][0] * m + c[2][1] * n + c[2][2] * o], [c[0][0] * f[0] + c[0][1] * f[1] + c[0][2] * f[2], c[1][0] * f[0] + c[1][1] * f[1] + c[1][2] * f[2], c[2][0] * f[0] + c[2][1] * f[1] + c[2][2] * f[2]])
    },
    reflectionIn: function(a) {
        if (a.normal) {
            var b = this.anchor.elements
              , c = this.direction.elements
              , d = b[0]
              , e = b[1]
              , f = b[2]
              , g = c[0]
              , h = c[1]
              , i = c[2]
              , j = this.anchor.reflectionIn(a).elements
              , k = d + g
              , l = e + h
              , m = f + i
              , n = a.pointClosestTo([k, l, m]).elements
              , o = [n[0] + (n[0] - k) - j[0], n[1] + (n[1] - l) - j[1], n[2] + (n[2] - m) - j[2]];
            return Line.create(j, o)
        }
        if (a.direction)
            return this.rotate(Math.PI, a);
        var p = a.elements || a;
        return Line.create(this.anchor.reflectionIn([p[0], p[1], p[2] || 0]), this.direction)
    },
    setVectors: function(a, b) {
        if (a = Vector.create(a),
        b = Vector.create(b),
        2 == a.elements.length && a.elements.push(0),
        2 == b.elements.length && b.elements.push(0),
        a.elements.length > 3 || b.elements.length > 3)
            return null;
        var c = b.modulus();
        return 0 === c ? null : (this.anchor = a,
        this.direction = Vector.create([b.elements[0] / c, b.elements[1] / c, b.elements[2] / c]),
        this)
    }
},
Line.create = function(a, b) {
    var c = new Line;
    return c.setVectors(a, b)
}
,
Line.X = Line.create(Vector.Zero(3), Vector.i),
Line.Y = Line.create(Vector.Zero(3), Vector.j),
Line.Z = Line.create(Vector.Zero(3), Vector.k),
Plane.prototype = {
    eql: function(a) {
        return this.contains(a.anchor) && this.isParallelTo(a)
    },
    dup: function() {
        return Plane.create(this.anchor, this.normal)
    },
    translate: function(a) {
        var b = a.elements || a;
        return Plane.create([this.anchor.elements[0] + b[0], this.anchor.elements[1] + b[1], this.anchor.elements[2] + (b[2] || 0)], this.normal)
    },
    isParallelTo: function(a) {
        var b;
        return a.normal ? (b = this.normal.angleFrom(a.normal),
        Math.abs(b) <= Sylvester.precision || Math.abs(Math.PI - b) <= Sylvester.precision) : a.direction ? this.normal.isPerpendicularTo(a.direction) : null
    },
    isPerpendicularTo: function(a) {
        var b = this.normal.angleFrom(a.normal);
        return Math.abs(Math.PI / 2 - b) <= Sylvester.precision
    },
    distanceFrom: function(a) {
        if (this.intersects(a) || this.contains(a))
            return 0;
        if (a.anchor) {
            var b = this.anchor.elements
              , c = a.anchor.elements
              , d = this.normal.elements;
            return Math.abs((b[0] - c[0]) * d[0] + (b[1] - c[1]) * d[1] + (b[2] - c[2]) * d[2])
        }
        var e = a.elements || a
          , b = this.anchor.elements
          , d = this.normal.elements;
        return Math.abs((b[0] - e[0]) * d[0] + (b[1] - e[1]) * d[1] + (b[2] - (e[2] || 0)) * d[2])
    },
    contains: function(a) {
        if (a.normal)
            return null;
        if (a.direction)
            return this.contains(a.anchor) && this.contains(a.anchor.add(a.direction));
        var b = a.elements || a
          , c = this.anchor.elements
          , d = this.normal.elements
          , e = Math.abs(d[0] * (c[0] - b[0]) + d[1] * (c[1] - b[1]) + d[2] * (c[2] - (b[2] || 0)));
        return e <= Sylvester.precision
    },
    intersects: function(a) {
        return "undefined" == typeof a.direction && "undefined" == typeof a.normal ? null : !this.isParallelTo(a)
    },
    intersectionWith: function(a) {
        if (!this.intersects(a))
            return null;
        if (a.direction) {
            var b = a.anchor.elements
              , c = a.direction.elements
              , d = this.anchor.elements
              , e = this.normal.elements
              , f = (e[0] * (d[0] - b[0]) + e[1] * (d[1] - b[1]) + e[2] * (d[2] - b[2])) / (e[0] * c[0] + e[1] * c[1] + e[2] * c[2]);
            return Vector.create([b[0] + c[0] * f, b[1] + c[1] * f, b[2] + c[2] * f])
        }
        if (a.normal) {
            for (var g = this.normal.cross(a.normal).toUnitVector(), e = this.normal.elements, b = this.anchor.elements, h = a.normal.elements, i = a.anchor.elements, j = Matrix.Zero(2, 2), k = 0; j.isSingular(); )
                k++,
                j = Matrix.create([[e[k % 3], e[(k + 1) % 3]], [h[k % 3], h[(k + 1) % 3]]]);
            for (var l = j.inverse().elements, m = e[0] * b[0] + e[1] * b[1] + e[2] * b[2], n = h[0] * i[0] + h[1] * i[1] + h[2] * i[2], o = [l[0][0] * m + l[0][1] * n, l[1][0] * m + l[1][1] * n], p = [], q = 1; 3 >= q; q++)
                p.push(k == q ? 0 : o[(q + (5 - k) % 3) % 3]);
            return Line.create(p, g)
        }
    },
    pointClosestTo: function(a) {
        var b = a.elements || a
          , c = this.anchor.elements
          , d = this.normal.elements
          , e = (c[0] - b[0]) * d[0] + (c[1] - b[1]) * d[1] + (c[2] - (b[2] || 0)) * d[2];
        return Vector.create([b[0] + d[0] * e, b[1] + d[1] * e, (b[2] || 0) + d[2] * e])
    },
    rotate: function(a, b) {
        var c = Matrix.Rotation(a, b.direction).elements
          , d = b.pointClosestTo(this.anchor).elements
          , e = this.anchor.elements
          , f = this.normal.elements
          , g = d[0]
          , h = d[1]
          , i = d[2]
          , j = e[0]
          , k = e[1]
          , l = e[2]
          , m = j - g
          , n = k - h
          , o = l - i;
        return Plane.create([g + c[0][0] * m + c[0][1] * n + c[0][2] * o, h + c[1][0] * m + c[1][1] * n + c[1][2] * o, i + c[2][0] * m + c[2][1] * n + c[2][2] * o], [c[0][0] * f[0] + c[0][1] * f[1] + c[0][2] * f[2], c[1][0] * f[0] + c[1][1] * f[1] + c[1][2] * f[2], c[2][0] * f[0] + c[2][1] * f[1] + c[2][2] * f[2]])
    },
    reflectionIn: function(a) {
        if (a.normal) {
            var b = this.anchor.elements
              , c = this.normal.elements
              , d = b[0]
              , e = b[1]
              , f = b[2]
              , g = c[0]
              , h = c[1]
              , i = c[2]
              , j = this.anchor.reflectionIn(a).elements
              , k = d + g
              , l = e + h
              , m = f + i
              , n = a.pointClosestTo([k, l, m]).elements
              , o = [n[0] + (n[0] - k) - j[0], n[1] + (n[1] - l) - j[1], n[2] + (n[2] - m) - j[2]];
            return Plane.create(j, o)
        }
        if (a.direction)
            return this.rotate(Math.PI, a);
        var p = a.elements || a;
        return Plane.create(this.anchor.reflectionIn([p[0], p[1], p[2] || 0]), this.normal)
    },
    setVectors: function(a, b, c) {
        if (a = Vector.create(a),
        a = a.to3D(),
        null === a)
            return null;
        if (b = Vector.create(b),
        b = b.to3D(),
        null === b)
            return null;
        if ("undefined" == typeof c)
            c = null;
        else if (c = Vector.create(c),
        c = c.to3D(),
        null === c)
            return null;
        var d, e, f = a.elements[0], g = a.elements[1], h = a.elements[2], i = b.elements[0], j = b.elements[1], k = b.elements[2];
        if (null !== c) {
            var l = c.elements[0]
              , m = c.elements[1]
              , n = c.elements[2];
            if (d = Vector.create([(j - g) * (n - h) - (k - h) * (m - g), (k - h) * (l - f) - (i - f) * (n - h), (i - f) * (m - g) - (j - g) * (l - f)]),
            e = d.modulus(),
            0 === e)
                return null;
            d = Vector.create([d.elements[0] / e, d.elements[1] / e, d.elements[2] / e])
        } else {
            if (e = Math.sqrt(i * i + j * j + k * k),
            0 === e)
                return null;
            d = Vector.create([b.elements[0] / e, b.elements[1] / e, b.elements[2] / e])
        }
        return this.anchor = a,
        this.normal = d,
        this
    }
},
Matrix.Translation = function(a) {
    var b;
    if (2 === a.elements.length)
        return b = Matrix.I(3),
        b.elements[2][0] = a.elements[0],
        b.elements[2][1] = a.elements[1],
        b;
    if (3 === a.elements.length)
        return b = Matrix.I(4),
        b.elements[0][3] = a.elements[0],
        b.elements[1][3] = a.elements[1],
        b.elements[2][3] = a.elements[2],
        b;
    throw "Invalid length for Translation"
}
,
Matrix.prototype.flatten = function() {
    var a = [];
    if (0 === this.elements.length)
        return [];
    for (var b = 0; b < this.elements[0].length; b++)
        for (var c = 0; c < this.elements.length; c++)
            a.push(this.elements[c][b]);
    return a
}
,
Matrix.prototype.ensure4x4 = function() {
    var a;
    if (4 === this.elements.length && 4 === this.elements[0].length)
        return this;
    if (this.elements.length > 4 || this.elements[0].length > 4)
        return null;
    for (a = 0; a < this.elements.length; a++)
        for (var b = this.elements[a].length; 4 > b; b++)
            this.elements[a].push(a === b ? 1 : 0);
    for (a = this.elements.length; 4 > a; a++)
        0 === a ? this.elements.push([1, 0, 0, 0]) : 1 === a ? this.elements.push([0, 1, 0, 0]) : 2 === a ? this.elements.push([0, 0, 1, 0]) : 3 === a && this.elements.push([0, 0, 0, 1]);
    return this
}
,
Matrix.prototype.make3x3 = function() {
    return 4 !== this.elements.length || 4 !== this.elements[0].length ? null : Matrix.create([[this.elements[0][0], this.elements[0][1], this.elements[0][2]], [this.elements[1][0], this.elements[1][1], this.elements[1][2]], [this.elements[2][0], this.elements[2][1], this.elements[2][2]]])
}
,
Plane.create = function(a, b, c) {
    var d = new Plane;
    return d.setVectors(a, b, c)
}
,
Plane.XY = Plane.create(Vector.Zero(3), Vector.k),
Plane.YZ = Plane.create(Vector.Zero(3), Vector.i),
Plane.ZX = Plane.create(Vector.Zero(3), Vector.j),
Plane.YX = Plane.XY,
Plane.ZY = Plane.YZ,
Plane.XZ = Plane.ZX;

var $V = Vector.create
  , $M = Matrix.create
  , $L = Line.create
  , $P = Plane.create;
