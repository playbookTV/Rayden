import{j as e}from"./jsx-runtime-u17CrQMm.js";import{A as a,a as p}from"./Avatar-BvmkuJdv.js";import"./iframe-g5PiM8Jh.js";import"./preload-helper-PPVm8Dsz.js";import"./cn-C8nBGPD0.js";import"./resolveIcon-B4eesLNI.js";import"./Icon-CxPrjGB-.js";const j={title:"Components/Avatar",component:a,tags:["autodocs"],argTypes:{type:{control:"select",options:["image","icon","initials"]},size:{control:"select",options:["xs","sm","md","lg","xl","2xl"]},status:{control:"select",options:["none","online","offline","verified"]}}},t="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=face",r={args:{type:"image",size:"md",status:"none",src:t,alt:"User avatar"}},i={render:()=>e.jsx("div",{className:"flex items-end gap-3",children:["xs","sm","md","lg","xl","2xl"].map(s=>e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx(a,{type:"image",size:s,src:t}),e.jsx("span",{className:"text-caption-xs text-grey-500",children:s})]},s))})},n={render:()=>e.jsx("div",{className:"flex items-end gap-3",children:["xs","sm","md","lg","xl","2xl"].map(s=>e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx(a,{type:"icon",size:s}),e.jsx("span",{className:"text-caption-xs text-grey-500",children:s})]},s))})},c={render:()=>e.jsx("div",{className:"flex items-end gap-3",children:["xs","sm","md","lg","xl","2xl"].map(s=>e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx(a,{type:"initials",size:s,initials:s==="xs"?"O":"OM"}),e.jsx("span",{className:"text-caption-xs text-grey-500",children:s})]},s))})},m={render:()=>e.jsx("div",{className:"flex flex-col gap-4",children:["none","online","offline","verified"].map(s=>e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("span",{className:"text-body-sm text-grey-600 w-20",children:s}),e.jsx(a,{type:"image",size:"md",status:s,src:t}),e.jsx(a,{type:"icon",size:"md",status:s}),e.jsx(a,{type:"initials",size:"md",status:s,initials:"OM"})]},s))})},l={render:()=>e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(a,{type:"icon",size:"lg",icon:"star"}),e.jsx(a,{type:"icon",size:"lg",icon:"heart"}),e.jsx(a,{type:"icon",size:"lg",icon:"bell"}),e.jsx(a,{type:"icon",size:"lg",icon:"globe"})]})},o={render:()=>e.jsx("div",{className:"flex flex-col gap-6",children:["sm","md","lg"].map(s=>e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsxs("span",{className:"text-body-sm text-grey-600",children:["Size: ",s]}),e.jsxs(p,{size:s,max:5,children:[e.jsx(a,{type:"image",src:t}),e.jsx(a,{type:"image",src:t}),e.jsx(a,{type:"image",src:t}),e.jsx(a,{type:"image",src:t}),e.jsx(a,{type:"image",src:t}),e.jsx(a,{type:"image",src:t}),e.jsx(a,{type:"image",src:t}),e.jsx(a,{type:"image",src:t})]})]},s))})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    type: "image",
    size: "md",
    status: "none",
    src: sampleImage,
    alt: "User avatar"
  }
}`,...r.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-end gap-3">
      {(["xs", "sm", "md", "lg", "xl", "2xl"] as const).map(s => <div key={s} className="flex flex-col items-center gap-1">
          <Avatar type="image" size={s} src={sampleImage} />
          <span className="text-caption-xs text-grey-500">{s}</span>
        </div>)}
    </div>
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-end gap-3">
      {(["xs", "sm", "md", "lg", "xl", "2xl"] as const).map(s => <div key={s} className="flex flex-col items-center gap-1">
          <Avatar type="icon" size={s} />
          <span className="text-caption-xs text-grey-500">{s}</span>
        </div>)}
    </div>
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-end gap-3">
      {(["xs", "sm", "md", "lg", "xl", "2xl"] as const).map(s => <div key={s} className="flex flex-col items-center gap-1">
          <Avatar type="initials" size={s} initials={s === "xs" ? "O" : "OM"} />
          <span className="text-caption-xs text-grey-500">{s}</span>
        </div>)}
    </div>
}`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      {(["none", "online", "offline", "verified"] as const).map(status => <div key={status} className="flex items-center gap-3">
          <span className="text-body-sm text-grey-600 w-20">{status}</span>
          <Avatar type="image" size="md" status={status} src={sampleImage} />
          <Avatar type="icon" size="md" status={status} />
          <Avatar type="initials" size="md" status={status} initials="OM" />
        </div>)}
    </div>
}`,...m.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-3">
      <Avatar type="icon" size="lg" icon="star" />
      <Avatar type="icon" size="lg" icon="heart" />
      <Avatar type="icon" size="lg" icon="bell" />
      <Avatar type="icon" size="lg" icon="globe" />
    </div>
}`,...l.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-6">
      {(["sm", "md", "lg"] as const).map(s => <div key={s} className="flex flex-col gap-1">
          <span className="text-body-sm text-grey-600">Size: {s}</span>
          <AvatarGroup size={s} max={5}>
            <Avatar type="image" src={sampleImage} />
            <Avatar type="image" src={sampleImage} />
            <Avatar type="image" src={sampleImage} />
            <Avatar type="image" src={sampleImage} />
            <Avatar type="image" src={sampleImage} />
            <Avatar type="image" src={sampleImage} />
            <Avatar type="image" src={sampleImage} />
            <Avatar type="image" src={sampleImage} />
          </AvatarGroup>
        </div>)}
    </div>
}`,...o.parameters?.docs?.source}}};const z=["Default","ImageSizes","IconSizes","InitialsSizes","StatusIndicators","CustomIcon","Group"];export{l as CustomIcon,r as Default,o as Group,n as IconSizes,i as ImageSizes,c as InitialsSizes,m as StatusIndicators,z as __namedExportsOrder,j as default};
