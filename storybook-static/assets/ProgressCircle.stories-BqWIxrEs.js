import{j as e}from"./jsx-runtime-u17CrQMm.js";import{P as s}from"./ProgressCircle-58p_Ejdt.js";import"./cn-C8nBGPD0.js";const c={title:"Components/ProgressCircle",component:s,tags:["autodocs"],argTypes:{value:{control:{type:"range",min:0,max:100}},size:{control:"select",options:["xs","sm","md","lg","xl"]},showText:{control:"boolean"}}},r={args:{value:50,size:"md"}},a={render:()=>e.jsxs("div",{className:"flex items-end gap-6",children:[e.jsx(s,{value:75,size:"xs"}),e.jsx(s,{value:75,size:"sm"}),e.jsx(s,{value:75,size:"md"}),e.jsx(s,{value:75,size:"lg"}),e.jsx(s,{value:75,size:"xl"})]})},l={render:()=>e.jsxs("div",{className:"flex items-center gap-6",children:[e.jsx(s,{value:0,size:"lg"}),e.jsx(s,{value:25,size:"lg"}),e.jsx(s,{value:50,size:"lg"}),e.jsx(s,{value:75,size:"lg"}),e.jsx(s,{value:100,size:"lg"})]})},o={args:{value:60,size:"lg",showText:!1}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    value: 50,
    size: "md"
  }
}`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-end gap-6">
      <ProgressCircle value={75} size="xs" />
      <ProgressCircle value={75} size="sm" />
      <ProgressCircle value={75} size="md" />
      <ProgressCircle value={75} size="lg" />
      <ProgressCircle value={75} size="xl" />
    </div>
}`,...a.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-6">
      <ProgressCircle value={0} size="lg" />
      <ProgressCircle value={25} size="lg" />
      <ProgressCircle value={50} size="lg" />
      <ProgressCircle value={75} size="lg" />
      <ProgressCircle value={100} size="lg" />
    </div>
}`,...l.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    value: 60,
    size: "lg",
    showText: false
  }
}`,...o.parameters?.docs?.source}}};const g=["Default","AllSizes","ProgressSteps","NoText"];export{a as AllSizes,r as Default,o as NoText,l as ProgressSteps,g as __namedExportsOrder,c as default};
