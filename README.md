# ear-pipe
#### Pipe audio streams to your ears
[Dan Motzenbecker](http://oxism.com), MIT License

[@dcmotz](http://twitter.com/dcmotz)

### Concept

ear-pipe is a duplex stream that allows you to pipe any streaming audio data to
your ears (by default), handling any decoding automatically for most formats.
You can also leverage this built-in decoding by specifying an output encoding
and pipe the output stream somewhere else.


### Installation
ear-pipe relies on the cross-platform audio utility
[SoX](http://sox.sourceforge.net), so make sure that's installed first.

```
$ npm install --save ear-pipe
```


### Usage

```javascript
var EarPipe = require('ear-pipe'),
    ep      = new EarPipe(/* <type>, <bitrate>, <transcode-type> */);

```

When arguments are omitted (e.g. `ep = new EarPipe;`), the type defaults to
`'mp3'`, the bitrate defaults to `16`, and the third argument is `null` indicating
that the pipe destination is your ears rather than a transcoded stream.

If your input encoding isn't mp3, make sure you set it to one of the formats
supported by SoX:

```
8svx aif aifc aiff aiffc al amb au avr cdda cdr cvs cvsd cvu dat dvms f32 f4 f64
f8 fssd gsm gsrt hcom htk ima ircam la lpc lpc10 lu maud mp2 mp3 nist prc raw s1
s16 s2 s24 s3 s32 s4 s8 sb sf sl sln smp snd sndr sndt sou sox sph sw txw u1 u16
u2 u24 u3 u32 u4 u8 ub ul uw vms voc vox wav wavpcm wve xa
```


### Examples

#### HTTP Stream

Let's pipe some [number station](http://en.wikipedia.org/wiki/Number_stations)
audio to our ears right as it comes off the wire:

```javascript
http.get(
  'http://ia700500.us.archive.org/12/items/ird059/tcp_d1_06_the_lincolnshire_poacher_mi5_irdial.mp3',
  function(res) { res.pipe(new EarPipe) });
```
If your connection and speakers work, you should hear it as it downloads.

#### Nondeterministic DJ Set

Let's send multiple audio streams to the same ear-pipe:

```javascript
var ep      = new EarPipe,
    telstar = fs.createReadStream('./telstar.mp3'),
    cream   = fs.createReadStream('./cream.mp3');

http.get('http://127.0.0.1/sirens.mp3', function(res) { res.pipe(ep) });
telstar.pipe(ep);
cream.pipe(ep);
```

Since only one chunk passes through at a time, this DJ set should have plenty of cuts.


#### Transcode

Since we're decoding the audio on the fly, we can specify that we'd like to use
that output for another destination besides our ears:

```javascript
// null arguments mean defaults, true implies default output encoding (wav)
var ep    = new EarPipe(null, null, true),
    hotel = fs.createReadStream('./hotel.mp3');

hotel.pipe(ep).pipe(fs.createWriteStream('./hotel.wav'));

```

Or pipe to another process:

```javascript
var ep      = new EarPipe('wav'),
    epTrans = new EarPipe(null, null, true),
    audio   = someStreamingNetworkData();

audio.pipe(epTrans).pipe(ep);
epTrans.pipe(anotherStreamingAudioConsumer);

```

### Killing

Kill an ear-pipe instance by calling its `kill()` method. If you're interested
in the underlying SoX process, access an instance's `.process` property.

