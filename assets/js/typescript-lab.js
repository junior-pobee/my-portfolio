let compilerPromise=null;
let compiler=null;
const runButton=document.getElementById("runTypeScript");
const resetButton=document.getElementById("resetTypeScript");
const editor=document.getElementById("typeScriptCode");
const output=document.getElementById("typeScriptOutput");
const status=document.getElementById("typeScriptStatus");
const preview=document.getElementById("typeScriptPreview");
const initial=editor?.value||"";
async function loadCompiler(){
  if(compiler)return compiler;
  if(!compilerPromise){
    compilerPromise=import("https://cdn.jsdelivr.net/npm/typescript@5.8.3/+esm").then(module=>{
      compiler=module.default||module;
      if(!compiler.transpileModule)throw new Error("TypeScript compiler API is unavailable");
      return compiler;
    }).catch(error=>{
      compilerPromise=null;
      throw error;
    });
  }
  return compilerPromise;
}
async function executeTypeScript(){
  if(!editor||!output||!status||!preview||!runButton)return;
  runButton.disabled=true;
  status.textContent=compiler?"Compiling…":"Loading TypeScript compiler…";
  output.textContent="";
  try{
    const ts=await loadCompiler();
    const result=ts.transpileModule(editor.value,{
      compilerOptions:{
        target:ts.ScriptTarget.ES2020,
        module:ts.ModuleKind.None,
        strict:true,
        removeComments:true
      },
      reportDiagnostics:true
    });
    const errors=(result.diagnostics||[]).filter(item=>item.category===ts.DiagnosticCategory.Error);
    if(errors.length){
      output.textContent=errors.map(item=>ts.flattenDiagnosticMessageText(item.messageText,"\n")).join("\n");
      status.textContent="Compilation failed";
      return;
    }
    const safeCode=result.outputText.replace(/<\/script/gi,"<\\/script");
    preview.srcdoc="<!doctype html><html><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"></head><body><script>"+safeCode+"</script></body></html>";
    output.textContent="Compilation successful. JavaScript was generated and sent to the isolated preview.";
    status.textContent="Compiled successfully";
  }catch(error){
    output.textContent=String(error);
    status.textContent="Compiler unavailable";
  }finally{
    runButton.disabled=false;
  }
}
function resetTypeScript(){
  if(editor)editor.value=initial;
  if(output)output.textContent="Sample restored. Press Compile & run to execute it.";
  if(status)status.textContent=compiler?"Compiler ready":"Compiler not loaded";
  if(preview)preview.srcdoc="";
}
runButton?.addEventListener("click",executeTypeScript);
resetButton?.addEventListener("click",resetTypeScript);
export {executeTypeScript as runTypeScript,resetTypeScript};
