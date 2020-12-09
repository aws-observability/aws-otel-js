'use strict';

const execSync = require('child_process').execSync;
const exec = cmd => execSync(cmd, { stdio: [0, 1, 2] });

exec('node benchmark/AWSXRayidgenerator.js');
exec('node benchmark/AWSXRaypropagator.js');
exec('node benchmark/tracer.js');