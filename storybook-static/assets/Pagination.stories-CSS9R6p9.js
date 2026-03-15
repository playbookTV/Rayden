import{j as t}from"./jsx-runtime-u17CrQMm.js";import{r as p}from"./iframe-g5PiM8Jh.js";import{P as s}from"./Pagination-D3QPWdgV.js";import"./preload-helper-PPVm8Dsz.js";import"./cn-C8nBGPD0.js";import"./Icon-CxPrjGB-.js";const f={title:"Components/Pagination",component:s,tags:["autodocs"]},o=({totalPages:n=30,showPrevNext:c=!0})=>{const[i,m]=p.useState(3);return t.jsx(s,{currentPage:i,totalPages:n,onPageChange:m,showPrevNext:c})},e={render:()=>t.jsx(o,{})},r={render:()=>t.jsx(o,{showPrevNext:!1})},a={render:()=>t.jsx(o,{totalPages:5})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: () => <InteractivePagination />
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <InteractivePagination showPrevNext={false} />
}`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <InteractivePagination totalPages={5} />
}`,...a.parameters?.docs?.source}}};const v=["Default","NoPrevNext","FewPages"];export{e as Default,a as FewPages,r as NoPrevNext,v as __namedExportsOrder,f as default};
