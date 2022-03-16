
varying vec2 vCoordinates;
varying float vSpeed;

uniform sampler2D photo;
uniform sampler2D mask;
uniform vec2 camvasSize;
uniform float transition;

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}


void main(){

  

    vec4 maskTexture = texture2D(mask, gl_PointCoord);
    vec2 myUV = vec2(vCoordinates.x/camvasSize.x, vCoordinates.y/camvasSize.y );
    
    vec3 color = hsb2rgb(vec3(0.45 + (vSpeed * 0.04),0.3 * vSpeed,0.8 * vSpeed));

    vec4 final1 =  vec4(color , 0.2 * vSpeed) * maskTexture;
    vec4 final2 = vec4(maskTexture);
    vec4 final3 = mix(final1,final2, transition);

    gl_FragColor =   final3; 

    gl_FragColor.a *= mix(maskTexture.a, (maskTexture.a + (vSpeed *0.5)) * 0.5, transition); 



}