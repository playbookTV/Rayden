import{j as e}from"./jsx-runtime-u17CrQMm.js";import{I as a,i}from"./Icon-CxPrjGB-.js";import"./iframe-g5PiM8Jh.js";import"./preload-helper-PPVm8Dsz.js";import"./cn-C8nBGPD0.js";const t=Object.keys(i),v={title:"Components/Icon",component:a,tags:["autodocs"],argTypes:{name:{control:"select",options:t},size:{control:"select",options:["xs","sm","md","lg","xl"]},variant:{control:"select",options:["outline","solid"]},color:{control:"color"}}},r={args:{name:"star",size:"lg",variant:"outline"}},l={render:()=>e.jsxs("div",{className:"flex items-end gap-4",children:[["xs","sm","md","lg","xl"].map(s=>e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx(a,{name:"star",size:s}),e.jsx("span",{className:"text-body-xs text-grey-500",children:s})]},s)),e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx(a,{name:"star",size:48}),e.jsx("span",{className:"text-body-xs text-grey-500",children:"48px"})]})]})},n={render:()=>e.jsx("div",{className:"flex items-center gap-6",children:["outline","solid"].map(s=>e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx(a,{name:"heart",size:"xl",variant:s}),e.jsx("span",{className:"text-body-xs text-grey-500",children:s})]},s))})},o={render:()=>e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(a,{name:"bell",size:"lg",color:"var(--color-primary-400)"}),e.jsx(a,{name:"bell",size:"lg",color:"var(--color-secondary-400)"}),e.jsx(a,{name:"bell",size:"lg",color:"var(--color-success-400)"}),e.jsx(a,{name:"bell",size:"lg",color:"var(--color-error-400)"}),e.jsx(a,{name:"bell",size:"lg",color:"var(--color-warning-400)"}),e.jsx(a,{name:"bell",size:"lg",color:"var(--color-grey-500)"})]})},c={render:()=>e.jsx("div",{className:"grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4",children:t.map(s=>e.jsxs("div",{className:"flex flex-col items-center gap-2 rounded-lg border border-grey-200 p-3",children:[e.jsxs("div",{className:"flex gap-2",children:[e.jsx(a,{name:s,size:"md",variant:"outline"}),e.jsx(a,{name:s,size:"md",variant:"solid",className:"text-grey-400"})]}),e.jsx("span",{className:"text-center text-caption-xs text-grey-500 break-all",children:s})]},s))})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    name: "star",
    size: "lg",
    variant: "outline"
  }
}`,...r.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-end gap-4">
      {(["xs", "sm", "md", "lg", "xl"] as const).map(s => <div key={s} className="flex flex-col items-center gap-1">
          <Icon name="star" size={s} />
          <span className="text-body-xs text-grey-500">{s}</span>
        </div>)}
      <div className="flex flex-col items-center gap-1">
        <Icon name="star" size={48} />
        <span className="text-body-xs text-grey-500">48px</span>
      </div>
    </div>
}`,...l.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-6">
      {(["outline", "solid"] as const).map(v => <div key={v} className="flex flex-col items-center gap-1">
          <Icon name="heart" size="xl" variant={v} />
          <span className="text-body-xs text-grey-500">{v}</span>
        </div>)}
    </div>
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4">
      <Icon name="bell" size="lg" color="var(--color-primary-400)" />
      <Icon name="bell" size="lg" color="var(--color-secondary-400)" />
      <Icon name="bell" size="lg" color="var(--color-success-400)" />
      <Icon name="bell" size="lg" color="var(--color-error-400)" />
      <Icon name="bell" size="lg" color="var(--color-warning-400)" />
      <Icon name="bell" size="lg" color="var(--color-grey-500)" />
    </div>
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
      {allNames.map(name => <div key={name} className="flex flex-col items-center gap-2 rounded-lg border border-grey-200 p-3">
          <div className="flex gap-2">
            <Icon name={name} size="md" variant="outline" />
            <Icon name={name} size="md" variant="solid" className="text-grey-400" />
          </div>
          <span className="text-center text-caption-xs text-grey-500 break-all">
            {name}
          </span>
        </div>)}
    </div>
}`,...c.parameters?.docs?.source}}};const f=["Default","Sizes","Variants","Colors","Gallery"];export{o as Colors,r as Default,c as Gallery,l as Sizes,n as Variants,f as __namedExportsOrder,v as default};
