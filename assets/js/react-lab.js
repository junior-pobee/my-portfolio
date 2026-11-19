import React, { useState } from "https://esm.sh/react@19.1.0";
import { createRoot } from "https://esm.sh/react-dom@19.1.0/client?deps=react@19.1.0";

const h=React.createElement;
function ReactCounter(){
  const [count,setCount]=useState(0);
  const [active,setActive]=useState(true);
  return h("div",null,
    h("div",{className:"react-counter"},
      h("div",null,h("span",{className:"lab-loading"},"Component state"),h("div",null,h("strong",null,count))),
      h("div",{className:"react-counter-controls"},
        h("button",{type:"button","aria-label":"Decrease counter",onClick:()=>setCount(value=>value-1)},"−"),
        h("button",{type:"button","aria-label":"Increase counter",onClick:()=>setCount(value=>value+1)},"+"),
        h("button",{type:"button",onClick:()=>setCount(0)},"Reset")
      )
    ),
    h("p",{className:"react-message"},active?"The component is active. State updates are handled by React.":"The component is paused."),
    h("button",{type:"button",className:"btn btn-outline",onClick:()=>setActive(value=>!value)},active?"Pause component":"Activate component")
  );
}
const target=document.getElementById("reactLabRoot");
if(target)createRoot(target).render(React.createElement(ReactCounter));
