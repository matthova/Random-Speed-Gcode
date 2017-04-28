const LineByLineReader = require('line-by-line');
const fs = require('fs');
const GcodeObject = require('gcode-json-converter');

const fMin = 200;  // Min speed
const fMax = 8000; // Max speed

// Input file
const lr = new LineByLineReader('cylinder.gcode'); 

// Output file
const wstream = fs.createWriteStream('cylinyder-out.gcode'); 

lr.on('error', function (err) {
  console.log('oh no', err);
});

lr.on('line', function (line) {
  const obj = new GcodeObject(line);
  // If we're extruding, then give it a random speed
  if (obj.command === 'G1' && obj.args.e) {
    const speed = parseInt(Math.random() * (fMax - fMin) + fMin, 10);
    obj.args.f = speed;
    wstream.write(obj.toGcode());
  } else {
    wstream.write(line);
  }
  wstream.write('\n');
});

lr.on('end', function () {
  wstream.end();
});
