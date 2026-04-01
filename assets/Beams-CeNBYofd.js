import{a as u,j as f}from"./framer-t3pljeEb.js";import{C,M as $,P as R,S as E,U as F,a as A,b as B,u as O,B as U,c as z}from"./three-vendor-BVYI4v6T.js";const D=Math.PI/180;function k(t){return t*D}function G(t,e){var l;const o=E.physical,{vertexShader:r,fragmentShader:a,uniforms:s}=o,g=o.defines??{},i=F.clone(s),n=new t(e.material||{});n.color&&(i.diffuse.value=n.color),"roughness"in n&&(i.roughness.value=n.roughness),"metalness"in n&&(i.metalness.value=n.metalness),"envMapIntensity"in n&&(i.envMapIntensity.value=n.envMapIntensity),Object.entries(e.uniforms??{}).forEach(([v,c])=>{i[v]=c!==null&&typeof c=="object"&&"value"in c?c:{value:c}});let x=`${e.header}
${e.vertexHeader??""}
${r}`,m=`${e.header}
${e.fragmentHeader??""}
${a}`;for(const[v,c]of Object.entries(e.vertex??{}))x=x.replace(v,`${v}
${c}`);for(const[v,c]of Object.entries(e.fragment??{}))m=m.replace(v,`${v}
${c}`);return new A({defines:{...g},uniforms:i,vertexShader:x,fragmentShader:m,lights:!0,fog:!!((l=e.material)!=null&&l.fog)})}const H=`
float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
float cnoise(vec3 P){
  vec3 Pi0 = floor(P); vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0); Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz; vec4 iz1 = Pi1.zzzz;
  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0); vec4 ixy1 = permute(ixy + iz1);
  vec4 gx0 = ixy0 / 7.0; vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5); gy0 -= sz0 * (step(0.0, gy0) - 0.5);
  vec4 gx1 = ixy1 / 7.0; vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5); gy1 -= sz1 * (step(0.0, gy1) - 0.5);
  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x); vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z); vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x); vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z); vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
  vec4 norm0 = taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
  g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
  g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;
  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x,Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x,Pf1.y,Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy,Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy,Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x,Pf0.y,Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x,Pf1.yz));
  float n111 = dot(g111, Pf1);
  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);
  vec2 n_yz = mix(n_z.xy,n_z.zw,fade_xyz.y);
  float n_xyz = mix(n_yz.x,n_yz.y,fade_xyz.x);
  return 2.2 * n_xyz;
}
`,L=t=>{const e=t.replace("#","");return[parseInt(e.slice(0,2),16)/255,parseInt(e.slice(2,4),16)/255,parseInt(e.slice(4,6),16)/255]},q=({children:t})=>f.jsx(B,{dpr:[1,2],frameloop:"always",className:"beams-canvas",children:t});function V(t,e,o,r,a){const s=new U,g=t*(a+1)*2,i=t*a*2,n=new Float32Array(g*3),x=new Uint32Array(i*3),m=new Float32Array(g*2);let l=0,v=0,c=0;const S=-(t*e+(t-1)*r)/2;for(let y=0;y<t;y++){const P=S+y*(e+r),p=Math.random()*300,h=Math.random()*300;for(let d=0;d<=a;d++){const b=o*(d/a-.5);if(n.set([P,b,0,P+e,b,0],l*3),m.set([p,d/a+h,p+1,d/a+h],c),d<a){const I=l,w=l+1,j=l+2,N=l+3;x.set([I,w,j,j,w,N],v),v+=6}l+=2,c+=4}}return s.setAttribute("position",new z(n,3)),s.setAttribute("uv",new z(m,2)),s.setIndex(new z(x,1)),s.computeVertexNormals(),s}const _=u.forwardRef(({material:t,width:e,count:o,height:r},a)=>{const s=u.useRef(null);u.useImperativeHandle(a,()=>s.current);const g=u.useMemo(()=>V(o,e,r,0,100),[o,e,r]);return O((i,n)=>{s.current.material.uniforms.time.value+=.1*n}),f.jsx("mesh",{ref:s,geometry:g,material:t})});_.displayName="MergedPlanes";const M=u.forwardRef((t,e)=>f.jsx(_,{ref:e,material:t.material,width:t.width,count:t.count,height:t.height}));M.displayName="PlaneNoise";const W=({position:t,color:e})=>{const o=u.useRef(null);return u.useEffect(()=>{if(!o.current)return;const r=o.current.shadow.camera;r&&(r.top=24,r.bottom=-24,r.left=-24,r.right=24,r.far=64,o.current.shadow.bias=-.004)},[]),f.jsx("directionalLight",{ref:o,color:e,intensity:1,position:t})};function J({beamWidth:t=2,beamHeight:e=15,beamNumber:o=12,lightColor:r="#B19EEF",speed:a=2,noiseIntensity:s=1.75,scale:g=.2,rotation:i=30}){const n=u.useRef(null),x=u.useMemo(()=>G($,{header:`
varying vec3 vEye; varying float vNoise; varying vec2 vUv; varying vec3 vPosition;
uniform float time; uniform float uSpeed; uniform float uNoiseIntensity; uniform float uScale;
${H}`,vertexHeader:`
float getPos(vec3 pos) {
  vec3 noisePos = vec3(pos.x * 0., pos.y - uv.y, pos.z + time * uSpeed * 3.) * uScale;
  return cnoise(noisePos);
}
vec3 getCurrentPos(vec3 pos) { vec3 n = pos; n.z += getPos(pos); return n; }
vec3 getNormal(vec3 pos) {
  vec3 cur = getCurrentPos(pos);
  vec3 nx = getCurrentPos(pos + vec3(0.01, 0.0, 0.0));
  vec3 nz = getCurrentPos(pos + vec3(0.0, -0.01, 0.0));
  return normalize(cross(normalize(nz - cur), normalize(nx - cur)));
}`,vertex:{"#include <begin_vertex>":"transformed.z += getPos(transformed.xyz);","#include <beginnormal_vertex>":"objectNormal = getNormal(position.xyz);"},fragment:{"#include <dithering_fragment>":`
float randomNoise = noise(gl_FragCoord.xy);
gl_FragColor.rgb -= randomNoise / 15. * uNoiseIntensity;`},material:{fog:!0},uniforms:{diffuse:new C(...L("#000000")),time:{shared:!0,mixed:!0,linked:!0,value:0},roughness:.3,metalness:.3,uSpeed:{shared:!0,mixed:!0,linked:!0,value:a},envMapIntensity:10,uNoiseIntensity:s,uScale:g}}),[a,s,g]);return f.jsxs(q,{children:[f.jsxs("group",{rotation:[0,0,k(i)],children:[f.jsx(M,{ref:n,material:x,count:o,width:t,height:e}),f.jsx(W,{color:r,position:[0,3,10]})]}),f.jsx("ambientLight",{intensity:1}),f.jsx("color",{attach:"background",args:["#000000"]}),f.jsx(R,{makeDefault:!0,position:[0,0,20],fov:35})]})}export{J as default};
