const section=document.getElementById("buildlab");
const reactRoot=document.getElementById("reactLabRoot");
const reactStatus=document.getElementById("reactLabStatus");
const shaderCanvas=document.getElementById("shaderCanvas");
let modulesStarted=false;
async function loadModules(){
  if(modulesStarted)return;
  modulesStarted=true;
  const tasks=[];
  if(reactRoot)tasks.push(import("./react-lab.js").then(()=>{if(reactStatus)reactStatus.textContent="React component mounted successfully."}).catch(()=>{if(reactRoot)reactRoot.innerHTML="<p class=\"lab-loading\">The React demo could not load. Check your internet connection and refresh.</p>";if(reactStatus)reactStatus.textContent="React module unavailable."}));
  if(shaderCanvas)tasks.push(import("./shader-lab.js").catch(()=>{const status=document.getElementById("shaderStatus");if(status)status.textContent="WebGL shader unavailable in this browser."}));
  await Promise.allSettled(tasks);
}
if(section&&"IntersectionObserver"in window){
  const moduleObserver=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){loadModules();moduleObserver.disconnect()}},{rootMargin:"180px"});
  moduleObserver.observe(section);
}else loadModules();

const pythonRunButton=document.getElementById("runPython");
let pythonModulePromise;
function loadPythonModule(){if(!pythonModulePromise)pythonModulePromise=import("./python-lab.js");return pythonModulePromise}
pythonRunButton?.addEventListener("click",()=>loadPythonModule().then(module=>module.runPython()).catch(error=>{const output=document.getElementById("pythonOutput");const status=document.getElementById("pythonStatus");if(output)output.textContent=String(error);if(status)status.textContent="Python module failed to load"}),{once:true});
document.getElementById("resetPython")?.addEventListener("click",()=>loadPythonModule().then(module=>module.resetPython()).catch(()=>{}),{once:true});

const typeScriptRunButton=document.getElementById("runTypeScript");
let typeScriptModulePromise;
function loadTypeScriptModule(){if(!typeScriptModulePromise)typeScriptModulePromise=import("./typescript-lab.js");return typeScriptModulePromise}
typeScriptRunButton?.addEventListener("click",()=>loadTypeScriptModule().then(module=>module.runTypeScript()).catch(error=>{const output=document.getElementById("typeScriptOutput");const status=document.getElementById("typeScriptStatus");if(output)output.textContent=String(error);if(status)status.textContent="TypeScript compiler failed to load"}),{once:true});
document.getElementById("resetTypeScript")?.addEventListener("click",()=>loadTypeScriptModule().then(module=>module.resetTypeScript()).catch(()=>{}),{once:true});

const htmlEditor=document.getElementById("playgroundHtml");
const cssEditor=document.getElementById("playgroundCss");
const jsEditor=document.getElementById("playgroundJs");
const preview=document.getElementById("playgroundPreview");
const runButton=document.getElementById("runPlayground");
const resetButton=document.getElementById("resetPlayground");
const previewStatus=document.getElementById("previewStatus");
const defaults={html:htmlEditor?.value||"",css:cssEditor?.value||"",js:jsEditor?.value||""};
function runPreview(){
  if(!preview||!htmlEditor||!cssEditor||!jsEditor)return;
  const safeCss=cssEditor.value.replace(/<\/style/gi,"<\\/style");
  const safeJs=jsEditor.value.replace(/<\/script/gi,"<\\/script");
  const source="<!doctype html><html><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><style>"+safeCss+"</style></head><body>"+htmlEditor.value+"<script>window.addEventListener('error',function(event){parent.postMessage({type:'portfolio-playground-error',message:event.message},'*')});"+safeJs+"</script></body></html>";
  preview.srcdoc=source;
  if(previewStatus)previewStatus.textContent="Preview updated";
}
runButton?.addEventListener("click",runPreview);
resetButton?.addEventListener("click",()=>{if(htmlEditor)htmlEditor.value=defaults.html;if(cssEditor)cssEditor.value=defaults.css;if(jsEditor)jsEditor.value=defaults.js;runPreview();if(previewStatus)previewStatus.textContent="Sample restored"});
window.addEventListener("message",event=>{if(event.data?.type==="portfolio-playground-error"&&previewStatus)previewStatus.textContent="Preview error: "+String(event.data.message).slice(0,100)});
runPreview();
