import{j as e}from"./jsx-runtime-u17CrQMm.js";import{P as a}from"./ProgressBar-xzLphi9O.js";import"./cn-C8nBGPD0.js";const i={title:"Components/ProgressBar",component:a,tags:["autodocs"],argTypes:{value:{control:{type:"range",min:0,max:100}},size:{control:"select",options:["sm","lg"]},showPercentage:{control:"boolean"}}},s={args:{value:50,label:"Progress",size:"lg"}},l={args:{value:75,label:"Uploading...",size:"sm"}},r={args:{value:30,label:"Uploading",metadata:"3 of 10 files",size:"lg"}},o={render:()=>e.jsxs("div",{className:"flex flex-col gap-6 w-[400px]",children:[e.jsx(a,{value:0,label:"0%",size:"lg"}),e.jsx(a,{value:25,label:"25%",size:"lg"}),e.jsx(a,{value:50,label:"50%",size:"lg"}),e.jsx(a,{value:75,label:"75%",size:"lg"}),e.jsx(a,{value:100,label:"100%",size:"lg"})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    value: 50,
    label: "Progress",
    size: "lg"
  }
}`,...s.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    value: 75,
    label: "Uploading...",
    size: "sm"
  }
}`,...l.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    value: 30,
    label: "Uploading",
    metadata: "3 of 10 files",
    size: "lg"
  }
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-6 w-[400px]">
      <ProgressBar value={0} label="0%" size="lg" />
      <ProgressBar value={25} label="25%" size="lg" />
      <ProgressBar value={50} label="50%" size="lg" />
      <ProgressBar value={75} label="75%" size="lg" />
      <ProgressBar value={100} label="100%" size="lg" />
    </div>
}`,...o.parameters?.docs?.source}}};const c=["Default","Small","WithMetadata","AllStages"];export{o as AllStages,s as Default,l as Small,r as WithMetadata,c as __namedExportsOrder,i as default};
