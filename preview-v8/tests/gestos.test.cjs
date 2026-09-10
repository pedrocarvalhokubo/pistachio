const assert=require('node:assert/strict'),{Stroke,inMouth}=require('../assets/gestos.js');
const tap=new Stroke();tap.start(.5,.5);tap.end();assert.equal(tap.complete,false);
const still=new Stroke();still.start(.5,.5);for(let i=0;i<100;i++)still.move(.5,.5);assert.equal(still.complete,false);
const stroke=new Stroke();stroke.start(.2,.5);for(let i=0;i<14;i++)stroke.move(i%2?.2:.4,.5);assert(stroke.complete);
const outside=new Stroke();outside.start(.2,.5);for(let i=0;i<20;i++)outside.move(i%2?.2:.4,.5,false);assert.equal(outside.complete,false);
assert(inMouth(.5,.6));assert(!inMouth(.1,.2));assert(!inMouth(.5,.85));
console.log('PASS: tap, stationary touch, real stroke, outside touch and mouth hit area');
