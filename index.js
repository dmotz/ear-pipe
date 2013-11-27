/*!
 * ear-pipe
 * Pipe audio streams to your ears
 * Dan Motzenbecker <dan@oxism.com>
 * MIT Licensed
 */

"use strict";

var spawn  = require('child_process').spawn,
    util   = require('util'),
    Duplex = require('stream').Duplex,
    apply  = function(obj, method, args) {
      return obj[method].apply(obj, args);
    }


var EarPipe = function(type, bits, transcode) {
  var params;

  if (!(this instanceof EarPipe)) {
    return new EarPipe(type, bits, transcode);
  }

  Duplex.apply(this);
  params = ['-q', '-b', bits || 16, '-t', type || 'mp3', '-'];

  if (transcode) {
    this.process = spawn('sox',
      params.concat(['-t', typeof transcode === 'string' ? transcode : 'wav', '-']));
  } else {
    this.process = spawn('play', params);
  }

}

util.inherits(EarPipe, Duplex);

EarPipe.prototype._read = function() {
  return apply(this.process.stdout, 'read', arguments);
}

EarPipe.prototype._write = function() {
  return apply(this.process.stdin, 'write', arguments);
}

EarPipe.prototype.pipe = function() {
  return apply(this.process.stdout, 'pipe', arguments);
}

EarPipe.prototype.end = function() {
  return apply(this.process.stdin, 'end', arguments);
}

EarPipe.prototype.kill = function() {
  return apply(this.process, 'kill', arguments);
}

module.exports = EarPipe;

