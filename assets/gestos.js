/* Gesture progress depends on movement, never on a tap. Shared with regression tests. */
(function(root){
class Stroke {
 constructor(target=1.8){this.target=target;this.distance=0;this.moves=0;this.last=null;}
 start(x,y){this.last={x,y};}
 move(x,y,inside=true){if(!this.last){this.start(x,y);return false;}const d=Math.hypot(x-this.last.x,y-this.last.y);this.last={x,y};if(inside&&d>.005&&d<.45){this.distance+=d;this.moves++;}return this.complete;}
 end(){this.last=null;}
 get complete(){return this.moves>=6&&this.distance>=this.target;}
 get progress(){return Math.min(1,this.distance/this.target);}
}
function inMouth(x,y){return x>=.30&&x<=.70&&y>=.45&&y<=.73;}
const api={Stroke,inMouth};if(typeof module!=='undefined')module.exports=api;else root.PistachioGestures=api;
})(typeof globalThis!=='undefined'?globalThis:this);
