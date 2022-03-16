
varying vec2 vUv;
varying vec2 vCoordinates;
varying float vSpeed;


attribute vec3 aCoordinates;
attribute float aSize;
attribute float aSpeed;


uniform vec2 camvasSize;


void main() {
  vUv = uv;

  vec4 mvPosition = modelViewMatrix * vec4( position, 1. );
  gl_PointSize =  aSize * ( 1. / - mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;

  vCoordinates = aCoordinates.xy;
  vSpeed  = aSpeed;
  
}
