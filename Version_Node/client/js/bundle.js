(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var sph = new (require('sphericalmercator'))(),

    geojsonExtent = require('geojson-extent');



function $(_) {

    return document.getElementById(_);

}



$('compute').addEventListener('click', function() {



    var ext = geojsonExtent(JSON.parse($('geojson').value));

    var min = +$('low-zoom').value;

    var max = +$('high-zoom').value;

    var sum = 0;



    for (var i = min; i < max; i++) {

        var b = sph.xyz(ext, i);

        sum += (b.maxX - b.minX) * (b.maxY - b.minY);

    }



    $('count').innerHTML = sum;

});



},{"geojson-extent":2,"sphericalmercator":8}],2:[function(require,module,exports){

var geojsonCoords = require('geojson-coords'),

    extent = require('extent');



module.exports = function(_) {

    var bbox = [Infinity, Infinity, -Infinity, -Infinity],

        ext = extent(),

        coords = geojsonCoords(_);

    for (var i = 0; i < coords.length; i++) ext.include(coords[i]);

    return ext.bbox();

};



},{"extent":3,"geojson-coords":5}],3:[function(require,module,exports){

module.exports = Extent;



function Extent() {

    if (!(this instanceof Extent)) {

        return new Extent();

    }

    this._bbox = [Infinity, Infinity, -Infinity, -Infinity];

    this._valid = false;

}



Extent.prototype.include = function(ll) {

    this._valid = true;

    this._bbox[0] = Math.min(this._bbox[0], ll[0]);

    this._bbox[1] = Math.min(this._bbox[1], ll[1]);

    this._bbox[2] = Math.max(this._bbox[2], ll[0]);

    this._bbox[3] = Math.max(this._bbox[3], ll[1]);

    return this;

};



Extent.prototype.union = function(other) {

    this._valid = true;

    this._bbox[0] = Math.min(this._bbox[0], other[0]);

    this._bbox[1] = Math.min(this._bbox[1], other[1]);

    this._bbox[2] = Math.max(this._bbox[2], other[2]);

    this._bbox[3] = Math.max(this._bbox[3], other[3]);

    return this;

};



Extent.prototype.bbox = function() {

    if (!this._valid) return null;

    return this._bbox;

};



},{}],4:[function(require,module,exports){

module.exports = function flatten(list, depth) {

    return _flatten(list);



    function _flatten(list) {

        if (Array.isArray(list) && list.length &&

            typeof list[0] === 'number') {

            return [list];

        }

        return list.reduce(function (acc, item) {

            if (Array.isArray(item) && Array.isArray(item[0])) {

                return acc.concat(_flatten(item));

            } else {

                acc.push(item);

                return acc;

            }

        }, []);

    }

};



},{}],5:[function(require,module,exports){

var geojsonNormalize = require('geojson-normalize'),

    geojsonFlatten = require('geojson-flatten'),

    flatten = require('./flatten');



module.exports = function(_) {

    if (!_) return [];

    var normalized = geojsonFlatten(geojsonNormalize(_)),

        coordinates = [];

    normalized.features.forEach(function(feature) {

        if (!feature.geometry) return;

        coordinates = coordinates.concat(flatten(feature.geometry.coordinates));

    });

    return coordinates;

};



},{"./flatten":4,"geojson-flatten":6,"geojson-normalize":7}],6:[function(require,module,exports){

module.exports = flatten;



function flatten(gj, up) {

    switch ((gj && gj.type) || null) {

        case 'FeatureCollection':

            gj.features = gj.features.reduce(function(mem, feature) {

                return mem.concat(flatten(feature));

            }, []);

            return gj;

        case 'Feature':

            return flatten(gj.geometry).map(function(geom) {

                return {

                    type: 'Feature',

                    properties: JSON.parse(JSON.stringify(gj.properties)),

                    geometry: geom

                };

            });

        case 'MultiPoint':

            return gj.coordinates.map(function(_) {

                return { type: 'Point', coordinates: _ };

            });

        case 'MultiPolygon':

            return gj.coordinates.map(function(_) {

                return { type: 'Polygon', coordinates: _ };

            });

        case 'MultiLineString':

            return gj.coordinates.map(function(_) {

                return { type: 'LineString', coordinates: _ };

            });

        case 'GeometryCollection':

            return gj.geometries;

        case 'Point':

        case 'Polygon':

        case 'LineString':

            return [gj];

        default:

            return gj;

    }

}



},{}],7:[function(require,module,exports){

module.exports = normalize;



var types = {

    Point: 'geometry',

    MultiPoint: 'geometry',

    LineString: 'geometry',

    MultiLineString: 'geometry',

    Polygon: 'geometry',

    MultiPolygon: 'geometry',

    GeometryCollection: 'geometry',

    Feature: 'feature',

    FeatureCollection: 'featurecollection'

};



/**

 * Normalize a GeoJSON feature into a FeatureCollection.

 *

 * @param {object} gj geojson data

 * @returns {object} normalized geojson data

 */

function normalize(gj) {

    if (!gj || !gj.type) return null;

    var type = types[gj.type];

    if (!type) return null;



    if (type === 'geometry') {

        return {

            type: 'FeatureCollection',

            features: [{

                type: 'Feature',

                properties: {},

                geometry: gj

            }]

        };

    } else if (type === 'feature') {

        return {

            type: 'FeatureCollection',

            features: [gj]

        };

    } else if (type === 'featurecollection') {

        return gj;

    }

}



},{}],8:[function(require,module,exports){

var SphericalMercator = (function(){



// Closures including constants and other precalculated values.

var cache = {},

    EPSLN = 1.0e-10,

    D2R = Math.PI / 180,

    R2D = 180 / Math.PI,

    // 900913 properties.

    A = 6378137,

    MAXEXTENT = 20037508.34;





// SphericalMercator constructor: precaches calculations

// for fast tile lookups.

function SphericalMercator(options) {

    options = options || {};

    this.size = options.size || 256;

    if (!cache[this.size]) {

        var size = this.size;

        var c = cache[this.size] = {};

        c.Bc = [];

        c.Cc = [];

        c.zc = [];

        c.Ac = [];

        for (var d = 0; d < 30; d++) {

            c.Bc.push(size / 360);

            c.Cc.push(size / (2 * Math.PI));

            c.zc.push(size / 2);

            c.Ac.push(size);

            size *= 2;

        }

    }

    this.Bc = cache[this.size].Bc;

    this.Cc = cache[this.size].Cc;

    this.zc = cache[this.size].zc;

    this.Ac = cache[this.size].Ac;

};



// Convert lon lat to screen pixel value

//

// - `ll` {Array} `[lon, lat]` array of geographic coordinates.

// - `zoom` {Number} zoom level.

SphericalMercator.prototype.px = function(ll, zoom) {

    var d = this.zc[zoom];

    var f = Math.min(Math.max(Math.sin(D2R * ll[1]), -0.9999), 0.9999);

    var x = Math.round(d + ll[0] * this.Bc[zoom]);

    var y = Math.round(d + 0.5 * Math.log((1 + f) / (1 - f)) * (-this.Cc[zoom]));

    (x > this.Ac[zoom]) && (x = this.Ac[zoom]);

    (y > this.Ac[zoom]) && (y = this.Ac[zoom]);

    //(x < 0) && (x = 0);

    //(y < 0) && (y = 0);

    return [x, y];

};



// Convert screen pixel value to lon lat

//

// - `px` {Array} `[x, y]` array of geographic coordinates.

// - `zoom` {Number} zoom level.

SphericalMercator.prototype.ll = function(px, zoom) {

    var g = (px[1] - this.zc[zoom]) / (-this.Cc[zoom]);

    var lon = (px[0] - this.zc[zoom]) / this.Bc[zoom];

    var lat = R2D * (2 * Math.atan(Math.exp(g)) - 0.5 * Math.PI);

    return [lon, lat];

};



// Convert tile xyz value to bbox of the form `[w, s, e, n]`

//

// - `x` {Number} x (longitude) number.

// - `y` {Number} y (latitude) number.

// - `zoom` {Number} zoom.

// - `tms_style` {Boolean} whether to compute using tms-style.

// - `srs` {String} projection for resulting bbox (WGS84|900913).

// - `return` {Array} bbox array of values in form `[w, s, e, n]`.

SphericalMercator.prototype.bbox = function(x, y, zoom, tms_style, srs) {

    // Convert xyz into bbox with srs WGS84

    if (tms_style) {

        y = (Math.pow(2, zoom) - 1) - y;

    }

    // Use +y to make sure it's a number to avoid inadvertent concatenation.

    var ll = [x * this.size, (+y + 1) * this.size]; // lower left

    // Use +x to make sure it's a number to avoid inadvertent concatenation.

    var ur = [(+x + 1) * this.size, y * this.size]; // upper right

    var bbox = this.ll(ll, zoom).concat(this.ll(ur, zoom));



    // If web mercator requested reproject to 900913.

    if (srs === '900913') {

        return this.convert(bbox, '900913');

    } else {

        return bbox;

    }

};



// Convert bbox to xyx bounds

//

// - `bbox` {Number} bbox in the form `[w, s, e, n]`.

// - `zoom` {Number} zoom.

// - `tms_style` {Boolean} whether to compute using tms-style.

// - `srs` {String} projection of input bbox (WGS84|900913).

// - `@return` {Object} XYZ bounds containing minX, maxX, minY, maxY properties.

SphericalMercator.prototype.xyz = function(bbox, zoom, tms_style, srs) {

    // If web mercator provided reproject to WGS84.

    if (srs === '900913') {

        bbox = this.convert(bbox, 'WGS84');

    }



    var ll = [bbox[0], bbox[1]]; // lower left

    var ur = [bbox[2], bbox[3]]; // upper right

    var px_ll = this.px(ll, zoom);

    var px_ur = this.px(ur, zoom);

    // Y = 0 for XYZ is the top hence minY uses px_ur[1].

    var bounds = {

        minX: Math.floor(px_ll[0] / this.size),

        minY: Math.floor(px_ur[1] / this.size),

        maxX: Math.floor((px_ur[0] - 1) / this.size),

        maxY: Math.floor((px_ll[1] - 1) / this.size)

    };

    if (tms_style) {

        var tms = {

            minY: (Math.pow(2, zoom) - 1) - bounds.maxY,

            maxY: (Math.pow(2, zoom) - 1) - bounds.minY

        };

        bounds.minY = tms.minY;

        bounds.maxY = tms.maxY;

    }

    return bounds;

};



// Convert projection of given bbox.

//

// - `bbox` {Number} bbox in the form `[w, s, e, n]`.

// - `to` {String} projection of output bbox (WGS84|900913). Input bbox

//   assumed to be the "other" projection.

// - `@return` {Object} bbox with reprojected coordinates.

SphericalMercator.prototype.convert = function(bbox, to) {

    if (to === '900913') {

        return this.forward(bbox.slice(0, 2)).concat(this.forward(bbox.slice(2,4)));

    } else {

        return this.inverse(bbox.slice(0, 2)).concat(this.inverse(bbox.slice(2,4)));

    }

};



// Convert lon/lat values to 900913 x/y.

SphericalMercator.prototype.forward = function(ll) {

    var xy = [

        A * ll[0] * D2R,

        A * Math.log(Math.tan((Math.PI*0.25) + (0.5 * ll[1] * D2R)))

    ];

    // if xy value is beyond maxextent (e.g. poles), return maxextent.

    (xy[0] > MAXEXTENT) && (xy[0] = MAXEXTENT);

    (xy[0] < -MAXEXTENT) && (xy[0] = -MAXEXTENT);

    (xy[1] > MAXEXTENT) && (xy[1] = MAXEXTENT);

    (xy[1] < -MAXEXTENT) && (xy[1] = -MAXEXTENT);

    return xy;

};



// Convert 900913 x/y values to lon/lat.

SphericalMercator.prototype.inverse = function(xy) {

    return [

        (xy[0] * R2D / A),

        ((Math.PI*0.5) - 2.0 * Math.atan(Math.exp(-xy[1] / A))) * R2D

    ];

};



return SphericalMercator;



})();



if (typeof module !== 'undefined' && typeof exports !== 'undefined') {

    module.exports = exports = SphericalMercator;

}



},{}]},{},[1])