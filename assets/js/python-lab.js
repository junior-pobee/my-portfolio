let runtimePromise=null;
let pyodide=null;
const runButton=document.getElementById("runPython");
const resetButton=document.getElementById("resetPython");
const editor=document.getElementById("pythonCode");
const output=document.getElementById("pythonOutput");
const status=document.getElementById("pythonStatus");
const initial=editor?.value||"";
async function loadRuntime(){
  if(pyodide)return pyodide;
  if(!runtimePromise){
    runtimePromise=import("https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.mjs").then(async module=>{
      const instance=await module.loadPyodide({indexURL:"https://cdn.jsdelivr.net/pyodide/v0.27.7/full/"});
      pyodide=instance;
      return instance;
    }).catch(error=>{runtimePromise=null;throw error});
  }
  return runtimePromise;
}
async function executePython(){
  if(!editor||!output||!status||!runButton)return;
  runButton.disabled=true;
  status.textContent=pyodide?"Running…":"Loading Python runtime…";
  output.textContent="";
  try{
    const runtime=await loadRuntime();
    let captured="";
    runtime.setStdout({batched:line=>{captured+=line+"\n"}});
    runtime.setStderr({batched:line=>{captured+=line+"\n"}});
    await runtime.runPythonAsync(editor.value);
    output.textContent=captured.trimEnd()||"Code completed without printed output.";
    status.textContent="Execution complete";
  }catch(error){
    output.textContent=String(error);
    status.textContent="Execution error";
  }finally{
    runButton.disabled=false;
  }
}
runButton?.addEventListener("click",executePython);
resetButton?.addEventListener("click",()=>{
  if(editor)editor.value=initial;
  if(output)output.textContent="Sample restored. Press Run Python to execute it.";
  if(status)status.textContent=pyodide?"Runtime ready":"Runtime not loaded";
});
