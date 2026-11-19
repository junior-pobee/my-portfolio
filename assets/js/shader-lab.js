const canvas=document.getElementById("shaderCanvas");
const status=document.getElementById("shaderStatus");
if(canvas){
  const gl=canvas.getContext("webgl",{alpha:false,antialias:false,powerPreference:"low-power"});
  if(!gl){if(status)status.textContent="WebGL is not supported on this device."}
  else{
    const vertex="attribute vec2 position;void main(){gl_Position=vec4(position,0.0,1.0);}";
    const fragment="precision mediump float;uniform vec2 resolution;uniform float time;void main(){vec2 uv=(gl_FragCoord.xy-.5*resolution)/min(resolution.x,resolution.y);float r=length(uv);float a=atan(uv.y,uv.x);float wave=sin(a*3.0+time*.42+r*8.0)*.5+.5;float glow=exp(-r*2.8);float pulse=.5+.5*sin(time*.35-r*5.0);vec3 deep=vec3(.018,.055,.12);vec3 cyan=vec3(.12,.72,.88);vec3 violet=vec3(.38,.22,.78);vec3 color=mix(deep,cyan,glow*wave*.72);color=mix(color,violet,glow*pulse*.42);color+=.025*(sin(vec3(1.0,2.0,3.0)+time+r*9.0)+1.0);gl_FragColor=vec4(color,1.0);}";
    const compile=(type,source)=>{const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader)||"Shader compilation failed");return shader};
    try{
      const program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error("Shader link failed");gl.useProgram(program);
      const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
      const location=gl.getAttribLocation(program,"position");gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,2,gl.FLOAT,false,0,0);
      const resolution=gl.getUniformLocation(program,"resolution"),time=gl.getUniformLocation(program,"time");
      const reduced=matchMedia("(prefers-reduced-motion: reduce)");let frame=0,last=0,started=performance.now(),visible=false;
      function resize(){const rect=canvas.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,1);const width=Math.max(1,Math.floor(rect.width*ratio)),height=Math.max(1,Math.floor(rect.height*ratio));if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;gl.viewport(0,0,width,height)}}
      function draw(now){frame=0;if(!visible||document.hidden)return;if(!reduced.matches&&now-last<1000/24){frame=requestAnimationFrame(draw);return}last=now;resize();gl.uniform2f(resolution,canvas.width,canvas.height);gl.uniform1f(time,reduced.matches?0:(now-started)/1000);gl.drawArrays(gl.TRIANGLES,0,6);if(!reduced.matches)frame=requestAnimationFrame(draw)}
      function start(){if(visible&&!document.hidden&&!frame){if(status)status.textContent=reduced.matches?"Static shader preview":"WebGL shader running";frame=requestAnimationFrame(draw)}}
      function stop(){if(frame)cancelAnimationFrame(frame);frame=0}
      const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else stop()},{threshold:.05});observer.observe(canvas);
      document.addEventListener("visibilitychange",()=>document.hidden?stop():start());
      reduced.addEventListener("change",()=>{stop();started=performance.now();start()});
      new ResizeObserver(()=>{resize();if(visible)draw(performance.now())}).observe(canvas);
      resize();start();
      if(status)status.textContent="WebGL shader ready";
    }catch(error){if(status)status.textContent="Shader error: "+String(error.message).slice(0,80)}
  }
}
